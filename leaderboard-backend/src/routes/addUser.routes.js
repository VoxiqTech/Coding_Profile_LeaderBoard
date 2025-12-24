import express from "express";
import { addUser } from "../controller/useradd.controller.js";

const router = express.Router();

router.post("/add", addUser);

export default router;
