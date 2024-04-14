import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "../routes/userRoutes";
import adminRouter from "../routes/adminRoutes";
require("dotenv").config();

export const createServer = () => {
  try {
    const app = express();
    app.use(express.json());
    app.use(urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(
      cors({
        origin: process.env.ORIGIN,
        credentials: true,
      })
    );
    app.use("/api/v1", userRouter);
    app.use("/api/v1", adminRouter);
    return app;
  } catch (error) {
    console.log("error");
  }
};
