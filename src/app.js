const express = require('express');

const configEnv = require('./config/environment');
const database = require('./lib/database');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const { renderErrorPage } = require('./controllers/error');
const User = require('./models/user');

const app = express();
configEnv(app, express);

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('63cc5165778a976c6b0e504b');
        req.user = user;

        next();
    } catch (error) {
        console.error(error);
    }
});

app.get('/', (req, res) => res.redirect('/shop/products'));

/* Routes */
app.use(shopRouter);
app.use(adminRouter);
app.use(renderErrorPage);

database
    .connect()
    .then(() => User.findOne())
    .then(user => {
        if (user) return Promise.resolve('');

        const newUser = new User({
            name: 'Eduardo',
            email: 'email@email.com',
            cart: [],
        });

        return newUser.save();
    })
    .then(() => {
        console.log('Connected!');
        app.listen('3001');
    })
    .catch(console.error);
