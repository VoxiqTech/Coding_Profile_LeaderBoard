import User from "../models/User.model.js";
import { fetchleetcode } from "../service/leetcode.service.js";
import { fetchCodeforce } from "../service/codeforces.service.js";
import { fetchgfg } from "../service/gfg.service.js";
import {
    calculateleetcodeScore,
    calculateCodeForcesScore, calculategfgScore
} from "../utils/scoring.utils.js";

export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const {
            name,
            section,
            password,
            leetcodeUsername,
            codeforcesUsername,
            gfgUsername,
        } = req.body;

        if (!section || section.trim() === "") {
            return res.status(400).json({ message: "Section is required" });
        }

        if (!password || password.trim() === "") {
            return res.status(400).json({ message: "Password is required" });
        }

        if (!leetcodeUsername && !codeforcesUsername && !gfgUsername) {
            return res.status(400).json({
                message: "At least one platform username is required"
            });
        }

        const user = await User.findById(id).select('+password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (password !== user.password) {
            return res.status(401).json({ message: "Incorrect password!Dont't change Someone's Profile" });
        }

        const existingUser = await User.findOne({
            _id: { $ne: id },
            $or: [
                leetcodeUsername && { "leetcode.username": leetcodeUsername },
                codeforcesUsername && { "codeforces.username": codeforcesUsername },
                gfgUsername && { "gfg.username": gfgUsername }
            ].filter(Boolean)
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User exists"
            });
        }

        let lc = null;
        let cf = null;
        let gfgs = null;
        let lcScore = 0;
        let cfScore = 0;
        let gfgScore = 0;

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
        if (gfgUsername) {
            if (user.gfg?.username !== gfgUsername) {
                gfgs = await fetchgfg(gfgUsername);
                gfgScore = calculategfgScore(gfgs);
            } else {
                gfgs = user.gfg;
                gfgScore = user.gfg.score || 0;
            }
        }

        const totalSolved =
            (lc?.total || 0) +
            (cf?.solved || 0) +
            (gfgs?.total_problems_solved || 0);

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                name,
                section,
                leetcode: lc ? { ...lc, score: lcScore } : null,
                codeforces: cf ? { ...cf, score: cfScore } : null,
                gfg: gfgs ? { ...gfgs, score: gfgScore } : null,
                totalSolved,
                overallScore: lcScore + cfScore + gfgScore,
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
