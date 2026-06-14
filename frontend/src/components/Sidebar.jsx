// Sidebar.jsx — Navigation sidebar with nav items, user profile, and sign-out menu

// --- Imports ---
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import { useUser, useClerk } from "@clerk/clerk-react";

// --- Constants ---
const navItems = [
  { icon: "/home.png", label: "Dashboard", path: "/dashboard" },
  { icon: "/journal.png", label: "Journal", path: "/journal" },
  { icon: "/money.png", label: "Money", path: "/money" },
  { icon: "/health.png", label: "Health", path: "/health" },
  { icon: "/star.png", label: "AI Companion", path: "/ai-companion" },
  { icon: "/reports.png", label: "Reports", path: "/reports" },
  { icon: "/goals.png", label: "Goals", path: "/goals" },
  { icon: "/settings.png", label: "Settings", path: "/settings" },
];

// --- Component ---
export default function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { dark } = useTheme();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem("pocketBuddyProfilePhoto") || "");
  const [showMenu, setShowMenu] = useState(false);

  // --- Handlers ---
  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  // --- Effects ---
  // Listen for photo updates from Settings
  useEffect(() => {
    const handleUpdate = () => {
      setProfilePhoto(localStorage.getItem("pocketBuddyProfilePhoto") || "");
    };
    window.addEventListener("profilePhotoUpdated", handleUpdate);
    return () => window.removeEventListener("profilePhotoUpdated", handleUpdate);
  }, []);

  // --- Styles ---
  const bg = dark ? "#1a1a2e" : "#ffffff";
  const border = dark ? "#2d2d44" : "#f3f4f6";
  const activeBg = dark ? "#2d2d44" : "#f5f3ff";
  const activeColor = "#7c3aed";
  const textColor = dark ? "#94a3b8" : "#6b7280";

  // --- Render ---
  return (
    <div style={{
      width: "100%", background: bg,
      borderRight: `1px solid ${border}`, display: "flex",
      flexDirection: "column", height: "100vh",
      padding: "24px 0"
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

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        {navItems.map(({ icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <div key={path} onClick={() => handleNav(path)} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 12px", borderRadius: "10px", cursor: "pointer",
              marginBottom: "4px",
              background: active ? activeBg : "transparent",
              color: active ? activeColor : textColor,
              fontWeight: active ? "600" : "400", fontSize: "16px",
              transition: "all 0.2s"
            }}>
              <img
                src={icon}
                alt={label}
                style={{
                  width: "26px", height: "26px", objectFit: "contain",
                  borderRadius: "6px",
                  opacity: active ? 1 : 0.75
                }}
              />
              {label}
            </div>
          );
        })}
      </nav>

      {/* User Profile & Sign Out */}
      <div style={{ padding: "16px 20px", borderTop: `1px solid ${border}`, position: "relative" }}>
        {/* Sign Out Popup */}
        {showMenu && (
          <div style={{
            position: "absolute", bottom: "72px", left: "12px", right: "12px",
            background: dark ? "#1a1a2e" : "#ffffff",
            border: `1px solid ${dark ? "#2d2d44" : "#e9d5ff"}`,
            borderRadius: "12px",
            padding: "6px",
            boxShadow: dark ? "0 4px 16px rgba(0,0,0,0.4)" : "0 4px 16px rgba(124,58,237,0.12)",
            zIndex: 100
          }}>
            <button
              onClick={() => signOut(() => navigate("/"))}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: "8px",
                border: "none", background: dark ? "#2d2d44" : "#f5f3ff",
                color: dark ? "#a78bfa" : "#7c3aed", fontSize: "14px", fontWeight: "600",
                cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", gap: "8px",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = dark ? "#3d3d5c" : "#ede9fe"}
              onMouseLeave={(e) => e.currentTarget.style.background = dark ? "#2d2d44" : "#f5f3ff"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={dark ? "#a78bfa" : "#7c3aed"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        )}

        <div
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
          onClick={() => setShowMenu(!showMenu)}
        >
          {(profilePhoto || user?.imageUrl) ? (
            <img
              key={profilePhoto || user?.imageUrl}
              src={profilePhoto || user?.imageUrl}
              alt={user?.firstName || "User"}
              style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", background: "#7c3aed" }}
            />
          ) : (
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "white", fontWeight: "600" }}>
              {user?.firstName?.[0] || "A"}
            </div>
          )}
          <div>
            <p style={{ margin: 0, fontSize: "12px", fontWeight: "600", color: dark ? "#f1f5f9" : "#1f2937" }}>{user?.firstName || "Ayushi"}</p>
            <p style={{ margin: 0, fontSize: "10px", color: textColor }}>Student</p>
          </div>
        </div>
      </div>
    </div>
  );
}
