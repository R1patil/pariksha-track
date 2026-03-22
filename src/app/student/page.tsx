// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { englishChapters, STATUS_COLORS, STATUS_LABELS, TYPE_LABELS } from "@/lib/chapters";

// type Status = "not_started" | "reading" | "done";

// interface ProgressMap {
//   [chapterId: string]: Status;
// }

// export default function StudentDashboard() {
//   const [student, setStudent]   = useState<any>(null);
//   const [progress, setProgress] = useState<ProgressMap>({});
//   const [loading, setLoading]   = useState(true);
//   const [saving, setSaving]     = useState<string | null>(null);
//   const router = useRouter();

//   // Load student from localStorage
//   useEffect(() => {
//     const raw = localStorage.getItem("pt_student");
//     if (!raw) { router.replace("/login"); return; }
//     const s = JSON.parse(raw);
//     setStudent(s);
//     loadProgress(s.id, s.class);
//   }, [router]);

//   const loadProgress = useCallback(async (studentId: string, cls: string) => {
//     const { data } = await supabase
//       .from("progress")
//       .select("chapter_id, status")
//       .eq("student_id", studentId);

//     const map: ProgressMap = {};
//     (data || []).forEach((r: any) => { map[r.chapter_id] = r.status; });
//     setProgress(map);
//     setLoading(false);
//   }, []);

//   const updateStatus = async (chapterId: string, chapterTitle: string, newStatus: Status) => {
//     if (!student) return;
//     setSaving(chapterId);

//     // Optimistic update
//     setProgress(prev => ({ ...prev, [chapterId]: newStatus }));

//     // Save to Supabase
//     await supabase.from("progress").upsert({
//       student_id:    student.id,
//       subject:       `english_${student.class}`,
//       chapter_id:    chapterId,
//       chapter_title: chapterTitle,
//       status:        newStatus,
//       updated_at:    new Date().toISOString(),
//     }, { onConflict: "student_id,subject,chapter_id" });

//     // Update last_active
//     await supabase.from("students")
//       .update({ last_active: new Date().toISOString() })
//       .eq("id", student.id);

//     setSaving(null);
//   };

//   const logout = () => {
//     localStorage.removeItem("pt_student");
//     router.replace("/login");
//   };

//   if (loading || !student) {
//     return (
//       <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", flexDirection:"column", gap:12 }}>
//         <div className="spinner" />
//         <p style={{ fontSize:13, color:"#64748b" }}>Loading your progress...</p>
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

//   // Group chapters by type
//   const grouped: Record<string, typeof chapters> = {};
//   chapters.forEach(c => {
//     if (!grouped[c.type]) grouped[c.type] = [];
//     grouped[c.type].push(c);
//   });

//   const STATUS_CYCLE: Record<Status, Status> = {
//     not_started: "reading",
//     reading:     "done",
//     done:        "not_started",
//   };

//   return (
//     <div style={{ minHeight:"100vh", background:"#f1f5f9" }}>
//       {/* Header */}
//       <div style={{ background:`linear-gradient(135deg,${color},${color}cc)`, padding:"20px 16px 28px" }}>
//         <div style={{ maxWidth:540, margin:"0 auto" }}>
//           <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
//             <div>
//               <p style={{ fontSize:11, color:"rgba(255,255,255,0.75)", fontFamily:"monospace", marginBottom:3 }}>
//                 Roll No: {student.roll_number} · Class {student.class}{student.section}
//               </p>
//               <h1 style={{ fontSize:22, fontWeight:800, color:"white", marginBottom:2 }}>
//                 👋 {student.name}
//               </h1>
//               <p style={{ fontSize:13, color:"rgba(255,255,255,0.85)" }}>
//                 English — {student.class}th Standard
//               </p>
//             </div>
//             <button onClick={logout} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.4)", background:"rgba(255,255,255,0.15)", color:"white", fontSize:11, cursor:"pointer" }}>
//               Logout
//             </button>
//           </div>

