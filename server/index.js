var express = require('express');
var webpack = require('webpack');
var app = express();
var memoryFs = require('./memoryFs');
var middleware = require('./middleware');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require('./sessions.js');
var middlewares = {};
var loadPackages = require('./loadPackages');
var loadLoaders = require('./loadLoaders');

loadPackages([
  'process',
  'esprima',
  'react',
  'react-dom'
]);

loadLoaders([
  'babel-loader',
  'style-loader',
  'css-loader'
]);

// Move to own file
memoryFs.mkdirpSync(path.join("/", "api", "sandbox"));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(function (req, res, next) {
  if (req.cookies.codebox && sessions.get(req.cookies.codebox)) {
    req.session = sessions.get(req.cookies.codebox);
  } else {
    var id = String(Date.now());
    req.session = sessions.set(id);
    res.cookie('codebox', String(id), {
      expires: 0,
      domain: '.codebox.dev',
      httpOnly: true
    });
  }
  next();
});

app.get('/', function(req, res) {
  res.send(fs.readFileSync(path.resolve('..', 'index.html')));
});

app.get('/api/sandbox/', function (req, res) {
  res.type('html');
  res.send('<!DOCTYPE html><html><body><div id="app"></div><script src="/api/sandbox/' + req.session.id + '/dist/bundle.js"></script></body></html>');
})

app.get('/api/sandbox/*', function (req, res, next) {
  if (!middlewares[req.session.id]) {
    console.log('creating middleware');
    middlewares[req.session.id] = middleware(req.session.compiler, {
      publicPath: path.join('/', 'api', 'sandbox', req.session.id, 'dist'),
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: true,
        chunkModules: false,
        modules: false
      }
    });
    middlewares[req.session.id](req, res, next);
  } else {
    console.log('Compiling');
    req.session.compiler.run(function (err) {
      if (err) {
        console.log(err);
      }
      middlewares[req.session.id](req, res, next);
    });
  }
})

app.post('/api/sandbox', function (req, res) {

  if (!req.session.compiler) {
    memoryFs.mkdirpSync(path.join("/", "api", "sandbox", req.session.id));
    memoryFs.mkdirpSync(path.join("/", "api", "sandbox", req.session.id, "dist"));
    // memoryFs.writeFileSync(path.join("/", "api", "sandbox", req.session.id, 'package.json'), '{babel: {"presets": ["react", "es2015", "stage-0"]}}');
    memoryFs.writeFileSync(path.join("/", "api", "sandbox", req.session.id, 'styles.css'), '.test {color: red;}');
    memoryFs.writeFileSync(path.join("/", "api", "sandbox", req.session.id, 'test.js'), 'console.log("hbhaha")');
  }

  req.body.files.forEach(function (file) {
    memoryFs.writeFileSync(path.join("/", "api", "sandbox", req.session.id, file.name), file.content);
  });

  if (!req.session.compiler) {
    console.log('Creating compiler');
    var compiler = webpack({
      context: '/',
      devtool: 'cheap-eval-source-map',
      entry: path.join('/', 'api', 'sandbox', req.session.id, 'main.js'),
      output: {
        path: path.join('/', 'api', 'sandbox', req.session.id, 'dist'),
        filename: 'bundle.js'
      },
      resolveLoader: {
        root: path.resolve(__dirname , '..', 'node_modules')
      },
      resolve: {
        root: path.join('/', 'node_modules')
      },
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
      }
    });
    compiler.inputFileSystem = memoryFs;
    compiler.resolvers.normal.fileSystem = compiler.inputFileSystem;
    compiler.resolvers.context.fileSystem = compiler.inputFileSystem;
    // compiler.resolvers.loader.fileSystem = compiler.inputFileSystem;
    sessions.update(req.session.id, 'compiler', compiler);
  }

  res.send({});

});

var colors = ['red', 'blue', 'green', 'yellow', 'purple'];
app.get('/api/randomcolor', function (req, res) {
  res.send({
    color: colors[Math.floor(Math.random() * (colors.length - 1))]
  });
});

module.exports = app;
