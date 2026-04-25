import { useEffect, useState } from "react";
import API from "../services/api";

export default function History() {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 📥 FETCH HISTORY
    const fetchHistory = async () => {
        try {
            setLoading(true);
            const res = await API.get("/interview/history");
            setHistory(res.data || []);
        } catch (err) {
            console.log(err);
            setError("Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // 🗑 DELETE ONE
    const deleteItem = async (id) => {
        try {
            if (!confirm("Delete this interview?")) return;

            await API.delete(`/interview/${id}`);
            fetchHistory();
        } catch (err) {
            console.log(err);
        }
    };

    // 🗑 DELETE ALL
    const deleteAll = async () => {
        try {
            if (!confirm("Delete ALL history?")) return;

            await Promise.all(
                history.map(item =>
                    API.delete(`/interview/${item._id}`)
                )
            );

            fetchHistory();
        } catch (err) {
            console.log(err);
        }
    };

    // ⏳ LOADING UI
    if (loading) {
        return (
            <div className="p-6 text-center text-gray-500">
                Loading history...
            </div>
        );
    }

    // ❌ ERROR UI
    if (error) {
        return (
            <div className="p-6 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">

            {/* HEADER */}
            <div className="flex justify-between items-center">

                <h1 className="text-3xl font-bold">
                    📜 Interview History
                </h1>

                {history.length > 0 && (
                    <button
                        onClick={deleteAll}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                        🗑 Delete All
                    </button>
                )}

            </div>

            {/* EMPTY STATE */}
            {history.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    No interviews found 🚀
                </div>
            ) : (
                history.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white border rounded-xl p-5 shadow-md space-y-3"
                    >

                        {/* TOP BAR */}
                        <div className="flex justify-between items-center">

                            <h2 className="font-bold text-lg">
                                ⭐ Score: {item.score || 0}/10
                            </h2>

                            <button
                                onClick={() => deleteItem(item._id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>

                        </div>

                        {/* CHAT HISTORY */}
                        <div className="space-y-3 mt-2">

                            {item.chats?.length > 0 ? (
                                item.chats.map((c, i) => (
                                    <div
                                        key={i}
                                        className="border rounded-lg p-3 bg-gray-50"
                                    >
                                        <p className="text-gray-800">
                                            <b>Q:</b> {c.question}
                                        </p>
                                        <p className="text-gray-600 mt-1">
                                            <b>A:</b> {c.answer || "No answer"}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">
                                    No chat data
                                </p>
                            )}

                        </div>

                    </div>
                ))
            )}

        </div>
    );
}