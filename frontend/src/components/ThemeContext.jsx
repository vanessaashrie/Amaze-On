import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);
  const toggle = () => setDark(d => !d);
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

export function useTheme() {
  return useContext(ThemeContext);
}