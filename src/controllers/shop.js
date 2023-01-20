const { SHOP } = require('../config/views');
const Product = require('../models/product');

exports.getShopProducts = async (req, res) => {
    const products = await Product.getProducts(req.user._id);

    res.render(SHOP.PRODUCTS.VIEW, {
        title: SHOP.PRODUCTS.TITLE,
        products,
    });
};

exports.getCart = async (req, res) => {
    const cart = await req.user.getCart();

    res.render(SHOP.CART.VIEW, { title: SHOP.CART.TITLE, cart });
};

exports.postAddItemToCart = async (req, res) => {
    const { productId } = req.body;
    const { title } = await Product.getProductById(productId);

    await req.user.addToCart(productId, title);
    res.redirect(SHOP.CART.PATH);
};

exports.deleteCartItem = async (req, res) => {
    const { productId } = req.body;

    await req.user.removeFromCart(productId);
    res.redirect(SHOP.CART.PATH);
};

exports.getDetailedView = async (req, res) => {
    const { productId } = req.params;
    const product = await Product.getProductById(productId);

    res.render(SHOP.DETAILED_VIEW.VIEW, {
        title: `${SHOP.DETAILED_VIEW.TITLE} ${product.title}`,
        product,
    });
};

exports.getOrdersView = async (req, res) => {
    const orders = (await req.user.getOrders()).reverse();

    res.render(SHOP.ORDERS.VIEW, {
        title: SHOP.ORDERS.TITLE,
        orders,
    });
};

exports.postOrder = async (req, res) => {
    await req.user.addOrder();
    res.redirect(SHOP.ORDERS.PATH);
};
