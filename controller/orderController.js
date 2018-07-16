const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

let Order = require('../model/order');
let OrderHistory = require('../model/orderHistory');
let Customer = require('../model/customer');

//Create a new order
router.post('/', (req,res) => {
    if (!req.body.customer_id || !req.body.products)
        return res.status(500).json({'Error': 'Information is missing'});

    Customer.find({'_id': req.body.customer_id}).exec((err, customerData) => {
        if(err) return res.status(500).json({'Error': err});
        if (customerData.length > 0){
            let order = new Order({
                //customer_name: req.body.customer_name,
                //customer_address: req.body.customer_address,
                customer_id: req.body.customer_id,
                products: req.body.products
                });
        
            order.products.forEach((element)=>{
                let item_sale=element.item_quantity*element.item_price;
                OrderHistory.update({item_name: element.item_name},
                                    {$inc:{item_quantity_sales: element.item_quantity,item_sales: item_sale}},
                                    {upsert:true},
                                    (err, data)=>{
                                        if(err) return res.status(500).json({'Error':err});
                                    })
            })
        
            Order.create(order, (err, orderInfo) =>{
                if (err) return res.status(500).json({'Error':err});
                return res.status(200).json({'response': order});
            })
        } else {
            return res.status(404).json({'Message':'Customer Id not found'})
        }   
    })

});

//Get orders of one customer
router.get('/customer/:parameter', (req,res) => {
    const parameter = req.params.parameter.toLowerCase();
    if(req.query.type=='name'){
            Customer.find({'customer_name':parameter})
                .exec((err, customerData) => {
                    if(err) return res.status(500).json({'Error': err});
                    if(customerData != null && customerData.length > 0){
                        Order.find({'customer_id': customerData[0]._id})
                            .exec((err, data) => {
                                if (err) return res.status(500).json({'Error':err});
                                let responseProducts = [];
                                if(data.length > 0){
                                    data.forEach(element => {
                                        let itemsOrder = {
                                        order_id: element._id,
                                        products: element.products
                                        };
                                    responseProducts.push(itemsOrder);
                                    });
                                return res.status(200).json({'Orders': responseProducts});
                                } else
                                    return res.status(404).json({'response': 'Customer not found'});
                            })
                    } else {
                        return res.status(404).json({'Message':'Customer not found'})
                    }
                })
        }
        else if(req.query.type=='address'){
            Customer.find({'customer_address':parameter})
                .exec((err, customerData) => {
                    if(err) return res.status(500).json({'Error':err});
                    if(customerData != null && customerData.length > 0) {
                        Order.find({'customer_id': customerData[0]._id})
                        .exec((err, data) => {
                            if (err) return res.status(500).json({'Error':err});
                            let responseProducts = [];
                            if(data.length > 0){
                                data.forEach(element => {
                                    let itemsOrder = {
                                        order_id: element._id,
                                        products: element.products
                                    };
                                    responseProducts.push(itemsOrder);
                                });
                                return res.status(200).json({'Orders': responseProducts});
                        } else
                                return res.status(404).json({'response': 'Address not found'});
                        })
                    } else {
                        return res.status(404).json({'Message':'Customer not found'})
                    }

                })
    }
    
})

router.get('/list', (req, res) => {
    OrderHistory.find({},null,{sort: {item_name: 1}}).exec((err, data) => {
        if(err) return res.status(500).json({'Error': err});
        data.sort((a,b)=>{return b.item_quantity_sales-a.item_quantity_sales})
        return res.status(200).json({'response':data});
    })
})

router.delete('/:id', (req, res) => {
    const orderId = req.params.id;
    Order.findById(orderId).exec((err,orderData)=>{
        if(err) return res.status(500).json({'Error': err})
        if (orderData.products.length > 0){
            orderData.products.forEach((element)=>{
                let item_sale=element.item_quantity*element.item_price;
                OrderHistory.update({item_name:element.item_name},
                                    {$inc:{item_quantity_sales: -element.item_quantity, item_sales: -item_sale}},
                                    (err,data)=>{
                                        if(err) return res.status(500).json({'Error':err});
                                    })
            });
            Order.deleteOne({_id:orderId},(err)=>{if(err) return res.status(500).json({'Error':err})})
        } else {
            return res.status(404).json({'Message':'Order Not Found'});
        }
    })
    return res.status(200).json({'Message':'Order deleted!'})
})

/*router.put('/:id', (req, res) =>{
    const orderId = req.params.id;
    const updateData = {
        products: req.body.products,
    };
    Order.findById(orderId).exec((err, orderData)=> {
        if(err) return res.status(500).json({'Error':err});
        if (orderData.length > 0){        
            Order.update({_id:orderId},updateData, (err, updatedOrder) => {
            if (err) return res.status(500).json({'Error': err});
            return res.status(200).json({'Message':'Order updated!'})
        })
        } else {
            return res.status(404).json({'Message':'Order not found'});
        }
    })
})*/

router.get('/item/:item_name', (req, res) => {
    const item_name = req.params.item_name;
    const responseArray = [];
    Order.find({'products.item_name': item_name}).exec((err,orderData) => {
        if(err) return res.status(500).json({'Error':err});
        if (orderData != null && orderData.length > 0){
            Customer.find({'_id':orderData[0].customer_id}).exec((err, customerData)=>{
                if(err) return res.status(500).json({'Error':err});
                customerData.forEach((element)=>{
                    let objectInfo = {
                        customer_name: element.customer_name,
                        customer_address: element.customer_address,
                        customer_phone: element.customer_phone
                    };
                    responseArray.push(objectInfo);
                })
                return res.status(200).json({'response':responseArray});
            })
        }else {
            return res.status(404).json({'Message':'Order not found'})
        }
    })
})

module.exports = router;