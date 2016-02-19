var webpack = require('webpack');
var MemoryFileSystem = require('memory-fs');
var middleware = require('./middleware');
var config = require('./config');
var fs = new MemoryFileSystem();
var path = require('path');

fs.mkdirpSync(path.resolve("src"));
fs.writeFileSync(path.resolve("src", "test.js"), "var test = 'hest';");

var compiler = webpack(config);
compiler.inputFileSystem = fs;
compiler.resolvers.normal.fileSystem = compiler.inputFileSystem;
compiler.resolvers.context.fileSystem = compiler.inputFileSystem;

var test = middleware(compiler, {
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: true,
      chunkModules: false,
      modules: false
    }
  });

console.log(test(path.resolve("src", "test.js")));
