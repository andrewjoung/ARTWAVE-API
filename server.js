// Import base packages
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

// Session authentication and encryption packages
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const keys = require("./config/keys");

// API Information
// Spotify package and keys TODO: Move api keys to .env file
const Spotify = require('node-spotify-api');
const spotify = new Spotify({
    id: 'b5d5612d07684ecdacbfd220fb70b4c9',
    secret: '7c527687d94c49f1a283872df71f004e'
});
// OMDb key
let apiKey = '91413d43';

// Retrieve our database schema
const db = require("./models");

// Instantiate express
const app = express();
app.use(cors())
app.use(passport.initialize());
require("./config/passport")(passport);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// const users = require("./routes/api/users.js");
// app.use(users);
// app.use(express.static("public"));

// Connect database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoArtWave";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true}).then(() => {
    console.log("\nMongoDB successfully connected\n");
}).catch(err => {
    console.log(err);
});

const PORT = process.env.PORT || 8080;

// ROUTES -------------------------------------------------------------------------

// function to validate user provided login info
const validateLoginInput = require("./validation/login");

// 
app.post("/login", function(req, res) {
    const {errors, isValid} = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const username = req.body.username;
    const password = req.body.password;
    db.User.findOne({username}).then(user => {
        if(!user) {
            return res.status(404).json({usernameNotFound: "Username not found"});
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if(isMatch) {
                const payload = {
                    id: user.id,
                    name: user.firstName + " " + user.lastName
                };
                jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
                    if(err) throw err;
                    res.json({
                        success: true,
                        token: "Bearer " + token,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        email: user.email,
                        id: user._id,
                        lists: user.lists,
                        recommended: user.recommended,
                        friends: user.friends
                    });
                });
            } else {
                return res.status(400).json({passwordIncorrect: "Incorrect password"});
            }
        });
    });
});

// function to validate user provided registration info
const validateRegisterInput = require("./validation/register");

//
app.post("/register", function(req, res) {
    console.log(req.body);
    const {errors, isValid} = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    db.User.findOne({username: req.body.username}).then(user => {
        if (user) {
            return res.status(400).json({username: "Username is already in use - please choose another"});
        } else {
            const newUser = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            }
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw err;
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    db.User.create(newUser).then(user => {
                        console.log(user);
                        res.json(user);
                    }).catch(err => {
                        console.log(err);
                    });
                });
            });
        }
    });
});

//      
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
