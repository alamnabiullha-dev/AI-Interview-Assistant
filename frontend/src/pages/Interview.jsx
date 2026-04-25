import { useState, useEffect } from "react";
import API from "../services/api";
import ChatBox from "../components/ChatBox";
import ResumeUpload from "../components/ResumeUpload";
import VoiceControls from "../components/VoiceControls";
import { speak } from "../components/Speak";

export default function Interview() {

    const [resume, setResume] = useState("");
    const [chats, setChats] = useState([]);
    const [answer, setAnswer] = useState("");
    const [index, setIndex] = useState(0);
    const [interviewId, setInterviewId] = useState("");
    const [analysis, setAnalysis] = useState(null);

    // 🌙 DARK MODE STATE (ADDED)
    const [darkMode, setDarkMode] = useState(false);

    // ✅ LOAD SAVED DATA
    useEffect(() => {
        const saved = localStorage.getItem("interviewData");

        if (saved) {
            const data = JSON.parse(saved);

            setResume(data.resume || "");
            setChats(data.chats || []);
            setAnswer(data.answer || "");
            setIndex(data.index || 0);
            setInterviewId(data.interviewId || "");
            setAnalysis(data.analysis || null);
        }

        // 🌙 LOAD DARK MODE
        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    // ✅ AUTO SAVE DATA
    useEffect(() => {
        localStorage.setItem(
            "interviewData",
            JSON.stringify({
                resume,
                chats,
                answer,
                index,
                interviewId,
                analysis
            })
        );
    }, [resume, chats, answer, index, interviewId, analysis]);

    // 🌙 TOGGLE DARK MODE (ADDED)
    const toggleTheme = () => {
        if (darkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        setDarkMode(!darkMode);
    };

    // START
    const startInterview = async () => {
        try {
            const res = await API.post("/interview/start", {
                resumeText: resume,
            });

            const questions = res.data.questions || [];

            const formatted = questions.map((q) => ({
                question: q,
                answer: "",
            }));

            setChats(formatted);
            setInterviewId(res.data.interviewId);
            setIndex(0);

            if (questions.length > 0) speak(questions[0]);

        } catch (err) {
            console.log("Start Error:", err);
        }
    };

    // SEND
    const sendAnswer = async () => {
        if (!answer.trim()) return;

        const updated = [...chats];
        updated[index].answer = answer;

        setChats(updated);

        try {
            await API.post("/interview/answer", {
                interviewId,
                question: updated[index].question,
                answer,
            });

            setAnswer("");

            const next = index + 1;

            if (next < chats.length) {
                setIndex(next);
                speak(updated[next].question);
            }

        } catch (err) {
            console.log("Send Error:", err);
        }
    };

    // FINISH
    const finishInterview = async () => {
        try {
            const res = await API.post("/interview/finish", {
                interviewId,
            });

            setAnalysis(res.data);
            speak(`Your score is ${res.data.score} out of 10`);

        } catch (err) {
            console.log("Finish Error:", err);
        }
    };

    // CLEAR
    const clearChat = () => {
        setChats([]);
        setAnswer("");
        setIndex(0);
        setInterviewId("");
        setAnalysis(null);
        setResume("");

        localStorage.removeItem("interviewData");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 transition">

            <div className="max-w-4xl mx-auto space-y-6">

                {/* HEADER */}
                <div className="text-center relative">
                    <h1 className="text-4xl font-extrabold text-indigo-700 dark:text-white">
                        🤖 AI Interview Assistant
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Practice interviews with AI & improve your skills
                    </p>

                    {/* 🌙 DARK MODE BUTTON */}
                    <button
                        onClick={toggleTheme}
                        className="absolute right-0 top-0 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-lg text-sm"
                    >
                        {darkMode ? "☀ Light" : "🌙 Dark"}
                    </button>
                </div>

                {/* RESUME */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg">
                    <ResumeUpload setResume={setResume} />
                </div>

                {/* BUTTONS */}
                <div className="flex flex-wrap gap-3 justify-center">

                    <button
                        onClick={startInterview}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow transition"
                    >
                        🚀 Start
                    </button>

                    <button
                        onClick={finishInterview}
                        className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-xl shadow transition"
                    >
                        🧠 Finish
                    </button>

                    <button
                        onClick={clearChat}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl shadow transition"
                    >
                        🗑 Clear
                    </button>

                </div>

                {/* CHAT */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 max-h-[400px] overflow-y-auto">
                    <ChatBox chats={chats} />
                </div>

                {/* INPUT */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow flex items-center gap-3">

                    <input
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type or speak your answer..."
                        className="flex-1 border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />

                    <VoiceControls setAnswer={setAnswer} />

                    <button
                        onClick={sendAnswer}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl"
                    >
                        Send
                    </button>

                </div>

                {/* RESULT */}
                {analysis && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">

                        <h2 className="text-3xl font-bold text-indigo-700 dark:text-white">
                            ⭐ Score: {analysis.score}/10
                        </h2>

                        <p className="mt-3 text-gray-700 dark:text-gray-300">
                            {analysis.summary}
                        </p>

                        <div className="mt-4">
                            <h3 className="font-bold text-lg text-red-500">
                                📌 Improvements
                            </h3>
                            <ul className="list-disc ml-5 text-gray-600 dark:text-gray-300">
                                {analysis.improvements?.map((i, idx) => (
                                    <li key={idx}>{i}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-4">
                            <h3 className="font-bold text-lg text-green-600">
                                📘 Preparation Tips
                            </h3>
                            <ul className="list-disc ml-5 text-gray-600 dark:text-gray-300">
                                {analysis.tips?.map((i, idx) => (
                                    <li key={idx}>{i}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-4 text-xl font-semibold dark:text-white">
                            🧠 Result: {analysis.result}
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}
