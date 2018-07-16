const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const customerSchema = new mongoose.Schema({
    _id: String,
    customer_name: {type: String, required: true, lowercase: true},
    customer_address: {type: String, required: true, lowercase: true},
    customer_phone: {type: String}
});

customerSchema.plugin(autoIncrement.plugin,'Customer');
mongoose.model('Customer', customerSchema);

module.exports = mongoose.model('Customer');