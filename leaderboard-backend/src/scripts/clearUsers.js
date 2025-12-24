import mongoose from "mongoose";
import User from "../models/User.model.js";
import dotenv from "dotenv";

dotenv.config();

async function clearUsers() {
  try {
    await mongoose.connect(process.env.MONGO_DB_ANTARA_AI);
    const result = await User.deleteMany({});
    console.log("Deleted users:", result.deletedCount);
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

clearUsers();
