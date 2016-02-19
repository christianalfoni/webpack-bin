var sessions = {};

module.exports = {
  get: function (id) {
    return sessions[id];
  },
  set: function (id) {
    sessions[id] = {id: id};
    return sessions[id];
  },
  update: function (id, key, value) {
    sessions[id][key] = value;
    return sessions[id];
  }
};
