// file to use express to create routes for the apis
const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const userRouter = require('./src/routers/user.router');

const productRouter = require('./src/routers/product.router');
const cartRouter = require('./src/routers/cart.router');
const kycRouter = require('./src/routers/kyc.router');

const orderRouter = require('./src/routers/order.router');
const emailVerificationRouter = require('./src/routers/emailVerification.router');
const fpRouter = require('./src/routers/fp.router');
const otpRouter = require('./src/routers/otp.router');

const ticketRouter = require('./src/routers/ticket.router');
const eventRouter = require('./src/routers/event.router');
const ticketTypeRouter = require('./src/routers/ticketType.router');




// body parser is used to get data which comes in the body 
app.use(bodyParser.json());

// when user adds data in body and send requests
// register function of the controller will be called
// this function will use the services of user registration
// app.use('/api/v1', userRouter);

app.use('/api/v1/product', productRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1', kycRouter);
app.use('/api/v1/user', userRouter);

app.use('/api/v1/order', orderRouter);

app.use('/api/v1/emailVerification', emailVerificationRouter);
app.use('/api/v1/fp', fpRouter);
app.use('/api/v1/otp', otpRouter);

app.use('/api/v1/ticket', ticketRouter);
app.use('/api/v1/event', eventRouter);
app.use('/api/v1/ticketType', ticketTypeRouter);


module.exports = app;
