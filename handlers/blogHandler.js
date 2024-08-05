const blogModel = require("../models/Blog");

const createBlog = async (req, res) => {
  const { title, subTitle, image, body } = req.body;

  // Check for required fields
  if (!title || !body) {
    return res
      .status(400)
      .json({ error: "Title and Body are required fields" });
  }

  try {
    // Create a new blog instance
    const newBlog = new blogModel({
      title,
      subTitle,
      image,
      body,
      author: req.id, // Assuming req.id contains the author's ID
    });

    // Save the blog to the database
    await newBlog.save();

    // Respond with the newly created blog
    return res.status(201).json(newBlog);
  } catch (error) {
    console.error("Error creating blog:", error.message);
    return res.status(500).json({ error: "Failed to create blog" });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const blogs = await blogModel
      .find({}, { _id: 1, title: 1, subTitle: 1, image: 1 })
      // .limit(21)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await blogModel.countDocuments();
    return res.status(200).send({ blogs, total });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "An error occurred while fetching blogs" });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;
    const blog = await blogModel
      .findById(id)
      .populate("author")
      .populate({
        path: "comments.author",
        model: "users",
      })
      .lean();
    if (!blog) {
      return res.status(404).send({ error: "Blog not found" });
    }
    console.log(userId + "\n" + blog.author._id.toString());
    blog.isAuthor = userId === blog.author._id.toString();
    // console.log(blog);
    return res.status(200).send({ blog });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "An error occurred while fetching the blog" });
  }
};

const getBlogsByUser = async (req, res) => {
  try {
    const { id } = req;
    const blogs = await blogModel
      .find({ author: id }, { _id: 1, image: 1, title: 1, subTitle: 1 })
      .sort({ createdAt: -1 })
      .lean();
    if (!blogs) {
      return res.status(404).send({ error: "Blog not found" });
    }
    return res.status(200).send({ blogs });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "An error occurred while fetching the user blog" });
  }
};

const deleteBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.author.toString() !== req.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await blogModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the blog" });
  }
};

const editBlogById = async (req, res) => {
  const { id } = req.params;
  const { title, subTitle, image, body } = req.body;

  try {
    const blog = await blogModel.findByIdAndUpdate(
      id,
      { title, subTitle, image, body },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({ blog });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the blog" });
  }
};

const addCommentToBlog = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body; // Assuming you receive the comment text and userId in the request body
  const userId = req.id;
  try {
    // Find the blog post by its ID
    const blog = await blogModel.findById(id);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Create a new comment object
    const newComment = {
      text,
      author: userId, // Assuming userId is passed in the request body or can be derived from authentication
    };

    // Push the new comment to the comments array
    blog.comments.push(newComment);

    // Save the updated blog post with the new comment
    await blog.save();

    return res.status(201).json(blog);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to add comment" });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByUser,
  deleteBlogById,
  editBlogById,
  addCommentToBlog,
};
