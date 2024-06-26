import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.DB_URI as string;
    await mongoose.connect(mongoUri);
    console.log("connected to database");
  } catch (error) {
    console.log(error);
  }
};
