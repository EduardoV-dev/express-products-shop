const express = require('express');
const { SHOP } = require('../config/views');
const {
  getShopProducts,
  getCart,
  postAddItemToCart,
  deleteCartItem,
  getDetailedView,
} = require('../controllers/shop');

const router = express.Router();

/* Products */
router.get(SHOP.PRODUCTS.PATH, getShopProducts);
router.get(SHOP.DETAILED_VIEW.PATH, getDetailedView);

/* Cart */
router.get(SHOP.CART.PATH, getCart);
router.post(SHOP.CART.PATH, postAddItemToCart);
router.post(`${SHOP.CART.PATH}/delete`, deleteCartItem);

module.exports = router;
