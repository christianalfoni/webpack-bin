var npmExtractor = require('npm-extractor');
var memoryFs = require('./memoryFs.js');
var utils = require('./utils');

module.exports = {
  loadPackages: function (packages) {
    console.log('Load packages', packages, Object.keys(packages));
    return Promise.all(Object.keys(packages).map(function (key) {
      return npmExtractor({
        package: key,
        targetFs: memoryFs.fs,
        version: packages[key],
        options: {
          registry: 'http://registry.npmjs.org/',
          mindelay: 5000,
          maxDelay: 10000,
          retries: 5,
          factor: 5
        },
        dest: 'node_modules'
      });
    }))
    .then(function (packagesData) {
      console.log('Loaded packages into memory');
      return {
        packages: packages,
        packagesData: packagesData
      };
    })
    .catch(function (err) {
      console.log(err);
    });
  }
};
