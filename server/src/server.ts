import { createServer } from "./framework/config/app";
import { connectDB } from "./framework/config/connnectDB";
import { v2 as cloudinary } from "cloudinary";
require("dotenv").config();

const startServer = async () => {
  try {
    const app = createServer();

    //cloudinary config

    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_SECRET_KEY,
    });

    const PORT = process.env.PORT;
    app?.listen(PORT, () => {
      console.log(`server is running at PORT : ${PORT}`);
    });
    await connectDB();
  } catch (error) {
    console.log(error);
  }
};

startServer();
