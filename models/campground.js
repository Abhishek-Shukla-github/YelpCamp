let mongoose = require("mongoose");
let Comment = require("./comment");
let campgroundSchema = new mongoose.Schema({
  name: String,
  img: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  desc: String,
});

module.exports = mongoose.model("Campground", campgroundSchema);
