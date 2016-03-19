var usage = require('usage');
var vendorsBundlesCleaner = require('./vendorsBundlesCleaner');

module.exports = {
  get: function (req, res) {
    var pid = process.pid;
    var options = { keepHistory: true }
    usage.lookup(pid, options, function(err, result) {
      if (err) {
        return res.sendStatus(500);
      }
      res.send({
        memory: result,
        vendorsInMemory: vendorsBundlesCleaner.getBundles()
      });
    });
  }
}
