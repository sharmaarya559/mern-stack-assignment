import AppError from "../exceptions/custom.exception.js";
import userModel from "../models/user.model..js";
import blogModel from "../models/blog.model.js";
import { SuccessMsg } from "../Utils/success-message.utils.js";
import { ErrorMsg } from "../Utils/error-message.helper.js";
import {
  commentDto,
  createBlogDto,
  loginDto,
  registerDto,
  updateBlogDto,
} from "../validations/user.dto.js";
import * as bcrypt from "bcrypt";
import { EN } from "../Utils/constants.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import commentModel from "../models/map-blog-comment.js";
import likeModel from "../models/map-blog-like.model.js";

export const register = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      username,
      password,
      confirm_password,
    } = req.body;
    const { success, error } = registerDto(
      first_name,
      last_name,
      email,
      username,
      password,
      confirm_password
    );
    if (!success) {
      return res.status(400).json({
        success: true,
        statusCode: 400,
        message: error,
      });
    }
    const findUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });
    if (findUser) {
      return next(new AppError(ErrorMsg?.USER_EXIST, 400));
    }
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
    const newUser = await new userModel({
      first_name,
      last_name,
      email,
      hashed_password: hashedPassword,
      username,
    }).save();
    const token = await jwt.sign(
      { id: newUser?._id, role: "user" },
      process.env.JWT_SECRET_KEY
    );
    return res.status(201).json({
      success: true,
      message: SuccessMsg?.USER_REGISTERED,
      user_id: newUser?._id,
      token,
    });
  } catch (error) {
    return next(new AppError(error.message, error.status));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email_or_username, password } = req.body;
    const { success, error } = loginDto(email_or_username, password);
    if (!success) {
      return res.status(400).json({
        success: true,
        statusCode: 400,
        message: error,
      });
    }
    const user = await userModel.findOne({
      $or: [{ email: email_or_username }, { username: email_or_username }],
      deleted_at: null,
    });
    if (!user) {
      return next(new AppError(ErrorMsg?.USER_NOT_EXIST));
    }
    const matchPassword = await bcrypt.compare(password, user?.hashed_password);
    if (!matchPassword) {
      return next(new AppError(ErrorMsg?.INVALID_CREDENTIALS));
    }
    const token = await jwt.sign(
      { id: user?._id, role: "user" },
      process.env.JWT_SECRET_KEY
    );
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: SuccessMsg?.LOGIN_SUCCESSFULL,
      token,
      user_id: user?._id,
    });
  } catch (error) {
    return next(new AppError(error.message, error.status));
  }
};

export const createBlog = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const { success, error } = createBlogDto(title, description, category);
    if (!success) {
      return res.status(400).json({
        success: true,
        statusCode: 400,
        message: error,
      });
    }
    await new blogModel({
      title,
      description,
      category,
      author_id: req["user"]["_id"],
    }).save();
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: SuccessMsg?.BLOG_CREATED,
    });
  } catch (error) {
    return next(new AppError(error.message, error.status));
  }
};

export const getAllBlogs = async (req, res, next) => {
  try {
    const { page, limit, search, user_id, my_blogs } = req.query;
    let query = {};
    if (my_blogs == "true") {
      query = { author_id: new mongoose.Types.ObjectId(user_id) };
    }
    const data = await blogModel.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: `.*${search || ""}.*`, $options: "i" } },
            { description: { $regex: `.*${search || ""}.*`, $options: "i" } },
          ],
          deleted_at: null,
          ...query,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          my_blog: {
            $cond: {
              if: {
                $eq: [user_id?.toString(), { $toString: "$author_id" }],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          as: "author",
          let: { author_id: "$author_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$author_id"],
                },
              },
            },
            {
              $project: {
                full_name: { $concat: ["$first_name", " ", "$last_name"] },
                username: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$author",
        },
      },
      {
        $lookup: {
          from: "map_blog_likes",
          as: "likes",
          let: { blog_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$blog_id", "$$blog_id"],
                },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "map_blog_comments",
          as: "comments",
          let: { blog_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$blog_id", "$$blog_id"],
                },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
      {
        $facet: {
          paginatedResults: [
            { $skip: (Number(page || 1) - 1) * Number(limit || 10) },
            { $limit: Number(limit || 10) },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
      {
        $addFields: {
          total: {
            $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
          },
        },
      },
      {
        $project: {
          paginatedResults: 1,
          total: 1,
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      statusCode: 200,
      current_page: Number(page || 1),
      total_pages:
        Math.ceil(Number(data[0]?.total || 0) / Number(limit || 10)) || 0,
      limit: Number(limit || 10),
      total: Number(data[0]?.total || 0),
      data: data[0]?.paginatedResults,
    });
  } catch (error) {
    return next(new AppError(error.message, error.status));
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const { success, error } = updateBlogDto(title, description, category);
    if (!success) {
      return res.status(400).json({
        success: true,
        statusCode: 400,
        message: error,
      });
    }
    const findBlog = await blogModel.findOne({
      _id: new mongoose.Types.ObjectId(req.params.blog_id),
      author_id: new mongoose.Types.ObjectId(req["user"]["_id"]),
    });
    if (!findBlog) {
      return next(new AppError(ErrorMsg?.BLOG_NOT_FOUND, 400));
    }
    await blogModel.findByIdAndUpdate(req.params.blog_id, {
      title,
      description,
      category,
    });
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: SuccessMsg?.BLOG_UPDATED,
    });
  } catch (error) {
    return next(new AppError(error.message, error.status));
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const findBlog = await blogModel.findOne({
      _id: new mongoose.Types.ObjectId(req.params.blog_id),
      author_id: new mongoose.Types.ObjectId(req["user"]["_id"]),
    });
    if (!findBlog) {
      return next(new AppError(ErrorMsg?.BLOG_NOT_FOUND, 400));
    }
    await blogModel.findByIdAndUpdate(req.params.blog_id, {
      deleted_at: new Date(),
    });
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: SuccessMsg?.BLOG_DELETED,
    });
  } catch (error) {
    return next(new AppError(error.message, error.status));
  }
};

