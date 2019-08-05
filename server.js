const express = require('express'); //require Express
const mongoose = require('mongoose'); //require Mongoose
const cors = require("cors");
// const bcrypt = require("bcrypt");

const db = require("./models"); //Define our DB

const PORT = process.env.PORT || 8080; //ports

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

app.use(cors());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoArtWave";

mongoose.connect(MONGODB_URI);

app.get("/", function(req, res) {
    res.send("hello world");
});

app.post("/register", function(req, res) {
    console.log(req.body);
    res.json(req.body);
});

//App will listen of ports
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});