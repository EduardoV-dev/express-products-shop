const express = require('express');
const { SHOP } = require('../config/views');
const {
  getShopProducts,
  getCart,
  postAddItemToCart,
} = require('../controllers/shop');

const router = express.Router();

router.get(SHOP.PRODUCTS.PATH, getShopProducts);
router.get(SHOP.CART.PATH, getCart);
router.post(SHOP.CART.PATH, postAddItemToCart);

module.exports = router;
