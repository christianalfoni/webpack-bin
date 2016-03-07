var MemoryFileSystem = require('memory-fs');
var fs = new MemoryFileSystem();
var path = require('path');

fs.mkdirpSync(path.resolve("src"));
fs.writeFileSync(path.resolve("src", "test.js"), "var test = 'hest';");
fs.mkdirpSync(path.resolve("src", "test"));
fs.writeFileSync(path.resolve("src", "test", "test.js"), "var test = 'hest';");

var extract = function (dir) {
  var entries = fs.readdirSync(dir);
  return entries.reduce(function (points, fileOrDir) {
    if (path.extname(fileOrDir) === '.js') {
      return points.concat(dir + '/' + fileOrDir);
    } else if (fs.statSync(dir + '/' + fileOrDir).isDirectory()) {
      return points.concat(extract(dir + '/' + fileOrDir));
    }
  }, []);
};


console.log(extract(path.resolve('')));
