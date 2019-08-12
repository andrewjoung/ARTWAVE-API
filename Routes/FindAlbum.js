var express = require('express');
var router = express.Router();
const Spotify = require('node-spotify-api');
require('dotenv').config()
const spotify = new Spotify({
    id: process.env.spotifyId,
    secret: process.env.spotifySecret
});

router.post('/album/', (req, res) => {
  spotify.search({ type: 'album', query: `${req.body.title}` }, function (err, data) {
      let array4 = []
      if (err) {
          return console.log('Error occurred: ' + err);
      }
      console.log('checking albums')
      console.log(data.albums.items[0])
      for (var i = 0; i < data.albums.items.length; i++) {
          let bigO = {};
          let name = data.albums.items[i].name
          let artist = (data.albums.items[i].artists[0].name);
          let image = (data.albums.items[i].images[0].url);

          bigO.artist = artist;
          bigO.image = image;
          bigO.name = name;
          bigO.id = i
          bigO.search = data.albums.items[i].id

          array4.push(bigO)

      }

      res.json(array4);
  });
})

module.exports = router;