import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.model.js";

dotenv.config();

async function getAllStudents() {
  await mongoose.connect(process.env.MONGO_DB_ANTARA_AI);

  const users = await User.find()
    .sort({ overallScore: -1 })
    .select({
      name: 1,
      rollNo: 1,
      overallScore: 1,
      "leetcode.score": 1,
      "codeforces.score": 1
    });

  console.log(users);

  await mongoose.disconnect();
}

getAllStudents();
