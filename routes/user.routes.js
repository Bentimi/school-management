const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const validatedData = require("../utils/userDataValidation.utils")

const csrfProtection = require("../middleware/csrf.middleware");
const passport = require("../config/passport.config");

const isAuth = passport.authenticate('jwt', { session: false })

// Routes
router.post('/register', validatedData.validatedUserSchema, userController.create_User);
router.post('/login', validatedData.validatedLoginSchema, userController.login_User);
router.post('/refresh', userController.refresh_Token);
router.get('/user-profile', csrfProtection, isAuth, userController.user_Profile);
router.post('/logout', csrfProtection, isAuth, userController.logout_User);
router.post('/change-password', csrfProtection, isAuth, validatedData.validatedChangePasswordSchema,userController.change_Password);
router.post('/forget-password', csrfProtection, isAuth, validatedData.validatedForgetPasswordSchema,userController.forget_Password);
router.post('/reset-password', csrfProtection, isAuth, validatedData.validatedResetPasswordSchema,userController.reset_Password);

module.exports = router;