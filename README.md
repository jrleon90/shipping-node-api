# Shipping NodeJS API

## Table of Content

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Live Example](#live_example)
4. [API Docs](#api_docs)

## Introduction <a name="introduction"></a>

This is an API developed with NodeJS using Express as a framework, it basically helps to keep control of different aspects of a shipping business like Orders and Customers.

## Installation <a name="installation"></a>

1. Clone this repository
2. Run ```npm install```
3. Change file ```.example.env``` to ```.env```
4. Add your MongoDB URL to the ```.env``` file

## Live Example <a name="example"></a>
There is a Live example for this API deployed in Heroku. In order to use it, you have to make all the requests to the following URI:
```
https://shipping-node-api.herokuapp.com
```

## API Docs <a name="api_docs"></a>

1. **Create Customer**

Send POST request to the following URI:
```
https://shipping-node-api.herokuapp.com/customer
```

Inside the POST body, it should be a JSON object with the following structure:

```
{
    customer_name: ------
    customer_address: ------    
    customer_phone: -----
}
```

2. **Get a Customer**

You can get information about a Customer by using the customer name or the address.

In order to do this, make a GET request to:

```
https://shipping-node-api.herokuapp.com/customer/<customer_name or customer_address>?type=<name or address>
```

3. **Update Customer info**

In order to Update a customer info, send a PUT request to:

```
https://shipping-node-api.herokuapp.com/customer/<costumer_id>
```

With the request, send inside the body the changes that you want to make in JSON format.

```
{
    customer_name: 'new name',
    customer_address: 'new address',
    customer_phone: 'new phone'
}
```

4. **Create a new Order**

To create a new order, send a POST request to:

```
https://shipping-node-api.herokuapp.com/order
```

Inside the body of the request, send a JSON object with the following information:

```
{
    customer_id: ----(string),
    products:[
        {
            item_name:----(string),
            item_price:---(number),
            item_quantity:----(number),
            currency:----(string)
        }
    ]
}
```

5. **Get Orders from a customer**

You can get the orders of a customer by giving the customer name or the customer address.

In order to do that, send a GET request to:

```
https://shipping-node-api.herokuapp.com/order/<customer_name or customer_address>?type=<name or address>
```

6. **Get a List of customer that bought an specific product**

Send GET request to:

```
https://shipping-node-api.herokuapp.com/customer/orders/<item_name>
```

7. **Get the total spent by customer**

You can get the total spent by a customer by giving the customer name or the customer id.

Send GET request to:

```
https://shipping-node-api.herokuapp.com/customer/spent/<customer_name or customer_id>?type=<name or id>
```

The response it would be a JSON file with all the money spent by a customer in the different currencies.

8. **Delete Order**

To delete an order, send DELETE request to:

```
https://shipping-node-api.herokuapp.com/order/<order_id>
```

9. **Delete Customer**

To delete a customer, send DELETE request to:

```
https://shipping-node-api.herokuapp.com/customer/<customer_id>
```

