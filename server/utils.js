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
    return Object.keys(packages).sort().join('--');
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
  }
};
