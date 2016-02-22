var path = require('path');

module.exports = {
  resolve: {
    alias: {
      'common': path.join(__dirname, 'app/common')
    }
  },
  module: {
    loaders: [{
      test: /\.css?$/,
      loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]'
    },
    {
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        "presets": ["react", "es2015", "stage-0"],
        "plugins": [
          ["transform-decorators-legacy"]
        ]
      }
    }, {
      test: /\.woff$/,
      loader: 'url?limit=100000'
    }]
  }
};
