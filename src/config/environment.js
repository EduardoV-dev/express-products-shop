const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const hbsConfig = {
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '..', 'views', 'layouts'),
  extname: 'hbs',
};

module.exports = (app, express) => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.engine('hbs', engine(hbsConfig));
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, '..', 'views'));
};
