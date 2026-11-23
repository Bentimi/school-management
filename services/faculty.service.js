const User = require('../models/user.model');
const Faculty = require('../models/faculty.model');
const AppError = require('../utils/AppError.utils');
const mongoose = require('mongoose');

const addFaculty = async (userId, data) => {
    const userAuth = await User.findById(userId);
    if (!userAuth) {
        throw new AppError("User not found", 404)
    }

    if (!userAuth.active) {
        throw new AppError("Account not activated", 403)
    }

    if (userAuth.role !== 'admin') {
        throw new AppError("Forbidden Access", 403)
    }

    const existingFaculty  = await Faculty.findOne({
        faculty: data.faculty
    })

    if (existingFaculty) {
        throw new AppError("Faculty already exists", 409    )
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

    if (!userAuth.active) {
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

    const faculty = await Faculty.find(queryFilter)
    .populate("lastUpdatedBy", "first_name last_name email")
        .populate("createdBy", "first_name last_name email")
        .sort({ updatedAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean()
        const total = await Faculty.countDocuments(queryFilter)
        const activeTotal = await Faculty.countDocuments({
            ...queryFilter,
            isActive:true
        })
        const inActiveTotal = await Faculty.countDocuments({
            ...queryFilter,
            isActive:false
        })
        console.log(inActiveTotal)
    
        return { faculty, total, activeTotal, inActiveTotal};
}

const editFaculty = async (userId, facultyId, data) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new AppError('Unauthorized User', 401)
    }

    if (!mongoose.Types.ObjectId.isValid(facultyId)) {
            throw new AppError('Invalid faculty', 400)
    }

        const userAuth = await User.findById(userId);

    if (!userAuth) {
        throw new AppError('User not found', 404);
    }

    if (!userAuth.active) {
        throw new AppError('Account not activated', 403);
    }


    const allowedRole = ['student', 'user', 'aspirant']

    if (allowedRole.includes(userAuth.role)) {
        throw new AppError('Forbidden Access', 403);
    }

    if (!data.faculty) {
        throw new AppError("All fields required", 400);
    }

    const existingFaculty = await Faculty.findByIdAndUpdate(
        facultyId, 
        {
            ...data,
            lastUpdatedBy: userAuth._id
        }, {
            returnDocument: "after"
        }
    )
    .populate('lastUpdatedBy', 'first_name last_name email')
    .populate('createdBy', 'first_name last_name email')

    if (!existingFaculty) {
        throw new AppError("Faculty do not exist", 404)
    }

    return {
        faculty: existingFaculty
    }

}

module.exports = {
    addFaculty,
    allFaculty,
    editFaculty
}