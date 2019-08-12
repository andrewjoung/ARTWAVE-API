var express = require('express');
var router = express.Router();
require('dotenv').config()
let apiKey = process.env.apikey;
let axios = require('axios')


router.post('/movies', (req, res) => {
  let omdb = `http://www.omdbapi.com/?s=${req.body.title}&y=&plot=short&apikey=${apiKey}`
  axios.get(omdb).then(response => {

      // console.log(response.data)
      let array2 = []

      for (var i = 0; i < response.data.Search.length; i++) {
          if (response.data.Search[i].Poster !== 'N/A') {

              let emptyO = { name: '', image: '', id: i, searchId: '' };
              emptyO.name = response.data.Search[i].Title;
              emptyO.image = response.data.Search[i].Poster;
              emptyO.searchId = response.data.Search[i].imdbID;
              // console.log(response.data.Search[i].imdbID)
              array2.push(emptyO);
          }
      }
      res.send(array2)
  }).catch(err => {
      console.log(err)
  })


})

module.exports= router;