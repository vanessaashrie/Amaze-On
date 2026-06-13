import { useTheme } from "../components/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const monthlyData = [
  { month: "Jan", spent: 4200, saved: 800 },
  { month: "Feb", spent: 3800, saved: 1200 },
  { month: "Mar", spent: 5100, saved: 400 },
  { month: "Apr", spent: 4600, saved: 900 },
  { month: "May", spent: 6800, saved: 1500 },
];

const radarData = [
  { subject: "Finance", A: 70 },
  { subject: "Sleep", A: 55 },
  { subject: "Exercise", A: 60 },
  { subject: "Mood", A: 80 },
  { subject: "Goals", A: 65 },
  { subject: "Social", A: 75 },
];

export default function Reports() {
  const { dark } = useTheme();

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
        <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "700", color: text }}>📊 Reports</h2>
        <p style={{ margin: 0, fontSize: "13px", color: muted }}>Your monthly overview of finances, health and wellness.</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "20px" }}>
        {[
          { label: "Total Spent (May)", value: "₹6,800", change: "+12%", up: true, icon: "📤" },
          { label: "Total Saved (May)", value: "₹1,500", change: "+8%", up: true, icon: "💰" },
          { label: "Avg Sleep", value: "6.8 hrs", change: "-0.3hrs", up: false, icon: "🌙" },
          { label: "Mood Score", value: "7.2/10", change: "+0.5", up: true, icon: "😊" },
        ].map(({ label, value, change, up, icon }) => (
          <div key={label} style={card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <p style={{ margin: 0, fontSize: "12px", color: muted }}>{label}</p>
              <span style={{ fontSize: "18px" }}>{icon}</span>
            </div>
            <p style={{ margin: "0 0 6px", fontSize: "22px", fontWeight: "700", color: text }}>{value}</p>
            <p style={{ margin: 0, fontSize: "11px", color: up ? "#10b981" : "#ef4444" }}>{change} vs last month</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "20px" }}>
        {/* Spending vs Saving */}
        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>Spending vs Saving Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: dark ? "#1a1a2e" : "#fff", border: "none", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="spent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Spent" />
              <Bar dataKey="saved" fill="#10b981" radius={[4, 4, 0, 0]} name="Saved" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Wellness Radar */}
        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>Wellness Score</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={dark ? "#2d2d44" : "#e5e7eb"} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: muted }} />
              <Radar dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div style={card}>
        <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>🤖 AI Monthly Insights</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          {[
            { icon: "💰", title: "Spending Alert", msg: "You spent 28% more on food this month. Consider meal prepping to save ₹800+.", color: "#f97316" },
            { icon: "🌙", title: "Sleep Tip", msg: "Your average sleep dropped to 6.8hrs. Try setting a 10:30 PM bedtime reminder.", color: "#6366f1" },
            { icon: "🎯", title: "Goal Progress", msg: "You're 63% to your savings goal! At this rate you'll hit it in 3 weeks.", color: "#10b981" },
          ].map(({ icon, title, msg, color }) => (
            <div key={title} style={{ padding: "16px", borderRadius: "12px", background: color + "15", border: `1px solid ${color}30` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "18px" }}>{icon}</span>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: text }}>{title}</p>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: muted, lineHeight: "1.6" }}>{msg}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}