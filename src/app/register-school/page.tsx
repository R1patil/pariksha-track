"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

function generateCode(name: string): string {
  const prefix = name.replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 3) || "SCH";
  const num    = Math.floor(100 + Math.random() * 900);
  return `${prefix}${num}`;
}

export default function RegisterSchoolPage() {
  const [schoolName, setSchoolName] = useState("");
  const [district, setDistrict]     = useState("");
  const [adminName, setAdminName]   = useState("");
  const [adminPwd, setAdminPwd]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<{ code: string; name: string } | null>(null);
  const [error, setError]           = useState("");
  const router = useRouter();

  const KARNATAKA_DISTRICTS = [
    "Bagalkot","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban",
    "Bidar","Chamarajanagar","Chikkaballapura","Chikkamagaluru","Chitradurga",
    "Dakshina Kannada","Davanagere","Dharwad","Gadag","Hassan","Haveri",
    "Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru","Raichur",
    "Ramanagara","Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayapura","Yadgir"
  ];

  const handleRegister = async () => {
    if (!schoolName.trim() || !district || !adminName.trim() || !adminPwd.trim()) {
      setError("Please fill all fields"); return;
    }
    if (adminPwd.length < 6) {
      setError("Password must be at least 6 characters"); return;
    }
    setLoading(true); setError("");

    const code = generateCode(schoolName);
    try {
      // Create school
      const { data: school, error: schoolErr } = await supabase
        .from("schools")
        .insert({ name: schoolName.trim(), code, district, plan: "paid" })
        .select().single();

      if (schoolErr) throw schoolErr;

      // Create head teacher
      await supabase.from("teachers").insert({
        name:      adminName.trim(),
        subject:   "all",
        password:  adminPwd,
        school_id: school.id,
      });

      setResult({ code, name: schoolName.trim() });
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
    setLoading(false);
  };

  if (result) {
    return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#1e293b,#334155)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
        <div style={{ background:"white", borderRadius:24, padding:32, maxWidth:420, width:"100%", textAlign:"center" }}>
          <div style={{ fontSize:52, marginBottom:12 }}>🎉</div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b", marginBottom:8 }}>School Registered!</h1>
          <p style={{ fontSize:14, color:"#64748b", marginBottom:20 }}>{result.name}</p>

          <div style={{ background:"#f5f3ff", borderRadius:14, padding:20, marginBottom:20, border:"2px solid #ddd6fe" }}>
            <p style={{ fontSize:12, color:"#7c3aed", fontWeight:600, marginBottom:6 }}>
              Your School Code (share with students & teachers)
            </p>
            <p style={{ fontSize:36, fontWeight:900, color:"#4c1d95", letterSpacing:4, fontFamily:"monospace" }}>
              {result.code}
            </p>
          </div>

          <div style={{ background:"#fef9c3", borderRadius:10, padding:12, marginBottom:20, fontSize:12, color:"#713f12", textAlign:"left", lineHeight:1.6 }}>
            <strong>Next steps:</strong><br/>
            1. Share code <strong>{result.code}</strong> with your students<br/>
            2. Students enter this code when signing up<br/>
            3. Login at /admin with your password<br/>
          </div>

          <button onClick={() => router.push("/admin")}
            style={{ padding:"12px 28px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#7c3aed,#6366f1)", color:"white", fontSize:14, fontWeight:700, cursor:"pointer" }}>
            Go to Teacher Login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#1e293b,#334155)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"white", borderRadius:24, padding:32, maxWidth:440, width:"100%" }}>

        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:44, marginBottom:8 }}>🏫</div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b" }}>Register Your School</h1>
          <p style={{ fontSize:12, color:"#64748b", marginTop:4 }}>
            Karnataka Government School — Pariksha Track
          </p>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
          <div>
            <label style={{ fontSize:11, fontWeight:600, color:"#475569", display:"block", marginBottom:4 }}>School Name *</label>
            <input value={schoolName} onChange={e => setSchoolName(e.target.value)}
              placeholder="e.g. Government High School, Hubli"
              style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:13, outline:"none" }}
              onFocus={e => (e.target.style.borderColor="#7c3aed")}
              onBlur={e => (e.target.style.borderColor="#e2e8f0")} />
          </div>

          <div>
            <label style={{ fontSize:11, fontWeight:600, color:"#475569", display:"block", marginBottom:4 }}>District *</label>
            <select value={district} onChange={e => setDistrict(e.target.value)}
              style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:13, outline:"none", background:"white" }}>
              <option value="">Select district...</option>
              {KARNATAKA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize:11, fontWeight:600, color:"#475569", display:"block", marginBottom:4 }}>Head Teacher Name *</label>
            <input value={adminName} onChange={e => setAdminName(e.target.value)}
              placeholder="Teacher's full name"
              style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:13, outline:"none" }}
              onFocus={e => (e.target.style.borderColor="#7c3aed")}
              onBlur={e => (e.target.style.borderColor="#e2e8f0")} />
          </div>

          <div>
            <label style={{ fontSize:11, fontWeight:600, color:"#475569", display:"block", marginBottom:4 }}>Admin Password *</label>
            <input type="password" value={adminPwd} onChange={e => setAdminPwd(e.target.value)}
              placeholder="Choose a strong password (min 6 chars)"
              style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:13, outline:"none" }}
              onFocus={e => (e.target.style.borderColor="#7c3aed")}
              onBlur={e => (e.target.style.borderColor="#e2e8f0")} />
          </div>

          {/* Pricing note */}
          <div style={{ background:"#f0fdf4", borderRadius:10, padding:12, border:"1px solid #86efac", fontSize:11, color:"#166534" }}>
            💰 <strong>₹2,000/year</strong> — unlimited students, all 3 subjects, AI teacher, PDF upload<br/>
            <span style={{ color:"#16a34a" }}>Contact: rahulbpatil913@gmail.com to activate</span>
          </div>

          {error && (
            <div style={{ fontSize:12, color:"#ef4444", background:"#fef2f2", padding:"8px 12px", borderRadius:8 }}>⚠ {error}</div>
          )}

          <button onClick={handleRegister} disabled={loading}
            style={{ padding:13, borderRadius:12, border:"none", background: loading ? "#94a3b8" : "linear-gradient(135deg,#7c3aed,#6366f1)", color:"white", fontSize:14, fontWeight:700, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Registering..." : "Register School →"}
          </button>
        </div>

        <div style={{ textAlign:"center", marginTop:16 }}>
          <a href="/admin" style={{ fontSize:11, color:"#94a3b8", textDecoration:"none" }}>
            Already registered? Login →
          </a>
        </div>
      </div>
    </div>
  );
}