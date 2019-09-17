var express = require('express');
var router = express.Router();
const db = require("../models");

//
router.get("/commentData/:id", (req, res) => {
    db.Comment.findOne({_id: req.params.id}).populate("user").then(data => {
        // console.log(data);
        const commData = {
            _id: data._id,
            body: data.body,
            user: data.user._id,
            username: data.user.username
        }
        res.json(commData);
    }).catch(err => {
        console.log(err);
        res.end();
    });
});

//
router.post('/commentSubmit', (req, res) => {
    // console.log(req.body)
    
    const { submittingUserId, comment, listId } = req.body;
    
    db.Comment.create({
        user: submittingUserId,
        body: comment
    }).then(function (dbComment) {
        // console.log("\nNew comment document: ", dbComment, "\n");
        db.Comment.findOne({_id: dbComment._id}).populate("user").then(popComment => {
            // console.log(popComment);
            const returnCommObj = {
                _id: popComment._id,
                body: popComment.body,
                submittedBy: popComment.user.username
            }
            res.json(returnCommObj);
        }).catch(err => {
            console.log(err);
            res.end();
        })
    }).catch(err => {
        console.log(err);
        res.end();
    });
});

//
router.put('/list/add_comment', (req, res) => {
  const {listId, commentId} = req.body;
  db.List.updateOne({_id: listId}, { $push: {comments: commentId}}).then(dbRes => {
    //   console.log(dbRes);
      db.Comment.findOne({_id: commentId}).populate("user").then(data => {
        const commData = {
            _id: data._id,
            body: data.body,
            user: data.user._id,
            username: data.user.username
        }
        res.json(commData);
      }).catch(err => {
          console.log(err);
          res.end();
      });
  }).catch(err => {
      console.log(err);
      res.end();
  });
});

module.exports = router;