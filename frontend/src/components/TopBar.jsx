import { useTheme } from "./ThemeContext";
import { useUser } from "@clerk/clerk-react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function TopBar() {
  const { dark, toggle } = useTheme();
  const { user } = useUser();

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 28px",
      background: dark ? "#1a1a2e" : "#ffffff",
      borderBottom: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
      position: "sticky", top: 0, zIndex: 10
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#b8f5d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🌱</div>
        <div>
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: dark ? "#f1f5f9" : "#1f2937" }}>
            {getGreeting()}, {user?.firstName || "Ayushi"}! 🔥
          </h2>
          <p style={{ margin: 0, fontSize: "12px", color: dark ? "#94a3b8" : "#6b7280" }}>
            Here's what's happening in your life today.
          </p>
        </div>
      </div>

      <button onClick={toggle} style={{
        padding: "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer",
        background: dark ? "#2d2d44" : "#f5f3ff",
        color: dark ? "#f1f5f9" : "#7c3aed",
        fontSize: "13px", fontWeight: "600"
      }}>
        {dark ? "☀️ Light" : "🌙 Dark"}
      </button>
    </div>
  );
}