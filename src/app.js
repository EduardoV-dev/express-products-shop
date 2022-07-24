const express = require('express');
const configEnv = require('./config/environment');
const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const { renderErrorPage } = require('./controllers/error');

const app = express();
configEnv(app, express);

app.get('/', (req, res) => res.redirect('/shop/products'));

/* Routes */

app.use(shopRouter);
app.use(adminRouter);
app.use(renderErrorPage);

app.listen('3001');
