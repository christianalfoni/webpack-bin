var utils = require('./utils.js');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var Grid = require('gridfs-stream');
var db = null;
var gfs = null;

module.exports = {
  connect: function (url) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function(err, connectedDb) {
        if (err) {
          return reject(err);
        }
        gfs = new Grid(connectedDb, mongo);
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
  },
  writeFile: function (fileName, readStream) {
    return new Promise(function (resolve, reject) {
      var writeStream = gfs.createWriteStream({
        filename: fileName
      });
      writeStream.on('finish', function (err) {
        if (err) {
          return reject(err);
        }
        resolve();
      })
      readStream.pipe(writeStream);
    });
  },
  readFile: function (fileName, writeStream) {
    return new Promise(function (resolve, reject) {
      var readStream = gfs.createReadStream({
        filename: fileName
      });
      readStream.on('close', function (err) {
        if (err) {
          return reject(err);
        }
        resolve();
      })
      readStream.pipe(writeStream);
    });
  },
  search: function (collectionName, query, options) {
    return new Promise(function (resolve, reject) {
      var collection = db.collection(collectionName);
      collection.find(query, options || {}).toArray(function (err, docs) {
        if (err) {
          return reject(err);
        }
        resolve(docs);
      });
    });
  }
};
