var express = require('express');
var router = express.Router();
const db = require("../models");

router.get("/users/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  db.User.find({}).then(users => {
      const friends = users.filter(user => {
          if (user._id === req.params.id) {
              return false;
          }
          return true;
      });
      console.log(friends);
      res.json(friends);
  }).catch(err => {
      console.log(err);
      res.end();
  });
});

module.exports = router;