// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";

// export default function LoginPage() {
//   const [name, setName]         = useState("");
//   const [roll, setRoll]         = useState("");
//   const [cls, setCls]           = useState("");
//   const [section, setSection]   = useState("A");
//   const [loading, setLoading]   = useState(false);
//   const [error, setError]       = useState("");
//   const router = useRouter();

//   const handleLogin = async () => {
//     if (!name.trim() || !roll.trim() || !cls) {
//       setError("Please fill all fields / ಎಲ್ಲ ಮಾಹಿತಿ ತುಂಬಿರಿ");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       // Check if student already exists
//       const { data: existing } = await supabase
//         .from("students")
//         .select("*")
//         .eq("roll_number", roll.trim())
//         .eq("class", cls)
//         .single();

//       let student = existing;

//       if (!existing) {
//         // New student — create record
//         const { data: created, error: createErr } = await supabase
//           .from("students")
//           .insert({
//             roll_number: roll.trim(),
//             name: name.trim(),
//             class: cls,
//             section: section,
//           })
//           .select()
//           .single();

//         if (createErr) throw createErr;
//         student = created;
//       } else {
//         // Existing student — update last_active
//         await supabase
//           .from("students")
//           .update({ last_active: new Date().toISOString() })
//           .eq("id", existing.id);
//       }

//       // Save to localStorage
//       localStorage.setItem("pt_student", JSON.stringify(student));
//       router.push("/student");
//     } catch (err: any) {
//       setError("Something went wrong. Please try again.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#6366f1,#10b981)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
//       <div style={{ width:"100%", maxWidth:420, background:"white", borderRadius:24, padding:32, boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }} className="fade-up">

//         {/* Header */}
//         <div style={{ textAlign:"center", marginBottom:28 }}>
//           <div style={{ fontSize:48, marginBottom:8 }}>📚</div>
//           <h1 style={{ fontWeight:800, fontSize:24, color:"#1e293b", marginBottom:4 }}>
//             Pariksha Track
//           </h1>
//           <p style={{ fontFamily:"'Noto Sans Kannada',sans-serif", fontSize:14, color:"#64748b" }}>
//             ಪರೀಕ್ಷಾ ಟ್ರ್ಯಾಕ್
//           </p>
//           <p style={{ fontSize:12, color:"#94a3b8", marginTop:4 }}>
//             English Progress Tracker — Karnataka Government School
//           </p>
//         </div>

//         {/* Form */}
//         <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

//           {/* Name */}
//           <div>
//             <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
//               Your Name / ನಿಮ್ಮ ಹೆಸರು *
//             </label>
//             <input
//               value={name}
//               onChange={e => setName(e.target.value)}
//               placeholder="Enter your full name"
//               style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none", transition:"border 0.2s" }}
//               onFocus={e => (e.target.style.borderColor = "#6366f1")}
//               onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
//             />
//           </div>

//           {/* Roll Number */}
//           <div>
//             <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
//               Roll Number / ಹಾಜರಾತಿ ಸಂಖ್ಯೆ *
//             </label>
//             <input
//               value={roll}
//               onChange={e => setRoll(e.target.value)}
//               placeholder="e.g. 01, 02, 15"
//               style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none", transition:"border 0.2s" }}
//               onFocus={e => (e.target.style.borderColor = "#6366f1")}
//               onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
//             />
//           </div>

//           {/* Class + Section row */}
//           <div style={{ display:"flex", gap:10 }}>
//             <div style={{ flex:1 }}>
//               <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
//                 Class / ತರಗತಿ *
//               </label>
//               <select
//                 value={cls}
//                 onChange={e => setCls(e.target.value)}
//                 style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none", background:"white", cursor:"pointer" }}
//               >
//                 <option value="">Select</option>
//                 <option value="8">8th Standard</option>
//                 <option value="9">9th Standard</option>
//                 <option value="10">10th Standard (SSLC)</option>
//               </select>
//             </div>

//             <div style={{ width:90 }}>
//               <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
//                 Section
//               </label>
//               <select
//                 value={section}
//                 onChange={e => setSection(e.target.value)}
//                 style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none", background:"white", cursor:"pointer" }}
//               >
//                 {["A","B","C","D"].map(s => <option key={s} value={s}>{s}</option>)}
//               </select>
//             </div>
//           </div>

//           {/* Error */}
//           {error && (
//             <p style={{ fontSize:12, color:"#ef4444", background:"#fef2f2", padding:"8px 12px", borderRadius:8, border:"1px solid #fecaca" }}>
//               ⚠ {error}
//             </p>
//           )}

