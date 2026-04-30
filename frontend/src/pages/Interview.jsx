
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

    const [darkMode, setDarkMode] = useState(false);

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

        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

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

    const startInterview = async () => {

        // ✅ ADDED: Resume validation
        if (!resume.trim()) {
            alert("⚠️ Please upload your resume first");
            return;
        }

        try {
            setChats([{ question: "📄 Analyzing your resume...", answer: "" }]);

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
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-3 sm:px-4 md:px-6 py-4 transition">

            <div className="w-full max-w-4xl mx-auto space-y-5 sm:space-y-6">

                {/* HEADER */}
                <div className="text-center relative">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-indigo-700 dark:text-white">
                        🤖 AI Interview Assistant
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
                        Practice interviews with AI & improve your skills
                    </p>

                    <button
                        onClick={toggleTheme}
                        className="absolute right-0 top-0 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-lg text-xs sm:text-sm"
                    >
                        {darkMode ? "☀ Light" : "🌙 Dark"}
                    </button>
                </div>

                {/* RESUME */}
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-2xl shadow-lg">
                    <ResumeUpload setResume={setResume} />
                </div>

                {/* BUTTONS */}
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">

                    <button
                        onClick={startInterview}
                        className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow transition"
                    >
                        🚀 Start
                    </button>

                    <button
                        onClick={finishInterview}
                        className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-xl shadow transition"
                    >
                        🧠 Finish
                    </button>

                    <button
                        onClick={clearChat}
                        className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl shadow transition"
                    >
                        🗑 Clear
                    </button>

                </div>

                {/* CHAT */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-3 sm:p-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
                    <ChatBox chats={chats} />
                </div>

                {/* INPUT */}
                <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">

                    <input
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendAnswer()}
                        placeholder="Type or speak your answer..."
                        className="flex-1 w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />

                    <VoiceControls setAnswer={setAnswer} />

                    <button
                        onClick={sendAnswer}
                        className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 
                        text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg 
                        transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        🚀 Send
                    </button>

                </div>

                {/* RESULT */}
                {analysis && (
                    <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow-xl">

                        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 dark:text-white">
                            ⭐ Score: {analysis.score}/10
                        </h2>

                        <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                            {analysis.summary}
                        </p>

                        <div className="mt-4">
                            <h3 className="font-bold text-lg text-red-500">
                                📌 Improvements
                            </h3>
                            <ul className="list-disc ml-5 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                                {analysis.improvements?.map((i, idx) => (
                                    <li key={idx}>{i}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-4">
                            <h3 className="font-bold text-lg text-green-600">
                                📘 Preparation Tips
                            </h3>
                            <ul className="list-disc ml-5 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                                {analysis.tips?.map((i, idx) => (
                                    <li key={idx}>{i}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-4 text-lg sm:text-xl font-semibold dark:text-white">
                            🧠 Result: {analysis.result}
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}
