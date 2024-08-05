const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.ObjectId, ref: 'users', required: true }, // Reference to the User model
  createdAt: { type: Date, default: Date.now },
});

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
    },
    body: {
      type: String,
      required: true,
    },
    image : {
      type : String,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: true,
    },
    likes : {
      type : Number,
      required : true,
      default : 0,
    },
    comments : [commentSchema]
  },
  { timestamps: true }
);

const blog = mongoose.model("blogs", blogSchema);

module.exports = blog;
