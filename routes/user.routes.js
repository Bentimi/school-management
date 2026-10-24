const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const validatedData = require("../validations/user.validation")

const csrfProtection = require("../middleware/csrf.middleware");
const passport = require("../config/passport.config");

const isAuth = passport.authenticate('jwt', { session: false })

// Routes
router.post('/register', validatedData.validatedUserSchema, userController.create_User);
router.post('/login', validatedData.validatedLoginSchema, userController.login_User);
router.post('/forget-password', validatedData.validatedForgetPasswordSchema, userController.forget_Password);
router.patch('/reset-password', validatedData.validatedResetPasswordSchema,userController.reset_Password);
router.post('/refresh', userController.refresh_Token);
router.get('/user-profile', csrfProtection, isAuth, userController.user_Profile);
router.post('/logout', csrfProtection, isAuth, userController.logout_User);
router.put('/change-password', csrfProtection, isAuth, validatedData.validatedChangePasswordSchema, userController.change_Password);
router.delete('/delete/:id', csrfProtection, isAuth, userController.user_Delete);
router.get('/users', csrfProtection, isAuth, userController.get_Users);
router.patch('/:id', csrfProtection, isAuth, validatedData.validatedEditUserSchema, userController.edit_User);
router.get('/profile/:id', csrfProtection, isAuth, userController.users_Profile);
router.post('/add-user/:status', csrfProtection, isAuth, validatedData.validatedAddUserSchema, userController.add_user),
router.put('/role/:id', csrfProtection, isAuth, validatedData.validatedUserRole, userController.role_allocation)

module.exports = router;