//           {/* Progress bar */}
//           <div style={{ marginTop:18, background:"rgba(255,255,255,0.2)", borderRadius:12, padding:"12px 16px" }}>
//             <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
//               <span style={{ fontSize:12, color:"white", fontWeight:600 }}>
//                 Progress / ಪ್ರಗತಿ
//               </span>
//               <span style={{ fontSize:12, color:"white", fontWeight:700 }}>
//                 {doneCount}/{chapters.length} Done ({pct}%)
//               </span>
//             </div>
//             <div style={{ height:8, background:"rgba(255,255,255,0.3)", borderRadius:4, overflow:"hidden" }}>
//               <div style={{ height:"100%", width:`${pct}%`, background:"white", borderRadius:4, transition:"width 0.5s ease" }} />
//             </div>
//             <div style={{ display:"flex", gap:14, marginTop:8 }}>
//               <span style={{ fontSize:11, color:"rgba(255,255,255,0.85)" }}>🟢 {doneCount} done</span>
//               <span style={{ fontSize:11, color:"rgba(255,255,255,0.85)" }}>🟡 {readingCount} reading</span>
//               <span style={{ fontSize:11, color:"rgba(255,255,255,0.85)" }}>⚪ {chapters.length - doneCount - readingCount} not started</span>
//             </div>
//             {pct === 100 && (
//               <p style={{ textAlign:"center", marginTop:8, fontSize:13, fontWeight:700, color:"white" }}>
//                 🎉 Excellent! All chapters complete!
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Chapters */}
//       <div style={{ maxWidth:540, margin:"0 auto", padding:16 }}>
//         <p style={{ fontSize:12, color:"#64748b", marginBottom:14, textAlign:"center" }}>
//           Tap a button to update your status: Not Started → Reading → Done ✓
//         </p>

//         {Object.entries(grouped).map(([type, chs]) => (
//           <div key={type} style={{ marginBottom:20 }}>
//             {/* Section heading */}
//             <div style={{ fontSize:12, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8, paddingLeft:4 }}>
//               {TYPE_LABELS[type]} ({chs.length})
//             </div>

//             <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
//               {chs.map((chapter, i) => {
//                 const status  = (progress[chapter.id] as Status) || "not_started";
//                 const isSaving = saving === chapter.id;
//                 const statColor = STATUS_COLORS[status];

//                 return (
//                   <div key={chapter.id} className="fade-up"
//                     style={{ background:"white", borderRadius:14, padding:"13px 14px", border:"1px solid #e2e8f0", display:"flex", alignItems:"center", gap:12,
//                       animationDelay:`${i * 30}ms`, borderLeft:`3px solid ${statColor}` }}>

//                     {/* Number */}
//                     <div style={{ width:26, height:26, borderRadius:8, background:`${statColor}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:statColor, flexShrink:0 }}>
//                       {i+1}
//                     </div>

//                     {/* Title + Solutions link */}
//                     <div style={{ flex:1, minWidth:0 }}>
//                       <p style={{ fontSize:13, fontWeight:600, color: status === "done" ? "#94a3b8" : "#1e293b", textDecoration: status === "done" ? "line-through" : "none", lineHeight:1.4, marginBottom:3 }}>
//                         {chapter.title}
//                       </p>
//                       <a href={chapter.kseebUrl} target="_blank" rel="noopener noreferrer"
//                         style={{ fontSize:11, color:"#6366f1", textDecoration:"none", fontFamily:"monospace" }}>
//                         📖 KSEEB Solutions ↗
//                       </a>
//                     </div>

//                     {/* Status button */}
//                     <button
//                       onClick={() => updateStatus(chapter.id, chapter.title, STATUS_CYCLE[status])}
//                       disabled={isSaving}
//                       style={{ flexShrink:0, padding:"5px 12px", borderRadius:20, border:`1.5px solid ${statColor}`, background:`${statColor}15`, color:statColor, fontSize:11, fontWeight:600, cursor:"pointer", minWidth:90, textAlign:"center", transition:"all 0.2s" }}
//                     >
//                       {isSaving ? "..." : STATUS_LABELS[status]}
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}

//         <p style={{ textAlign:"center", fontSize:11, color:"#94a3b8", marginTop:8, paddingBottom:24 }}>
//           Your progress is saved automatically ✓
//         </p>
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { allSubjects, STATUS_COLORS, STATUS_LABELS, TYPE_LABELS } from "@/lib/chapters";

// type Status = "not_started" | "reading" | "done";
// type ProgressMap = Record<string, Status>;

// const STATUS_CYCLE: Record<Status, Status> = {
//   not_started: "reading",
//   reading:     "done",
//   done:        "not_started",
// };

// export default function StudentDashboard() {
//   const [student, setStudent]      = useState<any>(null);
//   const [progress, setProgress]    = useState<ProgressMap>({});
//   const [activeSubject, setActive] = useState(0);
//   const [loading, setLoading]      = useState(true);
//   const [saving, setSaving]        = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const raw = localStorage.getItem("pt_student");
//     if (!raw) { router.replace("/login"); return; }
//     const s = JSON.parse(raw);
//     setStudent(s);
//     loadProgress(s.id);
//   }, [router]);

//   const loadProgress = useCallback(async (studentId: string) => {
//     const { data } = await supabase
//       .from("progress").select("chapter_id, status").eq("student_id", studentId);
//     const map: ProgressMap = {};
//     (data || []).forEach((r: any) => { map[r.chapter_id] = r.status; });
//     setProgress(map);
//     setLoading(false);
//   }, []);

