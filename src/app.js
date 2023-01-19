const express = require('express');
const MongoDB = require('mongodb');

const configEnv = require('./config/environment');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const { renderErrorPage } = require('./controllers/error');
const database = require('./lib/database');

const app = express();
configEnv(app, express);

app.get('/', (req, res) => res.redirect('/shop/products'));

app.use(async (req, res, next) => {
    const db = database.getDb();
    const user = await db.collection('users').findOne({
        _id: new MongoDB.ObjectId('63c9c36f785ed725a799654f'),
    });
    req.user = user;

    next();
});

/* Routes */
app.use(shopRouter);
app.use(adminRouter);
app.use(renderErrorPage);

database.connectToDatabase();
app.listen('3001');
