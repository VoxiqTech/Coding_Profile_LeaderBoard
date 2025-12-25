

import User from "../models/User.model.js";
import { fetchleetcode } from "../service/leetcode.service.js";
import { fetchCodeforce } from "../service/codeforces.service.js";
import {
  calculateleetcodeScore,
  calculateCodeForcesScore
} from "../utils/scoring.utils.js";

export async function addUser(req, res) {
  try {
    const {
      name,
      section,
      password,
      leetcodeUsername,
      codeforcesUsername
    } = req.body;

  
    if (!section || section.trim() === "") {
      return res.status(400).json({ message: "Section is required" });
    }

    if (!leetcodeUsername && !codeforcesUsername) {
      return res.status(400).json({
        message: "At least one platform username is required"
      });
    }

    
    const existingUser = await User.findOne({
      $or: [
        leetcodeUsername && { "leetcode.username": leetcodeUsername },
        codeforcesUsername && { "codeforces.username": codeforcesUsername }
      ].filter(Boolean)
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    let lc = null;
    let cf = null;
    let lcScore = 0;
    let cfScore = 0;

    if (leetcodeUsername) {
      lc = await fetchleetcode(leetcodeUsername);
      lcScore = calculateleetcodeScore(lc);
    }

    if (codeforcesUsername) {
      cf = await fetchCodeforce(codeforcesUsername);
      cfScore = calculateCodeForcesScore(cf);
    }

    
    const totalSolved =
      (lc?.total || 0) +
      (cf?.solved || 0);

    const user = await User.create({
      name,
      section,
      password,
      leetcode: lc ? { ...lc, score: lcScore } : undefined,
      codeforces: cf ? { ...cf, score: cfScore } : undefined,
      totalSolved,                       
      overallScore: lcScore + cfScore,
      lastUpdated: new Date()
    });

    return res.status(201).json(user);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}
