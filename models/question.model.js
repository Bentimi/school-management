const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        default: null
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    option1: {
        type: String,
        default: null,
        required: false
    },
    option2: {
        type: String,
        default: null,
        required: false
    },
    option3: {
        type: String,
        default: null,
        required: false
    },
    option4: {
        type: String,
        default: null,
        required: false
    },
    answer: {
        type: String,
        default: null,
        required: true
    },
    type: {
        type: String,
        enum: ['mcq'],
        default: null,
    },
    grade: {
        type: mongoose.Schema.Types.Decimal128,
        default: 1,
        required: true
    },
    published: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Question', questionSchema);