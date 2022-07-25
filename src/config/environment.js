const path = require('path');
const HandleBars = require('handlebars');
const { engine } = require('express-handlebars');
const {
    allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const hbsConfig = {
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '..', 'views', 'layouts'),
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(HandleBars),
};

module.exports = (app, express) => {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, '..', 'public')));
    app.engine('hbs', engine(hbsConfig));
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, '..', 'views'));
};
