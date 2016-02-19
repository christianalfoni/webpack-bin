var app = require('./server'),
    http = require('http');

var server = http.createServer(app);

server.listen(4000);

if (module.hot) {

  // This will handle HMR and reload the server
  module.hot.accept('./server', function() {
    server.removeListener('request', app);
    app = require('./server');
    server.on('request', app);
    console.log('Server reloaded!');
  });
}
