'use strict';

var dbm;
var type;
var seed;

const Order = require('../model/order');
const async = require('async');
const orderData = [];

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  async.series([
    (callback) => {
      console.log('start');
      Order.find({},(err,data) => {
        console.log('find');
        data.forEach((element) => {
          console.log(element.customer_name);
        })
      })
      callback(null,'one');
    },
    (callback) => {
      return db.createCollection('customers').then((result) => {
        callback(null,'done');
      })
    }    
  ])

};

exports.down = function(db) {
  return db.dropCollection('customers');
};

exports._meta = {
  "version": 1
};
