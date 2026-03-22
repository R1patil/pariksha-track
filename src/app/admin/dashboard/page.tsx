// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { englishChapters } from "@/lib/chapters";

// interface Student {
//   id: string;
//   name: string;
//   roll_number: string;
//   class: string;
//   section: string;
//   last_active: string;
//   done: number;
//   reading: number;
//   total: number;
//   pct: number;
// }

// export default function AdminDashboard() {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading]   = useState(true);
//   const [filter, setFilter]     = useState<"all"|"8"|"9"|"10">("all");
//   const [search, setSearch]     = useState("");
//   //const [sortBy, setSortBy]     = useState<"name"|"pct"|"last_active">("class");
//   const router = useRouter();
//   const [sortBy, setSortBy] = useState<"name"|"pct"|"last_active"|"class">("class");

//   useEffect(() => {
//     const isAdmin = localStorage.getItem("pt_admin");
//     if (!isAdmin) { router.replace("/admin"); return; }
//     loadStudents();
//   }, [router]);

//   const loadStudents = useCallback(async () => {
//     setLoading(true);
//     // Fetch all students
//     const { data: studs } = await supabase
//       .from("students")
//       .select("*")
//       .order("class")
//       .order("roll_number");

//     if (!studs) { setLoading(false); return; }

//     // Fetch all progress
//     const { data: prog } = await supabase
//       .from("progress")
//       .select("student_id, status");

//     // Build progress counts per student
//     const progMap: Record<string, { done:number; reading:number }> = {};
//     (prog || []).forEach((p: any) => {
//       if (!progMap[p.student_id]) progMap[p.student_id] = { done:0, reading:0 };
//       if (p.status === "done") progMap[p.student_id].done++;
//       else if (p.status === "reading") progMap[p.student_id].reading++;
//     });

//     const enriched: Student[] = studs.map(s => {
//       const total = englishChapters[s.class]?.chapters.length || 16;
//       const counts = progMap[s.id] || { done:0, reading:0 };
//       return {
//         ...s,
//         done:    counts.done,
//         reading: counts.reading,
//         total,
//         pct: Math.round((counts.done / total) * 100),
//       };
//     });

//     setStudents(enriched);
//     setLoading(false);
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("pt_admin");
//     router.replace("/admin");
//   };

//   // Filter + search + sort
//   const filtered = students
//     .filter(s => filter === "all" || s.class === filter)
//     .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.roll_number.includes(search))
//     .sort((a, b) => {
//       if (sortBy === "pct") return b.pct - a.pct;
//       if (sortBy === "last_active") return new Date(b.last_active).getTime() - new Date(a.last_active).getTime();
//       return a.name.localeCompare(b.name);
//     });

//   // Class stats
//   const classStats = ["8","9","10"].map(cls => {
//     const clsStudents = students.filter(s => s.class === cls);
//     const avg = clsStudents.length > 0
//       ? Math.round(clsStudents.reduce((a,s) => a + s.pct, 0) / clsStudents.length)
//       : 0;
//     return { cls, count: clsStudents.length, avg };
//   });

//   const timeAgo = (dt: string) => {
//     const diff = Date.now() - new Date(dt).getTime();
//     const mins = Math.floor(diff / 60000);
//     if (mins < 1) return "Just now";
//     if (mins < 60) return `${mins}m ago`;
//     const hrs = Math.floor(mins / 60);
//     if (hrs < 24) return `${hrs}h ago`;
//     return `${Math.floor(hrs / 24)}d ago`;
//   };

//   const pctColor = (p: number) =>
//     p >= 80 ? "#10b981" : p >= 40 ? "#f59e0b" : "#ef4444";

//   if (loading) {
//     return (
//       <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", flexDirection:"column", gap:12 }}>
//         <div className="spinner" />
//         <p style={{ fontSize:13, color:"#64748b" }}>Loading all students...</p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ minHeight:"100vh", background:"#f1f5f9" }}>
//       {/* Header */}
//       <div style={{ background:"linear-gradient(135deg,#1e293b,#334155)", padding:"20px 16px 24px" }}>
//         <div style={{ maxWidth:800, margin:"0 auto" }}>
//           <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
//             <div>
//               <h1 style={{ fontSize:22, fontWeight:800, color:"white" }}>🏫 Teacher Dashboard</h1>
//               <p style={{ fontFamily:"'Noto Sans Kannada',sans-serif", fontSize:12, color:"rgba(255,255,255,0.7)", marginTop:2 }}>
//                 ಶಿಕ್ಷಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ · {students.length} students
//               </p>
//             </div>
//             <div style={{ display:"flex", gap:8 }}>
//               <button onClick={loadStudents} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.3)", background:"rgba(255,255,255,0.1)", color:"white", fontSize:11, cursor:"pointer" }}>
//                 🔄 Refresh
//               </button>
//               <button onClick={logout} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.3)", background:"rgba(255,255,255,0.1)", color:"white", fontSize:11, cursor:"pointer" }}>
//                 Logout
//               </button>
//             </div>
//           </div>

//           {/* Class summary cards */}
//           <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
//             {classStats.map(({ cls, count, avg }) => (
//               <div key={cls} style={{ background:"rgba(255,255,255,0.1)", borderRadius:12, padding:"12px", textAlign:"center" }}>
//                 <div style={{ fontSize:18, fontWeight:800, color:"white" }}>{cls}th</div>
//                 <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:2 }}>{count} students</div>
//                 <div style={{ fontSize:16, fontWeight:700, color: avg >= 50 ? "#4ade80" : "#fb923c", marginTop:4 }}>{avg}% avg</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Controls */}
//       <div style={{ maxWidth:800, margin:"0 auto", padding:"16px 16px 8px" }}>
//         <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:10 }}>
//           {/* Class filter */}
//           <div style={{ display:"flex", gap:6 }}>
//             {(["all","8","9","10"] as const).map(f => (
//               <button key={f} onClick={() => setFilter(f)}
//                 style={{ padding:"5px 14px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer", background: filter === f ? "#1e293b" : "white", color: filter === f ? "white" : "#64748b", border:`1px solid ${filter === f ? "#1e293b" : "#e2e8f0"}` }}>
//                 {f === "all" ? "All" : `Class ${f}`}
//               </button>
//             ))}
//           </div>

//           {/* Sort */}
//           <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
//             style={{ padding:"5px 12px", borderRadius:20, fontSize:11, border:"1px solid #e2e8f0", background:"white", cursor:"pointer", outline:"none" }}>
//             <option value="name">Sort: Name</option>
//             <option value="pct">Sort: Progress ↓</option>
//             <option value="last_active">Sort: Last Active</option>
//           </select>
//         </div>

//         {/* Search */}
//         <input
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           placeholder="🔍 Search by name or roll number..."
//           style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1px solid #e2e8f0", fontSize:13, outline:"none", background:"white" }}
//         />
//       </div>

//       {/* Student list */}
//       <div style={{ maxWidth:800, margin:"0 auto", padding:"8px 16px 32px" }}>
//         <p style={{ fontSize:11, color:"#94a3b8", marginBottom:10 }}>
//           Showing {filtered.length} students
//         </p>

//         <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
//           {filtered.map(student => (
//             <div key={student.id}
//               onClick={() => router.push(`/admin/student/${student.id}`)}
//               style={{ background:"white", borderRadius:14, padding:"14px 16px", border:"1px solid #e2e8f0", cursor:"pointer", transition:"all 0.15s", display:"flex", alignItems:"center", gap:14 }}
//               onMouseEnter={e => { (e.currentTarget.style.borderColor = "#6366f1"); (e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.1)"); }}
//               onMouseLeave={e => { (e.currentTarget.style.borderColor = "#e2e8f0"); (e.currentTarget.style.boxShadow = "none"); }}
//             >
//               {/* Avatar */}
//               <div style={{ width:40, height:40, borderRadius:12, background:`${pctColor(student.pct)}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:pctColor(student.pct), flexShrink:0 }}>
//                 {student.name.charAt(0).toUpperCase()}
//               </div>

