const express = require('express');

// Call controller
const productController = require('../controllers/product');

// Call function Router from express
const router = express.Router();

router.get('/', productController.getProducts);
router.get('/products', productController.getProducts);
router.get('/list-produk', productController.getProducts2);
router.get('/add-product', productController.getAddProduct);
router.post('/add-product', productController.postAddProduct);

module.exports = router;