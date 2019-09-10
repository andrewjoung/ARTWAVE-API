var express = require('express');
const axios = require('axios');
const Spotify = require('node-spotify-api');

require('dotenv').config()

const spotify = new Spotify({
    id: process.env.spotifyId,
    secret: process.env.spotifySecret
});

var router = express.Router();

//
router.post('/books', (req, res) => {
    axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.body.title}`).then(response => {
        let array2 = []
        console.log(response.data)
        for (var i = 0; i < response.data.items.length; i++) {
            if (response.data.items[i].volumeInfo.imageLinks) {

                let emptyO = { name: '', image: '', id: i }
                emptyO.name = response.data.items[i].volumeInfo.title;
                emptyO.image = response.data.items[i].volumeInfo.imageLinks.thumbnail;
                emptyO.Search = response.data.items[i].id;

                array2.push(emptyO)
            }
        }
        res.send(array2)
    })
});

//
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

//
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
});

//
router.post('/movies', (req, res) => {
    let omdb = `http://www.omdbapi.com/?s=${req.body.title}&y=&plot=short&apikey=${process.env.apiKey}`
    axios.get(omdb).then(response => {
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
    });
});

// Not sure if this route is still necessary - TODO: Scott to confirm
// router.post('/listItem', (req, res) => {
//     const { id, type } = req.body;
//     if (type === 'cinema') {
//         axios.get(`http://www.omdbapi.com/?i=${id}&apikey=${apiKey}`).then(data => {
//             res.send(data.data)
//         })
//     }
// });

module.exports = router;