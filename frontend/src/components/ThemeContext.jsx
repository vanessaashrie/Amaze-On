// ThemeContext.jsx — Provides dark/light theme state and toggle to the entire app

// --- Imports ---
import { createContext, useContext, useState } from "react";

// --- Context ---
const ThemeContext = createContext();

// --- Provider Component ---
// Wraps the app with theme state (dark mode) persisted in localStorage
export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem("pocketBuddyDarkMode") === "true");
  const toggle = () => {
    setDark(d => {
      const next = !d;
      localStorage.setItem("pocketBuddyDarkMode", String(next));
      return next;
    });
  };

  // --- Render ---
  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      <div style={{
        background: dark ? "#0f0f1a" : "#f5f3ff",
        minHeight: "100vh",
        color: dark ? "#f1f5f9" : "#1f2937",
        transition: "all 0.3s"
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

// --- useTheme Hook ---
// Convenience hook to consume the theme context
export function useTheme() {
  return useContext(ThemeContext);
}
