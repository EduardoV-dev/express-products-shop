const express = require('express');

const controller = require('../controllers/shop');
const isAuthenticated = require('../middlewares/routes-protection');

const router = express.Router();

/* Products */
router.get('/products', controller.getShopProducts);
router.get('/products/:productId', controller.getDetailedView);

/* Orders */
router.get('/orders', isAuthenticated, controller.getOrdersView);
router.post('/orders', isAuthenticated, controller.postOrder);
router.get('/orders/:orderId', isAuthenticated, controller.getInvoice);

/* Cart */
router.get('/cart', isAuthenticated, controller.getCart);
router.post('/cart', isAuthenticated, controller.postAddItemToCart);
router.post('/cart/delete', isAuthenticated, controller.deleteCartItem);

module.exports = router;
