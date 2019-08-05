const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ListSchema = new Schema({

    items:[
        {
            type: Schema.Types.ObjectId,
            ref:"Book"
        },
        {
            type: Schema.Types.ObjectId,
            ref:"Movie"
        },
        {
            type: Schema.Types.ObjectId,
            ref:"Music"
        }
    ],
    pinned: false,
    comments:[
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    category: {
        type: String,
        required:true
    }
});

let List = mongoose.model("List", ListSchema);

module.exports = List;