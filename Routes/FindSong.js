var express = require('express');
var router = express.Router();
const Spotify = require('node-spotify-api');
const spotify = new Spotify({
    id: 'b5d5612d07684ecdacbfd220fb70b4c9',
    secret: '7c527687d94c49f1a283872df71f004e'
});

router.post('/song', (req, res) => {
  spotify.search({ type: 'track', query: `${req.body.title}` }, function (err, data) {
      let array4 = []
      if (err) {
          return console.log('Error occurred: ' + err);
      }
      console.log(data.tracks.items[0])
      for (var i = 0; i < data.tracks.items.length; i++) {
          let bigO = {};
          let image = (data.tracks.items[i].album.images[0].url);
          let name = data.tracks.items[i].name;
          bigO.name = name;
          bigO.image = image;
          bigO.artist = data.tracks.items[i].album.artists[0].name
          bigO.id = i
          bigO.search = data.tracks.items[i].id
          array4.push(bigO)


      }
      res.send(array4)


  });
});

module.exports = router;