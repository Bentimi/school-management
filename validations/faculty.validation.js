const joi = require("joi");
const { validate } = require("../middleware/validate.middleware");

const addFacultySchema = joi.object({
    faculty: joi.string().trim().required(),
    isActive: joi.boolean().optional(),
})

const sessionVerify = joi.object({
    paymentStatus: joi.boolean().optional(),
    regStatus: joi.boolean().optional(),
    active: joi.boolean().optional(),
    current: joi.boolean().optional(),
})

module.exports = {
    addfaculty: validate(addFacultySchema),
    sessionVerification: validate(sessionVerify)
}