// Import base packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Session authentication and encryption packages
const passport = require("passport");

// Retrieve our database schema
const db = require("./models");

// Instantiate express
const app = express();
app.use(cors());
app.use(passport.initialize());
require("./config/passport")(passport);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// const users = require("./routes/api/users.js");
// app.use(users);

// Connect database for local testing
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoArtWave";

// Connect database for deployed version
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://artwave:password1@ds157276.mlab.com:57276/heroku_qxtn8tp0";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(() => {
    console.log("\nMongoDB successfully connected\n");
}).catch(err => {
    console.log(err);
});

const PORT = process.env.PORT || 8080;

// ROUTES -------------------------------------------------------------------------
app.use(require('./Routes/Login'));
app.use(require('./Routes/Register'));
app.use(require('./Routes/commentRoutes'));
app.use(require('./Routes/externalApiRoutes'));
app.use(require('./Routes/listRoutes'));
app.use(require('./Routes/mediaRoutes'));
app.use(require('./Routes/userRoutes'));

// 
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
