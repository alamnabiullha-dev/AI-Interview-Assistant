import { useState } from "react";

export default function VoiceControls({ setAnswer }) {

    const [listening, setListening] = useState(false);

    const startListening = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Voice not supported in this browser");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;

        setListening(true);
        recognition.start();

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            setAnswer(text);
            setListening(false);
        };

        recognition.onerror = (err) => {
            console.log("Speech error:", err);
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
        };
    };

    return (
        <button
            onClick={startListening}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all duration-300 shadow-md
                ${listening
                    ? "bg-red-600 animate-pulse scale-105"
                    : "bg-gradient-to-r from-pink-500 to-red-500 hover:scale-105"
                }`}
        >
            {/* ICON */}
            <span className="text-lg">
                {listening ? "🎙️" : "🎤"}
            </span>

            {/* TEXT */}
            <span className="text-sm font-semibold">
                {listening ? "Listening..." : "Speak"}
            </span>
        </button>
    );
}