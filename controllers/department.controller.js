const departmentService = require("../services/department.service");

const add_Department = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const data = req.body;

        const result = await departmentService.addDepartment(userId, data);

        res.status(201).json({
            status: 'Success',
            message: 'Department added successfully',
            result
        })

    } catch (e) {
        console.log(e)
        next (e);
    }
}

const all_Department = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const pageSize = parseInt(req.query.pageSize) > 1 ? parseInt(req.query.pageSize) : 10;
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || '';

        const result = await departmentService.allDepartment(userId, page, pageSize, search);
        res.success(result, "Data successfully retrieved")
        
    } catch (e) {
        console.log(e)
        next (e)
    }
}
module.exports = {
    add_Department,
    all_Department
}