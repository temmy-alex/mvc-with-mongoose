const Product = require('./../models/product.js')

// exports.getProducts = (req, res, next) => {
//     res.render('product/index', {
//         title: 'All Products'
//     })
// }

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('product/list-product', {
                prods: products,
                title: 'All Products'
            })
        });
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
        editing: false
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl
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

