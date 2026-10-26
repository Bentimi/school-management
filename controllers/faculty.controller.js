const facultyService = require('../services/faculty.service');

const add_faculty = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = req.body;

        const result = await facultyService.addFaculty(userId, data)
        res.status(201).json({
            status: 'Success',
            message: 'Faculty added successfully',
            result
        })
    } catch (e) {
        next (e)
    }
}

module.exports = {
    add_faculty
}