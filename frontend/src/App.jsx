import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";

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

function PostAuthRedirect() {
  const { user } = useUser();

  // If onboarding already done — always go to dashboard
  const onboardingDone = localStorage.getItem("pocketBuddyUser");
  if (onboardingDone) {
    return <Navigate to="/dashboard" replace />;
  }

  // No localStorage — check if brand new user (signed up within 10 minutes)
  if (user) {
    const createdAt = new Date(user.createdAt).getTime();
    const now = Date.now();
    const isNewUser = now - createdAt < 10 * 60 * 1000; // 10 minutes

    if (isNewUser) {
      return <Navigate to="/onboarding" replace />;
    }

    // Existing user but no localStorage (cleared/new device) — go to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <>
              <SignedIn><PostAuthRedirect /></SignedIn>
              <SignedOut><LoginPage /></SignedOut>
            </>
          }
        />

        <Route
          path="/sign-up/*"
          element={
            <>
              <SignedIn><PostAuthRedirect /></SignedIn>
              <SignedOut><SignUpPage /></SignedOut>
            </>
          }
        />

        <Route
          path="/onboarding"
          element={<Protected><OnboardingPage /></Protected>}
        />

        <Route path="/dashboard"    element={<Protected><Dashboard /></Protected>} />
        <Route path="/journal"      element={<Protected><Journal /></Protected>} />
        <Route path="/money"        element={<Protected><Money /></Protected>} />
        <Route path="/health"       element={<Protected><Health /></Protected>} />
        <Route path="/ai-companion" element={<Protected><AICompanion /></Protected>} />
        <Route path="/reports"      element={<Protected><Reports /></Protected>} />
        <Route path="/goals"        element={<Protected><Goals /></Protected>} />
        <Route path="/settings"     element={<Protected><Settings /></Protected>} />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;