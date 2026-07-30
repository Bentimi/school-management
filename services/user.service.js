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

module.exports =  {
    createUser
}