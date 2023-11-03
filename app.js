// file to use express to create routes for the apis
const express = require('express');
const app = express();
const session = require('express-session');


const passport = require('passport');
const bodyParser = require('body-parser');
const userRouter = require('./routers/user.router');
const categoryRouter = require('./routers/category.router');
const productRouter = require('./routers/product.router');
const cartRouter = require('./routers/cart.router');




// body parser is used to get data which comes in the body 
app.use(bodyParser.json());

// when user adds data in body and send requests
// register function of the controller will be called
// this function will use the services of user registration
app.use('/', userRouter);
app.use('/', categoryRouter);
app.use('/', productRouter);
app.use('/', cartRouter);


// Initialize Passport and session management
app.use(passport.initialize());
app.use(passport.session());

// Initialize express-session middleware
app.use(
  session({
    secret: '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', // Use a long, random string as a session secret
    resave: false,
    saveUninitialized: true,
  })
);



app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    hd: 'vitbhopal.ac.in', // Restrict to your organization's domain
  })
);

// Use passport.authenticate as middleware here, and don't specify a callback function
app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/dashboard', // Redirect to your dashboard on successful login
    failureRedirect: '/login',    // Redirect to login on failure
  })
);



module.exports = app;
