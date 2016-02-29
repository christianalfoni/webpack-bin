var utils = require('./utils.js');
var path = require('path');
var sessions = {};
var middleware = require('./middleware');

var sessionsModule = {
  get: function (id) {
    var session = sessions[id];
    if (session) {
      sessions[id].lastUpdate = Date.now();
    }
    return session;
  },
  set: function (id) {
    sessions[id] = {id: id, lastUpdate: Date.now()};
    return sessions[id];
  },
  update: function (id, key, value) {
    sessions[id][key] = value;
    return sessions[id];
  },
  clean: function () {
    var now = Date.now();
    console.log('Cleaning sessions: ' + Object.keys(sessions).length);
    sessions = Object.keys(sessions).filter(function (key) {
      return now - sessions[key].lastUpdate < 60 * 1000 * 5;
    }).reduce(function (remainingSessions, key) {
      remainingSessions[key] = sessions[key];
      return remainingSessions;
    }, {});
    console.log('Cleaned sessions: ' + Object.keys(sessions).length);
  },
  middleware: function (req, res, next) {
    if (req.cookies.codebox && sessionsModule.get(req.cookies.codebox)) {
      req.session = sessionsModule.get(req.cookies.codebox);
    } else {
      var id = String(Date.now());
      req.session = sessionsModule.set(id);
      res.cookie('codebox', String(id), {
        expires: 0,
        domain: utils.isProduction() ? 'www.webpackbin.com' : '.codebox.dev',
        httpOnly: true
      });
    }
    next();
  },
  createBundleMiddleware: function (session) {
    return function (compiler) {
      console.log('Creating bundle middleware', session);
      var sessionMiddleware = middleware(compiler, {
        lazy: true,
        filename: new RegExp(session.id),
        publicPath: path.join('/', 'api', 'sandbox', session.id),
        stats: {
          colors: true,
          hash: false,
          timings: true,
          chunks: true,
          chunkModules: false,
          modules: false
        }
      });
      sessionsModule.update(session.id, 'middleware', sessionMiddleware);
    };
  },
  updatePackages: function (req) {
    sessions[req.session.id].packages = Boolean(Object.keys(req.body.packages).length) ? req.body.packages : null;
  },
  removeMiddleware: function (req) {
    delete sessions[req.session.id].middleware;
  },
  updateLoaders: function (req) {
    sessions[req.session.id].loaders = req.body.loaders;
  }
};

module.exports = sessionsModule;
