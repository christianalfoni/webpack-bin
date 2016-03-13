var memoryFs = require('./memoryFs.js');
var utils = require('./utils.js');

var vendorsBundles = {};

module.exports = {
  update: function (req) {
    var vendorsBundlesName = utils.getVendorsBundleName(req.session.packages);
    if (vendorsBundlesName) {
      clearTimeout(vendorsBundles[vendorsBundlesName]);
      vendorsBundles[vendorsBundlesName] = setTimeout(function () {
        memoryFs.removeVendorsBundle(vendorsBundlesName);
        delete vendorsBundles[vendorsBundlesName];
      }, 1000 * 60 * 60 * 24);
    }
  },
  getBundles: function () {
    return Object.keys(vendorsBundles);
  }
};
