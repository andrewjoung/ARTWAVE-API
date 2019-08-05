const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let MovieSchema = new Schema({

    title: {
        type:String,
        required:true
    },
    genre: String,
    actors: String,
    director: String,
    artUri:String,
    synopsis: String,
    uri: String
});

let Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;