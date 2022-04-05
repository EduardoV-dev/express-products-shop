const express = require('express');
const { ADMIN } = require('../config/views');
const {
  getAdminProducts,
  getAddProductView,
  postProduct,
  deleteProduct,
} = require('../controllers/admin');

const router = express.Router();

router.get(ADMIN.PRODUCTS.PATH, getAdminProducts);
router.get(ADMIN.FORM.PATH, getAddProductView);
router.post(ADMIN.FORM.PATH, postProduct);
router.post(`${ADMIN.PRODUCTS.PATH}/delete`, deleteProduct);

module.exports = router;
