import { useState } from "react";
import { useTheme } from "../components/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";

const moods = [
  { emoji: "😁", label: "Great", color: "#10b981" },
  { emoji: "🙂", label: "Good", color: "#3b82f6" },
  { emoji: "😐", label: "Okay", color: "#f59e0b" },
  { emoji: "😞", label: "Bad", color: "#f97316" },
  { emoji: "😣", label: "Terrible", color: "#ef4444" },
];

const pastEntries = [
  { date: "May 14, 2025", mood: "😁", title: "Productive day!", preview: "Finished my assignment early and went for a walk...", tag: "Great" },
  { date: "May 13, 2025", mood: "😐", title: "Feeling a bit off", preview: "Couldn't focus much today. Spent too much time on phone...", tag: "Okay" },
  { date: "May 12, 2025", mood: "🙂", title: "Good college day", preview: "Had a great lecture today. Made notes and felt confident...", tag: "Good" },
];

export default function Journal() {
  const { dark } = useTheme();
  const [selectedMood, setSelectedMood] = useState(null);
  const [entry, setEntry] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const card = {
    background: dark ? "#1a1a2e" : "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    border: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
  };

  const text = dark ? "#f1f5f9" : "#1f2937";
  const muted = dark ? "#94a3b8" : "#6b7280";
  const inputBg = dark ? "#0f0f1a" : "#f9fafb";

  const handleSubmit = () => {
    if (!selectedMood || !entry.trim()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setEntry("");
    setSelectedMood(null);
  };

  return (
    <DashboardLayout>

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "700", color: text }}>📓 My Journal</h2>
        <p style={{ margin: 0, fontSize: "13px", color: muted }}>Write your thoughts, track your mood, and reflect on your day.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>

        {/* LEFT — New Entry */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Mood Picker */}
          <div style={card}>
            <h3 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: "600", color: text }}>How are you feeling today?</h3>
            <div style={{ display: "flex", gap: "12px" }}>
              {moods.map(({ emoji, label, color }) => (
                <div
                  key={label}
                  onClick={() => setSelectedMood(label)}
                  style={{
                    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                    gap: "6px", padding: "12px 8px", borderRadius: "12px", cursor: "pointer",
                    border: `2px solid ${selectedMood === label ? color : "transparent"}`,
                    background: selectedMood === label
                      ? color + "15"
                      : dark ? "#0f0f1a" : "#f9fafb",
                    transition: "all 0.2s"
                  }}
                >
                  <span style={{ fontSize: "24px" }}>{emoji}</span>
                  <span style={{ fontSize: "11px", color: selectedMood === label ? color : muted, fontWeight: "500" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Write Entry */}
          <div style={card}>
            <h3 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: "600", color: text }}>Write your thoughts</h3>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="What's on your mind today? Write freely..."
              rows={6}
              style={{
                width: "100%", padding: "14px", borderRadius: "12px",
                border: `1.5px solid ${dark ? "#2d2d44" : "#e5e7eb"}`,
                background: inputBg, color: text, fontSize: "13px",
                resize: "vertical", outline: "none", boxSizing: "border-box",
                lineHeight: "1.6", fontFamily: "inherit"
              }}
            />

            {/* Tags */}
            <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
              {["College", "Health", "Money", "Relationships", "Goals", "Stress"].map(tag => (
                <span key={tag} style={{
                  padding: "4px 12px", borderRadius: "20px", fontSize: "11px",
                  background: dark ? "#2d2d44" : "#f5f3ff",
                  color: dark ? "#a78bfa" : "#7c3aed", cursor: "pointer", fontWeight: "500"
                }}>{tag}</span>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              style={{
                width: "100%", marginTop: "16px", padding: "13px",
                borderRadius: "12px", border: "none",
                background: submitted ? "#10b981" : "#7c3aed",
                color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer",
                transition: "background 0.3s"
              }}
            >
              {submitted ? "✅ Entry Saved!" : "Save Journal Entry"}
            </button>
          </div>
        </div>

        {/* RIGHT — Past Entries + Streak */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Streak */}
          <div style={{
            ...card,
            background: dark ? "#1a1a2e" : "#faf5ff",
            border: `1px solid ${dark ? "#2d2d44" : "#e9d5ff"}`
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "8px" }}>🔥</div>
              <p style={{ margin: "0 0 4px", fontSize: "28px", fontWeight: "700", color: "#7c3aed" }}>7</p>
              <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: "600", color: text }}>Day Streak!</p>
              <p style={{ margin: 0, fontSize: "12px", color: muted }}>Keep journaling every day to maintain your streak.</p>
            </div>
          </div>

          {/* Mood Summary */}
          <div style={card}>
            <h3 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: "600", color: text }}>This Week's Mood</h3>
            {[
              { day: "Mon", emoji: "😁", color: "#10b981" },
              { day: "Tue", emoji: "🙂", color: "#3b82f6" },
              { day: "Wed", emoji: "😐", color: "#f59e0b" },
              { day: "Thu", emoji: "😁", color: "#10b981" },
              { day: "Fri", emoji: "😞", color: "#f97316" },
              { day: "Sat", emoji: "🙂", color: "#3b82f6" },
              { day: "Sun", emoji: "😁", color: "#10b981" },
            ].map(({ day, emoji }) => (
              <div key={day} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", color: muted, width: "30px" }}>{day}</span>
                <span style={{ fontSize: "18px" }}>{emoji}</span>
              </div>
            ))}
          </div>

          {/* Past Entries */}
          <div style={card}>
            <h3 style={{ margin: "0 0 14px", fontSize: "14px", fontWeight: "600", color: text }}>Past Entries</h3>
            {pastEntries.map(({ date, mood, title, preview }) => (
              <div key={date} style={{
                padding: "12px", borderRadius: "12px",
                background: dark ? "#0f0f1a" : "#f9fafb",
                marginBottom: "10px", cursor: "pointer"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "11px", color: muted }}>{date}</span>
                  <span style={{ fontSize: "16px" }}>{mood}</span>
                </div>
                <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: "600", color: text }}>{title}</p>
                <p style={{ margin: 0, fontSize: "11px", color: muted }}>{preview}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}