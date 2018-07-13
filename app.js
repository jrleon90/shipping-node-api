require('dotenv').config();
const express = require('express');

const app = express();

//Root route
app.use('/',(req,res)=>{
    res.json({'Message': 'Welcome to the Shipping Data API!'})
 });


 module.exports = app;