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

preLoadPackages([
  // Webpack
  'webpack',
  'node-pre-gyp',
  'nopt',
  'rc',
  'tar-pack',
  'fsevents',

  // Core node
  'process',

  // Loaders
  'babel-loader',
  'style-loader',
  'css-loader'
]);

// Init
memoryFs.fs.mkdirpSync(path.join('/', 'api', 'sandbox'));
memoryFs.fs.mkdirpSync(path.join('/', 'api', 'sandbox', 'vendors'));
setInterval(sessions.clean, 60 * 1000 * 5);
database.connect(utils.isProduction() ? process.env.MONGOHQ_URL : 'mongodb://localhost:27017/webpackbin')
  .then(utils.log('Database connected'))
  .catch(utils.log('Could not connect to database'));

// Init middleware
app.use(compression())
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.resolve('public')));
app.use(sessions.middleware);

app.get('/', function(req, res) {
  res.send(fs.readFileSync(
    path.resolve('index.html')).toString().replace('/build/bundle.js', '/client_build.js')
  );
});
app.get('/api/sandbox/', sandbox.getIndex);
app.get('/api/sandbox/*', sandbox.getFile)
app.post('/api/sandbox', sandbox.updateSandbox);

app.get('/api/packages/:packageName', npm.getPackageFromRegistry);
app.get('/api/bundles', database.searchBundles);

module.exports = app;
