const bcrypt = require('bcryptjs');

const User = require('../models/user');
const mailer = require('../lib/email');

exports.getLoginPage = (req, res) => {
    res.render('auth/login', {
        title: 'Login | Auth',
        errorMessage: req.flash('login-error').at(0) ?? null,
    });
};

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.trim() });

        if (!user) {
            req.flash(
                'login-error',
                'There is no user with the provided email',
            );
            return res.redirect('/auth/login');
        }

        const doPasswordsMatch = await bcrypt.compare(
            password.trim(),
            user.password,
        );

        if (!doPasswordsMatch) {
            req.flash('login-error', 'Invalid password');
            return res.redirect('/auth/login');
        }

        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(() => res.redirect('/'));
    } catch (error) {
        console.error(error);
        return error;
    }
};

exports.postLogout = (req, res) => req.session.destroy(() => res.redirect('/'));

exports.getSignupPage = (req, res) =>
    res.render('auth/signup', {
        title: 'Signup | Auth',
        errorMessage: req.flash('sign-up-error').at(0) ?? null,
    });

exports.postSignup = async (req, res) => {
    try {
        const { email, password } = req.body;
        const trimmedEmail = email.trim();
        const userWithProvidedEmail = await User.findOne({
            email: trimmedEmail,
        });

        if (userWithProvidedEmail) {
            req.flash('sign-up-error', 'The email is already being used');
            return res.redirect('/auth/signup');
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 12);

        new User({
            cart: [],
            email: trimmedEmail,
            password: hashedPassword,
        }).save();

        mailer.send({
            html: `<h1>You have created an account successfully!</h1>`,
            subject: 'Account Created',
            to: trimmedEmail,
        });

        return res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        return error;
    }
};
