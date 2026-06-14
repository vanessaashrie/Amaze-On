import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function OnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    gender: "",
    status: "",
    friendName: "",
    emergencyContact: "",
    relationship: "",
    emergencyPhone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Auto-advance step dots based on filled fields
  useEffect(() => {
    const { name, age, phone, gender, status, friendName, emergencyContact, emergencyPhone } = form;
    if (emergencyContact && emergencyPhone) {
      setCurrentStep(4);
    } else if (friendName) {
      setCurrentStep(3);
    } else if (gender && status) {
      setCurrentStep(2);
    } else if (name || age || phone) {
      setCurrentStep(1);
    }
  }, [form]);

  const handleSubmit = async () => {
    if (!user?.id) {
      setError("User not authenticated. Please login again.");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      clerk_id: user.id,
      email: user.primaryEmailAddress?.emailAddress || "",
      name: form.name,
      age: form.age,
      phone: form.phone,
      gender: form.gender,
      status: form.status,
      friend_name: form.friendName,
      emergency_contact: form.emergencyContact,
      relationship: form.relationship,
      emergency_phone: form.emergencyPhone,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/auth/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to save profile");
      }

      localStorage.setItem("pocketBuddyUser", JSON.stringify(payload));
      navigate("/dashboard");

    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 16px 13px 42px",
    borderRadius: "12px",
    border: "1.5px solid #e5e7eb",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    color: "#1f2937",
    background: "#fafafa",
    transition: "border-color 0.2s",
  };

  const selectStyle = {
    ...inputStyle,
    padding: "13px 16px 13px 42px",
    appearance: "none",
    cursor: "pointer",
  };

  const labelStyle = {
    fontSize: "13px",
    color: "#374151",
    marginBottom: "6px",
    display: "block",
    fontWeight: "600",
  };

  const sectionTitle = {
    fontSize: "14px",
    fontWeight: "700",
    color: "#7c3aed",
    marginBottom: "16px",
    marginTop: "28px",
    letterSpacing: "0.02em",
  };

  const fieldWrap = { position: "relative" };

  const iconStyle = {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "15px",
    pointerEvents: "none",
  };

  const steps = ["Basic Info", "About You", "AI Friend", "Emergency"];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      boxSizing: "border-box",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "760px",
        background: "white",
        borderRadius: "24px",
        boxShadow: "0 24px 64px rgba(124,58,237,0.10)",
        overflow: "hidden",
      }}>

        {/* Top bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 32px",
          borderBottom: "1px solid #f3f4f6",
        }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "#f5f3ff",
              border: "none",
              borderRadius: "10px",
              width: "36px",
              height: "36px",
              fontSize: "18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7c3aed",
            }}
          >←</button>

          {/* Step indicators */}
          <div style={{ display: "flex", alignItems: "center", gap: "0px" }}>
            {steps.map((label, i) => {
              const stepNum = i + 1;
              const isCompleted = stepNum < currentStep;
              const isActive = stepNum === currentStep;
              return (
                <div key={stepNum} style={{ display: "flex", alignItems: "center" }}>
                  {/* Circle */}
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: isCompleted ? "#7c3aed" : isActive ? "#7c3aed" : "#f3f4f6",
                    color: isCompleted || isActive ? "white" : "#9ca3af",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: "700",
                    transition: "all 0.3s",
                    flexShrink: 0,
                  }}>
                    {isCompleted ? "✓" : stepNum}
                  </div>
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div style={{
                      width: "48px",
                      height: "2px",
                      background: isCompleted ? "#7c3aed" : "#e5e7eb",
                      transition: "background 0.3s",
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ fontWeight: "700", fontSize: "15px", color: "#1f2937" }}>
            Pocket Buddy 💜
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "36px 24px 40px" }}>

          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            <h1 style={{ margin: "0 0 8px", fontSize: "28px", fontWeight: "800", color: "#1f2937" }}>
              Let's get to know you! 🌱
            </h1>
            <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
              Tell us a bit about yourself to personalize your experience
            </p>
          </div>

          {/* Basic Information */}
          <p style={sectionTitle}>Basic Information</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <div style={fieldWrap}>
                <span style={iconStyle}>👤</span>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Age</label>
              <div style={fieldWrap}>
                <span style={iconStyle}>📅</span>
                <input name="age" value={form.age} onChange={handleChange} placeholder="Enter your age" style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Email</label>
              <div style={fieldWrap}>
                <span style={iconStyle}>✉️</span>
                <input
                  value={user?.primaryEmailAddress?.emailAddress || ""}
                  disabled
                  style={{ ...inputStyle, background: "#f3f4f6", color: "#9ca3af", cursor: "not-allowed" }}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Contact Number</label>
              <div style={fieldWrap}>
                <span style={iconStyle}>📞</span>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Enter your contact number" style={inputStyle} />
              </div>
            </div>
          </div>

          {/* More About You */}
          <p style={sectionTitle}>More About You</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Gender</label>
              <div style={{ ...fieldWrap, position: "relative" }}>
                <span style={iconStyle}>👤</span>
                <select name="gender" value={form.gender} onChange={handleChange} style={selectStyle}>
                  <option value="">Select your gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }}>▾</span>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Student / Working</label>
              <div style={{ ...fieldWrap, position: "relative" }}>
                <span style={iconStyle}>🎓</span>
                <select name="status" value={form.status} onChange={handleChange} style={selectStyle}>
                  <option value="">Select your status</option>
                  <option>Student</option>
                  <option>Working</option>
                </select>
                <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9ca3af" }}>▾</span>
              </div>
            </div>
          </div>

          {/* Name Your Virtual Bestfriend */}
          <p style={sectionTitle}>Name Your Virtual Bestfriend</p>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            background: "#faf5ff",
            border: "1.5px solid #e9d5ff",
            borderRadius: "16px",
            padding: "16px 20px",
          }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "50%",
              background: "#ede9fe",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "26px", flexShrink: 0,
            }}>🤖</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 2px", fontSize: "14px", fontWeight: "700", color: "#7c3aed" }}>
                Name Your Virtual Bestfriend
              </p>
              <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#9ca3af" }}>
                Give a name to your AI best friend. They'll be with you on your journey! 💕
              </p>
              <input
                name="friendName"
                value={form.friendName}
                onChange={handleChange}
                placeholder="e.g. Buddy, Pixel, Nova..."
                style={{ ...inputStyle, padding: "11px 14px", background: "white", margin: 0 }}
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <p style={sectionTitle}>
            Emergency Contact{" "}
            <span style={{ fontSize: "12px", fontWeight: "400", color: "#9ca3af" }}>(For your safety)</span>
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Contact Name</label>
              <div style={fieldWrap}>
                <span style={iconStyle}>👤</span>
                <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} placeholder="Enter contact name" style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Relationship</label>
              <div style={fieldWrap}>
                <span style={iconStyle}>🤝</span>
                <input name="relationship" value={form.relationship} onChange={handleChange} placeholder="e.g. Mother, Father, Friend" style={inputStyle} />
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Contact Number</label>
              <div style={fieldWrap}>
                <span style={iconStyle}>📞</span>
                <input name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} placeholder="Enter contact number" style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "32px",
              padding: "16px",
              background: loading ? "#a78bfa" : "linear-gradient(135deg, #7c3aed, #6d28d9)",
              color: "white",
              border: "none",
              borderRadius: "14px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "700",
              letterSpacing: "0.02em",
              boxShadow: "0 4px 16px rgba(124,58,237,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading ? "Saving..." : "Next →"}
          </button>

          <p style={{ textAlign: "center", marginTop: "14px", fontSize: "12px", color: "#9ca3af" }}>
            🔒 We care about your privacy and data security
          </p>

          {error && (
            <p style={{ color: "#ef4444", marginTop: "10px", textAlign: "center", fontSize: "13px" }}>
              {error}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}