//   const updateStatus = async (chapterId: string, chapterTitle: string, subjectId: string, newStatus: Status) => {
//     if (!student) return;
//     setSaving(chapterId);
//     setProgress(prev => ({ ...prev, [chapterId]: newStatus }));
//     await supabase.from("progress").upsert({
//       student_id: student.id, subject: subjectId,
//       chapter_id: chapterId, chapter_title: chapterTitle,
//       status: newStatus, updated_at: new Date().toISOString(),
//     }, { onConflict: "student_id,subject,chapter_id" });
//     await supabase.from("students")
//       .update({ last_active: new Date().toISOString() }).eq("id", student.id);
//     setSaving(null);
//   };

//   const logout = () => { localStorage.removeItem("pt_student"); router.replace("/login"); };

//   if (loading || !student) {
//     return (
//       <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", flexDirection:"column", gap:12 }}>
//         <div className="spinner" />
//         <p style={{ fontSize:13, color:"#64748b" }}>Loading your progress...</p>
//       </div>
//     );
//   }

//   const subjects  = allSubjects[student.class] || [];
//   const subject   = subjects[activeSubject] || subjects[0];
//   if (!subject) return null;

//   const chapters  = subject.chapters;
//   const doneCount = chapters.filter(c => progress[c.id] === "done").length;
//   const readCount = chapters.filter(c => progress[c.id] === "reading").length;
//   const pct       = Math.round((doneCount / chapters.length) * 100);

//   const grouped: Record<string, typeof chapters> = {};
//   chapters.forEach(c => {
//     if (!grouped[c.type]) grouped[c.type] = [];
//     grouped[c.type].push(c);
//   });

//   const allChs  = subjects.flatMap(s => s.chapters);
//   const totDone = allChs.filter(c => progress[c.id] === "done").length;
//   const totPct  = Math.round((totDone / allChs.length) * 100);

//   return (
//     <div style={{ minHeight:"100vh", background:"#f1f5f9" }}>

//       {/* Header */}
//       <div style={{ background:`linear-gradient(135deg,${subject.color},${subject.color}cc)`, padding:"18px 16px 22px" }}>
//         <div style={{ maxWidth:540, margin:"0 auto" }}>
//           <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
//             <div>
//               <p style={{ fontSize:11, color:"rgba(255,255,255,0.75)", fontFamily:"monospace" }}>
//                 Roll: {student.roll_number} · Class {student.class}{student.section}
//               </p>
//               <h1 style={{ fontSize:20, fontWeight:800, color:"white", marginTop:2 }}>
//                 👋 {student.name}
//               </h1>
//               <p style={{ fontSize:11, color:"rgba(255,255,255,0.8)", marginTop:2 }}>
//                 Overall: {totDone}/{allChs.length} chapters · {totPct}% complete
//               </p>
//             </div>
//             <button onClick={logout} style={{ padding:"5px 12px", borderRadius:20, border:"1px solid rgba(255,255,255,0.4)", background:"rgba(255,255,255,0.15)", color:"white", fontSize:11, cursor:"pointer" }}>
//               Logout
//             </button>
//           </div>

//           {/* Subject tabs */}
//           <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:2 }}>
//             {subjects.map((s, i) => {
//               const sDone = s.chapters.filter(c => progress[c.id] === "done").length;
//               const sPct  = Math.round((sDone / s.chapters.length) * 100);
//               const isAct = i === activeSubject;
//               return (
//                 <button key={s.id} onClick={() => setActive(i)} style={{
//                   flexShrink:0, padding:"7px 14px", borderRadius:20,
//                   border:`2px solid ${isAct ? "white" : "rgba(255,255,255,0.35)"}`,
//                   background: isAct ? "white" : "rgba(255,255,255,0.12)",
//                   color: isAct ? subject.color : "white",
//                   fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.2s",
//                   display:"flex", alignItems:"center", gap:5,
//                 }}>
//                   <span>{s.icon}</span>
//                   <span>{s.title.split(" ")[0]}</span>
//                   <span style={{ fontSize:10, opacity: isAct ? 1 : 0.8 }}>{sPct}%</span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Active subject progress */}
//       <div style={{ maxWidth:540, margin:"0 auto", padding:"12px 16px 0" }}>
//         <div style={{ background:"white", borderRadius:14, padding:"12px 16px", border:"1px solid #e2e8f0" }}>
//           <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
//             <span style={{ fontSize:13, fontWeight:700, color:"#1e293b" }}>
//               {subject.icon} {subject.title}
//             </span>
//             <span style={{ fontSize:13, fontWeight:700, color:subject.color }}>{pct}%</span>
//           </div>
//           <div style={{ height:6, background:"#f1f5f9", borderRadius:3, overflow:"hidden" }}>
//             <div style={{ height:"100%", width:`${pct}%`, background:subject.color, borderRadius:3, transition:"width 0.5s" }} />
//           </div>
//           <div style={{ display:"flex", gap:12, marginTop:6 }}>
//             <span style={{ fontSize:10, color:"#10b981" }}>✓ {doneCount} done</span>
//             <span style={{ fontSize:10, color:"#f59e0b" }}>📖 {readCount} reading</span>
//             <span style={{ fontSize:10, color:"#94a3b8" }}>⚪ {chapters.length - doneCount - readCount} not started</span>
//           </div>
//           {pct === 100 && (
//             <p style={{ textAlign:"center", marginTop:8, fontSize:12, fontWeight:700, color:subject.color }}>
//               🎉 {subject.title} complete! Switch to another subject.
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Chapters */}
//       <div style={{ maxWidth:540, margin:"0 auto", padding:"12px 16px 32px" }}>
//         <p style={{ fontSize:11, color:"#64748b", marginBottom:12, textAlign:"center" }}>
//           Tap the status to update: Not Started → Reading → Done ✓
//         </p>

