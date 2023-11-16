import PostModel from "../models/PostModel.js";

export async function createPost(req, res) {
  try {
    const PostData = req.body;
    const { userId } = req.user;

    if (PostData) {
      const post = new PostModel({ ...PostData, author: userId });
      const result = await post.save();
      return res
        .status(201)
        .json({ msg: "post created Successfully", data: result });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getPost(req, res) {
  try {
    const { userId } = req.user;
    console.log(userId)

    if (userId) {
      const post = await  PostModel.find({author:userId});
      
      return res.status(201).json({ data:post });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
