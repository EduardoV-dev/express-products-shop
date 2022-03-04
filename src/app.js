const express = require('express');
const configEnv = require('./config/environment');
const { VIEWS } = require('./config/routes');

const app = express();
configEnv(app, express);

app.get(VIEWS.SHOP.HOME.PATH, (req, res, next) => {
  res.render(VIEWS.SHOP.HOME.FILE, { title: 'Tienda' });
});

app.listen('3001');
