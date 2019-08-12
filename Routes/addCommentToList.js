var express = require('express');
var router = express.Router();
const db = require("../models");

router.put('/list/add_comment', (req, res) => {
  const {listId, commentId} = req.body;
  db.List.updateOne({_id: listId}, { $push: {comments: commentId}}).then(dbRes => {
      console.log(dbRes);
      res.end();
  }).catch(err => {
      console.log(err);
  });
});

module.exports = router;