const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const crypto = require("crypto");
const AppError = require("../utils/AppError.utils");


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

    const userData = user.toObject();
    delete userData.password;
    delete userData.refreshTokens;

    return userData;
}

const getUserById = async (id) => {
    const user = await User.findById(id).select('-password -refreshTokens');

    if (!user) {
        throw new AppError("User not found", 404);
    } 
    
    return user;
}

// Save a new refresh token
const saveRefreshToken = async (userId, token) => {
    await User.findByIdAndUpdate(userId, {
        $push: {
            refreshTokens: {
                token, createdAt: new Date()
            }
        }
    })
}

// Revoke specific refresh token
const revokeRefreshToken = async (userId, token) => {
    await User.findByIdAndUpdate(userId, {
        $pull: {
            refreshTokens: {
                token
            }
        }
    })
}

// Check for refresh token validity 
const isRefreshTokenValid = async (userId, token) => {
    const user = await User.findById(userId).select("refreshTokens");

    if (!user) return false;
    return user.refreshTokens.some(
        t => t.token === token
    )
}

// Revoke all refresh token
const revokeAllRefreshToken = async (userId) => {
    await User.findByIdAndUpdate(userId, {
        $set: {
            refreshTokens: []
        }
    })
}


module.exports =  {
    createUser,
    loginUser,
    getUserById,
    saveRefreshToken,
    revokeRefreshToken,
    isRefreshTokenValid,
    revokeAllRefreshToken
}