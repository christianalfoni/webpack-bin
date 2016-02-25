var db = require('./database');
var sessions = require('./sessions');

module.exports = {
  create: function (req, res) {
    db.createBin(req)
      .then(function (bin) {
        sessions.update(req.session.id, 'currentBin', {
          id: bin.id,
          isOwner: true
        });
        res.send(bin);
      })
      .catch(function (err) {
        console.log(err);
        res.sendStatus(500);
      })
  },
  get: function (req, res) {
    db.getBin(req.params.id)
      .then(function (bin) {
        if (!bin) {
          return res.sendStatus(404);
        }
        sessions.update(req.session.id, 'currentBin', {
          id: bin.id,
          isOwner: req.session.id === bin.author
        });
        res.send(bin);
      })
      .catch(function (err) {
        console.log(err, err.stack);
        res.sendStatus(500);
      })
  }
};
