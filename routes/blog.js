const express = require("express");
const userModel = require("../models/User");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByUser,
  deleteBlogById,
  editBlogById,
  addCommentToBlog,
} = require("../handlers/blogHandler");

const blogRouter = express.Router();

blogRouter.post("/create", createBlog);
blogRouter.get("/", getAllBlogs);
blogRouter.get("/user", getBlogsByUser);
blogRouter.get("/:id", getBlogById);
blogRouter.delete("/:id", deleteBlogById);
blogRouter.put("/:id", editBlogById);
blogRouter.post("/:id/comment", addCommentToBlog);

module.exports = blogRouter;
