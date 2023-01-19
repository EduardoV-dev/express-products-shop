const { ADMIN, SHOP, ERROR } = require('../config/views');
const Product = require('../models/product');

exports.getAdminProducts = async (req, res) => {
    const products = await Product.getProducts(req.user._id);

    res.render(ADMIN.PRODUCTS.VIEW, {
        title: ADMIN.PRODUCTS.TITLE,
        products,
    });
};

exports.getEditProductView = async (req, res) => {
    const { productId } = req.params;
    const product = await Product.getProductById(productId);

    if (!product) res.redirect(ERROR.PAGE_NOT_FOUND.PATH);

    res.render(ADMIN.FORM.VIEW, {
        title: 'Edit product',
        product,
        isUpdating: true,
    });
};

exports.getAddProductView = (req, res) =>
    res.render(ADMIN.FORM.VIEW, { title: ADMIN.FORM.TITLE, isUpdating: false });

exports.postProduct = (req, res) => {
    const { title, imageURL, price, description } = req.body;
    const product = new Product(
        title.trim(),
        imageURL.trim(),
        Number(price.trim()),
        description.trim(),
        req.user._id,
    );

    product.save();
    res.redirect(SHOP.PRODUCTS.PATH);
};

exports.deleteProduct = (req, res) => {
    const { productId } = req.body;

    Product.deleteProductById(productId);
    res.redirect(ADMIN.PRODUCTS.PATH);
};

exports.editProduct = (req, res) => {
    const { title, imageURL, price, description, productId } = req.body;

    const newProduct = new Product(
        title.trim(),
        imageURL.trim(),
        Number(price.trim()),
        description.trim(),
    );

    newProduct.edit(productId);
    res.redirect(ADMIN.PRODUCTS.PATH);
};
