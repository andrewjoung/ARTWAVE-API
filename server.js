const express = require('express'); //require Express
const mongoose = require('mongoose'); //require Mongoose
var Spotify = require('node-spotify-api');
var cors = require('cors');
var spotify = new Spotify({
    id: 'b5d5612d07684ecdacbfd220fb70b4c9',
    secret: '7c527687d94c49f1a283872df71f004e'
});
var axios = require('axios');
let apiKey = '91413d43';





const db = require("./models"); //Define our DB

const PORT = process.env.PORT || 8080; //ports

const app = express();
app.use(cors())

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static("public"));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoArtWave";

mongoose.connect(MONGODB_URI);



app.post("/user/login", function (req, res) {
    // console.log(req.body);
    db.User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) throw err;
        console.log("db response", user);
        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            id: user._id,
            lists: user.lists,
            recommended: user.recommended,
            friends: user.friends
        });
    })
})

app.post("/register", function (req, res) {
    console.log(req.body);
    db.User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }).then(function () {
        res.json(req.body);
    })
})

//Route for searching album, returns 20 albums, which are images that are displayed and have onclick handlers

app.post('/album/', (req, res) => {
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
            bigO.search=data.albums.items[i].id
            
            array4.push(bigO)

        }

        res.json(array4);
    });
})

//route for returning and storing single album based on user click, parameters to re-search appropriate album and push to user specific list database
app.post('/album/:id/:title', (req, res) => {
    spotify.search({ type: 'album', query: `${req.params.title}` }, (err, data) => {

        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // console.log(data.tracks.items[0].album.id)
        for(var i = 0; i < data.albums.items.length; i++){
            if(req.params.id === data.albums.items[i].id){
                let bigO = {};
                let name = data.albums.items[i].name
                let artist = (data.albums.items[i].artists[0].name);
                let image = (data.albums.items[i].images[0].url);
    
                bigO.artist = artist;
                bigO.image = image;
                bigO.name = name;
                bigO.id = i
                bigO.search=data.albums.items[i].id

                console.log(bigO)
            }
        }
    })
})

//route for song search, identical to album
app.post('/song', (req, res) => {
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

//secondary song search based on specific user click, will store to user specific database
app.post('/song/:id/:title', (req, res) => {
    spotify.search({ type: 'track', query: `${req.params.title}` }, (err, data) => {

        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // console.log(data.tracks.items[0].album.id)
        for(var i = 0; i < data.tracks.items.length; i++){
            if(req.params.id === data.tracks.items[i].id){
                let bigO = {}
                bigO.name = name;
                bigO.image = image;
                bigO.artist = data.tracks.items[i].album.artists[0].name
            }
        }
    })
})

//route to find books for sure based on volume name
app.post('/books', (req, res) => {
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
        } res.send(array2)


    })
});
//searches for specific book based on book Id after user clicks to add to list
app.post('/books/:id', (req, res) => {
    axios.get(`https://www.googleapis.com/books/v1/volumes/${req.params.id}`).then(data => {
        db.Book.create({
            title: data.data.volumeInfo.title,
            author: data.data.volumeInfo.authors[0],
            artUri: data.data.volumeInfo.imageLinks.thumbnail,
            synopsis: data.data.volumeInfo.description,
            uri: data.data.selfLink
        })
    }).catch(err => {
        console.log(err)
    })
})


//searches 10 moives based on user input 
app.post('/movies', (req, res) => {
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

//searches specific user movie based on onClick and adds to user specific list
app.post('/movies/:id', (req, res) => {
    console.log('looking at movies')
    axios.get(`http://www.omdbapi.com/?i=${req.params.id}&apikey=${apiKey}`).then(data => {

        console.log(data.data.Title)
        db.Movie.create({
            title: data.data.Title,
            genre: data.data.Genre,
            actors: data.data.Actors,
            director: data.data.Director,
            artUri: data.data.Poster,
            synopsis: data.data.Plot,
            uri: data.data.Website
        })
    })
})


//Post route for comments, will send thorugh specific list Id (via mongo eg: __id) and comment to be added to list.
//Will also need 

app.post('/comments',(req,res)=>{
    console.log(req.body);
})

let omdb = `http://www.omdbapi.com/?s=matrix&y=&plot=short&apikey=${apiKey}`
axios.get(omdb).then(data=>{
    console.log(data.data.Search[0].imdbID)
})

//App will listen of ports
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
