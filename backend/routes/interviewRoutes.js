import express from "express";
import {
    startInterview,
    saveAnswer,
    finishInterview,
    getHistory,
    deleteInterview
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/start", startInterview);
router.post("/answer", saveAnswer);
router.post("/finish", finishInterview);
router.get("/history", getHistory);
router.delete("/:id", deleteInterview);

export default router;