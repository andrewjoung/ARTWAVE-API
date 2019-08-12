var express = require('express');
var router = express.Router();
const db = require("../models");

router.post("/create-list", function (req, res) {
  console.log(req.body);
  db.List.create({ title: req.body.title, category: req.body.category, pinned: req.body.pinned }).then(function (dbList) {
      res.json(dbList);
      return db.User.findOneAndUpdate({ username: req.body.username }, { $push: { lists: dbList._id } }, { new: true });
  }).then(function (dbUser) {
      //res.json(dbUser);
      console.log(dbUser);
  }).catch(function (err) {
      res.json(err);
  });
});

module.exports = router;