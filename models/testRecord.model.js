const mongoose = require("mongoose");

const testrecordSchema = new mongoose.Schema({
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
    score: {
        type: mongoose.Schema.Types.Decimal128,
        default: null
    },
    status: {
        type: String,
        enum: ['passed', 'failed'],
        required: true
    },
    testType: {
        type: String,
        enum: ['test', 'exam'],
        required: true
    },
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('TestRecord', testrecordSchema);