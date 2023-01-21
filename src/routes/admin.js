const express = require('express');
const { ADMIN } = require('../config/views');
const controller = require('../controllers/admin');

const router = express.Router();

/* Products */
router.get(ADMIN.PRODUCTS.PATH, controller.getAdminProducts);
router.post(`${ADMIN.PRODUCTS.PATH}/delete`, controller.deleteProduct);

/* Product Form */
router.get(ADMIN.FORM.PATH, controller.getAddProductView);
router.post(ADMIN.FORM.PATH, controller.postProduct);
router.get(`${ADMIN.FORM.PATH}/:productId`, controller.getEditProductView);
router.post(`${ADMIN.FORM.PATH}/edit`, controller.editProduct);

module.exports = router;
