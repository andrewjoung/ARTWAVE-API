const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const keys = require("../config/keys");
var express = require('express');
var router = express.Router();
const db = require("../models");
const validateLoginInput = require("../validation/login");

router.post("/login", function (req, res) {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
      return res.status(400).json(errors);
  }
  const username = req.body.username;
  const password = req.body.password;
  db.User.findOne({ username }).then(user => {
      if (!user) {
          return res.status(404).json({ usernameNotFound: "Username not found" });
      }
      bcrypt.compare(password, user.password).then(isMatch => {
          if (isMatch) {
              const payload = {
                  id: user.id,
                  name: user.username
              };
              jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                  if (err) throw err;
                  res.json({
                      success: true,
                      token: "Bearer " + token,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      username: user.username,
                      email: user.email,
                      id: user._id,
                      lists: user.lists,
                      recommended: user.recommended,
                      friends: user.friends
                  });
              });
          } else {
              return res.status(400).json({ passwordIncorrect: "Incorrect password" });
          }
      });
  });
});

module.exports = router;