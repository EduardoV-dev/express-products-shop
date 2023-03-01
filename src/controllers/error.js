exports.renderErrorPage = (req, res) => {
    res.status(404).render('error/page-not-found', {
        title: 'Page not Found',
    });
};
