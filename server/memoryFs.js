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
  },
  hasVendorsBundle: function (packages) {
    var vendorsBundleName = utils.getVendorsBundleName(packages);
    return fs.existsSync(path.join('/', 'api', 'sandbox', 'vendors', vendorsBundleName,  '/bundle.js'));
  },
  writeBundleManifest: function (bundle) {
    fs.mkdirpSync(path.join('/', 'api', 'sandbox', 'vendors', bundle.name));
    fs.writeFileSync(path.join('/', 'api', 'sandbox', 'vendors', bundle.name, 'manifest.json'), bundle.manifest);
    return bundle;
  }
};
