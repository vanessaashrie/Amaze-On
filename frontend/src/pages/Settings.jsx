// Settings.jsx — User settings for profile, budget, appearance, and notifications

// --- Imports ---
import { useState, useRef } from "react";
import { useTheme } from "../components/ThemeContext";
import DashboardLayout from "../components/DashboardLayout";
import { useUser } from "@clerk/clerk-react";

// --- Component ---
export default function Settings() {
  const { dark, toggle } = useTheme();
  const { user } = useUser();
  const savedUser = JSON.parse(localStorage.getItem("pocketBuddyUser") || "{}");

  // --- State ---
  const [notifications, setNotifications] = useState({ daily: true, budget: true, health: false, journal: true });
  const [budget, setBudget] = useState(localStorage.getItem("pocketBuddyBudget") || "10000");
  const [uploading, setUploading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem("pocketBuddyProfilePhoto") || "");
  const fileInputRef = useRef(null);

  // --- Handlers ---

  // Save monthly budget to localStorage
  const saveBudget = () => {
    localStorage.setItem("pocketBuddyBudget", budget);
    alert("Budget saved! ₹" + Number(budget).toLocaleString("en-IN"));
  };

  // Upload profile photo via Clerk and/or localStorage fallback
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // Try Clerk upload first
      if (user?.setProfileImage) {
        await user.setProfileImage({ file });
        await user.reload();
      }
    } catch (err) {
      console.error("Clerk upload failed:", err);
    }
    // Always save to localStorage as fallback
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("pocketBuddyProfilePhoto", reader.result);
      setProfilePhoto(reader.result);
      window.dispatchEvent(new Event("profilePhotoUpdated"));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // --- Styles ---
  const card = {
    background: dark ? "#1a1a2e" : "#ffffff",
    borderRadius: "16px", padding: "24px",
    border: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}`,
    marginBottom: "20px"
  };
  const text = dark ? "#f1f5f9" : "#1f2937";
  const muted = dark ? "#94a3b8" : "#6b7280";
  const inputStyle = {
    padding: "10px 14px", borderRadius: "10px",
    border: `1.5px solid ${dark ? "#2d2d44" : "#e5e7eb"}`,
    background: dark ? "#0f0f1a" : "#f9fafb",
    color: text, fontSize: "15px", outline: "none"
  };

  // --- Sub-components ---
  // Toggle switch for settings options
  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{
      width: "44px", height: "24px", borderRadius: "12px",
      background: on ? "#7c3aed" : dark ? "#2d2d44" : "#e5e7eb",
      cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0
    }}>
      <div style={{
        width: "18px", height: "18px", borderRadius: "50%", background: "white",
        position: "absolute", top: "3px", left: on ? "23px" : "3px",
        transition: "left 0.3s"
      }} />
    </div>
  );

  // --- Render ---
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: "700", color: text, display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/settings.png" alt="settings" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
          Settings
        </h2>
        <p style={{ margin: 0, fontSize: "15px", color: muted }}>Manage your account, preferences and notifications.</p>
      </div>

      <div className="responsive-grid-2">
        <div>
          {/* Profile Card */}
          <div style={card}>
            <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600", color: text }}>👤 Profile</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <div style={{ position: "relative", cursor: "pointer" }} onClick={() => fileInputRef.current?.click()}>
                {(profilePhoto || user?.imageUrl) ? (
                  <img
                    key={profilePhoto || user?.imageUrl}
                    src={profilePhoto || user?.imageUrl}
                    alt={user?.firstName || "User"}
                    style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", background: "#7c3aed" }}
                  />
                ) : (
                  <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", color: "white", fontWeight: "700" }}>
                    {user?.firstName?.[0] || "A"}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: "none" }}
                />
              </div>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "18px", fontWeight: "600", color: text }}>{user?.firstName} {user?.lastName}</p>
                <p style={{ margin: 0, fontSize: "14px", color: muted }}>{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { label: "AI Friend Name", value: savedUser.friend_name || "Nova" },
                { label: "College", value: savedUser.college || "Not set" },
                { label: "Phone", value: savedUser.phone || "Not set" },
                { label: "Status", value: savedUser.status || "Student" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ margin: "0 0 4px", fontSize: "13px", color: muted }}>{label}</p>
                  <p style={{ margin: 0, fontSize: "15px", color: text, fontWeight: "500" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Card */}
          <div style={card}>
            <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600", color: text }}>💰 Budget Settings</h3>
            <label style={{ fontSize: "14px", color: muted, display: "block", marginBottom: "8px" }}>Monthly Budget (₹)</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input value={budget} onChange={e => setBudget(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <button onClick={saveBudget} style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: "#7c3aed", color: "white", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Save</button>
            </div>
          </div>
        </div>

        <div>
          {/* Appearance Card */}
          <div style={card}>
            <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600", color: text }}>🎨 Appearance</h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: "15px", fontWeight: "500", color: text }}>Dark Mode</p>
                <p style={{ margin: 0, fontSize: "14px", color: muted }}>Switch between light and dark theme</p>
              </div>
              <Toggle on={dark} onToggle={toggle} />
            </div>
          </div>

          {/* Notifications Card */}
          <div style={card}>
            <h3 style={{ margin: "0 0 16px", fontSize: "18px", fontWeight: "600", color: text }}>🔔 Notifications</h3>
            {[
              { key: "daily", label: "Daily Summary", sub: "Get a daily recap every evening" },
              { key: "budget", label: "Budget Alerts", sub: "Alert when spending exceeds limit" },
              { key: "health", label: "Health Reminders", sub: "Water, sleep and exercise reminders" },
              { key: "journal", label: "Journal Reminder", sub: "Daily prompt to write your journal" },
            ].map(({ key, label, sub }) => (
              <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${dark ? "#2d2d44" : "#f3f4f6"}` }}>
                <div>
                  <p style={{ margin: "0 0 2px", fontSize: "15px", fontWeight: "500", color: text }}>{label}</p>
                  <p style={{ margin: 0, fontSize: "13px", color: muted }}>{sub}</p>
                </div>
                <Toggle on={notifications[key]} onToggle={() => setNotifications(n => ({ ...n, [key]: !n[key] }))} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
