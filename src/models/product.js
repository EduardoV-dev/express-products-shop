const { getData, addData } = require('../helpers/files');
const { PRODUCTS_FILE_PATH } = require('../consts/filesPath');

const getProductsFromFile = () => getData(PRODUCTS_FILE_PATH);

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

  static getProductById(id) {
    return getProductsFromFile().find(item => item.id === Number(id));
  }

  save() {
    const products = getProductsFromFile();
    products.push(formatProduct(this));
    addData(PRODUCTS_FILE_PATH, products);
  }
};
