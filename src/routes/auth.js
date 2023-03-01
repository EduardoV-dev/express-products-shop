const express = require('express');
const controller = require('../controllers/auth');

const router = express.Router();

router.get('/login', controller.getLoginPage);
router.post('/login', controller.postLogin);
router.post('/logout', controller.postLogout);

router.get('/signup', controller.getSignupPage);
router.post('/signup', controller.postSignup);

module.exports = router;
