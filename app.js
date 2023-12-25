// file to use express to create routes for the apis
const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const userRouter = require('./src/routers/user.router');
const categoryRouter = require('./src/routers/category.router');
const productRouter = require('./src/routers/product.router');
const cartRouter = require('./src/routers/cart.router');
const kycRouter = require('./src/routers/kyc.router');
const authRouter = require('./src/routers/auth.router');
const orderRouter = require('./src/routers/order.router');

// body parser is used to get data which comes in the body 
app.use(bodyParser.json());

// when user adds data in body and send requests
// register function of the controller will be called
// this function will use the services of user registration
// app.use('/api/v1', userRouter);
app.use('/api/v1', categoryRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1', kycRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/order', orderRouter);

module.exports = app;
