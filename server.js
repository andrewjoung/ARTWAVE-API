const express = require('express'); //require Express
const mongoose = require('mongoose'); //require Mongoose

const db = require("./models"); //Define our DB

const PORT = process.env.PORT || 8080; //ports

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoArtWave";

mongoose.connect(MONGODB_URI);


//App will listen of ports
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});