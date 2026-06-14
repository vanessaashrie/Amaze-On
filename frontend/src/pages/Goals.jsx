import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../components/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api";

const CATEGORY_COLORS = {
  Finance: "#7c3aed",
  Health: "#10b981",
  Learning: "#f97316",
  Skills: "#3b82f6",
  Personal: "#ec4899",
};

export default function Goals() {
  const { dark } = useTheme();
  const { user } = useUser();

  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Finance", due_date: "" });
  const [loading, setLoading] = useState(false);

  const card = {
    background: dark ? "#1a1a2e" : "#ffffff",
    borderRadius: "16px", padding: "24px",
    border: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
  };
  const text = dark ? "#f1f5f9" : "#1f2937";
  const muted = dark ? "#94a3b8" : "#6b7280";
  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: `1.5px solid ${dark ? "#2d2d44" : "#e5e7eb"}`,
    background: dark ? "#0f0f1a" : "#f9fafb",
    color: text, fontSize: "14px", outline: "none", boxSizing: "border-box",
  };

  useEffect(() => {
    if (!user?.id) return;
    api.get(`/goals/${user.id}`)
      .then((res) => setGoals(res.data.goals || []))
      .catch((err) => console.error("Failed to fetch goals:", err));
  }, [user?.id]);

  const refreshGoals = () =>
    api.get(`/goals/${user.id}`)
      .then((res) => setGoals(res.data.goals || []));

  const addGoal = async () => {
    if (!form.title) return;
    setLoading(true);
    try {
      await api.post("/goals/", {
        clerk_id: user.id,
        title: form.title,
        category: form.category,
        icon: "goals",
        target: "100",
        current: "0",
        due_date: form.due_date,
      });
      await refreshGoals();
      setShowForm(false);
      setForm({ title: "", category: "Finance", due_date: "" });
    } catch (err) {
      console.error("Failed to add goal:", err);
      alert("Failed to add goal");
    } finally {
      setLoading(false);
    }
  };

  const toggleDone = async (goal) => {
    try {
      const newCompleted = !goal.is_completed;
      await api.post("/goals/update", {
        clerk_id: user.id,
        goal_id: goal.goal_id,
        current: newCompleted ? String(goal.target || "100") : "0",
        is_completed: newCompleted,
      });
      await refreshGoals();
    } catch (err) {
      console.error("Failed to toggle goal:", err.response?.data || err.message);
      alert("Failed to mark goal: " + (err.response?.data?.detail || err.message));
    }
  };

  const activeGoals = goals.filter((g) => !g.is_completed);
  const completedGoals = goals.filter((g) => g.is_completed);

  return (
    <DashboardLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: "700", color: text, display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/goals.png" alt="goals" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
            Goals
          </h2>
          <p style={{ margin: 0, fontSize: "15px", color: muted }}>Set, track and achieve your personal goals.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: "10px 20px", borderRadius: "12px", border: "none",
          background: "#7c3aed", color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer",
        }}>+ New Goal</button>
      </div>

      {showForm && (
        <div style={{ ...card, marginBottom: "20px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600", color: text }}>Add New Goal</h3>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "12px", alignItems: "end" }}>
            <div>
              <label style={{ fontSize: "13px", color: muted, display: "block", marginBottom: "6px" }}>Goal Title</label>
              <input placeholder="e.g. Save ₹5,000" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: "13px", color: muted, display: "block", marginBottom: "6px" }}>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                {["Finance", "Health", "Learning", "Skills", "Personal"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "13px", color: muted, display: "block", marginBottom: "6px" }}>Due Date</label>
              <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} style={{ ...inputStyle, minWidth: "140px" }} />
            </div>
            <button onClick={addGoal} disabled={loading} style={{
              padding: "10px 20px", borderRadius: "10px", border: "none",
              background: "#7c3aed", color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer",
            }}>{loading ? "Adding..." : "Add"}</button>
          </div>
        </div>
      )}

      {activeGoals.length === 0 && (
        <p style={{ color: muted, fontSize: "13px", marginBottom: "20px" }}>No active goals yet. Add one above!</p>
      )}

      <div className="responsive-grid-2" style={{ marginBottom: "24px" }}>
        {activeGoals.map((goal) => {
          const color = CATEGORY_COLORS[goal.category] || "#7c3aed";
          const progress = Math.min(100, Math.round((parseFloat(goal.current) / parseFloat(goal.target)) * 100)) || 0;
          return (
            <div key={goal.goal_id} style={{ ...card, display: "flex", gap: "16px", alignItems: "flex-start" }}>

              {/* Done/Not Done button on left */}
              <button
                onClick={() => toggleDone(goal)}
                style={{
                  width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                  border: `2px solid ${color}`,
                  background: goal.is_completed ? color : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", fontSize: "14px", color: goal.is_completed ? "white" : color,
                  marginTop: "4px"
                }}
              >
                {goal.is_completed ? "✓" : ""}
              </button>

              {/* Goal content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src="/goals.png" alt="goal" style={{ width: "26px", height: "26px", objectFit: "contain" }} />
                    </div>
                    <div>
                      <p style={{ margin: "0 0 2px", fontSize: "15px", fontWeight: "600", color: text }}>{goal.title}</p>
                      <p style={{ margin: 0, fontSize: "13px", color: muted }}>{goal.category} · Due {goal.due_date || "—"}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "18px", fontWeight: "700", color }}>{progress}%</span>
                </div>

                <div style={{ height: "8px", borderRadius: "99px", background: dark ? "#2d2d44" : "#f3f4f6", marginBottom: "10px" }}>
                  <div style={{ height: "100%", width: `${progress}%`, borderRadius: "99px", background: color, transition: "width 0.5s" }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ margin: 0, fontSize: "13px", color: muted }}>{goal.current} / {goal.target}</p>
                  <button
                    onClick={() => toggleDone(goal)}
                    style={{
                      padding: "8px 16px", borderRadius: "10px", border: "none",
                      background: "#7c3aed", color: "white",
                      fontSize: "14px", fontWeight: "600", cursor: "pointer",
                    }}
                  >
                    Mark Done
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={card}>
        <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600", color: text }}>🏆 Completed Goals</h3>
        {completedGoals.length === 0 && (
          <p style={{ fontSize: "15px", color: muted }}>No completed goals yet. Keep going!</p>
        )}
        {completedGoals.map((goal) => (
          <div key={goal.goal_id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}` }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#10b98120", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/goals.png" alt="goal" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 2px", fontSize: "15px", fontWeight: "500", color: text }}>{goal.title}</p>
              <p style={{ margin: 0, fontSize: "13px", color: muted }}>Completed · {goal.due_date || "—"}</p>
            </div>
            <span style={{ fontSize: "18px" }}>✅</span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}