//               {/* Info */}
//               <div style={{ flex:1, minWidth:0 }}>
//                 <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
//                   <span style={{ fontWeight:700, fontSize:14, color:"#1e293b" }}>{student.name}</span>
//                   <span style={{ fontSize:10, padding:"1px 8px", borderRadius:20, background:"#f1f5f9", color:"#64748b", fontFamily:"monospace" }}>
//                     Roll {student.roll_number}
//                   </span>
//                   <span style={{ fontSize:10, padding:"1px 8px", borderRadius:20, background:"#f1f5f9", color:"#64748b" }}>
//                     Class {student.class}{student.section}
//                   </span>
//                 </div>

//                 {/* Mini progress bar */}
//                 <div style={{ display:"flex", alignItems:"center", gap:8 }}>
//                   <div style={{ flex:1, height:5, background:"#f1f5f9", borderRadius:3, overflow:"hidden" }}>
//                     <div style={{ height:"100%", width:`${student.pct}%`, background:pctColor(student.pct), borderRadius:3 }} />
//                   </div>
//                   <span style={{ fontSize:11, fontWeight:700, color:pctColor(student.pct), minWidth:35 }}>
//                     {student.pct}%
//                   </span>
//                 </div>

//                 <div style={{ display:"flex", gap:10, marginTop:4 }}>
//                   <span style={{ fontSize:10, color:"#10b981" }}>✓ {student.done} done</span>
//                   <span style={{ fontSize:10, color:"#f59e0b" }}>📖 {student.reading} reading</span>
//                   <span style={{ fontSize:10, color:"#94a3b8" }}>⚪ {student.total - student.done - student.reading} not started</span>
//                 </div>
//               </div>

//               {/* Last active */}
//               <div style={{ textAlign:"right", flexShrink:0 }}>
//                 <div style={{ fontSize:10, color:"#94a3b8" }}>Last active</div>
//                 <div style={{ fontSize:11, fontWeight:600, color:"#64748b" }}>{timeAgo(student.last_active)}</div>
//                 <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>View →</div>
//               </div>
//             </div>
//           ))}

//           {filtered.length === 0 && (
//             <div style={{ textAlign:"center", padding:40, color:"#94a3b8", fontSize:14 }}>
//               No students found
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { englishChapters } from "@/lib/chapters";

// interface Student {
//   id: string;
//   name: string;
//   roll_number: string;
//   class: string;
//   section: string;
//   last_active: string;
//   done: number;
//   reading: number;
//   total: number;
//   pct: number;
// }

// export default function AdminDashboard() {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading]   = useState(true);
//   const [filter, setFilter]     = useState<"all"|"8"|"9"|"10">("all");
//   const [search, setSearch]     = useState("");
//   const [sortBy, setSortBy]     = useState<"name"|"pct"|"last_active">("name");
//   const router = useRouter();

//   useEffect(() => {
//     const isAdmin = localStorage.getItem("pt_admin");
//     if (!isAdmin) { router.replace("/admin"); return; }
//     loadStudents();
//   }, [router]);

//   const loadStudents = useCallback(async () => {
//     setLoading(true);
//     const { data: studs } = await supabase
//       .from("students").select("*").order("class").order("roll_number");
//     if (!studs) { setLoading(false); return; }

//     const { data: prog } = await supabase.from("progress").select("student_id, status");
//     const progMap: Record<string, { done:number; reading:number }> = {};
//     (prog || []).forEach((p: any) => {
//       if (!progMap[p.student_id]) progMap[p.student_id] = { done:0, reading:0 };
//       if (p.status === "done")    progMap[p.student_id].done++;
//       else if (p.status === "reading") progMap[p.student_id].reading++;
//     });

//     const enriched: Student[] = studs.map(s => {
//       const total  = englishChapters[s.class]?.chapters.length || 16;
//       const counts = progMap[s.id] || { done:0, reading:0 };
//       return { ...s, done:counts.done, reading:counts.reading, total,
//         pct: Math.round((counts.done / total) * 100) };
//     });
//     setStudents(enriched);
//     setLoading(false);
//   }, []);

//   const logout = () => { localStorage.removeItem("pt_admin"); router.replace("/admin"); };

//   const filtered = students
//     .filter(s => filter === "all" || s.class === filter)
//     .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.roll_number.includes(search))
//     .sort((a, b) => {
//       if (sortBy === "pct") return b.pct - a.pct;
//       if (sortBy === "last_active") return new Date(b.last_active).getTime() - new Date(a.last_active).getTime();
//       return a.name.localeCompare(b.name);
//     });

//   const classStats = ["8","9","10"].map(cls => {
//     const clsStudents = students.filter(s => s.class === cls);
//     const avg = clsStudents.length > 0
//       ? Math.round(clsStudents.reduce((a,s) => a + s.pct, 0) / clsStudents.length) : 0;
//     return { cls, count: clsStudents.length, avg };
//   });

//   const completedStudents = students.filter(s => s.pct === 100);

//   const timeAgo = (dt: string) => {
//     const diff = Date.now() - new Date(dt).getTime();
//     const mins = Math.floor(diff / 60000);
//     if (mins < 1) return "Just now";
//     if (mins < 60) return `${mins}m ago`;
//     const hrs = Math.floor(mins / 60);
//     if (hrs < 24) return `${hrs}h ago`;
//     return `${Math.floor(hrs/24)}d ago`;
//   };

//   const pctColor = (p: number) => p >= 80 ? "#10b981" : p >= 40 ? "#f59e0b" : "#ef4444";

//   if (loading) {
//     return (
//       <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", flexDirection:"column", gap:12 }}>
//         <div className="spinner" />
//         <p style={{ fontSize:13, color:"#64748b" }}>Loading all students...</p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ minHeight:"100vh", background:"#f1f5f9" }}>

//       {/* Header */}
//       <div style={{ background:"linear-gradient(135deg,#1e293b,#334155)", padding:"20px 16px 24px" }}>
//         <div style={{ maxWidth:800, margin:"0 auto" }}>
//           <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
//             <div>
//               <h1 style={{ fontSize:22, fontWeight:800, color:"white" }}>🏫 Teacher Dashboard</h1>
//               <p style={{ fontFamily:"'Noto Sans Kannada',sans-serif", fontSize:12, color:"rgba(255,255,255,0.7)", marginTop:2 }}>
//                 ಶಿಕ್ಷಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ · {students.length} students
//               </p>
//             </div>
//             <div style={{ display:"flex", gap:8 }}>
//               <button onClick={loadStudents} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.3)", background:"rgba(255,255,255,0.1)", color:"white", fontSize:11, cursor:"pointer" }}>
//                 🔄 Refresh
//               </button>
//               <button onClick={logout} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.3)", background:"rgba(255,255,255,0.1)", color:"white", fontSize:11, cursor:"pointer" }}>
//                 Logout
//               </button>
//             </div>
//           </div>

//           {/* Class summary cards */}
//           <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
//             {classStats.map(({ cls, count, avg }) => (
//               <div key={cls} style={{ background:"rgba(255,255,255,0.1)", borderRadius:12, padding:"12px", textAlign:"center" }}>
//                 <div style={{ fontSize:18, fontWeight:800, color:"white" }}>{cls}th</div>
//                 <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:2 }}>{count} students</div>
//                 <div style={{ fontSize:16, fontWeight:700, color: avg >= 50 ? "#4ade80" : "#fb923c", marginTop:4 }}>{avg}% avg</div>
//               </div>
//             ))}
//           </div>

