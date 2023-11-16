import mongoose from "mongoose";

export const PostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide unique Username"],
  },

  email: {
    type: String,
  },
  description: {
    type: String,
    required: [true],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

export default mongoose.model.Users || mongoose.model("Post", PostSchema);
