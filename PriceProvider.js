var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

PriceProvider = function(host, port) {
  this.db= new Db('priceDb', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


PriceProvider.prototype.getCollection= function(callback) {
  this.db.collection('mysmartprice', function(error, collection) {
    if( error ) callback(error);
    else callback(null, collection);
  });
};

PriceProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error)
      else {
        collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

PriceProvider.prototype.findByName = function(name, callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error)
      else {
        collection.findOne({"name": { "$regex" : name, "$options": 'i' }}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};



PriceProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, collection) {
      if( error ) callback(error)
      else {
        collection.findOne({_id: collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

exports.PriceProvider = PriceProvider;