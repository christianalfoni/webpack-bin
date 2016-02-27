var hash = require('string-hash');

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
    if (Object.keys(packages).length === 0) {
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
      return Number(version.match(/\d+/g).join(''))
    }

    function sorter(a, b) {
      var aSplit = a.split('-');
      var bSplit = b.split('-');
      if (aSplit.length > bSplit.length) {
        return 1;
      }
      if (aSplit.length < bSplit.length) {
        return -1;
      }
      if (versionToNumber(a) < versionToNumber(b)) {
        return 1;
      }
      if (versionToNumber(a) > versionToNumber(b)) {
        return -1;
      }
      return 0;
    }

    return Object.keys(versions).sort(sorter)[0];
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
  }
};
