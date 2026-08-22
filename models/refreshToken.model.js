const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        uinque: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
            type: Date,
            default: Date.now,
            expires: '7d'
        }
}, {
    timestamps: false,
    versionKey: false
})

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);