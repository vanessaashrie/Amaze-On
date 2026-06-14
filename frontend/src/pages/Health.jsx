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

const SYMPTOMS = ["cramps", "bloating", "headache", "fatigue", "mood swings", "acne"];

export default function Health() {
  const { dark } = useTheme();
  const { user } = useUser();

  const [todayLog, setTodayLog]   = useState(null);
  const [weekLogs, setWeekLogs]   = useState([]);
  const [waterCount, setWaterCount] = useState(0);
  const [habits, setHabits]       = useState(DEFAULT_HABITS);
  const [saving, setSaving]       = useState(false);

  // Cycle tracker state
  const [userProfile, setUserProfile]       = useState(null);
  const [cycleHistory, setCycleHistory]     = useState([]);
  const [cyclePrediction, setCyclePrediction] = useState(null);
  const [cycleForm, setCycleForm]           = useState({
    start_date: "", end_date: "", flow: "medium", symptoms: [],
  });
  const [cycleLogging, setCycleLogging]     = useState(false);
  const [showCycleForm, setShowCycleForm]   = useState(false);

  const waterGoal = 8;

  const card = {
    background: dark ? "#1a1a2e" : "#ffffff",
    borderRadius: "16px", padding: "24px",
    border: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
  };
  const text  = dark ? "#f1f5f9" : "#1f2937";
  const muted = dark ? "#94a3b8" : "#6b7280";
  const inputStyle = {
    padding: "10px 14px", borderRadius: "10px",
    border: `1.5px solid ${dark ? "#2d2d44" : "#e5e7eb"}`,
    background: dark ? "#0f0f1a" : "#f9fafb",
    color: text, fontSize: "14px", outline: "none",
    width: "100%", boxSizing: "border-box",
  };

  // ── Fetch health logs ──────────────────────────────────────────────
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

  // ── Fetch profile (for gender check) + cycle data ─────────────────
  useEffect(() => {
    if (!user?.id) return;

    api.get(`/auth/profile/${user.id}`)
      .then((res) => {
        setUserProfile(res.data);
        const gender = res.data?.gender?.toLowerCase();
        if (gender === "female") {
          api.get(`/cycle/${user.id}`)
            .then((r) => {
              setCycleHistory(r.data.history || []);
              setCyclePrediction(r.data.prediction || null);
            })
            .catch((err) => console.error("Failed to fetch cycle data:", err));
        }
      })
      .catch((err) => console.error("Failed to fetch profile:", err));
  }, [user?.id]);

  // ── Health log helpers ────────────────────────────────────────────
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

  // ── Cycle helpers ─────────────────────────────────────────────────
  const toggleSymptom = (s) => {
    setCycleForm((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(s)
        ? prev.symptoms.filter((x) => x !== s)
        : [...prev.symptoms, s],
    }));
  };

  const handleLogPeriod = async () => {
    if (!cycleForm.start_date) return;
    setCycleLogging(true);
    try {
      await api.post("/cycle/log", {
        user_id: user.id,
        start_date: cycleForm.start_date,
        end_date: cycleForm.end_date || null,
        flow: cycleForm.flow,
        symptoms: cycleForm.symptoms,
      });
      const res = await api.get(`/cycle/${user.id}`);
      setCycleHistory(res.data.history || []);
      setCyclePrediction(res.data.prediction || null);
      setCycleForm({ start_date: "", end_date: "", flow: "medium", symptoms: [] });
      setShowCycleForm(false);
    } catch (err) {
      console.error("Failed to log period:", err);
      alert("Failed to log period");
    } finally {
      setCycleLogging(false);
    }
  };

  // ── Chart data ────────────────────────────────────────────────────
  const sleepData = weekLogs.map((l) => ({
    day: new Date(l.date).toLocaleDateString("en-IN", { weekday: "short" }),
    hours: parseFloat(l.sleep_hours) || 0,
  }));

  const stepsData = weekLogs.map((l) => ({
    day: new Date(l.date).toLocaleDateString("en-IN", { weekday: "short" }),
    steps: parseInt(l.steps) || 0,
  }));

  const isFemale = userProfile?.gender?.toLowerCase() === "female";

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: "700", color: text }}>❤️ Health Tracker</h2>
        <p style={{ margin: 0, fontSize: "15px", color: muted }}>Monitor your sleep, hydration, steps and wellness.</p>
      </div>

      {/* Stat Cards */}
      <div className="responsive-grid-4" style={{ marginBottom: "20px" }}>
        {[
          { label: "Sleep Last Night", value: todayLog?.sleep_hours ? `${todayLog.sleep_hours} hrs` : "—", sub: "Goal: 7-8 hrs", icon: "🌙", color: "#6366f1" },
          { label: "Steps Today", value: todayLog?.steps ? parseInt(todayLog.steps).toLocaleString("en-IN") : "—", sub: "Goal: 10,000", icon: "👟", color: "#10b981" },
          { label: "Water Intake", value: `${waterCount}/${waterGoal}`, sub: "glasses today", icon: "💧", color: "#3b82f6" },
          { label: "Heart Rate", value: todayLog?.heart_rate ? `${todayLog.heart_rate} bpm` : "—", sub: "Resting", icon: "❤️", color: "#f59e0b" },
        ].map(({ label, value, sub, icon, color }) => (
          <div key={label} style={card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <p style={{ margin: 0, fontSize: "13px", color: muted }}>{label}</p>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{icon}</div>
            </div>
            <p style={{ margin: "0 0 4px", fontSize: "28px", fontWeight: "700", color: text }}>{value}</p>
            <p style={{ margin: 0, fontSize: "13px", color: muted }}>{sub}</p>
          </div>
        ))}
      </div>

      <div className="responsive-grid-2" style={{ marginBottom: "20px" }}>
        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600", color: text }}>Sleep This Week</h3>
          {sleepData.length === 0 ? (
            <p style={{ fontSize: "15px", color: muted }}>No data yet.</p>
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
          <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600", color: text }}>Daily Steps</h3>
          {stepsData.length === 0 ? (
            <p style={{ fontSize: "15px", color: muted }}>No data yet.</p>
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

      <div className="responsive-grid-2" style={{ marginBottom: "20px" }}>
        {/* Water Tracker */}
        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600", color: text }}>💧 Water Intake</h3>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            {Array.from({ length: waterGoal }).map((_, i) => (
              <div key={i} onClick={() => handleWater(i + 1)} style={{ width: "44px", height: "44px", borderRadius: "12px", cursor: "pointer", background: i < waterCount ? "#3b82f6" : dark ? "#2d2d44" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>💧</div>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: "15px", color: muted }}>
            {waterCount} of {waterGoal} glasses · {Math.max(0, waterGoal - waterCount)} more to go!
          </p>
          {saving && <p style={{ fontSize: "13px", color: muted, marginTop: "8px" }}>Saving...</p>}
        </div>

        {/* Habits */}
        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600", color: text }}>Today's Habits</h3>
          {Object.entries(HABIT_LABELS).map(([key, { label, icon }]) => (
            <div key={key} onClick={() => handleHabit(key)} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", padding: "10px 0", borderBottom: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}` }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: habits[key] ? "#10b98120" : dark ? "#2d2d44" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{icon}</div>
              <span style={{ flex: 1, fontSize: "15px", color: habits[key] ? text : muted, fontWeight: habits[key] ? "500" : "400" }}>{label}</span>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: habits[key] ? "#10b981" : dark ? "#2d2d44" : "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "white" }}>
                {habits[key] ? "✓" : ""}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CYCLE TRACKER (females only) ─────────────────────────────── */}
      {isFemale && (
        <div style={{ marginTop: "8px" }}>

          {/* Section header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "700", color: "#ec4899" }}>🌸 Cycle Tracker</h3>
              <p style={{ margin: 0, fontSize: "14px", color: muted }}>Track your menstrual cycle, symptoms and predictions.</p>
            </div>
            <button
              onClick={() => setShowCycleForm(!showCycleForm)}
              style={{ padding: "10px 20px", borderRadius: "12px", border: "none", background: "#ec4899", color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
            >+ Log Period</button>
          </div>

          {/* PMS Alert */}
          {cyclePrediction?.pms_alert && (
            <div style={{ marginBottom: "16px", padding: "16px 20px", borderRadius: "14px", background: "#fdf2f8", border: "1.5px solid #f9a8d4", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "24px" }}>⚠️</span>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "700", color: "#be185d" }}>PMS Alert</p>
                <p style={{ margin: 0, fontSize: "13px", color: "#9d174d" }}>
                  Your next period is in {cyclePrediction.days_until_next} day{cyclePrediction.days_until_next !== 1 ? "s" : ""}. Take it easy! 💕
                </p>
              </div>
            </div>
          )}

          {/* Prediction cards */}
          {cyclePrediction && (
            <div className="responsive-grid-4" style={{ marginBottom: "20px" }}>
              {[
                {
                  label: "Next Period",
                  value: cyclePrediction.next_period
                    ? new Date(cyclePrediction.next_period).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                    : "—",
                  sub: cyclePrediction.days_until_next != null ? `in ${cyclePrediction.days_until_next} days` : "Log 2+ periods to predict",
                  icon: "🩸", color: "#ec4899",
                },
                {
                  label: "Fertile Window",
                  value: cyclePrediction.fertile_window_start
                    ? `${new Date(cyclePrediction.fertile_window_start).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${new Date(cyclePrediction.fertile_window_end).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                    : "—",
                  sub: "Estimated fertile days",
                  icon: "🌿", color: "#10b981",
                },
                {
                  label: "Ovulation",
                  value: cyclePrediction.ovulation_date
                    ? new Date(cyclePrediction.ovulation_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                    : "—",
                  sub: "Estimated date",
                  icon: "🥚", color: "#f59e0b",
                },
                {
                  label: "Avg Cycle Length",
                  value: `${cyclePrediction.cycle_length} days`,
                  sub: cycleHistory.length < 2 ? "Based on average (need more data)" : `Based on last ${Math.min(3, cycleHistory.length - 1)} cycles`,
                  icon: "📅", color: "#8b5cf6",
                },
              ].map(({ label, value, sub, icon, color }) => (
                <div key={label} style={{ ...card, borderColor: dark ? "#2d2d44" : color + "30" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <p style={{ margin: 0, fontSize: "13px", color: muted }}>{label}</p>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{icon}</div>
                  </div>
                  <p style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "700", color: text }}>{value}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: muted }}>{sub}</p>
                </div>
              ))}
            </div>
          )}

          {/* Log Period Form */}
          {showCycleForm && (
            <div style={{ ...card, marginBottom: "20px", background: dark ? "#1a1a2e" : "#fdf2f8", border: `1.5px solid ${dark ? "#2d2d44" : "#f9a8d4"}` }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "700", color: "#ec4899" }}>Log Period</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ fontSize: "13px", color: muted, display: "block", marginBottom: "6px", fontWeight: "600" }}>Start Date *</label>
                  <input type="date" value={cycleForm.start_date} onChange={e => setCycleForm(p => ({ ...p, start_date: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: "13px", color: muted, display: "block", marginBottom: "6px", fontWeight: "600" }}>End Date</label>
                  <input type="date" value={cycleForm.end_date} onChange={e => setCycleForm(p => ({ ...p, end_date: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: "13px", color: muted, display: "block", marginBottom: "6px", fontWeight: "600" }}>Flow</label>
                  <select value={cycleForm.flow} onChange={e => setCycleForm(p => ({ ...p, flow: e.target.value }))} style={inputStyle}>
                    <option value="light">Light</option>
                    <option value="medium">Medium</option>
                    <option value="heavy">Heavy</option>
                  </select>
                </div>
              </div>

              <label style={{ fontSize: "13px", color: muted, display: "block", marginBottom: "10px", fontWeight: "600" }}>Symptoms</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                {SYMPTOMS.map((s) => {
                  const selected = cycleForm.symptoms.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSymptom(s)}
                      style={{
                        padding: "6px 14px", borderRadius: "20px", fontSize: "13px", cursor: "pointer",
                        border: `1.5px solid ${selected ? "#ec4899" : dark ? "#2d2d44" : "#e5e7eb"}`,
                        background: selected ? "#fdf2f8" : dark ? "#0f0f1a" : "#f9fafb",
                        color: selected ? "#ec4899" : muted, fontWeight: selected ? "600" : "400",
                      }}
                    >{s}</button>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleLogPeriod}
                  disabled={cycleLogging || !cycleForm.start_date}
                  style={{ padding: "10px 24px", borderRadius: "10px", border: "none", background: cycleLogging ? "#f9a8d4" : "#ec4899", color: "white", fontSize: "14px", fontWeight: "600", cursor: cycleLogging ? "not-allowed" : "pointer" }}
                >{cycleLogging ? "Saving..." : "Save"}</button>
                <button
                  onClick={() => setShowCycleForm(false)}
                  style={{ padding: "10px 20px", borderRadius: "10px", border: `1px solid ${dark ? "#2d2d44" : "#e5e7eb"}`, background: "transparent", color: muted, fontSize: "14px", cursor: "pointer" }}
                >Cancel</button>
              </div>
            </div>
          )}

          {/* Cycle History */}
          <div style={card}>
            <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600", color: text }}>🩸 Cycle History</h3>
            {cycleHistory.length === 0 ? (
              <p style={{ fontSize: "14px", color: muted }}>No periods logged yet. Tap "+ Log Period" to start tracking.</p>
            ) : (
              cycleHistory.slice(0, 6).map((entry) => (
                <div key={entry.period_id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#fdf2f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🩸</div>
                    <div>
                      <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "600", color: text }}>
                        {new Date(entry.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {entry.end_date ? ` → ${new Date(entry.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : ""}
                      </p>
                      <p style={{ margin: 0, fontSize: "12px", color: muted }}>
                        Flow: {entry.flow}
                        {entry.symptoms?.length > 0 ? ` · ${entry.symptoms.join(", ")}` : ""}
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "20px", background: "#fdf2f8", color: "#ec4899", fontWeight: "600" }}>
                    {entry.flow}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
