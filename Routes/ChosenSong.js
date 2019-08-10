var express = require('express');
var router = express.Router();
const db = require("../models");
const Spotify = require('node-spotify-api');
const spotify = new Spotify({
    id: 'b5d5612d07684ecdacbfd220fb70b4c9',
    secret: '7c527687d94c49f1a283872df71f004e'
});




router.post('/song/:id/:title', (req, res) => {
  spotify.search({ type: 'track', query: `${req.params.title}` }, (err, data) => {

      if (err) {
          return console.log('Error occurred: ' + err);
      }


      for (var i = 0; i < data.tracks.items.length; i++) {

          if (req.params.id === data.tracks.items[i].id) {
              console.log(data.tracks.items[i])
              let array = []
              array.push(data.tracks.items[i].name);
              let artist = (data.tracks.items[i].artists[0].name);
              let uri = (data.tracks.items[i].uri);
              let artUri = (data.tracks.items[i].album.images[0].url);
              let albumTitle = (data.tracks.items[i].album.name);
              let searchId = data.tracks.items[i].id

              db.Music.create({
                  tracks: array,
                  artist,
                  artUri,
                  albumTitle,
                  uri,
                  searchId
              }).then(function (dbMusic) {
                  console.log('checking')
                  return db.List.findOneAndUpdate({ _id: req.body.id }, { $push: { items: dbMusic._id } }, { new: true });
              }).then(function (dbList) {
                  console.log("Adding music item into", dbList);
                  res.json(dbList);
              }).catch(function (err) {
                  //console.log(err);
                  res.json(err);
              });
          }
      }
  })
});
module.exports = router;