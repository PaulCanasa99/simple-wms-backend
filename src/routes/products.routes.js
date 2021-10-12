const express = require('express');
const productController = require('../controllers/products.controller');
const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:productId', productController.getProductById);

module.exports = router;