// "use client";
// import { useState, useEffect, use } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { englishChapters, STATUS_COLORS, STATUS_LABELS, TYPE_LABELS } from "@/lib/chapters";

// export default function StudentDetail({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = use(params);
//   const [student, setStudent]   = useState<any>(null);
//   const [progress, setProgress] = useState<Record<string, string>>({});
//   const [loading, setLoading]   = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const isAdmin = localStorage.getItem("pt_admin");
//     if (!isAdmin) { router.replace("/admin"); return; }
//     loadData();
//   }, [id, router]);

//   const loadData = async () => {
//     const { data: s } = await supabase.from("students").select("*").eq("id", id).single();
//     if (!s) { router.replace("/admin/dashboard"); return; }
//     setStudent(s);

//     const { data: prog } = await supabase.from("progress").select("chapter_id, status").eq("student_id", id);
//     const map: Record<string, string> = {};
//     (prog || []).forEach((p: any) => { map[p.chapter_id] = p.status; });
//     setProgress(map);
//     setLoading(false);
//   };

//   if (loading || !student) {
//     return (
//       <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh" }}>
//         <div className="spinner" />
//       </div>
//     );
//   }

//   const subject = englishChapters[student.class];
//   if (!subject) return null;

//   const chapters    = subject.chapters;
//   const doneCount   = chapters.filter(c => progress[c.id] === "done").length;
//   const readingCount = chapters.filter(c => progress[c.id] === "reading").length;
//   const pct         = Math.round((doneCount / chapters.length) * 100);
//   const color       = subject.color;

//   const grouped: Record<string, typeof chapters> = {};
//   chapters.forEach(c => {
//     if (!grouped[c.type]) grouped[c.type] = [];
//     grouped[c.type].push(c);
//   });

//   const pctColor = pct >= 80 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444";

//   const timeStr = new Date(student.last_active).toLocaleString("en-IN", {
//     day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit"
//   });

//   return (
//     <div style={{ minHeight:"100vh", background:"#f1f5f9" }}>
//       {/* Header */}
//       <div style={{ background:`linear-gradient(135deg,${color},${color}cc)`, padding:"20px 16px 28px" }}>
//         <div style={{ maxWidth:600, margin:"0 auto" }}>
//           <button onClick={() => router.push("/admin/dashboard")}
//             style={{ color:"rgba(255,255,255,0.8)", background:"none", border:"none", cursor:"pointer", fontSize:13, marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
//             ← Back to Dashboard
//           </button>

//           <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
//             <div style={{ width:52, height:52, borderRadius:16, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:800, color:"white" }}>
//               {student.name.charAt(0).toUpperCase()}
//             </div>
//             <div>
//               <h1 style={{ fontSize:22, fontWeight:800, color:"white" }}>{student.name}</h1>
//               <div style={{ display:"flex", gap:10, marginTop:3 }}>
//                 <span style={{ fontSize:11, color:"rgba(255,255,255,0.8)", fontFamily:"monospace" }}>Roll No: {student.roll_number}</span>
//                 <span style={{ fontSize:11, color:"rgba(255,255,255,0.8)" }}>Class {student.class}{student.section}</span>
//               </div>
//               <p style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:2 }}>Last active: {timeStr}</p>
//             </div>
//           </div>

//           {/* Stats */}
//           <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:14, padding:"14px 16px" }}>
//             <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:10, marginBottom:12 }}>
//               {[
//                 { label:"Done ✓", value:doneCount, color:"#4ade80" },
//                 { label:"Reading", value:readingCount, color:"#fcd34d" },
//                 { label:"Pending", value:chapters.length - doneCount - readingCount, color:"#f87171" },
//                 { label:"Progress", value:`${pct}%`, color:"white" },
//               ].map(s => (
//                 <div key={s.label} style={{ textAlign:"center" }}>
//                   <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.value}</div>
//                   <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)", marginTop:1 }}>{s.label}</div>
//                 </div>
//               ))}
//             </div>
//             <div style={{ height:8, background:"rgba(255,255,255,0.2)", borderRadius:4, overflow:"hidden" }}>
//               <div style={{ height:"100%", width:`${pct}%`, background:"white", borderRadius:4 }} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Chapter list — teacher read only view */}
//       <div style={{ maxWidth:600, margin:"0 auto", padding:16 }}>
//         <p style={{ fontSize:12, color:"#64748b", marginBottom:14 }}>
//           Chapter-wise progress for {student.name}
//         </p>

