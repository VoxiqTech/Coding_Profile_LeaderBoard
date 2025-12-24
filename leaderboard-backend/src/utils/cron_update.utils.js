// Cron jo hai wo ekk automatic scheduler function hai jo given par automatic update karta hai given task, ye node-cron mai aaya jata aur ye 2 chej leta hai ekk time, dusara callback function...time mai wo apne minute,hrs,day month year ke hisab se kamm leta hai 

import cron from 'node-cron'
import { fetchCodeforce } from "../service/codeforces.service.js";
import { fetchleetcode } from "../service/leetcode.service.js";
import User from "../models/User.model.js";
import { calculateCodeForcesScore, calculateleetcodeScore } from "./scoring.utils.js";


cron.schedule("0 0 * * *", async () => {
  const users = await User.find();

  for (const u of users) {
    const lc = u.leetcode?.username
      ? await fetchleetcode(u.leetcode.username)
      : null;

    const cf = u.codeforces?.username
      ? await fetchCodeforce(u.codeforces.username)
      : null;

    const lcScore = lc ? calculateleetcodeScore(lc) : 0;
    const cfScore = cf ? calculateCodeForcesScore(cf) : 0;

    u.leetcode = lc ? { ...lc, score: lcScore } : u.leetcode;
    u.codeforces = cf ? { ...cf, score: cfScore } : u.codeforces;

    // ✅ KEEP TOTAL CONSISTENT
    u.totalSolved =
      (lc?.total || 0) +
      (cf?.solved || 0);

    u.overallScore = lcScore + cfScore;
    u.lastUpdated = new Date();

    await u.save();
  }

  console.log("Leaderboard updated");
});
