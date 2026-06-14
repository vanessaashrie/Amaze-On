import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <>
      <style>{`
        .cl-formFieldInput {
          border: 1.5px solid #e5e7eb !important;
          border-radius: 10px !important;
          box-shadow: none !important;
          outline: none !important;
          font-size: 15px !important;
          padding: 13px 14px !important;
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
          padding: 13px !important;
          font-size: 15px !important;
        }
        .cl-dividerLine {
          background: #f3f4f6 !important;
        }
        .cl-dividerText {
          font-size: 14px !important;
        }
        .cl-formFieldLabel {
          font-size: 14px !important;
        }
        .cl-formButtonPrimary {
          padding: 14px !important;
          font-size: 15px !important;
        }
        .cl-footerActionText, .cl-footerActionLink {
          font-size: 14px !important;
        }
        .cl-main {
          padding-top: 0 !important;
          margin-top: 0 !important;
        }
        .cl-headerTitle, .cl-headerSubtitle, .cl-header {
          display: none !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .cl-socialButtons {
          margin-top: 0 !important;
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
          overflow: "hidden",
        }}>

          {/* LEFT — mascot image (hidden on mobile) */}
          <div className="hide-on-mobile" style={{ display: "flex", flex: "1 1 340px", minWidth: "300px" }}>
            <img
              src="/mascot.png"
              alt="Pocket Buddy"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "cover",
              }}
            />
          </div>

          {/* RIGHT — form evenly spread */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "stretch",
            background: "white",
            padding: "48px 32px",
            boxSizing: "border-box",
            gap: "24px",
            flex: "1 1 340px",
            minWidth: "300px",
          }}>

            {/* Heading */}
            <div style={{ textAlign: "center" }}>
              <h2 style={{
                fontSize: "36px",
                fontWeight: "800",
                color: "#1f2937",
                margin: "0 0 10px",
              }}>
                Create Account
              </h2>
              <p style={{
                fontSize: "15px",
                color: "#6b7280",
                lineHeight: "1.6",
                margin: 0,
              }}>
                Welcome! Please fill in the details to get started 🌱
              </p>
            </div>

            {/* Clerk form */}
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/"
              forceRedirectUrl="/onboarding"
              afterSignUpUrl="/onboarding"
              appearance={{
                variables: {
                  colorPrimary: "#7c3aed",
                  borderRadius: "10px",
                  fontSize: "15px",
                  colorBackground: "white",
                  colorInputBackground: "white",
                  spacingUnit: "16px",
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
                  headerTitle: { display: "none", height: "0", margin: "0", padding: "0" },
                  headerSubtitle: { display: "none", height: "0", margin: "0", padding: "0" },
                  header: { display: "none", height: "0", margin: "0", padding: "0" },
                  socialButtonsBlockButton: {
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "10px",
                    fontSize: "15px",
                    background: "white",
                    boxShadow: "none",
                    padding: "13px",
                  },
                  formButtonPrimary: {
                    background: "#7c3aed",
                    borderRadius: "10px",
                    fontSize: "15px",
                    padding: "14px",
                    boxShadow: "none",
                  },
                  footerActionLink: { color: "#7c3aed", fontSize: "14px" },
                  formFieldInput: {
                    fontSize: "15px",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "13px 14px",
                    boxShadow: "none",
                    outline: "none",
                  },
                  formFieldLabel: {
                    fontSize: "14px",
                    color: "#374151",
                  },
                  dividerLine: { background: "#f3f4f6" },
                  dividerText: { color: "#9ca3af", fontSize: "14px" },
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
                  main: { padding: "0", marginTop: "0" },
                  form: { gap: "16px" },
                  page: { background: "transparent" },
                  navbar: { display: "none" },
                  navbarButtons: { display: "none" },
                }
              }}
            />

          </div>

        </div>
      </div>
    </>
  );
}