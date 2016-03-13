var webpack = require('webpack');
var utils = require('./utils.js');
var memoryFs = require('./memoryFs');
var path = require('path');
var utils = require('./utils');
var vendorEntries = require('./vendorEntries');

module.exports = {
  compile: function (bundle) {
    return new Promise(function (resolve, reject) {

      var vendors = Object.keys(bundle.entries).reduce(function (vendors, entryKey) {
        return vendors.concat(entryKey).concat(
          utils.findEntryPoints(
            memoryFs.fs,
            entryKey,
            bundle.entries[entryKey],
            vendorEntries[entryKey] || []
        ));
      }, []);

      var vendorsCompiler = webpack({
        context: '/',
        entry: {
          vendors: vendors
        },
        output: {
          path: path.join('/', 'api', 'sandbox', 'vendors', bundle.name),
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
          new webpack.DefinePlugin({
            'process.env': {
              'NODE_ENV': JSON.stringify('production'),
            }
          }),
          new webpack.DllPlugin({
           path: path.join('/', 'api', 'sandbox', 'vendors', bundle.name, 'manifest.json'),
           name: 'webpackbin_vendors',
           context: '/'
         }),
         new webpack.optimize.UglifyJsPlugin({minimize: true})
        ]
      });
      vendorsCompiler.outputFileSystem = memoryFs.fs;
      vendorsCompiler.inputFileSystem = memoryFs.fs;
      vendorsCompiler.resolvers.normal.fileSystem = memoryFs.fs;
      vendorsCompiler.resolvers.context.fileSystem = memoryFs.fs;
      vendorsCompiler.run(function (err) {
        if (err) {
          return reject(err);
        }
        resolve(bundle);
      });
    })
    .catch(utils.logError);
  }
};
