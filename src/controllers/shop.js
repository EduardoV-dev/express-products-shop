const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getShopProducts = async (req, res) => {
    const products = await Product.find();

    res.render('shop/products', {
        title: 'List of Products | Shop',
        products,
    });
};

exports.getCart = async (req, res) => {
    const { cart } = await User.findById({
        _id: req.user._id,
    }).populate('cart.productId');

    res.render('shop/cart', {
        title: 'Cart of Products | Shop',
        cart,
    });
};

exports.postAddItemToCart = async (req, res) => {
    const { productId } = req.body;

    await req.user.addToCart(productId);
    res.redirect('/shop/cart');
};

exports.deleteCartItem = async (req, res) => {
    const { productId } = req.body;

    await req.user.removeFromCart(productId);
    res.redirect('/shop/cart');
};

exports.getDetailedView = async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    res.render('shop/detailed', {
        title: `${product.title} | Shop`,
        product,
    });
};

exports.getOrdersView = async (req, res) => {
    const orders = (
        await Order.find({ 'user.userId': req.user._id }).populate(
            'items.productId',
        )
    ).reverse();

    res.render('shop/orders', {
        title: 'Shop | Orders',
        orders,
    });
};

exports.postOrder = async (req, res) => {
    const { cart } = req.user;

    const order = new Order({
        items: cart,
        user: {
            email: req.user.email,
            userId: req.user._id,
        },
    });

    await order.save();
    await req.user.clearCart();
    res.redirect('/shop/orders');
};
