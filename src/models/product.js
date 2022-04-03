const fs = require('fs');
const { PRODUCTS_FILE_PATH } = require('../consts/filesPath');

const getProductsFromFile = () => {
  try {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE_PATH, 'utf8'));
    return products;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return [];
  }
};

const getProductsNextId = () => {
  const products = getProductsFromFile();
  return products[products.length - 1].id + 1;
};

const formatProduct = product => ({
  id: getProductsNextId(),
  ...product,
});

module.exports = class Product {
  constructor(title, imageURL, price, description) {
    this.title = title;
    this.imageURL = imageURL;
    this.price = price;
    this.description = description;
  }

  static getAllProducts() {
    return getProductsFromFile();
  }

  save() {
    const products = getProductsFromFile();
    products.push(formatProduct(this));
    try {
      fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }
};
