const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const mailer = require('../lib/email');
const { getFieldErrorMessageFromErrors } = require('../utils');

exports.getLoginPage = (req, res) =>
    res.render('auth/login', {
        title: 'Login | Auth',
        initialValues: {
            email: '',
            password: '',
        },
        errors: {
            form: req.flash('login-error').at(0) ?? null,
            email: null,
            password: null,
        },
    });

exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const values = errors.array();

            return res.render('auth/login', {
                title: 'Login | Auth',
                initialValues: {
                    email,
                    password,
                },
                errors: {
                    form: null,
                    email: getFieldErrorMessageFromErrors(values, 'email'),
                    password: getFieldErrorMessageFromErrors(values, 'password'),
                },
            });
        }

        const user = await User.findOne({ email: email.trim() });

        if (!user) {
            req.flash('login-error', 'There is no user with the provided email');
            return res.redirect('/auth/login');
        }

        const doPasswordsMatch = await bcrypt.compare(password.trim(), user.password);

        if (!doPasswordsMatch) {
            req.flash('login-error', 'Invalid password');
            return res.redirect('/auth/login');
        }

        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(() => res.redirect('/'));
    } catch (error) {
        return next(error);
    }
};

exports.postLogout = (req, res) => req.session.destroy(() => res.redirect('/'));

exports.getSignupPage = (req, res) =>
    res.render('auth/signup', {
        title: 'Signup | Auth',
        initialValues: {
            email: '',
            password: '',
            repeatPassword: '',
        },
        errors: {
            form: req.flash('sign-up-error').at(0) ?? null,
            email: null,
            password: null,
            repeatPassword: null,
        },
    });

exports.postSignup = async (req, res, next) => {
    try {
        const { email, password, repeatPassword } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const values = errors.array();

            return res.render('auth/signup', {
                title: 'Signup | Auth',
                initialValues: {
                    email,
                    password,
                    repeatPassword,
                },
                errors: {
                    form: null,
                    email: getFieldErrorMessageFromErrors(values, 'email'),
                    password: getFieldErrorMessageFromErrors(values, 'password'),
                    repeatPassword: getFieldErrorMessageFromErrors(values, 'repeatPassword'),
                },
            });
        }

        const accountExists = await User.findOne({
            email,
        });

        if (accountExists) {
            req.flash('sign-up-error', 'The email is already being used');
            return res.redirect('/auth/signup');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        new User({
            cart: [],
            email,
            password: hashedPassword,
        }).save();

        mailer.send({
            html: `<h1>You have created an account successfully!</h1>`,
            subject: 'Account Created',
            to: email,
        });

        return res.redirect('/auth/login');
    } catch (error) {
        return next(error);
    }
};

exports.getResetPasswordPage = (req, res) =>
    res.render('auth/reset-password', {
        title: 'Reset password | Auth',
        errorMessage: req.flash('reset-password').at(0) ?? null,
    });

const ONE_HOUR_TO_EXPIRE_IN_MS = 3_600_000;

exports.postResetPassword = async (req, res, next) => {
    try {
        const email = req.body.email.trim();
        const user = await User.findOne({ email });

        if (!user) {
            req.flash('reset-password', 'There is no account with the provided email');
            return res.redirect('/auth/reset-password');
        }

        const passwordResetToken = crypto.randomBytes(30).toString('hex');
        user.passwordReset = {
            expirationDate: Date.now() + ONE_HOUR_TO_EXPIRE_IN_MS,
            token: passwordResetToken,
        };

        user.save();
        mailer.send({
            to: email,
            html: `
                <h1>Password reset for your account in Shop.</h1>
                <h3>To reset your password, click in this 
                    <a href="http://localhost:3001/auth/reset-password/${passwordResetToken}">link</a>
                </h3>.
                <p>This link will expire in one hour.</p>
                <small>If you did not requested this email, ignore it.</small>
            `,
            subject: 'Password recovery',
        });

        return res.redirect('/auth/reset-password');
    } catch (error) {
        return next(error);
    }
};

const verifyTokenExistance = (passwordResetToken, userId) =>
    new Promise((resolve, reject) => {
        User.findOne({
            'passwordReset.token': passwordResetToken,
            'passwordReset.expirationDate': { $gte: Date.now() },
            ...(userId && { _id: userId }),
        }).then(user => {
            if (!user) reject(new Error('Token could have expired or does not exists'));
            resolve(user);
        });
    });

exports.getNewPasswordPage = async (req, res, next) => {
    try {
        const passwordResetToken = req.params.resetToken;
        const user = await verifyTokenExistance(passwordResetToken).catch(() =>
            res.redirect('/auth/reset-password'),
        );

        return res.render('auth/new-password', {
            title: 'Change password',
            userId: user._id.toString(),
            resetToken: passwordResetToken,
        });
    } catch (error) {
        return next(error);
    }
};

exports.postNewPassword = async (req, res, next) => {
    try {
        const { resetToken, userId, password } = req.body;

        const user = await verifyTokenExistance(resetToken, userId).catch(() =>
            res.redirect('/auth/reset-password'),
        );
        const hashedNewPassword = await bcrypt.hash(password.trim(), 12);

        user.password = hashedNewPassword;
        user.passwordReset = undefined;

        user.save();
        mailer.send({
            html: '<h1>You changed your password successfully!</h1>',
            subject: 'Password change',
            to: user.email,
        });
        res.redirect('/auth/login');
    } catch (error) {
        next(error);
    }
};