//           {/* Completion alert */}
//           {completedStudents.length > 0 && (
//             <div style={{ marginTop:12, background:"rgba(74,222,128,0.15)", borderRadius:12, padding:"10px 14px", border:"1px solid rgba(74,222,128,0.4)", display:"flex", alignItems:"center", gap:10 }}>
//               <span style={{ fontSize:16 }}>🎉</span>
//               <p style={{ fontSize:12, color:"#4ade80", fontWeight:600 }}>
//                 {completedStudents.length} student{completedStudents.length > 1 ? "s" : ""} completed all chapters! Click their name to send WhatsApp.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Controls */}
//       <div style={{ maxWidth:800, margin:"0 auto", padding:"16px 16px 8px" }}>
//         <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:10 }}>
//           <div style={{ display:"flex", gap:6 }}>
//             {(["all","8","9","10"] as const).map(f => (
//               <button key={f} onClick={() => setFilter(f)}
//                 style={{ padding:"5px 14px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer",
//                   background: filter === f ? "#1e293b" : "white",
//                   color: filter === f ? "white" : "#64748b",
//                   border:`1px solid ${filter === f ? "#1e293b" : "#e2e8f0"}` }}>
//                 {f === "all" ? "All" : `Class ${f}`}
//               </button>
//             ))}
//           </div>
//           <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
//             style={{ padding:"5px 12px", borderRadius:20, fontSize:11, border:"1px solid #e2e8f0", background:"white", cursor:"pointer", outline:"none" }}>
//             <option value="name">Sort: Name</option>
//             <option value="pct">Sort: Progress ↓</option>
//             <option value="last_active">Sort: Last Active</option>
//           </select>
//         </div>
//         <input value={search} onChange={e => setSearch(e.target.value)}
//           placeholder="🔍 Search by name or roll number..."
//           style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1px solid #e2e8f0", fontSize:13, outline:"none", background:"white" }} />
//       </div>

//       {/* Student list */}
//       <div style={{ maxWidth:800, margin:"0 auto", padding:"8px 16px 32px" }}>
//         <p style={{ fontSize:11, color:"#94a3b8", marginBottom:10 }}>
//           Showing {filtered.length} students · Click any student to view details, add notes, export or send WhatsApp
//         </p>

//         <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
//           {filtered.map(student => (
//             <div key={student.id}
//               onClick={() => router.push(`/admin/student/${student.id}`)}
//               style={{ background:"white", borderRadius:14, padding:"14px 16px", border:"1px solid #e2e8f0", cursor:"pointer", transition:"all 0.15s", display:"flex", alignItems:"center", gap:14 }}
//               onMouseEnter={e => { (e.currentTarget.style.borderColor = "#6366f1"); (e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.1)"); }}
//               onMouseLeave={e => { (e.currentTarget.style.borderColor = "#e2e8f0"); (e.currentTarget.style.boxShadow = "none"); }}
//             >
//               {/* Avatar */}
//               <div style={{ width:40, height:40, borderRadius:12, background:`${pctColor(student.pct)}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:pctColor(student.pct), flexShrink:0 }}>
//                 {student.name.charAt(0).toUpperCase()}
//               </div>

//               {/* Info */}
//               <div style={{ flex:1, minWidth:0 }}>
//                 <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
//                   <span style={{ fontWeight:700, fontSize:14, color:"#1e293b" }}>{student.name}</span>
//                   <span style={{ fontSize:10, padding:"1px 8px", borderRadius:20, background:"#f1f5f9", color:"#64748b", fontFamily:"monospace" }}>
//                     Roll {student.roll_number}
//                   </span>
//                   <span style={{ fontSize:10, padding:"1px 8px", borderRadius:20, background:"#f1f5f9", color:"#64748b" }}>
//                     Class {student.class}{student.section}
//                   </span>
//                   {student.pct === 100 && (
//                     <span style={{ fontSize:10, padding:"1px 8px", borderRadius:20, background:"#f0fdf4", color:"#16a34a", border:"1px solid #86efac", fontWeight:700 }}>
//                       🎉 Complete!
//                     </span>
//                   )}
//                 </div>
//                 <div style={{ display:"flex", alignItems:"center", gap:8 }}>
//                   <div style={{ flex:1, height:5, background:"#f1f5f9", borderRadius:3, overflow:"hidden" }}>
//                     <div style={{ height:"100%", width:`${student.pct}%`, background:pctColor(student.pct), borderRadius:3 }} />
//                   </div>
//                   <span style={{ fontSize:11, fontWeight:700, color:pctColor(student.pct), minWidth:35 }}>{student.pct}%</span>
//                 </div>
//                 <div style={{ display:"flex", gap:10, marginTop:4 }}>
//                   <span style={{ fontSize:10, color:"#10b981" }}>✓ {student.done} done</span>
//                   <span style={{ fontSize:10, color:"#f59e0b" }}>📖 {student.reading} reading</span>
//                   <span style={{ fontSize:10, color:"#94a3b8" }}>⚪ {student.total - student.done - student.reading} not started</span>
//                 </div>
//               </div>

//               {/* Last active */}
//               <div style={{ textAlign:"right", flexShrink:0 }}>
//                 <div style={{ fontSize:10, color:"#94a3b8" }}>Last active</div>
//                 <div style={{ fontSize:11, fontWeight:600, color:"#64748b" }}>{timeAgo(student.last_active)}</div>
//                 <div style={{ fontSize:11, color:"#6366f1", marginTop:2 }}>Notes & Export →</div>
//               </div>
//             </div>
//           ))}

//           {filtered.length === 0 && (
//             <div style={{ textAlign:"center", padding:40, color:"#94a3b8", fontSize:14 }}>
//               No students found
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { allSubjects } from "@/lib/chapters";

// interface Student {
//   id: string;
//   name: string;
//   roll_number: string;
//   class: string;
//   section: string;
//   last_active: string;
//   done: number;
//   reading: number;
//   total: number;
//   pct: number;
// }

// export default function AdminDashboard() {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [loading, setLoading]   = useState(true);
//   const [filter, setFilter]     = useState<"all"|"8"|"9"|"10">("all");
//   const [search, setSearch]     = useState("");
//   const [sortBy, setSortBy]     = useState<"name"|"pct"|"last_active">("name");
//   const router = useRouter();

//   useEffect(() => {
//     const isAdmin = localStorage.getItem("pt_admin");
//     if (!isAdmin) { router.replace("/admin"); return; }
//     loadStudents();
//   }, [router]);

//   const loadStudents = useCallback(async () => {
//     setLoading(true);
//     const { data: studs } = await supabase
//       .from("students").select("*").order("class").order("roll_number");
//     if (!studs) { setLoading(false); return; }

//     const { data: prog } = await supabase.from("progress").select("student_id, status");
//     const progMap: Record<string, { done:number; reading:number }> = {};
//     (prog || []).forEach((p: any) => {
//       if (!progMap[p.student_id]) progMap[p.student_id] = { done:0, reading:0 };
//       if (p.status === "done")    progMap[p.student_id].done++;
//       else if (p.status === "reading") progMap[p.student_id].reading++;
//     });

//     const enriched: Student[] = studs.map(s => {
//       const total  = (allSubjects[s.class] || []).reduce((acc, sub) => acc + sub.chapters.length, 0) || 48;
//       const counts = progMap[s.id] || { done:0, reading:0 };
//       return { ...s, done:counts.done, reading:counts.reading, total,
//         pct: Math.round((counts.done / total) * 100) };
//     });
//     setStudents(enriched);
//     setLoading(false);
//   }, []);

//   const logout = () => { localStorage.removeItem("pt_admin"); router.replace("/admin"); };

//   const filtered = students
//     .filter(s => filter === "all" || s.class === filter)
//     .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.roll_number.includes(search))
//     .sort((a, b) => {
//       if (sortBy === "pct") return b.pct - a.pct;
//       if (sortBy === "last_active") return new Date(b.last_active).getTime() - new Date(a.last_active).getTime();
//       return a.name.localeCompare(b.name);
//     });

//   const classStats = ["8","9","10"].map(cls => {
//     const clsStudents = students.filter(s => s.class === cls);
//     const avg = clsStudents.length > 0
//       ? Math.round(clsStudents.reduce((a,s) => a + s.pct, 0) / clsStudents.length) : 0;
//     return { cls, count: clsStudents.length, avg };
//   });

//   const completedStudents = students.filter(s => s.pct === 100);