//         {Object.entries(grouped).map(([type, chs]) => (
//           <div key={type} style={{ marginBottom:18 }}>
//             <div style={{ fontSize:11, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>
//               {TYPE_LABELS[type]} ({chs.length})
//             </div>
//             <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
//               {chs.map((chapter, i) => {
//                 const status   = (progress[chapter.id] as Status) || "not_started";
//                 const isSaving = saving === chapter.id;
//                 const sc       = STATUS_COLORS[status];
//                 return (
//                   <div key={chapter.id} className="fade-up"
//                     style={{ background:"white", borderRadius:13, padding:"12px 14px",
//                       border:"1px solid #e2e8f0", display:"flex", alignItems:"center", gap:11,
//                       borderLeft:`3px solid ${sc}`, animationDelay:`${i * 25}ms` }}>
//                     <div style={{ width:24, height:24, borderRadius:7, background:`${sc}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:sc, flexShrink:0 }}>
//                       {i+1}
//                     </div>
//                     <div style={{ flex:1, minWidth:0 }}>
//                       <p style={{ fontSize:13, fontWeight:600, color: status === "done" ? "#94a3b8" : "#1e293b", textDecoration: status === "done" ? "line-through" : "none", lineHeight:1.3 }}>
//                         {chapter.kannadaTitle || chapter.title}
//                       </p>
//                       {chapter.kannadaTitle !== chapter.title && (
//                         <p style={{ fontSize:11, color:"#94a3b8", lineHeight:1.3, marginBottom:3 }}>{chapter.title}</p>
//                       )}
//                       <a href={chapter.kseebUrlKannada || chapter.kseebUrl} target="_blank" rel="noopener noreferrer"
//                         style={{ fontSize:10, color:"#6366f1", textDecoration:"none", fontFamily:"monospace" }}>
//                         📖 KSEEB ಪರಿಹಾರಗಳು (Kannada) ↗
//                       </a>
//                     </div>
//                     <button
//                       onClick={() => updateStatus(chapter.id, chapter.title, subject.id, STATUS_CYCLE[status])}
//                       disabled={isSaving}
//                       style={{ flexShrink:0, padding:"5px 11px", borderRadius:20,
//                         border:`1.5px solid ${sc}`, background:`${sc}15`,
//                         color:sc, fontSize:11, fontWeight:600, cursor:"pointer",
//                         minWidth:85, textAlign:"center", transition:"all 0.2s" }}>
//                       {isSaving ? "..." : STATUS_LABELS[status]}
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}

//         <p style={{ textAlign:"center", fontSize:11, color:"#94a3b8" }}>
//           Progress saved automatically ✓ · ಪರೀಕ್ಷಾ ಟ್ರ್ಯಾಕ್
//         </p>
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { allSubjects, STATUS_COLORS, STATUS_LABELS, TYPE_LABELS } from "@/lib/chapters";

// type Status = "not_started" | "reading" | "done";
// type ProgressMap = Record<string, Status>;

// const STATUS_CYCLE: Record<Status, Status> = {
//   not_started: "reading",
//   reading:     "done",
//   done:        "not_started",
// };

// export default function StudentDashboard() {
//   const [student, setStudent]      = useState<any>(null);
//   const [progress, setProgress]    = useState<ProgressMap>({});
//   const [activeSubject, setActive] = useState(0);
//   const [loading, setLoading]      = useState(true);
//   const [saving, setSaving]        = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const raw = localStorage.getItem("pt_student");
//     if (!raw) { router.replace("/login"); return; }
//     const s = JSON.parse(raw);
//     setStudent(s);
//     loadProgress(s.id);
//   }, [router]);

