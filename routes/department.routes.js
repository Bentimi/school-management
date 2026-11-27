const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/department.controller");
const departmentData = require("../validations/department.validation");

const csrfProtection = require("../middleware/csrf.middleware");
const passport = require("../config/passport.config");

const isAuth = passport.authenticate('jwt', { session: false });

// Routes
router.post('/add', csrfProtection, isAuth, departmentData.addDepartment, departmentController.add_Department);
router.get('/', csrfProtection, isAuth, departmentController.all_Department);
router.put('/', csrfProtection, isAuth, departmentData.addDepartment, departmentController.edit_Department);

module.exports = router;