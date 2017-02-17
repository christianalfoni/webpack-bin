'use strict'

var db = require('./database.js');
var sessionBundler = require('./sessionBundler.js');
var memoryFs = require('./memoryFs');
var utils = require('./utils');
var sessions = require('./sessions');
var npm = require('./npm');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var vendorsBundlesCleaner = require('./vendorsBundlesCleaner.js');
var decoder = require('string_decoder');
var request = require('request');

var wbtools = fs.readFileSync(path.resolve('server', 'wbTools.js')).toString();

module.exports = {
  indexFiles: function(req, res) {
    utils.setHeaders(res);
    res.type('html');

    res.send(memoryFs.index(req.session.id));
  },

  getIndex: function (req, res) {
    utils.setHeaders(res);
    res.type('html');

    if (utils.isLive(req)) {
      res.send(
        memoryFs.getSessionFile(req.session.currentBin.author, 'index.html')
      );
    } else {
      res.send(memoryFs.getSessionFile(req.session.id, 'index.html'));
    }

  },


  getTest: function(req, res) {


    utils.setHeaders(res)
    res.type('html');


    res.send(memoryFs.getSessionFile(req.session.id, 'test.html'));
  },


  getFile: function (req, res, next) {
    req.url = req.url.replace('/subdomain/sandbox', '');

    if (/wbtools/.test(req.url)) {
      utils.setHeaders(res);
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

    if (utils.isLive(req)) {
      utils.setHeaders(res)
      var fileName = utils.getFileName(req);
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

    utils.setHeaders(res);

    if (path.basename(req.url) === utils.getEntry(req.session.files)) {
      req.url = '/api/sandbox/' + req.session.id + '/webpackbin_bundle.js';
      req.session.middleware(req, res, next);

    } else {


      var fileName = path.basename(req.url);
      var content = memoryFs.getSessionFile(req.session.id, fileName)

      // if (fileName === 'tests' && content === null) {
      //   memoryFs.updateSessionTests()
      //   content = memoryFs.getSessionFile(req.session.id, fileName);
      // }

      if (content === null) {
        console.log('Content is null!');
        console.log('Filename was', fileName);
        return res.sendStatus(404);
      }
      res.setHeader("Content-Type", mime.lookup(fileName));
      res.setHeader("Content-Length", content.length);

      res.send(content);
    }

  },
  updateSandbox: function (req, res, next) {

    utils.checkMiddlewareForChanges(req);

    var hasChangedLoaders = !utils.isSameLoaders(req.session.loaders, req.body.loaders);

    sessions.updatePackages(req);
    sessions.updateLoaders(req);
    sessions.updateFiles(req);
    memoryFs.updateSessionFiles(req.session, req.body.files);
    memoryFs.updateSessionTests(req, req.body.tests);
    vendorsBundlesCleaner.update(req);
    utils.checkCurrentBin(req);


    if (
      !req.session.middleware &&
      utils.hasPackages(req)
    ) {

      let vendors = !memoryFs.hasVendorsBundle(req.body.packages)

      let bundle = vendors ?
      db.getVendorsBundle(req) :
      db.getVendorsBundleEntries(req)

      bundle
        .then(function (bundle) {
          if (bundle) {
            memoryFs.writeBundleManifest(bundle);
            return db.loadVendorsBundle(bundle)
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
          } else {
            return npm.loadPackages(req.body.packages)
              .then(function (bundle) {
                res.send({
                  isFetchingVendorsBundle: true,
                  id: bundle.id
                });
              })
              .catch(function (err) {
                res.status(500).send({
                  message: err.message
                });
                throw err;
              })
          }
        });

    } else if (
      !req.session.middleware ||
      hasChangedLoaders
    ) {
      sessionBundler.create(req.session)

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
        console.log('Do nothing');
        res.send({});
        db.updateBin(req);
      } else {

        db.updateBin(req).then(function (bin) {

          // Send the data to the user server to update the record.
          var body = {
            user : req.query.user,
            course: req.session.currentBin.id,
            bin: bin.id
          }
          request.put({
            url: 'http://localhost:3000/api/users/' + req.session.id,
            body: body,
            json: true
          }, (err) => {
            if (err) console.log('Error updating user record:', err)
          })

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