//           {/* Submit */}
//           <button
//             onClick={handleLogin}
//             disabled={loading}
//             style={{ padding:"13px", borderRadius:12, border:"none", background: loading ? "#94a3b8" : "linear-gradient(135deg,#6366f1,#4f46e5)", color:"white", fontSize:15, fontWeight:700, cursor: loading ? "not-allowed" : "pointer", marginTop:4 }}
//           >
//             {loading ? "Loading... / ಲೋಡ್ ಆಗುತ್ತಿದೆ..." : "Start Learning / ಕಲಿಕೆ ಪ್ರಾರಂಭಿಸಿ →"}
//           </button>
//         </div>

//         {/* Admin link */}
//         <div style={{ textAlign:"center", marginTop:20 }}>
//           <a href="/admin" style={{ fontSize:11, color:"#94a3b8", textDecoration:"none" }}>
//             Teacher Login / ಶಿಕ್ಷಕರ ಲಾಗಿನ್ →
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";

// // Normalize roll number: strip leading zeros, trim, uppercase
// function normalizeRoll(roll: string): string {
//   return String(parseInt(roll.trim(), 10) || roll.trim()).toUpperCase();
// }

// // Normalize name: trim, collapse spaces, Title Case
// function normalizeName(name: string): string {
//   return name
//     .trim()
//     .replace(/\s+/g, " ")
//     .replace(/[^a-zA-Z\s\u0C00-\u0C7F]/g, "") // allow Kannada + English only
//     .split(" ")
//     .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
//     .join(" ");
// }

// export default function LoginPage() {
//   const [name, setName]       = useState("");
//   const [roll, setRoll]       = useState("");
//   const [cls, setCls]         = useState("");
//   const [section, setSection] = useState("A");
//   const [loading, setLoading] = useState(false);
//   const [error, setError]     = useState("");
//   const router = useRouter();

//   const validate = (): string | null => {
//     if (!name.trim())        return "Please enter your name / ದಯವಿಟ್ಟು ಹೆಸರು ನಮೂದಿಸಿ";
//     if (name.trim().length < 2) return "Name must be at least 2 characters";
//     if (!roll.trim())        return "Please enter your roll number / ಹಾಜರಾತಿ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ";
//     if (isNaN(Number(roll.trim()))) return "Roll number must be a number / ಸಂಖ್ಯೆ ಮಾತ್ರ";
//     if (!cls)                return "Please select your class / ತರಗತಿ ಆಯ್ಕೆ ಮಾಡಿ";
//     return null;
//   };

//   const handleLogin = async () => {
//     const validationError = validate();
//     if (validationError) { setError(validationError); return; }

//     setLoading(true);
//     setError("");

//     const cleanName = normalizeName(name);
//     const cleanRoll = normalizeRoll(roll);

//     try {
//       // Check if student already exists with this roll + class
//       const { data: existing } = await supabase
//         .from("students")
//         .select("*")
//         .eq("roll_number", cleanRoll)
//         .eq("class", cls)
//         .single();

//       let student = existing;

//       if (!existing) {
//         // New student — create
//         const { data: created, error: createErr } = await supabase
//           .from("students")
//           .insert({
//             roll_number: cleanRoll,
//             name:        cleanName,
//             class:       cls,
//             section:     section,
//           })
//           .select()
//           .single();

//         if (createErr) {
//           // Could be duplicate from race condition
//           if (createErr.code === "23505") {
//             setError("Roll number already registered for this class. Please check your details.");
//           } else {
//             setError("Registration failed. Please try again.");
//           }
//           setLoading(false);
//           return;
//         }
//         student = created;
//       } else {
//         // Existing — verify name matches (case-insensitive)
//         const existingNameNorm = existing.name.toLowerCase().replace(/\s+/g, "");
//         const inputNameNorm    = cleanName.toLowerCase().replace(/\s+/g, "");

//         if (existingNameNorm !== inputNameNorm) {
//           setError(
//             `Roll ${cleanRoll} is registered as "${existing.name}". ` +
//             `Please enter the same name or contact your teacher.`
//           );
//           setLoading(false);
//           return;
//         }

//         // Update last_active
//         await supabase
//           .from("students")
//           .update({ last_active: new Date().toISOString() })
//           .eq("id", existing.id);
//       }

//       localStorage.setItem("pt_student", JSON.stringify(student));
//       router.push("/student");
//     } catch (err: any) {
//       setError("Something went wrong. Please try again.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#6366f1,#10b981)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
//       <div style={{ width:"100%", maxWidth:420, background:"white", borderRadius:24, padding:32, boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }} className="fade-up">

