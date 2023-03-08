const { body } = require('express-validator');
const express = require('express');
const controller = require('../controllers/auth');

const router = express.Router();

router.get('/login', controller.getLoginPage);
router.post(
    '/login',
    [
        body('email').trim().isEmail().withMessage('Email is not valid'),
        body('password', 'Password can not be empty').trim().exists().isAlphanumeric(),
    ],
    controller.postLogin,
);

router.post('/logout', controller.postLogout);

router.get('/signup', controller.getSignupPage);
router.post(
    '/signup',
    [
        body('email').trim().isEmail().withMessage('Email is not valid'),
        body('password', 'Password should be only numbers and text, and have at least 5 characters')
            .trim()
            .isAlphanumeric()
            .isLength({ min: 5 }),
        body('repeatPassword', 'Passwords do not match')
            .trim()
            .isAlphanumeric()
            .exists()
            .custom((confirmPassword, { req }) => confirmPassword === req.body.password.trim()),
    ],
    controller.postSignup,
);

router.get('/reset-password', controller.getResetPasswordPage);
router.post('/reset-password', controller.postResetPassword);
router.get('/reset-password/:resetToken', controller.getNewPasswordPage);
router.post('/new-password', controller.postNewPassword);

module.exports = router;
