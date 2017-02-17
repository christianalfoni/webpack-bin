var request = require('request');
var memoryFs = require('./memoryFs.js');
var utils = require('./utils');
var path = require('path');
var request = require('request');
var db = require('./database');

module.exports = {
  checkBundle: function (req, res) {
    return new Promise(function (resolve, reject) {
      request({
        uri: utils.isProduction() ? 'http://npm-extractor.herokuapp.com/queue/' + req.params.id : 'http://localhost:5000/queue/' + req.params.id,
        method: 'GET',
        json: true
      }, function (err, response) {
        if (err) {
          return reject(err);
        }
        resolve(response.body);
      })
    })
    .then(function (bundle) {
      if (bundle.isDone) {
        return db.saveVendorsBundle(bundle)
          .then(db.uploadVendorsBundle)
          .then(db.getVendorsBundle(req))
          .then(function (bundle) {
            memoryFs.writeBundleManifest(bundle);
            return db.loadVendorsBundle(bundle);
          })
          .then(function () {
            res.send({
              id: bundle.id,
              isDone: bundle.isDone
            });
          });
      } else {
        res.send({
          id: bundle.id,
          isDone: bundle.isDone
        });
      }
    })
    .catch(function (err) {
      res.status(500).send({
        message: err.message
      });
      throw err;
    });
  },
  loadPackages: function (packages) {
    return new Promise(function (resolve, reject) {
      request({
        uri: utils.isProduction() ? 'http://npm-extractor.herokuapp.com/extract' : 'http://localhost:5000/extract',
        method: 'POST',
        json: true,
        body: {
          packages: packages
        }
      }, function (err, response) {
        if (err) {
          if (err.message.indexOf('ECONNREFUSED') >= 0) {
            return reject(new Error('PACKAGE_EXTRACTOR_DOWN'));
          }
          return reject(err);
        }
        if (response.body.inProgress) { // Maybe start polling here instead
          return reject(new Error('PACKAGE_EXTRACTOR_RUNNING'));
        }
        resolve(response.body);
      })
    })
  },
  getPackageFromRegistry: function (req, res) {
    var nameSplit = req.params.packageName.split('@');

    // If leading @
    if (!nameSplit[0]) {
      nameSplit.shift();
      nameSplit[0] = '@' + encodeURIComponent(nameSplit[0]);
    }

    var name = nameSplit[0];
    var version = nameSplit[1];

    new Promise(function (resolve, reject) {
      request('http://registry.npmjs.org/' + name, function (err, response, body) {
        if (err || response.statusCode < 200  || response.statusCode >= 300) {
          return res.sendStatus(404);
        }
        var package = JSON.parse(body);
        var validVersion = !version || version in package.versions;
        if (!validVersion) {
          return reject();
        }
        resolve(package);
      });
    })
    .then(function (package) {
      var packageVersion = version || utils.getLatestNpmVersion(package.versions);
      res.send({
        name: package.name,
        version: packageVersion
      });
    })
    .catch(function (err) {
      console.log(err, err.stack);
      res.sendStatus(404);
    })
  }
};