//   const timeAgo = (dt: string) => {
//     const diff = Date.now() - new Date(dt).getTime();
//     const mins = Math.floor(diff / 60000);
//     if (mins < 1) return "Just now";
//     if (mins < 60) return `${mins}m ago`;
//     const hrs = Math.floor(mins / 60);
//     if (hrs < 24) return `${hrs}h ago`;
//     return `${Math.floor(hrs/24)}d ago`;
//   };

//   const pctColor = (p: number) => p >= 80 ? "#10b981" : p >= 40 ? "#f59e0b" : "#ef4444";

//   if (loading) {
//     return (
//       <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", flexDirection:"column", gap:12 }}>
//         <div className="spinner" />
//         <p style={{ fontSize:13, color:"#64748b" }}>Loading all students...</p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ minHeight:"100vh", background:"#f1f5f9" }}>

//       {/* Header */}
//       <div style={{ background:"linear-gradient(135deg,#1e293b,#334155)", padding:"20px 16px 24px" }}>
//         <div style={{ maxWidth:800, margin:"0 auto" }}>
//           <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
//             <div>
//               <h1 style={{ fontSize:22, fontWeight:800, color:"white" }}>🏫 Teacher Dashboard</h1>
//               <p style={{ fontFamily:"'Noto Sans Kannada',sans-serif", fontSize:12, color:"rgba(255,255,255,0.7)", marginTop:2 }}>
//                 ಶಿಕ್ಷಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ · {students.length} students
//               </p>
//             </div>
//             <div style={{ display:"flex", gap:8 }}>
//               <button onClick={loadStudents} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.3)", background:"rgba(255,255,255,0.1)", color:"white", fontSize:11, cursor:"pointer" }}>
//                 🔄 Refresh
//               </button>
//               <button onClick={logout} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.3)", background:"rgba(255,255,255,0.1)", color:"white", fontSize:11, cursor:"pointer" }}>
//                 Logout
//               </button>
//             </div>
//           </div>

//           {/* Class summary cards */}
//           <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
//             {classStats.map(({ cls, count, avg }) => (
//               <div key={cls} style={{ background:"rgba(255,255,255,0.1)", borderRadius:12, padding:"12px", textAlign:"center" }}>
//                 <div style={{ fontSize:18, fontWeight:800, color:"white" }}>{cls}th</div>
//                 <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:2 }}>{count} students</div>
//                 <div style={{ fontSize:16, fontWeight:700, color: avg >= 50 ? "#4ade80" : "#fb923c", marginTop:4 }}>{avg}% avg</div>
//               </div>
//             ))}
//           </div>

//           {/* Completion alert */}
//           {completedStudents.length > 0 && (
//             <div style={{ marginTop:12, background:"rgba(74,222,128,0.15)", borderRadius:12, padding:"10px 14px", border:"1px solid rgba(74,222,128,0.4)", display:"flex", alignItems:"center", gap:10 }}>
//               <span style={{ fontSize:16 }}>🎉</span>
//               <p style={{ fontSize:12, color:"#4ade80", fontWeight:600 }}>
//                 {completedStudents.length} student{completedStudents.length > 1 ? "s" : ""} completed all chapters! Click their name to send WhatsApp.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Controls */}
//       <div style={{ maxWidth:800, margin:"0 auto", padding:"16px 16px 8px" }}>
//         <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:10 }}>
//           <div style={{ display:"flex", gap:6 }}>
//             {(["all","8","9","10"] as const).map(f => (
//               <button key={f} onClick={() => setFilter(f)}
//                 style={{ padding:"5px 14px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer",
//                   background: filter === f ? "#1e293b" : "white",
//                   color: filter === f ? "white" : "#64748b",
//                   border:`1px solid ${filter === f ? "#1e293b" : "#e2e8f0"}` }}>
//                 {f === "all" ? "All" : `Class ${f}`}
//               </button>
//             ))}
//           </div>
//           <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
//             style={{ padding:"5px 12px", borderRadius:20, fontSize:11, border:"1px solid #e2e8f0", background:"white", cursor:"pointer", outline:"none" }}>
//             <option value="name">Sort: Name</option>
//             <option value="pct">Sort: Progress ↓</option>
//             <option value="last_active">Sort: Last Active</option>
//           </select>
//         </div>
//         <input value={search} onChange={e => setSearch(e.target.value)}
//           placeholder="🔍 Search by name or roll number..."
//           style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1px solid #e2e8f0", fontSize:13, outline:"none", background:"white" }} />
//       </div>

//       {/* Student list */}
//       <div style={{ maxWidth:800, margin:"0 auto", padding:"8px 16px 32px" }}>
//         <p style={{ fontSize:11, color:"#94a3b8", marginBottom:10 }}>
//           Showing {filtered.length} students · Click any student to view details, add notes, export or send WhatsApp
//         </p>

//         <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
//           {filtered.map(student => (
//             <div key={student.id}
//               onClick={() => router.push(`/admin/student/${student.id}`)}
//               style={{ background:"white", borderRadius:14, padding:"14px 16px", border:"1px solid #e2e8f0", cursor:"pointer", transition:"all 0.15s", display:"flex", alignItems:"center", gap:14 }}
//               onMouseEnter={e => { (e.currentTarget.style.borderColor = "#6366f1"); (e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.1)"); }}
//               onMouseLeave={e => { (e.currentTarget.style.borderColor = "#e2e8f0"); (e.currentTarget.style.boxShadow = "none"); }}
//             >
//               {/* Avatar */}
//               <div style={{ width:40, height:40, borderRadius:12, background:`${pctColor(student.pct)}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:pctColor(student.pct), flexShrink:0 }}>
//                 {student.name.charAt(0).toUpperCase()}
//               </div>

//               {/* Info */}
//               <div style={{ flex:1, minWidth:0 }}>
//                 <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
//                   <span style={{ fontWeight:700, fontSize:14, color:"#1e293b" }}>{student.name}</span>
//                   <span style={{ fontSize:10, padding:"1px 8px", borderRadius:20, background:"#f1f5f9", color:"#64748b", fontFamily:"monospace" }}>
//                     Roll {student.roll_number}
//                   </span>
//                   <span style={{ fontSize:10, padding:"1px 8px", borderRadius:20, background:"#f1f5f9", color:"#64748b" }}>
//                     Class {student.class}{student.section}
//                   </span>
//                   {student.pct === 100 && (
//                     <span style={{ fontSize:10, padding:"1px 8px", borderRadius:20, background:"#f0fdf4", color:"#16a34a", border:"1px solid #86efac", fontWeight:700 }}>
//                       🎉 Complete!
//                     </span>
//                   )}
//                 </div>
//                 <div style={{ display:"flex", alignItems:"center", gap:8 }}>
//                   <div style={{ flex:1, height:5, background:"#f1f5f9", borderRadius:3, overflow:"hidden" }}>
//                     <div style={{ height:"100%", width:`${student.pct}%`, background:pctColor(student.pct), borderRadius:3 }} />
//                   </div>
//                   <span style={{ fontSize:11, fontWeight:700, color:pctColor(student.pct), minWidth:35 }}>{student.pct}%</span>
//                 </div>
//                 <div style={{ display:"flex", gap:10, marginTop:4 }}>
//                   <span style={{ fontSize:10, color:"#10b981" }}>✓ {student.done} done</span>
//                   <span style={{ fontSize:10, color:"#f59e0b" }}>📖 {student.reading} reading</span>
//                   <span style={{ fontSize:10, color:"#94a3b8" }}>⚪ {student.total - student.done - student.reading} not started</span>
//                 </div>
//               </div>

//               {/* Last active */}
//               <div style={{ textAlign:"right", flexShrink:0 }}>
//                 <div style={{ fontSize:10, color:"#94a3b8" }}>Last active</div>
//                 <div style={{ fontSize:11, fontWeight:600, color:"#64748b" }}>{timeAgo(student.last_active)}</div>
//                 <div style={{ fontSize:11, color:"#6366f1", marginTop:2 }}>Notes & Export →</div>
//               </div>
//             </div>
//           ))}

//           {filtered.length === 0 && (
//             <div style={{ textAlign:"center", padding:40, color:"#94a3b8", fontSize:14 }}>
//               No students found
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { allSubjects } from "@/lib/chapters";

