import { useTheme } from "../components/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const spendingData = [
  { day: "Mon", amount: 320 },
  { day: "Tue", amount: 480 },
  { day: "Wed", amount: 200 },
  { day: "Thu", amount: 590 },
  { day: "Fri", amount: 340 },
  { day: "Sat", amount: 700 },
  { day: "Sun", amount: 410 },
];

const categories = [
  { icon: "🍔", label: "Food", amount: "₹2,450", color: "#f97316" },
  { icon: "🚌", label: "Transportation", amount: "₹1,250", color: "#3b82f6" },
  { icon: "🛍️", label: "Shopping", amount: "₹1,080", color: "#ec4899" },
  { icon: "📚", label: "Education", amount: "₹980", color: "#8b5cf6" },
  { icon: "🎮", label: "Entertainment", amount: "₹620", color: "#10b981" },
  { icon: "📦", label: "Others", amount: "₹420", color: "#6b7280" },
];

export default function Dashboard() {
  const { dark } = useTheme();

  const card = {
    background: dark ? "#1a1a2e" : "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    border: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
  };

  const text = dark ? "#f1f5f9" : "#1f2937";
  const muted = dark ? "#94a3b8" : "#6b7280";

  return (
    <DashboardLayout>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "20px" }}>
        {[
          { label: "Budget Left", value: "₹2,150", sub: "of ₹3,000", icon: "💰", color: "#7c3aed" },
          { label: "Today's Spending", value: "₹850", sub: "↑ 12% vs yesterday", icon: "📈", color: "#f97316" },
          { label: "Stress Level", value: "Moderate", sub: "Based on journal", icon: "🧠", color: "#f59e0b" },
          { label: "Sleep", value: "6.5 hrs", sub: "Goal: 7-8 hrs", icon: "🌙", color: "#3b82f6" },
        ].map(({ label, value, sub, icon, color }) => (
          <div key={label} style={card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <p style={{ margin: 0, fontSize: "12px", color: muted, fontWeight: "500" }}>{label}</p>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{icon}</div>
            </div>
            <p style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: "700", color: text }}>{value}</p>
            <p style={{ margin: 0, fontSize: "11px", color: muted }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Spending Chart + AI Insight */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "20px" }}>

        {/* Chart */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: text }}>Top Spending Categories</h3>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#7c3aed", fontSize: "12px" }}>View All →</button>
          </div>
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            {categories.map(({ icon, label, amount, color }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{icon}</div>
                <p style={{ margin: 0, fontSize: "10px", color: muted }}>{label}</p>
                <p style={{ margin: 0, fontSize: "11px", fontWeight: "600", color: text }}>{amount}</p>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={spendingData}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: muted }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: dark ? "#1a1a2e" : "#fff", border: "none", borderRadius: "8px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="amount" stroke="#7c3aed" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insight */}
        <div style={{ ...card, background: dark ? "#1a1a2e" : "#faf5ff", border: `1px solid ${dark ? "#2d2d44" : "#e9d5ff"}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#b8f5d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🌱</div>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: text }}>AI Insight</p>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: "13px", color: muted, lineHeight: "1.6" }}>
            You spent 28% more on food this week. Want me to suggest ways to save?
          </p>
          <button style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "none", background: "#7c3aed", color: "white", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
            Tell me more →
          </button>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* Recent Transactions */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: text }}>Recent Transactions</h3>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#7c3aed", fontSize: "12px" }}>View All →</button>
          </div>
          {[
            { icon: "🛒", name: "Swiggy", time: "Today, 1:23 PM", amount: "-₹320", color: "#ef4444" },
            { icon: "📦", name: "Amazon", time: "Today, 11:05 AM", amount: "-₹1,249", color: "#ef4444" },
            { icon: "🚇", name: "Metro Card Recharge", time: "Yesterday, 6:40 PM", amount: "-₹200", color: "#ef4444" },
            { icon: "📚", name: "Coursera Course", time: "May 13, 2:15 PM", amount: "-₹1,399", color: "#ef4444" },
          ].map(({ icon, name, time, amount, color }) => (
            <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: dark ? "#2d2d44" : "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{icon}</div>
                <div>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: "500", color: text }}>{name}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: muted }}>{time}</p>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color }}>{amount}</p>
            </div>
          ))}
        </div>

        {/* Mood + Goals */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Mood */}
          <div style={card}>
            <h3 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "600", color: text }}>How are you feeling today?</h3>
            <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
              {[
                { emoji: "😁", label: "Great" },
                { emoji: "🙂", label: "Good" },
                { emoji: "😐", label: "Okay" },
                { emoji: "😞", label: "Bad" },
                { emoji: "😣", label: "Terrible" },
              ].map(({ emoji, label }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: dark ? "#2d2d44" : "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{emoji}</div>
                  <p style={{ margin: 0, fontSize: "10px", color: muted }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div style={card}>
            <h3 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: "600", color: text }}>Goals Progress</h3>
            {[
              { label: "Save ₹10,000", progress: 63, color: "#7c3aed" },
              { label: "Read 12 Books", progress: 58, color: "#f97316" },
              { label: "Workout 20 Days", progress: 60, color: "#10b981" },
            ].map(({ label, progress, color }) => (
              <div key={label} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <p style={{ margin: 0, fontSize: "12px", color: text }}>{label}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: muted }}>{progress}%</p>
                </div>
                <div style={{ height: "6px", borderRadius: "99px", background: dark ? "#2d2d44" : "#f3f4f6" }}>
                  <div style={{ height: "100%", width: `${progress}%`, borderRadius: "99px", background: color }} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </DashboardLayout>
  );
}