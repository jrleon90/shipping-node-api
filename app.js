require('dotenv').config();
const express = require('express');
const db = require('./database/db');

const app = express();

//Load Routes
const orderController = require('./controller/orderController');
const customerController = require('./controller/customerController');

//Assing routes
app.use('/order', orderController);
app.use('/customer', customerController);

//Root route
app.use('/',(req,res)=>{
    res.json({'Message': 'Welcome to the Shipping Data API!'})
 });


 module.exports = app;