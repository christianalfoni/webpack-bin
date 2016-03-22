var request = require('request');
var memoryFs = require('./memoryFs.js');
var utils = require('./utils');
var path = require('path');
var request = require('request');
var db = require('./database');

module.exports = {
  loadPackages: function (packages) {
    return new Promise(function (resolve, reject) {
      request({
        uri: utils.isProduction() ? 'http://npm-extractor.herokuapp.com/extract' : 'http://localhost:5000/extract',
        method: 'POST',
        json: true,
        timeout: 1000 * 60 * 5,
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
        if (response.body.isRunning) {
          throw new Error('PACKAGE_EXTRACTOR_RUNNING');
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
