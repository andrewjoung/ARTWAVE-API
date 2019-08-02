const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let BookSchema = new Schema({

    title: {
        type:String,
        required:true
    },

    author: {
        type: String,
        required:true
    },
    artUri:String,
    synopsis: String,
    uri: String
});

let Book = mongoose.model("Book", BookSchema);

module.exports = Book;