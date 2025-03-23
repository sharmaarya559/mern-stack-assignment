import mongoose, { Schema } from "mongoose";

const BlogSchema = new Schema(
  {
    title: String,
    description: String,
    author_id: mongoose.Types.ObjectId,
    category: String,
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const blogModel = mongoose.model("blogs", BlogSchema);
export default blogModel;
