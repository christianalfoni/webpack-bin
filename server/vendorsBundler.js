var webpack = require('webpack');
var utils = require('./utils.js');
var memoryFs = require('./memoryFs');
var path = require('path');
var utils = require('./utils');

module.exports = {
  compile: function (bundle) {
    return new Promise(function (resolve, reject) {

      // Fix esModule issue
      console.log(bundle.entries);
      Object.keys(bundle.entries).forEach(function (key) {
        var entryFile = memoryFs.fs.readFileSync(bundle.entries[key].substr(1)).toString();
        entryFile = entryFile.replace('__esModule', '__preventedEsModule').replace(/exports\.default/g, 'module.exports');
        memoryFs.fs.writeFileSync(bundle.entries[key].substr(1), entryFile);
      });

      console.log('creating vendors compiler', bundle.entries);
      var vendorsCompiler = webpack({
        context: '/',
        entry: {
          vendors: Object.keys(bundle.entries)
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
      console.log('running vendors compiler');
      vendorsCompiler.run(function (err) {
        console.log('Compiled vendors');
        if (err) {
          return reject(err);
        }
        resolve(bundle);
      });
    })
    .catch(utils.logError);
  }
};
