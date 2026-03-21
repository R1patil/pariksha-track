"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { englishChapters, STATUS_COLORS, STATUS_LABELS, TYPE_LABELS } from "@/lib/chapters";

export default function StudentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [student, setStudent]   = useState<any>(null);
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("pt_admin");
    if (!isAdmin) { router.replace("/admin"); return; }
    loadData();
  }, [id, router]);

  const loadData = async () => {
    const { data: s } = await supabase.from("students").select("*").eq("id", id).single();
    if (!s) { router.replace("/admin/dashboard"); return; }
    setStudent(s);

    const { data: prog } = await supabase.from("progress").select("chapter_id, status").eq("student_id", id);
    const map: Record<string, string> = {};
    (prog || []).forEach((p: any) => { map[p.chapter_id] = p.status; });
    setProgress(map);
    setLoading(false);
  };

  if (loading || !student) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh" }}>
        <div className="spinner" />
      </div>
    );
  }

  const subject = englishChapters[student.class];
  if (!subject) return null;

  const chapters    = subject.chapters;
  const doneCount   = chapters.filter(c => progress[c.id] === "done").length;
  const readingCount = chapters.filter(c => progress[c.id] === "reading").length;
  const pct         = Math.round((doneCount / chapters.length) * 100);
  const color       = subject.color;

  const grouped: Record<string, typeof chapters> = {};
  chapters.forEach(c => {
    if (!grouped[c.type]) grouped[c.type] = [];
    grouped[c.type].push(c);
  });

  const pctColor = pct >= 80 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444";

  const timeStr = new Date(student.last_active).toLocaleString("en-IN", {
    day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit"
  });

  return (
    <div style={{ minHeight:"100vh", background:"#f1f5f9" }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${color},${color}cc)`, padding:"20px 16px 28px" }}>
        <div style={{ maxWidth:600, margin:"0 auto" }}>
          <button onClick={() => router.push("/admin/dashboard")}
            style={{ color:"rgba(255,255,255,0.8)", background:"none", border:"none", cursor:"pointer", fontSize:13, marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
            ← Back to Dashboard
          </button>

          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
            <div style={{ width:52, height:52, borderRadius:16, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:800, color:"white" }}>
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, color:"white" }}>{student.name}</h1>
              <div style={{ display:"flex", gap:10, marginTop:3 }}>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.8)", fontFamily:"monospace" }}>Roll No: {student.roll_number}</span>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.8)" }}>Class {student.class}{student.section}</span>
              </div>
              <p style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:2 }}>Last active: {timeStr}</p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:14, padding:"14px 16px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:10, marginBottom:12 }}>
              {[
                { label:"Done ✓", value:doneCount, color:"#4ade80" },
                { label:"Reading", value:readingCount, color:"#fcd34d" },
                { label:"Pending", value:chapters.length - doneCount - readingCount, color:"#f87171" },
                { label:"Progress", value:`${pct}%`, color:"white" },
              ].map(s => (
                <div key={s.label} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.value}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)", marginTop:1 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ height:8, background:"rgba(255,255,255,0.2)", borderRadius:4, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, background:"white", borderRadius:4 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Chapter list — teacher read only view */}
      <div style={{ maxWidth:600, margin:"0 auto", padding:16 }}>
        <p style={{ fontSize:12, color:"#64748b", marginBottom:14 }}>
          Chapter-wise progress for {student.name}
        </p>

        {Object.entries(grouped).map(([type, chs]) => (
          <div key={type} style={{ marginBottom:18 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>
              {TYPE_LABELS[type]} ({chs.length})
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {chs.map((chapter, i) => {
                const status = progress[chapter.id] || "not_started";
                const sc = STATUS_COLORS[status];
                return (
                  <div key={chapter.id} style={{ background:"white", borderRadius:12, padding:"11px 14px", border:"1px solid #e2e8f0", display:"flex", alignItems:"center", gap:12, borderLeft:`3px solid ${sc}` }}>
                    <div style={{ width:22, height:22, borderRadius:6, background:`${sc}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:sc, flexShrink:0 }}>
                      {i+1}
                    </div>
                    <p style={{ flex:1, fontSize:13, color: status === "done" ? "#94a3b8" : "#1e293b", textDecoration: status === "done" ? "line-through" : "none" }}>
                      {chapter.title}
                    </p>
                    <span style={{ padding:"3px 10px", borderRadius:20, background:`${sc}15`, color:sc, fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
