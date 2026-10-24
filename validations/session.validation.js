const joi = require("joi");
const { validate } = require("../middleware/validate.middleware");

const addSessionSchema = joi.object({
    session: joi.string().trim().required(),
    endDate: joi.date().required(),
    startDate: joi.date().required()
})

const sessionVerify = joi.object({
    paymentStatus: joi.boolean().optional(),
    regStatus: joi.boolean().optional(),
    active: joi.boolean().optional(),
    current: joi.boolean().optional(),
})

module.exports = {
    addSession: validate(addSessionSchema),
    sessionVerification: validate(sessionVerify)
}