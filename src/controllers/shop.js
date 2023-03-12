const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

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

        await req.user.addToCart(productId);
        return res.redirect('/shop/cart');
    } catch (error) {
        return next(error);
    }
};

exports.deleteCartItem = async (req, res, next) => {
    try {
        const { productId } = req.body;

        await req.user.removeFromCart(productId);
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

        await order.save();
        await req.user.clearCart();
        return res.redirect('/shop/orders');
    } catch (error) {
        return next(error);
    }
};

exports.getInvoice = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate('items.productId');

        const document = new PDFDocument();

        const invoiceName = `invoice-${orderId}.pdf`;
        const invoicePath = path.join(__dirname, '..', 'data', 'invoices', invoiceName);

        document.pipe(fs.createWriteStream(invoicePath));

        res.setHeader('Content-Type', 'application/pdf'); // Previews pdf in browser
        res.setHeader('Content-Disposition', `attachment; filename="${invoiceName}"`); // Downloads pdf

        document.pipe(res);

        document.fontSize(26).text('Invoice');
        document.text('---------------------');

        let orderTotalAmount = 0;

        order.items.forEach(item => {
            orderTotalAmount += item.quantity * item.productId.price;
            document.fontSize(18).text(item.productId.title);
            document
                .fontSize(14)
                .text(
                    `Quantity: ${item.quantity}    ||    Price: ${
                        item.productId.price
                    }    ||    Total: ${item.productId.price * item.quantity}`,
                );
        });

        document.text('---------------------');
        document.text(`Order total: $${orderTotalAmount}`);

        document.end();
    } catch (error) {
        next(error);
    }
};
