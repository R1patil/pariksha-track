"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Simple password auth for teacher — no Supabase needed
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "teacher123";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("pt_admin", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Wrong password / ತಪ್ಪು ಪಾಸ್‌ವರ್ಡ್");
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#1e293b,#334155)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ width:"100%", maxWidth:380, background:"white", borderRadius:24, padding:32, boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }} className="fade-up">
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:44, marginBottom:8 }}>🏫</div>
          <h1 style={{ fontWeight:800, fontSize:22, color:"#1e293b", marginBottom:4 }}>Teacher Login</h1>
          <p style={{ fontFamily:"'Noto Sans Kannada',sans-serif", fontSize:13, color:"#64748b" }}>ಶಿಕ್ಷಕರ ಲಾಗಿನ್</p>
          <p style={{ fontSize:11, color:"#94a3b8", marginTop:4 }}>Admin Dashboard — Pariksha Track</p>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
              Password / ಪಾಸ್‌ವರ್ಡ್
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Enter teacher password"
              style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none" }}
              onFocus={e => (e.target.style.borderColor = "#1e293b")}
              onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          {error && (
            <p style={{ fontSize:12, color:"#ef4444", background:"#fef2f2", padding:"8px 12px", borderRadius:8 }}>
              ⚠ {error}
            </p>
          )}

          <button onClick={handleLogin}
            style={{ padding:13, borderRadius:12, border:"none", background:"linear-gradient(135deg,#1e293b,#334155)", color:"white", fontSize:15, fontWeight:700, cursor:"pointer" }}>
            Login / ಒಳಗೆ ಹೋಗಿ →
          </button>
        </div>

        <div style={{ textAlign:"center", marginTop:20 }}>
          <a href="/login" style={{ fontSize:11, color:"#94a3b8", textDecoration:"none" }}>
            ← Student Login
          </a>
        </div>
      </div>
    </div>
  );
}
