import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function OnboardingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name:"",age:"",email:"",phone:"",
    gender:"",status:"",friendName:"",
    emergencyContact:"",relationship:"",emergencyPhone:"",
  });

  const handleChange = (e) => setForm({...form,[e.target.name]:e.target.value});

  const handleSubmit = () => {
    const data = {clerkId:user?.id,email:user?.primaryEmailAddress?.emailAddress,...form};
    localStorage.setItem("pocketBuddyUser",JSON.stringify(data));
    navigate("/dashboard");
  };

  const input = {width:"100%",padding:"12px 16px 12px 40px",borderRadius:"10px",border:"1.5px solid #e5e7eb",fontSize:"14px",outline:"none",boxSizing:"border-box",color:"#1f2937",background:"white"};
  const label = {fontSize:"13px",color:"#6b7280",marginBottom:"6px",display:"block",fontWeight:"500"};
  const sectionTitle = {fontSize:"15px",fontWeight:"700",color:"#7c3aed",marginBottom:"16px",marginTop:"24px"};
  const iconWrap = {position:"relative"};
  const icon = {position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",fontSize:"15px",pointerEvents:"none"};

  return (
    <div style={{minHeight:"100vh",background:"#f0eeff",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <div style={{width:"100%",maxWidth:"700px",background:"white",borderRadius:"24px",boxShadow:"0 20px 60px rgba(0,0,0,0.08)",padding:"48px"}}>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"8px"}}>
          <button onClick={()=>navigate("/")} style={{background:"none",border:"none",cursor:"pointer",fontSize:"20px",color:"#7c3aed"}}>←</button>
          <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
            <span style={{fontWeight:"700",color:"#1f2937"}}>Pocket Buddy</span><span>💜</span>
          </div>
        </div>


        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <h1 style={{fontSize:"26px",fontWeight:"700",color:"#1f2937",margin:"0 0 6px"}}>Let's get to know you! 🌱</h1>
          <p style={{fontSize:"14px",color:"#6b7280",margin:0}}>Tell us a bit about yourself to personalize your experience</p>
        </div>

        {/* Basic Information */}
        <p style={sectionTitle}>Basic Information</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
          <div><label style={label}>Full Name</label><div style={iconWrap}><span style={icon}>👤</span><input name="name" placeholder="Enter your full name" value={form.name} onChange={handleChange} style={input}/></div></div>
          <div><label style={label}>Age</label><div style={iconWrap}><span style={icon}>📅</span><input name="age" placeholder="Enter your age" value={form.age} onChange={handleChange} style={input}/></div></div>
          <div><label style={label}>Email</label><div style={iconWrap}><span style={icon}>✉️</span><input name="email" placeholder="Enter your email" value={form.email} onChange={handleChange} style={input}/></div></div>
          <div><label style={label}>Contact Number</label><div style={iconWrap}><span style={icon}>📞</span><input name="phone" placeholder="Enter your contact number" value={form.phone} onChange={handleChange} style={input}/></div></div>
        </div>

        {/* More About You */}
        <p style={sectionTitle}>More About You</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
          <div><label style={label}>Gender</label><div style={iconWrap}><span style={icon}>👤</span>
            <select name="gender" value={form.gender} onChange={handleChange} style={input}>
              <option value="">Select your gender</option>
              <option>Male</option><option>Female</option><option>Non-binary</option><option>Prefer not to say</option>
            </select>
          </div></div>
          <div><label style={label}>Student / Working</label><div style={iconWrap}><span style={icon}>🎓</span>
            <select name="status" value={form.status} onChange={handleChange} style={input}>
              <option value="">Select your status</option>
              <option>Student</option><option>Working Professional</option><option>Both</option><option>Other</option>
            </select>
          </div></div>
        </div>

        {/* AI Companion */}
        <div style={{background:"#f5f3ff",borderRadius:"16px",padding:"20px",marginTop:"24px",display:"flex",alignItems:"center",gap:"16px"}}>
          <div style={{width:"50px",height:"50px",borderRadius:"50%",background:"#ede9fe",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px",flexShrink:0}}>🤖</div>
          <div style={{flex:1}}>
            <p style={{margin:"0 0 2px",fontWeight:"700",color:"#7c3aed",fontSize:"14px"}}>Name Your Virtual Bestfriend</p>
            <p style={{margin:"0 0 10px",fontSize:"12px",color:"#6b7280"}}>Give a name to your AI best friend. They'll be with you on your journey! 💕</p>
            <input name="friendName" placeholder="e.g. Buddy, Pixel, Nova..." value={form.friendName} onChange={handleChange} style={{...input,paddingLeft:"16px"}}/>
          </div>
        </div>

        {/* Emergency Contact */}
        <p style={sectionTitle}>Emergency Contact <span style={{color:"#9ca3af",fontWeight:"400",fontSize:"13px"}}>(For your safety)</span></p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
          <div><label style={label}>Contact Name</label><div style={iconWrap}><span style={icon}>👤</span><input name="emergencyContact" placeholder="Enter contact name" value={form.emergencyContact} onChange={handleChange} style={input}/></div></div>
          <div><label style={label}>Relationship</label><div style={iconWrap}><span style={icon}>👥</span><input name="relationship" placeholder="e.g. Mother, Father, Friend" value={form.relationship} onChange={handleChange} style={input}/></div></div>
          <div style={{gridColumn:"span 2"}}><label style={label}>Contact Number</label><div style={iconWrap}><span style={icon}>📞</span><input name="emergencyPhone" placeholder="Enter contact number" value={form.emergencyPhone} onChange={handleChange} style={input}/></div></div>
        </div>

        {/* Submit */}
        <button onClick={handleSubmit} style={{width:"100%",marginTop:"32px",padding:"16px",borderRadius:"12px",border:"none",background:"#7c3aed",color:"white",fontSize:"16px",fontWeight:"600",cursor:"pointer"}}>
          Next →
        </button>
        <p style={{textAlign:"center",fontSize:"12px",color:"#9ca3af",marginTop:"12px"}}>✅ We care about your privacy and data security</p>
      </div>
    </div>
  );
}