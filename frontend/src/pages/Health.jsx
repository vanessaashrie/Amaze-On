import { useState } from "react";
import { useTheme } from "../components/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const sleepData = [
  { day: "Mon", hours: 7 }, { day: "Tue", hours: 6 }, { day: "Wed", hours: 8 },
  { day: "Thu", hours: 5.5 }, { day: "Fri", hours: 7.5 }, { day: "Sat", hours: 9 }, { day: "Sun", hours: 6.5 },
];

const stepsData = [
  { day: "Mon", steps: 6200 }, { day: "Tue", steps: 8400 }, { day: "Wed", steps: 5100 },
  { day: "Thu", steps: 9200 }, { day: "Fri", steps: 7600 }, { day: "Sat", steps: 11000 }, { day: "Sun", steps: 4300 },
];

export default function Health() {
  const { dark } = useTheme();
  const [waterCount, setWaterCount] = useState(5);
  const waterGoal = 8;

  const card = {
    background: dark ? "#1a1a2e" : "#ffffff",
    borderRadius: "16px", padding: "20px",
    border: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
  };
  const text = dark ? "#f1f5f9" : "#1f2937";
  const muted = dark ? "#94a3b8" : "#6b7280";

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "700", color: text }}>❤️ Health Tracker</h2>
        <p style={{ margin: 0, fontSize: "13px", color: muted }}>Monitor your sleep, hydration, steps and wellness.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "20px" }}>
        {[
          { label: "Sleep Last Night", value: "6.5 hrs", sub: "Goal: 7-8 hrs", icon: "🌙", color: "#6366f1" },
          { label: "Steps Today", value: "7,432", sub: "Goal: 10,000", icon: "👟", color: "#10b981" },
          { label: "Water Intake", value: `${waterCount}/8`, sub: "glasses today", icon: "💧", color: "#3b82f6" },
          { label: "Stress Level", value: "Moderate", sub: "Based on journal", icon: "🧠", color: "#f59e0b" },
        ].map(({ label, value, sub, icon, color }) => (
          <div key={label} style={card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <p style={{ margin: 0, fontSize: "12px", color: muted }}>{label}</p>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{icon}</div>
            </div>
            <p style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: "700", color: text }}>{value}</p>
            <p style={{ margin: 0, fontSize: "11px", color: muted }}>{sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

        {/* Sleep Chart */}
        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>Sleep This Week</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={sleepData}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: muted }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: dark ? "#1a1a2e" : "#fff", border: "none", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Steps Chart */}
        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>Daily Steps</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={stepsData}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: dark ? "#1a1a2e" : "#fff", border: "none", borderRadius: "8px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="steps" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {/* Water Tracker */}
        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>💧 Water Intake</h3>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            {Array.from({ length: waterGoal }).map((_, i) => (
              <div
                key={i}
                onClick={() => setWaterCount(i + 1)}
                style={{
                  width: "44px", height: "44px", borderRadius: "12px", cursor: "pointer",
                  background: i < waterCount ? "#3b82f6" : dark ? "#2d2d44" : "#f3f4f6",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
                  transition: "all 0.2s"
                }}
              >💧</div>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: "13px", color: muted }}>
            {waterCount} of {waterGoal} glasses · {waterGoal - waterCount} more to go!
          </p>
        </div>

        {/* Habits */}
        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>Today's Habits</h3>
          {[
            { label: "Morning Walk", done: true, icon: "🚶" },
            { label: "Meditate 10 mins", done: true, icon: "🧘" },
            { label: "No Junk Food", done: false, icon: "🥗" },
            { label: "Stretch & Exercise", done: false, icon: "💪" },
            { label: "Sleep by 11 PM", done: false, icon: "🌙" },
          ].map(({ label, done, icon }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 0", borderBottom: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`
            }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: done ? "#10b98120" : dark ? "#2d2d44" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{icon}</div>
              <span style={{ flex: 1, fontSize: "13px", color: done ? text : muted, textDecoration: done ? "none" : "none", fontWeight: done ? "500" : "400" }}>{label}</span>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: done ? "#10b981" : dark ? "#2d2d44" : "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "white" }}>
                {done ? "✓" : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}