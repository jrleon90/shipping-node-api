const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);


//Order Schema for MongoDB
const orderSchema = new mongoose.Schema({
    _id: String,
    //customer_name: {type: String, required: true, lowercase: true},
    //customer_address: {type: String, required: true, lowercase: true},
    customer_id: {type: String, required: true},
    products: [{
        _id: false,
        item_name: {type: String, required: true},
        item_price: {type: Number, required: true},
        item_quantity: {type: Number, required: true},
        currency: {type: String, required: true}
    }]
});

orderSchema.plugin(autoIncrement.plugin,'Order');
mongoose.model('Order', orderSchema);

module.exports = mongoose.model('Order');