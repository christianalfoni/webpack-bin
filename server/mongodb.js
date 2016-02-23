var utils = require('./utils.js');
var MongoClient = require('mongodb').MongoClient;
var db = null;

module.exports = {
  connect: function (url) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function(err, connectedDb) {
        if (err) {
          return reject(err);
        }
        db = connectedDb;
        resolve();
      });
    })
  },
  findOne: function (collectionName, query, options) {
    return new Promise(function (resolve, reject) {
      var collection = db.collection(collectionName);
      collection.findOne(query, options || {}, function (err, doc) {
        if (err) {
          return reject(err);
        }
        resolve(doc);
      });
    });
  },
  insert: function (collectionName, doc) {
    return new Promise(function (resolve, reject) {
      var collection = db.collection(collectionName);
      collection.insert(doc, function (err, doc) {
        if (err) {
          return reject(err);
        }
        resolve(doc);
      });
    });
  }
};
