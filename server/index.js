var express = require('express');
var webpack = require('webpack');
var compression = require('compression');
var app = express();
var MemoryFileSystem = require("memory-fs");
var memoryFs = require('./memoryFs');
var middleware = require('./middleware');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require('./sessions.js');
var middlewares = {};
var preLoadPackages = require('./preLoadPackages');
var utils = require('./utils');
var sandbox = require('./sandbox');
var database = require('./database');
var npm = require('./npm');
var bins = require('./bins');

preLoadPackages([
  // Core node
  'process',

  // Webpack
  'webpack',
  'node-pre-gyp',
  'nopt',
  'rc',
  'tar-pack',

  // Loaders
  'babel-loader',
  'style-loader',
  'css-loader'
]);

// Init
memoryFs.fs.mkdirpSync(path.join('/', 'api', 'sandbox'));
memoryFs.fs.mkdirpSync(path.join('/', 'api', 'sandbox', 'vendors'));
setInterval(sessions.clean, 60 * 1000 * 60 * 5);
database.connect(utils.isProduction() ? process.env.MONGOHQ_URL : 'mongodb://localhost:27017/webpackbin')
  .then(utils.log('Database connected'))
  .catch(utils.log('Could not connect to database'));

// Init middleware
app.use(function (req, res, next) {
  res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.setHeader('Expires', '-1');
  res.setHeader('Pragma', 'no-cache');
  next();
})
app.use(compression())
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.resolve('public')));
app.use(sessions.middleware);

app.post('/api/bins', bins.create);
app.get('/api/bins/:id', bins.get);

app.get('/api/sandbox/', sandbox.getIndex);
app.get('/api/sandbox/*', sandbox.getFile)
app.post('/api/sandbox', sandbox.updateSandbox);

app.get('/api/packages/:packageName', npm.getPackageFromRegistry);
app.get('/api/bundles', database.searchBundles);

app.get('*', function(req, res) {
  res.send(fs.readFileSync(
    path.resolve('index.html')).toString().replace('/build/bundle.js', '/client_build.js')
  );
});

module.exports = app;
