import jwt from "jsonwebtoken";
import User from "../model/User.js";
import HttpError from "./ErrorHandler.js";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("authorization");

  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new HttpError("Authorization failed, token missing", 401));
    }

    const token = authHeader.replace("Bearer ", "");

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    req.user = user;
    req.token = token;

    next();
    
  } catch (error) {
    return next(new HttpError("Invalid or expired token", 401));
  }
};

export default auth;
