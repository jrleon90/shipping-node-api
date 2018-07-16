const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const customerSchema = new mongoose.Schema({
    _id: String,
    customer_name: {type: String, required: true, lowercase: true},
    customer_addres: {type: String, required: true, lowercase: true},
    customer_phone: {type: String}
});

//customerSchema.plugin(autoIncrement,'Customer');
mongoose.model('Customer', customerSchema);

module.exports = mongoose.model('Customer');