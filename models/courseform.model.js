const mongoose =  require("mongoose");

const courseFormSchema = new mongoose.Schema({
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    },
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
    level: {
        type: Number,
        required: true,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('CourseForm', courseFormSchema);