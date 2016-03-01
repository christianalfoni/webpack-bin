var app = require('./server'),
    http = require('http');

console.log('Running WebpackBin version: ', require('./package.json').version);
var server = http.createServer(app);

server.listen(process.env.NODE_ENV === 'production' ? process.env.PORT : 4000);

if (module.hot) {

  // This will handle HMR and reload the server
  module.hot.accept('./server', function() {
    server.removeListener('request', app);
    app = require('./server');
    server.on('request', app);
    console.log('Server reloaded!');
  });
}
