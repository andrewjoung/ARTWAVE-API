const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    //full name of the user 
    name: {
        type: String,
        require: true
    },
    //user email address
    email: {
        type: String,
        require: true
    },
    //user password
    password: {
        type: String,
        require: true
    },
    //an array of lists that will be populated by the list model 
    lists: [
        {
            type: Schema.Types.ObjectId,
            ref: "List"
        }
    ],
    //an array of recommended lists that will be populated by the list model
    recommended: [
        {
            type: Schema.Types.ObjectId,
            ref: "List"
        }
    ],
    //an array of friends that will be populated by the user model
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

let User = mongoose.model("User", UserSchema);

module.exports = User;