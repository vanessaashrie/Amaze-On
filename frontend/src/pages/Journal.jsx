// Journal.jsx — Daily mood tracking and journal entry page

// --- Imports ---
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../components/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api";

// --- Constants ---
const moods = [
  { emoji: "😁", label: "Great", color: "#10b981" },
  { emoji: "🙂", label: "Good", color: "#3b82f6" },
  { emoji: "😐", label: "Okay", color: "#f59e0b" },
  { emoji: "😞", label: "Bad", color: "#f97316" },
  { emoji: "😣", label: "Terrible", color: "#ef4444" },
];

// --- Component ---
export default function Journal() {
  const { dark } = useTheme();
  const { user } = useUser();

  // --- State ---
  const [selectedMood, setSelectedMood] = useState(null);
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pastEntries, setPastEntries] = useState([]);

  // --- Styles ---
  const card = {
    background: dark ? "#1a1a2e" : "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    border: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
  };

  const text = dark ? "#f1f5f9" : "#1f2937";
  const muted = dark ? "#94a3b8" : "#6b7280";
  const inputBg = dark ? "#0f0f1a" : "#f9fafb";

  // --- Effects ---
  // Fetch past journal entries on mount
  useEffect(() => {
    if (!user?.id) return;
    api.get(`/journal/${user.id}`)
      .then((res) => setPastEntries(res.data.entries || []))
      .catch((err) => console.error("Failed to fetch journal entries:", err));
  }, [user?.id]);

  // --- Handlers ---
  // Submit a new journal entry
  const handleSubmit = async () => {
    if (!selectedMood || !entry.trim()) return;

    setLoading(true);
    try {
      await api.post("/journal/", {
        clerk_id: user.id,
        mood: selectedMood,
        text: entry,
        tags: [],
      });

      setSubmitted(true);
      setEntry("");
      setSelectedMood(null);
      setTimeout(() => setSubmitted(false), 2000);

      const res = await api.get(`/journal/${user.id}`);
      setPastEntries(res.data.entries || []);

    } catch (err) {
      console.error("Failed to save journal:", err);
      alert("Failed to save journal");
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: "700", color: text, display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/journal.png" alt="journal" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
          My Journal
        </h2>
        <p style={{ margin: 0, fontSize: "15px", color: muted }}>
          Write your thoughts and track your mood.
        </p>
      </div>

      <div className="responsive-grid-2-1">

        {/* Left Column — Mood Picker & Text Entry */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Mood Selector */}
          <div style={card}>
            <h3 style={{ marginBottom: "14px", fontSize: "18px", color: text }}>
              How are you feeling today?
            </h3>
            <div style={{ display: "flex", gap: "10px" }}>
              {moods.map((m) => (
                <div
                  key={m.label}
                  onClick={() => setSelectedMood(m.label)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    textAlign: "center",
                    borderRadius: "12px",
                    cursor: "pointer",
                    border: selectedMood === m.label ? `2px solid ${m.color}` : "1px solid transparent",
                    background: selectedMood === m.label ? `${m.color}20` : inputBg,
                  }}
                >
                  <div style={{ fontSize: "22px" }}>{m.emoji}</div>
                  <div style={{ fontSize: "13px", color: muted }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Journal Text Area */}
          <div style={card}>
            <h3 style={{ marginBottom: "10px", fontSize: "18px", color: text }}>
              Write your thoughts
            </h3>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="What's on your mind today?"
              rows={6}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #ddd",
                background: inputBg,
                color: text,
                resize: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                marginTop: "12px",
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                background: submitted ? "#10b981" : "#7c3aed",
                color: "white",
                fontWeight: "600",
              }}
            >
              {loading ? "Saving..." : submitted ? "Saved ✔" : "Save Journal"}
            </button>
          </div>

        </div>

        {/* Right Column — Streak & Past Entries */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Streak Counter */}
          <div style={card}>
            <h3 style={{ color: text }}>🔥 Streak</h3>
            <h1 style={{ color: "#7c3aed" }}>{pastEntries.length} entries</h1>
          </div>

          {/* Past Entries List */}
          <div style={card}>
            <h3 style={{ color: text }}>Past Entries</h3>
            {pastEntries.length === 0 && (
              <p style={{ fontSize: "13px", color: muted }}>No entries yet.</p>
            )}
            {pastEntries.map((e) => (
              <div key={e.entry_id} style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "13px", color: muted }}>
                  {new Date(e.timestamp).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </div>
                <div style={{ fontWeight: "600", color: text }}>{e.mood}</div>
                <div style={{ fontSize: "13px", color: muted }}>
                  {e.text?.slice(0, 80)}...
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
