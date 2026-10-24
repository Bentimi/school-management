const joi = require("joi");
const { validate } = require("../middleware/validate.middleware")

const userSchema = joi.object({
    first_name: joi.string().trim().required(),
    last_name : joi.string().trim().required(),
    email : joi.string().email().trim().required(),
    password: joi.string().trim()
    .min(8)
    .max(30)
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'))
    .messages({
      'string.pattern.base': 'Password must include uppercase, lowercase, number, and a special character (!@#$%^&*)',
    })
})

const loginSchema = joi.object({
    credentials: joi.string().trim().required(),
    password: joi.string().trim().required()
})

const changePasswordSchema = joi.object({
    password: joi.string().trim().min(8).max(30).required(),

    newPassword: joi.string().trim()
    .min(8)
    .max(30)
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'))
    .messages({
      'string.pattern.base': 'Password must include uppercase, lowercase, number, and a special character (!@#$%^&*)',
    })
})

const forgetPasswordSchema = joi.object({
   email : joi.string().email().trim().required()
})

const resetPasswordSchema = joi.object({
   newPassword: joi.string().trim()
    .min(8)
    .max(30)
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'))
    .messages({
      'string.pattern.base': 'Password must include uppercase, lowercase, number, and a special character (!@#$%^&*)',
    })
})

const editUserSchema = joi.object({
    first_name: joi.string().trim().max(30).required(),
    last_name : joi.string().trim().max(30).required(),
    email : joi.string().email().trim().max(500).optional(),
    phone_number : joi.string().trim().optional(),
    dob : joi.date().optional(),
    state_Of_Origin : joi.string().trim().max(20).optional(),
    next_Of_Kin : joi.string().trim().optional(),
    next_Of_Kin_Number : joi.string().trim().optional(),
    next_Of_Kin_Relationship : joi.string().valid('brother', 'father', 'mother', 'sister', 'others').optional(),
    gender: joi.string().valid('male', 'female', 'other').required(),
    marital_status: joi.string()
    .valid('married', 'single', 'divorced', 'complicated').required(),
    country: joi.string()
    .valid('Nigeria', 'Ghana', 'Niger', 'Others').required(),
    address: joi.string().trim().max(250).optional()

    
})

module.exports = {
    validatedUserSchema : validate(userSchema),
    validatedLoginSchema : validate(loginSchema),
    validatedChangePasswordSchema : validate(changePasswordSchema),
    validatedForgetPasswordSchema : validate(forgetPasswordSchema),
    validatedResetPasswordSchema : validate(resetPasswordSchema),
    validatedEditUserSchema: validate(editUserSchema)
}