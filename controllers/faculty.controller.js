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
        // console.log(e)
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
        res.success(result, "Data successfully retrieved")
    } catch (e) {
        // console.log(e)
        next (e)
    }
}

const edit_faculty = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const facultyId = req.params.id;
        const data = req.body;

        // console.log(facultyId)

        const result = await facultyService.editFaculty(userId, facultyId, data);
        // console.log(result)
        res.success(result, 'Data successfully updated')
    } catch (e) {
        console.log(e)
        next (e)
    }
}

module.exports = {
    add_faculty,
    all_faculty,
    edit_faculty
}