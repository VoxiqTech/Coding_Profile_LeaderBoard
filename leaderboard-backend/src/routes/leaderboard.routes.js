
import express from "express";
import { getLeaderboard, getAllSections } from "../controller/leaderboard.controller.js";

const router = express.Router();

router.get("/", getLeaderboard);

router.get("/sections", getAllSections);

export default router;