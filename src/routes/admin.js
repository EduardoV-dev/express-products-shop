const express = require('express');
const controller = require('../controllers/admin');

const router = express.Router();

/* Products */
router.get('/products', controller.getAdminProducts);
router.post('/products/delete', controller.deleteProduct);

/* Product Form */
router.get('/product-form', controller.getAddProductView);
router.post('/product-form', controller.postProduct);
router.get('/product-form/:productId', controller.getEditProductView);
router.post('/product-form/edit', controller.editProduct);

module.exports = router;
