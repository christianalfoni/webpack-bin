var db = require('./database.js');
var vendorsBundler = require('./vendorsBundler.js');
var sessionBundler = require('./sessionBundler.js');
var memoryFs = require('./memoryFs');
var utils = require('./utils');
var sessions = require('./sessions');
var npm = require('./npm');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var vendorsBundlesCleaner = require('./vendorsBundlesCleaner.js');

var wbtools = fs.readFileSync(path.resolve('server', 'wbTools.js')).toString();

module.exports = {
  getIndex: function (req, res) {
    res.type('html');
    if (
      req.session.currentBin &&
      req.session.currentBin.isLive &&
      !req.session.currentBin.isOwner
    ) {
      res.send(memoryFs.getSessionFile(req.session.currentBin.author, 'index.html'));
    } else {
      res.send(memoryFs.getSessionFile(req.session.id, 'index.html'));
    }

  },
  getFile: function (req, res, next) {
    req.url = req.url.replace('/subdomain/sandbox', '');

    if (/wbtools/.test(req.url)) {
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.setHeader('Expires', '-1');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader("Content-Type", mime.lookup('wbtools.js'));
      res.setHeader("Content-Length", wbtools.length);
      return res.send(wbtools);
    }

    if (/\/sandbox\/vendors/.test(req.url)) {
      var fileName = path.basename(req.url);
      if (!memoryFs.fs.existsSync(req.url)) {
        return res.sendStatus(404);
      }
      var content = memoryFs.fs.readFileSync(req.url);
      res.setHeader('Cache-Control', 'public, max-age=3600000');
      res.setHeader("Content-Type", mime.lookup(fileName));
      res.setHeader("Content-Length", content.length);
      res.send(content);
      return;
    }

    if (
      req.session.currentBin &&
      req.session.currentBin.isLive &&
      !req.session.currentBin.isOwner
    ) {
      res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.setHeader('Expires', '-1');
      res.setHeader('Pragma', 'no-cache');
      var fileName = path.basename(req.url);
      var filePath = '/api/sandbox/' + req.session.currentBin.author + '/' + fileName;
      if (!memoryFs.fs.existsSync(filePath)) {
        return res.sendStatus(404);
      }
      var content = memoryFs.fs.readFileSync(filePath);
      res.setHeader("Content-Type", mime.lookup(fileName));
      res.setHeader("Content-Length", content.length);
      res.send(content);
      return;
    }

    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Expires', '-1');
    res.setHeader('Pragma', 'no-cache');

    if (path.basename(req.url) === utils.getEntry(req.session.files)) {
      req.url = '/api/sandbox/' + req.session.id + '/webpackbin_bundle.js';
      req.session.middleware(req, res, next);
    } else {
      var fileName = path.basename(req.url);
      var content = memoryFs.getSessionFile(req.session.id, fileName)
      if (content === null) {
        return res.sendStatus(404);
      }
      res.setHeader("Content-Type", mime.lookup(fileName));
      res.setHeader("Content-Length", content.length);
      res.send(content);
    }

  },
  updateSandbox: function (req, res, next) {

    var currentEntryFile = utils.getEntry(req.session.files);

    if (
      req.session.middleware &&
      (
        utils.getVendorsBundleName(req.session.packages) !== utils.getVendorsBundleName(req.body.packages) ||
        currentEntryFile !== utils.getEntry(req.body.files)
      )
    ) {
      sessions.removeMiddleware(req);
    }

    var hasChangedLoaders = !utils.isSameLoaders(req.session.loaders, req.body.loaders);
    sessions.updatePackages(req);
    sessions.updateLoaders(req);
    sessions.updateFiles(req);
    memoryFs.updateSessionFiles(req.session, req.body.files);
    vendorsBundlesCleaner.update(req);

    if (!req.session.currentBin || req.session.currentBin.id !== req.body.id) {
      sessions.update(req.session.id, 'currentBin', {
        id: req.body.id,
        isOwner: false
      });
    }

    if (
      !req.session.middleware &&
      utils.hasPackages(req) &&
      !memoryFs.hasVendorsBundle(req.body.packages)
    ) {

      // Create new Bin
      db.getVendorsBundle(utils.getVendorsBundleName(req.body.packages))
        .then(function (bundle) {
          if (bundle) {
            memoryFs.writeBundleManifest(bundle);
            return db.loadVendorsBundle(bundle);
          } else {
            return npm.loadPackages(req.body.packages)
              .then(db.saveVendorsBundle)
              .then(db.uploadVendorsBundle)
              .then(db.getVendorsBundle(utils.getVendorsBundleName(req.body.packages)))
              .then(function (bundle) {
                memoryFs.writeBundleManifest(bundle);
                return db.loadVendorsBundle(bundle);
              })
              .catch(function (err) {
                res.status(500).send({
                  message: err.message
                });
                throw err;
              })
          }
        })
        .then(sessionBundler.create(req.session))
        .then(sessions.createBundleMiddleware(req.session))
        .then(function () {
          if (req.session.currentBin.id) {
            res.send({});
            db.updateBin(req);
          } else {
            db.updateBin(req)
              .then(function (bin) {
                sessions.update(req.session.id, 'currentBin', {
                  id: bin.id,
                  isOwner: true
                });
                res.send(bin);
              })
              .catch(utils.logError)
          }
        })
        .catch(utils.logError);

    } else if (
      !req.session.middleware &&
      utils.hasPackages(req) &&
      memoryFs.hasVendorsBundle(req.body.packages)
    ) {
      db.getVendorsBundleEntries(utils.getVendorsBundleName(req.body.packages))
        .then(function (bundle) {
          if (bundle) {
            return bundle;
          } else {
            return npm.loadPackages(req.body.packages)
              .then(db.saveVendorsBundle)
              .then(db.uploadVendorsBundle)
              .then(db.getVendorsBundle(utils.getVendorsBundleName(req.body.packages)))
              .then(function (bundle) {
                memoryFs.writeBundleManifest(bundle);
                return db.loadVendorsBundle(bundle);
              })
              .catch(function (err) {
                res.sendStatus(500);
                throw err;
              });
          }
        })
        .then(sessionBundler.create(req.session))
        .then(sessions.createBundleMiddleware(req.session))
        .then(function () {
          if (req.session.currentBin.id) {
            res.send({});
            db.updateBin(req);
          } else {
            db.updateBin(req)
              .then(function (bin) {
                sessions.update(req.session.id, 'currentBin', {
                  id: bin.id,
                  isOwner: true
                });
                res.send(bin);
              });
          }
        })
        .catch(utils.logError);

    } else if (
      !req.session.middleware ||
      hasChangedLoaders
    ) {
      db.getVendorsBundleEntries(utils.getVendorsBundleName(req.body.packages))
        .then(sessionBundler.create(req.session))
        .then(sessions.createBundleMiddleware(req.session))
        .then(function () {
          if (req.session.currentBin.id) {
            res.send({});
            db.updateBin(req);
          } else {
            db.updateBin(req)
              .then(function (bin) {
                sessions.update(req.session.id, 'currentBin', {
                  id: bin.id,
                  isOwner: true
                });
                res.send(bin);
              });
          }
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
