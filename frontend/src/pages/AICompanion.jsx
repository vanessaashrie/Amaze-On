import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../components/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";

const suggestions = [
  "How can I save more money?",
  "I'm feeling stressed today",
  "Help me plan my week",
  "Give me a motivational quote",
];

const quickActions = [
  { label: "Review my spending", emoji: "💸" },
  { label: "I feel stressed 😓", emoji: "🧠" },
  { label: "Suggest a study plan", emoji: "📚" },
  { label: "Plan my day", emoji: "📅" },
];

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function AICompanion() {
  const { dark } = useTheme();
  const { user: clerkUser } = useUser();

  const localUser = JSON.parse(localStorage.getItem("pocketBuddyUser") || "{}");
  const [friendName, setFriendName] = useState(localUser.friend_name || localUser.friendName || "Nova");

  const [messages, setMessages] = useState([
    { from: "ai", text: `Hey! I'm ${localUser.friend_name || localUser.friendName || "Nova"}, your AI best friend 💜 How are you feeling today? I'm here to help with your finances, health, or just to chat!` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const bottomRef = useRef(null);

  // Fetch friend name from backend using Clerk user ID
  useEffect(() => {
    async function fetchProfile() {
      try {
        const userId = clerkUser?.id || localUser.clerk_id;
        if (!userId) return;
        const res = await fetch(`${BACKEND_URL}/auth/profile/${userId}`);
        if (res.ok) {
          const profile = await res.json();
          const name = profile.friend_name || profile.friendName;
          if (name) {
            setFriendName(name);
            setMessages([
              { from: "ai", text: `Hey! I'm ${name}, your AI best friend 💜 How are you feeling today? I'm here to help with your finances, health, or just to chat!` }
            ]);
            // Update localStorage too
            const updated = { ...localUser, friend_name: name, clerk_id: userId };
            localStorage.setItem("pocketBuddyUser", JSON.stringify(updated));
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    }
    fetchProfile();
  }, [clerkUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setShowIntro(false);
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
        <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "700", color: text, display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="/star.png" alt="stars" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
          AI Companion
        </h2>
        <p style={{ margin: 0, fontSize: "13px", color: muted }}>Chat with {friendName}, your personal AI best friend.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px", height: "calc(100vh - 220px)" }}>

        {/* Chat Area */}
        <div style={{ ...card, display: "flex", overflow: "hidden" }}>

          {/* LEFT MASCOT PANEL */}
          <div style={{
            width: "200px",
            flexShrink: 0,
            borderRight: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 16px",
            background: dark ? "#12122a" : "#faf5ff",
            gap: "12px"
          }}>
            <img
              src="/ChatGPT Image Jun 13, 2026, 10_27_03 PM.png"
              alt={friendName}
              style={{
                width: "130px",
                height: "130px",
                objectFit: "contain",
                borderRadius: "50%",
                background: dark ? "#1a1a2e" : "#ede9fe",
                padding: "8px"
              }}
            />
            <div style={{ textAlign: "center" }}>
              <p style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "700", color: "#7c3aed" }}>{friendName}</p>
              <p style={{ margin: 0, fontSize: "11px", color: "#10b981" }}>● Online</p>
            </div>
            <p style={{
              margin: 0,
              fontSize: "11px",
              color: muted,
              textAlign: "center",
              lineHeight: "1.5"
            }}>
              Your personal AI best friend — always here for you 💜
            </p>
          </div>

          {/* CHAT COLUMN */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>

              {/* INTRO SECTION shown before user types */}
              {showIntro && (
                <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
                  <p style={{ fontSize: "18px", fontWeight: "700", color: text, margin: "0 0 4px" }}>
                    Hi {localUser.name?.split(" ")[0] || clerkUser?.firstName || "there"} 👋
                  </p>
                  <p style={{ fontSize: "13px", color: muted, margin: "0 0 20px" }}>
                    I'm here to support you in your financial and personal wellness journey.
                  </p>
                  <p style={{ fontSize: "12px", color: muted, margin: "0 0 10px" }}>How can I help you today? ›</p>

                  {/* Quick action buttons */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", maxWidth: "340px", margin: "0 auto" }}>
                    {quickActions.map(({ label, emoji }) => (
                      <button
                        key={label}
                        onClick={() => sendMessage(label)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "12px",
                          border: `1px solid ${dark ? "#2d2d44" : "#e9d5ff"}`,
                          background: dark ? "#1a1a2e" : "#faf5ff",
                          color: dark ? "#a78bfa" : "#7c3aed",
                          fontSize: "12px",
                          cursor: "pointer",
                          textAlign: "left",
                          fontWeight: "500",
                          lineHeight: "1.4"
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat messages */}
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", gap: "8px", alignItems: "flex-end" }}>
                  {msg.from === "ai" && (
                    <img
                      src="/ChatGPT Image Jun 13, 2026, 10_27_03 PM.png"
                      alt={friendName}
                      style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, background: "#ede9fe" }}
                    />
                  )}
                  <div style={{
                    maxWidth: "75%",
                    padding: "12px 16px",
                    borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.from === "user" ? "#7c3aed" : dark ? "#2d2d44" : "#f5f3ff",
                    color: msg.from === "user" ? "white" : text,
                    fontSize: "13px",
                    lineHeight: "1.6"
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                  <img
                    src="/ChatGPT Image Jun 13, 2026, 10_27_03 PM.png"
                    alt={friendName}
                    style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, background: "#ede9fe" }}
                  />
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
                placeholder={`Type your message...`}
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