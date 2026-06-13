import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
<<<<<<< HEAD
=======
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "./components/ThemeContext";
>>>>>>> 79cc0c3ff91fd5476a545358b46d3ecd2973771f

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ClerkProvider>
  </React.StrictMode>
);