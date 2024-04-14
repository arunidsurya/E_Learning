import { Response, NextFunction, Request } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { redis } from "../config/redis";
import User from "../../entities/userEntity";
require("dotenv").config();

//authenticated user

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const access_token = req.cookies.access_token as string;
  // console.log("access_token:", access_token);

  if (!access_token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token provided" });
  }
  try {
    const decoded = jwt.verify(
      access_token,
      process.env.ACTIVATION_SECRET as Secret
    ) as JwtPayload;

    // console.log(decoded);

    if (!decoded) {
      return res
        .status(401)
        .send({ success: false, message: "Unauthorized - Invalid token" });
    }
    // console.log(decoded.user.email);

    const user = await redis.get(decoded.user.email);

    // console.log(user);

    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "User not found" });
    } else {
      req.user = JSON.parse(user);
      next();
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
};