//         <div style={{ textAlign:"center", marginBottom:28 }}>
//           <div style={{ fontSize:48, marginBottom:8 }}>📚</div>
//           <h1 style={{ fontWeight:800, fontSize:24, color:"#1e293b", marginBottom:4 }}>Pariksha Track</h1>
//           <p style={{ fontFamily:"'Noto Sans Kannada',sans-serif", fontSize:14, color:"#64748b" }}>ಪರೀಕ್ಷಾ ಟ್ರ್ಯಾಕ್</p>
//           <p style={{ fontSize:11, color:"#94a3b8", marginTop:4 }}>Karnataka Government School · Progress Tracker</p>
//         </div>

//         <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

//           <div>
//             <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
//               Full Name / ಪೂರ್ಣ ಹೆಸರು *
//             </label>
//             <input
//               value={name}
//               onChange={e => { setName(e.target.value); setError(""); }}
//               placeholder="e.g. Ravi Kumar"
//               style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none" }}
//               onFocus={e => (e.target.style.borderColor = "#6366f1")}
//               onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
//             />
//             <p style={{ fontSize:10, color:"#94a3b8", marginTop:3 }}>
//               Enter the same name every time / ಪ್ರತಿ ಬಾರಿ ಒಂದೇ ಹೆಸರು ಬಳಸಿ
//             </p>
//           </div>

//           <div>
//             <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
//               Roll Number / ಹಾಜರಾತಿ ಸಂಖ್ಯೆ *
//             </label>
//             <input
//               value={roll}
//               onChange={e => { setRoll(e.target.value); setError(""); }}
//               placeholder="e.g. 1, 12, 35"
//               type="number"
//               min="1" max="100"
//               style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none" }}
//               onFocus={e => (e.target.style.borderColor = "#6366f1")}
//               onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
//             />
//             <p style={{ fontSize:10, color:"#94a3b8", marginTop:3 }}>
//               01 and 1 are treated as the same / 01 ಮತ್ತು 1 ಒಂದೇ
//             </p>
//           </div>

//           <div style={{ display:"flex", gap:10 }}>
//             <div style={{ flex:1 }}>
//               <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
//                 Class / ತರಗತಿ *
//               </label>
//               <select value={cls} onChange={e => { setCls(e.target.value); setError(""); }}
//                 style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none", background:"white" }}>
//                 <option value="">Select</option>
//                 <option value="8">8th Standard</option>
//                 <option value="9">9th Standard</option>
//                 <option value="10">10th Standard (SSLC)</option>
//               </select>
//             </div>
//             <div style={{ width:90 }}>
//               <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>Section</label>
//               <select value={section} onChange={e => setSection(e.target.value)}
//                 style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none", background:"white" }}>
//                 {["A","B","C","D"].map(s => <option key={s} value={s}>{s}</option>)}
//               </select>
//             </div>
//           </div>

//           {error && (
//             <div style={{ fontSize:12, color:"#ef4444", background:"#fef2f2", padding:"10px 12px", borderRadius:10, border:"1px solid #fecaca", lineHeight:1.5 }}>
//               ⚠ {error}
//             </div>
//           )}

//           <button onClick={handleLogin} disabled={loading}
//             style={{ padding:"13px", borderRadius:12, border:"none",
//               background: loading ? "#94a3b8" : "linear-gradient(135deg,#6366f1,#4f46e5)",
//               color:"white", fontSize:15, fontWeight:700, cursor: loading ? "not-allowed" : "pointer", marginTop:4 }}>
//             {loading ? "Loading... / ಲೋಡ್ ಆಗುತ್ತಿದೆ..." : "Start Learning / ಕಲಿಕೆ ಪ್ರಾರಂಭಿಸಿ →"}
//           </button>
//         </div>

//         <div style={{ textAlign:"center", marginTop:20 }}>
//           <a href="/admin" style={{ fontSize:11, color:"#94a3b8", textDecoration:"none" }}>
//             Teacher Login / ಶಿಕ್ಷಕರ ಲಾಗಿನ್ →
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

function normalizeRoll(roll: string): string {
  return String(parseInt(roll.trim(), 10) || roll.trim());
}

function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ")
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function normalizePhone(phone: string): string {
  // Strip spaces, dashes, brackets — keep only digits and leading +
  let p = phone.replace(/[\s\-\(\)]/g, "");
  if (p.startsWith("0")) p = "+91" + p.slice(1);
  if (!p.startsWith("+")) p = "+91" + p;
  return p;
}

