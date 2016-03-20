var memoryFs = require('./memoryFs.js');
var utils = require('./utils.js');

var vendorsBundles = {};
var cleanupTimeout = 1000 * 60 * 60 * 24;
var nextCleanUp = null;

module.exports = {
  update: function (req) {
    var vendorsBundlesName = utils.getVendorsBundleName(req.session.packages);
    if (vendorsBundlesName) {

      if (vendorsBundles[vendorsBundlesName]) {
        clearTimeout(vendorsBundles[vendorsBundlesName].timeout);
      }
      vendorsBundles[vendorsBundlesName] = {
        timeout: setTimeout(function () {
          memoryFs.removeVendorsBundle(vendorsBundlesName);
          delete vendorsBundles[vendorsBundlesName];
        }, cleanupTimeout),
        added: Date.now()
      };
      nextCleanUp = Date.now() + cleanupTimeout;
    }
  },
  getBundles: function () {
    return vendorsBundles;
  },
  getNextCleanupTime: function () {
    return nextCleanUp;
  }
};
