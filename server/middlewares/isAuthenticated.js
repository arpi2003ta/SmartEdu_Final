import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { getJwtSecret } from "../utils/authConfig.js";
import { findLocalUserById, sanitizeLocalUser } from "../utils/localAuthStore.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }
    const decode = await jwt.verify(token, getJwtSecret());
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    const user =
      mongoose.connection.readyState === 1
        ? await User.findById(decode.userId)
        : sanitizeLocalUser(await findLocalUserById(decode.userId));

    req.id = decode.userId;
    req.user = user || {
      _id: decode.userId,
      role: decode.role,
    };
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

export const adminOnly = (req, res, next)=>{
    console.log(req.user.role);
    if(req.user && req.user.role=="instructor"){
        next();
    }else{
        res.status(400).json({Message:"only admins can access"});
    }
};
export default isAuthenticated;
