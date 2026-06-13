import { useState } from "react";
import { useTheme } from "../components/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";

const pieData = [
  { name: "Food", value: 2450, color: "#f97316" },
  { name: "Transport", value: 1250, color: "#3b82f6" },
  { name: "Shopping", value: 1080, color: "#ec4899" },
  { name: "Education", value: 980, color: "#8b5cf6" },
  { name: "Entertainment", value: 620, color: "#10b981" },
  { name: "Others", value: 420, color: "#6b7280" },
];

const lineData = [
  { month: "Jan", spent: 4200 },
  { month: "Feb", spent: 3800 },
  { month: "Mar", spent: 5100 },
  { month: "Apr", spent: 4600 },
  { month: "May", spent: 6800 },
];

const transactions = [
  { icon: "🛒", name: "Swiggy", category: "Food", date: "Today, 1:23 PM", amount: -320 },
  { icon: "📦", name: "Amazon", category: "Shopping", date: "Today, 11:05 AM", amount: -1249 },
  { icon: "🚇", name: "Metro Card", category: "Transport", date: "Yesterday", amount: -200 },
  { icon: "📚", name: "Coursera", category: "Education", date: "May 13", amount: -1399 },
  { icon: "🎮", name: "Netflix", category: "Entertainment", date: "May 12", amount: -499 },
  { icon: "☕", name: "Cafe Coffee Day", category: "Food", date: "May 11", amount: -180 },
];

export default function Money() {
  const { dark } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", amount: "", category: "Food", type: "expense" });

  const card = {
    background: dark ? "#1a1a2e" : "#ffffff",
    borderRadius: "16px",
    padding: "20px",
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

  return (
    <DashboardLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "700", color: text }}>💰 Money Tracker</h2>
          <p style={{ margin: 0, fontSize: "13px", color: muted }}>Track your income, expenses and budget.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: "10px 20px", borderRadius: "12px", border: "none",
          background: "#7c3aed", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer"
        }}>+ Add Transaction</button>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <div style={{ ...card, marginBottom: "20px", background: dark ? "#1a1a2e" : "#faf5ff", border: `1px solid ${dark ? "#2d2d44" : "#e9d5ff"}` }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>New Transaction</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "12px", alignItems: "end" }}>
            <div>
              <label style={{ fontSize: "12px", color: muted, display: "block", marginBottom: "6px" }}>Description</label>
              <input placeholder="e.g. Swiggy" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: muted, display: "block", marginBottom: "6px" }}>Amount (₹)</label>
              <input placeholder="0" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: muted, display: "block", marginBottom: "6px" }}>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                {["Food", "Transport", "Shopping", "Education", "Entertainment", "Others"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: muted, display: "block", marginBottom: "6px" }}>Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <button style={{
              padding: "10px 20px", borderRadius: "10px", border: "none",
              background: "#7c3aed", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer"
            }}>Save</button>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "20px" }}>
        {[
          { label: "Monthly Budget", value: "₹10,000", icon: "💼", color: "#7c3aed" },
          { label: "Total Spent", value: "₹6,800", icon: "📤", color: "#ef4444" },
          { label: "Remaining", value: "₹3,200", icon: "💚", color: "#10b981" },
          { label: "Saved This Month", value: "₹1,500", icon: "🏦", color: "#3b82f6" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} style={card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <p style={{ margin: 0, fontSize: "12px", color: muted }}>{label}</p>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{icon}</div>
            </div>
            <p style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: text }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

        {/* Pie Chart */}
        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>Spending Breakdown</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `₹${v}`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {pieData.map(({ name, value, color }) => (
                <div key={name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color }} />
                    <span style={{ fontSize: "12px", color: muted }}>{name}</span>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: text }}>₹{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>Monthly Spending Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={lineData}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: muted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: dark ? "#1a1a2e" : "#fff", border: "none", borderRadius: "8px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="spent" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: text }}>All Transactions</h3>
          <select style={{ ...inputStyle, width: "auto", padding: "6px 12px" }}>
            <option>All Categories</option>
            {["Food", "Transport", "Shopping", "Education", "Entertainment"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        {transactions.map(({ icon, name, category, date, amount }) => (
          <div key={name + date} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 0", borderBottom: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: dark ? "#2d2d44" : "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{icon}</div>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "500", color: text }}>{name}</p>
                <p style={{ margin: 0, fontSize: "11px", color: muted }}>{category} · {date}</p>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: amount < 0 ? "#ef4444" : "#10b981" }}>
              {amount < 0 ? "-" : "+"}₹{Math.abs(amount)}
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}