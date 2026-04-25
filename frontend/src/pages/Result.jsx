import { useEffect, useState } from "react";
import API from "../services/api";

export default function Result() {

    const [data, setData] = useState([]);

    useEffect(() => {
        API.get("/interview/history").then(res => {
            setData(res.data);
        });
    }, []);

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-4">
                📊 Interview Results
            </h1>

            {data.map((item) => (
                <div key={item._id} className="border p-4 mb-4 rounded shadow">

                    <h2 className="text-lg font-bold">
                        Score: {item.score}/10
                    </h2>

                    <p className="text-gray-600 mt-2">
                        {item.feedback}
                    </p>

                    {/* IMPROVEMENTS */}
                    {item.improvements && (
                        <div className="mt-3">
                            <h3 className="font-bold">Improvements:</h3>
                            <ul className="list-disc ml-5">
                                {item.improvements.map((i, idx) => (
                                    <li key={idx}>{i}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>
            ))}

        </div>
    );
}