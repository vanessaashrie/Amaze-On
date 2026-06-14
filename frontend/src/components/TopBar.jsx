// TopBar.jsx — Top navigation bar with greeting, theme toggle, and mobile menu button

// --- Imports ---
import { useTheme } from "./ThemeContext";
import { useUser } from "@clerk/clerk-react";
import { useResponsive } from "../hooks/useMediaQuery";

// --- Helpers ---
// Returns a time-based greeting string
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

// --- Component ---
export default function TopBar({ onMenuClick, showMenu }) {
  const { dark, toggle } = useTheme();
  const { user } = useUser();
  const { isMobile } = useResponsive();

  // --- Render ---
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: isMobile ? "12px 14px" : "16px 28px",
      background: dark ? "#1a1a2e" : "#ffffff",
      borderBottom: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
      position: "sticky", top: 0, zIndex: 10
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {showMenu && (
          <button onClick={onMenuClick} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "20px", padding: "4px", color: dark ? "#f1f5f9" : "#1f2937"
          }}>
            ☰
          </button>
        )}
        <div style={{ width: isMobile ? "32px" : "40px", height: isMobile ? "32px" : "40px", borderRadius: "50%", background: "#b8f5d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? "16px" : "20px" }}>🌱</div>
        <div>
          <h2 style={{ margin: 0, fontSize: isMobile ? "14px" : "18px", fontWeight: "700", color: dark ? "#f1f5f9" : "#1f2937" }}>
            {getGreeting()}, {user?.firstName || "Ayushi"}! 🔥
          </h2>
          {!isMobile && (
            <p style={{ margin: 0, fontSize: "14px", color: dark ? "#94a3b8" : "#6b7280" }}>
              Here's what's happening in your life today.
            </p>
          )}
        </div>
      </div>

      {/* Theme toggle button */}
      <button onClick={toggle} style={{
        padding: isMobile ? "6px 12px" : "8px 16px", borderRadius: "20px", border: "none", cursor: "pointer",
        background: dark ? "#2d2d44" : "#f5f3ff",
        color: dark ? "#f1f5f9" : "#7c3aed",
        fontSize: isMobile ? "13px" : "14px", fontWeight: "600"
      }}>
        {dark ? "☀️ Light" : "🌙 Dark"}
      </button>
    </div>
  );
}
