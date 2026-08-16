// connect to mongo database
import mongoose from "mongoose";

const db = process.env.MONGO_URI;

export const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("Mongo DB connected...");
  } catch (err) {
    console.error(err.message);
    // exit process with failure
    process.exit(1);
  }
};
