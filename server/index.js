var server = require('http').createServer();
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ server: server });
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
var liveConnection = require('./live');
var zip = require('./zip');

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
  'css-loader',
  'ts-loader',
  'coffee-loader',
  'less',
  'less-loader',
  'node-sass',
  'sass-loader',
  'babel-plugin-transform-decorators-legacy',
  'raw-loader',
  'json-loader',
  'jade',
  'jade-loader',
  'handlebars',
  'handlebars-loader'
]);

// Init
memoryFs.fs.mkdirpSync(path.join('/', 'api', 'sandbox'));
memoryFs.fs.mkdirpSync(path.join('/', 'api', 'sandbox', 'vendors'));
setInterval(sessions.clean, 60 * 1000 * 60 * 5);
database.connect(utils.isProduction() ? process.env.MONGOHQ_URL : 'mongodb://localhost:27017/webpackbin')
  .then(utils.log('Database connected'))
  .catch(utils.log('Could not connect to database'));

// Init middleware
if (utils.isProduction()) {
  app.use(function (req, res, next) {
    if (/herokuapp/.test(req.host)) {
      return res.redirect('http://www.webpackbin.com' + req.url);
    } else {
      next();
    }
  });
}
app.use(compression())
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.resolve('public')));
app.use(sessions.middleware);

app.get('/api/bins/:id', bins.get);

app.get('/api/sandbox/', sandbox.getIndex);
app.get('/api/sandbox/*', sandbox.getFile)
app.post('/api/sandbox', sandbox.updateSandbox);

app.get('/api/packages/:packageName', npm.getPackageFromRegistry);
app.get('/api/bundles', database.searchBundles);

app.get('/api/boilerplates/:id', bins.getBoilerplate);

app.get('/api/project.zip', zip);

var indexHtml = fs.readFileSync(path.resolve('index.html'))
  .toString()
  .replace('/build/bundle.js', '/client_build.js')
  .replace('</body>', "<script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', 'UA-74769782-1', 'auto');ga('send', 'pageview');</script>\n  </body>");
app.get('*', function(req, res) {
  res.send(indexHtml);
});

wss.on('connection', liveConnection);

module.exports = {
  server: server,
  app: app
};
