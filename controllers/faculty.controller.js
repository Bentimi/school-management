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

const all_faculty = async (req, res, next) => {
    try {

        const userId = req.user.id;
        const pageSize = parseInt(req.query.pageSize) > 1 ? parseInt(req.query.pageSize) : 10;
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || '';

        const result = await facultyService.allFaculty(userId, page, pageSize, search);
        res.success("Data successfully retrieved", result)
    } catch (e) {
        next (e)
    }
}

module.exports = {
    add_faculty,
    all_faculty
}