/*import { useState } from "react";
import API from "../services/api";

export default function ResumeUpload({ setResume }) {

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const upload = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;

            setLoading(true);
            setSuccess(false);

            const form = new FormData();

            // ✅ MUST MATCH backend multer field name
            form.append("resume", file);

            const res = await API.post("/resume/upload", form);

            setResume(res.data.text);

            setSuccess(true);

        } catch (err) {
            console.log(err);
            setSuccess(false);
            alert("Resume upload failed ❌");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow space-y-3">

            <h2 className="text-lg font-bold">📄 Resume Upload</h2>

            <input
                type="file"
                accept=".pdf"
                onChange={upload}
                className="border p-2 w-full"
            />

            {loading && (
                <p className="text-blue-500">⏳ Uploading resume...</p>
            )}

            {success && (
                <p className="text-green-600 font-semibold">
                    ✅ Resume uploaded successfully!
                </p>
            )}

        </div>
    );
}*/


import { useState } from "react";
import API from "../services/api";

export default function ResumeUpload({ setResume }) {

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [fileName, setFileName] = useState("");

    const upload = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;

            // ✅ ADD: validation
            if (file.type !== "application/pdf") {
                alert("Only PDF files allowed ❌");
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                alert("File must be less than 2MB ❌");
                return;
            }

            setFileName(file.name);
            setLoading(true);
            setSuccess(false);

            const form = new FormData();
            form.append("resume", file);

            const res = await API.post("/resume/upload", form);

            setResume(res.data.text);
            setSuccess(true);

        } catch (err) {
            console.log(err);
            setSuccess(false);
            alert("Resume upload failed ❌");
        } finally {
            setLoading(false);
        }
    };

    // ✅ ADD: clear file
    const clearFile = () => {
        setFileName("");
        setSuccess(false);
        setResume("");
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 
        p-6 rounded-2xl shadow-lg border dark:border-gray-700">

            {/* HEADER */}
            <div className="mb-4">
                <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                    📄 Upload Your Resume
                </h2>
                <p className="text-gray-500 dark:text-gray-300 text-sm">
                    Upload PDF to start AI interview
                </p>
            </div>

            {/* UPLOAD BOX */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed 
            border-indigo-300 dark:border-gray-600 rounded-xl p-6 cursor-pointer 
            hover:bg-indigo-50 dark:hover:bg-gray-700 transition duration-300">

                <span className="text-4xl mb-2">📤</span>

                <span className="text-gray-600 dark:text-gray-300 text-center">
                    Click or drag & drop your Resume here
                </span>

                <input
                    type="file"
                    accept=".pdf"
                    onChange={upload}
                    className="hidden"
                />
            </label>

            {/* FILE NAME */}
            {fileName && (
                <div className="mt-3 flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-200">
                        📎 {fileName}
                    </p>

                    {/* ✅ CLEAR BUTTON */}
                    <button
                        onClick={clearFile}
                        className="text-red-500 text-sm hover:underline"
                    >
                        Remove
                    </button>
                </div>
            )}

            {/* LOADING */}
            {loading && (
                <div className="mt-4">
                    <p className="text-blue-500 mb-2">
                        ⏳ Uploading resume...
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full animate-pulse w-full"></div>
                    </div>
                </div>
            )}

            {/* SUCCESS */}
            {success && (
                <div className="mt-4 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 p-3 rounded-lg">
                    ✅ Resume uploaded successfully!
                </div>
            )}

        </div>
    );
}