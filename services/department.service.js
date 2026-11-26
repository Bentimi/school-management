const User = require("../models/user.model");
const Department = require("../models/department.model");
const Faculty = require("../models/faculty.model");
const AppError = require("../utils/AppError.utils");
const mongoose = require("mongoose");
const { uniqueCheck } = require("../utils/valueChecker");

const addDepartment = async (userId, data) => {
    const userAuth = await User.findById(userId);

    if (!userAuth) {
        throw new AppError("User not found", 404)
    }

    if (!userAuth.active) {
        throw new AppError("Account not activated", 403)
    }

    const notAllowedRoles  = ['student', 'lecturer', 'staff'];

    if (notAllowedRoles.includes(userAuth.role)) {
        throw new AppError("Forbidden Access", 403)
    }

    if (!data.department || !data.faculty) {
        throw new AppError("All fields required", 400)
    }

    const existingFaculty = await Faculty.findById(data.faculty);

    if (!existingFaculty) {
        throw new AppError("Faculty not found", 404);
    }

    const existingDepartment = await Department.findOne({
        department: uniqueCheck(data.department)
    })
    
    if (existingDepartment) {
        throw new AppError("Department already exists", 409)
    }

    const newDepartment = new Department({
        department: data.department,
        faculty: existingFaculty._id,
        createdBy: userId,
        isActive: data.isActive || false
    })

    await newDepartment.save();

    return {
        department: newDepartment
    }
}

const editDepartment = async (userId, departmentId, data) => {

}

// const get

module.exports = {
    addDepartment,
    editDepartment
}