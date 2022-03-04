const express = require('express');
const configEnv = require('./config/environment');
const { admin, shop } = require('./routes');

const app = express();
configEnv(app, express);

app.get('/', (req, res) => res.redirect('/shop/products'));
app.use('/shop', shop);
app.use('/admin', admin);

app.listen('3001');