export default function LoginPage() {
  const [step, setStep]       = useState<"details"|"phone">("details");
  const [name, setName]       = useState("");
  const [roll, setRoll]       = useState("");
  const [cls, setCls]         = useState("");
  const [section, setSection] = useState("A");
  const [phone, setPhone]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const router = useRouter();

  const validateDetails = (): string | null => {
    if (!name.trim() || name.trim().length < 2) return "Enter your full name / ಪೂರ್ಣ ಹೆಸರು ನಮೂದಿಸಿ";
    if (!roll.trim() || isNaN(Number(roll.trim()))) return "Roll number must be a number / ಸಂಖ್ಯೆ ನಮೂದಿಸಿ";
    if (!cls) return "Select your class / ತರಗತಿ ಆಯ್ಕೆ ಮಾಡಿ";
    return null;
  };

  const validatePhone = (): string | null => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) return "Enter a valid 10-digit phone number / ಸರಿಯಾದ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ";
    return null;
  };

  const handleDetailsNext = () => {
    const err = validateDetails();
    if (err) { setError(err); return; }
    setError("");
    setStep("phone");
  };

  const handleLogin = async () => {
    const phoneErr = validatePhone();
    if (phoneErr) { setError(phoneErr); return; }
    setLoading(true);
    setError("");

    const cleanName  = normalizeName(name);
    const cleanRoll  = normalizeRoll(roll);
    const cleanPhone = normalizePhone(phone);

    try {
      const { data: existing } = await supabase
        .from("students").select("*")
        .eq("roll_number", cleanRoll).eq("class", cls).single();

      let student = existing;

      if (!existing) {
        const { data: created, error: createErr } = await supabase
          .from("students")
          .insert({ roll_number:cleanRoll, name:cleanName, class:cls, section, phone:cleanPhone })
          .select().single();

        if (createErr) {
          setError(createErr.code === "23505"
            ? `Roll ${cleanRoll} already registered for Class ${cls}. Check your details.`
            : "Registration failed. Try again.");
          setLoading(false);
          return;
        }
        student = created;
      } else {
        // Verify name
        const existNorm  = existing.name.toLowerCase().replace(/\s+/g, "");
        const inputNorm  = cleanName.toLowerCase().replace(/\s+/g, "");
        if (existNorm !== inputNorm) {
          setError(`Roll ${cleanRoll} is registered as "${existing.name}". Use the same name or ask your teacher.`);
          setLoading(false);
          return;
        }
        // Update phone + last_active
        await supabase.from("students")
          .update({ phone:cleanPhone, last_active:new Date().toISOString() })
          .eq("id", existing.id);
      }

      localStorage.setItem("pt_student", JSON.stringify(student));
      router.push("/student");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const inputStyle = {
    width:"100%", padding:"11px 14px", borderRadius:10,
    border:"1.5px solid #e2e8f0", fontSize:14, outline:"none"
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#6366f1,#10b981)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ width:"100%", maxWidth:420, background:"white", borderRadius:24, padding:32, boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }} className="fade-up">

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>📚</div>
          <h1 style={{ fontWeight:800, fontSize:24, color:"#1e293b", marginBottom:4 }}>Pariksha Track</h1>
          <p style={{ fontFamily:"'Noto Sans Kannada',sans-serif", fontSize:14, color:"#64748b" }}>ಪರೀಕ್ಷಾ ಟ್ರ್ಯಾಕ್</p>

          {/* Step indicator */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:12 }}>
            {["Student Details","Phone Number"].map((label, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700,
                  background: (step === "details" && i === 0) || (step === "phone" && i === 1) ? "#6366f1" : i < (step === "phone" ? 1 : 0) ? "#10b981" : "#e2e8f0",
                  color: (step === "details" && i === 0) || (step === "phone" && i === 1) || i < (step === "phone" ? 1 : 0) ? "white" : "#94a3b8" }}>
                  {i < (step === "phone" ? 1 : 0) ? "✓" : i+1}
                </div>
                <span style={{ fontSize:11, color: (step === "details" && i === 0) || (step === "phone" && i === 1) ? "#6366f1" : "#94a3b8", fontWeight:600 }}>
                  {label}
                </span>
                {i < 1 && <span style={{ color:"#e2e8f0" }}>→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* ── Step 1: Details ── */}
        {step === "details" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
                Full Name / ಪೂರ್ಣ ಹೆಸರು *
              </label>
              <input value={name} onChange={e => { setName(e.target.value); setError(""); }}
                placeholder="e.g. Ravi Kumar" style={inputStyle}
                onFocus={e => (e.target.style.borderColor="#6366f1")}
                onBlur={e => (e.target.style.borderColor="#e2e8f0")} />
              <p style={{ fontSize:10, color:"#94a3b8", marginTop:3 }}>Use the same name every time / ಪ್ರತಿ ಬಾರಿ ಒಂದೇ ಹೆಸರು</p>
            </div>

            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
                Roll Number / ಹಾಜರಾತಿ ಸಂಖ್ಯೆ *
              </label>
              <input value={roll} onChange={e => { setRoll(e.target.value); setError(""); }}
                placeholder="e.g. 1, 12, 35" type="number" min="1" max="100" style={inputStyle}
                onFocus={e => (e.target.style.borderColor="#6366f1")}
                onBlur={e => (e.target.style.borderColor="#e2e8f0")} />
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>Class *</label>
                <select value={cls} onChange={e => { setCls(e.target.value); setError(""); }}
                  style={{ ...inputStyle, background:"white", cursor:"pointer" }}>
                  <option value="">Select</option>
                  <option value="8">8th Standard</option>
                  <option value="9">9th Standard</option>
                  <option value="10">10th (SSLC)</option>
                </select>
              </div>
              <div style={{ width:90 }}>
                <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>Section</label>
                <select value={section} onChange={e => setSection(e.target.value)}
                  style={{ ...inputStyle, background:"white", cursor:"pointer" }}>
                  {["A","B","C","D"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {error && <div style={{ fontSize:12, color:"#ef4444", background:"#fef2f2", padding:"10px 12px", borderRadius:10, border:"1px solid #fecaca" }}>⚠ {error}</div>}

            <button onClick={handleDetailsNext}
              style={{ padding:13, borderRadius:12, border:"none", background:"linear-gradient(135deg,#6366f1,#4f46e5)", color:"white", fontSize:15, fontWeight:700, cursor:"pointer" }}>
              Next: Add Phone Number →
            </button>
          </div>
        )}

        {/* ── Step 2: Phone ── */}
        {step === "phone" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {/* Student summary */}
            <div style={{ background:"#f8fafc", borderRadius:12, padding:"12px 14px", border:"1px solid #e2e8f0" }}>
              <p style={{ fontSize:12, fontWeight:700, color:"#1e293b", marginBottom:2 }}>{normalizeName(name)}</p>
              <p style={{ fontSize:11, color:"#64748b" }}>Roll {normalizeRoll(roll)} · Class {cls}{section}</p>
            </div>

            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
                📱 Mobile Number / ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *
              </label>
              <div style={{ display:"flex", gap:8 }}>
                <div style={{ padding:"11px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, color:"#64748b", background:"#f8fafc", whiteSpace:"nowrap" }}>
                  🇮🇳 +91
                </div>
                <input value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g,"")); setError(""); }}
                  placeholder="9876543210" type="tel" maxLength={10} style={{ ...inputStyle, flex:1 }}
                  onFocus={e => (e.target.style.borderColor="#6366f1")}
                  onBlur={e => (e.target.style.borderColor="#e2e8f0")} />
              </div>
              <p style={{ fontSize:10, color:"#94a3b8", marginTop:3, lineHeight:1.5 }}>
                Your teacher will send progress reports to this number.<br/>
                ನಿಮ್ಮ ಶಿಕ್ಷಕರು ಈ ಸಂಖ್ಯೆಗೆ ಪ್ರಗತಿ ವರದಿ ಕಳಿಸುತ್ತಾರೆ.
              </p>
            </div>

            {error && <div style={{ fontSize:12, color:"#ef4444", background:"#fef2f2", padding:"10px 12px", borderRadius:10, border:"1px solid #fecaca" }}>⚠ {error}</div>}

            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => { setStep("details"); setError(""); }}
                style={{ padding:13, borderRadius:12, border:"1px solid #e2e8f0", background:"white", color:"#64748b", fontSize:14, fontWeight:600, cursor:"pointer", flex:1 }}>
                ← Back
              </button>
              <button onClick={handleLogin} disabled={loading}
                style={{ padding:13, borderRadius:12, border:"none",
                  background: loading ? "#94a3b8" : "linear-gradient(135deg,#6366f1,#4f46e5)",
                  color:"white", fontSize:14, fontWeight:700, cursor: loading ? "not-allowed" : "pointer", flex:2 }}>
                {loading ? "Loading..." : "Start Learning ✓"}
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign:"center", marginTop:20 }}>
          <a href="/admin" style={{ fontSize:11, color:"#94a3b8", textDecoration:"none" }}>
            Teacher Login / ಶಿಕ್ಷಕರ ಲಾಗಿನ್ →
          </a>
        </div>
      </div>
    </div>
  );
}