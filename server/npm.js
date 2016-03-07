var npmExtractor = require('npm-extractor');
var memoryFs = require('./memoryFs.js');
var utils = require('./utils');
var path = require('path');
var request = require('request');
var db = require('./database');

module.exports = {
  loadPackages: function (packages) {
    console.log('Load packages', packages, Object.keys(packages));
    return Promise.all(Object.keys(packages).map(function (key) {
      return npmExtractor({
        package: key,
        targetFs: memoryFs.fs,
        version: packages[key],
        allPackages: Object.keys(packages),
        options: {
          registry: 'http://registry.npmjs.org/',
          mindelay: 5000,
          maxDelay: 10000,
          retries: 5,
          factor: 5
        },
        tempPath: path.resolve('temp'),
        memoryPath: '/node_modules'
      });
    }))
    .then(function (packagesData) {
      var entries = packagesData.reduce(function (entries, packageData) {
        var packageEntry = packageData.main || 'index.js';
        if (packageData.browser && packageData.browser[packageData.main]) {
          packageEntry = packageData.browser[packageData.main];
        }
        entries[packageData.name] = '.' + path.resolve('/', 'node_modules', packageData.name, packageEntry);
        return entries;
      }, {});
      return {
        name: utils.getVendorsBundleName(packages),
        entries: entries,
        packages: packages
      };
    })
    .catch(function (err) {
      console.log(err);
    });
  },
  removePackages: function (bundle) {
    console.log('Removing vendor packages', Object.keys(bundle.entries));
    Object.keys(bundle.entries).forEach(function (entry) {
      memoryFs.fs.rmdirSync(path.join('/', 'node_modules', entry));
    });
    return bundle;
  },
  getPackageFromRegistry: function (req, res) {
    var nameSplit = req.params.packageName.split('@');
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
