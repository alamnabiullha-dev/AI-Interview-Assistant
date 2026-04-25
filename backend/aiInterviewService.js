import { askAI } from "../utils/ai.js";

// 🤖 Generate next human-like question
export const generateNextQuestion = async (resumeText, chatHistory) => {
    const response = await askAI([
        {
            role: "system",
            content: `
You are a HUMAN interviewer.

Rules:
- Ask ONE smart follow-up question
- Based on resume + previous answers
- Be conversational and natural
`
        },
        {
            role: "user",
            content: `
Resume:
${resumeText}

Conversation:
${chatHistory}
`
        }
    ]);

    return response;
};

// 🧠 Explain question if user confused
export const explainQuestion = async (question) => {
    const response = await askAI([
        {
            role: "system",
            content: "Explain simply like a tutor"
        },
        {
            role: "user",
            content: question
        }
    ]);

    return response;
};