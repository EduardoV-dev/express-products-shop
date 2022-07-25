const { ADMIN, SHOP } = require('../config/views');
const Product = require('../models/product');

exports.getAdminProducts = async (req, res) => {
    try {
        const products = await Product.findAll();

        res.render(ADMIN.PRODUCTS.VIEW, {
            title: ADMIN.PRODUCTS.TITLE,
            products,
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getEditProductView = async (req, res) => {
    const { productId } = req.params;

    try {
        const [product] = await Product.findAll({ where: { id: productId } });

        res.render(ADMIN.FORM.VIEW, {
            title: 'Edit product',
            product,
            isUpdating: true,
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getAddProductView = (req, res) => {
    res.render(ADMIN.FORM.VIEW, { title: ADMIN.FORM.TITLE, isUpdating: false });
};

exports.postProduct = async (req, res) => {
    const { title, imageURL: imageUrl, price, description } = req.body;

    try {
        await req.user.createProduct({
            title,
            imageUrl,
            price,
            description,
        });

        res.redirect(SHOP.PRODUCTS.PATH);
    } catch (err) {
        console.log(err);
    }
};

exports.deleteProduct = async (req, res) => {
    const { productId } = req.body;

    try {
        await Product.destroy({ where: { id: productId } });

        res.redirect(ADMIN.PRODUCTS.PATH);
    } catch (err) {
        console.log(err);
    }
};

exports.editProduct = async (req, res) => {
    const {
        title,
        imageURL: imageUrl,
        price,
        description,
        productId,
    } = req.body;

    try {
        await Product.update(
            { title, imageUrl, price, description },
            { where: { id: productId } },
        );

        res.redirect(ADMIN.PRODUCTS.PATH);
    } catch (err) {
        console.log(err);
    }
};
