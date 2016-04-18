var webpack = require('webpack');
var memoryFs = require('./memoryFs');
var path = require('path');
var utils = require('./utils');
var createLoaders = require('./createLoaders');

module.exports = {
  create: function (session) {
    return function (bundle) {
      if (!utils.getEntry(session.files)) {
        console.log('No entry files');
        return null;
      }
      return new Promise(function (resolve, reject) {

        var vendorsBundleName = bundle && bundle.name;
        var entries = bundle && bundle.entries;
        var externals = null;
        var plugins = [];

        if (vendorsBundleName) {
          var manifest = JSON.parse(memoryFs.fs.readFileSync(path.join('/', 'api', 'sandbox', 'vendors', vendorsBundleName, 'manifest.json')).toString());
          plugins = plugins.concat(
            new webpack.DllReferencePlugin({
              context: '/',
              manifest: manifest
            })
          );

          if (entries) {
            externals = Object.keys(entries).reduce(function (externals, packageName) {

              return Object.keys(manifest.content).reduce(function (externals, manifestKey) {
                var absolutePath = manifestKey.substr(1);

                if (absolutePath.indexOf(packageName) === -1) {
                  return externals;
                }

                var basePath = path.dirname(entries[packageName].path.substr(1));
                var fileName = path.basename(absolutePath);
                var extension = path.extname(fileName);
                var replacer = new RegExp('\/' + fileName + '$');

                if (entries[packageName].path.substr(1) === absolutePath) {
                  absolutePath = absolutePath.replace(replacer, '');
                } else if (extension === '.js') {
                  absolutePath = absolutePath.replace(replacer, '/' + fileName.replace(extension, ''));
                }
                externals[absolutePath.replace(basePath, packageName)] = 'webpackbin_vendors(' + manifest.content[manifestKey] + ')';
                return externals;
              }, externals);

            }, {});
          }

        }

        var loaders = createLoaders(session.loaders);

        console.log('Going to compile with directory');
        console.log(memoryFs.fs.readdirSync(path.join('/', 'api', 'sandbox', session.id)))


        console.log(
          'Compiling to',
          path.join('/', 'api', 'sandbox', session.id)
        )
        var compiler = webpack([{
          devtool: 'cheap-module-eval-source-map',
          entry: path.join('/', 'api', 'sandbox', session.id, utils.getEntry(session.files)),
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
            loaders: loaders
          },
          plugins: plugins
        },
        {
          devtool: 'cheap-module-eval-source-map',
          entry: path.join('/', 'api', 'sandbox', session.id, 'spec.js'),
          output: {
            path: path.join('/', 'api', 'sandbox', session.id),
            filename: 'test.bundle.js',
          },
          resolveLoader: {
            root: path.join('node_modules')
          },
          resolve: {
            root: path.join('/', 'node_modules')
          },
          externals: externals,
          module: {
            loaders: loaders
          },
          plugins: plugins
        }], function(err, stats) {
              if(err) {
                err.forEach(function(err) {
                  console.error(err);
                })
                return;
              }
              var jsonStats = stats.toJson();
              if(jsonStats.errors.length > 0)

              if(jsonStats.warnings.length > 0)
                  jsonStats.warnings.forEach(function(warning) {
                    console.warn(warning);
                  })
          });


        compiler.compilers.forEach(compiler => {
          compiler.inputFileSystem = memoryFs.fs;
          compiler.outputFileSystem = memoryFs.fs;
          compiler.resolvers.normal.fileSystem = memoryFs.fs;
          compiler.resolvers.context.fileSystem = memoryFs.fs;
          compiler.resolvers.loader.fileSystem = memoryFs.fs;
        })

        resolve(compiler);
      });
    }
  }
};
