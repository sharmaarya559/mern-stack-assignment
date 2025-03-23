import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    email: String,
    username: String,
    hashed_password: String,
    lang: { type: String, enum: ["EN", "HI"], default: "EN" },
    email_verified_at: {
      type: Date,
      default: null,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
    last_login: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", UserSchema);
export default userModel;