//         {Object.entries(grouped).map(([type, chs]) => (
//           <div key={type} style={{ marginBottom:18 }}>
//             <div style={{ fontSize:12, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>
//               {TYPE_LABELS[type]} ({chs.length})
//             </div>

//             <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
//               {chs.map((chapter, i) => {
//                 const status = progress[chapter.id] || "not_started";
//                 const sc = STATUS_COLORS[status];
//                 return (
//                   <div key={chapter.id} style={{ background:"white", borderRadius:12, padding:"11px 14px", border:"1px solid #e2e8f0", display:"flex", alignItems:"center", gap:12, borderLeft:`3px solid ${sc}` }}>
//                     <div style={{ width:22, height:22, borderRadius:6, background:`${sc}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:sc, flexShrink:0 }}>
//                       {i+1}
//                     </div>
//                     <p style={{ flex:1, fontSize:13, color: status === "done" ? "#94a3b8" : "#1e293b", textDecoration: status === "done" ? "line-through" : "none" }}>
//                       {chapter.title}
//                     </p>
//                     <span style={{ padding:"3px 10px", borderRadius:20, background:`${sc}15`, color:sc, fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>
//                       {STATUS_LABELS[status]}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useState, useEffect, use } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { englishChapters, STATUS_COLORS, STATUS_LABELS, TYPE_LABELS } from "@/lib/chapters";

// export default function StudentDetail({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = use(params);
//   const [student, setStudent]     = useState<any>(null);
//   const [progress, setProgress]   = useState<Record<string, string>>({});
//   const [remark, setRemark]       = useState("");
//   const [savedRemark, setSavedRemark] = useState("");
//   const [savingRemark, setSavingRemark] = useState(false);
//   const [remarkSaved, setRemarkSaved]  = useState(false);
//   const [loading, setLoading]     = useState(true);
//   const [exporting, setExporting] = useState(false);
//   const [whatsappSent, setWhatsappSent] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const isAdmin = localStorage.getItem("pt_admin");
//     if (!isAdmin) { router.replace("/admin"); return; }
//     loadData();
//   }, [id]);

//   const loadData = async () => {
//     const { data: s } = await supabase.from("students").select("*").eq("id", id).single();
//     if (!s) { router.replace("/admin/dashboard"); return; }
//     setStudent(s);

//     const { data: prog } = await supabase
//       .from("progress").select("chapter_id, status").eq("student_id", id);
//     const map: Record<string, string> = {};
//     (prog || []).forEach((p: any) => { map[p.chapter_id] = p.status; });
//     setProgress(map);

//     // Load existing remark
//     const { data: rem } = await supabase
//       .from("remarks").select("teacher_note").eq("student_id", id).single();
//     if (rem) { setRemark(rem.teacher_note); setSavedRemark(rem.teacher_note); }

//     setLoading(false);
//   };

//   // ── Save remark ────────────────────────────────────────────
//   const saveRemark = async () => {
//     if (!remark.trim()) return;
//     setSavingRemark(true);
//     await supabase.from("remarks").upsert(
//       { student_id: id, teacher_note: remark.trim(), updated_at: new Date().toISOString() },
//       { onConflict: "student_id" }
//     );
//     setSavedRemark(remark.trim());
//     setSavingRemark(false);
//     setRemarkSaved(true);
//     setTimeout(() => setRemarkSaved(false), 2000);
//   };

//   // ── Export to CSV (opens as Excel) ────────────────────────
//   const exportToCSV = () => {
//     if (!student) return;
//     setExporting(true);

