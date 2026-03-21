"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [name, setName]         = useState("");
  const [roll, setRoll]         = useState("");
  const [cls, setCls]           = useState("");
  const [section, setSection]   = useState("A");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!name.trim() || !roll.trim() || !cls) {
      setError("Please fill all fields / ಎಲ್ಲ ಮಾಹಿತಿ ತುಂಬಿರಿ");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Check if student already exists
      const { data: existing } = await supabase
        .from("students")
        .select("*")
        .eq("roll_number", roll.trim())
        .eq("class", cls)
        .single();

      let student = existing;

      if (!existing) {
        // New student — create record
        const { data: created, error: createErr } = await supabase
          .from("students")
          .insert({
            roll_number: roll.trim(),
            name: name.trim(),
            class: cls,
            section: section,
          })
          .select()
          .single();

        if (createErr) throw createErr;
        student = created;
      } else {
        // Existing student — update last_active
        await supabase
          .from("students")
          .update({ last_active: new Date().toISOString() })
          .eq("id", existing.id);
      }

      // Save to localStorage
      localStorage.setItem("pt_student", JSON.stringify(student));
      router.push("/student");
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#6366f1,#10b981)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ width:"100%", maxWidth:420, background:"white", borderRadius:24, padding:32, boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }} className="fade-up">

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>📚</div>
          <h1 style={{ fontWeight:800, fontSize:24, color:"#1e293b", marginBottom:4 }}>
            Pariksha Track
          </h1>
          <p style={{ fontFamily:"'Noto Sans Kannada',sans-serif", fontSize:14, color:"#64748b" }}>
            ಪರೀಕ್ಷಾ ಟ್ರ್ಯಾಕ್
          </p>
          <p style={{ fontSize:12, color:"#94a3b8", marginTop:4 }}>
            English Progress Tracker — Karnataka Government School
          </p>
        </div>

        {/* Form */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Name */}
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
              Your Name / ನಿಮ್ಮ ಹೆಸರು *
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full name"
              style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none", transition:"border 0.2s" }}
              onFocus={e => (e.target.style.borderColor = "#6366f1")}
              onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          {/* Roll Number */}
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
              Roll Number / ಹಾಜರಾತಿ ಸಂಖ್ಯೆ *
            </label>
            <input
              value={roll}
              onChange={e => setRoll(e.target.value)}
              placeholder="e.g. 01, 02, 15"
              style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none", transition:"border 0.2s" }}
              onFocus={e => (e.target.style.borderColor = "#6366f1")}
              onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          {/* Class + Section row */}
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
                Class / ತರಗತಿ *
              </label>
              <select
                value={cls}
                onChange={e => setCls(e.target.value)}
                style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none", background:"white", cursor:"pointer" }}
              >
                <option value="">Select</option>
                <option value="8">8th Standard</option>
                <option value="9">9th Standard</option>
                <option value="10">10th Standard (SSLC)</option>
              </select>
            </div>

            <div style={{ width:90 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
                Section
              </label>
              <select
                value={section}
                onChange={e => setSection(e.target.value)}
                style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none", background:"white", cursor:"pointer" }}
              >
                {["A","B","C","D"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p style={{ fontSize:12, color:"#ef4444", background:"#fef2f2", padding:"8px 12px", borderRadius:8, border:"1px solid #fecaca" }}>
              ⚠ {error}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ padding:"13px", borderRadius:12, border:"none", background: loading ? "#94a3b8" : "linear-gradient(135deg,#6366f1,#4f46e5)", color:"white", fontSize:15, fontWeight:700, cursor: loading ? "not-allowed" : "pointer", marginTop:4 }}
          >
            {loading ? "Loading... / ಲೋಡ್ ಆಗುತ್ತಿದೆ..." : "Start Learning / ಕಲಿಕೆ ಪ್ರಾರಂಭಿಸಿ →"}
          </button>
        </div>

        {/* Admin link */}
        <div style={{ textAlign:"center", marginTop:20 }}>
          <a href="/admin" style={{ fontSize:11, color:"#94a3b8", textDecoration:"none" }}>
            Teacher Login / ಶಿಕ್ಷಕರ ಲಾಗಿನ್ →
          </a>
        </div>
      </div>
    </div>
  );
}
