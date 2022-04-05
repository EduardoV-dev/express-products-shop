const { ADMIN, SHOP } = require('../config/views');
const Product = require('../models/product');

exports.getAdminProducts = (req, res) => {
  const products = Product.getAllProducts();
  res.render(ADMIN.PRODUCTS.VIEW, {
    title: ADMIN.PRODUCTS.TITLE,
    products,
  });
};

exports.getEditProductView = (req, res) => {
  const { productId } = req.body;
  const product = Product.getProductById(productId);

  res.render(ADMIN.FORM.VIEW, {
    title: 'Edit product',
    product,
    isUpdating: true,
  });
};

exports.getAddProductView = (req, res) => {
  console.log('render');
  res.render(ADMIN.FORM.VIEW, { title: ADMIN.FORM.TITLE, isUpdating: false });
};

exports.postProduct = (req, res) => {
  const { title, imageURL, price, description } = req.body;
  const product = new Product(title, imageURL, price, description);
  product.save();

  res.redirect(SHOP.PRODUCTS.PATH);
};

exports.deleteProduct = (req, res) => {
  const { productId } = req.body;
  Product.deleteProduct(productId);

  res.redirect(ADMIN.PRODUCTS.PATH);
};
