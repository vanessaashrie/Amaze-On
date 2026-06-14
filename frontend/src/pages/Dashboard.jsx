import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../components/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api, { getUserProfile } from "../api";

export default function Dashboard() {
  const { dark } = useTheme();
  const { user: clerkUser } = useUser();

  const [profile, setProfile]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [transactions, setTransactions] = useState([]);
  const [healthLog, setHealthLog]       = useState(null);

  // ── Fetch all dashboard data ───────────────────────────────────────
  useEffect(() => {
    if (!clerkUser?.id) return;

    setLoading(true);

    // Profile
    getUserProfile(clerkUser.id)
      .then((data) => {
        setProfile(data);
        localStorage.setItem("userProfile", JSON.stringify(data));
      })
      .catch((err) => {
        console.warn("Profile fetch failed:", err.message);
        const cached = localStorage.getItem("userProfile");
        if (cached) setProfile(JSON.parse(cached));
        else setError("Could not load profile");
      })
      .finally(() => setLoading(false));

    // Transactions
    api.get(`/money/${clerkUser.id}`)
      .then(res => setTransactions(res.data.transactions || []))
      .catch(err => console.warn("Transactions fetch failed:", err));

    // Health log
    api.get(`/health/${clerkUser.id}/today`)
      .then(res => setHealthLog(res.data.log))
      .catch(err => console.warn("Health fetch failed:", err));

  }, [clerkUser?.id]);

  // ── Derived values from real data ─────────────────────────────────
  const todayStr = new Date().toISOString().split("T")[0];

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const todayExpenses = transactions
    .filter(t => t.type === "expense" && t.date?.startsWith(todayStr))
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  // Build spending trend from last 7 transactions for the chart
  const spendingData = transactions
    .filter(t => t.type === "expense")
    .slice(0, 7)
    .reverse()
    .map((t, i) => ({
      day: new Date(t.date).toLocaleDateString("en-IN", { weekday: "short" }),
      amount: parseFloat(t.amount || 0),
    }));

  // ── Styles ────────────────────────────────────────────────────────
  const card = {
    background: dark ? "#1a1a2e" : "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    border: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
  };
  const text  = dark ? "#f1f5f9" : "#1f2937";
  const muted = dark ? "#94a3b8" : "#6b7280";

  const displayName = profile?.name || clerkUser?.firstName || "there";
  const friendName  = profile?.friend_name || "Buddy";

  if (loading && !profile) {
    return (
      <DashboardLayout>
        <p style={{ color: muted }}>Loading dashboard...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      {/* HEADER */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "26px", color: text }}>Hey {displayName} 👋</h2>
        <p style={{ margin: 0, fontSize: "15px", color: muted }}>{friendName} is here — your life snapshot for today.</p>
        {error && <p style={{ color: "#f59e0b", fontSize: "13px" }}>{error}</p>}
      </div>

      {/* TOP CARDS — real data */}
      <div className="responsive-grid-4" style={{ marginBottom: "20px" }}>
        {[
          {
            label: "Budget Left",
            value: `₹${Math.max(0, 10000 - totalExpenses).toLocaleString("en-IN")}`,
            sub: "of ₹10,000 monthly",
            icon: "💰", color: "#7c3aed",
          },
          {
            label: "Today's Spending",
            value: `₹${todayExpenses.toLocaleString("en-IN")}`,
            sub: `${transactions.filter(t => t.date?.startsWith(todayStr)).length} transactions today`,
            icon: "📈", color: "#f97316",
          },
          {
            label: "Total Transactions",
            value: transactions.length,
            sub: `${transactions.filter(t => t.type === "income").length} income · ${transactions.filter(t => t.type === "expense").length} expenses`,
            icon: "🧾", color: "#f59e0b",
          },
          {
            label: "Sleep Last Night",
            value: healthLog?.sleep_hours ? `${healthLog.sleep_hours} hrs` : "— hrs",
            sub: "Goal: 7-8 hrs",
            icon: "🌙", color: "#3b82f6",
          },
        ].map((item) => (
          <div key={item.label} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <p style={{ margin: 0, fontSize: "13px", color: muted }}>{item.label}</p>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: item.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{item.icon}</div>
            </div>
            <h3 style={{ margin: "0 0 4px", color: text, fontSize: "26px", fontWeight: "700" }}>{item.value}</h3>
            <p style={{ margin: 0, fontSize: "13px", color: muted }}>{item.sub}</p>
          </div>
        ))}
      </div>

      {/* CHART — from real transactions */}
      <div style={{ ...card, marginBottom: "20px" }}>
        <h3 style={{ margin: "0 0 16px", color: text, fontSize: "18px", fontWeight: "600" }}>Spending Trend</h3>
        {spendingData.length === 0 ? (
          <p style={{ color: muted, fontSize: "14px" }}>No spending data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={spendingData}>
              <XAxis dataKey="day" stroke={muted} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: dark ? "#1a1a2e" : "#fff", border: "none", borderRadius: "8px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="amount" stroke="#7c3aed" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* RECENT TRANSACTIONS — real data */}
      <div style={card}>
        <h3 style={{ margin: "0 0 16px", color: text, fontSize: "18px", fontWeight: "600" }}>Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p style={{ color: muted, fontSize: "14px" }}>No transactions yet. Add some in Money Tracker!</p>
        ) : (
          transactions.slice(0, 5).map((t) => (
            <div
              key={t.transaction_id}
              style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${dark ? "#2d2d44" : "#eee"}` }}
            >
              <div>
                <span style={{ color: text, fontSize: "14px", fontWeight: "500" }}>{t.name}</span>
                <span style={{ color: muted, fontSize: "12px", marginLeft: "8px" }}>{t.category}</span>
              </div>
              <span style={{ color: t.type === "income" ? "#10b981" : "#ef4444", fontWeight: "600" }}>
                {t.type === "income" ? "+" : "-"}₹{parseFloat(t.amount).toLocaleString("en-IN")}
              </span>
            </div>
          ))
        )}
      </div>

    </DashboardLayout>
  );
}
