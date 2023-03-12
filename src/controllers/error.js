exports.render404Page = (req, res) =>
    res.status(404).render('error/page-not-found', {
        title: 'Page not Found',
    });

// eslint-disable-next-line no-unused-vars
exports.serverErrorMiddleware = (error, req, res, next) =>
    res.status(500).render('error/server-error', {
        title: 'Something went wrong',
        isLoggedIn: req.session.isLoggedIn,
    });
