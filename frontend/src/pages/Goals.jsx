import { useState } from "react";
import { useTheme } from "../components/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";

const initialGoals = [
  { id: 1, title: "Save ₹10,000", category: "Finance", progress: 63, target: 10000, current: 6300, icon: "💰", color: "#7c3aed", due: "June 30" },
  { id: 2, title: "Read 12 Books", category: "Learning", progress: 58, target: 12, current: 7, icon: "📚", color: "#f97316", due: "Dec 31" },
  { id: 3, title: "Workout 20 Days", category: "Health", progress: 60, target: 20, current: 12, icon: "💪", color: "#10b981", due: "May 31" },
  { id: 4, title: "Learn React", category: "Skills", progress: 75, target: 100, current: 75, icon: "⚛️", color: "#3b82f6", due: "June 15" },
];

export default function Goals() {
  const { dark } = useTheme();
  const [goals, setGoals] = useState(initialGoals);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Finance", icon: "🎯", due: "", target: "" });

  const card = {
    background: dark ? "#1a1a2e" : "#ffffff",
    borderRadius: "16px", padding: "20px",
    border: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
  };
  const text = dark ? "#f1f5f9" : "#1f2937";
  const muted = dark ? "#94a3b8" : "#6b7280";
  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: `1.5px solid ${dark ? "#2d2d44" : "#e5e7eb"}`,
    background: dark ? "#0f0f1a" : "#f9fafb",
    color: text, fontSize: "13px", outline: "none", boxSizing: "border-box"
  };

  const addGoal = () => {
    if (!form.title) return;
    setGoals(prev => [...prev, {
      id: Date.now(), ...form, progress: 0, current: 0,
      target: Number(form.target) || 100, color: "#7c3aed"
    }]);
    setShowForm(false);
    setForm({ title: "", category: "Finance", icon: "🎯", due: "", target: "" });
  };

  return (
    <DashboardLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "700", color: text }}>🎯 Goals</h2>
          <p style={{ margin: 0, fontSize: "13px", color: muted }}>Set, track and achieve your personal goals.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: "10px 20px", borderRadius: "12px", border: "none",
          background: "#7c3aed", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer"
        }}>+ New Goal</button>
      </div>

      {showForm && (
        <div style={{ ...card, marginBottom: "20px", background: dark ? "#1a1a2e" : "#faf5ff", border: `1px solid ${dark ? "#2d2d44" : "#e9d5ff"}` }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>Add New Goal</h3>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: "12px", alignItems: "end" }}>
            <div>
              <label style={{ fontSize: "12px", color: muted, display: "block", marginBottom: "6px" }}>Goal Title</label>
              <input placeholder="e.g. Save ₹5,000" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: muted, display: "block", marginBottom: "6px" }}>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                {["Finance", "Health", "Learning", "Skills", "Personal"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: muted, display: "block", marginBottom: "6px" }}>Target</label>
              <input placeholder="e.g. 5000" type="number" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: muted, display: "block", marginBottom: "6px" }}>Due Date</label>
              <input type="date" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} style={inputStyle} />
            </div>
            <button onClick={addGoal} style={{
              padding: "10px 20px", borderRadius: "10px", border: "none",
              background: "#7c3aed", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer"
            }}>Add</button>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "16px", marginBottom: "24px" }}>
        {goals.map(({ id, title, category, progress, current, target, icon, color, due }) => (
          <div key={id} style={card}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{icon}</div>
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "600", color: text }}>{title}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: muted }}>{category} · Due {due}</p>
                </div>
              </div>
              <span style={{ fontSize: "18px", fontWeight: "700", color }}>{progress}%</span>
            </div>

            <div style={{ height: "8px", borderRadius: "99px", background: dark ? "#2d2d44" : "#f3f4f6", marginBottom: "10px" }}>
              <div style={{ height: "100%", width: `${progress}%`, borderRadius: "99px", background: color, transition: "width 0.5s" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ margin: 0, fontSize: "12px", color: muted }}>{current} / {target}</p>
              <button style={{
                padding: "6px 14px", borderRadius: "8px", border: `1px solid ${color}`,
                background: "transparent", color, fontSize: "12px", fontWeight: "500", cursor: "pointer"
              }}>Update</button>
            </div>
          </div>
        ))}
      </div>

      {/* Completed */}
      <div style={card}>
        <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>🏆 Completed Goals</h3>
        {[
          { title: "Complete Python Course", date: "May 5, 2025", icon: "🐍" },
          { title: "Save ₹5,000 Emergency Fund", date: "Apr 28, 2025", icon: "🏦" },
        ].map(({ title, date, icon }) => (
          <div key={title} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}` }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#10b98120", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "500", color: text }}>{title}</p>
              <p style={{ margin: 0, fontSize: "11px", color: muted }}>Completed {date}</p>
            </div>
            <span style={{ fontSize: "18px" }}>✅</span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}