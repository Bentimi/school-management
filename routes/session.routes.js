const express = require("express");
const router = express.Router();

const sessionController = require("../controllers/session.controller");
const sessionData = require("../validations/session.validation");

const csrfProtection = require("../middleware/csrf.middleware");
const passport = require("../config/passport.config");

const isAuth = passport.authenticate('jwt', { session: false });

// Routes
router.post('/create', csrfProtection, isAuth, sessionData.addSession, sessionController. create_Session);
router.put('/:sessionId', csrfProtection, isAuth, sessionData.addSession, sessionController.update_Session);
router.get('/:sessionId', isAuth, csrfProtection, sessionController.get_Session);
router.delete('/:sessionId', isAuth, csrfProtection, sessionController.delete_Session);
router.patch('/:sessionId', isAuth, csrfProtection, sessionController.session_status);
router.get('/', isAuth, csrfProtection, sessionController.all_Session);
router.put('/verify/:sessionId', isAuth, csrfProtection, sessionData.sessionVerification, sessionController.session_verification);

module.exports = router;