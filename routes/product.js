const express = require('express');

// Call controller
const productController = require('../controllers/product');
const isAuth = require('../middleware/is-auth');

// Call function Router from express
const router = express.Router();

router.get('/products', isAuth, productController.getProducts);
router.get('/list-produk', isAuth, productController.getProducts2);
router.get('/add-product', isAuth, productController.getAddProduct);
router.post('/add-product', isAuth, productController.postAddProduct);

module.exports = router;