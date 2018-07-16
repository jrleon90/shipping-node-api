const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);


//Order Schema for MongoDB
const orderHistorySchema = new mongoose.Schema({
    _id: String,
    item_name: {type: String, required: true},
    item_sales: {type: Number, required: true},
    item_quantity_sales: {type: Number, require: true}

});

orderHistorySchema.plugin(autoIncrement.plugin,'OrderHistory');
mongoose.model('OrderHistory', orderHistorySchema);

module.exports = mongoose.model('OrderHistory');