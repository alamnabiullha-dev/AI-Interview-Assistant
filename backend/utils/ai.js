import axios from "axios";

export const askAI = async (messages) => {
    try {

        const res = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-4o-mini",
                messages
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.data.choices[0].message.content;

    } catch (err) {
        console.log("AI ERROR:", err.response?.data || err.message);
        throw new Error("AI request failed");
    }
};