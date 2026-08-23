const express = require("express");
const router = express.Router();

const sectionController = require("../controllers/section.controller");
const validatedData = require("../utils/userDataValidation.utils")

const csrfProtection = require("../middleware/csrf.middleware");
const passport = require("../config/passport.config");

const isAuth = passport.authenticate('jwt', { session: false });

// Routes
router.post('/create-section', csrfProtection, isAuth, sectionController. create_Section)

module.exports = router;