// interface Student {
//   id: string;
//   name: string;
//   roll_number: string;
//   class: string;
//   section: string;
//   last_active: string;
//   is_active: boolean;
//   done: number;
//   reading: number;
//   total: number;
//   pct: number;
//   subjectBreakdown: { title: string; icon: string; done: number; total: number; color: string }[];
// }

// export default function AdminDashboard() {
//   const [students, setStudents]       = useState<Student[]>([]);
//   const [loading, setLoading]         = useState(true);
//   const [classFilter, setClassFilter] = useState<"all"|"8"|"9"|"10">("all");
//   const [subjectFilter, setSubjectFilter] = useState<"all"|"english"|"maths"|"science">("all");
//   const [search, setSearch]           = useState("");
//   const [sortBy, setSortBy]           = useState<"name"|"pct"|"roll"|"last_active">("name");
//   const [deleteId, setDeleteId]       = useState<string | null>(null);
//   const [deleteConfirm, setDeleteConfirm] = useState("");
//   const [deleting, setDeleting]       = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const isAdmin = localStorage.getItem("pt_admin");
//     if (!isAdmin) { router.replace("/admin"); return; }
//     loadStudents();
//   }, [router]);

//   const loadStudents = useCallback(async () => {
//     setLoading(true);

//     const { data: studs } = await supabase
//       .from("students")
//       .select("*")
//       .eq("is_active", true)
//       .order("class").order("roll_number");

//     if (!studs) { setLoading(false); return; }

//     const { data: prog } = await supabase
//       .from("progress").select("student_id, subject, status");

//     // Build per-student, per-subject counts
//     const progMap: Record<string, Record<string, { done:number; reading:number }>> = {};
//     (prog || []).forEach((p: any) => {
//       if (!progMap[p.student_id]) progMap[p.student_id] = {};
//       if (!progMap[p.student_id][p.subject]) progMap[p.student_id][p.subject] = { done:0, reading:0 };
//       if (p.status === "done")    progMap[p.student_id][p.subject].done++;
//       else if (p.status === "reading") progMap[p.student_id][p.subject].reading++;
//     });

//     const enriched: Student[] = studs.map(s => {
//       const subs = allSubjects[s.class] || [];
//       const breakdown = subs.map(sub => {
//         const counts = progMap[s.id]?.[sub.id] || { done:0, reading:0 };
//         return { title: sub.title, icon: sub.icon, done: counts.done, total: sub.chapters.length, color: sub.color };
//       });
//       const total   = subs.reduce((a, sub) => a + sub.chapters.length, 0);
//       const done    = breakdown.reduce((a, b) => a + b.done, 0);
//       const reading = subs.reduce((a, sub) => a + (progMap[s.id]?.[sub.id]?.reading || 0), 0);
//       return { ...s, done, reading, total, pct: Math.round((done/total)*100), subjectBreakdown: breakdown };
//     });

//     setStudents(enriched);
//     setLoading(false);
//   }, []);

//   // Delete student (soft delete)
//   const handleDelete = async () => {
//     if (!deleteId || deleteConfirm.toLowerCase() !== "delete") return;
//     setDeleting(true);
//     await supabase.from("students").update({ is_active: false, deleted_at: new Date().toISOString() }).eq("id", deleteId);
//     setStudents(prev => prev.filter(s => s.id !== deleteId));
//     setDeleteId(null);
//     setDeleteConfirm("");
//     setDeleting(false);
//   };

//   const logout = () => { localStorage.removeItem("pt_admin"); router.replace("/admin"); };

//   // Filter logic — also filter by subject progress
//   const filtered = students
//     .filter(s => classFilter === "all" || s.class === classFilter)
//     .filter(s => {
//       if (subjectFilter === "all") return true;
//       // Show students who have started that subject
//       return s.subjectBreakdown.some(b =>
//         b.title.toLowerCase().includes(subjectFilter) && b.done > 0
//       );
//     })
//     .filter(s =>
//       s.name.toLowerCase().includes(search.toLowerCase()) ||
//       s.roll_number.includes(search)
//     )
//     .sort((a, b) => {
//       if (sortBy === "pct")         return b.pct - a.pct;
//       if (sortBy === "last_active") return new Date(b.last_active).getTime() - new Date(a.last_active).getTime();
//       if (sortBy === "roll")        return parseInt(a.roll_number) - parseInt(b.roll_number);
//       return a.name.localeCompare(b.name);
//     });

//   const classStats = ["8","9","10"].map(cls => {
//     const cs = students.filter(s => s.class === cls);
//     const avg = cs.length > 0 ? Math.round(cs.reduce((a,s) => a + s.pct, 0) / cs.length) : 0;
//     return { cls, count:cs.length, avg };
//   });

//   const completedStudents = students.filter(s => s.pct === 100);

//   const timeAgo = (dt: string) => {
//     const diff = Date.now() - new Date(dt).getTime();
//     const mins = Math.floor(diff/60000);
//     if (mins < 1) return "Just now";
//     if (mins < 60) return `${mins}m ago`;
//     const hrs = Math.floor(mins/60);
//     if (hrs < 24) return `${hrs}h ago`;
//     return `${Math.floor(hrs/24)}d ago`;
//   };

//   const pctColor = (p: number) => p >= 80 ? "#10b981" : p >= 40 ? "#f59e0b" : "#ef4444";

//   if (loading) {
//     return (
//       <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", flexDirection:"column", gap:12 }}>
//         <div className="spinner" />
//         <p style={{ fontSize:13, color:"#64748b" }}>Loading students...</p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ minHeight:"100vh", background:"#f1f5f9" }}>

//       {/* Delete confirmation modal */}
//       {deleteId && (
//         <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
//           <div style={{ background:"white", borderRadius:20, padding:28, maxWidth:360, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
//             <div style={{ fontSize:36, textAlign:"center", marginBottom:12 }}>⚠️</div>
//             <h3 style={{ fontSize:16, fontWeight:800, color:"#1e293b", textAlign:"center", marginBottom:8 }}>
//               Remove Student?
//             </h3>
//             <p style={{ fontSize:13, color:"#64748b", textAlign:"center", marginBottom:16, lineHeight:1.5 }}>
//               This will remove the student from the dashboard. Their data is kept but they won't appear in the list.
//             </p>
//             <p style={{ fontSize:12, fontWeight:600, color:"#475569", marginBottom:6 }}>
//               Type <strong>delete</strong> to confirm:
//             </p>
//             <input
//               value={deleteConfirm}
//               onChange={e => setDeleteConfirm(e.target.value)}
//               placeholder="Type 'delete' here"
//               style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none", marginBottom:14 }}
//               onFocus={e => (e.target.style.borderColor = "#ef4444")}
//               onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
//             />
//             <div style={{ display:"flex", gap:10 }}>
//               <button onClick={() => { setDeleteId(null); setDeleteConfirm(""); }}
//                 style={{ flex:1, padding:"10px", borderRadius:10, border:"1px solid #e2e8f0", background:"white", fontSize:13, fontWeight:600, cursor:"pointer", color:"#64748b" }}>
//                 Cancel
//               </button>
//               <button onClick={handleDelete} disabled={deleteConfirm.toLowerCase() !== "delete" || deleting}
//                 style={{ flex:1, padding:"10px", borderRadius:10, border:"none",
//                   background: deleteConfirm.toLowerCase() === "delete" ? "#ef4444" : "#e2e8f0",
//                   color: deleteConfirm.toLowerCase() === "delete" ? "white" : "#94a3b8",
//                   fontSize:13, fontWeight:700, cursor: deleteConfirm.toLowerCase() === "delete" ? "pointer" : "not-allowed" }}>
//                 {deleting ? "Removing..." : "Remove Student"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div style={{ background:"linear-gradient(135deg,#1e293b,#334155)", padding:"20px 16px 24px" }}>
//         <div style={{ maxWidth:800, margin:"0 auto" }}>
//           <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
//             <div>
//               <h1 style={{ fontSize:22, fontWeight:800, color:"white" }}>🏫 Teacher Dashboard</h1>
//               <p style={{ fontFamily:"'Noto Sans Kannada',sans-serif", fontSize:12, color:"rgba(255,255,255,0.7)", marginTop:2 }}>
//                 ಶಿಕ್ಷಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ · {students.length} students
//               </p>
//             </div>
//             <div style={{ display:"flex", gap:8 }}>
//               <button onClick={loadStudents} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.3)", background:"rgba(255,255,255,0.1)", color:"white", fontSize:11, cursor:"pointer" }}>
//                 🔄 Refresh
//               </button>
//               <button onClick={logout} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.3)", background:"rgba(255,255,255,0.1)", color:"white", fontSize:11, cursor:"pointer" }}>
//                 Logout
//               </button>
//             </div>
//           </div>

