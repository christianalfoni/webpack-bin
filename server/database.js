var db = require('./mongodb.js');
var memoryFs = require('./memoryFs.js');
var utils = require('./utils');
var path = require('path');

module.exports = {
  connect: db.connect,
  getVendorsBundle: function (packages) {
    var bundleName = utils.getVendorsBundleName(packages);
    return db.findOne('bundles', {name: bundleName})
      .then(function (bundle) {
        return bundle;
      });
  },
  getVendorsBundleEntries: function (packages) {
    var bundleName = utils.getVendorsBundleName(packages);
    return db.findOne('bundles', {name: bundleName}, {entries: 1, name: 1})
      .then(function (bundle) {
        return {
          vendorsBundle: bundle.name,
          entries: bundle.entries
        };
      });
  },
  uploadVendorsBundle: function (result) {
    var bundleName = result.bundleName;
    var packagesData = result.packagesData;
    var manifest = JSON.parse(memoryFs.fs.readFileSync(path.join('/', 'api', 'sandbox', 'vendors', bundleName, 'manifest.json')).toString());

    var entries = packagesData.reduce(function (entries, packageData) {
      entries[packageData.name] = '.' + path.resolve('/', 'node_modules', packageData.name, packageData.main || 'index.js');
      return entries;
    }, {});
    return db.insert('bundles', {
      name: bundleName,
      entries: entries,
      content: memoryFs.fs.readFileSync(path.join('/', 'api', 'sandbox', 'vendors', bundleName, 'bundle.js')).toString(),
      manifest: memoryFs.fs.readFileSync(path.join('/', 'api', 'sandbox', 'vendors', bundleName, 'manifest.json')).toString()
    })
    .then(function () {
      return {
        vendorsBundle: bundleName,
        entries: entries
      };
    })
    .catch(utils.logError)
  }
}
