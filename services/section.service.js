const User = require("../models/user.model");
const Section = require("../models/section.model");
const AppError = require("../utils/AppError.utils");

const createSection = async (userId, data) => {
    if (!userId) {
        throw new AppError("Unauthorizd user", 401);
    }

    if (!data.section || !data.endDate || !data.startDate) {
        throw new AppError("All fields required", 400);
    }

    const existingSection = await Section.findOne({
        section: data.section
    })

    if (existingSection) {
        throw new AppError("Section already exists", 409)
    }

    const newSection =  new Section({
        section: data.section,
        startDate: data.startDate,
        endDate: data.endDate,
        regStatus: data.regStatus || false,
        paymentStatus: data.paymentStatus || false,
        isActive: data.isActive || false,
        createdBy: userId
    })

    await newSection.save();

    return {
        section: newSection
    }

}

module.exports = {
    createSection
}