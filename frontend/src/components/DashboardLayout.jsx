import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useTheme } from "./ThemeContext";
import { useResponsive } from "../hooks/useMediaQuery";

export default function DashboardLayout({ children }) {
    const { dark } = useTheme();
    const { isMobile, isTablet } = useResponsive();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            {/* Mobile overlay */}
            {isMobile && sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                        zIndex: 40
                    }}
                />
            )}

            {/* Sidebar */}
            <div style={{
                position: isMobile ? "fixed" : "relative",
                left: isMobile ? (sidebarOpen ? 0 : "-240px") : 0,
                top: 0, bottom: 0,
                zIndex: 50,
                transition: "left 0.3s ease",
                width: isMobile ? "240px" : isTablet ? "200px" : "220px",
                flexShrink: 0,
            }}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} showMenu={isMobile} />
                <main style={{
                    flex: 1, overflowY: "auto",
                    padding: isMobile ? "12px 12px" : isTablet ? "20px 20px" : "24px 28px",
                    background: dark ? "#0f0f1a" : "#f5f3ff"
                }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
