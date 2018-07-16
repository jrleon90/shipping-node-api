const request = require('supertest');
const app = require('../app');
const Order = require('../model/order');
const Customer = require('../model/customer');

describe('Create Customer', function() {
    this.timeout(5000);
    it('Creates a new customer', (done) => {
        request(app).post('/customer')
            .send({
                customer_name: 'test',
                customer_address: 'test avenue',
                customer_phone: '123456'
            })
            .expect(200, done)
    });
   
})

describe('Get Customer', function() {
    it('Get Customer by giving the name', (done) => {
        request(app).get('/customer/john%20smith?type=name')
            .expect(200, done);
    });

    it('Get Customer by giving the address', (done) => {
        request(app).get('/customer/test%20avenue?type=address')
            .expect(200, done);
    });
})

describe('Update Customer info', function() {
    it('Update information of the test customer', (done)=>{
        Customer.find({},'_id', {sort:{_id: -1}, limit: 1}).exec((err, data) =>{
            request(app).put('/customer/'+data[0]._id)
                .send({
                    customer_name: 'new test customer',
                    customer_address: 'new address'
                })
                .expect(200, done)
        })
    })
})

