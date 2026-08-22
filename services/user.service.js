const User = require("../models/user.model");
const BlacklistedToken = require("../models/blacklist.model");
const RefreshToken = require("../models/refreshToken.model");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const crypto = require("crypto");
const AppError = require("../utils/AppError.utils");
const hashedToken = require("../utils/hash.utils");


dotenv.config();


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

    return user;
}


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
        throw new AppError("Invalid credentials", 401)
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new AppError("Invalid credentials", 401)
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

const userProfile = async (id) => {
    const user = await User.findById(id).select('-password -refreshTokens');

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

module.exports =  {
    createUser,
    loginUser,
    userProfile,
    saveRefreshToken,
    revokeRefreshToken,
    isRefreshTokenValid,
    revokeAllRefreshToken,
    blacklistToken,
    isTokenBlacklisted
}