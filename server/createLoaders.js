module.exports = function (session) {

  var loaders = [];

  // BABEL
  if (session.loaders.babel) {
    var loader = {
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        "presets": []
      }
    };
    if (session.loaders.babel.stage0) {
      loader.query.presets.push('stage-0');
    }
    if (session.loaders.babel.es2015) {
      loader.query.presets.push('es2015');
    }
    if (session.loaders.babel.react) {
      loader.query.presets.push('react');
    }
    loaders.push(loader);
  }

  // CSS
  if (session.loaders.css) {

    var loader = {
      test: /\.css?$/,
      loader: 'style!css'
    }

    if (session.loaders.css.modules) {
      loader.loader = 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]';
    }
    loaders.push(loader);
  }

  return loaders;
};
