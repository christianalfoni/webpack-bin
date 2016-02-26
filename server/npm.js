var npmExtractor = require('npm-extractor');
var memoryFs = require('./memoryFs.js');
var utils = require('./utils');
var path = require('path');
var request = require('request');

module.exports = {
  loadPackages: function (packages) {
    console.log('Load packages', packages, Object.keys(packages));
    return Promise.all(Object.keys(packages).map(function (key) {
      return npmExtractor({
        package: key,
        targetFs: memoryFs.fs,
        version: packages[key],
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
      var entryFile = memoryFs.fs.readFileSync(path.join('/node_modules/redux', packagesData[0].main)).toString();
      entryFile += '\ndelete exports.__esModule;';
      memoryFs.fs.writeFileSync(path.join('/node_modules/redux', packagesData[0].main), entryFile);
      var entries = packagesData.reduce(function (entries, packageData) {
        entries[packageData.name] = '.' + path.resolve('/', 'node_modules', packageData.name, packageData.main || 'index.js');
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
    request('http://registry.npmjs.org/' + name, function (err, response, body) {
      if (err || response.statusCode < 200  || response.statusCode >= 300) {
        return res.sendStatus(404);
      }
      var package = JSON.parse(body);
      var validVersion = !version || version in package.versions;
      if (!validVersion) {
        return res.sendStatus(404);
      }
      res.send({
        name: package.name,
        version: version || utils.getLatestNpmVersion(package.versions)
      });
    });
  }
};
