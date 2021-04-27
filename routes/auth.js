const express = require('express');
const { check, body } = require('express-validator');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const User = require('../models/user');
const router = express.Router();

router.get('/', isAuth, authController.getHome);

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);
router.post('/signup', [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(
                            'Email sudah terdaftar, silahkan gunakan email lain'
                        )
                    }
                })
            })
        .normalizeEmail(),
    body('password')
        .isLength({ min: 5 })
        .withMessage('Password minimal harus 5 karakter')
        .isAlphanumeric()
        .withMessage('Password harus teks')
        .trim(),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password dan konfirmasi password harus sama!')
        }
        return true;
    })      
], authController.postSignup);

router.post('/logout', authController.postLogout);

module.exports = router;