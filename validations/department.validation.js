const joi = require("joi");
const { validate } = require("../middleware/validate.middleware");

const addDepartmentValidation = joi.object({
    department: joi.string().trim().required(),
    faculty: joi.string().trim().required(),
    isActive: joi.boolean().optional()
})

module.exports = {
    addDepartment: validate(addDepartmentValidation)
}