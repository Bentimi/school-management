const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    aggScore: {
        type: mongoose.Schema.Types.Decimal128,
        default: null
    },
    status: {
        type: String,
        enum: ['passed', 'failed'],
        required: true
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Record', recordSchema);