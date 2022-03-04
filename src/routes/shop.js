const express = require('express');
const { SHOP } = require('../config/views');

const router = express.Router();

router.get(SHOP.PRODUCTS.PATH, (req, res) => {
  res.render(SHOP.PRODUCTS.VIEW, {
    title: SHOP.PRODUCTS.TITLE,
  });
});

router.get(SHOP.CART.PATH, (req, res) => {
  res.render(SHOP.CART.VIEW, { title: SHOP.CART.TITLE });
});

module.exports = router;
