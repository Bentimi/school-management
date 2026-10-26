const express = require("express");
const router = express.Router();
const facultyController = require('../controllers/faculty.controller');
const facultyData = require('../validations/faculty.validation')

const csrfProtection = require("../middleware/csrf.middleware");
const passport = require("../config/passport.config");

const isAuth = passport.authenticate('jwt', { session: false });

// Routes
router.post('/create', csrfProtection, isAuth, facultyData.addfaculty, facultyController.add_faculty);
router.get('/', csrfProtection, isAuth, facultyController.all_faculty);


module.exports = router;