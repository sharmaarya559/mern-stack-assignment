import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    comment: String,
    blog_id: mongoose.Types.ObjectId,
    user_id: mongoose.Types.ObjectId,
  },
  { timestamps: true }
);

const commentModel = mongoose.model("map_blog_Comments", CommentSchema);
export default commentModel;
