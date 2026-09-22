const joi = require("joi");
const { validate } = require("../middleware/validate.middleware");

const addSessionSchema = joi.object({
    Session: joi.string().trim().required(),
    endDate: joi.date().required(),
    startDate: joi.date().required()
})

module.exports = {
    addSession: validate(addSessionSchema)
}