const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const _ = require('lodash');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const Customer = require('../model/customer');
const Order = require('../model/order');

router.post('/', (req, res) => {
    if(!req.body.customer_name || !req.body.customer_address || !req.body.customer_phone)
        return res.status(500).json({'Message':'Information missing'});
    let customer = new Customer({
        customer_name: req.body.customer_name,
        customer_address: req.body.customer_address,
        customer_phone: req.body.customer_phone
    });
    Customer.create(customer, (err, customerData) => {
        if(err) return res.status(500).json({'Error':err});
        return res.status(200).json({'response': customerData});
    })
})

router.get('/:parameter', (req,res) => {
    const parameter = req.params.parameter.toLowerCase();
    const type = req.query.type;
    if(type == 'name') {
        Customer.find({'customer_name': parameter}).exec((err,customerData) => {
            if(err) res.send(500).json({'Error': err});
            if(customerData.length > 0) {
                return res.status(200).json({'response': customerData});
            } else {
                return res.status(404).json({'Message':'Customer not found!'});
            }
        })
    } else if (type == 'address') {
        Customer.find({'customer_address': parameter}).exec((err, customerData) => {
            if(err) return res.send(500).json({'Error': err});
            if(customerData.length > 0) {
                return res.status(200).json({'response': customerData});
            } else {
                return res.status(404).json({'Message': 'Object not found'});
            }
        })
    } else {
        return res.status(500).json({'Error': 'Please add a valid type to the query search (name or address)'});
    }
})

router.put('/:id', (req, res) => {
    const customerId = req.params.id;
    const dataToUpdate = {
        customer_name: req.body.customer_name,
        customer_address: req.body.customer_address,
        customer_phone: req.body.customer_phone
    };
    Customer.findById(customerId).exec((err, customerData) => {
        if(err) return res.status(500).json({'Error': err});
        if(customerData != null) {
            Customer.update({'_id': customerId}, dataToUpdate, (err,updatedCustomer) => {
                if(err) return res.status(500).json({'Error': err});
                return res.status(200).json({'Message':'Customer updated'});
            })
        } else {
            return res.status(404).json({'Message':'Customer not found'})
        }
    })

})

router.delete('/:id', (req, res) => {
    const customerId = req.params.id;
    Customer.findById(customerId).exec((err, customerData) => {
        if(err) return res.send(500).json({'Error': err});
        if(customerData != null) {
            Customer.deleteOne({'_id':customerId},(err)=>{if(err) return res.status(500).json({'Error': err})})
        } else {
            return res.status(404).json({'Message':'Customer not found'})
        }
        return res.status(200).json({'Message':'Customer deleted!'})
    })
})

//Get all orders from a customer by giving the name or address
router.get('/orders/:parameter', (req, res) => {
    const parameter = req.params.parameter;
    const type = req.query.type;
    const returnData = [];

    if(type == 'name'){
        Customer.findOne({'customer_name': parameter}).exec((err, customerData) => {
            if (err) return res.status(500).json({'Error': err});
            if (customerData != null){
                Order.find({'customer_id': customerData._id}).exec((err, orderData) => {
                    if(err) return res.status(500).json({'Error': err});
                    if(orderData != null){
                        let products = orderData.map((order) => {
                            return order.products;
                        })
                        products.forEach((element)=>{
                            let objectData = {
                                'item_name': element[0].item_name,
                                'item_price': element[0].item_price,
                                'item_quantity': element[0].item_quantity,
                                'currency': element[0].currency
                            }
                            returnData.push(objectData);
                        })
                        return res.status(200).json({'response': returnData});
                        
                    } else {
                        return res.status(404).json({'Message': 'No orders found'})
                    }
                })
            } else {
                return res.status(404).json({'Message':'Customer not found'});
            }
        })
    } else if (type == 'id') {
        Order.find({'customer_id': parameter}).exec((err, orderData) => {
            if(err) return res.status(500).json({'Error':err});
            if(orderData != null){
                let products = orderData.map((order) => {
                    return order.products;
                })
                products.forEach((element) => {
                    let objectData = {
                        'item_name': element[0].item_name,
                        'item_price': element[0].item_price,
                        'item_quantity': element[0].item_quantity,
                    }
                    returnData.push(objectData);
                })
                return res.status(200).json({'response': returnData});
            } else {
                return res.status(404).json({'Message':'Customer not found '});
            }
        })
    } else {
        return res.status(500).json({'Error': 'Please add a valid type to the query search (name or id)'});
    }
})

//Total ammount spent by a customer
router.get('/spent/:parameter', (req, res) => {
    const parameter = req.params.parameter;
    const type = req.query.type;
    let totalSpent = 0;
    let objectSpent = [];

    if(type == 'name'){
        Customer.find({'customer_name': parameter}).exec((err, customerData) => {
            if (err) return res.status(500).json({'Error': err});
            if (customerData != null && customerData.length > 0){
                Order.find({'customer_id': customerData[0]._id}).exec((err, orderData) => {
                    if(err) return res.status(500).json({'Error': err});
                    if(orderData != null && customerData.length > 0){
                        let products = orderData.map((order) => {
                            return order.products;
                        })
                       let groupProducts = _.groupBy(products,(prod) => {
                           return prod[0].currency;
                       });

                       for (let item in groupProducts){
                           totalSpent = 0;
                           groupProducts[item].forEach((element)=>{
                            totalSpent += element[0].item_price;
                        })
                        let spentData = {
                            total: totalSpent,
                            currency: item
                        }
                        objectSpent.push(spentData);

                       }
                        return res.status(200).json({'response': objectSpent});
                        
                    } else {
                        return res.status(404).json({'Message': 'No orders found'})
                    }
                })
            } else {
                return res.status(404).json({'Message':'Customer not found'});
            }
        })
    } else if (type == 'id'){
        Order.find({'customer_id': parameter}).exec((err, orderData) => {
            if(err) return res.status(500).json({'Error': err});
            if(orderData != null && orderData.length > 0){
                let products = orderData.map((order) => {
                    return order.products;
                })
               let groupProducts = _.groupBy(products,(prod) => {
                   return prod[0].currency;
               });

               for (let item in groupProducts){
                   totalSpent = 0;
                   groupProducts[item].forEach((element)=>{
                    totalSpent += element[0].item_price;
                })
                let spentData = {
                    total: totalSpent,
                    currency: item
                }
                objectSpent.push(spentData);

               }
                return res.status(200).json({'response': objectSpent});
                
            } else {
                return res.status(404).json({'Message': 'No orders found'})
            }
        })
    }
})

module.exports = router;