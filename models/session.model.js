const mongoose =  require("mongoose");

const sessionSchema = new mongoose.Schema({
    session: {
        type: String,
        required: true,
        unique: true,
        trim: true
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
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Session', sessionSchema);