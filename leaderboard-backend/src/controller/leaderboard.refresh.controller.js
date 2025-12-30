import User from "../models/User.model.js";
import { fetchleetcode } from "../service/leetcode.service.js";
import { fetchCodeforce } from "../service/codeforces.service.js";
import { fetchgfg } from "../service/gfg.service.js";
import { calculateleetcodeScore, calculateCodeForcesScore, calculategfgScore } from "../utils/scoring.utils.js";

let lastRefreshTime = null;

export async function getRefreshStatus(req, res) {
  try {
    const now = Date.now();
    const canRefresh = !lastRefreshTime || (now - lastRefreshTime) >= 24 * 60 * 60 * 1000;
    
    let timeRemaining = null;
    if (!canRefresh) {
      const timeElapsed = now - lastRefreshTime;
      timeRemaining = 24 * 60 * 60 * 1000 - timeElapsed;
    }

    res.json({
      canRefresh,
      lastRefreshTime,
      timeRemaining,
      nextRefreshAvailable: lastRefreshTime ? new Date(lastRefreshTime + 24 * 60 * 60 * 1000) : null
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function refreshLeaderboard(req, res) {
  try {
    const now = Date.now();
    const cooldownPeriod = 24 * 60 * 60 * 1000; 

    if (lastRefreshTime && (now - lastRefreshTime) < cooldownPeriod) {
      const timeRemaining = cooldownPeriod - (now - lastRefreshTime);
      const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000));
      const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
      
      return res.status(429).json({ 
        message: "Refresh is on cooldown",
        canRefresh: false,
        timeRemaining,
        hoursRemaining,
        minutesRemaining,
        nextRefreshAvailable: new Date(lastRefreshTime + cooldownPeriod)
      });
    }

    const users = await User.find();
    let successCount = 0;
    let errorCount = 0;

    for (const u of users) {
      try {
        let lc = null, cf = null, gfgs = null;
        let lcScore = 0, cfScore = 0, gfgScore = 0;

        // Fetch LeetCode data
        if (u.leetcode?.username) {
          lc = await fetchleetcode(u.leetcode.username);
          lcScore = lc ? calculateleetcodeScore(lc) : 0;
        }

        // Fetch CodeForces data
        if (u.codeforces?.username) {
          cf = await fetchCodeforce(u.codeforces.username);
          cfScore = cf ? calculateCodeForcesScore(cf) : 0;
        }

        // Fetch GFG data
        if (u.gfg?.username) {
          gfgs = await fetchgfg(u.gfg.username);
          gfgScore = gfgs ? calculategfgScore(gfgs) : 0;
        }

        const totalSolved = (lc?.total || 0) + (cf?.solved || 0) + (gfgs?.total_problems_solved || 0);

        const updateData = {
          totalSolved,
          overallScore: lcScore + cfScore + gfgScore,
          lastUpdated: new Date()
        };

        if (lc) {
          updateData.leetcode = { ...lc, score: lcScore };
        }

        if (cf) {
          updateData.codeforces = { ...cf, score: cfScore };
        }

        if (gfgs) {
          updateData.gfg = { ...gfgs, score: gfgScore };
        }

        await User.findByIdAndUpdate(u._id, updateData, { runValidators: false });
        successCount++;

      } catch (userError) {
        console.error(`Error updating user ${u.name}:`, userError.message);
        errorCount++;
      }
    }

    lastRefreshTime = now;

    res.json({ 
      message: "Leaderboard refresh completed",
      success: successCount,
      failed: errorCount,
      total: users.length,
      canRefresh: false,
      nextRefreshAvailable: new Date(now + cooldownPeriod)
    });

  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({ message: err.message });
  }
}