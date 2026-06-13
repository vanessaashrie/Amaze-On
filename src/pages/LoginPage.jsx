import {
  SignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";

import { Navigate } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50 flex items-center justify-center p-6">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">

        {/* LEFT SECTION */}
        <div className="w-1/2 p-12 flex flex-col justify-center bg-gradient-to-br from-green-50 to-purple-50">

          <div className="mb-8">
            <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-5xl">
              🌱
            </div>
          </div>

          <h1 className="text-5xl font-bold text-slate-800">
            Pocket Buddy
          </h1>

          <p className="mt-5 text-xl text-slate-600 leading-relaxed">
            Your AI Financial & Wellness Companion
          </p>

          <p className="mt-3 text-slate-500">
            Track your money, health, mood, goals and
            receive personalized guidance from your
            virtual best friend.
          </p>

          <div className="mt-10 space-y-5">

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center text-2xl">
                💰
              </div>
              <div>
                <h3 className="font-semibold text-slate-700">
                  Smart Expense Tracking
                </h3>
                <p className="text-sm text-slate-500">
                  Understand where your money goes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center text-2xl">
                ❤️
              </div>
              <div>
                <h3 className="font-semibold text-slate-700">
                  Health Monitoring
                </h3>
                <p className="text-sm text-slate-500">
                  Track sleep, wellness and habits.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center text-2xl">
                🧠
              </div>
              <div>
                <h3 className="font-semibold text-slate-700">
                  Burnout Detection
                </h3>
                <p className="text-sm text-slate-500">
                  Catch stress before it becomes serious.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <h3 className="font-semibold text-slate-700">
                  AI Best Friend
                </h3>
                <p className="text-sm text-slate-500">
                  Personalized support and recommendations.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-1/2 flex items-center justify-center p-8 bg-white">

          <SignedOut>
            <div className="w-full max-w-md">
              <SignIn
                routing="path"
                path="/"
                signUpUrl="/sign-up"
              />
            </div>
          </SignedOut>

          <SignedIn>
            <Navigate to="/onboarding" />
          </SignedIn>

        </div>

      </div>

    </div>
  );
}