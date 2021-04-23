const express = require('express');
const { body } = require('express-validator');

// Call controller
const productController = require('../controllers/product');
const isAuth = require('../middleware/is-auth');

// Call function Router from express
const router = express.Router();

router.get('/products', isAuth, productController.getProducts);
router.get('/list-produk', isAuth, productController.getProducts2);
router.get('/add-product', isAuth, productController.getAddProduct);
router.post('/add-product',
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('imageUrl')
            .isURL()
            .withMessage('Format harus URL'),
        body('price')
            .isFloat()
            .withMessage('Harga harus diisi angka'),
        body('description')
            .isLength({ min: 5, max: 400 })
            .withMessage('Deskripsi minimal harus 5 karakter')
            .trim()
    ],
     isAuth, 
     productController.postAddProduct);

router.get('/edit-product/:productId', isAuth, productController.getEditProduct);
router.post('/edit-product', isAuth, productController.postEditProduct);
router.post('/delete-product', isAuth, productController.postDeleteProduct);

module.exports = router;