const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const validatedData = require("../utils/userDataValidation.utils")

const passport = require("../config/passport.config");

router.post('/register', validatedData.validatedUserSchema, userController.create_User);
router.post('/login', validatedData.validatedLoginSchema, userController.login_User);
router.get('/user-profile', passport.authenticate('jwt', { session: false }), userController.get_UserById);



module.exports = router;