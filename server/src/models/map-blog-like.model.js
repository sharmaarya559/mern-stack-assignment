import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema(
  {
    blog_id: mongoose.Types.ObjectId,
    user_id: mongoose.Types.ObjectId,
  },
  { timestamps: true }
);

const likeModel = mongoose.model("map_blog_likes", LikeSchema);
export default likeModel;
