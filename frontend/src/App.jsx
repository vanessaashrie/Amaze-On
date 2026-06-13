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

// Requires sign-in — redirects to login if not authenticated
const Protected = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut><Navigate to="/" replace /></SignedOut>
  </>
);

// After sign-in: go to dashboard if onboarding done, else go to onboarding
function PostAuthRedirect() {
  const onboardingDone = localStorage.getItem("pocketBuddyUser");
  return <Navigate to={onboardingDone ? "/dashboard" : "/onboarding"} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public — redirect signed-in users away */}
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
          path="/sign-up"
          element={
            <>
              <SignedIn><PostAuthRedirect /></SignedIn>
              <SignedOut><SignUpPage /></SignedOut>
            </>
          }
        />

        {/* Onboarding — only for signed-in users who haven't completed it */}
        <Route
          path="/onboarding"
          element={<Protected><OnboardingPage /></Protected>}
        />

        {/* Protected app routes */}
        <Route path="/dashboard"    element={<Protected><Dashboard /></Protected>} />
        <Route path="/journal"      element={<Protected><Journal /></Protected>} />
        <Route path="/money"        element={<Protected><Money /></Protected>} />
        <Route path="/health"       element={<Protected><Health /></Protected>} />
        <Route path="/ai-companion" element={<Protected><AICompanion /></Protected>} />
        <Route path="/reports"      element={<Protected><Reports /></Protected>} />
        <Route path="/goals"        element={<Protected><Goals /></Protected>} />
        <Route path="/settings"     element={<Protected><Settings /></Protected>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
