const fs = require('fs');
const { PRODUCTS_FILE_PATH } = require('../consts/filesPath');

exports.getProductsFromFile = cb =>
  fs.readFile(PRODUCTS_FILE_PATH, 'utf8', (err, data) => {
    if (err) return cb([]);
    return cb(JSON.parse(data));
  });

exports.getProductsLastId = cb =>
  this.getProductsFromFile(products => cb(products[products.length - 1].id));
