import jwt from "jsonwebtoken";
import { getJwtSecret } from "./authConfig.js";

export const generateToken = (res, user, message) => {
  const token = jwt.sign({ userId: user._id, role: user.role }, getJwtSecret(), {
    expiresIn: "1d",
  });

  const isProd = process.env.NODE_ENV === "production";

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    }).json({
        success:true,
        message,
        user
    });
};
