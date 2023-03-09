const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getShopProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        return res.render('shop/products', {
            title: 'List of Products | Shop',
            products,
        });
    } catch (error) {
        return next(error);
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const user = await User.findById({
            _id: req.user._id,
        }).populate('cart.productId');

        return res.render('shop/cart', {
            title: 'Cart of Products | Shop',
            cart: user.cart,
        });
    } catch (error) {
        return next(error);
    }
};

exports.postAddItemToCart = async (req, res, next) => {
    try {
        const { productId } = req.body;

        req.user.addToCart(productId);
        return res.redirect('/shop/cart');
    } catch (error) {
        return next(error);
    }
};

exports.deleteCartItem = async (req, res, next) => {
    try {
        const { productId } = req.body;

        req.user.removeFromCart(productId);
        return res.redirect('/shop/cart');
    } catch (error) {
        return next(error);
    }
};

exports.getDetailedView = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);

        res.render('shop/detailed', {
            title: `${product.title} | Shop`,
            product,
        });
    } catch (error) {
        next(error);
    }
};

exports.getOrdersView = async (req, res, next) => {
    try {
        const orders = (
            await Order.find({ 'user.userId': req.user._id }).populate('items.productId')
        ).reverse();

        return res.render('shop/orders', {
            title: 'Shop | Orders',
            orders,
        });
    } catch (error) {
        return next(error);
    }
};

exports.postOrder = async (req, res, next) => {
    try {
        const { cart } = req.user;
        const order = new Order({
            items: cart,
            user: {
                email: req.user.email,
                userId: req.user._id,
            },
        });

        order.save();
        req.user.clearCart();
        return res.redirect('/shop/orders');
    } catch (error) {
        return next(error);
    }
};
