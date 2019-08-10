var express = require('express');
var router = express.Router();
let apiKey = '91413d43';
let axios = require('axios');
const db = require("../models");

router.post('/movies/:id', (req, res) => {
  console.log('looking at movies')
  axios.get(`http://www.omdbapi.com/?i=${req.params.id}&apikey=${apiKey}`).then(data => {

      console.log("testing scott's stuff", req.body);
      console.log(data.data.Title)
      db.Movie.create({
          title: data.data.Title,
          genre: data.data.Genre,
          actors: data.data.Actors,
          director: data.data.Director,
          artUri: data.data.Poster,
          synopsis: data.data.Plot,
          uri: data.data.Website
      }).then(function (dbMovie) {
          return db.List.findOneAndUpdate({ _id: req.body.id }, { $push: { items: dbMovie._id } }, { new: true });
      }).then(function (dbList) {
          console.log(dbList);
          res.json(dbList);
      }).catch(function (err) {
          res.json(err);
      });

      //res.json(data);
  });
});

module.exports= router;