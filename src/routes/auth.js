const express = require('express');
const controller = require('../controllers/auth');

const router = express.Router();

router.get('/login', controller.getLoginPage);
router.post('/login', controller.postLogin);
router.post('/logout', controller.postLogout);

router.get('/signup', controller.getSignupPage);
router.post('/signup', controller.postSignup);

router.get('/reset-password', controller.getResetPasswordPage);
router.post('/reset-password', controller.postResetPassword);
router.get('/reset-password/:resetToken', controller.getNewPasswordPage);
router.post('/new-password', controller.postNewPassword);

module.exports = router;
