import mongoose from "mongoose";

const connectDB = async (db_url) => {
  await mongoose.connect(db_url);
  console.log("DB connected successfully.");
};

export default connectDB;
