const mongoose =  require("mongoose");

const facultySchema = new mongoose.Schema({
    faculty: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Faculty', facultySchema);