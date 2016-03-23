module.exports = function (loaders) {
  return Object.keys(loaders).reduce(function (depLoaders, loader) {

    if (loader === 'babel') {
      depLoaders['babel-loader'] = '6.2.4';
      if (loaders[loader].es2015) {
        depLoaders['babel-preset-es2015'] = '6.6.0';
      }
      if (loaders[loader].react) {
        depLoaders['babel-preset-react'] = '6.5.0';
      }
      if (loaders[loader].stage0) {
        depLoaders['babel-preset-stage-0'] = '6.5.0';
      }
      if (loaders[loader].jsx) {
        depLoaders['babel-plugin-transform-react-jsx'] = '6.6.5';
      }
    }

    if (loader === 'css') {
      depLoaders['css-loader'] = '0.23.1';
    }

    if (loader === 'css' && loaders[loader].less) {
      depLoaders['less-loader'] = '2.2.2';
    }

    if (loader === 'css' && loaders[loader].sass) {
      depLoaders['sass-loader'] = '3.2.0';
    }

    if (loader === 'typescript') {
      depLoaders['ts-loader'] = '0.8.1';
      depLoaders['typescript'] = '1.8.9';
    }

    if (loader === 'coffeescript') {
      depLoaders['coffee-loader'] = '0.7.2';
    }

    if (loader === 'raw') {
      depLoaders['raw-loader'] = '0.5.1';
    }

    if (loader === 'json') {
      depLoaders['json-loader'] = '0.5.4';
    }

    if (loader === 'jade') {
      depLoaders['jade'] = '1.11.0';
      depLoaders['jade-loader'] = '0.8.0';
    }

    if (loader === 'handlebars') {
      depLoaders['handlebars'] = '4.0.5';
      depLoaders['handlebars-loader'] = '1.2.0';
    }

    if (loader === 'vue') {
      depLoaders['vue-loader'] = '8.2.1';
    }

    return depLoaders;

  }, {});
};
