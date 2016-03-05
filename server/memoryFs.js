var MemoryFileSystem = require('memory-fs');
var path = require('path');
var fs = new MemoryFileSystem();
var utils = require('./utils');

module.exports = {
  fs: fs,
  updateSessionFiles: function (session, files) {
    if (!fs.existsSync(path.join('/', 'api', 'sandbox', session.id))) {
      fs.mkdirpSync(path.join('/', 'api', 'sandbox', session.id));
    }

    files.forEach(function (file) {
      fs.writeFileSync(path.join('/', 'api', 'sandbox', session.id, file.name), file.content || ' ');
    });

    var deletedFiles = files.reduce(function (deletedFiles, file) {
      if (deletedFiles.indexOf(file.name) >= 0) {
        deletedFiles.splice(deletedFiles.indexOf(file.name), 1);
      }
      return deletedFiles;
    }, session.files.slice());
    deletedFiles.forEach(function (fileName) {
      fs.unlinkSync(path.join('/', 'api', 'sandbox', session.id, fileName));
    });
  },
  hasVendorsBundle: function (packages) {
    var vendorsBundleName = utils.getVendorsBundleName(packages);
    return fs.existsSync(path.join('/', 'api', 'sandbox', 'vendors', vendorsBundleName,  '/bundle.js'));
  },
  removeVendorsBundle: function (vendorsBundleName) {
    fs.unlinkSync(path.join('/', 'api', 'sandbox', 'vendors', vendorsBundleName,  '/bundle.js'));
    fs.unlinkSync(path.join('/', 'api', 'sandbox', 'vendors', vendorsBundleName,  '/manifest.json'));
  },
  writeBundleManifest: function (bundle) {
    fs.mkdirpSync(path.join('/', 'api', 'sandbox', 'vendors', bundle.name));
    fs.writeFileSync(path.join('/', 'api', 'sandbox', 'vendors', bundle.name, 'manifest.json'), bundle.manifest);
    return bundle;
  }
};
