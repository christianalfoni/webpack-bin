'use strict'

var hash = require('string-hash');
var path = require('path');
var semver = require('semver');
var fs = require('./memoryFs');
var sessions = require('./sessions');

module.exports = {
  checkCurrentBin(req) {
    if (!req.session.currentBin || req.session.currentBin.id !== req.body.id) {
      // If there is no bin, or the current bin does not belong to user.
      sessions.update(req.session.id, 'currentBin', {
        id: req.body.id,
        isOwner: false
      });
    }
  },
  checkMiddlewareForChanges(req) {
    var currentEntryFile = this.getEntry(req.session.files);

    if (
      req.session.middleware &&
      (
        this.getVendorsBundleName(req.session.packages) !== this.getVendorsBundleName(req.body.packages) ||
        currentEntryFile !== this.getEntry(req.body.files)
      )
    ) {
      // Middleware has changed, remove sessions middleware.
      sessions.removeMiddleware(req);
    }
  },
  getFileName(req) {
    let author = req.session.currentBin.author;
    if (path.basename(req.url) === this.getEntry(sessions.get(author).files)) {
      return 'webpackbin_bundle.js'
    } else {
      return req.session.currentBin.author + '/' + fileName;
    }
  },
  isLive(req) {
    return (req.session.currentBin &&
    req.session.currentBin.isLive &&
    !req.session.currentBin.isOwner)
  },
  setHeaders(res) {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Expires', '-1');
    res.setHeader('Pragma', 'no-cache');
  },
  isProduction() {
    return process.env.NODE_ENV === 'production';
  },
  hasPackages(req) {
    return Boolean(req.body.packages && Object.keys(req.body.packages).length);
  },
  log(message) {
    return function () {
      console.log(message);
    };
  },
  logError(err) {
    console.log(err.message);
    console.log(err.stack);
  },
  getVendorsBundleName(packages) {
    if (!packages || Object.keys(packages).length === 0) {
      return null;
    }
    var packagesList = Object.keys(packages).map(function (key) {
      return key + ':' + packages[key];
    }).sort(function (a, b) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    return String(hash(JSON.stringify(packagesList)));
  },
  readMemDir(fs, dir) {
    var logOutDir = function (dir) {
      var dirs = [];
      try {
        dirs = fs.readdirSync(dir);
        console.log(dir);
      } catch (e) {
        return;
      }
      dirs.forEach(function (subDir) {
        logOutDir(dir + '/' + subDir);
      });
    }
    logOutDir(dir);
  },
  getLatestNpmVersion(versions) {

    function versionToNumber(version) {
      return version.split('.').map(function (number, index) {
        return Number(number) + (index * 1000);
      });
    }

    function sorter(a, b) {
      if (semver.lt(a, b)) {
        return 1;
      }
      if (semver.lt(b, a)) {
        return -1;
      }
      return 0;
    }

    var versionsList = Object.keys(versions);
    var latestVersion = versionsList.filter(function (version) {
      return version.indexOf('-') === -1;
    }).sort(sorter)[0];

    return latestVersion || versionsList[versionsList.length - 1];
  },
  isSameLoaders(loadersA, loadersB) {
    if (!loadersA || !loadersB) {
      return false;
    }

    var sortByName = function (a, b) {
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      }
      return 0;
    };

    var loadersAList = Object.keys(loadersA).map(function (key) {
      return {
        name: key,
        config: loadersA[key]
      }
    }).sort(sortByName);
    var loadersBList = Object.keys(loadersB).map(function (key) {
      return {
        name: key,
        config: loadersB[key]
      }
    }).sort(sortByName);

    return JSON.stringify(loadersAList) === JSON.stringify(loadersBList);
  },
  convertDots(obj) {
    return Object.keys(obj || {}).reduce(function (newObj, key) {
      newObj[key.replace(/\./g, '!DOT!')] = obj[key];
      return newObj;
    }, {});
  },
  reconvertDots(obj) {
    return Object.keys(obj || {}).reduce(function (newObj, key) {
      newObj[key.replace(/\!DOT\!/g, '.')] = obj[key];
      return newObj;
    }, {});
  },
  getEntry(files) {
    if (!files) {
      console.log('No files for get entry!')
      return null;
    }

    return files.reduce(function (entryFile, file) {
      if (file.isEntry) {
        return file.name;
      }
      return entryFile;
    }, null);
  }
};
