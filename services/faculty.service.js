const User = require('../models/user.model');
const Faculty = require('../models/faculty.model');
const AppError = require('../utils/AppError.utils');

const addFaculty = async (userId, data) => {
    const userAuth = await User.findById(userId);
    if (!userAuth) {
        throw new AppError("User not found", 404)
    }

    if (!user.active) {
        throw new AppError("Account not activated", 403)
    }

    if (userAuth.role !== 'admin') {
        throw new AppError("Forbidden Access", 403)
    }

    const newFaculty = new Faculty({
        faculty: data.faculty,
        createdBy: userId,
        isActive: data.isActive
    })

    await newFaculty.save()

   return {
        faculty: newFaculty
   }
}

const allFaculty = async (userId, page, pageSize,search) => {
    const userAuth = await User.findById(userId);
    if (!userAuth) {
        throw new AppError("User not found", 404)
    }

    if (!user.active) {
        throw new AppError("Account not activated", 403)
    }

    let queryFilter = {};
    if (search) {
        const searchValue = {
            $regex: search, $options: 'i'
        };

        queryFilter = {
            $or: [
                { faculty: searchValue },
                { createdBy: searchRegex },
                { lastUpdatedBy: searchRegex }
            ]
        }
    }

    const faculty = await Faculty.find()
    .populate("lastUpdatedBy", "first_name last_name email")
        .populate("createdBy", "first_name last_name email")
        .sort({ updatedAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean()
        const total = await Session.countDocuments(queryFilter)
    
        return { faculty, total};
}

module.exports = {
    addFaculty,
    allFaculty
}