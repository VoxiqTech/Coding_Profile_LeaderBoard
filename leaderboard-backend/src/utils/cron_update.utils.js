import cron from 'node-cron'
import { fetchCodeforce } from "../service/codeforces.service.js";
import { fetchleetcode } from "../service/leetcode.service.js";
import User from "../models/User.model.js";
import { calculateCodeForcesScore, calculateleetcodeScore } from "./scoring.utils.js";


cron.schedule("0 /2 * * *", async () => {
  try {
    const users = await User.find();
    console.log(`Starting leaderboard update for ${users.length} users...`);

    for (const u of users) {
      try {
        let lc = null;
        let cf = null;
        let lcScore = 0;
        let cfScore = 0;

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
        
        console.log(`Updated user: ${u.name}`);
      } catch (userError) {
        console.error(`Error updating user ${u.name}:`, userError.message);
      }
    }

    console.log("Leaderboard update completed successfully");
  } catch (error) {
    console.error("Critical error in leaderboard update:", error);
  }
});