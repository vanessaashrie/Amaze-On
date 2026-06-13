import { useState, useRef, useEffect } from "react";
import { useTheme } from "../components/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";

const suggestions = [
  "How can I save more money?",
  "I'm feeling stressed today",
  "Help me plan my week",
  "Give me a motivational quote",
];

export default function AICompanion() {
  const { dark } = useTheme();

  const user = JSON.parse(localStorage.getItem("pocketBuddyUser") || "{}");
  const friendName = user.friend_name || user.friendName || "Nova";

  const [messages, setMessages] = useState([
    { from: "ai", text: `Hey! I'm ${friendName}, your AI best friend 💜 How are you feeling today? I'm here to help with your finances, health, or just to chat!` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { from: "user", text: msg }]);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `You are ${friendName}, a warm, caring AI best friend for a student/young professional. You help with personal finance, health, mental wellness and motivation. Keep responses friendly, concise and supportive. Use emojis occasionally. Address the user warmly.`,
          messages: [
            ...messages.filter(m => m.from !== "ai" || messages.indexOf(m) > 0).map(m => ({
              role: m.from === "user" ? "user" : "assistant",
              content: m.text
            })),
            { role: "user", content: msg }
          ]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I'm here for you! 💜";
      setMessages(prev => [...prev, { from: "ai", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { from: "ai", text: "Oops, something went wrong. Try again! 💜" }]);
    }
    setLoading(false);
  };

  const text = dark ? "#f1f5f9" : "#1f2937";
  const muted = dark ? "#94a3b8" : "#6b7280";
  const card = {
    background: dark ? "#1a1a2e" : "#ffffff",
    borderRadius: "16px",
    border: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "700", color: text }}>🤖 AI Companion</h2>
        <p style={{ margin: 0, fontSize: "13px", color: muted }}>Chat with {friendName}, your personal AI best friend.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px", height: "calc(100vh - 220px)" }}>

        {/* Chat */}
        <div style={{ ...card, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Chat Header */}
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`, display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#b8f5d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🌱</div>
            <div>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: text }}>{friendName}</p>
              <p style={{ margin: 0, fontSize: "11px", color: "#10b981" }}>● Online — always here for you</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", gap: "8px", alignItems: "flex-end" }}>
                {msg.from === "ai" && (
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#b8f5d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>🌱</div>
                )}
                <div style={{
                  maxWidth: "70%", padding: "12px 16px", borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: msg.from === "user" ? "#7c3aed" : dark ? "#2d2d44" : "#f5f3ff",
                  color: msg.from === "user" ? "white" : text,
                  fontSize: "13px", lineHeight: "1.6"
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#b8f5d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🌱</div>
                <div style={{ padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: dark ? "#2d2d44" : "#f5f3ff", fontSize: "13px", color: muted }}>
                  typing...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "16px 20px", borderTop: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`, display: "flex", gap: "10px" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder={`Message ${friendName}...`}
              style={{
                flex: 1, padding: "12px 16px", borderRadius: "12px",
                border: `1.5px solid ${dark ? "#2d2d44" : "#e5e7eb"}`,
                background: dark ? "#0f0f1a" : "#f9fafb",
                color: text, fontSize: "13px", outline: "none"
              }}
            />
            <button
              onClick={() => sendMessage()}
              style={{ padding: "12px 20px", borderRadius: "12px", border: "none", background: "#7c3aed", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
            >Send</button>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Quick Suggestions */}
          <div style={{ ...card, padding: "16px" }}>
            <p style={{ margin: "0 0 12px", fontSize: "13px", fontWeight: "600", color: text }}>Quick Questions</p>
            {suggestions.map(s => (
              <button key={s} onClick={() => sendMessage(s)} style={{
                width: "100%", marginBottom: "8px", padding: "10px 12px",
                borderRadius: "10px", border: `1px solid ${dark ? "#2d2d44" : "#e9d5ff"}`,
                background: dark ? "#0f0f1a" : "#faf5ff",
                color: dark ? "#a78bfa" : "#7c3aed",
                fontSize: "12px", cursor: "pointer", textAlign: "left", fontWeight: "500"
              }}>{s}</button>
            ))}
          </div>

          {/* Mood Check */}
          <div style={{ ...card, padding: "16px" }}>
            <p style={{ margin: "0 0 12px", fontSize: "13px", fontWeight: "600", color: text }}>How's your day?</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[
                { emoji: "😁", label: "Great" },
                { emoji: "🙂", label: "Good" },
                { emoji: "😐", label: "Okay" },
                { emoji: "😞", label: "Bad" },
              ].map(({ emoji, label }) => (
                <button key={label} onClick={() => sendMessage(`I'm feeling ${label.toLowerCase()} today`)} style={{
                  padding: "10px", borderRadius: "10px", border: `1px solid ${dark ? "#2d2d44" : "#e5e7eb"}`,
                  background: dark ? "#0f0f1a" : "#f9fafb",
                  cursor: "pointer", fontSize: "18px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"
                }}>
                  {emoji}
                  <span style={{ fontSize: "10px", color: muted }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}