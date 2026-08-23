const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: false
    },
    last_name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: null
    },
      marital_status: {
        type: String,
        enum: ['married', 'single', 'divorced', 'complicated'],
        default: null
    },
    active: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['user', 'student', 'principal', 'staff', 'admin'],
        default: 'user'
    },
    department: {
        type: String,
        default: null
    },
    image: {
        type: String,
        defalut: null,
        required: false
    },
    resetToken: {
        type: String,
        default: null,
    },
    resetExpires: {
        type: Date,
        default: null,
    },
    password: {
        type: String,
        required: true
    },
    last_login: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
})

const User = mongoose.model("User", userSchema);

module.exports = User;