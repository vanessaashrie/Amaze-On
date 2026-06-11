import { useState } from "react";
import MarkdownPreview from "../components/MarkdownPreview";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: "I'm your AI shopping assistant! Backend coming soon 🚀" }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8 flex flex-col">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🤖 AI Shopping Assistant</h2>
      <div className="flex-1 flex flex-col gap-3 mb-6">
        {messages.map((m, i) => (
          <div key={i} className={`max-w-xl px-4 py-3 rounded-2xl text-sm ${m.role === "user" ? "bg-orange-400 text-white self-end" : "bg-white text-gray-700 self-start shadow"}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="bg-white text-gray-400 px-4 py-3 rounded-2xl text-sm self-start shadow animate-pulse">Thinking...</div>}
      </div>
      <div className="flex gap-3">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Ask me anything..." className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400" />
        <button onClick={handleSend} className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition">Send</button>
      </div>
    </div>
  );
}