//           {/* Class stats */}
//           <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
//             {classStats.map(({ cls, count, avg }) => (
//               <div key={cls} style={{ background:"rgba(255,255,255,0.1)", borderRadius:12, padding:"12px", textAlign:"center", cursor:"pointer" }}
//                 onClick={() => setClassFilter(cls as any)}>
//                 <div style={{ fontSize:18, fontWeight:800, color:"white" }}>{cls}th</div>
//                 <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:2 }}>{count} students</div>
//                 <div style={{ fontSize:16, fontWeight:700, color: avg >= 50 ? "#4ade80" : "#fb923c", marginTop:4 }}>{avg}% avg</div>
//               </div>
//             ))}
//           </div>

//           {/* Completion alert */}
//           {completedStudents.length > 0 && (
//             <div style={{ marginTop:12, background:"rgba(74,222,128,0.15)", borderRadius:12, padding:"10px 14px", border:"1px solid rgba(74,222,128,0.4)", display:"flex", alignItems:"center", gap:10 }}>
//               <span style={{ fontSize:16 }}>🎉</span>
//               <p style={{ fontSize:12, color:"#4ade80", fontWeight:600 }}>
//                 {completedStudents.length} student{completedStudents.length > 1 ? "s" : ""} completed all chapters! Tap their card to send WhatsApp.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Controls */}
//       <div style={{ maxWidth:800, margin:"0 auto", padding:"16px 16px 8px" }}>

//         {/* Row 1: Class + Subject filters */}
//         <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
//           {/* Class filter */}
//           <div style={{ display:"flex", gap:6 }}>
//             {(["all","8","9","10"] as const).map(f => (
//               <button key={f} onClick={() => setClassFilter(f)}
//                 style={{ padding:"5px 13px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer",
//                   background: classFilter === f ? "#1e293b" : "white",
//                   color:      classFilter === f ? "white"   : "#64748b",
//                   border:`1px solid ${classFilter === f ? "#1e293b" : "#e2e8f0"}` }}>
//                 {f === "all" ? "All Classes" : `Class ${f}`}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Row 2: Subject filter */}
//         <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
//           <span style={{ fontSize:11, color:"#64748b", display:"flex", alignItems:"center", marginRight:4 }}>Subject:</span>
//           {([
//             { id:"all",     label:"All Subjects", icon:"📚" },
//             { id:"english", label:"English 📝",    icon:"" },
//             { id:"maths",   label:"Maths 🔢",      icon:"" },
//             { id:"science", label:"Science 🔬",    icon:"" },
//           ] as const).map(f => (
//             <button key={f.id} onClick={() => setSubjectFilter(f.id)}
//               style={{ padding:"5px 13px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer",
//                 background: subjectFilter === f.id ? "#6366f1" : "white",
//                 color:      subjectFilter === f.id ? "white"   : "#64748b",
//                 border:`1px solid ${subjectFilter === f.id ? "#6366f1" : "#e2e8f0"}` }}>
//               {f.label}
//             </button>
//           ))}
//         </div>

//         {/* Row 3: Sort + Search */}
//         <div style={{ display:"flex", gap:8, marginBottom:10 }}>
//           <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
//             style={{ padding:"8px 12px", borderRadius:10, fontSize:12, border:"1px solid #e2e8f0", background:"white", cursor:"pointer", outline:"none" }}>
//             <option value="name">Sort: Name A-Z</option>
//             <option value="roll">Sort: Roll Number</option>
//             <option value="pct">Sort: Progress ↓</option>
//             <option value="last_active">Sort: Last Active</option>
//           </select>
//         </div>

//         <input value={search} onChange={e => setSearch(e.target.value)}
//           placeholder="🔍 Search by name or roll number..."
//           style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1px solid #e2e8f0", fontSize:13, outline:"none", background:"white" }} />
//       </div>

//       {/* Student list */}
//       <div style={{ maxWidth:800, margin:"0 auto", padding:"8px 16px 32px" }}>
//         <p style={{ fontSize:11, color:"#94a3b8", marginBottom:10 }}>
//           Showing {filtered.length} of {students.length} students
//         </p>

//         <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
//           {filtered.map(student => (
//             <div key={student.id} style={{ background:"white", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden" }}>

//               {/* Main row — clickable */}
//               <div onClick={() => router.push(`/admin/student/${student.id}`)}
//                 style={{ padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:14 }}
//                 onMouseEnter={e => { (e.currentTarget.style.background = "#fafafa"); }}
//                 onMouseLeave={e => { (e.currentTarget.style.background = "white"); }}>

//                 {/* Avatar */}
//                 <div style={{ width:40, height:40, borderRadius:12, background:`${pctColor(student.pct)}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:pctColor(student.pct), flexShrink:0 }}>
//                   {student.name.charAt(0).toUpperCase()}
//                 </div>

//                 {/* Info */}
//                 <div style={{ flex:1, minWidth:0 }}>
//                   <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4, flexWrap:"wrap" }}>
//                     <span style={{ fontWeight:700, fontSize:14, color:"#1e293b" }}>{student.name}</span>
//                     <span style={{ fontSize:10, padding:"1px 7px", borderRadius:20, background:"#f1f5f9", color:"#64748b", fontFamily:"monospace" }}>Roll {student.roll_number}</span>
//                     <span style={{ fontSize:10, padding:"1px 7px", borderRadius:20, background:"#f1f5f9", color:"#64748b" }}>Class {student.class}{student.section}</span>
//                     {student.pct === 100 && (
//                       <span style={{ fontSize:10, padding:"1px 7px", borderRadius:20, background:"#f0fdf4", color:"#16a34a", border:"1px solid #86efac", fontWeight:700 }}>🎉 Complete!</span>
//                     )}
//                   </div>

//                   {/* Overall progress bar */}
//                   <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
//                     <div style={{ flex:1, height:5, background:"#f1f5f9", borderRadius:3, overflow:"hidden" }}>
//                       <div style={{ height:"100%", width:`${student.pct}%`, background:pctColor(student.pct), borderRadius:3 }} />
//                     </div>
//                     <span style={{ fontSize:11, fontWeight:700, color:pctColor(student.pct), minWidth:35 }}>{student.pct}%</span>
//                   </div>

//                   {/* Per-subject breakdown */}
//                   <div style={{ display:"flex", gap:10 }}>
//                     {student.subjectBreakdown.map(b => (
//                       <div key={b.title} style={{ display:"flex", alignItems:"center", gap:3 }}>
//                         <span style={{ fontSize:10 }}>{b.icon}</span>
//                         <span style={{ fontSize:10, color: b.done === b.total ? "#10b981" : "#64748b", fontWeight: b.done > 0 ? 600 : 400 }}>
//                           {b.done}/{b.total}
//                         </span>
//                       </div>
//                     ))}
//                     <span style={{ fontSize:10, color:"#94a3b8", marginLeft:4 }}>· {timeAgo(student.last_active)}</span>
//                   </div>
//                 </div>

//                 {/* Right side */}
//                 <div style={{ flexShrink:0, textAlign:"right" }}>
//                   <div style={{ fontSize:11, color:"#6366f1", marginBottom:4 }}>View →</div>
//                 </div>
//               </div>

