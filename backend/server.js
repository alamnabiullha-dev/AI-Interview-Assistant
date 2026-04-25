import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import resumeRoutes from "./routes/resumeRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

dotenv.config();

const app = express();

// ✅ FIX 1: Better CORS
app.use(cors({
    origin: "*"
}));

app.use(express.json());

// ✅ OPTIONAL: Test route
app.get("/", (req, res) => {
    res.send("API is running 🚀");
});

// routes
app.use("/api/resume", resumeRoutes);
app.use("/api/interview", interviewRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err));

// ✅ FIX 2: Use dynamic PORT (important for Render)
const PORT = process.env.PORT || 880;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
