const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// db.productSchema.insertMany([
//     {title : 'Binar',
//     price : 10000,
//     description : 'bimbel',
//     imageUrl : '_'}
// ])

// const db = mongoose.connection
// db.on('error', console.error.bind('console', 'connections error:'))
// db.once('open', async ()=> {
//     const product = new Product()
//     product.title = "Ayam Goreng"
//     product.price = 15000
//     product.description = "Harga Nasi Padang"
//     product.imageUrl = "www.nasipadang.com"
//     // save data
//     const saveProduct = await product.save()
//     console.log(saveProduct);
// }),


module.exports = mongoose.model('Product', productSchema)