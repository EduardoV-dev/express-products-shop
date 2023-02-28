const { SHOP } = require('../config/views');
const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getShopProducts = async (req, res) => {
    const products = await Product.find({ userId: req.user._id });

    res.render(SHOP.PRODUCTS.VIEW, {
        title: SHOP.PRODUCTS.TITLE,
        products,
        isLoggedIn: req.session.isLoggedIn,
    });
};

exports.getCart = async (req, res) => {
    const { cart } = await User.findById({ _id: req.user._id }).populate(
        'cart.productId',
    );

    res.render(SHOP.CART.VIEW, {
        title: SHOP.CART.TITLE,
        cart,
        isLoggedIn: req.session.isLoggedIn,
    });
};

exports.postAddItemToCart = async (req, res) => {
    const { productId } = req.body;

    await req.user.addToCart(productId);
    res.redirect(SHOP.CART.PATH);
};

exports.deleteCartItem = async (req, res) => {
    const { productId } = req.body;

    await req.user.removeFromCart(productId);
    res.redirect(SHOP.CART.PATH);
};

exports.getDetailedView = async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    res.render(SHOP.DETAILED_VIEW.VIEW, {
        title: `${SHOP.DETAILED_VIEW.TITLE} ${product.title}`,
        product,
        isLoggedIn: req.session.isLoggedIn,
    });
};

exports.getOrdersView = async (req, res) => {
    const orders = (
        await Order.find({ 'user.userId': req.user._id }).populate(
            'items.productId',
        )
    ).reverse();

    res.render(SHOP.ORDERS.VIEW, {
        title: SHOP.ORDERS.TITLE,
        orders,
        isLoggedIn: req.session.isLoggedIn,
    });
};

exports.postOrder = async (req, res) => {
    const { cart } = req.user;

    const order = new Order({
        items: cart,
        user: {
            name: req.user.name,
            userId: req.user._id,
        },
    });

    await order.save();
    await req.user.clearCart();

    res.redirect(SHOP.ORDERS.PATH);
};
