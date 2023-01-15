const { SHOP } = require('../config/views');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/orders');

exports.getShopProducts = (req, res) => {
    const products = Product.getAllProducts();

    res.render(SHOP.PRODUCTS.VIEW, { title: SHOP.PRODUCTS.TITLE, products });
};

exports.getCart = (req, res) => {
    const cart = Cart.getCart();

    res.render(SHOP.CART.VIEW, { title: SHOP.CART.TITLE, cart });
};

exports.postAddItemToCart = (req, res) => {
    const { productId } = req.body;
    const { id, title } = Product.getProductById(productId);
    const cartItem = new Cart(id, title);

    cartItem.save();
    res.redirect(SHOP.CART.PATH);
};

exports.deleteCartItem = (req, res) => {
    const { productId } = req.body;

    Cart.removeFromCart(productId);
    res.redirect(SHOP.CART.PATH);
};

exports.getDetailedView = (req, res) => {
    const { productId } = req.params;
    const product = Product.getProductById(productId);

    res.render(SHOP.DETAILED_VIEW.VIEW, {
        title: `${SHOP.DETAILED_VIEW.TITLE} ${product.title}`,
        product,
    });
};

exports.getOrdersView = (req, res) => {
    const orders = Order.getOrders().reverse();

    res.render(SHOP.ORDERS.VIEW, {
        title: SHOP.ORDERS.TITLE,
        orders,
    });
};

exports.postOrder = (req, res) => {
    const order = new Order(Cart.getCart());
    order.addOrder();

    res.redirect(SHOP.ORDERS.PATH);
};
