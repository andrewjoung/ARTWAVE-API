const express = require('express');
const axios = require('axios');
const Spotify = require('node-spotify-api');

require('dotenv').config();

const db = require("../models");

const spotify = new Spotify({
    id: process.env.spotifyId,
    secret: process.env.spotifySecret
});

var router = express.Router();

//
router.get('/book/:id', (req, res) => {
    db.Book.findOne({_id: req.params.id}).then(bookData => {
        // console.log(bookData);
        res.json(bookData);
    }).catch(err => {
        console.log(err);
        res.end();
    });
});

//
router.get('/movie/:id', (req, res) => {
    db.Movie.findOne({_id: req.params.id}).then(movieData => {
        // console.log(movieData);
        res.json(movieData);
    }).catch(err => {
        console.log(err);
        res.end();
    });
});

//
router.get('/music/:id', (req, res) => {
    db.Music.findOne({_id: req.params.id}).then(musicData => {
        // console.log(musicData);
        res.json(musicData);
    }).catch(err => {
        console.log(err);
        res.end();
    });
});

//
router.post('/movies/:id', (req, res) => {
    // console.log('looking at movies')
    axios.get(`http://www.omdbapi.com/?i=${req.params.id}&apikey=${process.env.apiKey}`).then(data => {

        // console.log("testing scott's stuff", req.body);
        // console.log(data.data.Title)
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
            // console.log(dbList);
            res.json(dbList);
        }).catch(function (err) {
            res.json(err);
        });

        //res.json(data);
    });
});

//
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
            // console.log("pushing into book list", dbList);
            res.json(dbList);
        }).catch(function (err) {
            res.json(err);
        });
    }).catch(err => {
        console.log(err)
    })
});

//
router.post('/album/:id/:title', (req, res) => {
    spotify.search({ type: 'album', query: `${req.params.title}` }, (err, data) => {

        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // console.log(data.tracks.items[0].album.id)
        for (var i = 0; i < data.albums.items.length; i++) {
            if (req.params.id === data.albums.items[i].id) {
                // console.log(data.albums.items[i])
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
                    // console.log("Adding music item into", dbList);
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

//
router.post('/song/:id/:title', (req, res) => {
    spotify.search({ type: 'track', query: `${req.params.title}` }, (err, data) => {

        if (err) {
            return console.log('Error occurred: ' + err);
        }

        for (var i = 0; i < data.tracks.items.length; i++) {

            if (req.params.id === data.tracks.items[i].id) {
                // console.log(data.tracks.items[i])
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
                    // console.log('checking')
                    return db.List.findOneAndUpdate({ _id: req.body.id }, { $push: { items: dbMusic._id } }, { new: true });
                }).then(function (dbList) {
                    // console.log("Adding music item into", dbList);
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