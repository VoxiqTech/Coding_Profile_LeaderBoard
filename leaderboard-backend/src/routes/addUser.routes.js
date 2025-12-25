import express from "express";
import { addUser } from "../controller/useradd.controller.js";
import { updateUser } from "../controller/userupdate.controller.js";

const router = express.Router();

router.post("/add", addUser);
router.put("/:id", updateUser);

export default router;