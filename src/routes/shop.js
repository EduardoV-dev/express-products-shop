const express = require('express');

const { SHOP } = require('../config/views');
const controller = require('../controllers/shop');

const router = express.Router();

/* Products */
router.get(SHOP.PRODUCTS.PATH, controller.getShopProducts);
router.get(SHOP.DETAILED_VIEW.PATH, controller.getDetailedView);
router.get(SHOP.ORDERS.PATH, controller.getOrdersView);
router.post(SHOP.ORDERS.PATH, controller.postOrder);

/* Cart */
router.get(SHOP.CART.PATH, controller.getCart);
router.post(SHOP.CART.PATH, controller.postAddItemToCart);
router.post(`${SHOP.CART.PATH}/delete`, controller.deleteCartItem);

module.exports = router;
