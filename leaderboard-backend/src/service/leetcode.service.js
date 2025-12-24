import axios from "axios";

export async function fetchleetcode(username) {
  console.log("🔥 USING UPDATED fetchleetcode FUNCTION");

  const res = await axios.get(
    `https://coding-profile-service.onrender.com/stats?leetcode=${username}`,
    {
      headers: {
        Accept: "application/json"
      }
    }
  );

  console.log("🔍 RAW res.data:", res.data);

  if (!res.data || !res.data.profiles || !res.data.profiles[0]) {
    throw new Error("Invalid LeetCode API response");
  }

  const p = res.data.profiles[0];

  return {
    username: p.username,
    easy: Number(p.easySolved) || 0,
    medium: Number(p.mediumSolved) || 0,
    hard: Number(p.hardSolved) || 0,
    total: Number(p.totalSolved) || 0
  };
}
