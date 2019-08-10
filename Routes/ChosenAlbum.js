var express = require('express');
var router = express.Router();
let apiKey = '91413d43';
let axios = require('axios');
const db = require("../models");
const Spotify = require('node-spotify-api');
const spotify = new Spotify({
    id: 'b5d5612d07684ecdacbfd220fb70b4c9',
    secret: '7c527687d94c49f1a283872df71f004e'
});

router.post('/album/:id/:title', (req, res) => {
  spotify.search({ type: 'album', query: `${req.params.title}` }, (err, data) => {

    if (err) {
      return console.log('Error occurred: ' + err);
    }
    // console.log(data.tracks.items[0].album.id)
    for (var i = 0; i < data.albums.items.length; i++) {
      if (req.params.id === data.albums.items[i].id) {
        console.log(data.albums.items[i])
        let name = data.albums.items[i].name
        let artist = (data.albums.items[i].artists[0].name);
        let image = (data.albums.items[i].images[0].url);

        artist = artist;
        artUri = image;
        albumTitle = name
        searchId = data.albums.items[i].id
        uri = (data.albums.items[i].uri)
        db.Music.create({
          artist,
          artUri,
          albumTitle,
          uri,
          searchId
        }).then(function (dbMusic) {
          return db.List.findOneAndUpdate({ _id: req.body.id }, { $push: { items: dbMusic._id } }, { new: true });
        }).then(function (dbList) {
          console.log("Adding music item into", dbList);
          res.json(dbList);
        }).catch(function (err) {
          //console.log(err);
          res.json(err);
        });


        // console.log(artist,artUri,albumTitle,searchId)
      }
    }
  })
})

module.exports = router;