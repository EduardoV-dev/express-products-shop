const path = require('path');

exports.PRODUCTS_FILE_PATH = path.join(
    __dirname,
    '..',
    'data',
    'products.json',
);

exports.CART_FILE_PATH = path.join(__dirname, '..', 'data', 'cart.json');

exports.ORDERS_FILE_PATH = path.join(__dirname, '..', 'data', 'orders.json');
