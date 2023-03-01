const path = require('path');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');

const database = require('../lib/database');

const hbsConfig = {
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '..', 'views', 'layouts'),
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
};

module.exports = (app, express) => {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, '..', 'public')));
    app.engine('hbs', engine(hbsConfig));
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, '..', 'views'));
    app.use(flash());
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
    app.use(csurf());
};
