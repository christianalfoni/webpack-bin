'use strict';

var webpack = require('webpack');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'test.js'
  ],
  output: {
    filename: 'bundle.js'
  }
};
