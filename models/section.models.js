const mongoose =  require("mongoose");

const sectionSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    regStatus: {
        type: Boolean,
        default: false 
    },
    paymentStatus: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Section', sectionSchema);