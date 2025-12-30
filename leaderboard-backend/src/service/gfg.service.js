import axios from 'axios'

export async function fetchgfg(username){
     const  res = await axios.get(`https://api-gamma-ecru.vercel.app/gfg/${username}`,
        {
            header:
            {
                Accept:'application/json'
            }
        }

        
    )
    console.log(res.data);

    if(!res.data || !(await res).data.problems_solved_breakdown){
        console.log("Invalid GFG API RESPONSE");
        alert('Invalid GFG API RESPONSE');
        return null;
    }

    const gfg = res.data;

      return {
      username: gfg.username,
      easy: Number(gfg.problems_solved_breakdown.easy) || 0,
      basic: Number(gfg.problems_solved_breakdown.basic) || 0,
      medium: Number(gfg.problems_solved_breakdown.medium) || 0,
      hard: Number(gfg.problems_solved_breakdown.hard) || 0,
      total_problems_solved: Number(gfg.total_problems_solved) || 0
    };
}