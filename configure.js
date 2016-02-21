var fs = require('fs');
var path = require('path');

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

try {
  deleteFolderRecursive(path.resolve('node_modules', 'babel-core'));
  fs.renameSync(path.resolve('node_modules', 'webpack-bin-babel-core'), path.resolve('node_modules', 'babel-core'));
  console.log('Renamed BABEL-CORE');
} catch (e) {
  console.log('Could not rename BABEL-CORE', e.message);
}
