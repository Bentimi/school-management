const mongoose =  require("mongoose");

const departmentSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true,
        trim: true
    },
    faculty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Department', departmentSchema);