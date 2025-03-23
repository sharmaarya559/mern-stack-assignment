import { ErrorMsg } from "../Utils/error-message.helper.js";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model..js";
import AppError from "../exceptions/custom.exception.js";

const userAuthMiddeware = async (req, res, next) => {
  try {
    if (!req?.headers || !req.headers.authorization) {
      return next(new AppError(ErrorMsg?.UNAUTHORIZED, 401));
    }
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return next(new AppError(ErrorMsg?.UNAUTHORIZED, 401));
    }
    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
      return next(new AppError(ErrorMsg?.UNAUTHORIZED, 401));
    }
    const user = await userModel.findById(decode.id);
    if (!user) {
      return next(new AppError(ErrorMsg?.UNAUTHORIZED, 401));
    }
    req["user"] = user;
    next();
  } catch (error) {
    return next(new AppError(error.message, 401));
  }
};

export default userAuthMiddeware;
