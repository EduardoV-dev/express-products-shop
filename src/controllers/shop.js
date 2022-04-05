const { SHOP } = require('../config/views');
const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getShopProducts = (req, res) => {
  const products = Product.getAllProducts();
  res.render(SHOP.PRODUCTS.VIEW, { title: SHOP.PRODUCTS.TITLE, products });
};

exports.getCart = (req, res) => {
  const cart = Cart.getCart();
  res.render(SHOP.CART.VIEW, { title: SHOP.CART.TITLE, cart });
};

exports.postAddItemToCart = (req, res) => {
  const { productId } = req.body;
  const { id, title } = Product.getProductById(productId);
  const cartItem = new Cart(id, title);
  cartItem.save();

  res.redirect(SHOP.CART.PATH);
};

exports.deleteCartItem = (req, res) => {
  const { productId } = req.body;
  Cart.removeFromCart(productId);

  res.redirect(SHOP.CART.PATH);
};
