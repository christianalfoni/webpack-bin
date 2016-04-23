'use strict'

var MemoryFileSystem = require('memory-fs');
var path = require('path');
var fs = new MemoryFileSystem();
var utils = require('./utils');
var testHelper = require('./tests/index');

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
      console.log('Deleting file', file);
      fs.unlinkSync(path.join('/', 'api', 'sandbox', session.id, file.name));
    });
  },

  updateSessionTests: function(req, tests) {
    console.log('Updating session tests');
    if (!tests) return;

    let entry = utils.getEntry(req.session.files)
    console.log('Writing test html file!');
    fs.writeFileSync(
      path.join('/', 'api', 'sandbox', req.session.id, 'test.html'),
      injectIndexHelpers(req.session.packages, testHelper.getIndex(entry)),
      function(err) {
        if (err) throw err;
      }
    )

    var htmlFileFound = false;
    tests.forEach(function(test) {
      console.log(`Testing ${test.name}, html file found is ${htmlFileFound}`);
      if (/(\.html$)/.test(test.name) && !htmlFileFound) {
        console.log('Writing test html file!');

        fs.writeFileSync(path.join('/', 'api', 'sandbox', session.id, 'test.html'), injectIndexHelpers(req.session.packages, test.content))
        htmlFileFound = true;
        return;
      }
      fs.writeFileSync(path.join('/', 'api', 'sandbox', req.session.id, test.name),
        test.content || ' ');
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
      console.log('bad path');
      console.log('Request was', pathToFile);
      console.log('Directory:');
      console.log(fs.readdirSync(path.join('/', 'api', 'sandbox', sessionId)))
      return null
    }
    return fs.readFileSync(pathToFile).toString();
  },
  getTestFile: function(sessionId, fileName) {
    var pathToFile = path.join('/', 'api', 'sandbox', fileName);
    if (!fs.existsSync(pathToFile)) {
      return null;
    }
    var ans = fs.readFileSync(pathToFile).toString();
    return ans;
  }
};
