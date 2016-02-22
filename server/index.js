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
var loadPackages = require('./loadPackages');
var loadLoaders = require('./loadLoaders');
var isProduction = process.env.NODE_ENV === 'production';

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

setInterval(sessions.clean, 60 * 1000 * 5);

app.use(compression())
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
      domain: isProduction ? 'webpackbin.herokuapp.com' : '.codebox.dev',
      httpOnly: true
    });
  }
  next();
});

console.log('Setting static to ', path.resolve('public'));
app.use(express.static(path.resolve('public')));

app.get('/', function(req, res) {
  res.send(fs.readFileSync(path.resolve('index.html')).toString().replace('/build/bundle.js', '/client_build.js'));
});

app.get('/api/sandbox/', function (req, res) {
  res.type('html');
  res.send('<!DOCTYPE html><html><head><script>window.addEventListener("load", function () {window.parent.postMessage({type: "loaded"}, location.origin)});</script></head><body><div id="app"></div><script src="/api/sandbox/' + req.session.id + '/dist/vendors.bundle.js" defer></script><script src="/api/sandbox/' + req.session.id + '/dist/bundle.js" defer></script></body></html>');
})

app.get('/api/sandbox/*', function (req, res, next) {
  console.log('Compiling', req.url);
  if (/vendors\.bundle/.test(req.url)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
  middlewares[req.session.id](req, res, next);
})

app.post('/api/sandbox', function (req, res, next) {

  if (!req.session.compiler) {
    memoryFs.mkdirpSync(path.join("/", "api", "sandbox", req.session.id));
    memoryFs.mkdirpSync(path.join("/", "api", "sandbox", req.session.id, "dist"));
  }

  req.body.files.forEach(function (file) {
    memoryFs.writeFileSync(path.join("/", "api", "sandbox", req.session.id, file.name), file.content || ' ');
  });

  if (!req.session.compiler) {
    console.log('Creating compiler');

    var vendorsCompiler = webpack({
      entry: {
        vendors: ['react', 'react-dom']
      },
      output: {
        path: path.join('/', 'api', 'sandbox', req.session.id, 'dist'),
        filename: '[name].bundle.js',
        library: '[name]_lib'
      },
      resolveLoader: {
        root: path.resolve('node_modules')
      },
      resolve: {
        root: path.join('/', 'node_modules')
      },
      plugins: [
        new webpack.DllPlugin({
         // The path to the manifest file which maps between
         // modules included in a bundle and the internal IDs
         // within that bundle
         path: path.join('/', 'api', 'sandbox', req.session.id, 'dist', '[name]-manifest.json'),
         // The name of the global variable which the library's
         // require function has been assigned to. This must match the
         // output.library option above
         name: '[name]_lib'
       })
      ]
    });
    vendorsCompiler.outputFileSystem = new MemoryFileSystem();
    vendorsCompiler.inputFileSystem = memoryFs;
    vendorsCompiler.resolvers.normal.fileSystem = vendorsCompiler.inputFileSystem;
    vendorsCompiler.resolvers.context.fileSystem = vendorsCompiler.inputFileSystem;

    vendorsCompiler.run(function (err) {
      if (err) {
        console.log(err);
      }

      var compiler = webpack({
        devtool: 'cheap-eval-source-map',
        entry: {
          App: path.join('/', 'api', 'sandbox', req.session.id, 'main.js')
        },
        output: {
          path: path.join('/', 'api', 'sandbox', req.session.id, 'dist'),
          filename: 'bundle.js'
        },
        resolveLoader: {
          root: path.resolve('node_modules')
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
        },
        plugins: [
          new webpack.DefinePlugin({
            'process.env': {
              // This has effect on the react lib size
              'NODE_ENV': JSON.stringify('production'),
            }
          }),
          new webpack.DllReferencePlugin({
            context: '.',
            manifest: JSON.parse(vendorsCompiler.outputFileSystem.readFileSync(path.join('/', 'api', 'sandbox', req.session.id, 'dist', 'vendors-manifest.json')).toString())
          })
        ]
      });

      compiler.inputFileSystem = memoryFs;
      compiler.resolvers.normal.fileSystem = compiler.inputFileSystem;
      compiler.resolvers.context.fileSystem = compiler.inputFileSystem;
      // compiler.resolvers.loader.fileSystem = compiler.inputFileSystem;
      sessions.update(req.session.id, 'compiler', compiler);
      middlewares[req.session.id] = middleware(compiler, {
        lazy: true,
        filename: /bundle.js/,
        publicPath: path.join('/', 'api', 'sandbox', req.session.id, 'dist'),
        stats: {
          colors: true,
          hash: false,
          timings: true,
          chunks: true,
          chunkModules: false,
          modules: false
        }
      }, function (outputFileSystem) {
        outputFileSystem.mkdirpSync(path.join("/", "api", "sandbox", req.session.id, "dist"));
        var distPath = path.join("/", "api", "sandbox", req.session.id, 'dist');
        vendorsCompiler.outputFileSystem.readdirSync(distPath).forEach(function (fileName) {
          var fileContent = vendorsCompiler.outputFileSystem.readFileSync(path.join("/", "api", "sandbox", req.session.id, 'dist', fileName));
          outputFileSystem.writeFileSync(path.join("/", "api", "sandbox", req.session.id, 'dist', fileName), fileContent || ' ');
        });
      });
      middlewares[req.session.id](req, res, next, path.join('/', 'api', 'sandbox', req.session.id, 'dist', 'bundle.js'))

    });

  } else {
      res.send({});
  }

});

var colors = ['red', 'blue', 'green', 'yellow', 'purple'];
app.get('/api/randomcolor', function (req, res) {
  res.send({
    color: colors[Math.floor(Math.random() * (colors.length - 1))]
  });
});

module.exports = app;
