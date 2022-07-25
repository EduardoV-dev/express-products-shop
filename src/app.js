const express = require('express');

const configEnv = require('./config/environment');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

const { renderErrorPage } = require('./controllers/error');

const sequelize = require('./lib/database');

// Database Models

const Product = require('./models/product');
const CartItem = require('./models/cart-item');
const Cart = require('./models/cart');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const User = require('./models/user');

const app = express();
configEnv(app, express);

/* Middleware for 'logging' user */

app.use((req, res, next) => {
    User.findAll()
        .then(([user]) => {
            req.user = user;

            next();
        })
        .catch(console.log);
});

app.get('/', (req, res) => res.redirect('/shop/products'));

/* Routes */

app.use(shopRouter);
app.use(adminRouter);
app.use(renderErrorPage);

// Database Relations

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
    // .sync({ force: true })
    .sync()
    .then(() => User.findAll())
    .then(([user]) => {
        if (!user)
            return User.create({ name: 'Eduardo', email: 'user@gmail.com' });

        return user;
    })
    .then((user) => user.createCart())
    .then(() => app.listen('3001'))
    .catch(console.log);
