const path = require('path');
const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');

const controller = require('../controllers/admin');

const router = express.Router();

/* Products */
router.get('/products', controller.getAdminProducts);
router.post('/products/delete', controller.deleteProduct);

const productFormValidations = [
    body('title', 'Title cannot be empty').trim().exists({ checkFalsy: true }),
    body('price', 'Price cannot be empty').trim().exists().isFloat(),
    body('description', 'Description cannot be only numbers')
        .trim()
        .exists({ checkFalsy: true })
        .withMessage('Insert a description')
        .isString(),
];

const bucketPath = path.join(__dirname, '..', 'data', 'product-images');
const uploadImage = multer({ dest: bucketPath }).single('image');

/* Product Form */
router.get('/product-form', controller.getAddProductView);
router.post('/product-form', uploadImage, productFormValidations, controller.postProduct);
router.get('/product-form/:productId', controller.getEditProductView);
router.post('/product-form/edit', uploadImage, productFormValidations, controller.editProduct);

module.exports = router;
