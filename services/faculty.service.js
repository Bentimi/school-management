const User = require('../models/user.model');
const Faculty = require('../models/faculty.model');
const AppError = require('../utils/AppError.utils');

const addFaculty = async (userId, data) => {
    const userAuth = await User.findById(userId);
    if (!userAuth) {
        throw new AppError("User not found", 404)
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


}

module.exports = {
    addFaculty
}