import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../components/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";
import { useResponsive } from "../hooks/useMediaQuery";
import api from "../api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";

const CATEGORY_COLORS = {
  Food: "#f97316",
  Transport: "#3b82f6",
  Shopping: "#ec4899",
  Education: "#8b5cf6",
  Entertainment: "#10b981",
  Others: "#6b7280",
};

export default function Money() {
  const { dark } = useTheme();
  const { user } = useUser();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", amount: "", category: "Food", type: "expense" });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isMobile } = useResponsive();

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
    color: text, fontSize: "13px", outline: "none", boxSizing: "border-box",
  };

  useEffect(() => {
    if (!user?.id) return;
    api.get(`/money/${user.id}`)
      .then((res) => setTransactions(res.data.transactions || []))
      .catch((err) => console.error("Failed to fetch transactions:", err));
  }, [user?.id]);

  const totalSpent = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const pieData = Object.entries(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount || 0);
        return acc;
      }, {})
  ).map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || "#6b7280" }));

  const handleSave = async () => {
    if (!form.name || !form.amount) return;
    setLoading(true);
    try {
      await api.post("/money/", {
        clerk_id: user.id,
        name: form.name,
        amount: form.amount.toString(),
        category: form.category,
        type: form.type,
      });

      const res = await api.get(`/money/${user.id}`);
      setTransactions(res.data.transactions || []);

      setForm({ name: "", amount: "", category: "Food", type: "expense" });
      setShowForm(false);
    } catch (err) {
      console.error("Failed to save transaction:", err);
      alert("Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "700", color: text, display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/money.png" alt="money" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
            Money Tracker
          </h2>
          <p style={{ margin: 0, fontSize: "13px", color: muted }}>Track your income, expenses and budget.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: "10px 20px", borderRadius: "12px", border: "none",
          background: "#7c3aed", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer",
        }}>+ Add Transaction</button>
      </div>

      {showForm && (
        <div style={{ ...card, marginBottom: "20px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>New Transaction</h3>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr 1fr auto", gap: "12px", alignItems: "end" }}>
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
            <button onClick={handleSave} disabled={loading} style={{
              padding: "10px 20px", borderRadius: "10px", border: "none",
              background: "#7c3aed", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer",
            }}>{loading ? "Saving..." : "Save"}</button>
          </div>
        </div>
      )}

      <div className="responsive-grid-4" style={{ marginBottom: "20px" }}>
        {[
          { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, icon: "📤", color: "#ef4444" },
          { label: "Total Income", value: `₹${totalIncome.toLocaleString("en-IN")}`, icon: "📥", color: "#10b981" },
          { label: "Net Balance", value: `₹${(totalIncome - totalSpent).toLocaleString("en-IN")}`, icon: "💚", color: "#3b82f6" },
          { label: "Transactions", value: transactions.length, icon: "🏦", color: "#7c3aed" },
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

      <div className="responsive-grid-2" style={{ marginBottom: "20px" }}>
        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>Spending Breakdown</h3>
          {pieData.length === 0 ? (
            <p style={{ fontSize: "13px", color: muted }}>No expenses yet.</p>
          ) : (
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
          )}
        </div>

        <div style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>Recent Activity</h3>
          {transactions.slice(0, 5).map((t) => (
            <div key={t.transaction_id} style={{
              display: "flex", justifyContent: "space-between",
              padding: "8px 0", borderBottom: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
            }}>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "500", color: text }}>{t.name}</p>
                <p style={{ margin: 0, fontSize: "11px", color: muted }}>{t.category}</p>
              </div>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: t.type === "expense" ? "#ef4444" : "#10b981" }}>
                {t.type === "expense" ? "-" : "+"}₹{t.amount}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "600", color: text }}>All Transactions</h3>
        {transactions.length === 0 && (
          <p style={{ fontSize: "13px", color: muted }}>No transactions yet.</p>
        )}
        {transactions.map((t) => (
          <div key={t.transaction_id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 0", borderBottom: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: dark ? "#2d2d44" : "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                💸
              </div>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "500", color: text }}>{t.name}</p>
                <p style={{ margin: 0, fontSize: "11px", color: muted }}>{t.category} · {new Date(t.date).toLocaleDateString("en-IN")}</p>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: t.type === "expense" ? "#ef4444" : "#10b981" }}>
              {t.type === "expense" ? "-" : "+"}₹{t.amount}
            </p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}