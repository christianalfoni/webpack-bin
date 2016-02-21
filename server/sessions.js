var sessions = {};

module.exports = {
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
  }
};
