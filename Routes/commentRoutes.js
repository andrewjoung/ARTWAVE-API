var express = require('express');
var router = express.Router();
const db = require("../models");

//
router.post('/commentSubmit', (req, res) => {
    console.log(req.body)
    
    const { submittingUserId, comment, listId } = req.body;
    
    db.Comment.create({
        user: submittingUserId,
        body: comment
    }).then(function (dbComment) {
        console.log("\nNew comment document: ", dbComment, "\n");
        res.json(dbComment);
    }).catch(err => {
        console.log(err);
    });
});

//
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