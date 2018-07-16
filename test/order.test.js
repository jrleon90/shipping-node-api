const request = require('supertest');
const app = require('../app');
const Order = require('../model/order');
const Customer = require('../model/customer');


describe('Create Order', function() {
    this.timeout(5000);
    it('Creates a new order', (done) => {
        Customer.find({},'_id', {sort:{_id: -1}, limit: 1}).exec((err, data) => {
            request(app).post('/order')
            .send({
                customer_id: data[0]._id, 
                products: [
                    {
                        item_name: 'MacBook',
                        item_price: 1700,
                        item_quantity: 2,
                        currency: 'EUR'
                    }
                ]
            })
            .expect(200, done)
        })
        
    });
   
})



describe('Get Orders', function() {
    it('Get orders from an specific customer by giving the name', (done) => {
        request(app).get('/order/customer/john%20smith?type=name')
            .expect(200, done);
    });

    it('Get orders from an specific customer by giving the address', (done) => {
        request(app).get('/order/customer/avenue%204?type=address')
            .expect(200, done);
    });
})

describe('Get customer that bought an specific item', function(){
    it('Get a list of customers that bought an item',(done)=>{
        request(app).get('/order/item/MacBook')
            .expect(200,done);
    })
})

describe('Get orders from an specific customer', function(){
    it('Get a list of the orders made by a customer name', (done)=>{
        request(app).get('/customer/orders/new%20test%20customer?type=name')
            .expect(200, done)
    });

    it('Get a list of the orders made by a customer Id', (done)=>{
        Customer.find({},'_id', {sort:{_id: -1}, limit: 1}).exec((err, data) => {
            request(app).get('/customer/orders/'+data[0]._id+'?type=id')
            .expect(200, done)
        })


    })
})

describe('Get the total spent by a customer', function() {
    it('Get the total of money spent by a customer with the customer name', (done) => {
        request(app).get('/customer/spent/new%20test%20customer?type=name')
            .expect(200, done)
    });
    it('Get the total of money spent by a customer with the customer Id', (done) => {
        Customer.find({},'_id', {sort:{_id: -1}, limit: 1}).exec((err, data) => {
            request(app).get('/customer/spent/'+data[0]._id+'?type=id')
                .expect(200, done)
        })
    });
})

describe('Delete New Order', function(){
    it('Delete new order created', (done) => {
        Order.find({},'_id', {sort:{_id: -1}, limit: 1}).exec((err, data)=>{
            request(app).delete('/order/'+data[0]._id)
                .expect(200, done);
        })
    })
})

describe('Delete new Customer', function() {
    it('Delete last customer added in the test', (done) => {
        Customer.find({},'_id', {sort:{_id: -1}, limit: 1}).exec((err, data) =>{
            request(app).delete('/customer/'+data[0]._id)
                .expect(200, done);
        })
    })
})
