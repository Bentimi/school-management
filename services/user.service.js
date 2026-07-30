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
        password: data.password
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

    return userData;
}

module.exports =  {
    createUser,
    loginUser
}