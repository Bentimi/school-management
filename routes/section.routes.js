const express = require("express");
const router = express.Router();

const sectionController = require("../controllers/section.controller");
const sectionData = require("../validations/section.validation")

const csrfProtection = require("../middleware/csrf.middleware");
const passport = require("../config/passport.config");

const isAuth = passport.authenticate('jwt', { session: false });

// Routes
router.post('/create', csrfProtection, isAuth, sectionData.addSection, sectionController. create_Section);
router.put('/:sectionId', csrfProtection, isAuth, sectionData.addSection, sectionController.update_Section);
router.get('/:sectionId', isAuth, sectionController.get_Section);
router.delete('/:sectionId', isAuth, sectionController.delete_Section);
router.get('/', isAuth, sectionController.all_Section);

module.exports = router;