//   const loadProgress = useCallback(async (studentId: string) => {
//     const { data } = await supabase
//       .from("progress").select("chapter_id, status").eq("student_id", studentId);
//     const map: ProgressMap = {};
//     (data || []).forEach((r: any) => { map[r.chapter_id] = r.status; });
//     setProgress(map);
//     setLoading(false);
//   }, []);

//   const updateStatus = async (chapterId: string, chapterTitle: string, subjectId: string, newStatus: Status) => {
//     if (!student) return;
//     setSaving(chapterId);
//     setProgress(prev => ({ ...prev, [chapterId]: newStatus }));
//     await supabase.from("progress").upsert({
//       student_id: student.id, subject: subjectId,
//       chapter_id: chapterId, chapter_title: chapterTitle,
//       status: newStatus, updated_at: new Date().toISOString(),
//     }, { onConflict: "student_id,subject,chapter_id" });
//     await supabase.from("students")
//       .update({ last_active: new Date().toISOString() }).eq("id", student.id);
//     setSaving(null);
//   };

//   const logout = () => { localStorage.removeItem("pt_student"); router.replace("/login"); };

//   if (loading || !student) {
//     return (
//       <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", flexDirection:"column", gap:12 }}>
//         <div className="spinner" />
//         <p style={{ fontSize:13, color:"#64748b" }}>Loading your progress...</p>
//       </div>
//     );
//   }

//   const subjects  = allSubjects[student.class] || [];
//   const subject   = subjects[activeSubject] || subjects[0];
//   if (!subject) return null;

//   const chapters  = subject.chapters;
//   const doneCount = chapters.filter(c => progress[c.id] === "done").length;
//   const readCount = chapters.filter(c => progress[c.id] === "reading").length;
//   const pct       = Math.round((doneCount / chapters.length) * 100);

//   const grouped: Record<string, typeof chapters> = {};
//   chapters.forEach(c => {
//     if (!grouped[c.type]) grouped[c.type] = [];
//     grouped[c.type].push(c);
//   });

//   const allChs  = subjects.flatMap(s => s.chapters);
//   const totDone = allChs.filter(c => progress[c.id] === "done").length;
//   const totPct  = Math.round((totDone / allChs.length) * 100);

//   return (
//     <div style={{ minHeight:"100vh", background:"#f1f5f9" }}>

//       {/* Header */}
//       <div style={{ background:`linear-gradient(135deg,${subject.color},${subject.color}cc)`, padding:"18px 16px 22px" }}>
//         <div style={{ maxWidth:540, margin:"0 auto" }}>
//           <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
//             <div>
//               <p style={{ fontSize:11, color:"rgba(255,255,255,0.75)", fontFamily:"monospace" }}>
//                 Roll: {student.roll_number} · Class {student.class}{student.section}
//               </p>
//               <h1 style={{ fontSize:20, fontWeight:800, color:"white", marginTop:2 }}>
//                 👋 {student.name}
//               </h1>
//               <p style={{ fontSize:11, color:"rgba(255,255,255,0.8)", marginTop:2 }}>
//                 Overall: {totDone}/{allChs.length} chapters · {totPct}% complete
//               </p>
//             </div>
//             <button onClick={logout} style={{ padding:"5px 12px", borderRadius:20, border:"1px solid rgba(255,255,255,0.4)", background:"rgba(255,255,255,0.15)", color:"white", fontSize:11, cursor:"pointer" }}>
//               Logout
//             </button>
//           </div>

//           {/* Subject tabs */}
//           <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:2 }}>
//             {subjects.map((s, i) => {
//               const sDone = s.chapters.filter(c => progress[c.id] === "done").length;
//               const sPct  = Math.round((sDone / s.chapters.length) * 100);
//               const isAct = i === activeSubject;
//               return (
//                 <button key={s.id} onClick={() => setActive(i)} style={{
//                   flexShrink:0, padding:"7px 14px", borderRadius:20,
//                   border:`2px solid ${isAct ? "white" : "rgba(255,255,255,0.35)"}`,
//                   background: isAct ? "white" : "rgba(255,255,255,0.12)",
//                   color: isAct ? subject.color : "white",
//                   fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.2s",
//                   display:"flex", alignItems:"center", gap:5,
//                 }}>
//                   <span>{s.icon}</span>
//                   <span>{s.title.split(" ")[0]}</span>
//                   <span style={{ fontSize:10, opacity: isAct ? 1 : 0.8 }}>{sPct}%</span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Active subject progress */}
//       <div style={{ maxWidth:540, margin:"0 auto", padding:"12px 16px 0" }}>
//         <div style={{ background:"white", borderRadius:14, padding:"12px 16px", border:"1px solid #e2e8f0" }}>
//           <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
//             <span style={{ fontSize:13, fontWeight:700, color:"#1e293b" }}>
//               {subject.icon} {subject.title}
//             </span>
//             <span style={{ fontSize:13, fontWeight:700, color:subject.color }}>{pct}%</span>
//           </div>
//           <div style={{ height:6, background:"#f1f5f9", borderRadius:3, overflow:"hidden" }}>
//             <div style={{ height:"100%", width:`${pct}%`, background:subject.color, borderRadius:3, transition:"width 0.5s" }} />
//           </div>
//           <div style={{ display:"flex", gap:12, marginTop:6 }}>
//             <span style={{ fontSize:10, color:"#10b981" }}>✓ {doneCount} done</span>
//             <span style={{ fontSize:10, color:"#f59e0b" }}>📖 {readCount} reading</span>
//             <span style={{ fontSize:10, color:"#94a3b8" }}>⚪ {chapters.length - doneCount - readCount} not started</span>
//           </div>
//           {pct === 100 && (
//             <p style={{ textAlign:"center", marginTop:8, fontSize:12, fontWeight:700, color:subject.color }}>
//               🎉 {subject.title} complete! Switch to another subject.
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Chapters */}
//       <div style={{ maxWidth:540, margin:"0 auto", padding:"12px 16px 32px" }}>
//         <p style={{ fontSize:11, color:"#64748b", marginBottom:12, textAlign:"center" }}>
//           Tap the status to update: Not Started → Reading → Done ✓
//         </p>

