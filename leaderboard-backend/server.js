import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import leaderboardRoutes from "./src/routes/leaderboard.routes.js";
import userRoutes from "./src/routes/addUser.routes.js";
import "./src/utils/cron_update.utils.js";
import mongoose from 'mongoose';
mongoose.connect(process.env.MONGO_DB_ANTARA_AI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    }).catch(err => {
        console.error("Alert:- MongoDB connection error!:", err);
    });

const app = express();

app.use(cors({
    origin: ['https://coding-profile-leaderboard.netlify.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
