const { ADMIN, SHOP } = require('../config/views');
const Product = require('../models/product');

exports.getAdminProducts = (req, res) => {
  const products = Product.getAllProducts();
  res.render(ADMIN.PRODUCTS.VIEW, { title: ADMIN.PRODUCTS.TITLE, products });
};

exports.getAddProductView = (req, res) => {
  res.render(ADMIN.ADDPRODUCT.VIEW, { title: ADMIN.ADDPRODUCT.TITLE });
};

exports.postProduct = (req, res) => {
  const { title, imageURL, price, description } = req.body;
  const product = new Product(title, imageURL, price, description);
  product.save();

  res.redirect(SHOP.PRODUCTS.PATH);
};
