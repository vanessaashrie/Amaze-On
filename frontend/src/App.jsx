import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import Money from "./pages/Money";
import Health from "./pages/Health";
import AICompanion from "./pages/AICompanion";
import Reports from "./pages/Reports";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";

const Protected = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut><Navigate to="/" replace /></SignedOut>
  </>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* If already signed in, skip login → go to onboarding (or dashboard later) */}
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Navigate to="/onboarding" replace />
              </SignedIn>
              <SignedOut>
                <LoginPage />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/sign-up"
          element={
            <>
              <SignedIn>
                <Navigate to="/onboarding" replace />
              </SignedIn>
              <SignedOut>
                <SignUpPage />
              </SignedOut>
            </>
          }
        />

        <Route
          path="/onboarding"
          element={
            <>
              <SignedIn>
                <OnboardingPage />
              </SignedIn>
              <SignedOut>
                <Navigate to="/" replace />
              </SignedOut>
            </>
          }
        />

        <Route path="/" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/onboarding" element={<Protected><OnboardingPage /></Protected>} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/journal" element={<Protected><Journal /></Protected>} />
        <Route path="/money" element={<Protected><Money /></Protected>} />
        <Route path="/health" element={<Protected><Health /></Protected>} />
        <Route path="/ai-companion" element={<Protected><AICompanion /></Protected>} />
        <Route path="/reports" element={<Protected><Reports /></Protected>} />
        <Route path="/goals" element={<Protected><Goals /></Protected>} />
        <Route path="/settings" element={<Protected><Settings /></Protected>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;