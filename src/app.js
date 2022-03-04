const express = require('express');
const configEnv = require('./config/environment');
const shopRouter = require('./routes/shop');

const app = express();
configEnv(app, express);

app.get('/', (req, res) => res.redirect('/shop/products'));
app.use('/shop', shopRouter);

app.listen('3001');
