var webpack = require('webpack');
var utils = require('./utils.js');
var memoryFs = require('./memoryFs');
var path = require('path');
var utils = require('./utils');

module.exports = {
  compile: function (result) {
    var packages = result.packages;
    return new Promise(function (resolve, reject) {
      var bundleName = utils.getVendorsBundleName(packages);
          console.log('creating compiler', bundleName);
      var vendorsCompiler = webpack({
        entry: {
          vendors: Object.keys(packages)
        },
        output: {
          path: path.join('/', 'api', 'sandbox', 'vendors', bundleName),
          filename: 'bundle.js',
          library: 'webpackbin_vendors'
        },
        resolveLoader: {
          root: path.resolve('node_modules')
        },
        resolve: {
          root: path.join('/', 'node_modules')
        },
        plugins: [
          new webpack.DllPlugin({
           path: path.join('/', 'api', 'sandbox', 'vendors', bundleName, 'manifest.json'),
           name: 'webpackbin_vendors',
           context: '/'
         })
        ]
      });
      vendorsCompiler.outputFileSystem = memoryFs.fs;
      vendorsCompiler.inputFileSystem = memoryFs.fs;
      vendorsCompiler.resolvers.normal.fileSystem = memoryFs.fs;
      vendorsCompiler.resolvers.context.fileSystem = memoryFs.fs;
      console.log('running compiler');
      vendorsCompiler.run(function (err) {
        console.log('Compiled vendors');
        if (err) {
          return reject(err);
        }
        resolve({
          bundleName: bundleName,
          packagesData: result.packagesData
        });
      });
    })
    .catch(utils.logError);
  }
};
