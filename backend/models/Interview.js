import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema({
    resumeText: String,
    chats: [
        {
            question: String,
            answer: String
        }
    ],
    score: Number,

    // ✅ FIX: must be Object (not String)
    feedback: {
        score: Number,
        summary: String,
        mistakes: [String],
        improvements: [String],
        tips: [String]
    },

    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Interview", InterviewSchema);