//     const subject = englishChapters[student.class];
//     const rows = [
//       ["Pariksha Track — Student Progress Report"],
//       [""],
//       ["Student Name", student.name],
//       ["Roll Number", student.roll_number],
//       ["Class", `${student.class}${student.section}`],
//       ["Last Active", new Date(student.last_active).toLocaleString("en-IN")],
//       ["Teacher Note", savedRemark || "None"],
//       [""],
//       ["#", "Chapter", "Type", "Status", "KSEEB Solutions Link"],
//     ];

//     subject.chapters.forEach((ch, i) => {
//       const status = progress[ch.id] || "not_started";
//       rows.push([
//         String(i + 1),
//         ch.title,
//         ch.type.charAt(0).toUpperCase() + ch.type.slice(1),
//         STATUS_LABELS[status],
//         ch.kseebUrl,
//       ]);
//     });

//     const done    = subject.chapters.filter(c => progress[c.id] === "done").length;
//     const reading = subject.chapters.filter(c => progress[c.id] === "reading").length;
//     const pct     = Math.round((done / subject.chapters.length) * 100);

//     rows.push([""], ["Summary", "", "", ""]);
//     rows.push(["Total Chapters", String(subject.chapters.length)]);
//     rows.push(["Completed", String(done)]);
//     rows.push(["Reading", String(reading)]);
//     rows.push(["Not Started", String(subject.chapters.length - done - reading)]);
//     rows.push(["Progress %", `${pct}%`]);

//     const csv     = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
//     const blob    = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url     = URL.createObjectURL(blob);
//     const link    = document.createElement("a");
//     link.href     = url;
//     link.download = `${student.name}_${student.class}th_English_Progress.csv`;
//     link.click();
//     URL.revokeObjectURL(url);
//     setExporting(false);
//   };

//   // ── WhatsApp alert ─────────────────────────────────────────
//   const sendWhatsApp = () => {
//     if (!student) return;
//     const subject = englishChapters[student.class];
//     const done    = subject.chapters.filter(c => progress[c.id] === "done").length;
//     const pct     = Math.round((done / subject.chapters.length) * 100);

//     const msg = encodeURIComponent(
//       `📚 *Pariksha Track — Progress Report*\n\n` +
//       `Student: *${student.name}*\n` +
//       `Roll No: ${student.roll_number} | Class: ${student.class}${student.section}\n\n` +
//       `English Progress: *${pct}%* complete\n` +
//       `✅ Done: ${done}/${subject.chapters.length} chapters\n` +
//       `📖 Reading: ${subject.chapters.filter(c => progress[c.id] === "reading").length} chapters\n` +
//       (savedRemark ? `\n📝 Teacher note: ${savedRemark}\n` : "") +
//       `\nLast active: ${new Date(student.last_active).toLocaleString("en-IN")}`
//     );

//     window.open(`https://wa.me/?text=${msg}`, "_blank");
//     setWhatsappSent(true);
//     setTimeout(() => setWhatsappSent(false), 3000);
//   };

//   if (loading || !student) {
//     return (
//       <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh" }}>
//         <div className="spinner" />
//       </div>
//     );
//   }

//   const subject   = englishChapters[student.class];
//   const chapters  = subject.chapters;
//   const doneCount = chapters.filter(c => progress[c.id] === "done").length;
//   const readCount = chapters.filter(c => progress[c.id] === "reading").length;
//   const pct       = Math.round((doneCount / chapters.length) * 100);
//   const color     = subject.color;
//   const pctColor  = pct >= 80 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444";

//   const grouped: Record<string, typeof chapters> = {};
//   chapters.forEach(c => {
//     if (!grouped[c.type]) grouped[c.type] = [];
//     grouped[c.type].push(c);
//   });

//   const timeStr = new Date(student.last_active).toLocaleString("en-IN", {
//     day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit"
//   });

//   return (
//     <div style={{ minHeight:"100vh", background:"#f1f5f9" }}>

