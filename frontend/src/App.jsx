import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";

import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import SignUpPage from "./pages/SignUpPage";

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;