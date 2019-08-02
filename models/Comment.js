const mongoose = require("mongoose");

// Save a reference to the Schema constructor
let Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
let CommentSchema = new Schema({
  // `title` is of type String
  user: {
      type: Schema.Types.ObjectId,
      ref: "User"
  },
  // `body` is of type String
  body: String,

  
});

// This creates our model from the above schema, using mongoose's model method
let Comment = mongoose.model("Comment", CommentSchema);

// Export the Note model
module.exports = Comment;