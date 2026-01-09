import mongoose from "mongoose";

export const connectDb = () => {
  return mongoose
    .connect(process.env.MONGO_URI) // remove options
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
};