//         {Object.entries(grouped).map(([type, chs]) => (
//           <div key={type} style={{ marginBottom:18 }}>
//             <div style={{ fontSize:11, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>
//               {TYPE_LABELS[type]} ({chs.length})
//             </div>
//             <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
//               {chs.map((chapter, i) => {
//                 const status   = (progress[chapter.id] as Status) || "not_started";
//                 const isSaving = saving === chapter.id;
//                 const sc       = STATUS_COLORS[status];
//                 return (
//                   <div key={chapter.id} className="fade-up"
//                     style={{ background:"white", borderRadius:13, padding:"12px 14px",
//                       border:"1px solid #e2e8f0", display:"flex", alignItems:"center", gap:11,
//                       borderLeft:`3px solid ${sc}`, animationDelay:`${i * 25}ms` }}>
//                     <div style={{ width:24, height:24, borderRadius:7, background:`${sc}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:sc, flexShrink:0 }}>
//                       {i+1}
//                     </div>
//                     <div style={{ flex:1, minWidth:0 }}>
//                       <p style={{ fontSize:13, fontWeight:600, color: status === "done" ? "#94a3b8" : "#1e293b", textDecoration: status === "done" ? "line-through" : "none", lineHeight:1.3 }}>
//                         {chapter.kannadaTitle || chapter.title}
//                       </p>
//                       {chapter.kannadaTitle !== chapter.title && (
//                         <p style={{ fontSize:11, color:"#94a3b8", lineHeight:1.3, marginBottom:3 }}>{chapter.title}</p>
//                       )}
//                       <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
//                         <a href={chapter.kseebUrlKannada || chapter.kseebUrl} target="_blank" rel="noopener noreferrer"
//                           style={{ fontSize:10, color:"#6366f1", textDecoration:"none", padding:"2px 8px", borderRadius:20, background:"#ede9fe", display:"inline-block" }}>
//                           📖 KSEEB ಉತ್ತರಗಳು ↗
//                         </a>
//                         {chapter.youtubeUrl && (
//                           <a href={chapter.youtubeUrl} target="_blank" rel="noopener noreferrer"
//                             style={{ fontSize:10, color:"#dc2626", textDecoration:"none", padding:"2px 8px", borderRadius:20, background:"#fee2e2", display:"inline-block" }}>
//                             ▶ YouTube ↗
//                           </a>
//                         )}
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => updateStatus(chapter.id, chapter.title, subject.id, STATUS_CYCLE[status])}
//                       disabled={isSaving}
//                       style={{ flexShrink:0, padding:"5px 11px", borderRadius:20,
//                         border:`1.5px solid ${sc}`, background:`${sc}15`,
//                         color:sc, fontSize:11, fontWeight:600, cursor:"pointer",
//                         minWidth:85, textAlign:"center", transition:"all 0.2s" }}>
//                       {isSaving ? "..." : STATUS_LABELS[status]}
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         ))}

//         <p style={{ textAlign:"center", fontSize:11, color:"#94a3b8" }}>
//           Progress saved automatically ✓ · ಪರೀಕ್ಷಾ ಟ್ರ್ಯಾಕ್
//         </p>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { allSubjects, STATUS_COLORS, STATUS_LABELS, TYPE_LABELS } from "@/lib/chapters";
import AIChat from "@/components/AIChat";

type Status = "not_started" | "reading" | "done";
type ProgressMap = Record<string, Status>;

