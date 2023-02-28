const views = require('../config/views');
const User = require('../models/user');

exports.getLoginPage = (req, res) => {
    res.render(views.AUTH.LOGIN.VIEW, {
        title: views.AUTH.LOGIN.TITLE,
        isLoggedIn: req.session.isLoggedIn,
    });
};

exports.postLogin = async (req, res) => {
    try {
        const user = await User.findById('63cc5165778a976c6b0e504b');

        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(() => res.redirect('/'));
    } catch (error) {
        console.error(error);
    }
};

exports.postLogout = (req, res) => req.session.destroy(() => res.redirect('/'));
