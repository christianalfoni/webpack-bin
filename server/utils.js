var hash = require('string-hash');
var path = require('path');
var semver = require('semver');

module.exports = {
  isProduction: function () {
    return process.env.NODE_ENV === 'production';
  },
  hasPackages: function (req) {
    return Boolean(req.body.packages && Object.keys(req.body.packages).length);
  },
  log: function (message) {
    return function () {
      console.log(message);
    };
  },
  logError: function (err) {
    console.log(err.message);
    console.log(err.stack);
  },
  getVendorsBundleName: function (packages) {
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
  readMemDir: function (fs, dir) {
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
  getLatestNpmVersion: function (versions) {

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
  isSameLoaders: function (loadersA, loadersB) {
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
  findEntryPoints: function (fs, entryKey, baseEntry, otherEntries) {
    var basePath = path.dirname(baseEntry.substr(1));
    var otherPaths = otherEntries.map(function (entry) {
      return path.join(basePath, entry);
    }).filter(function (entryPath) {
      return fs.statSync(entryPath).isDirectory();
    });
    return [basePath].concat(otherPaths).reduce(function (allFiles, entryPath) {
      return allFiles.concat(fs.readdirSync(entryPath).filter(function (file) {
        return path.extname(file) === '.js' && file !== path.basename(baseEntry);
      }).map(function (file) {
        return path.join(entryPath.substr(14), file);
      }));
    }, []);
  },
  convertDots: function (obj) {
    return Object.keys(obj || {}).reduce(function (newObj, key) {
      newObj[key.replace(/\./g, '!DOT!')] = obj[key];
      return newObj;
    }, {});
  },
  reconvertDots: function (obj) {
    return Object.keys(obj || {}).reduce(function (newObj, key) {
      newObj[key.replace(/\!DOT\!/g, '.')] = obj[key];
      return newObj;
    }, {});
  }
};
