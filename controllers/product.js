const { validationResult } = require('express-validator');
const Product = require('./../models/product.js');

const ITEMS_PER_PAGE = 2;

// exports.getProducts = (req, res, next) => {
//     res.render('product/index', {
//         title: 'All Products'
//     })
// }

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Product.find()
        .countDocuments()
        // numProducts = alias
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            res.render('product/list-product', {
                prods: products,
                title: 'List Products',
                // Posisi halaman saat user berkunjung
                currentPage: page,
                // Melakukan pengecekkan apakah ada halaman selanjutnya
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                // Melakukan pengecekkan apakah ada halaman sebelumnya
                hasPreviousPage: page > 1,
                // Halaman selanjutnya
                nextPage: page + 1,
                // Halaman sebelumnya
                previousPage: page - 1,
                // Halaman terakhir
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(err => console.log(err));

    // Tanpa Pagination
    // Product.find()
    //     .then(products => {
    //         res.render('product/list-product', {
    //             prods: products,
    //             title: 'All Products'
    //         })
    //     });
}

exports.getProducts2 = async (req, res, next) => {
    await Product.find({}).exec((err, products)=>{
        res.render('product/index', {
            products,
            title: 'Semua Produk'
        })  
    })  
}

exports.getAddProduct = (req, res, next) => {
    res.render('product/edit-product', {
        title: 'Add Product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const errors = validationResult(req);

    // Kode http 422 khusus digunakana untuk exception / error validasi
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(422).render('product/edit-product', {
            title: 'Add  Product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }
    
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user._id
    });

    product
        .save()
        .then(result => {
            console.log('Created Product');
            res.redirect('/products');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getEditProduct = (req, res, next) => {
    // Get from query string list product ?edit=true
    const editMode = req.query.edit;
    
    if(!editMode){
        return res.redirect('/');
    }

    // From routing get with dynamic params 
    // /edit-product/:productId
    const prodId = req.params.productId;
   
    Product.findById(prodId)
        .then(product => {
            if(!product){
                return res.redirect('/');
            }
            res.render('product/edit-product', {
                title: 'Edit Product',
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            })
        })
}

exports.postEditProduct = (req, res, next) => {
    // Get value from form submit
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            product.imageUrl = updatedImageUrl;
            return product.save();
        })
        .then(result => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/products');
        })
        .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    Product.findByIdAndRemove(prodId)
        .then(() => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/products');
        })
        .catch(err => console.log(err));
}

