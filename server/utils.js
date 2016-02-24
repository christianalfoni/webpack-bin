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
    return String(hash(JSON.stringify(packages)));
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
  }
};
