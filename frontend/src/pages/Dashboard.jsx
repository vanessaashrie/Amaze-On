import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../components/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getUserProfile } from "../api";

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
  const { user: clerkUser } = useUser();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------- FETCH PROFILE ----------------
  useEffect(() => {
    if (!clerkUser?.id) return;

    setLoading(true);

    getUserProfile(clerkUser.id)
      .then((data) => {
        setProfile(data);

        // single source of truth cache
        localStorage.setItem("userProfile", JSON.stringify(data));
      })
      .catch((err) => {
        console.warn("Profile fetch failed:", err.message);

        const cached = localStorage.getItem("userProfile");

        if (cached) {
          setProfile(JSON.parse(cached));
        } else {
          setError("Could not load profile");
        }
      })
      .finally(() => setLoading(false));
  }, [clerkUser?.id]);

  // ---------------- SAFE VALUES ----------------
  const displayName =
    profile?.name || clerkUser?.firstName || "there";

  const friendName =
    profile?.friend_name || "Buddy";

  // ---------------- STYLES ----------------
  const card = {
    background: dark ? "#1a1a2e" : "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    border: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
  };

  const text = dark ? "#f1f5f9" : "#1f2937";
  const muted = dark ? "#94a3b8" : "#6b7280";

  // ---------------- LOADING ----------------
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
        <h2 style={{ margin: 0, fontSize: "20px", color: text }}>
          Hey {displayName} 👋
        </h2>

        <p style={{ margin: 0, fontSize: "13px", color: muted }}>
          {friendName} is here — your life snapshot for today.
        </p>

        {error && (
          <p style={{ color: "#f59e0b", fontSize: "12px" }}>
            {error}
          </p>
        )}
      </div>

      {/* TOP CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {[
          { label: "Budget Left", value: "₹2,150", sub: "of ₹3,000", icon: "💰", color: "#7c3aed" },
          { label: "Today's Spending", value: "₹850", sub: "↑ 12% vs yesterday", icon: "📈", color: "#f97316" },
          { label: "Stress Level", value: "Moderate", sub: "Based on journal", icon: "🧠", color: "#f59e0b" },
          { label: "Sleep", value: "6.5 hrs", sub: "Goal: 7-8 hrs", icon: "🌙", color: "#3b82f6" },
        ].map((item) => (
          <div key={item.label} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ fontSize: "12px", color: muted }}>{item.label}</p>
              <span>{item.icon}</span>
            </div>

            <h3 style={{ margin: "8px 0", color: text }}>
              {item.value}
            </h3>

            <p style={{ fontSize: "11px", color: muted }}>
              {item.sub}
            </p>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div style={card}>
        <h3 style={{ color: text }}>Spending Trend</h3>

        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={spendingData}>
            <XAxis dataKey="day" stroke={muted} />
            <YAxis hide />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#7c3aed"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* TRANSACTIONS */}
      <div style={{ ...card, marginTop: "16px" }}>
        <h3 style={{ color: text }}>Recent Transactions</h3>

        {[
          { name: "Swiggy", amount: "-₹320" },
          { name: "Amazon", amount: "-₹1249" },
          { name: "Metro", amount: "-₹200" },
        ].map((t) => (
          <div
            key={t.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: `1px solid ${dark ? "#2d2d44" : "#eee"}`,
            }}
          >
            <span style={{ color: text }}>{t.name}</span>

            {/* FIXED: no undefined color */}
            <span style={{ color: "#ef4444" }}>
              {t.amount}
            </span>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}