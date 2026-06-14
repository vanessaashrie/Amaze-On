import { SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function LoginPage() {
  return (
    <>
      <style>{`
        .cl-formFieldInput {
          border: 1.5px solid #e5e7eb !important;
          border-radius: 10px !important;
          box-shadow: none !important;
          outline: none !important;
          font-size: 14px !important;
          padding: 12px 14px !important;
        }
        .cl-formFieldInput:focus {
          border: 1.5px solid #7c3aed !important;
          box-shadow: none !important;
        }
        .cl-card {
          box-shadow: none !important;
          border: none !important;
          background: transparent !important;
        }
        .cl-cardBox {
          box-shadow: none !important;
          border: none !important;
          background: transparent !important;
        }
        .cl-footer {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .cl-footerPages {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
        }
        .cl-socialButtonsBlockButton {
          border: 1.5px solid #e5e7eb !important;
          border-radius: 10px !important;
          box-shadow: none !important;
        }
        .cl-dividerLine {
          background: #f3f4f6 !important;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#f0eeff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        boxSizing: "border-box"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "1100px",
          background: "white",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          display: "flex",
          flexWrap: "wrap",
          overflow: "hidden"
        }}>

          {/* LEFT — Login form */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
            boxSizing: "border-box",
            background: "white",
            padding: "40px 24px",
            flex: "1 1 340px",
            minWidth: "280px",
          }}>
            <div style={{ width: "100%", maxWidth: "360px" }}>

              {/* Heading — centered */}
              <div style={{ textAlign: "center", marginBottom: "32px" }}>
                <h2 style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  color: "#1f2937",
                  margin: "0 0 10px",
                }}>
                  Welcome Back!
                </h2>
                <p style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  lineHeight: "1.6",
                  margin: 0,
                }}>
                  Sign in to continue your journey with your AI best friend 💚
                </p>
              </div>

              <SignedOut>
                <div style={{ width: "100%" }}>
                  <SignIn
                    routing="hash"
                    signUpUrl="/sign-up"
                    afterSignInUrl="/dashboard"
                    appearance={{
                      variables: {
                        colorPrimary: "#7c3aed",
                        borderRadius: "10px",
                        fontSize: "14px",
                        colorBackground: "white",
                        colorInputBackground: "white",
                      },
                      elements: {
                        rootBox: { width: "100%" },
                        card: {
                          boxShadow: "none",
                          padding: "0",
                          margin: "0",
                          width: "100%",
                          border: "none",
                          background: "transparent",
                        },
                        cardBox: {
                          boxShadow: "none",
                          border: "none",
                          background: "transparent",
                        },
                        headerTitle: { display: "none" },
                        headerSubtitle: { display: "none" },
                        header: { display: "none" },
                        socialButtonsBlockButton: {
                          border: "1.5px solid #e5e7eb",
                          borderRadius: "10px",
                          fontSize: "14px",
                          background: "white",
                          boxShadow: "none",
                        },
                        formButtonPrimary: {
                          background: "#7c3aed",
                          borderRadius: "10px",
                          fontSize: "14px",
                          padding: "12px",
                          boxShadow: "none",
                        },
                        footerActionLink: { color: "#7c3aed" },
                        formFieldInput: {
                          fontSize: "14px",
                          border: "1.5px solid #e5e7eb",
                          borderRadius: "10px",
                          padding: "12px 14px",
                          boxShadow: "none",
                          outline: "none",
                        },
                        formFieldLabel: {
                          fontSize: "13px",
                          color: "#374151",
                        },
                        dividerLine: { background: "#f3f4f6" },
                        dividerText: { color: "#9ca3af", fontSize: "13px" },
                        footer: {
                          background: "transparent",
                          border: "none",
                          boxShadow: "none",
                        },
                        footerPages: {
                          background: "transparent",
                          boxShadow: "none",
                          border: "none",
                        },
                        main: { padding: "0" },
                        form: { gap: "16px" },
                        page: { background: "transparent" },
                        navbar: { display: "none" },
                        navbarButtons: { display: "none" },
                      }
                    }}
                  />
                </div>
              </SignedOut>

              <SignedIn><Navigate to="/onboarding" replace /></SignedIn>
            </div>
          </div>

          {/* RIGHT — Full image (hidden on small screens via CSS) */}
          <div className="hide-on-mobile" style={{ overflow: "hidden", display: "flex", flex: "1 1 340px", minWidth: "300px", maxHeight: "900px" }}>
            <img
              src="/mascot.png"
              alt="Pocket Buddy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center top",
                display: "block",
              }}
            />
          </div>

        </div>
      </div >
    </>
  );
}