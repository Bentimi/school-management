const User = require("../models/user.model");
const BlacklistedToken = require("../models/blacklist.model");
const RefreshToken = require("../models/refreshToken.model");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const crypto = require("crypto");
const AppError = require("../utils/AppError.utils");
const hashedToken = require("../utils/hash.utils");
const mongoose = require("mongoose");


dotenv.config();

// Create or Register user
const createUser = async (data) => {
    if (!data.first_name || !data.last_name) {
        throw new AppError("All fields required", 400)
    }

    const existingEmail = await User.findOne({
        email: data.email
    })

    if (existingEmail) {
        throw new AppError("Email already exists", 409)
    }


    const hashedPwd = await bcrypt.hash(data.password, 10)

    const newUser = new User({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: hashedPwd
    })

    await newUser.save();

    const user = newUser.toObject();
    delete user.password;
    delete user.resetToken;
    delete user.resetExpires;

    return user;
}


// Login user
const loginUser = async (data) => {

    const { credentials, password } = data;

    if (!credentials || !password) {
        throw new AppError("All fields required", 400)
    }

    const user = await User.findOne({
        $or: [
            { email: credentials },
            { first_name: credentials }
        ]
    })

    if (!user) {
        throw new AppError("Invalid credentials", 404)
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new AppError("Invalid credentials", 404)
    }

    const updateUserLogin = await User.findByIdAndUpdate(
        user._id,
        {
            last_login: new Date()
        }
    )

    const userData = user.toObject();
    delete userData.password;
    delete userData.refreshTokens;

    return userData;
}

// User profile
const userProfile = async (userId) => {
    const user = await User.findById(userId).select('-password -refreshTokens');

    if (!user) {
        throw new AppError("User not found", 404);
    } 
    
    return user;
}

// Save a new refresh token
const saveRefreshToken = async (userId, token) => {
    const hashed = hashedToken(token)
    const newToken = new RefreshToken({
        user: userId,
        token: hashed
    });
    console.log(newToken)
    await newToken.save();
    return newToken;
}

// Revoke specific refresh token
const revokeRefreshToken = async (userId, token) => {
    const hashed = hashedToken(token);
    const result = await RefreshToken.deleteOne({
        user: userId,
        token: hashed
    })
    return result.deletedCount > 0;
}

// Check for refresh token validity 
const isRefreshTokenValid = async (userId, token) => {
    const hashed = hashedToken(token);
    const result = await RefreshToken.findOne({
        user: userId,
        token: hashed
    })
    return result;
}

// Revoke all refresh token
const revokeAllRefreshToken = async (userId) => {
    await RefreshToken.deleteMany({ user: userId })
}

// Revoke other refresh token
const revokeOtherRefreshToken = async (userId, token) => {
    const hashed = hashedToken(token);
    await RefreshToken.deleteMany({ 
        user: userId,
        token: { $ne: hashed }
     })
}

// Blacklist an access token
const blacklistToken = async (jti, exp) => {
    const expiresAt = new Date(exp * 1000);

    await BlacklistedToken.create({
        jti,
        expiresAt
    });
};

// check if an access token is blacklisted
const isTokenBlacklisted = async (jti) => {
    const token = await BlacklistedToken.findOne({ jti });
    return token;
};

// Change Passowrd
const changePassword = async (userId, data) => {

    if (!userId) {
        throw AppError("Unauthorized User", 401)
    }

    const user = await User.findById(userId)

    if (!user) {
        throw AppError("User not found", 404)
    }

    if (!data.password || !data.newPassword) {
        throw AppError("All fields required", 400)
    }

    // Compare old and new passwords
    const comaparePassword = await bcrypt.compare(data.password, user.password)

    if (!comaparePassword) {
        throw new AppError("Old password do not match", 400)
    }

    const isMatch = await bcrypt.compare(data.newPassword, user.password)

    if (!isMatch) {
        throw new AppError("New and old passwords cannot be the same", 400)
    }

    // New hashed password
    const hashedPwd = await bcrypt.hash(data.newPassword, 10)

    // Update password
    const updatedPassword =  await User.findByIdAndUpdate(
        user._id,
        {
            password: hashedPwd
        }
    )

    await updatedPassword.save();

    const result = updatedPassword.toObject();
    delete result.password;
    delete result.refreshTokens;
    delete result.resetExpires;

    return {
        user: result
    }
}

// Forget password
const forgetPassword = async (data) => {
    if (!data.email) {
        throw new AppError("Email is required", 400);
    }

    const existingUser = await User.findOne({
        email: data.email
    }).select('-password')
    if(!existingUser) {
        throw new AppError("Invalid email", 404)
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = hashedToken(resetToken);

    existingUser.resetToken = hashedResetToken;
    existingUser.resetExpires = new Date(Date.now() + 30 * 60 * 1000);

    await existingUser.save();
    const result = existingUser.toObject();
    delete result.password;
    delete result.refreshTokens;
    delete result.resetExpires;

     const resetUrl = `${process.env.FRONTEND_URL}/account/reset-password?token=${resetToken}`;

    return {
        user: result,
        link: resetUrl
    }
}

const resetPassword = async (token, data) => {
    const hashToken = hashedToken(token);
    
    const existingToken = await User.findOne({ 
        resetToken: hashToken,
        resetExpires:{ $gt: Date.now() }
    });

    if (!exisitngToken) {
        throw new AppError("Invalid or expired reset token", 400)
    }

    if (!data.newPassword) {
        throw new AppError("All fields are required", 400);
    }

    const isMatch = await bcrypt.compare(data.newPassword, existingToken.password)

    if (!isMatch) {
        throw new AppError("New password cannot be the same as old", 400)
    }

    // New hashed password
    const hashedPwd = await bcrypt.hash(data.newPassword, 10)

    // Update password
    const updatedPassword =  await User.findByIdAndUpdate(
        existingToken._id,
        {
            password: hashedPwd,
            resetToken: null,
            resetExpires: null
        },
        {
            new: true,
            runValidators: true
        }
    )

    const user = updatedPassword.toObject();
    delete user.password;
    delete user.refreshTokens;
    delete user.resetExpires;

    return user
}

// Soft user delete
const userDelete = async (userId, targetId) => {
    if (!userId) {
        throw new AppError("Unauthorized user", 401);
    }

    
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
        throw new AppError("Invalid taget Id", 400);
    }
    
    const user = await User.findById(targetId).select('-password -resetToken -resetExpires');
    if (!user) {
        throw new AppError("User not found", 404);
    }

    let status;
    if (!user.active) {
        status = true;
    } else {
        if ((user.role !== "admin") || (String(userId) !== String(targetId))) {
            throw new AppError("Forbidden access", 403);
        }

        status = false;
    }

    user.active = status;
    await user.save()
    return user;

} 

module.exports =  {
    createUser,
    loginUser,
    userProfile,
    saveRefreshToken,
    revokeRefreshToken,
    isRefreshTokenValid,
    revokeAllRefreshToken,
    revokeOtherRefreshToken,
    blacklistToken,
    isTokenBlacklisted,
    changePassword,
    forgetPassword,
    resetPassword,
    userDelete
}