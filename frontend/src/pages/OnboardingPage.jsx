import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function OnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();

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
      age: form.age,           // keep as string — DynamoDB Decimal issues with numbers
      phone: form.phone,
      gender: form.gender,
      status: form.status,
      friend_name: form.friendName,
      emergency_contact: form.emergencyContact,
      relationship: form.relationship,
      emergency_phone: form.emergencyPhone,
    };

    try {
      const res = await fetch(
        `${BACKEND_URL}/auth/onboarding`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to save profile");
      }

      localStorage.setItem(
        "pocketBuddyUser",
        JSON.stringify(payload)
      );

      navigate("/dashboard");

    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const input = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1.5px solid #e5e7eb",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    color: "#1f2937",
    background: "white",
  };

  const label = {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "6px",
    display: "block",
    fontWeight: "500",
  };

  const sectionTitle = {
    fontSize: "15px",
    fontWeight: "700",
    color: "#7c3aed",
    marginBottom: "16px",
    marginTop: "24px",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0eeff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "700px",
        background: "white",
        borderRadius: "24px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
        padding: "48px"
      }}>

        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px"
        }}>
          <button onClick={() => navigate("/")}
            style={{ background: "none", border: "none", fontSize: "20px" }}>
            ←
          </button>
          <div style={{ fontWeight: "700" }}>
            Pocket Buddy 💜
          </div>
        </div>

        <h1>Let's get to know you 🌱</h1>

        {/* Basic Info */}
        <p style={sectionTitle}>Basic Information</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

          <div>
            <label style={label}>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} style={input} />
          </div>

          <div>
            <label style={label}>Age</label>
            <input name="age" value={form.age} onChange={handleChange} style={input} />
          </div>

          <div>
            <label style={label}>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} style={input} />
          </div>

        </div>

        {/* More Info */}
        <p style={sectionTitle}>More About You</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

          <select name="gender" value={form.gender} onChange={handleChange} style={input}>
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <select name="status" value={form.status} onChange={handleChange} style={input}>
            <option value="">Status</option>
            <option>Student</option>
            <option>Working</option>
          </select>

        </div>

        {/* AI Friend */}
        <p style={sectionTitle}>AI Companion</p>

        <input
          name="friendName"
          value={form.friendName}
          onChange={handleChange}
          placeholder="Name your AI friend"
          style={input}
        />

        {/* Emergency */}
        <p style={sectionTitle}>Emergency Contact</p>

        <input
          name="emergencyContact"
          value={form.emergencyContact}
          onChange={handleChange}
          placeholder="Contact name"
          style={input}
        />

        <input
          name="relationship"
          value={form.relationship}
          onChange={handleChange}
          placeholder="Relationship"
          style={input}
        />

        <input
          name="emergencyPhone"
          value={form.emergencyPhone}
          onChange={handleChange}
          placeholder="Emergency phone"
          style={input}
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "24px",
            padding: "14px",
            background: loading ? "#a78bfa" : "#7c3aed",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Saving..." : "Continue →"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            {error}
          </p>
        )}

      </div>
    </div>
  );
}