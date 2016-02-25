var db = require('./database.js');
var vendorsBundler = require('./vendorsBundler.js');
var sessionBundler = require('./sessionBundler.js');
var memoryFs = require('./memoryFs');
var utils = require('./utils');
var sessions = require('./sessions');
var npm = require('./npm');
var path = require('path');
var mime = require('mime');

var createIndex = function (req) {
  return [
    '<!DOCTYPE html>',
    '<html>',
    ' <head>',
    '   <script>',
    '     window.addEventListener("load", function () {window.parent.postMessage({type: "loaded"}, location.origin)});',
    '   </script>',
    ' </head>',
    ' <body>',
    '   <div id="app"></div>',
    req.session.vendorsBundleName ? '   <script src="/api/sandbox/vendors/' + req.session.vendorsBundleName + '/bundle.js" defer></script>' : '',
    '   <script src="/api/sandbox/webpackbin_bundle.js" defer></script>',
    ' </body>',
    '</html>'
  ].join('\n')
}

module.exports = {
  getIndex: function (req, res) {
    res.type('html');
    res.send(createIndex(req));
  },
  getFile: function (req, res, next) {
    console.log('requesting', req.url);
    if (/webpackbin_bundle\.js/.test(req.url)) {
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.setHeader('Expires', '-1');
      res.setHeader('Pragma', 'no-cache');
      req.url = req.url.replace('webpackbin_bundle.js', req.session.id + '/webpackbin_bundle.js');
      req.session.middleware(req, res, next);
      return;
    }

    if (/\/api\/sandbox\/vendors/.test(req.url)) {
      console.log('Getting vendors bundle', req.url);
      var fileName = path.basename(req.url);
      var content = memoryFs.fs.readFileSync(req.url);
      res.setHeader('Cache-Control', 'public, max-age=3600000');
      res.setHeader("Content-Type", mime.lookup(fileName));
      res.setHeader("Content-Length", content.length);
      res.send(content);
      return
    }
  },
  updateSandbox: function (req, res, next) {

    memoryFs.updateSessionFiles(req.session, req.body.files);

    if (req.session.middleware && req.session.vendorsBundleName !== utils.getVendorsBundleName(req.body.packages)) {
      console.log('Removing middleware from session');
      sessions.removeMiddleware(req);
    }

    sessions.updateVendorsBundle(req);

    console.log('Requested vendors: ', req.body.packages);
    console.log('Middleware: ', Boolean(req.session.middleware));
    console.log('Vendors: ', req.session.vendorsBundleName);

    if (
      !req.session.middleware &&
      utils.hasPackages(req) &&
      !memoryFs.hasVendorsBundle(req.body.packages)
    ) {

      // Create new Bin
      console.log('No vendors in memory');
      db.getVendorsBundle(utils.getVendorsBundleName(req.body.packages))
        .then(function (bundle) {
          if (bundle) {
            memoryFs.writeBundleManifest(bundle);
            return db.loadVendorsBundle(bundle);
          } else {
            return npm.loadPackages(req.body.packages)
              .then(vendorsBundler.compile)
              .then(db.saveVendorsBundle)
              .then(npm.removePackages)
              .then(db.uploadVendorsBundle);
          }
        })
        .then(sessionBundler.create(req.session))
        .then(sessions.createBundleMiddleware(req, res, next))
        .then(function () {

          // Update bin in database, but do not wait to finish
          db.updateBin(req);
        })
        .catch(utils.logError);

    } else if (
      !req.session.middleware &&
      utils.hasPackages(req) &&
      memoryFs.hasVendorsBundle(req.body.packages)
    ) {
      console.log('Vendors in memory');
      db.getVendorsBundleEntries(utils.getVendorsBundleName(req.body.packages))
        .then(function (bundle) {
          console.log('Got the bundle in DB?', Boolean(bundle));
          if (bundle) {
            return bundle;
          } else {
            return npm.loadPackages(req.body.packages)
              .then(vendorsBundler.compile)
              .then(db.saveVendorsBundle)
              .then(npm.removePackages)
              .then(db.uploadVendorsBundle);
          }
        })
        .then(sessionBundler.create(req.session))
        .then(sessions.createBundleMiddleware(req, res, next))
        .then(function () {

          // Update bin in database, but do not wait to finish
          db.updateBin(req);
        })
        .catch(utils.logError);

    } else if (
      !req.session.middleware
    ) {
      sessionBundler.create(req.session)()
        .then(sessions.createBundleMiddleware(req, res, next))
        .then(function () {

          // Update bin in database, but do not wait to finish
          db.updateBin(req);
        })
        .catch(utils.logError);
    } else {

      if (req.session.currentBin.isOwner) {
        res.send({});

        // Update bin in database, but do not wait to finish
        db.updateBin(req);
      } else {
        db.updateBin(req).then(function (bin) {
          sessions.update(req.session.id, 'currentBin', {
            id: bin.id,
            isOwner: true
          });
          res.send(bin);
        });
      }

    }
  }
};
