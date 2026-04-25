import express from "express";
import multer from "multer";
import { uploadResume } from "../controllers/resumeController.js";

const router = express.Router();

// create uploads folder
import fs from "fs";
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// ✅ FIX: must match frontend "resume"
router.post("/upload", upload.single("resume"), uploadResume);

export default router;