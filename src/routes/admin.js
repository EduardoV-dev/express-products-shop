const express = require('express');
const { ADMIN } = require('../config/views');
const {
  getAdminProducts,
  getAddProductView,
  postProduct,
  deleteProduct,
  getEditProductView,
  editProduct,
} = require('../controllers/admin');

const router = express.Router();

/* Products */
router.get(ADMIN.PRODUCTS.PATH, getAdminProducts);
router.post(`${ADMIN.PRODUCTS.PATH}/delete`, deleteProduct);

/* Product Form */
router.get(ADMIN.FORM.PATH, getAddProductView);
router.get(`${ADMIN.FORM.PATH}/:productId`, getEditProductView);
router.post(ADMIN.FORM.PATH, postProduct);
router.post(`${ADMIN.FORM.PATH}/edit`, editProduct);

module.exports = router;
