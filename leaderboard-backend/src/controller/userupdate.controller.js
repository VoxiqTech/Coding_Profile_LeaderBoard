import User from "../models/User.model.js";
import { fetchleetcode } from "../service/leetcode.service.js";
import { fetchCodeforce } from "../service/codeforces.service.js";
import {
  calculateleetcodeScore,
  calculateCodeForcesScore
} from "../utils/scoring.utils.js";

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      section,
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

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingUser = await User.findOne({
      _id: { $ne: id },
      $or: [
        leetcodeUsername && { "leetcode.username": leetcodeUsername },
        codeforcesUsername && { "codeforces.username": codeforcesUsername }
      ].filter(Boolean)
    });

    if (existingUser) {
      return res.status(409).json({ 
        message: "Username already taken by another user" 
      });
    }

    let lc = null;
    let cf = null;
    let lcScore = 0;
    let cfScore = 0;

    if (leetcodeUsername) {
      if (user.leetcode?.username !== leetcodeUsername) {
        lc = await fetchleetcode(leetcodeUsername);
        lcScore = calculateleetcodeScore(lc);
      } else {
        lc = user.leetcode;
        lcScore = user.leetcode.score || 0;
      }
    }

    if (codeforcesUsername) {
      if (user.codeforces?.username !== codeforcesUsername) {
        cf = await fetchCodeforce(codeforcesUsername);
        cfScore = calculateCodeForcesScore(cf);
      } else {
        
        cf = user.codeforces;
        cfScore = user.codeforces.score || 0;
      }
    }

    const totalSolved =
      (lc?.total || 0) +
      (cf?.solved || 0);

    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        section,
        leetcode: lc ? { ...lc, score: lcScore } : undefined,
        codeforces: cf ? { ...cf, score: cfScore } : undefined,
        totalSolved,
        overallScore: lcScore + cfScore,
        lastUpdated: new Date()
      },
      { new: true }
    );

    return res.status(200).json(updatedUser);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}