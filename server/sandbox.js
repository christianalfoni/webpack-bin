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
    req.session.vendorsBundle ? '   <script src="/api/sandbox/vendors/' + req.session.vendorsBundle + '/bundle.js" defer></script>' : '',
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
    if (/webpackbin_bundle\.js/.test(req.url)) {
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

    if (req.session.middleware && req.session.vendorsBundle !== utils.getVendorsBundleName(req.body.packages)) {
      console.log('Removing middleware from session');
      sessions.removeMiddleware(req);
    }

    sessions.updateVendorsBundle(req);

    console.log('Requested vendors: ', req.body.packages);
    console.log('Middleware: ', Boolean(req.session.middleware));
    console.log('Vendors: ', req.session.vendorsBundle);

    if (
      !req.session.middleware &&
      utils.hasPackages(req) &&
      !memoryFs.hasVendorsBundle(req.body.packages)
    ) {

      return db.getVendorsBundle(req.body.packages)
        .then(function (bundle) {
          if (bundle) {
            memoryFs.writeBundle(bundle);
            return {
              vendorsBundle: bundle.name,
              entries: bundle.entries
            };
          } else {
            return npm.loadPackages(req.body.packages)
              .then(vendorsBundler.compile)
              .then(db.uploadVendorsBundle);
          }
        })
        .then(sessionBundler.create(req.session))
        .then(sessions.createBundleMiddleware(req, res, next))
        .catch(utils.logError);

    } else if (
      !req.session.middleware &&
      utils.hasPackages(req) &&
      memoryFs.hasVendorsBundle(req.body.packages)
    ) {

      db.getVendorsBundleEntries(req.body.packages)
        .then(sessionBundler.create(req.session))
        .then(sessions.createBundleMiddleware(req, res, next))
        .catch(utils.logError);

    } else if (
      !req.session.middleware
    ) {
      sessionBundler.create(req.session)()
        .then(sessions.createBundleMiddleware(req, res, next))
        .catch(utils.logError);
    } else {
      res.send({});
    }
  }
};
