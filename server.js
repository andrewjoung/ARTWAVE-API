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

mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(() => {
    console.log("\nMongoDB successfully connected\n");
}).catch(err => {
    console.log(err);
});

const PORT = process.env.PORT || 8080;

// ROUTES -------------------------------------------------------------------------

// function to validate user provided login info
const validateLoginInput = require("./validation/login");

// 
app.post("/login", function (req, res) {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const username = req.body.username;
    const password = req.body.password;
    db.User.findOne({ username }).then(user => {
        if (!user) {
            return res.status(404).json({ usernameNotFound: "Username not found" });
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const payload = {
                    id: user.id,
                    name: user.username
                };
                jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                    if (err) throw err;
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
                return res.status(400).json({ passwordIncorrect: "Incorrect password" });
            }
        });
    });
});

// function to validate user provided registration info
const validateRegisterInput = require("./validation/register");

//
app.post("/register", function (req, res) {
    console.log(req.body);
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    db.User.findOne({ username: req.body.username }).then(user => {
        if (user) {
            return res.status(400).json({ username: "Username is already in use - please choose another" });
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
app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);
    db.User.find({}).then(users => {
        const friends = users.filter(user => {
            if (user._id === req.params.id) {
                return false;
            }
            return true;
        });
        console.log(friends);
        res.json(friends);
    }).catch(err => {
        console.log(err);
        res.end();
    });
});

// 
app.put("/addFriend", (req, res) => {
    const {userId, friendId} = req.body;
    db.User.update({_id: userId}, {$push: {friends: friendId}}).then(dbRes => {
        console.log(dbRes);
        res.json(dbRes);
    }).catch(err => {
        console.log(err);
        res.end();
    });
});

//
app.get("/getFriends/:id", (req, res) => {
    // use populate to get all friends
    db.User.findOne({_id: req.params.id}).populate("friends").then(dbRes => {
        console.log("User friends: \n", dbRes);
        res.json(dbRes);
    }).catch(err => {
        console.log(err);
        res.end();
    });
});

//      
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
            bigO.search = data.albums.items[i].id

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
        }).then(function (dbBook) {
            return db.List.findOneAndUpdate({ _id: req.body.id }, { $push: { items: dbBook._id } }, { new: true });
        }).then(function (dbList) {
            console.log("pushing into book list", dbList);
            res.json(dbList);
        }).catch(function (err) {
            res.json(err);
        });
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

        console.log("testing scott's stuff", req.body);
        console.log(data.data.Title)
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
            console.log(dbList);
            res.json(dbList);
        }).catch(function (err) {
            res.json(err);
        });

        //res.json(data);
    });
});

app.post("/create-list", function (req, res) {
    console.log(req.body);
    db.List.create({ title: req.body.title, category: req.body.category, pinned: req.body.pinned }).then(function (dbList) {
        res.json(dbList);
        return db.User.findOneAndUpdate({ username: req.body.username }, { $push: { lists: dbList._id } }, { new: true });
    }).then(function (dbUser) {
        //res.json(dbUser);
        console.log(dbUser);
    }).catch(function (err) {
        res.json(err);
    });
});

app.get("/user/:id", function (req, res) {
    console.log("testing display list stuff", req.params.id);
    db.User.findOne({ username: req.params.id }).populate("lists").then(function (dbUser) {
        console.log(dbUser)
        res.json(dbUser);
    }).catch(function (err) {
        res.json(err);
    });
});
//Post route for comments, will send thorugh specific list Id (via mongo eg: __id) and comment to be added to list.
//Will also need 

app.post('/comments', (req, res) => {
    console.log(req.body);
})

app.post('/list/:id/:category', (req, res) => {
    var array = []
    console.log('this is being checked')
    const { id, category } = req.params
    db.List.findOne({
        _id: id
    }).then(data => {
        let array = []
        let count = 0

        if (category === 'cinema') {
            for (var i = 0; i < data.items.length; i++) {
                db.Movie.findOne({ _id: data.items[i] }).then(data2 => {
                    array.push(data2)
                    count++
                    if (count === data.items.length) {
                        res.send({array,id})
                    }
                })

            }


        }
        else if (category === 'literature') {
            for (var i = 0; i < data.items.length; i++) {
                db.Book.findOne({ _id: data.items[i] }).then(data2 => {
                    array.push(data2)
                    count++
                    if (count === data.items.length) {
                        res.send({array,id})
                        // console.log()

                    }
                })

            }
        }
        else if(category==='music') {
            for(var i = 0; i < data.items.length; i++){
                db.Music.findOne({_id:data.items[i]}).then(data2=>{
                    array.push(data2);
                    count++
                    if(count === data.items.length){
                        
                        res.send({array,id})
                    }
                })
            }

        }

    })
})

app.post('/commentSubmit',(req,res)=>{
    console.log(req.body)
    const{id,comment,listId}=req.body;
    // console.log(id)
    db.Comment.create({
        user:listId,
        body:comment
    }).then(data2=>{
        console.log(data2)
    })

    // db.List.user({_id:id.id}).populate('list').then(data3=>{
    //     console.log(data3)
    // })
 


})

app.post('/listItem', (req, res) => {
    const { id, type } = req.body;
    if (type === 'cinema') {
        axios.get(`http://www.omdbapi.com/?i=${id}&apikey=${apiKey}`).then(data => {
            res.send(data.data)
        })
    }
})

//App will listen of ports
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
