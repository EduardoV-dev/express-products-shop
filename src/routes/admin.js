const express = require('express');
const { ADMIN } = require('../config/views');
const {
  getAdminProducts,
  getAddProductView,
  postProduct,
} = require('../controllers/admin');

const router = express.Router();

router.get(ADMIN.PRODUCTS.PATH, getAdminProducts);
router.get(ADMIN.ADDPRODUCT.PATH, getAddProductView);
router.post(ADMIN.ADDPRODUCT.PATH, postProduct);

module.exports = router;
