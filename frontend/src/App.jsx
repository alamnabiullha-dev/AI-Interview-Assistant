import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Interview from "./pages/Interview";
import History from "./pages/History";
import Result from "./pages/Result";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <Navbar />

      {/* PAGE CONTAINER */}
      <div className="max-w-5xl mx-auto p-6">

        <Routes>
          <Route path="/" element={<Interview />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/history" element={<History />} />
          <Route path="/result" element={<Result />} />
        </Routes>

      </div>

    </div>
  );
}