const express = require('express');
const { ADMIN: VIEWS } = require('../config/views');
const admin = require('../controllers/admin');

const router = express.Router();

/* Products */

router.get(VIEWS.PRODUCTS.PATH, admin.getAdminProducts);
router.post(`${VIEWS.PRODUCTS.PATH}/delete`, admin.deleteProduct);

/* Product Form */

router.get(VIEWS.FORM.PATH, admin.getAddProductView);
router.get(`${VIEWS.FORM.PATH}/:productId`, admin.getEditProductView);
router.post(VIEWS.FORM.PATH, admin.postProduct);
router.post(`${VIEWS.FORM.PATH}/edit`, admin.editProduct);

module.exports = router;
