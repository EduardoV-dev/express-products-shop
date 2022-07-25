const express = require('express');

const { SHOP: VIEWS } = require('../config/views');
const shop = require('../controllers/shop');

const router = express.Router();

/* Products */

router.get(VIEWS.PRODUCTS.PATH, shop.getShopProducts);
router.get(VIEWS.DETAILED_VIEW.PATH, shop.getDetailedView);

/* Cart */

router.get(VIEWS.CART.PATH, shop.getCart);
router.post(VIEWS.CART.PATH, shop.postAddItemToCart);
router.post(`${VIEWS.CART.PATH}/delete`, shop.deleteCartItem);

module.exports = router;
