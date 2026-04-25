import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import resumeRoutes from "./routes/resumeRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/resume", resumeRoutes);
app.use("/api/interview", interviewRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.listen(880, () => {
    console.log("Server running on 880");
});
