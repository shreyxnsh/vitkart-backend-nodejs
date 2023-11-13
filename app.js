// file to use express to create routes for the apis
const express = require('express');
const app = express();
const session = require('express-session');

const bodyParser = require('body-parser');
const userRouter = require('./src/routers/user.router');
const categoryRouter = require('./src/routers/category.router');
const productRouter = require('./src/routers/product.router');
const cartRouter = require('./src/routers/cart.router');
const kycRouter = require('./src/routers/kyc.router');

// body parser is used to get data which comes in the body 
app.use(bodyParser.json());

// when user adds data in body and send requests
// register function of the controller will be called
// this function will use the services of user registration
app.use('/api/v1', userRouter);
app.use('/api/v1', categoryRouter);
app.use('/api/v1', productRouter);
app.use('/api/v1', cartRouter);
app.use('/api/v1', kycRouter);


module.exports = app;
