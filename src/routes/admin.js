const express = require('express');
const { body } = require('express-validator');

const controller = require('../controllers/admin');

const router = express.Router();

/* Products */
router.get('/products', controller.getAdminProducts);
router.post('/products/delete', controller.deleteProduct);

const productFormValidations = [
    body('title', 'Title cannot be empty').trim().exists({ checkFalsy: true }),
    body('imageURL').trim().exists().isURL().withMessage('Not valid URL'),
    body('price', 'Price cannot be empty').trim().exists().isFloat(),
    body('description', 'Description cannot be only numbers')
        .trim()
        .exists({ checkFalsy: true })
        .withMessage('Insert a description')
        .isString(),
];

/* Product Form */
router.get('/product-form', controller.getAddProductView);
router.post('/product-form', productFormValidations, controller.postProduct);
router.get('/product-form/:productId', controller.getEditProductView);
router.post('/product-form/edit', productFormValidations, controller.editProduct);

module.exports = router;
