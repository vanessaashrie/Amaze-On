import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import { useUser } from "@clerk/clerk-react";

const navItems = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard" },
  { icon: "📓", label: "Journal", path: "/journal" },
  { icon: "💰", label: "Money", path: "/money" },
  { icon: "❤️", label: "Health", path: "/health" },
  { icon: "🤖", label: "AI Companion", path: "/ai-companion" },
  { icon: "📊", label: "Reports", path: "/reports" },
  { icon: "🎯", label: "Goals", path: "/goals" },
  { icon: "⚙️", label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dark } = useTheme();
  const { user } = useUser();

  const bg = dark ? "#1a1a2e" : "#ffffff";
  const border = dark ? "#2d2d44" : "#f3f4f6";
  const activeBg = dark ? "#2d2d44" : "#f5f3ff";
  const activeColor = "#7c3aed";
  const textColor = dark ? "#94a3b8" : "#6b7280";

  return (
    <div style={{
      width: "200px", flexShrink: 0, background: bg,
      borderRight: `1px solid ${border}`, display: "flex",
      flexDirection: "column", height: "100vh",
      position: "sticky", top: 0, padding: "24px 0"
    }}>
      {/* Logo */}
      <div style={{ padding: "0 20px 24px", borderBottom: `1px solid ${border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🌱</div>
          <div>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: dark ? "#f1f5f9" : "#1f2937" }}>Pocket Buddy</p>
            <p style={{ margin: 0, fontSize: "10px", color: textColor }}>Light 🌙 Muddy</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        {navItems.map(({ icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <div key={path} onClick={() => navigate(path)} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", borderRadius: "10px", cursor: "pointer",
              marginBottom: "4px",
              background: active ? activeBg : "transparent",
              color: active ? activeColor : textColor,
              fontWeight: active ? "600" : "400", fontSize: "13px",
              transition: "all 0.2s"
            }}>
              <span style={{ fontSize: "16px" }}>{icon}</span>
              {label}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "16px 20px", borderTop: `1px solid ${border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "white", fontWeight: "600" }}>
            {user?.firstName?.[0] || "A"}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "12px", fontWeight: "600", color: dark ? "#f1f5f9" : "#1f2937" }}>{user?.firstName || "Ayushi"}</p>
            <p style={{ margin: 0, fontSize: "10px", color: textColor }}>Student</p>
          </div>
        </div>
      </div>
    </div>
  );
}