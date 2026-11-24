const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/department.controller");
const departmentData = require("../validations/department.validation");

const csrfProtection = require("../middleware/csrf.middleware");
const passport = require("../config/passport.config");

const isAuth = passport.authenticate('jwt', { session: false });

// Routes
router.post('/add', csrfProtection, isAuth, departmentData.addDepartment, departmentController.add_Department);

module.exports = router;