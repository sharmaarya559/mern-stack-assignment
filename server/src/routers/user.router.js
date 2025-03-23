import express from "express";
import {
  createBlog,
  createCommentOnBlog,
  deleteBlog,
  deleteMyComment,
  getAllBlogs,
  getSingleBlog,
  likeBlog,
  login,
  register,
  updateBlog,
} from "../controllers/user.controller.js";
import userAuthMiddeware from "../middlewares/user.auth.middleware.js";

const userRouter = express.Router();
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/posts", userAuthMiddeware, createBlog);
userRouter.put("/posts/:blog_id", userAuthMiddeware, updateBlog);
userRouter.delete("/posts/:blog_id", userAuthMiddeware, deleteBlog);
userRouter.get("/posts", getAllBlogs);
userRouter.get("/posts/:blog_id", getSingleBlog);
userRouter.post("/posts/like/:blog_id", userAuthMiddeware, likeBlog);
userRouter.post(
  "/posts/comment/:blog_id",
  userAuthMiddeware,
  createCommentOnBlog
);
userRouter.delete(
  "/posts/delete_comment/:comment_id",
  userAuthMiddeware,
  deleteMyComment
);

export default userRouter;
