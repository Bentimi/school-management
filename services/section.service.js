const User = require("../models/user.model");
const Section = require("../models/section.model");
const AppError = require("../utils/AppError.utils");
const mongoose = require("mongoose");

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
    await newSection.populate('createdBy', 'first_name last_name email');

    return {
        section: newSection
    }
}

const updateSection = async (userId, sectionId, data) => {
    if (!userId) {
        throw new AppError("Unauthorized user", 401);
    }

    const user =  await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404)
    }

    if (!user.role === 'admin') {
        throw new AppError("Forbidden Access", 403)
    }

    if (!data.section || !data.startDate || !data.endDate) {
        throw new AppError("All fields required", 400);
    }

    const section = await Section.findById(sectionId);
    if (!section) {
        throw new AppError("Data not found", 404);
    }

    const updatedData = await Section.findByIdAndUpdate(
        sectionId,
        {
            section: data.section,
            endDate: data.endDate,
            startDate: data.startDate,
            lastUpdatedBy: userId
        },
        {
            new: true,
            runValidators: true
        }
    )
    .populate('lastUpdatedBy', 'first_name last_name email')
    .populate('createdBy', 'first_name last_name email')
    
    if (!updatedData) {
        throw new AppError("Section not found", 404)
    }

    return {
        section: updatedData
    }
}

const getSection = async (userId, sectionId) => {
    if (!userId) {
        throw new AppError("Unauthenticated user", 401)
    }

    const user = await User.findById(userId);
    if (!user.role === "admin") {
        throw new AppError("Forbidden Access", 403)
    }

    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
        throw new AppError('Invalid section Id', 400)
    }

    const section = await Section.findById(userId)
    .populate('lastUpdatedBy', 'first_name last_name email')
    .populate('createdBy', 'first_name last_name email')

    if (!section) {
        throw new AppError("Data not found", 404)
    }

    return section;
}

const deleteSection = async (userId, sectionId) => {
    if (!userId) {
        throw new AppError("Unauthorized User", 401);
    }

    const userAuth = await User.findById(userId);
    if (!userAuth) {
        throw new AppError("Unauthorized User", 401);
    }

    if (!userAuth.role === 'admin') {
        throw new AppError("Forbidden access", 403);
    }

    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
        throw new AppError('Invalid section Id', 400)
    }

    const deletedSection = await Section.findOneAndDelete(sectionId);
    if (!deletedSection) {
        throw new AppError("Data not found", 404)
    }
    return deletedSection;
}

const allSection = async (userId, pageSize, page) => {
    if (!userId) {
        throw new AppError("Unauthorized User", 401);
    }

    const userAuth = await User.findById(userId);
    if (!userAuth) {
        throw new AppError("Unauthorized User", 401);
    }

    if (!userAuth.role === 'admin') {
        throw new AppError("Forbidden access", 403);
    }

    if (pageSize > 100) {
        pageSize = 100
    }

    const sections = await Section.find()
    .populate("lastUpdatedBy", "first_name last_name email")
    .populate("createdBy", "first_name last_name email")
    .sort({ updatedAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean()

    return sections;
}

module.exports = {
    createSection,
    updateSection,
    getSection,
    deleteSection,
    allSection
}