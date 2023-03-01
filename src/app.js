const express = require('express');

const { renderErrorPage } = require('./controllers/error');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const configEnv = require('./config/environment');
const database = require('./lib/database');
const shopRouter = require('./routes/shop');
const User = require('./models/user');
const isAuthenticated = require('./middlewares/routes-protection');

const app = express();
configEnv(app, express);

app.use(async (req, res, next) => {
    if (req.session.user) {
        const user = await User.findById(req.session.user._id);
        req.user = user;
    }

    next();
});
app.use((req, res, next) => {
    res.locals = {
        ...res.locals,
        csrfToken: req.csrfToken(),
        isLoggedIn: req.session.isLoggedIn,
    };

    next();
});

app.get('/', (req, res) => res.redirect('/shop/products'));

/* Routes */
app.use('/auth', authRouter);
app.use('/shop', shopRouter);
app.use('/admin', isAuthenticated, adminRouter);
app.use('/page-not-found', renderErrorPage);

database
    .connect()
    .then(() => {
        console.log('Connected!');
        app.listen('3001');
    })
    .catch(console.error);
