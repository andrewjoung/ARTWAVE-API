var express = require('express');
var router = express.Router();
const db = require("../models");

router.post('/commentSubmit', (req, res) => {
  console.log(req.body)
  const { id, comment, listId } = req.body;
  // console.log(id)
  db.Comment.create({
      user: listId,
      body: comment
  }).then(function (dbComment) {
      return db.List.findOneAndUpdate({ _id: listId }, { $push: { comments: dbComment.id } }, { new: true }).then(function (dbList) {
          console.log(dbList);
          res.json(dbList);
      }).catch(function (err) {
          res.json(err);
      });
  });

  // db.List.user({_id:id.id}).populate('list').then(data3=>{
  //     console.log(data3)
  // })



});

module.exports = router;