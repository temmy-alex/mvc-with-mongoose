// const path = require('path');

const express = require('express');

// Call library mongoose
const mongoose = require('mongoose');

// Call library user session express
const session = require('express-session');

// Save session to mongodb
const MongoDBStore = require('connect-mongodb-session')(session);

// Library security for csrf attack
const csrf = require('csurf');

// Library for flash messages
const flash = require('connect-flash');

const User = require('./models/user');

// Create constants for open connection mongodb
const MONGODB_URI = 'mongodb://localhost:27017/mvc_mongo';

const app = express();

// Set store session to mongodb and set for csrf feature
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})

// Call csrf library
const csrfProtection = csrf();

// Use view engine ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

// Call routing product from routes directory
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');

// Get request from raw json
app.use(express.json());

// Get request from form / x-www-form-urlencoded
// Use for upload image
app.use(express.urlencoded({extended: false}));

// Get static from folder public / call assets from folder public
// app.use(express.static(path.join('public')));
app.use(express.static('public'));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))

// User csrf middleware
app.use(csrfProtection);

// Use middleware flash message
app.use(flash());

// Middleware check session user id login and set for csrf feature
app.use((req, res, next) => {
    if (!req.session.user){
        return next();
    }

    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})

// Set middleware for csrf and session
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

// Use product routing with middleware
app.use(productRoutes);
app.use(authRoutes);

// connection to mongodb database
mongoose
    .connect(MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    })
    .then(result => {
        app.listen(8080)
    })
    .catch(err => {
        console.log(err);
    });
