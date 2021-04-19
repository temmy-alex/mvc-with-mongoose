// const path = require('path');

const express = require('express');

// Call library mongoose
const mongoose = require('mongoose');

// Create constants for open connection mongodb
const MONGODB_URI = 'mongodb://localhost:27017/mvc_mongo';

const app = express();

// Use view engine ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

// Call routing product from routes directory
const productRoutes = require('./routes/product');

// Get request from raw json
app.use(express.json());

// Get request from form / x-www-form-urlencoded
// Use for upload image
app.use(express.urlencoded({extended: false}));

// Get static from folder public / call assets from folder public
// app.use(express.static(path.join('public')));
app.use(express.static('public'));

// Use product routing with middleware
app.use(productRoutes);

// connection to mongodb database
mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
});

app.listen(8080);