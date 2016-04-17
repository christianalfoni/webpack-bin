var db = require('./mongodb.js');
var memoryFs = require('./memoryFs.js');
var utils = require('./utils');
var path = require('path');
var shortid = require('shortid');
var request = require('request');

module.exports = {
  connect: db.connect,
  createBin: function(req) {
    return db.insert('bins', req.body)
  },
  updateBin: function (req) {
    if (req.session.currentBin.isOwner) {
      return db.update('bins', {
        id: req.session.currentBin.id
      }, {
        $set: {
          updated: Date.now(),
          files: req.body.files,
          packages: utils.convertDots(req.body.packages),
          loaders: req.body.loaders,
          isLive: req.body.isLive
        }
      })
      .then(function () {
        return {
          id: req.session.currentBin.id,
          files: req.body.files,
          loaders: req.body.loaders,
          packages: req.body.packages,
          author: req.session.id,
          isLive: req.body.isLive,
          isOwner: true
        };
      })
    } else {
      return db.findOne('bins', {
        id: req.session.currentBin.id
      })
      .then(function (currentBin) {
        var bin = {
          id: shortid.generate(),
          author: req.session.id,
          packages: req.body.packages,
          loaders: req.body.loaders,
          files: req.body.files,
          isLive: req.body.isLive,
          name: req.body.name,
          readme: req.body.readme,
          subject: req.body.subject
        };
        return db.insert('bins', Object.assign({}, bin, {
          packages: utils.convertDots(bin.packages)
        }))
        .then(function () {
          bin.isOwner = true;
          console.log(`Just created this bin: ${bin.id}`)
          return bin;
        });
      });
    }
  },
  getBin: function (id) {
    return db.findOne('bins', {
      id: id
    })
    .then(function (bin) {
      return Object.assign({}, bin, {
        packages: utils.reconvertDots(bin.packages)
      });
    })
  },
  getVendorsBundle: function (vendorsBundleName) {
    return db.findOne('bundles', {name: vendorsBundleName})
      .then(function (bundle) {
        if (!bundle) {
          return null;
        }
        return Object.assign({}, bundle, {
          entries: utils.reconvertDots(bundle.entries),
          packages: utils.reconvertDots(bundle.packages)
        });
      });
  },
  getVendorsBundleEntries: function (vendorsBundleName) {
    return db.findOne('bundles', {name: vendorsBundleName}, {entries: 1, name: 1, packages: 1, loaders: 1})
      .then(function (bundle) {
        if (!bundle) {
          return null;
        }
        return Object.assign({}, bundle, {
          entries: utils.reconvertDots(bundle.entries),
          packages: utils.reconvertDots(bundle.packages)
        });
      });
  },
  uploadVendorsBundle: function (bundle) {
    return db.insert('bundles', {
      name: bundle.name,
      entries: utils.convertDots(bundle.entries),
      packages: utils.convertDots(bundle.packages),
      manifest: bundle.manifest
    })
    .then(function () {
      return bundle;
    })
    .catch(utils.logError)
  },
  saveVendorsBundle: function (bundle) {
    var vendorsBundleName = bundle.name;
    var baseUrl = utils.isProduction() ? 'http://npm-extractor.herokuapp.com' : 'http://localhost:5000';
    var url = baseUrl + '/bundles/' + vendorsBundleName + '/bundle.js';
    return db.writeFile(vendorsBundleName + '.js',request(url))
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
  vendorsBundleExists: function (vendorsBundleName) {
    return db.search('bundles', {
      name: vendorsBundleName
    })
    .then(function (result) {
      return Boolean(result.length);
    })
    .catch(function (err) {
      console.log(err);
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
      res.send(result.map(function (bundle) {
        return Object.assign({}, bundle, {
          packages: utils.reconvertDots(bundle.packages)
        });
      }));
    })
    .catch(function () {
      res.sendStatus(404);
    });
  }
}
