const express = require('express');
const configEnv = require('./config/environment');
const { admin, shop } = require('./routes');

const app = express();
configEnv(app, express);

app.get('/', (req, res) => res.redirect('/shop/products'));

/* Routes */
app.use(shop);
app.use(admin);

app.listen('3001');
