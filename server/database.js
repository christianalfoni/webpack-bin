var db = require('./mongodb.js');
var memoryFs = require('./memoryFs.js');
var utils = require('./utils');
var path = require('path');

module.exports = {
  connect: db.connect,
  getVendorsBundle: function (vendorsBundleName) {
    return db.findOne('bundles', {name: vendorsBundleName})
      .then(function (bundle) {
        return bundle;
      });
  },
  getVendorsBundleEntries: function (vendorsBundleName) {
    return db.findOne('bundles', {name: vendorsBundleName}, {entries: 1, name: 1, packages: 1})
      .then(function (bundle) {
        return bundle;
      });
  },
  uploadVendorsBundle: function (bundle) {
    var manifest = JSON.parse(memoryFs.fs.readFileSync(path.join('/', 'api', 'sandbox', 'vendors', bundle.name, 'manifest.json')).toString());

    return db.insert('bundles', {
      name: bundle.name,
      entries: bundle.entries,
      packages: bundle.packages,
      manifest: memoryFs.fs.readFileSync(path.join('/', 'api', 'sandbox', 'vendors', bundle.name, 'manifest.json')).toString()
    })
    .then(function () {
      return bundle;
    })
    .catch(utils.logError)
  },
  saveVendorsBundle: function (bundle) {
    var vendorsBundleName = bundle.name;
    var readStream = memoryFs.fs.createReadStream(path.join('/', 'api', 'sandbox', 'vendors', vendorsBundleName, 'bundle.js'))
    return db.writeFile(vendorsBundleName + '.js', readStream)
      .then(function () {
        return bundle;
      });
  },
  loadVendorsBundle: function (bundle) {
    var vendorsBundleName = bundle.name;
    var writeStream = memoryFs.fs.createWriteStream(path.join('/', 'api', 'sandbox', 'vendors', vendorsBundleName, 'bundle.js'))
    return db.readFile(vendorsBundleName + '.js', writeStream)
      .then(function () {
        return bundle;
      });
  },
  searchBundles: function (req, res) {
    var query = {};
    query['packages.' + req.query.packageName] = {
      $exists: true
    };
    db.search('bundles', query, {
      name: 1,
      packages: 1,
      _id: 0
    })
    .then(function (result) {
      res.send(result);
    })
    .catch(function () {
      res.sendStatus(404);
    });
  }
}
