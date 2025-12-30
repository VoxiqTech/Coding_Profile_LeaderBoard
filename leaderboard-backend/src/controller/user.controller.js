import User from '../models/User.model.js'
import { calculateCodeForcesScore, calculateleetcodeScore, calculategfgScore} from '../utils/scoring.utils.js'
import { fetchCodeforce } from '../service/codeforces.service.js'
import { fetchleetcode } from '../service/leetcode.service.js'
import { fetchgfg } from "../service/gfg.service.js";


export async function addUser(req, res) {
    try {
        const { name, section, leetcodeUsername, codeforcesUsername, gfgUsername } = req.body;

        const lc = await fetchleetcode(leetcodeUsername);
        const cf = await fetchCodeforce(codeforcesUsername);
        const gfgs = await fetchgfg(gfgUsername);

        const lcScore = calculateleetcodeScore(lc);
        const cfScore = calculateCodeForcesScore(cf);
        const gfgScore = calculategfgScore(gfgs);

        const user = await User.create({
            name,
            section,
            leetcode: { ...lc, score: lcScore },
            codeforces: { ...cf, score: cfScore },
            gfg :{...gfgs, score: gfgScore},
            overallScore: lcScore + cfScore + gfgScore,
            lastUpdated: new Date()
        });

        res.json(user);
    } catch (err) {
        
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}