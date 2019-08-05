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


app.post('/album/', (req, res) => {
    spotify.search({ type: 'album', query: `${req.body.title}` }, function (err, data) {
        let array4 = []
        if (err) {
            return console.log('Error occurred: ' + err);
        }


        for (var i = 0; i < data.albums.items.length; i++) {
            let bigO = {};
            let name = data.albums.items[i].name
            let artist = (data.albums.items[i].artists[0].name);
            let image = (data.albums.items[i].images[0].url);

            bigO.artist = artist;
            bigO.image = image;
            bigO.name = name;
            bigO.id = i
            array4.push(bigO)

        }
        console.log(array4)
        // console.log(data.albums.items[0])


        res.json(array4);

    });


})

app.post('/song', (req, res) => {
    spotify.search({ type: 'track', query: `${req.body.title}` }, function (err, data) {
        let array4 = []
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // console.log(data.tracks.items[0].album.name)
        for (var i = 0; i < data.tracks.items.length; i++) {
            let bigO = {};
            let image = (data.tracks.items[i].album.images[0].url);
            let name = data.tracks.items[i].name;
            bigO.name = name;
            bigO.image = image;
            bigO.artist = data.tracks.items[i].album.artists[0].name
            bigO.id = i
            array4.push(bigO)


        }
        res.send(array4)

    });
})


app.post('/books', (req, res) => {
    axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.body.title}`).then(response => {
        let array2 = []



        for (var i = 0; i < response.data.items.length; i++) {
            if (response.data.items[i].volumeInfo.imageLinks) {

                let emptyO = { name: '', image: '', id: i }
                emptyO.name = response.data.items[i].volumeInfo.title
                emptyO.image = response.data.items[i].volumeInfo.imageLinks.thumbnail

                array2.push(emptyO)

            }
        } res.send(array2)


    })
});


app.post('/movies', (req, res) => {
    let omdb = `http://www.omdbapi.com/?s=${req.body.title}&y=&plot=short&apikey=${apiKey}`
    axios.get(omdb).then(response => {
        console.log(req.body.title)
        let array2 = []

        for (var i = 0; i < response.data.Search.length; i++) {
            if (response.data.Search[i].Poster !== 'N/A') {

                let emptyO = { name: '', image: '', id: i }
                emptyO.name = response.data.Search[i].Title;
                emptyO.image = response.data.Search[i].Poster;

                array2.push(emptyO)

            }

        }
        res.send(array2)






    }).catch(err => {
        console.log(err)
    })
    

})



//App will listen of ports
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
