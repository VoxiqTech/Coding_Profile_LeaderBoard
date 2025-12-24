import axios from 'axios'


//async/await function banega kyuki api se data aane mai bahut time lagega ess liye wait karna padega...


export async function fetchCodeforce(username) {
    console.log("🔥 USING UPDATED fetchleetcode FUNCTION");

  const info = await axios.get(
    `https://codeforces.com/api/user.info?handles=${username}`
  );

  const rating = info.data.result[0].rating || 0;

  const solvedRes = await axios.get(
    `https://codeforces.com/api/user.status?handle=${username}`
  );

  const solved = new Set(
    solvedRes.data.result
      .filter(s => s.verdict === "OK")
      .map(s => `${s.problem.contestId}-${s.problem.index}`)
  ).size;

  return { username, solved, rating };
}