//       {/* Header */}
//       <div style={{ background:`linear-gradient(135deg,${color},${color}cc)`, padding:"20px 16px 28px" }}>
//         <div style={{ maxWidth:620, margin:"0 auto" }}>
//           <button onClick={() => router.push("/admin/dashboard")}
//             style={{ color:"rgba(255,255,255,0.8)", background:"none", border:"none", cursor:"pointer", fontSize:13, marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
//             ← Back to Dashboard
//           </button>

//           <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
//             <div style={{ width:52, height:52, borderRadius:16, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:800, color:"white" }}>
//               {student.name.charAt(0).toUpperCase()}
//             </div>
//             <div>
//               <h1 style={{ fontSize:22, fontWeight:800, color:"white" }}>{student.name}</h1>
//               <div style={{ display:"flex", gap:10, marginTop:2 }}>
//                 <span style={{ fontSize:11, color:"rgba(255,255,255,0.8)", fontFamily:"monospace" }}>Roll: {student.roll_number}</span>
//                 <span style={{ fontSize:11, color:"rgba(255,255,255,0.8)" }}>Class {student.class}{student.section}</span>
//               </div>
//               <p style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:2 }}>Last active: {timeStr}</p>
//             </div>
//           </div>

//           {/* Stats */}
//           <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:14, padding:"14px 16px" }}>
//             <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:10, marginBottom:12 }}>
//               {[
//                 { label:"Done ✓",   value:doneCount,                                 color:"#4ade80" },
//                 { label:"Reading",  value:readCount,                                 color:"#fcd34d" },
//                 { label:"Pending",  value:chapters.length - doneCount - readCount,   color:"#f87171" },
//                 { label:"Progress", value:`${pct}%`,                                 color:"white"   },
//               ].map(s => (
//                 <div key={s.label} style={{ textAlign:"center" }}>
//                   <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.value}</div>
//                   <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)", marginTop:1 }}>{s.label}</div>
//                 </div>
//               ))}
//             </div>
//             <div style={{ height:8, background:"rgba(255,255,255,0.2)", borderRadius:4, overflow:"hidden" }}>
//               <div style={{ height:"100%", width:`${pct}%`, background:"white", borderRadius:4, transition:"width 0.5s" }} />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div style={{ maxWidth:620, margin:"0 auto", padding:16 }}>

//         {/* ── Action buttons ── */}
//         <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>

//           {/* Export CSV */}
//           <button onClick={exportToCSV} disabled={exporting}
//             style={{ flex:1, minWidth:140, padding:"11px 16px", borderRadius:12, border:"none",
//               background:"linear-gradient(135deg,#6366f1,#4f46e5)", color:"white",
//               fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
//             {exporting ? "⏳ Exporting..." : "📊 Export to Excel"}
//           </button>

//           {/* WhatsApp */}
//           <button onClick={sendWhatsApp}
//             style={{ flex:1, minWidth:140, padding:"11px 16px", borderRadius:12, border:"none",
//               background: whatsappSent ? "#10b981" : "linear-gradient(135deg,#25d366,#128c7e)",
//               color:"white", fontSize:13, fontWeight:700, cursor:"pointer",
//               display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"background 0.3s" }}>
//             {whatsappSent ? "✓ Opened WhatsApp!" : "📱 Share via WhatsApp"}
//           </button>
//         </div>

//         {/* ── Teacher Notes / Remarks ── */}
//         <div style={{ background:"white", borderRadius:16, padding:18, marginBottom:20, border:"1px solid #e2e8f0" }}>
//           <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
//             <span style={{ fontSize:18 }}>📝</span>
//             <div>
//               <h3 style={{ fontSize:14, fontWeight:700, color:"#1e293b" }}>Teacher Notes</h3>
//               <p style={{ fontFamily:"'Noto Sans Kannada',sans-serif", fontSize:11, color:"#64748b" }}>
//                 ಶಿಕ್ಷಕರ ಟಿಪ್ಪಣಿ
//               </p>
//             </div>
//             {savedRemark && (
//               <span style={{ marginLeft:"auto", fontSize:10, padding:"2px 10px", borderRadius:20, background:"#f0fdf4", color:"#16a34a", border:"1px solid #86efac" }}>
//                 ✓ Saved
//               </span>
//             )}
//           </div>

