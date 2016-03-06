var Zip = require('node-zip');
var db = require('./database');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var createLoaders = require('./createLoaders');

var defaultFiles = {
  'webpack.config.js': fs.readFileSync(path.resolve('server', 'zip', 'webpack.config.js')).toString(),
  'index.tpl.html': fs.readFileSync(path.resolve('server', 'zip', 'index.tpl.html')).toString(),
  'README.md': fs.readFileSync(path.resolve('server', 'zip', 'index.tpl.html')).toString()
}

module.exports = function (req, res) {
  db.getBin(req.session.currentBin.id)
    .then(function (bin) {

      var packageJson = {
        "name": "webpackbin-project",
        "version": "1.0.0",
        "description": "Project boilerplate",
        "scripts": {
          "start": "webpack-dev-server --content-base build/"
        },
        "dependencies": bin.packages,
        "devDependencies": {
          "html-webpack-plugin": "1.6.1",
          "webpack-dev-server": "1.14.1",
          "webpack": "1.12.13"
        },
        "author": "WebpackBin",
        "license": "ISC"
      };

      var loaders = createLoaders(bin.loaders).map(function (loader) {
        loader.test = '$$' + loader.test.toString() + '$$';
        if (loader.exclude) {
          loader.exclude = '$$' + loader.exclude.toString() + '$$';
        }

        return loader;
      });
      var loadersString = JSON.stringify(loaders, null, 2);
      var findRegexps = /\$\$(.*?)\$\$/g;
      var matches = loadersString.match(findRegexps);
      loadersString = matches.reduce(function (loadersString, match) {
        return loadersString.replace('"' + match + '"', match.replace(/\$\$/g, '').replace('\\\\', '\\'));
      }, loadersString);
      var webpackConfig = defaultFiles['webpack.config.js'].replace(
        '$LOADERS$',
        loadersString
      );

      if (bin.loaders.babel) {
        packageJson.devDependencies['babel-loader'] = '6.2.4';
        if (bin.loaders.babel.stage0) {
          packageJson.devDependencies['babel-preset-stage-0'] = '6.5.0';
        }
        if (bin.loaders.babel.es2015) {
          packageJson.devDependencies['babel-preset-es2015'] = '6.6.0';
        }
        if (bin.loaders.babel.react) {
          packageJson.devDependencies['babel-preset-react'] = '6.5.0';
        }
      }

      if (bin.loaders.css) {
        packageJson.devDependencies['style-loader'] = '0.13.0';
        packageJson.devDependencies['css-loader'] = '0.23.1';
        if (bin.loaders.css.less) {
          packageJson.devDependencies['less-loader'] = '2.2.2';
        }
        if (bin.loaders.css.sass) {
          packageJson.devDependencies['sass-loader'] = '3.1.2';
        }
      }

      if (bin.loaders.typescript) {
        packageJson.devDependencies['ts-loader'] = '0.8.1';
        packageJson.devDependencies['typescript'] = '1.8.7';
      }

      if (bin.loaders.coffeescript) {
        packageJson.devDependencies['coffee-loader'] = '0.7.2';
      }

      if (bin.loaders.coffeescript) {
        packageJson.devDependencies['coffee-loader'] = '0.7.2';
      }

      var zip = new Zip();

      bin.files.forEach(function (file) {
        zip.file('src/' + file.name, file.content)
      });

      zip.file('package.json', JSON.stringify(packageJson, null, 2));
      zip.file('README.md', defaultFiles['README.md']);
      zip.file('src/index.tpl.html', defaultFiles['index.tpl.html']);
      zip.file('webpack.config.js', webpackConfig);

      var data = zip.generate({base64:false,compression:'DEFLATE'});
      res.setHeader("Content-Type", mime.lookup('project.zip'));
      res.setHeader("Content-Length", data.length);
      res.send(new Buffer(data, 'binary'));

    })
    .catch(function (err) {
      console.log(err);
      res.sendStatus(500);
    });

};
