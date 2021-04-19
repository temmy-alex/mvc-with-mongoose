exports.getProducts = (req, res, next) => {
    res.render('product/index', {
        title: 'All Products',
        path: '/products'
    })
}