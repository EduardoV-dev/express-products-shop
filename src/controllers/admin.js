const Product = require('../models/product');

exports.getAdminProducts = async (req, res) => {
    const products = await Product.find({ userId: req.user._id });

    res.render('admin/products', {
        title: 'Products | Admin',
        products,
    });
};

exports.getEditProductView = async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) res.redirect('/page-not-found');

    res.render('admin/product-form', {
        title: 'Edit product',
        product,
        isUpdating: true,
    });
};

exports.getAddProductView = (req, res) =>
    res.render('admin/product-form', {
        title: 'Add Product | Admin',
        isUpdating: false,
    });

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
    res.redirect('/admin/products');
};

exports.deleteProduct = async (req, res) => {
    const { productId } = req.body;

    await Product.findByIdAndDelete(productId).catch(console.error);
    res.redirect('/admin/products');
};

exports.editProduct = async (req, res) => {
    const { title, imageURL, price, description, productId } = req.body;

    await Product.findByIdAndUpdate(productId, {
        description: description.trim(),
        imageURL: imageURL.trim(),
        price: Number(price.trim()),
        title: title.trim(),
    }).catch(console.error);
    res.redirect('/admin/products');
};
