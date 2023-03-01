const isAuthenticated = (req, res, next) => {
    if (!req.session.isLoggedIn) return res.redirect('/auth/login');
    return next();
};

module.exports = isAuthenticated;
