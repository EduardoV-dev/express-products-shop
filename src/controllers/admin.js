const { ADMIN, ERROR } = require('../config/views');
const Product = require('../models/product');

exports.getAdminProducts = async (req, res) => {
    const products = await Product.find({ userId: req.user._id });

    res.render(ADMIN.PRODUCTS.VIEW, {
        title: ADMIN.PRODUCTS.TITLE,
        products,
    });
};

exports.getEditProductView = async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) res.redirect(ERROR.PAGE_NOT_FOUND.PATH);

    res.render(ADMIN.FORM.VIEW, {
        title: 'Edit product',
        product,
        isUpdating: true,
    });
};

exports.getAddProductView = (req, res) =>
    res.render(ADMIN.FORM.VIEW, { title: ADMIN.FORM.TITLE, isUpdating: false });

exports.postProduct = async (req, res) => {
    const { title, imageURL, price, description } = req.body;
    const product = new Product({
        description: description.trim(),
        imageURL: imageURL.trim(),
        price: Number(price.trim()),
        title: title.trim(),
        userId: req.user._id,
    });

    await product.save();
    res.redirect(ADMIN.PRODUCTS.PATH);
};

exports.deleteProduct = async (req, res) => {
    const { productId } = req.body;

    await Product.findByIdAndDelete(productId).catch(console.error);
    res.redirect(ADMIN.PRODUCTS.PATH);
};

exports.editProduct = async (req, res) => {
    const { title, imageURL, price, description, productId } = req.body;

    await Product.findByIdAndUpdate(productId, {
        description: description.trim(),
        imageURL: imageURL.trim(),
        price: Number(price.trim()),
        title: title.trim(),
    }).catch(console.error);

    res.redirect(ADMIN.PRODUCTS.PATH);
};
