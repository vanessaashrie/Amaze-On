import Sidebar from "./SideBar";
import TopBar from "./TopBar";
import { useTheme } from "./ThemeContext";

export default function DashboardLayout({ children }) {
    const { dark } = useTheme();
    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>  {/* changed minHeight to height */}
            <Sidebar />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <TopBar />
                <main style={{
                    flex: 1, overflowY: "auto", padding: "24px 28px",
                    background: dark ? "#0f0f1a" : "#f5f3ff"
                }}>
                    {children}
                </main>
            </div>
        </div>
    );
}