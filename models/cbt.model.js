const mongoose = require("mongoose");

const cbtSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    duration: {
        type: mongoose.Schema.Types.Decimal128,
        default: null
    },
    questionNumber: {
        type: Number,
        required: false
    },
    testType: {
        type: String,
        enum: ['test', 'exam'],
        required: true
    },
    session: {
        type: String,
        required: true
    },
    startAt: {
        type: Date,
        required: true
    },
    endAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('cbt', cbtSchema);