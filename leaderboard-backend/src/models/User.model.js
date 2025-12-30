

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  section: {
    type: String,
    required: true
  },

  leetcode: {
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  easy: Number,
  medium: Number,
  hard: Number,
  total: Number,
  score: Number
},

codeforces: {
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  solved: Number,
  rating: Number,
  score: Number
},
gfg:{
  username:{
    type:String,
    unique:true,
    sparse:true,
  },
  total_problems_solved:Number,
  basic:Number,
  easy: Number,
  medium: Number,
  hard: Number,
  score: Number
},

 totalSolved: {
    type: Number,
    default: 0
  },
  overallScore: {
    type: Number,
    required: true
  },
  password:{
   type: String,
    required: true,
    select: false
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("User", userSchema);