//           <textarea
//             value={remark}
//             onChange={e => setRemark(e.target.value)}
//             placeholder={`Add notes for ${student.name}...\n\nExamples:\n• Needs extra help with poems\n• Very hardworking, completed ahead of schedule\n• Parent meeting needed\n• Good improvement this month`}
//             rows={5}
//             style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:13, fontFamily:"inherit", resize:"vertical", outline:"none", color:"#1e293b", lineHeight:1.6, transition:"border 0.2s" }}
//             onFocus={e => (e.target.style.borderColor = color)}
//             onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
//           />

//           <div style={{ display:"flex", justifyContent:"flex-end", marginTop:10, gap:8, alignItems:"center" }}>
//             {remarkSaved && (
//               <span style={{ fontSize:12, color:"#10b981", fontWeight:600 }}>✓ Note saved!</span>
//             )}
//             <button
//               onClick={saveRemark}
//               disabled={savingRemark || !remark.trim() || remark === savedRemark}
//               style={{ padding:"8px 20px", borderRadius:10, border:"none",
//                 background: (!remark.trim() || remark === savedRemark) ? "#e2e8f0" : `linear-gradient(135deg,${color},${color}cc)`,
//                 color: (!remark.trim() || remark === savedRemark) ? "#94a3b8" : "white",
//                 fontSize:13, fontWeight:700, cursor: (!remark.trim() || remark === savedRemark) ? "not-allowed" : "pointer" }}>
//               {savingRemark ? "Saving..." : "Save Note"}
//             </button>
//           </div>
//         </div>

//         {/* ── Chapter progress (read-only) ── */}
//         <div style={{ marginBottom:8 }}>
//           <h3 style={{ fontSize:13, fontWeight:700, color:"#475569", marginBottom:12 }}>
//             📖 Chapter-wise Progress
//           </h3>
//         </div>

//         {Object.entries(grouped).map(([type, chs]) => (
//           <div key={type} style={{ marginBottom:18 }}>
//             <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>
//               {TYPE_LABELS[type]} ({chs.length})
//             </div>

//             <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
//               {chs.map((chapter, i) => {
//                 const status = progress[chapter.id] || "not_started";
//                 const sc = STATUS_COLORS[status];
//                 return (
//                   <div key={chapter.id}
//                     style={{ background:"white", borderRadius:12, padding:"11px 14px", border:"1px solid #e2e8f0", display:"flex", alignItems:"center", gap:12, borderLeft:`3px solid ${sc}` }}>
//                     <div style={{ width:22, height:22, borderRadius:6, background:`${sc}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:sc, flexShrink:0 }}>
//                       {i+1}
//                     </div>
//                     <div style={{ flex:1, minWidth:0 }}>
//                       <p style={{ fontSize:13, color: status === "done" ? "#94a3b8" : "#1e293b", textDecoration: status === "done" ? "line-through" : "none", marginBottom:2 }}>
//                         {chapter.title}
//                       </p>
//                       <a href={chapter.kseebUrl} target="_blank" rel="noopener noreferrer"
//                         style={{ fontSize:10, color:"#6366f1", textDecoration:"none", fontFamily:"monospace" }}>
//                         📖 KSEEB Solutions ↗
//                       </a>
//                     </div>
//                     <span style={{ padding:"3px 10px", borderRadius:20, background:`${sc}15`, color:sc, fontSize:11, fontWeight:600, whiteSpace:"nowrap", flexShrink:0 }}>
//                       {STATUS_LABELS[status]}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}

//         <p style={{ textAlign:"center", fontSize:11, color:"#94a3b8", paddingBottom:24, marginTop:8 }}>
//           Pariksha Track · ಪರೀಕ್ಷಾ ಟ್ರ್ಯಾಕ್
//         </p>
//       </div>
//     </div>
//   );
// }
"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { allSubjects, STATUS_COLORS, STATUS_LABELS, TYPE_LABELS } from "@/lib/chapters";
import { englishChapters } from "@/lib";

