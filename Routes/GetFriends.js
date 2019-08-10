var express = require('express');
var router = express.Router();
const db = require("../models");

router.get("/getFriends/:id", (req, res) => {
  // use populate to get all friends
  db.User.findOne({ _id: req.params.id }).populate("friends").then(dbRes => {
      console.log("User friends: \n", dbRes);
      res.json(dbRes);
  }).catch(err => {
      console.log(err);
      res.end();
  });
});

module.exports = router;