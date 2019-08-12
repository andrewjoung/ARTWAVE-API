var express = require('express');
var router = express.Router();
const db = require("../models");

router.post("/seefriend/:username", (req, res) => {
 const {username} = req.params
  db.User.findOne({username}).then(data=>{
    console.log(data)
  })
});

module.exports = router;