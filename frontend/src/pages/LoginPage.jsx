import { SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

function Mascot() {
  return (
    <svg width="160" height="180" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="90" cy="185" rx="50" ry="10" fill="#e0d7ff" opacity="0.5"/>
      <ellipse cx="90" cy="130" rx="65" ry="70" fill="#a8f0c6"/>
      <ellipse cx="90" cy="125" rx="60" ry="65" fill="#b8f5d0"/>
      <circle cx="68" cy="115" r="10" fill="white"/>
      <circle cx="112" cy="115" r="10" fill="white"/>
      <circle cx="71" cy="116" r="5" fill="#2d2d2d"/>
      <circle cx="115" cy="116" r="5" fill="#2d2d2d"/>
      <circle cx="73" cy="114" r="2" fill="white"/>
      <circle cx="117" cy="114" r="2" fill="white"/>
      <ellipse cx="62" cy="128" rx="8" ry="5" fill="#f9a8d4" opacity="0.7"/>
      <ellipse cx="118" cy="128" rx="8" ry="5" fill="#f9a8d4" opacity="0.7"/>
      <path d="M75 135 Q90 148 105 135" stroke="#2d2d2d" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="90" cy="72" rx="12" ry="18" fill="#4ade80"/>
      <path d="M90 72 Q80 55 70 60" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M90 72 Q100 50 112 58" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M35 140 Q20 130 25 115" stroke="#a8f0c6" strokeWidth="18" strokeLinecap="round" fill="none"/>
      <path d="M145 140 Q160 130 155 115" stroke="#a8f0c6" strokeWidth="18" strokeLinecap="round" fill="none"/>
      <circle cx="50" cy="75" r="18" fill="white" stroke="#e5e7eb" strokeWidth="1"/>
      <text x="50" y="81" textAnchor="middle" fontSize="16">❤️</text>
      <circle cx="138" cy="60" r="18" fill="#7c3aed" opacity="0.9"/>
      <circle cx="134" cy="58" r="4" fill="white" opacity="0.6"/>
      <circle cx="70" cy="170" r="12" fill="#fcd34d"/>
      <text x="70" y="175" textAnchor="middle" fontSize="12">₹</text>
      <rect x="100" y="155" width="28" height="20" rx="4" fill="#7c3aed" opacity="0.8"/>
      <rect x="104" y="159" width="6" height="12" rx="1" fill="white" opacity="0.8"/>
      <rect x="112" y="162" width="6" height="9" rx="1" fill="white" opacity="0.8"/>
      <rect x="120" y="165" width="6" height="6" rx="1" fill="white" opacity="0.8"/>
    </svg>
  );
}

export default function LoginPage() {
  return (
    <div style={{minHeight:"100vh",background:"#f0eeff",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",boxSizing:"border-box"}}>
      <div style={{width:"100%",maxWidth:"960px",background:"white",borderRadius:"24px",boxShadow:"0 20px 60px rgba(0,0,0,0.08)",display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:"580px",overflow:"hidden"}}>

        {/* LEFT — Login form */}
        <div style={{padding:"44px 40px",display:"flex",flexDirection:"column",justifyContent:"center",borderRight:"1px solid #f3f4f6",overflow:"hidden",minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"24px"}}>
            <span style={{fontSize:"17px",fontWeight:"700",color:"#1f2937"}}>Pocket Buddy</span>
            <span>💜</span>
          </div>
          <h2 style={{fontSize:"24px",fontWeight:"700",color:"#1f2937",margin:"0 0 8px"}}>Welcome Back!</h2>
          <p style={{fontSize:"13px",color:"#6b7280",marginBottom:"24px",lineHeight:"1.5"}}>
            Sign in to continue your journey with your AI best friend 💚
          </p>
          <SignedOut>
            <div style={{width:"100%",overflow:"hidden"}}>
              <SignIn
                routing="hash"
                signUpUrl="/sign-up"
                afterSignInUrl="/onboarding"
                appearance={{
                  variables:{colorPrimary:"#7c3aed",borderRadius:"10px",fontSize:"13px"},
                  elements:{
                    rootBox:{width:"100%"},
                    card:{boxShadow:"none",padding:"0",margin:"0",width:"100%"},
                    headerTitle:{display:"none"},
                    headerSubtitle:{display:"none"},
                    socialButtonsBlockButton:{border:"1.5px solid #e5e7eb",borderRadius:"10px",fontSize:"13px"},
                    formButtonPrimary:{background:"#7c3aed",borderRadius:"10px",fontSize:"13px"},
                    footerActionLink:{color:"#7c3aed"},
                    formFieldInput:{fontSize:"13px"},
                  }
                }}
              />
            </div>
          </SignedOut>
          <SignedIn><Navigate to="/onboarding" replace /></SignedIn>
        </div>

        {/* RIGHT — Mascot + features */}
        <div style={{background:"linear-gradient(160deg,#f5f3ff 0%,#ede9fe 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 32px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"16px"}}>
            <span style={{fontSize:"20px",fontWeight:"700",color:"#3730a3"}}>Pocket Buddy</span>
            <span>💜</span>
          </div>
          <Mascot/>
          <h3 style={{fontSize:"20px",fontWeight:"700",color:"#1f2937",textAlign:"center",margin:"16px 0 4px"}}>Your AI Companion</h3>
          <p style={{fontSize:"14px",color:"#7c3aed",fontWeight:"600",marginBottom:"24px",textAlign:"center"}}>for a Better You 💜</p>
          {[
            {color:"#dcfce7",icon:"💚",label:"Track your finances"},
            {color:"#fee2e2",icon:"❤️",label:"Monitor your health"},
            {color:"#fef3c7",icon:"😊",label:"Understand your mood"},
            {color:"#fef9c3",icon:"⭐",label:"Achieve your goals"},
            {color:"#dbeafe",icon:"🛡️",label:"Always by your side"},
          ].map(({color,icon,label})=>(
            <div key={label} style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"10px",width:"100%",maxWidth:"220px"}}>
              <div style={{width:"30px",height:"30px",borderRadius:"8px",background:color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",flexShrink:0}}>{icon}</div>
              <span style={{fontSize:"13px",color:"#374151",fontWeight:"500"}}>{label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}