export default function StudentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [student, setStudent]     = useState<any>(null);
  const [progress, setProgress]   = useState<Record<string, string>>({});
  const [remark, setRemark]       = useState("");
  const [savedRemark, setSavedRemark] = useState("");
  const [savingRemark, setSavingRemark] = useState(false);
  const [remarkSaved, setRemarkSaved]  = useState(false);
  const [loading, setLoading]     = useState(true);
  const [exporting, setExporting] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("pt_admin");
    if (!isAdmin) { router.replace("/admin"); return; }
    loadData();
  }, [id]);

  const loadData = async () => {
    const { data: s } = await supabase.from("students").select("*").eq("id", id).single();
    if (!s) { router.replace("/admin/dashboard"); return; }
    setStudent(s);

    const { data: prog } = await supabase
      .from("progress").select("chapter_id, status").eq("student_id", id);
    const map: Record<string, string> = {};
    (prog || []).forEach((p: any) => { map[p.chapter_id] = p.status; });
    setProgress(map);

    // Load existing remark
    const { data: rem } = await supabase
      .from("remarks").select("teacher_note").eq("student_id", id).single();
    if (rem) { setRemark(rem.teacher_note); setSavedRemark(rem.teacher_note); }

    setLoading(false);
  };

  // ── Save remark ────────────────────────────────────────────
  const saveRemark = async () => {
    if (!remark.trim()) return;
    setSavingRemark(true);
    await supabase.from("remarks").upsert(
      { student_id: id, teacher_note: remark.trim(), updated_at: new Date().toISOString() },
      { onConflict: "student_id" }
    );
    setSavedRemark(remark.trim());
    setSavingRemark(false);
    setRemarkSaved(true);
    setTimeout(() => setRemarkSaved(false), 2000);
  };

  // ── Export to CSV (opens as Excel) ────────────────────────
  const exportToCSV = () => {
    if (!student) return;
    setExporting(true);

    const subject = englishChapters[student.class];
    const rows = [
      ["Pariksha Track — Student Progress Report"],
      [""],
      ["Student Name", student.name],
      ["Roll Number", student.roll_number],
      ["Class", `${student.class}${student.section}`],
      ["Last Active", new Date(student.last_active).toLocaleString("en-IN")],
      ["Teacher Note", savedRemark || "None"],
      [""],
      ["#", "Chapter", "Type", "Status", "KSEEB Solutions Link"],
    ];

    subject.chapters.forEach((ch, i) => {
      const status = progress[ch.id] || "not_started";
      rows.push([
        String(i + 1),
        ch.title,
        ch.type.charAt(0).toUpperCase() + ch.type.slice(1),
        STATUS_LABELS[status],
        ch.kseebUrl,
      ]);
    });

    const done    = subject.chapters.filter(c => progress[c.id] === "done").length;
    const reading = subject.chapters.filter(c => progress[c.id] === "reading").length;
    const pct     = Math.round((done / subject.chapters.length) * 100);

    rows.push([""], ["Summary", "", "", ""]);
    rows.push(["Total Chapters", String(subject.chapters.length)]);
    rows.push(["Completed", String(done)]);
    rows.push(["Reading", String(reading)]);
    rows.push(["Not Started", String(subject.chapters.length - done - reading)]);
    rows.push(["Progress %", `${pct}%`]);

    const csv     = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob    = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url     = URL.createObjectURL(blob);
    const link    = document.createElement("a");
    link.href     = url;
    link.download = `${student.name}_${student.class}th_English_Progress.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  // ── WhatsApp alert ─────────────────────────────────────────
  const sendWhatsApp = () => {
    if (!student) return;
    const subject = englishChapters[student.class];
    const done    = subject.chapters.filter(c => progress[c.id] === "done").length;
    const pct     = Math.round((done / subject.chapters.length) * 100);

    const msg = encodeURIComponent(
      `📚 *Pariksha Track — Progress Report*\n\n` +
      `Student: *${student.name}*\n` +
      `Roll No: ${student.roll_number} | Class: ${student.class}${student.section}\n\n` +
      `English Progress: *${pct}%* complete\n` +
      `✅ Done: ${done}/${subject.chapters.length} chapters\n` +
      `📖 Reading: ${subject.chapters.filter(c => progress[c.id] === "reading").length} chapters\n` +
      (savedRemark ? `\n📝 Teacher note: ${savedRemark}\n` : "") +
      `\nLast active: ${new Date(student.last_active).toLocaleString("en-IN")}`
    );

    window.open(`https://wa.me/?text=${msg}`, "_blank");
    setWhatsappSent(true);
    setTimeout(() => setWhatsappSent(false), 3000);
  };

  if (loading || !student) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  const subjects  = allSubjects[student.class] || [];
  const subject   = subjects[0];
  const chapters  = subjects.flatMap(s => s.chapters);
  const doneCount = chapters.filter(c => progress[c.id] === "done").length;
  const readCount = chapters.filter(c => progress[c.id] === "reading").length;
  const pct       = Math.round((doneCount / chapters.length) * 100);
  const color     = subject.color;
  const pctColor  = pct >= 80 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444";

  const grouped: Record<string, typeof chapters> = {};
  chapters.forEach(c => {
    if (!grouped[c.type]) grouped[c.type] = [];
    grouped[c.type].push(c);
  });

  const timeStr = new Date(student.last_active).toLocaleString("en-IN", {
    day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit"
  });

  return (
    <div style={{ minHeight:"100vh", background:"#f1f5f9" }}>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${color},${color}cc)`, padding:"20px 16px 28px" }}>
        <div style={{ maxWidth:620, margin:"0 auto" }}>
          <button onClick={() => router.push("/admin/dashboard")}
            style={{ color:"rgba(255,255,255,0.8)", background:"none", border:"none", cursor:"pointer", fontSize:13, marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
            ← Back to Dashboard
          </button>

          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
            <div style={{ width:52, height:52, borderRadius:16, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:800, color:"white" }}>
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, color:"white" }}>{student.name}</h1>
              <div style={{ display:"flex", gap:10, marginTop:2 }}>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.8)", fontFamily:"monospace" }}>Roll: {student.roll_number}</span>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.8)" }}>Class {student.class}{student.section}</span>
              </div>
              <p style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:2 }}>Last active: {timeStr}</p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:14, padding:"14px 16px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:10, marginBottom:12 }}>
              {[
                { label:"Done ✓",   value:doneCount,                                 color:"#4ade80" },
                { label:"Reading",  value:readCount,                                 color:"#fcd34d" },
                { label:"Pending",  value:chapters.length - doneCount - readCount,   color:"#f87171" },
                { label:"Progress", value:`${pct}%`,                                 color:"white"   },
              ].map(s => (
                <div key={s.label} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.value}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)", marginTop:1 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ height:8, background:"rgba(255,255,255,0.2)", borderRadius:4, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, background:"white", borderRadius:4, transition:"width 0.5s" }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:620, margin:"0 auto", padding:16 }}>

        {/* ── Action buttons ── */}
        <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>

          {/* Export CSV */}
          <button onClick={exportToCSV} disabled={exporting}
            style={{ flex:1, minWidth:140, padding:"11px 16px", borderRadius:12, border:"none",
              background:"linear-gradient(135deg,#6366f1,#4f46e5)", color:"white",
              fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            {exporting ? "⏳ Exporting..." : "📊 Export to Excel"}
          </button>

          {/* WhatsApp */}
          <button onClick={sendWhatsApp}
            style={{ flex:1, minWidth:140, padding:"11px 16px", borderRadius:12, border:"none",
              background: whatsappSent ? "#10b981" : "linear-gradient(135deg,#25d366,#128c7e)",
              color:"white", fontSize:13, fontWeight:700, cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"background 0.3s" }}>
            {whatsappSent ? "✓ Opened WhatsApp!" : "📱 Share via WhatsApp"}
          </button>
        </div>

        {/* ── Teacher Notes / Remarks ── */}
        <div style={{ background:"white", borderRadius:16, padding:18, marginBottom:20, border:"1px solid #e2e8f0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <span style={{ fontSize:18 }}>📝</span>
            <div>
              <h3 style={{ fontSize:14, fontWeight:700, color:"#1e293b" }}>Teacher Notes</h3>
              <p style={{ fontFamily:"'Noto Sans Kannada',sans-serif", fontSize:11, color:"#64748b" }}>
                ಶಿಕ್ಷಕರ ಟಿಪ್ಪಣಿ
              </p>
            </div>
            {savedRemark && (
              <span style={{ marginLeft:"auto", fontSize:10, padding:"2px 10px", borderRadius:20, background:"#f0fdf4", color:"#16a34a", border:"1px solid #86efac" }}>
                ✓ Saved
              </span>
            )}
          </div>

          <textarea
            value={remark}
            onChange={e => setRemark(e.target.value)}
            placeholder={`Add notes for ${student.name}...\n\nExamples:\n• Needs extra help with poems\n• Very hardworking, completed ahead of schedule\n• Parent meeting needed\n• Good improvement this month`}
            rows={5}
            style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:13, fontFamily:"inherit", resize:"vertical", outline:"none", color:"#1e293b", lineHeight:1.6, transition:"border 0.2s" }}
            onFocus={e => (e.target.style.borderColor = color)}
            onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
          />

          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:10, gap:8, alignItems:"center" }}>
            {remarkSaved && (
              <span style={{ fontSize:12, color:"#10b981", fontWeight:600 }}>✓ Note saved!</span>
            )}
            <button
              onClick={saveRemark}
              disabled={savingRemark || !remark.trim() || remark === savedRemark}
              style={{ padding:"8px 20px", borderRadius:10, border:"none",
                background: (!remark.trim() || remark === savedRemark) ? "#e2e8f0" : `linear-gradient(135deg,${color},${color}cc)`,
                color: (!remark.trim() || remark === savedRemark) ? "#94a3b8" : "white",
                fontSize:13, fontWeight:700, cursor: (!remark.trim() || remark === savedRemark) ? "not-allowed" : "pointer" }}>
              {savingRemark ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>

        {/* ── Chapter progress (read-only) ── */}
        <div style={{ marginBottom:8 }}>
          <h3 style={{ fontSize:13, fontWeight:700, color:"#475569", marginBottom:12 }}>
            📖 Chapter-wise Progress
          </h3>
        </div>

        {Object.entries(grouped).map(([type, chs]) => (
          <div key={type} style={{ marginBottom:18 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>
              {TYPE_LABELS[type]} ({chs.length})
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {chs.map((chapter, i) => {
                const status = progress[chapter.id] || "not_started";
                const sc = STATUS_COLORS[status];
                return (
                  <div key={chapter.id}
                    style={{ background:"white", borderRadius:12, padding:"11px 14px", border:"1px solid #e2e8f0", display:"flex", alignItems:"center", gap:12, borderLeft:`3px solid ${sc}` }}>
                    <div style={{ width:22, height:22, borderRadius:6, background:`${sc}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:sc, flexShrink:0 }}>
                      {i+1}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:13, color: status === "done" ? "#94a3b8" : "#1e293b", textDecoration: status === "done" ? "line-through" : "none", marginBottom:2 }}>
                        {chapter.title}
                      </p>
                      <a href={chapter.kseebUrl} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize:10, color:"#6366f1", textDecoration:"none", fontFamily:"monospace" }}>
                        📖 KSEEB Solutions ↗
                      </a>
                    </div>
                    <span style={{ padding:"3px 10px", borderRadius:20, background:`${sc}15`, color:sc, fontSize:11, fontWeight:600, whiteSpace:"nowrap", flexShrink:0 }}>
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <p style={{ textAlign:"center", fontSize:11, color:"#94a3b8", paddingBottom:24, marginTop:8 }}>
          Pariksha Track · ಪರೀಕ್ಷಾ ಟ್ರ್ಯಾಕ್
        </p>
      </div>
    </div>
  );
}