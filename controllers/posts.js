import Post from "../models/Post.js";
import User from "../models/User.js";

// Create
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const { firstName, lastName, location } = user;
    const userPicturePath = user.picturePath;

    const newPost = new Post({
      userId,
      firstName,
      lastName,
      location,
      description,
      picturePath,
      userPicturePath,
      likes: {},
      comments: [],
    });

    await Post.save(newPost);
    const allPosts = await Post.find();

    res.status(201).json(allPosts);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

// READ

export const getFeedPosts = async (req, res) => {
  try {
    const allPosts = await Post.find();
    res.status(200).json(allPosts);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const userPosts = await Post.find({ userId });
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// UPDATE
export const likePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);

    if (userId in post?.likes) {
      post.likes.delete(userId);
    } else {
      post.likes[userId] = true;
    }

    const updatedPost = Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// DELETE
