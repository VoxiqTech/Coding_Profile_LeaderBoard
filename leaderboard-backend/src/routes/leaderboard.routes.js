
import express from "express";
import { getLeaderboard, getAllSections } from "../controller/leaderboard.controller.js";
import { refreshLeaderboard,getRefreshStatus } from "../controller/leaderboard.refresh.controller.js";

const router = express.Router();

router.get("/", getLeaderboard);

router.get("/sections", getAllSections);
router.post("/refresh", refreshLeaderboard);
router.get("/refresh-status", getRefreshStatus);
router.post("/refresh", refreshLeaderboard);

export default router;