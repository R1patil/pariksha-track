// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// // Simple password auth for teacher — no Supabase needed
// const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "teacher123";

// export default function AdminLoginPage() {
//   const [password, setPassword] = useState("");
//   const [error, setError]       = useState("");
//   const router = useRouter();

//   const handleLogin = () => {
//     if (password === ADMIN_PASSWORD) {
//       localStorage.setItem("pt_admin", "true");
//       router.push("/admin/dashboard");
//     } else {
//       setError("Wrong password / ತಪ್ಪು ಪಾಸ್‌ವರ್ಡ್");
//     }
//   };

//   return (
//     <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#1e293b,#334155)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
//       <div style={{ width:"100%", maxWidth:380, background:"white", borderRadius:24, padding:32, boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }} className="fade-up">
//         <div style={{ textAlign:"center", marginBottom:28 }}>
//           <div style={{ fontSize:44, marginBottom:8 }}>🏫</div>
//           <h1 style={{ fontWeight:800, fontSize:22, color:"#1e293b", marginBottom:4 }}>Teacher Login</h1>
//           <p style={{ fontFamily:"'Noto Sans Kannada',sans-serif", fontSize:13, color:"#64748b" }}>ಶಿಕ್ಷಕರ ಲಾಗಿನ್</p>
//           <p style={{ fontSize:11, color:"#94a3b8", marginTop:4 }}>Admin Dashboard — Pariksha Track</p>
//         </div>

//         <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
//           <div>
//             <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
//               Password / ಪಾಸ್‌ವರ್ಡ್
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//               onKeyDown={e => e.key === "Enter" && handleLogin()}
//               placeholder="Enter teacher password"
//               style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none" }}
//               onFocus={e => (e.target.style.borderColor = "#1e293b")}
//               onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
//             />
//           </div>

//           {error && (
//             <p style={{ fontSize:12, color:"#ef4444", background:"#fef2f2", padding:"8px 12px", borderRadius:8 }}>
//               ⚠ {error}
//             </p>
//           )}

//           <button onClick={handleLogin}
//             style={{ padding:13, borderRadius:12, border:"none", background:"linear-gradient(135deg,#1e293b,#334155)", color:"white", fontSize:15, fontWeight:700, cursor:"pointer" }}>
//             Login / ಒಳಗೆ ಹೋಗಿ →
//           </button>
//         </div>

//         <div style={{ textAlign:"center", marginTop:20 }}>
//           <a href="/login" style={{ fontSize:11, color:"#94a3b8", textDecoration:"none" }}>
//             ← Student Login
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const SUBJECT_INFO = {
  english: { label:"English Teacher",  icon:"📝", color:"#6366f1", kannada:"ಇಂಗ್ಲಿಷ್ ಶಿಕ್ಷಕರು" },
  maths:   { label:"Maths Teacher",    icon:"🔢", color:"#f59e0b", kannada:"ಗಣಿತ ಶಿಕ್ಷಕರು" },
  science: { label:"Science Teacher",  icon:"🔬", color:"#10b981", kannada:"ವಿಜ್ಞಾನ ಶಿಕ್ಷಕರು" },
  all:     { label:"Head Teacher",     icon:"🏫", color:"#1e293b", kannada:"ಮುಖ್ಯ ಶಿಕ್ಷಕರು" },
};

export default function AdminLoginPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!selectedSubject) { setError("Please select your subject / ವಿಷಯ ಆಯ್ಕೆ ಮಾಡಿ"); return; }
    if (!password.trim()) { setError("Enter your password / ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ"); return; }
    setLoading(true);
    setError("");

    const { data: teacher } = await supabase
      .from("teachers")
      .select("*")
      .eq("subject", selectedSubject)
      .eq("password", password.trim())
      .single();

    if (!teacher) {
      setError("Wrong password / ತಪ್ಪು ಪಾಸ್‌ವರ್ಡ್. Try again.");
      setLoading(false);
      return;
    }

    // Store teacher session
    localStorage.setItem("pt_admin", "true");
    localStorage.setItem("pt_teacher", JSON.stringify({
      id: teacher.id,
      name: teacher.name,
      subject: teacher.subject,
    }));

    router.push("/admin/dashboard");
    setLoading(false);
  };

  const info = selectedSubject ? SUBJECT_INFO[selectedSubject as keyof typeof SUBJECT_INFO] : null;

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#1e293b,#334155)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ width:"100%", maxWidth:400, background:"white", borderRadius:24, padding:32, boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }} className="fade-up">

        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:44, marginBottom:8 }}>{info?.icon || "🏫"}</div>
          <h1 style={{ fontWeight:800, fontSize:22, color:"#1e293b" }}>Teacher Login</h1>
          <p style={{ fontFamily:"'Noto Sans Kannada',sans-serif", fontSize:13, color:"#64748b", marginTop:4 }}>
            {info?.kannada || "ಶಿಕ್ಷಕರ ಲಾಗಿನ್"}
          </p>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Subject selector */}
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:8 }}>
              Select Your Subject / ನಿಮ್ಮ ವಿಷಯ ಆಯ್ಕೆ ಮಾಡಿ
            </label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {Object.entries(SUBJECT_INFO).map(([key, val]) => (
                <button key={key} onClick={() => { setSelectedSubject(key); setError(""); }}
                  style={{ padding:"12px 10px", borderRadius:12, border:`2px solid ${selectedSubject === key ? val.color : "#e2e8f0"}`,
                    background: selectedSubject === key ? `${val.color}10` : "white",
                    cursor:"pointer", textAlign:"center", transition:"all 0.2s" }}>
                  <div style={{ fontSize:20, marginBottom:4 }}>{val.icon}</div>
                  <div style={{ fontSize:11, fontWeight:700, color: selectedSubject === key ? val.color : "#475569" }}>
                    {val.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          {selectedSubject && (
            <div className="fade-up">
              <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
                Password / ಪಾಸ್‌ವರ್ಡ್
              </label>
              <input type="password" value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder={`Enter ${info?.label} password`}
                style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none" }}
                onFocus={e => (e.target.style.borderColor = info?.color || "#6366f1")}
                onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
                autoFocus />
            </div>
          )}

          {error && (
            <div style={{ fontSize:12, color:"#ef4444", background:"#fef2f2", padding:"10px 12px", borderRadius:10, border:"1px solid #fecaca" }}>
              ⚠ {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading || !selectedSubject}
            style={{ padding:13, borderRadius:12, border:"none",
              background: !selectedSubject ? "#e2e8f0" : loading ? "#94a3b8" : `linear-gradient(135deg,${info?.color},${info?.color}cc)`,
              color: !selectedSubject ? "#94a3b8" : "white",
              fontSize:15, fontWeight:700, cursor: (!selectedSubject || loading) ? "not-allowed" : "pointer" }}>
            {loading ? "Logging in..." : "Login →"}
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