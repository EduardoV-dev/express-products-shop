const { ERROR } = require('../config/views');

exports.renderErrorPage = (req, res) => {
    res.status(404).render(ERROR.PAGE_NOT_FOUND.VIEW, {
        title: ERROR.PAGE_NOT_FOUND.TITLE,
        isLoggedIn: req.session.isLoggedIn,
    });
};
