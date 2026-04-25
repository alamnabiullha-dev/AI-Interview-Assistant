import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const res = await API.get("/interview/history");
        setInterviews(res.data);
    };

    const deleteInterview = async (id) => {
        await API.delete(`/interview/${id}`);
        setInterviews(interviews.filter((i) => i._id !== id));
    };

    return (
        <div className="max-w-5xl mx-auto mt-6 space-y-6">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 rounded-xl shadow">
                <h1 className="text-2xl font-bold">📊 AI Interview Dashboard</h1>
                <p>Track your performance, score & improvement</p>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {interviews.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white p-4 rounded-xl shadow border"
                    >

                        {/* SCORE */}
                        <div className="flex justify-between items-center">
                            <h2 className="font-bold text-lg">
                                ⭐ Score: {item.score || "N/A"}/10
                            </h2>

                            <span
                                className={`px-3 py-1 rounded text-white text-sm ${item.score >= 7 ? "bg-green-500" : "bg-red-500"
                                    }`}
                            >
                                {item.score >= 7 ? "GOOD" : "NEED IMPROVEMENT"}
                            </span>
                        </div>

                        {/* RESUME PREVIEW */}
                        <p className="text-gray-600 mt-2 text-sm">
                            📄 Resume: {item.resumeText?.slice(0, 100)}...
                        </p>

                        {/* CHAT COUNT */}
                        <p className="text-sm mt-2">
                            💬 Questions: {item.chats?.length}
                        </p>

                        {/* DELETE BUTTON */}
                        <button
                            onClick={() => deleteInterview(item._id)}
                            className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
                        >
                            🗑 Delete
                        </button>

                    </div>
                ))}

            </div>

        </div>
    );
}