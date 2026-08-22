const mongoose =  require("mongoose");

const courseFormSchema = new mongoose.Schema({
    session: {
        type: String,
        required: true,
        unique: true
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
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('CourseForm', courseFormSchema);