//               {/* Delete button row */}
//               <div style={{ borderTop:"1px solid #f1f5f9", padding:"8px 16px", display:"flex", justifyContent:"flex-end" }}>
//                 <button
//                   onClick={e => { e.stopPropagation(); setDeleteId(student.id); setDeleteConfirm(""); }}
//                   style={{ padding:"4px 12px", borderRadius:20, border:"1px solid #fecaca", background:"#fef2f2", color:"#ef4444", fontSize:11, fontWeight:600, cursor:"pointer" }}>
//                   🗑 Remove Student
//                 </button>
//               </div>
//             </div>
//           ))}

//           {filtered.length === 0 && (
//             <div style={{ textAlign:"center", padding:40, color:"#94a3b8" }}>
//               <div style={{ fontSize:36, marginBottom:8 }}>🔍</div>
//               <p style={{ fontSize:14 }}>No students found</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { allSubjects } from "@/lib/chapters";

interface Student {
  id: string;
  name: string;
  roll_number: string;
  class: string;
  section: string;
  last_active: string;
  is_active: boolean;
  done: number;
  reading: number;
  total: number;
  pct: number;
  subjectBreakdown: { title: string; icon: string; done: number; total: number; color: string }[];
}

export default function AdminDashboard() {
  const [teacher, setTeacher]           = useState<any>(null);
  const [students, setStudents]         = useState<Student[]>([]);
  const [loading, setLoading]         = useState(true);
  const [classFilter, setClassFilter] = useState<"all"|"8"|"9"|"10">("all");
  const [subjectFilter, setSubjectFilter] = useState<"all"|"english"|"maths"|"science">("all");
  const [search, setSearch]           = useState("");
  const [sortBy, setSortBy]           = useState<"name"|"pct"|"roll"|"last_active">("name");
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting]       = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("pt_admin");
    if (!isAdmin) { router.replace("/admin"); return; }
    const teacherRaw = localStorage.getItem("pt_teacher");
    if (teacherRaw) setTeacher(JSON.parse(teacherRaw));
    loadStudents();
  }, [router]);

  const loadStudents = useCallback(async () => {
    setLoading(true);

    const { data: studs } = await supabase
      .from("students")
      .select("*")
      .eq("is_active", true)
      .order("class").order("roll_number");

    if (!studs) { setLoading(false); return; }

    const { data: prog } = await supabase
      .from("progress").select("student_id, subject, status");

    // Build per-student, per-subject counts
    const progMap: Record<string, Record<string, { done:number; reading:number }>> = {};
    (prog || []).forEach((p: any) => {
      if (!progMap[p.student_id]) progMap[p.student_id] = {};
      if (!progMap[p.student_id][p.subject]) progMap[p.student_id][p.subject] = { done:0, reading:0 };
      if (p.status === "done")    progMap[p.student_id][p.subject].done++;
      else if (p.status === "reading") progMap[p.student_id][p.subject].reading++;
    });

    const enriched: Student[] = studs.map(s => {
      const subs = allSubjects[s.class] || [];
      const breakdown = subs.map(sub => {
        const counts = progMap[s.id]?.[sub.id] || { done:0, reading:0 };
        return { title: sub.title, icon: sub.icon, done: counts.done, total: sub.chapters.length, color: sub.color };
      });
      const total   = subs.reduce((a, sub) => a + sub.chapters.length, 0);
      const done    = breakdown.reduce((a, b) => a + b.done, 0);
      const reading = subs.reduce((a, sub) => a + (progMap[s.id]?.[sub.id]?.reading || 0), 0);
      return { ...s, done, reading, total, pct: Math.round((done/total)*100), subjectBreakdown: breakdown };
    });

    setStudents(enriched);
    setLoading(false);
  }, []);

  // Delete student (soft delete)
  const handleDelete = async () => {
    if (!deleteId || deleteConfirm.toLowerCase() !== "delete") return;
    setDeleting(true);
    await supabase.from("students").update({ is_active: false, deleted_at: new Date().toISOString() }).eq("id", deleteId);
    setStudents(prev => prev.filter(s => s.id !== deleteId));
    setDeleteId(null);
    setDeleteConfirm("");
    setDeleting(false);
  };

  const logout = () => { localStorage.removeItem("pt_admin"); router.replace("/admin"); };

  // Filter logic — also filter by subject progress
  // teacher subject filter
  const teacherSubject = teacher?.subject || "all";

  const filtered = students
    .filter(s => {
      if (teacherSubject === "all") return true;
      // Only show students who have this subject
      return (allSubjects[s.class] || []).some(sub => sub.id.startsWith(teacherSubject));
    })
    .filter(s => classFilter === "all" || s.class === classFilter)
    .filter(s => {
      if (subjectFilter === "all") return true;
      // Show students who have started that subject
      return s.subjectBreakdown.some(b =>
        b.title.toLowerCase().includes(subjectFilter) && b.done > 0
      );
    })
    .filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.roll_number.includes(search)
    )
    .sort((a, b) => {
      if (sortBy === "pct")         return b.pct - a.pct;
      if (sortBy === "last_active") return new Date(b.last_active).getTime() - new Date(a.last_active).getTime();
      if (sortBy === "roll")        return parseInt(a.roll_number) - parseInt(b.roll_number);
      return a.name.localeCompare(b.name);
    });

  const classStats = ["8","9","10"].map(cls => {
    const cs = students.filter(s => s.class === cls);
    const avg = cs.length > 0 ? Math.round(cs.reduce((a,s) => a + s.pct, 0) / cs.length) : 0;
    return { cls, count:cs.length, avg };
  });

  const completedStudents = students.filter(s => s.pct === 100);

  const timeAgo = (dt: string) => {
    const diff = Date.now() - new Date(dt).getTime();
    const mins = Math.floor(diff/60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins/60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs/24)}d ago`;
  };

  const pctColor = (p: number) => p >= 80 ? "#10b981" : p >= 40 ? "#f59e0b" : "#ef4444";

  if (loading) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", flexDirection:"column", gap:12 }}>
        <div className="spinner" />
        <p style={{ fontSize:13, color:"#64748b" }}>Loading students...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#f1f5f9" }}>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background:"white", borderRadius:20, padding:28, maxWidth:360, width:"100%", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize:36, textAlign:"center", marginBottom:12 }}>⚠️</div>
            <h3 style={{ fontSize:16, fontWeight:800, color:"#1e293b", textAlign:"center", marginBottom:8 }}>
              Remove Student?
            </h3>
            <p style={{ fontSize:13, color:"#64748b", textAlign:"center", marginBottom:16, lineHeight:1.5 }}>
              This will remove the student from the dashboard. Their data is kept but they won't appear in the list.
            </p>
            <p style={{ fontSize:12, fontWeight:600, color:"#475569", marginBottom:6 }}>
              Type <strong>delete</strong> to confirm:
            </p>
            <input
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="Type 'delete' here"
              style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:14, outline:"none", marginBottom:14 }}
              onFocus={e => (e.target.style.borderColor = "#ef4444")}
              onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
            />
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => { setDeleteId(null); setDeleteConfirm(""); }}
                style={{ flex:1, padding:"10px", borderRadius:10, border:"1px solid #e2e8f0", background:"white", fontSize:13, fontWeight:600, cursor:"pointer", color:"#64748b" }}>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleteConfirm.toLowerCase() !== "delete" || deleting}
                style={{ flex:1, padding:"10px", borderRadius:10, border:"none",
                  background: deleteConfirm.toLowerCase() === "delete" ? "#ef4444" : "#e2e8f0",
                  color: deleteConfirm.toLowerCase() === "delete" ? "white" : "#94a3b8",
                  fontSize:13, fontWeight:700, cursor: deleteConfirm.toLowerCase() === "delete" ? "pointer" : "not-allowed" }}>
                {deleting ? "Removing..." : "Remove Student"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1e293b,#334155)", padding:"20px 16px 24px" }}>
        <div style={{ maxWidth:800, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, color:"white" }}>
            {teacher ? `${teacher.subject === "all" ? "🏫" : teacher.subject === "english" ? "📝" : teacher.subject === "maths" ? "🔢" : "🔬"} ${teacher.name}` : "🏫 Teacher Dashboard"}
          </h1>
              <p style={{ fontFamily:"'Noto Sans Kannada',sans-serif", fontSize:12, color:"rgba(255,255,255,0.7)", marginTop:2 }}>
                ಶಿಕ್ಷಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ · {students.length} students{teacher && teacher.subject !== 'all' ? ` · ${teacher.subject} only` : ''}
              </p>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => router.push("/admin/upload")}
                style={{ padding:"6px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.3)", background:"rgba(255,255,255,0.1)", color:"white", fontSize:11, cursor:"pointer" }}>
                📚 Upload PDF
              </button>
              <button onClick={loadStudents} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.3)", background:"rgba(255,255,255,0.1)", color:"white", fontSize:11, cursor:"pointer" }}>
                🔄 Refresh
              </button>
              <button onClick={logout} style={{ padding:"6px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.3)", background:"rgba(255,255,255,0.1)", color:"white", fontSize:11, cursor:"pointer" }}>
                Logout
              </button>
            </div>
          </div>

          {/* Class stats */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
            {classStats.map(({ cls, count, avg }) => (
              <div key={cls} style={{ background:"rgba(255,255,255,0.1)", borderRadius:12, padding:"12px", textAlign:"center", cursor:"pointer" }}
                onClick={() => setClassFilter(cls as any)}>
                <div style={{ fontSize:18, fontWeight:800, color:"white" }}>{cls}th</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:2 }}>{count} students</div>
                <div style={{ fontSize:16, fontWeight:700, color: avg >= 50 ? "#4ade80" : "#fb923c", marginTop:4 }}>{avg}% avg</div>
              </div>
            ))}
          </div>

          {/* Completion alert */}
          {completedStudents.length > 0 && (
            <div style={{ marginTop:12, background:"rgba(74,222,128,0.15)", borderRadius:12, padding:"10px 14px", border:"1px solid rgba(74,222,128,0.4)", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:16 }}>🎉</span>
              <p style={{ fontSize:12, color:"#4ade80", fontWeight:600 }}>
                {completedStudents.length} student{completedStudents.length > 1 ? "s" : ""} completed all chapters! Tap their card to send WhatsApp.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={{ maxWidth:800, margin:"0 auto", padding:"16px 16px 8px" }}>

        {/* Row 1: Class + Subject filters */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:10 }}>
          {/* Class filter */}
          <div style={{ display:"flex", gap:6 }}>
            {(["all","8","9","10"] as const).map(f => (
              <button key={f} onClick={() => setClassFilter(f)}
                style={{ padding:"5px 13px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer",
                  background: classFilter === f ? "#1e293b" : "white",
                  color:      classFilter === f ? "white"   : "#64748b",
                  border:`1px solid ${classFilter === f ? "#1e293b" : "#e2e8f0"}` }}>
                {f === "all" ? "All Classes" : `Class ${f}`}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Subject filter */}
        <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
          <span style={{ fontSize:11, color:"#64748b", display:"flex", alignItems:"center", marginRight:4 }}>Subject:</span>
          {([
            { id:"all",     label:"All Subjects", icon:"📚" },
            { id:"english", label:"English 📝",    icon:"" },
            { id:"maths",   label:"Maths 🔢",      icon:"" },
            { id:"science", label:"Science 🔬",    icon:"" },
          ] as const).map(f => (
            <button key={f.id} onClick={() => setSubjectFilter(f.id)}
              style={{ padding:"5px 13px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer",
                background: subjectFilter === f.id ? "#6366f1" : "white",
                color:      subjectFilter === f.id ? "white"   : "#64748b",
                border:`1px solid ${subjectFilter === f.id ? "#6366f1" : "#e2e8f0"}` }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Row 3: Sort + Search */}
        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
            style={{ padding:"8px 12px", borderRadius:10, fontSize:12, border:"1px solid #e2e8f0", background:"white", cursor:"pointer", outline:"none" }}>
            <option value="name">Sort: Name A-Z</option>
            <option value="roll">Sort: Roll Number</option>
            <option value="pct">Sort: Progress ↓</option>
            <option value="last_active">Sort: Last Active</option>
          </select>
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by name or roll number..."
          style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1px solid #e2e8f0", fontSize:13, outline:"none", background:"white" }} />
      </div>

      {/* Student list */}
      <div style={{ maxWidth:800, margin:"0 auto", padding:"8px 16px 32px" }}>
        <p style={{ fontSize:11, color:"#94a3b8", marginBottom:10 }}>
          Showing {filtered.length} of {students.length} students
        </p>

        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {filtered.map(student => (
            <div key={student.id} style={{ background:"white", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden" }}>

              {/* Main row — clickable */}
              <div onClick={() => router.push(`/admin/student/${student.id}`)}
                style={{ padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:14 }}
                onMouseEnter={e => { (e.currentTarget.style.background = "#fafafa"); }}
                onMouseLeave={e => { (e.currentTarget.style.background = "white"); }}>

                {/* Avatar */}
                <div style={{ width:40, height:40, borderRadius:12, background:`${pctColor(student.pct)}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:700, color:pctColor(student.pct), flexShrink:0 }}>
                  {student.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4, flexWrap:"wrap" }}>
                    <span style={{ fontWeight:700, fontSize:14, color:"#1e293b" }}>{student.name}</span>
                    <span style={{ fontSize:10, padding:"1px 7px", borderRadius:20, background:"#f1f5f9", color:"#64748b", fontFamily:"monospace" }}>Roll {student.roll_number}</span>
                    <span style={{ fontSize:10, padding:"1px 7px", borderRadius:20, background:"#f1f5f9", color:"#64748b" }}>Class {student.class}{student.section}</span>
                    {student.pct === 100 && (
                      <span style={{ fontSize:10, padding:"1px 7px", borderRadius:20, background:"#f0fdf4", color:"#16a34a", border:"1px solid #86efac", fontWeight:700 }}>🎉 Complete!</span>
                    )}
                  </div>

                  {/* Overall progress bar */}
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <div style={{ flex:1, height:5, background:"#f1f5f9", borderRadius:3, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${student.pct}%`, background:pctColor(student.pct), borderRadius:3 }} />
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, color:pctColor(student.pct), minWidth:35 }}>{student.pct}%</span>
                  </div>

                  {/* Per-subject breakdown */}
                  <div style={{ display:"flex", gap:10 }}>
                    {student.subjectBreakdown.map(b => (
                      <div key={b.title} style={{ display:"flex", alignItems:"center", gap:3 }}>
                        <span style={{ fontSize:10 }}>{b.icon}</span>
                        <span style={{ fontSize:10, color: b.done === b.total ? "#10b981" : "#64748b", fontWeight: b.done > 0 ? 600 : 400 }}>
                          {b.done}/{b.total}
                        </span>
                      </div>
                    ))}
                    <span style={{ fontSize:10, color:"#94a3b8", marginLeft:4 }}>· {timeAgo(student.last_active)}</span>
                  </div>
                </div>

                {/* Right side */}
                <div style={{ flexShrink:0, textAlign:"right" }}>
                  <div style={{ fontSize:11, color:"#6366f1", marginBottom:4 }}>View →</div>
                </div>
              </div>

              {/* Delete button row */}
              <div style={{ borderTop:"1px solid #f1f5f9", padding:"8px 16px", display:"flex", justifyContent:"flex-end" }}>
                <button
                  onClick={e => { e.stopPropagation(); setDeleteId(student.id); setDeleteConfirm(""); }}
                  style={{ padding:"4px 12px", borderRadius:20, border:"1px solid #fecaca", background:"#fef2f2", color:"#ef4444", fontSize:11, fontWeight:600, cursor:"pointer" }}>
                  🗑 Remove Student
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign:"center", padding:40, color:"#94a3b8" }}>
              <div style={{ fontSize:36, marginBottom:8 }}>🔍</div>
              <p style={{ fontSize:14 }}>No students found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}