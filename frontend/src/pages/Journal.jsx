import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../components/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api";

const moods = [
  { emoji: "😁", label: "Great", color: "#10b981" },
  { emoji: "🙂", label: "Good", color: "#3b82f6" },
  { emoji: "😐", label: "Okay", color: "#f59e0b" },
  { emoji: "😞", label: "Bad", color: "#f97316" },
  { emoji: "😣", label: "Terrible", color: "#ef4444" },
];

export default function Journal() {
  const { dark } = useTheme();
  const { user } = useUser();

  const [selectedMood, setSelectedMood] = useState(null);
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pastEntries, setPastEntries] = useState([]);

  const card = {
    background: dark ? "#1a1a2e" : "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    border: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
  };

  const text = dark ? "#f1f5f9" : "#1f2937";
  const muted = dark ? "#94a3b8" : "#6b7280";
  const inputBg = dark ? "#0f0f1a" : "#f9fafb";

  // Fetch past entries on load
  useEffect(() => {
    if (!user?.id) return;
    api.get(`/journal/${user.id}`)
      .then((res) => setPastEntries(res.data.entries || []))
      .catch((err) => console.error("Failed to fetch journal entries:", err));
  }, [user?.id]);

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

      // Refresh past entries
      const res = await api.get(`/journal/${user.id}`);
      setPastEntries(res.data.entries || []);

    } catch (err) {
      console.error("Failed to save journal:", err);
      alert("Failed to save journal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "700", color: text }}>
          📓 My Journal
        </h2>
        <p style={{ margin: 0, fontSize: "13px", color: muted }}>
          Write your thoughts and track your mood.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>

        {/* LEFT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          <div style={card}>
            <h3 style={{ marginBottom: "14px", fontSize: "14px", color: text }}>
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
                  <div style={{ fontSize: "11px", color: muted }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <h3 style={{ marginBottom: "10px", fontSize: "14px", color: text }}>
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

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          <div style={card}>
            <h3 style={{ color: text }}>🔥 Streak</h3>
            <h1 style={{ color: "#7c3aed" }}>{pastEntries.length} entries</h1>
          </div>

          <div style={card}>
            <h3 style={{ color: text }}>Past Entries</h3>
            {pastEntries.length === 0 && (
              <p style={{ fontSize: "13px", color: muted }}>No entries yet.</p>
            )}
            {pastEntries.map((e) => (
              <div key={e.entry_id} style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "11px", color: muted }}>
                  {new Date(e.timestamp).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </div>
                <div style={{ fontWeight: "600", color: text }}>{e.mood}</div>
                <div style={{ fontSize: "11px", color: muted }}>
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