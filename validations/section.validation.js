const joi = require("joi");
const { validate } = require("../middleware/validate.middleware");

const addSectionSchema = joi.object({
    section: joi.string().trim().required(),
    endDate: joi.date().required(),
    startDate: joi.date().required()
})

module.exports = {
    addSection: validate(addSectionSchema)
}