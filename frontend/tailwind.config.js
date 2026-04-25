export default {
    darkMode: "class", // ✅ ENABLE DARK MODE

    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],

    theme: {
        extend: {
            colors: {
                primary: "#4f46e5",
                secondary: "#06b6d4"
            },

            // ✅ ADD ANIMATIONS
            animation: {
                fadeIn: "fadeIn 0.3s ease-in-out",
            },

            keyframes: {
                fadeIn: {
                    "0%": { opacity: 0, transform: "translateY(5px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                },
            },
        },
    },

    plugins: [],
};