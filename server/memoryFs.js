var MemoryFileSystem = require('memory-fs');
var path = require('path');
var fs = new MemoryFileSystem();
var utils = require('./utils');

var injectIndexHelpers = function (packages, index) {
  return index.replace('</head>', [
    '   <script src="/api/sandbox/wbtools_v1.js"></script>',
    packages ? '   <script src="/api/sandbox/vendors/' + utils.getVendorsBundleName(packages) + '/bundle.js"></script>' : '',
    '</head>'
  ].join('\n'))
}

module.exports = {
  fs: fs,
  updateSessionFiles: function (session, files) {
    if (!fs.existsSync(path.join('/', 'api', 'sandbox', session.id))) {
      fs.mkdirpSync(path.join('/', 'api', 'sandbox', session.id));
    }

    files.forEach(function (file) {
      if (file.name === 'index.html') {
        fs.writeFileSync(path.join('/', 'api', 'sandbox', session.id, file.name), injectIndexHelpers(session.packages, file.content) || ' ');
      } else {
        fs.writeFileSync(path.join('/', 'api', 'sandbox', session.id, file.name), file.content || ' ');
      }
    });

    var filesToDelete = session.files.filter(function (sessionFile) {
      return !files.filter(function (passedFile) {
        return passedFile.name === sessionFile.name;
      }).length;
    });

    filesToDelete.forEach(function (file) {
      fs.unlinkSync(path.join('/', 'api', 'sandbox', session.id, file.name));
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
  },
  getSessionFile: function (sessionId, fileName) {
    var pathToFile = path.join('/', 'api', 'sandbox', sessionId, fileName);
    if (!fs.existsSync(pathToFile)) {
      return null;
    }
    return fs.readFileSync(pathToFile).toString();
  }
};
