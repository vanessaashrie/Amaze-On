import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-bold text-gray-800 mb-4 text-center">Welcome to <span className="text-orange-400">Amaze-On</span></h1>
      <p className="text-gray-500 text-lg mb-10 text-center max-w-xl">AI-powered shopping — smarter, greener, and trustworthy.</p>
      <div className="flex gap-4 flex-wrap justify-center">
        <button onClick={() => navigate("/sustainability")} className="bg-orange-400 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-500 transition">🌿 Eco Shop</button>
        <button onClick={() => navigate("/reviews")} className="bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition">🔍 Review Checker</button>
        <button onClick={() => navigate("/chat")} className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition">🤖 AI Chat</button>
      </div>
    </div>
  );
}