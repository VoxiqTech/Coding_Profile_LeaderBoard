import User from "../models/User.model.js";
import { fetchleetcode } from "../service/leetcode.service.js";
import { fetchCodeforce } from "../service/codeforces.service.js";
import { calculateleetcodeScore, calculateCodeForcesScore } from "../utils/scoring.utils.js";

export async function refreshLeaderboard(req, res) {
  try {
    const users = await User.find();
    let successCount = 0;
    let errorCount = 0;

    for (const u of users) {
      try {
        let lc = null, cf = null;
        let lcScore = 0, cfScore = 0;

        if (u.leetcode?.username) {
          lc = await fetchleetcode(u.leetcode.username);
          lcScore = lc ? calculateleetcodeScore(lc) : 0;
        }

        if (u.codeforces?.username) {
          cf = await fetchCodeforce(u.codeforces.username);
          cfScore = cf ? calculateCodeForcesScore(cf) : 0;
        }

        const totalSolved = (lc?.total || 0) + (cf?.solved || 0);

        const updateData = {
          totalSolved,
          overallScore: lcScore + cfScore,
          lastUpdated: new Date()
        };

        if (lc) {
          updateData.leetcode = { ...lc, score: lcScore };
        }

        if (cf) {
          updateData.codeforces = { ...cf, score: cfScore };
        }

        await User.findByIdAndUpdate(u._id, updateData, { runValidators: false });
        successCount++;

      } catch (userError) {
        console.error(`Error updating user ${u.name}:`, userError.message);
        errorCount++;
      }
    }

    res.json({ 
      message: "Leaderboard refresh completed",
      success: successCount,
      failed: errorCount,
      total: users.length
    });

  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({ message: err.message });
  }
}