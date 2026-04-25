import { useEffect, useRef } from "react";

export default function ChatBox({ chats, isTyping }) {

    const bottomRef = useRef();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats, isTyping]);

    return (
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 
        p-5 h-[450px] overflow-y-auto rounded-2xl shadow-inner space-y-4 border 
        scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">

            {chats.map((c, i) => (
                <div key={i} className="space-y-2 animate-fadeIn">

                    {/* 🤖 AI */}
                    <div className="flex items-start gap-2">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-full">
                            🤖
                        </div>

                        <div className="bg-white dark:bg-gray-700 dark:text-white px-4 py-2 rounded-2xl shadow max-w-[70%]">
                            {c.question}
                        </div>
                    </div>

                    {/* 🧑 USER */}
                    {c.answer && (
                        <div className="flex justify-end gap-2">
                            <div className="bg-indigo-600 text-white px-4 py-2 rounded-2xl shadow max-w-[70%]">
                                {c.answer}
                            </div>

                            <div className="w-8 h-8 flex items-center justify-center bg-indigo-500 text-white rounded-full">
                                🧑
                            </div>
                        </div>
                    )}

                </div>
            ))}

            {/* 🤖 Typing Animation (IMPROVED) */}
            {isTyping && (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
                    🤖
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                    </div>
                </div>
            )}

            <div ref={bottomRef}></div>
        </div>
    );
}