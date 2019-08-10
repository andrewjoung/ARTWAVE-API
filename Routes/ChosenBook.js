var express = require('express');
var router = express.Router();
let axios = require('axios');
const db = require("../models");

router.post('/books/:id', (req, res) => {
  axios.get(`https://www.googleapis.com/books/v1/volumes/${req.params.id}`).then(data => {
      db.Book.create({
          title: data.data.volumeInfo.title,
          author: data.data.volumeInfo.authors[0],
          artUri: data.data.volumeInfo.imageLinks.thumbnail,
          synopsis: data.data.volumeInfo.description,
          uri: data.data.selfLink
      }).then(function (dbBook) {
          return db.List.findOneAndUpdate({ _id: req.body.id }, { $push: { items: dbBook._id } }, { new: true });
      }).then(function (dbList) {
          console.log("pushing into book list", dbList);
          res.json(dbList);
      }).catch(function (err) {
          res.json(err);
      });
  }).catch(err => {
      console.log(err)
  })
});

module.exports = router;