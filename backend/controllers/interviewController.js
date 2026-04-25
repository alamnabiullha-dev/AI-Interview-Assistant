import Interview from "../models/Interview.js";
import { askAI } from "../utils/ai.js";

// 🚀 START INTERVIEW (generate questions)
export const startInterview = async (req, res) => {
    try {

        const { resumeText } = req.body;

        const aiResponse = await askAI([
            {
                role: "system",
                content: "You are a technical interviewer. Ask 30 interview questions."
            },
            {
                role: "user",
                content: resumeText
            }
        ]);

        const questions = aiResponse.split("\n").filter(q => q.trim() !== "");

        const interview = await Interview.create({
            resumeText,
            chats: questions.map(q => ({
                question: q,
                answer: ""
            }))
        });

        res.json({
            interviewId: interview._id,
            questions
        });

    } catch (err) {
        res.status(500).json(err);
    }
};

// 📤 SAVE ANSWER
export const saveAnswer = async (req, res) => {
    const { interviewId, question, answer } = req.body;

    const interview = await Interview.findById(interviewId);

    const chat = interview.chats.find(c => c.question === question);
    if (chat) chat.answer = answer;

    await interview.save();

    res.json({ success: true });
};

// 🧠 FINISH INTERVIEW (SCORING)
export const finishInterview = async (req, res) => {
    try {

        const { interviewId } = req.body;

        const interview = await Interview.findById(interviewId);

        const result = await askAI([
            {
                role: "system",
                content: `
You are an expert interviewer.
Return ONLY JSON:
{
 "score": number (0-10),
 "result": "Good" or "Bad",
 "improvements": [],
 "preparation": [],
 "summary": ""
}
        `
            },
            {
                role: "user",
                content: interview.chats.map(c =>
                    `Q: ${c.question}\nA: ${c.answer}`
                ).join("\n\n")
            }
        ]);

        const parsed = JSON.parse(result);

        interview.score = parsed.score;
        await interview.save();

        res.json(parsed);

    } catch (err) {
        res.status(500).json(err);
    }
};

// 📊 HISTORY
export const getHistory = async (req, res) => {
    const data = await Interview.find();
    res.json(data);
};

// 🗑 DELETE
export const deleteInterview = async (req, res) => {
    await Interview.findByIdAndDelete(req.params.id);
    res.json({ success: true });
};


