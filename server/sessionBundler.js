var webpack = require('webpack');
var memoryFs = require('./memoryFs');
var path = require('path');
var utils = require('./utils');

module.exports = {
  create: function (session) {
    return function (bundle) {
      return new Promise(function (resolve, reject) {

        var vendorsBundleName = bundle && bundle.name;
        var entries = bundle && bundle.entries;
        var externals = null;
        var plugins = [
          new webpack.DefinePlugin({
            'process.env': {
              'NODE_ENV': JSON.stringify('production'),
            }
          })
        ];

        if (vendorsBundleName) {
          var manifest = JSON.parse(memoryFs.fs.readFileSync(path.join('/', 'api', 'sandbox', 'vendors', vendorsBundleName, 'manifest.json')).toString());
          plugins = plugins.concat(
            new webpack.DllReferencePlugin({
              context: '/',
              manifest: manifest
            })
          );

          if (entries) {
            externals = Object.keys(entries).reduce(function (externals, key) {
              externals[key] = 'webpackbin_vendors(' + manifest.content[entries[key]] + ')';
              return externals;
            }, {});
          }

        }

        console.log('Creating session compiler');
        console.log('Vendors bundle name', vendorsBundleName);
        console.log('externals', externals);

        var compiler = webpack({
          devtool: 'cheap-module-eval-source-map',
          entry: {
            App: path.join('/', 'api', 'sandbox', session.id, 'main.js')
          },
          output: {
            path: path.join('/', 'api', 'sandbox', session.id),
            filename: 'webpackbin_bundle.js'
          },
          resolveLoader: {
            root: path.resolve('node_modules')
          },
          resolve: {
            root: path.join('/', 'node_modules')
          },
          externals: externals,
          module: {
            loaders: [{
              test: /\.css?$/,
              loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]'
            }, {
              test: /\.js?$/,
              exclude: /node_modules/,
              loader: 'babel',
              query: {
                "presets": ["react", "es2015", "stage-0"]
              }
            }]
          },
          plugins: plugins
        });

        compiler.inputFileSystem = memoryFs.fs;
        compiler.resolvers.normal.fileSystem = memoryFs.fs;
        compiler.resolvers.context.fileSystem = memoryFs.fs;

        console.log('Session bundler created');

        resolve(compiler);
      });
    }
  }
};
