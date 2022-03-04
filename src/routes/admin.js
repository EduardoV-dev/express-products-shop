const express = require('express');
const { ADMIN } = require('../config/views');

const router = express.Router();

router.get(ADMIN.PRODUCTS.PATH, (req, res) => {
  res.render(ADMIN.PRODUCTS.VIEW, { title: ADMIN.PRODUCTS.TITLE });
});

router.get(ADMIN.ADDPRODUCT.PATH, (req, res) => {
  res.render(ADMIN.ADDPRODUCT.VIEW, { title: ADMIN.ADDPRODUCT.TITLE });
});

module.exports = router;
