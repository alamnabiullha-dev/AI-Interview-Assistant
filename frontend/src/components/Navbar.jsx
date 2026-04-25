import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar({ analysis }) {

    const [dark, setDark] = useState(false);

    // ✅ LOAD THEME FROM LOCAL STORAGE
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setDark(true);
        }
    }, []);

    // ✅ TOGGLE THEME
    const toggleTheme = () => {
        if (dark) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        setDark(!dark);
    };

    return (
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 dark:from-gray-900 dark:to-black text-white px-6 py-4 shadow-lg flex justify-between items-center">

            {/* LOGO */}
            <h1 className="font-extrabold text-2xl tracking-wide">
                🤖 AI Interview
            </h1>

            <div className="flex items-center gap-4">

                <Link
                    to="/interview"
                    className="hover:bg-white/20 px-4 py-2 rounded-lg transition"
                >
                    🎯 Interview
                </Link>

                <Link
                    to="/history"
                    className="hover:bg-white/20 px-4 py-2 rounded-lg transition"
                >
                    📜 History
                </Link>

                {/* 🌙 DARK MODE BUTTON */}
                <button
                    onClick={toggleTheme}
                    className="bg-white/20 px-3 py-2 rounded-lg hover:bg-white/30 transition"
                >
                    {dark ? "☀️" : "🌙"}
                </button>

                {/* SCORE */}
                {analysis && (
                    <div className="bg-white text-indigo-700 dark:text-black px-4 py-2 rounded-full shadow">
                        ⭐ {analysis.score}/10
                    </div>
                )}

            </div>
        </div>
    );
}