const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const validatedData = require("../utils/userDataValidation.utils")

router.post('register', validatedData.validatedUserSchema, userController.create_User);


module.exports = router;