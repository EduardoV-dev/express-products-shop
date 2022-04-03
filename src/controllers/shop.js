const { SHOP } = require('../config/views');
const Product = require('../models/product');

exports.getShopProducts = (req, res) => {
  const products = Product.getAllProducts();
  res.render(SHOP.PRODUCTS.VIEW, { title: SHOP.PRODUCTS.TITLE, products });
};

exports.getCart = (req, res) => {
  res.render(SHOP.CART.VIEW, { title: SHOP.CART.TITLE });
};