const STATUS_CYCLE: Record<Status, Status> = {
  not_started: "reading",
  reading:     "done",
  done:        "not_started",
};

export default function StudentDashboard() {
  const [student, setStudent]      = useState<any>(null);
  const [progress, setProgress]    = useState<ProgressMap>({});
  const [activeSubject, setActive] = useState(0);
  const [loading, setLoading]      = useState(true);
  const [saving, setSaving]        = useState<string | null>(null);
  const [aiChapter, setAiChapter]  = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem("pt_student");
    if (!raw) { router.replace("/login"); return; }
    const s = JSON.parse(raw);
    setStudent(s);
    loadProgress(s.id);
  }, [router]);

  const loadProgress = useCallback(async (studentId: string) => {
    const { data } = await supabase
      .from("progress").select("chapter_id, status").eq("student_id", studentId);
    const map: ProgressMap = {};
    (data || []).forEach((r: any) => { map[r.chapter_id] = r.status; });
    setProgress(map);
    setLoading(false);
  }, []);

  const updateStatus = async (chapterId: string, chapterTitle: string, subjectId: string, newStatus: Status) => {
    if (!student) return;
    setSaving(chapterId);
    setProgress(prev => ({ ...prev, [chapterId]: newStatus }));
    await supabase.from("progress").upsert({
      student_id: student.id, subject: subjectId,
      chapter_id: chapterId, chapter_title: chapterTitle,
      status: newStatus, updated_at: new Date().toISOString(),
    }, { onConflict: "student_id,subject,chapter_id" });
    await supabase.from("students")
      .update({ last_active: new Date().toISOString() }).eq("id", student.id);
    setSaving(null);
  };

  const logout = () => { localStorage.removeItem("pt_student"); router.replace("/login"); };

  if (loading || !student) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", flexDirection:"column", gap:12 }}>
        <div className="spinner" />
        <p style={{ fontSize:13, color:"#64748b" }}>Loading your progress...</p>
      </div>
    );
  }

  const subjects  = allSubjects[student.class] || [];
  const subject   = subjects[activeSubject] || subjects[0];
  if (!subject) return null;

  const chapters  = subject.chapters;
  const doneCount = chapters.filter(c => progress[c.id] === "done").length;
  const readCount = chapters.filter(c => progress[c.id] === "reading").length;
  const pct       = Math.round((doneCount / chapters.length) * 100);

  const grouped: Record<string, typeof chapters> = {};
  chapters.forEach(c => {
    if (!grouped[c.type]) grouped[c.type] = [];
    grouped[c.type].push(c);
  });

  const allChs  = subjects.flatMap(s => s.chapters);
  const totDone = allChs.filter(c => progress[c.id] === "done").length;
  const totPct  = Math.round((totDone / allChs.length) * 100);

  return (
    <div style={{ minHeight:"100vh", background:"#f1f5f9" }}>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${subject.color},${subject.color}cc)`, padding:"18px 16px 22px" }}>
        <div style={{ maxWidth:540, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
            <div>
              <p style={{ fontSize:11, color:"rgba(255,255,255,0.75)", fontFamily:"monospace" }}>
                Roll: {student.roll_number} · Class {student.class}{student.section}
              </p>
              <h1 style={{ fontSize:20, fontWeight:800, color:"white", marginTop:2 }}>
                👋 {student.name}
              </h1>
              <p style={{ fontSize:11, color:"rgba(255,255,255,0.8)", marginTop:2 }}>
                Overall: {totDone}/{allChs.length} chapters · {totPct}% complete
              </p>
            </div>
            <button onClick={logout} style={{ padding:"5px 12px", borderRadius:20, border:"1px solid rgba(255,255,255,0.4)", background:"rgba(255,255,255,0.15)", color:"white", fontSize:11, cursor:"pointer" }}>
              Logout
            </button>
          </div>

          {/* Subject tabs */}
          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:2 }}>
            {subjects.map((s, i) => {
              const sDone = s.chapters.filter(c => progress[c.id] === "done").length;
              const sPct  = Math.round((sDone / s.chapters.length) * 100);
              const isAct = i === activeSubject;
              return (
                <button key={s.id} onClick={() => setActive(i)} style={{
                  flexShrink:0, padding:"7px 14px", borderRadius:20,
                  border:`2px solid ${isAct ? "white" : "rgba(255,255,255,0.35)"}`,
                  background: isAct ? "white" : "rgba(255,255,255,0.12)",
                  color: isAct ? subject.color : "white",
                  fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.2s",
                  display:"flex", alignItems:"center", gap:5,
                }}>
                  <span>{s.icon}</span>
                  <span>{s.title.split(" ")[0]}</span>
                  <span style={{ fontSize:10, opacity: isAct ? 1 : 0.8 }}>{sPct}%</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active subject progress */}
      <div style={{ maxWidth:540, margin:"0 auto", padding:"12px 16px 0" }}>
        <div style={{ background:"white", borderRadius:14, padding:"12px 16px", border:"1px solid #e2e8f0" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontSize:13, fontWeight:700, color:"#1e293b" }}>
              {subject.icon} {subject.title}
            </span>
            <span style={{ fontSize:13, fontWeight:700, color:subject.color }}>{pct}%</span>
          </div>
          <div style={{ height:6, background:"#f1f5f9", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:subject.color, borderRadius:3, transition:"width 0.5s" }} />
          </div>
          <div style={{ display:"flex", gap:12, marginTop:6 }}>
            <span style={{ fontSize:10, color:"#10b981" }}>✓ {doneCount} done</span>
            <span style={{ fontSize:10, color:"#f59e0b" }}>📖 {readCount} reading</span>
            <span style={{ fontSize:10, color:"#94a3b8" }}>⚪ {chapters.length - doneCount - readCount} not started</span>
          </div>
          {pct === 100 && (
            <p style={{ textAlign:"center", marginTop:8, fontSize:12, fontWeight:700, color:subject.color }}>
              🎉 {subject.title} complete! Switch to another subject.
            </p>
          )}
        </div>
      </div>

      {/* Chapters */}
      <div style={{ maxWidth:540, margin:"0 auto", padding:"12px 16px 32px" }}>
        <p style={{ fontSize:11, color:"#64748b", marginBottom:12, textAlign:"center" }}>
          Tap the status to update: Not Started → Reading → Done ✓
        </p>

        {Object.entries(grouped).map(([type, chs]) => (
          <div key={type} style={{ marginBottom:18 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>
              {TYPE_LABELS[type]} ({chs.length})
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {chs.map((chapter, i) => {
                const status   = (progress[chapter.id] as Status) || "not_started";
                const isSaving = saving === chapter.id;
                const sc       = STATUS_COLORS[status];
                return (
                  <div key={chapter.id} className="fade-up"
                    style={{ background:"white", borderRadius:13, padding:"12px 14px",
                      border:"1px solid #e2e8f0", display:"flex", alignItems:"center", gap:11,
                      borderLeft:`3px solid ${sc}`, animationDelay:`${i * 25}ms` }}>
                    <div style={{ width:24, height:24, borderRadius:7, background:`${sc}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:sc, flexShrink:0 }}>
                      {i+1}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:13, fontWeight:600, color: status === "done" ? "#94a3b8" : "#1e293b", textDecoration: status === "done" ? "line-through" : "none", lineHeight:1.3 }}>
                        {chapter.kannadaTitle || chapter.title}
                      </p>
                      {chapter.kannadaTitle !== chapter.title && (
                        <p style={{ fontSize:11, color:"#94a3b8", lineHeight:1.3, marginBottom:3 }}>{chapter.title}</p>
                      )}
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        <a href={chapter.kseebUrlKannada || chapter.kseebUrl} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize:10, color:"#6366f1", textDecoration:"none", padding:"2px 8px", borderRadius:20, background:"#ede9fe", display:"inline-block" }}>
                          📖 KSEEB ↗
                        </a>
                        {chapter.youtubeUrl && (
                          <a href={chapter.youtubeUrl} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize:10, color:"#dc2626", textDecoration:"none", padding:"2px 8px", borderRadius:20, background:"#fee2e2", display:"inline-block" }}>
                            ▶ YouTube ↗
                          </a>
                        )}
                        <button onClick={() => setAiChapter(chapter)}
                          style={{ fontSize:10, color:"#7c3aed", padding:"2px 8px", borderRadius:20, background:"#f5f3ff", border:"none", cursor:"pointer", display:"inline-block" }}>
                          🤖 AI ಸಹಾಯ
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => updateStatus(chapter.id, chapter.title, subject.id, STATUS_CYCLE[status])}
                      disabled={isSaving}
                      style={{ flexShrink:0, padding:"5px 11px", borderRadius:20,
                        border:`1.5px solid ${sc}`, background:`${sc}15`,
                        color:sc, fontSize:11, fontWeight:600, cursor:"pointer",
                        minWidth:85, textAlign:"center", transition:"all 0.2s" }}>
                      {isSaving ? "..." : STATUS_LABELS[status]}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <p style={{ textAlign:"center", fontSize:11, color:"#94a3b8" }}>
          Progress saved automatically ✓ · ಪರೀಕ್ಷಾ ಟ್ರ್ಯಾಕ್
        </p>
      </div>

      {/* AI Chat Panel */}
      {aiChapter && (
        <AIChat
          chapter={aiChapter}
          subject={subject.title}
          classNum={student.class}
          onClose={() => setAiChapter(null)}
        />
      )}
    </div>
  );
}