const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const { renderErrorPage } = require('./controllers/error');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const configEnv = require('./config/environment');
const database = require('./lib/database');
const shopRouter = require('./routes/shop');
const User = require('./models/user');

const app = express();
configEnv(app, express);

// app.use(async (req, res, next) => {
//     try {
//         if (!req.session.user) return next();

//         const user = await User.findById(req.session.user._id);
//         req.user = user;

//         return next();
//     } catch (error) {
//         console.error(error);
//         return error;
//     }
// });

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('63cc5165778a976c6b0e504b');
        req.user = user;

        next();
    } catch (error) {
        console.log(error);
    }
});

app.get('/', (req, res) => res.redirect('/shop/products'));

app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: 'shop-secret',
        store: new MongoDBStore({
            collection: 'sessions',
            uri: database.CONNECTION_STRING,
        }),
    }),
);

/* Routes */
app.use(authRouter);
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
