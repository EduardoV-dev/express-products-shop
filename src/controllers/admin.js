const { validationResult } = require('express-validator');
const Product = require('../models/product');
const { getFieldErrorMessageFromErrors, removeProductImageFromBucket } = require('../utils');

exports.getAdminProducts = async (req, res, next) => {
    try {
        const ITEMS_PER_PAGE = 3;
        const page = Number(req.query.page || 1);
        const totalProducts = await Product.find({ userId: req.user._id }).countDocuments();
        const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
        const paginationOffset = (page - 1) * ITEMS_PER_PAGE;

        const products = await Product.find({ userId: req.user._id })
            .skip(paginationOffset)
            .limit(ITEMS_PER_PAGE);

        return res.render('admin/products', {
            title: 'Products | Admin',
            products,

            page,
            prevPage: page - 1,
            nextPage: page + 1,
            totalPages,
            hasPreviousPage: page > 1,
            hasNextPage: page < totalPages,
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

exports.postProduct = async (req, res, next) => {
    try {
        const { title, price, description } = req.body;
        const image = req.file;

        const errors = validationResult(req);
        const hasErrors = !errors.isEmpty();

        if (hasErrors || !image) {
            const values = errors.array();

            return res.render('admin/add-product-form', {
                title: 'Add Product | Admin',
                initialValues: {
                    title,
                    price,
                    description,
                },
                errors: {
                    form: null,
                    title: hasErrors ? getFieldErrorMessageFromErrors(values, 'title') : null,
                    image: 'Image has not been set',
                    price: hasErrors ? getFieldErrorMessageFromErrors(values, 'price') : null,
                    description: hasErrors
                        ? getFieldErrorMessageFromErrors(values, 'description')
                        : null,
                },
            });
        }

        await new Product({
            description,
            imageURL: `product-images/${image.filename}`,
            price: Number(price),
            title,
            userId: req.session.user._id,
        }).save();

        return res.redirect('/admin/products');
    } catch (error) {
        return next(error);
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) throw new Error('The product attempted to delete does not exists');

        await Product.findByIdAndDelete(productId);
        removeProductImageFromBucket(product.imageURL);
        return res.json({ message: 'Product deleted' });
    } catch (error) {
        return res.json({ message: 'Product deletion failed' });
    }
};

exports.editProduct = async (req, res, next) => {
    try {
        const { title, price, description, productId } = req.body;
        const image = req.file;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const values = errors.array();

            return res.render('admin/edit-product-form', {
                title: 'Edit product',
                product: { title, price, description, _id: productId },
                errors: {
                    form: null,
                    title: getFieldErrorMessageFromErrors(values, 'title'),
                    price: getFieldErrorMessageFromErrors(values, 'price'),
                    description: getFieldErrorMessageFromErrors(values, 'description'),
                },
            });
        }

        await Product.findByIdAndUpdate(productId, {
            description,
            price: Number(price),
            title,
            ...(image && {
                imageURL: `product-images/${image.filename}`,
            }),
        });
        return res.redirect('/admin/products');
    } catch (error) {
        return next(error);
    }
};
