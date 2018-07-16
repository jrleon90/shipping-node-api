require('dotenv').config();
const mongoose = require('mongoose');

const Order = require('../model/order');

const connection = mongoose.connect(process.env.URL);

console.log('start');

Order.find({}).exec((err, data) => {
    console.log('inside');
    console.log(data);

})