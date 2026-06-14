import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../components/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import api from "../api";

const radarData = [
  { subject: "Finance",  A: 70 },
  { subject: "Sleep",    A: 55 },
  { subject: "Exercise", A: 60 },
  { subject: "Mood",     A: 80 },
  { subject: "Goals",    A: 65 },
  { subject: "Social",   A: 75 },
];

export default function Reports() {
  const { dark } = useTheme();
  const { user } = useUser();

  const [transactions, setTransactions] = useState([]);
  const [healthLogs, setHealthLogs]     = useState([]);
  const [goals, setGoals]               = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    api.get(`/money/${user.id}`).then(r => setTransactions(r.data.transactions || [])).catch(() => {});
    api.get(`/health/${user.id}`).then(r => setHealthLogs(r.data.logs || [])).catch(() => {});
    api.get(`/goals/${user.id}`).then(r => setGoals(r.data.goals || [])).catch(() => {});
  }, [user?.id]);

  // ── Derived values ────────────────────────────────────────────────
  const totalSpent = transactions
    .filter(t => t.type === "expense")
    .reduce((s, t) => s + parseFloat(t.amount || 0), 0);

  const totalSaved = Math.max(0,
    transactions.filter(t => t.type === "income").reduce((s, t) => s + parseFloat(t.amount || 0), 0) - totalSpent
  );

  const avgSleep = healthLogs.length
    ? (healthLogs.reduce((s, l) => s + parseFloat(l.sleep_hours || 0), 0) / healthLogs.length).toFixed(1)
    : "--";

  const goalProgress = goals.length
    ? Math.round(goals.reduce((s, g) => s + (parseFloat(g.current || 0) / parseFloat(g.target || 1)) * 100, 0) / goals.length)
    : 0;

  // ── Monthly chart data ────────────────────────────────────────────
  const monthlyData = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (4 - i));
    const month    = d.toLocaleString("en-IN", { month: "short" });
    const monthStr = d.toISOString().slice(0, 7);
    const spent = transactions.filter(t => t.type === "expense" && t.date?.startsWith(monthStr)).reduce((s, t) => s + parseFloat(t.amount || 0), 0);
    const saved = transactions.filter(t => t.type === "income"  && t.date?.startsWith(monthStr)).reduce((s, t) => s + parseFloat(t.amount || 0), 0);
    return { month, spent, saved };
  });

  // ── AI insights from real data ────────────────────────────────────
  const insights = [
    {
      icon: "💰", title: "Spending Summary", color: "#f97316",
      msg: `You've spent ₹${totalSpent.toLocaleString("en-IN")} total. ${totalSpent > 5000 ? "Consider cutting back." : "Great job keeping spending low!"}`,
    },
    {
      icon: "🌙", title: "Sleep Analysis", color: "#6366f1",
      msg: `Your average sleep is ${avgSleep} hours. ${parseFloat(avgSleep) < 7 ? "Try to get at least 7 hours." : "Great sleep habits!"}`,
    },
    {
      icon: "🎯", title: "Goal Progress", color: "#10b981",
      msg: `You are ${goalProgress}% through your goals. ${goalProgress > 50 ? "Keep it up!" : "Push harder to reach your targets!"}`,
    },
  ];

  // ── Styles ────────────────────────────────────────────────────────
  const card = {
    background: dark ? "#1a1a2e" : "#ffffff",
    borderRadius: "16px", padding: "24px",
    border: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
  };
  const text  = dark ? "#f1f5f9" : "#1f2937";
  const muted = dark ? "#94a3b8" : "#6b7280";

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: "700", color: text, display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/reports.png" alt="reports" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
          Reports
        </h2>
        <p style={{ margin: 0, fontSize: "15px", color: muted }}>Your overview of finances, health and wellness.</p>
      </div>

      {/* Summary Cards */}
      <div className="responsive-grid-4" style={{ marginBottom: "20px" }}>
        {[
          { label: "Total Spent",   value: `₹${totalSpent.toLocaleString("en-IN")}`, sub: `${transactions.filter(t => t.type === "expense").length} expenses`,  icon: "📤", color: "#ef4444" },
          { label: "Total Saved",   value: `₹${totalSaved.toLocaleString("en-IN")}`, sub: "income minus expenses",                                              icon: "💰", color: "#10b981" },
          { label: "Avg Sleep",     value: `${avgSleep} hrs`,                         sub: `across ${healthLogs.length} logged days`,                            icon: "🌙", color: "#6366f1" },
          { label: "Goal Progress", value: `${goalProgress}%`,                        sub: `${goals.filter(g => g.is_completed).length}/${goals.length} done`,   icon: "🎯", color: "#7c3aed" },
        ].map(({ label, value, sub, icon, color }) => (
          <div key={label} style={card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <p style={{ margin: 0, fontSize: "13px", color: muted }}>{label}</p>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{icon}</div>
            </div>
            <p style={{ margin: "0 0 6px", fontSize: "26px", fontWeight: "700", color: text }}>{value}</p>
            <p style={{ margin: 0, fontSize: "13px", color: muted }}>{sub}</p>
          </div>
        ))}
      </div>

      <div className="responsive-grid-2-1" style={{ marginBottom: "20px" }}>

        {/* Monthly chart */}
        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600", color: text }}>Spending vs Income (Last 5 Months)</h3>
          {monthlyData.every(m => m.spent === 0 && m.saved === 0) ? (
            <p style={{ fontSize: "14px", color: muted }}>No data yet. Add transactions to see trends.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: muted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: dark ? "#1a1a2e" : "#fff", border: "none", borderRadius: "8px", fontSize: "12px" }} formatter={v => `₹${v.toLocaleString("en-IN")}`} />
                <Bar dataKey="spent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Spent" />
                <Bar dataKey="saved" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Wellness radar */}
        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600", color: text }}>Wellness Score</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={dark ? "#2d2d44" : "#e5e7eb"} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: muted }} />
              <Radar dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div style={card}>
        <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600", color: text }}>🤖 Insights</h3>
        <div className="responsive-grid-3">
          {insights.map(({ icon, title, msg, color }) => (
            <div key={title} style={{ padding: "16px", borderRadius: "12px", background: color + "15", border: `1px solid ${color}30` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "18px" }}>{icon}</span>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: "600", color: text }}>{title}</p>
              </div>
              <p style={{ margin: 0, fontSize: "13px", color: muted, lineHeight: "1.6" }}>{msg}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Transactions List */}
      <div style={{ ...card, marginTop: "20px" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600", color: text }}>Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p style={{ fontSize: "14px", color: muted }}>No transactions yet.</p>
        ) : (
          transactions.slice(0, 10).map((t) => (
            <div key={t.transaction_id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}` }}>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "500", color: text }}>{t.name}</p>
                <p style={{ margin: 0, fontSize: "12px", color: muted }}>{t.category} · {t.date ? new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}</p>
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600", color: t.type === "income" ? "#10b981" : "#ef4444" }}>
                {t.type === "income" ? "+" : "-"}₹{parseFloat(t.amount).toLocaleString("en-IN")}
              </span>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
