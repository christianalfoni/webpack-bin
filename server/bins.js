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
        bin.isOwner = req.session.id === bin.author;
        sessions.update(req.session.id, 'currentBin', {
          id: bin.id,
          author: bin.author,
          isOwner: bin.isOwner,
          isLive: bin.isLive
        });
        res.send(bin);
      })
      .catch(function (err) {
        console.log(err, err.stack);
        res.sendStatus(500);
      })
  },
  getBoilerplate: function (req, res) {
    db.getBin(req.params.id)
      .then(function (bin) {
        if (!bin) {
          return res.sendStatus(404);
        }
        res.send(bin);
      })
      .catch(function (err) {
        res.sendStatus(500);
      })
  }
};
