import { useState } from "react";
import API from "../services/api";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        const res = await API.post("/auth/login", {
            email,
            password
        });

        localStorage.setItem("token", res.data.token);

        alert("Login success");
    };

    return (
        <div className="flex items-center justify-center h-screen">

            <div className="bg-white p-6 shadow rounded w-80">

                <h1 className="text-xl font-bold mb-4">Login</h1>

                <input
                    className="border w-full p-2 mb-2"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="border w-full p-2 mb-2"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={login}
                    className="bg-indigo-600 text-white w-full p-2"
                >
                    Login
                </button>

            </div>

        </div>
    );
}