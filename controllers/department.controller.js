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
        next (e);
    }
}

module.exports = {
    add_Department
}