export const getSingleBlog = async (req, res, next) => {
  try {
    const data = await blogModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.blog_id),
          deleted_at: null,
        },
      },
      {
        $addFields: {
          my_blog: {
            $cond: {
              if: {
                $eq: [req.query?.user_id, { $toString: "$author_id" }],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          as: "author",
          let: { author_id: "$author_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$author_id"],
                },
              },
            },
            {
              $project: {
                full_name: { $concat: ["$first_name", " ", "$last_name"] },
                username: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$author",
        },
      },
      {
        $lookup: {
          from: "map_blog_likes",
          as: "likes",
          let: { blog_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$blog_id", "$$blog_id"],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                as: "liked_by",
                let: { user_id: "$user_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$user_id"],
                      },
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$liked_by",
              },
            },
            {
              $project: {
                full_name: {
                  $concat: ["$liked_by.first_name", " ", "$liked_by.last_name"],
                },
                username: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "map_blog_comments",
          as: "comments",
          let: { blog_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$blog_id", "$$blog_id"],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                as: "comment_by",
                let: { user_id: "$user_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$_id", "$$user_id"],
                      },
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$comment_by",
              },
            },
            {
              $project: {
                full_name: {
                  $concat: [
                    "$comment_by.first_name",
                    " ",
                    "$comment_by.last_name",
                  ],
                },
                username: "$comment_by.username",
                comment: 1,
                author_id: 1,
                my_comment: {
                  $cond: {
                    if: {
                      $eq: [
                        req.query?.user_id,
                        { $toString: "$comment_by._id" },
                      ],
                    },
                    then: true,
                    else: false,
                  },
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          likes_count: { $size: "$likes" },
          comments_count: { $size: "$comments" },
        },
      },
    ]);
    if (!data[0]) {
      return next(new AppError(ErrorMsg?.BLOG_NOT_FOUND, 400));
    }
    return res.status(200).json({
      success: true,
      statusCode: 200,
      data: data[0],
    });
  } catch (error) {
    return next(new AppError(error.message, error.status));
  }
};

export const createCommentOnBlog = async (req, res, next) => {
  try {
    const { comment } = req.body;
    const { success, error } = commentDto(comment);
    if (!success) {
      return res.status(400).json({
        success: true,
        statusCode: 400,
        message: error,
      });
    }
    await new commentModel({
      comment,
      blog_id: new mongoose.Types.ObjectId(req.params.blog_id),
      user_id: new mongoose.Types.ObjectId(req["user"]["_id"]),
    }).save();
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: SuccessMsg?.COMMENT_CREATED,
    });
  } catch (error) {
    return next(new AppError(error.message, error.status));
  }
};

export const likeBlog = async (req, res, next) => {
  try {
    const findLike = await likeModel.findOne({
      blog_id: new mongoose.Types.ObjectId(req.params.blog_id),
      user_id: new mongoose.Types.ObjectId(req["user"]["_id"]),
    });
    if (findLike) {
      await likeModel.findOneAndDelete({
        blog_id: new mongoose.Types.ObjectId(req.params.blog_id),
        user_id: new mongoose.Types.ObjectId(req["user"]["_id"]),
      });
      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: SuccessMsg?.BLOG_UNLIKED,
      });
    } else {
      await new likeModel({
        blog_id: new mongoose.Types.ObjectId(req.params.blog_id),
        user_id: new mongoose.Types.ObjectId(req["user"]["_id"]),
      }).save();
      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: SuccessMsg?.BLOG_LIKED,
      });
    }
  } catch (error) {
    return next(new AppError(error.message, error.status));
  }
};

export const deleteMyComment = async (req, res, next) => {
  try {
    await commentModel.findByIdAndDelete(req.params.comment_id);
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: SuccessMsg?.COMMENT_CREATED,
    });
  } catch (error) {
    return next(new AppError(error.message, error.status));
  }
};
