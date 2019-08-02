const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let MusicSchema = new Schema({

    tracks: [],

    artist: {
        type:String,
        required:true
    },

    artUri:String,
    albumTitle: String,
    uri: String
});

let Music = mongoose.model("Music", MusicSchema);

module.exports = Music;