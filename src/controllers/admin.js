const { validationResult } = require('express-validator');
const Product = require('../models/product');
const { getFieldErrorMessageFromErrors } = require('../utils');

exports.getAdminProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ userId: req.user._id });

        return res.render('admin/products', {
            title: 'Products | Admin',
            products,
        });
    } catch (error) {
        return next(error);
    }
};

exports.getEditProductView = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);

        if (!product) res.redirect('/page-not-found');

        return res.render('admin/edit-product-form', {
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
        return next(error);
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

exports.postProduct = (req, res, next) => {
    try {
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

        new Product({
            description,
            imageURL,
            price: Number(price),
            title,
            userId: req.session.user._id,
        }).save();

        return res.redirect('/admin/products');
    } catch (error) {
        return next(error);
    }
};

exports.deleteProduct = (req, res, next) => {
    try {
        const { productId } = req.body;

        Product.findByIdAndDelete(productId);
        return res.redirect('/admin/products');
    } catch (error) {
        return next(error);
    }
};

exports.editProduct = (req, res, next) => {
    try {
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
        });
        return res.redirect('/admin/products');
    } catch (error) {
        return next(error);
    }
};
