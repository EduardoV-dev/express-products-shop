const { validationResult } = require('express-validator');
const Product = require('../models/product');
const { getFieldErrorMessageFromErrors } = require('../utils');

exports.getAdminProducts = async (req, res) => {
    try {
        const products = await Product.find({ userId: req.user._id });

        res.render('admin/products', {
            title: 'Products | Admin',
            products,
        });
    } catch (error) {
        console.error(error);
    }
};

exports.getEditProductView = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);

        if (!product) res.redirect('/page-not-found');

        res.render('admin/edit-product-form', {
            title: 'Edit product',
            product,
            errors: {
                form: req.flash('add-product').at(0) || null,
                title: null,
                imageURL: null,
                price: null,
                description: null,
            },
        });
    } catch (error) {
        console.error(error);
    }
};

exports.getAddProductView = (req, res) =>
    res.render('admin/add-product-form', {
        title: 'Add Product | Admin',
        initialValues: {
            title: '',
            imageURL: '',
            price: '',
            description: '',
        },
        errors: {
            form: req.flash('add-product').at(0) || null,
            title: null,
            imageURL: null,
            price: null,
            description: null,
        },
    });

exports.postProduct = (req, res) => {
    const { title, imageURL, price, description } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const values = errors.array();

        return res.render('admin/add-product-form', {
            title: 'Add Product | Admin',
            initialValues: {
                title,
                imageURL,
                price,
                description,
            },
            errors: {
                form: null,
                title: getFieldErrorMessageFromErrors(values, 'title'),
                imageURL: getFieldErrorMessageFromErrors(values, 'imageURL'),
                price: getFieldErrorMessageFromErrors(values, 'price'),
                description: getFieldErrorMessageFromErrors(values, 'description'),
            },
        });
    }

    const product = new Product({
        description,
        imageURL,
        price: Number(price),
        title,
        userId: req.session.user._id,
    });

    product.save();
    return res.redirect('/admin/products');
};

exports.deleteProduct = (req, res) => {
    const { productId } = req.body;

    Product.findByIdAndDelete(productId).catch(console.error);
    res.redirect('/admin/products');
};

exports.editProduct = (req, res) => {
    const { title, imageURL, price, description, productId } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const values = errors.array();

        return res.render('admin/edit-product-form', {
            title: 'Edit product',
            product: { title, imageURL, price, description, _id: productId },
            errors: {
                form: null,
                title: getFieldErrorMessageFromErrors(values, 'title'),
                imageURL: getFieldErrorMessageFromErrors(values, 'imageURL'),
                price: getFieldErrorMessageFromErrors(values, 'price'),
                description: getFieldErrorMessageFromErrors(values, 'description'),
            },
        });
    }

    Product.findByIdAndUpdate(productId, {
        description,
        imageURL,
        price: Number(price),
        title,
    }).catch(console.error);
    return res.redirect('/admin/products');
};
