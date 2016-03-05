var server = require('./server');

console.log('Running WebpackBin version: ', require('./package.json').version);

server.server.on('request', server.app);
server.server.listen(process.env.NODE_ENV === 'production' ? process.env.PORT : 4000);

if (module.hot) {

  // This will handle HMR and reload the server
  module.hot.accept('./server', function() {
    server.server.removeListener('request', server.app);
    server = require('./server');
    server.server.on('request', server.app);
    console.log('Server reloaded!');
  });
}
