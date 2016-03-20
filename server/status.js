var usage = require('usage');
var vendorsBundlesCleaner = require('./vendorsBundlesCleaner');
var live = require('./live');
var initialMemory;

var pid = process.pid;
var options = { keepHistory: true };

usage.lookup(pid, options, function(err, result) {
  if (err) {
    console.log(err);
    return;
  }
  initialMemory = Math.pow(result.memory, -6).toFixed(0) + 'mb';
});


module.exports = {
  get: function (req, res) {
    usage.lookup(pid, options, function(err, result) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      var vendorsBundles = vendorsBundlesCleaner.getBundles();
      var channels = live.getChannels();

      res.send({
        initialMemory: initialMemory,
        memory: Math.pow(result.memory, -6).toFixed(0) + 'mb',
        vendorsInMemory: Object.keys(vendorsBundles).reduce(function (vendorsInMemory, key) {
          vendorsInMemory[key] = ((Date.now() - vendorsBundles[key].added) / 1000 / 60).toFixed(0) + 'min'
          return vendorsInMemory;
        }, {}),
        nextCleanup: vendorsBundlesCleaner.getNextCleanupTime() ? ((vendorsBundlesCleaner.getNextCleanupTime() - Date.now()) / 1000 / 60 / 60).toFixed(0) + 'hours' : null,
        live: {
          channels: Object.keys(channels).length,
          connections: Object.keys(channels).reduce(function (connections, key) {
            return connections + Object.keys(channels[key].clients).length
          }, 0)
        }
      });
    });
  }
}
