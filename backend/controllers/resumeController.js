import fs from "fs";
import { createRequire } from "module";

// ✅ FIX: correct way for pdf-parse in ESM
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const buffer = fs.readFileSync(req.file.path);

        const data = await pdfParse(buffer);

        fs.unlinkSync(req.file.path); // cleanup file

        res.json({
            text: data.text || ""
        });

    } catch (err) {
        console.log("PDF ERROR:", err);
        res.status(500).json({
            message: "Resume parsing failed",
            error: err.message
        });
    }
};