// Import base packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Session authentication and encryption packages
const passport = require("passport");

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

// Connect database for local testing
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoArtWave";

//connect database for deployed version
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://artwave:password1@ds157276.mlab.com:57276/heroku_qxtn8tp0";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(() => {
    console.log("\nMongoDB successfully connected\n");
}).catch(err => {
    console.log(err);
});

const PORT = process.env.PORT || 8080;

// ROUTES -------------------------------------------------------------------------

// function to validate user provided login info

//route that allows user to login, all packages are moved to modularized file
app.use(require('./Routes/Login'));

//route used to validate user registration info
app.use(require('./Routes/Register'));

//route used to find users with their id, im not sure what it does
app.use(require('./Routes/UsersId'))

//route used to display friends that exist on same server
app.use(require('./Routes/AddFriend'))

//route used to dsplay all friends in database
app.use(require('./Routes/GetFriends'))

// route used to generate all albums chosen when searched
app.use(require('./Routes/FindAlbum'));

//route used to place all clicked on albums into their own list (music)
app.use(require('./Routes/ChosenAlbum'));

//route used to generate all songs when user searches;
app.use(require('./Routes/FindSong'));

//route used to add clicked song to user list;
app.use(require('./Routes/ChosenSong'));

//route used to fidn and generate all books upon use search;
app.use(require('./Routes/FindBook'));

//route used to add chosen book Id to user list;
app.use(require('./Routes/ChosenBook'));

//route us4ed to find and generate movies on the main page;
app.use(require('./Routes/FindMovie'));
//route used to add clicked on movie to list wit user Id
app.use(require('./Routes/ChosenMovie'));

//route used to create a list after user clicks on create list button
app.use(require('./Routes/CreateList'));

//route used to display just user create lists on main
app.use(require('./Routes/UserLists'));

//largest function of server, used to display list that is clicked via each individual component and to use all of its comments as well
app.use(require('./Routes/ClickedList'));

//route used to send comment and apply it to certain list via population of comment model into list model with user ID
app.use(require('./Routes/CommentSubmit'));

app.use(require('./Routes/getListData'));

app.use(require('./Routes/getMovieItem'));

app.use(require('./Routes/getMusicItem'));

app.use(require('./Routes/getBookItem'));

app.use(require('./Routes/addCommentToList'));

app.use(require('./Routes/ListItem'));

app.use(require('./Routes/SeeFriend'));


//App will listen of ports
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
