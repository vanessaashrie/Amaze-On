import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../components/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";
import api from "../api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const DEFAULT_HABITS = {
  morning_walk: false,
  meditate: false,
  no_junk_food: false,
  exercise: false,
  sleep_by_11: false,
};

const HABIT_LABELS = {
  morning_walk: { label: "Morning Walk", icon: "🚶" },
  meditate: { label: "Meditate 10 mins", icon: "🧘" },
  no_junk_food: { label: "No Junk Food", icon: "🥗" },
  exercise: { label: "Stretch & Exercise", icon: "💪" },
  sleep_by_11: { label: "Sleep by 11 PM", icon: "🌙" },
};

export default function Health() {
  const { dark } = useTheme();
  const { user } = useUser();

  const [todayLog, setTodayLog] = useState(null);
  const [weekLogs, setWeekLogs] = useState([]);
  const [waterCount, setWaterCount] = useState(0);
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [saving, setSaving] = useState(false);

  const waterGoal = 8;

  const card = {
    background: dark ? "#1a1a2e" : "#ffffff",
    borderRadius: "16px", padding: "20px",
    border: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
  };
  const text = dark ? "#f1f5f9" : "#1f2937";
  const muted = dark ? "#94a3b8" : "#6b7280";

  // Fetch today's log and week logs
  useEffect(() => {
    if (!user?.id) return;

    api.get(`/health/${user.id}/today`)
      .then((res) => {
        const log = res.data.log;
        if (log) {
          setTodayLog(log);
          setWaterCount(parseInt(log.water_glasses) || 0);
          setHabits({ ...DEFAULT_HABITS, ...(log.habits || {}) });
        }
      })
      .catch((err) => console.error("Failed to fetch today's health log:", err));

    api.get(`/health/${user.id}`)
      .then((res) => setWeekLogs(res.data.logs || []))
      .catch((err) => console.error("Failed to fetch week logs:", err));
  }, [user?.id]);

  const saveLog = async (overrides = {}) => {
    setSaving(true);
    try {
      await api.post("/health/", {
        clerk_id: user.id,
        sleep_hours: todayLog?.sleep_hours || "",
        steps: todayLog?.steps || "",
        water_glasses: waterCount.toString(),
        heart_rate: todayLog?.heart_rate || "",
        bmi: todayLog?.bmi || "",
        habits,
        ...overrides,
      });

      const res = await api.get(`/health/${user.id}`);
      setWeekLogs(res.data.logs || []);
    } catch (err) {
      console.error("Failed to save health log:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleWater = (count) => {
    setWaterCount(count);
    saveLog({ water_glasses: count.toString() });
  };

  const handleHabit = (key) => {
    const updated = { ...habits, [key]: !habits[key] };
    setHabits(updated);
    saveLog({ habits: updated });
  };

  // Chart data from week logs
  const sleepData = weekLogs.map((l) => ({
    day: new Date(l.date).toLocaleDateString("en-IN", { weekday: "short" }),
    hours: parseFloat(l.sleep_hours) || 0,
  }));

  const stepsData = weekLogs.map((l) => ({
    day: new Date(l.date).toLocaleDateString("en-IN", { weekday: "short" }),
    steps: parseInt(l.steps) || 0,
  }));

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "700", color: text }}>❤️ Health Tracker</h2>
        <p style={{ margin: 0, fontSize: "13px", color: muted }}>Monitor your sleep, hydration, steps and wellness.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "20px" }}>
        {[
          { label: "Sleep Last Night", value: todayLog?.sleep_hours ? `${todayLog.sleep_hours} hrs` : "—", sub: "Goal: 7-8 hrs", icon: "🌙", color: "#6366f1" },
          { label: "Steps Today", value: todayLog?.steps ? parseInt(todayLog.steps).toLocaleString("en-IN") : "—", sub: "Goal: 10,000", icon: "👟", color: "#10b981" },
          { label: "Water Intake", value: `${waterCount}/${waterGoal}`, sub: "glasses today", icon: "💧", color: "#3b82f6" },
          { label: "Heart Rate", value: todayLog?.heart_rate ? `${todayLog.heart_rate} bpm` : "—", sub: "Resting", icon: "❤️", color: "#f59e0b" },
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
        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>Sleep This Week</h3>
          {sleepData.length === 0 ? (
            <p style={{ fontSize: "13px", color: muted }}>No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={sleepData}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: muted }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: muted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: dark ? "#1a1a2e" : "#fff", border: "none", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="hours" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>Daily Steps</h3>
          {stepsData.length === 0 ? (
            <p style={{ fontSize: "13px", color: muted }}>No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={stepsData}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: muted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: dark ? "#1a1a2e" : "#fff", border: "none", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="steps" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
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
                onClick={() => handleWater(i + 1)}
                style={{
                  width: "44px", height: "44px", borderRadius: "12px", cursor: "pointer",
                  background: i < waterCount ? "#3b82f6" : dark ? "#2d2d44" : "#f3f4f6",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px",
                }}
              >💧</div>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: "13px", color: muted }}>
            {waterCount} of {waterGoal} glasses · {Math.max(0, waterGoal - waterCount)} more to go!
          </p>
          {saving && <p style={{ fontSize: "11px", color: muted, marginTop: "8px" }}>Saving...</p>}
        </div>

        {/* Habits */}
        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>Today's Habits</h3>
          {Object.entries(HABIT_LABELS).map(([key, { label, icon }]) => (
            <div
              key={key}
              onClick={() => handleHabit(key)}
              style={{
                display: "flex", alignItems: "center", gap: "12px", cursor: "pointer",
                padding: "10px 0", borderBottom: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
              }}
            >
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: habits[key] ? "#10b98120" : dark ? "#2d2d44" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{icon}</div>
              <span style={{ flex: 1, fontSize: "13px", color: habits[key] ? text : muted, fontWeight: habits[key] ? "500" : "400" }}>{label}</span>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: habits[key] ? "#10b981" : dark ? "#2d2d44" : "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "white" }}>
                {habits[key] ? "✓" : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}