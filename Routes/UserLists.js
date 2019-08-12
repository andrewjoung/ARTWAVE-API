var express = require('express');
var router = express.Router();
const db = require("../models");

router.get("/user/:id", function (req, res) {
  console.log("testing display list stuff", req.params.id);
  db.User.findOne({ username: req.params.id }).populate("lists").then(function (dbUser) {
      console.log(dbUser)
      res.json(dbUser);
  }).catch(function (err) {
      res.json(err);
  });
});

module.exports = router;