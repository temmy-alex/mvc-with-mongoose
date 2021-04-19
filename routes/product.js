const express = require('express');

// Call controller
const productController = require('../controllers/product');

// Call function Router from express
const router = express.Router();

router.get('/', productController.getProducts);

module.exports = router;