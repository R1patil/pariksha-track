"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { allSubjects } from "@/lib/chapters";

interface UploadStatus {
  chapterId: string;
  status: "pending" | "processing" | "done" | "error";
  chunks?: number;
  error?: string;
}

export default function UploadPage() {
  const [cls, setCls]             = useState("");
  const [subjectIdx, setSubjectIdx] = useState(0);
  const [selectedChapter, setChapter] = useState("");
  const [file, setFile]           = useState<File | null>(null);
  const [status, setStatus]       = useState<UploadStatus | null>(null);
  const [allStatuses, setAllStatuses] = useState<UploadStatus[]>([]);
  const router = useRouter();

  // Guard
  if (typeof window !== "undefined" && !localStorage.getItem("pt_admin")) {
    router.replace("/admin");
    return null;
  }

  const subjects = cls ? (allSubjects[cls] || []) : [];
  const subject  = subjects[subjectIdx];
  const chapters = subject?.chapters || [];

  // Extract text from PDF using browser FileReader + simple text extraction
  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          // Load pdf.js from CDN
          if (!(window as any).pdfjsLib) {
            await new Promise<void>((res, rej) => {
              const script = document.createElement("script");
              script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
              script.onload = () => res();
              script.onerror = rej;
              document.head.appendChild(script);
            });
            (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          }

          const pdf = await (window as any).pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item: any) => item.str).join(" ");
            fullText += pageText + "\n";
          }
          resolve(fullText);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async () => {
    if (!file || !cls || !subject || !selectedChapter) return;

    const chapter = chapters.find(c => c.id === selectedChapter);
    if (!chapter) return;

    setStatus({ chapterId: selectedChapter, status: "processing" });

    try {
      // Extract text from PDF
      const text = await extractTextFromPDF(file);
      if (!text || text.trim().length < 100) {
        setStatus({ chapterId: selectedChapter, status: "error", error: "Could not extract text from PDF. Make sure it's a text-based PDF, not a scanned image." });
        return;
      }

      // Send to embed API
      const res = await fetch("/api/embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          classNum:     cls,
          subject:      subject.id.split("_")[0], // "maths", "science", "english"
          chapterId:    chapter.id,
          chapterTitle: chapter.title,
          sourceFile:   file.name,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus({ chapterId: selectedChapter, status: "done", chunks: data.chunksProcessed });
        setAllStatuses(prev => [...prev.filter(s => s.chapterId !== selectedChapter),
          { chapterId: selectedChapter, status: "done", chunks: data.chunksProcessed }
        ]);
      } else {
        setStatus({ chapterId: selectedChapter, status: "error", error: data.error });
      }
    } catch (err: any) {
      setStatus({ chapterId: selectedChapter, status: "error", error: err.message });
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#f1f5f9" }}>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#7c3aed,#6366f1)", padding:"20px 16px 24px" }}>
        <div style={{ maxWidth:620, margin:"0 auto" }}>
          <button onClick={() => router.push("/admin/dashboard")}
            style={{ color:"rgba(255,255,255,0.8)", background:"none", border:"none", cursor:"pointer", fontSize:13, marginBottom:12 }}>
            ← ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ
          </button>
          <h1 style={{ fontSize:22, fontWeight:800, color:"white" }}>📚 PDF Upload — RAG AI</h1>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.8)", marginTop:4, lineHeight:1.5 }}>
            KSEAB ಪಠ್ಯಪುಸ್ತಕ PDF ಅಪ್ಲೋಡ್ ಮಾಡಿ → AI ಅಧ್ಯಾಯ ಓದುತ್ತದೆ → ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ನಿಖರ ಉತ್ತರ ಕೊಡುತ್ತದೆ
          </p>
        </div>
      </div>

      <div style={{ maxWidth:620, margin:"0 auto", padding:16 }}>

        {/* How it works */}
        <div style={{ background:"white", borderRadius:16, padding:16, marginBottom:16, border:"1px solid #e2e8f0" }}>
          <h3 style={{ fontSize:13, fontWeight:700, color:"#1e293b", marginBottom:10 }}>ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {[
              { step:"1", text:"KSEAB ಪಠ್ಯಪುಸ್ತಕ PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ (ktbs.kar.nic.in ನಿಂದ)", icon:"📥" },
              { step:"2", text:"ತರಗತಿ, ವಿಷಯ, ಅಧ್ಯಾಯ ಆಯ್ಕೆ ಮಾಡಿ", icon:"🎯" },
              { step:"3", text:"PDF ಅಪ್ಲೋಡ್ ಮಾಡಿ — AI ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಓದುತ್ತದೆ", icon:"🤖" },
              { step:"4", text:"ವಿದ್ಯಾರ್ಥಿಗಳು ಈಗ ಪಠ್ಯಪುಸ್ತಕ ಆಧಾರಿತ ಉತ್ತರ ಪಡೆಯುತ್ತಾರೆ", icon:"✅" },
            ].map(s => (
              <div key={s.step} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:16 }}>{s.icon}</span>
                <p style={{ fontSize:12, color:"#475569", lineHeight:1.5 }}>{s.text}</p>
              </div>
            ))}
          </div>
          <a href="https://ktbs.kar.nic.in/new/index.html#!/textbook" target="_blank" rel="noopener noreferrer"
            style={{ display:"inline-block", marginTop:10, fontSize:11, color:"#7c3aed", textDecoration:"none", padding:"5px 12px", borderRadius:20, background:"#f5f3ff", border:"1px solid #ddd6fe" }}>
            📥 KTBS ಪಠ್ಯಪುಸ್ತಕ ಡೌನ್‌ಲೋಡ್ ↗
          </a>
        </div>

        {/* Upload form */}
        <div style={{ background:"white", borderRadius:16, padding:18, marginBottom:16, border:"1px solid #e2e8f0" }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:"#1e293b", marginBottom:14 }}>PDF ಅಪ್ಲೋಡ್ ಮಾಡಿ</h3>

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {/* Class */}
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>ತರಗತಿ *</label>
              <div style={{ display:"flex", gap:8 }}>
                {["8","9","10"].map(c => (
                  <button key={c} onClick={() => { setCls(c); setSubjectIdx(0); setChapter(""); }}
                    style={{ flex:1, padding:"10px", borderRadius:10, border:`2px solid ${cls === c ? "#7c3aed" : "#e2e8f0"}`,
                      background: cls === c ? "#f5f3ff" : "white", color: cls === c ? "#7c3aed" : "#64748b",
                      fontSize:13, fontWeight:700, cursor:"pointer" }}>
                    {c}th
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            {cls && (
              <div>
                <label style={{ fontSize:11, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>ವಿಷಯ *</label>
                <div style={{ display:"flex", gap:8 }}>
                  {subjects.map((s, i) => (
                    <button key={s.id} onClick={() => { setSubjectIdx(i); setChapter(""); }}
                      style={{ flex:1, padding:"10px", borderRadius:10, border:`2px solid ${subjectIdx === i ? s.color : "#e2e8f0"}`,
                        background: subjectIdx === i ? `${s.color}15` : "white",
                        color: subjectIdx === i ? s.color : "#64748b",
                        fontSize:12, fontWeight:700, cursor:"pointer" }}>
                      {s.icon} {s.title.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chapter */}
            {cls && subject && (
              <div>
                <label style={{ fontSize:11, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>ಅಧ್ಯಾಯ *</label>
                <select value={selectedChapter} onChange={e => setChapter(e.target.value)}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:12, outline:"none", background:"white" }}>
                  <option value="">ಅಧ್ಯಾಯ ಆಯ್ಕೆ ಮಾಡಿ...</option>
                  {chapters.map(ch => {
                    const isUploaded = allStatuses.find(s => s.chapterId === ch.id && s.status === "done");
                    return (
                      <option key={ch.id} value={ch.id}>
                        {isUploaded ? "✅ " : ""}{ch.kannadaTitle}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {/* File upload */}
            {selectedChapter && (
              <div>
                <label style={{ fontSize:11, fontWeight:600, color:"#475569", display:"block", marginBottom:5 }}>
                  PDF ಫೈಲ್ * (KSEAB ಪಠ್ಯಪುಸ್ತಕ)
                </label>
                <div
                  onClick={() => document.getElementById("pdf-input")?.click()}
                  style={{ border:"2px dashed #ddd6fe", borderRadius:12, padding:"24px 16px", textAlign:"center", cursor:"pointer",
                    background: file ? "#f5f3ff" : "#fafafa", transition:"all 0.2s" }}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === "application/pdf") setFile(f); }}
                >
                  <div style={{ fontSize:32, marginBottom:8 }}>{file ? "📄" : "📁"}</div>
                  <p style={{ fontSize:12, color: file ? "#7c3aed" : "#64748b", fontWeight: file ? 700 : 400 }}>
                    {file ? file.name : "PDF ಇಲ್ಲಿ ಎಳೆದು ಬಿಡಿ ಅಥವಾ ಕ್ಲಿಕ್ ಮಾಡಿ"}
                  </p>
                  {file && <p style={{ fontSize:10, color:"#94a3b8", marginTop:4 }}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>}
                  <input id="pdf-input" type="file" accept=".pdf" style={{ display:"none" }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
                </div>
              </div>
            )}

            {/* Upload button */}
            {file && selectedChapter && (
              <button
                onClick={handleUpload}
                disabled={status?.status === "processing"}
                style={{ padding:"13px", borderRadius:12, border:"none",
                  background: status?.status === "processing" ? "#94a3b8" : "linear-gradient(135deg,#7c3aed,#6366f1)",
                  color:"white", fontSize:14, fontWeight:700, cursor: status?.status === "processing" ? "not-allowed" : "pointer" }}>
                {status?.status === "processing" ? "⏳ PDF ಪ್ರಕ್ರಿಯೆ ಆಗುತ್ತಿದೆ..." : "🚀 Upload & Train AI"}
              </button>
            )}

            {/* Status */}
            {status && (
              <div style={{ padding:"12px 14px", borderRadius:12, border:"1px solid",
                borderColor: status.status === "done" ? "#86efac" : status.status === "error" ? "#fca5a5" : "#ddd6fe",
                background: status.status === "done" ? "#f0fdf4" : status.status === "error" ? "#fef2f2" : "#f5f3ff" }}>
                {status.status === "processing" && (
                  <div>
                    <p style={{ fontSize:13, color:"#7c3aed", fontWeight:600 }}>⏳ PDF ಪ್ರಕ್ರಿಯೆ ಆಗುತ್ತಿದೆ...</p>
                    <p style={{ fontSize:11, color:"#94a3b8", marginTop:4 }}>ಪಠ್ಯ ಹೊರತೆಗೆಯಲಾಗುತ್ತಿದೆ ಮತ್ತು AI ಕಲಿಯುತ್ತಿದೆ. 1-2 ನಿಮಿಷ ತಾಳ್ಮೆ ವಹಿಸಿ.</p>
                  </div>
                )}
                {status.status === "done" && (
                  <div>
                    <p style={{ fontSize:13, color:"#16a34a", fontWeight:700 }}>✅ AI ತರಬೇತಿ ಯಶಸ್ವಿ!</p>
                    <p style={{ fontSize:11, color:"#16a34a", marginTop:3 }}>
                      {status.chunks} ಪಠ್ಯ ಭಾಗಗಳು ಸಂಸ್ಕರಿಸಲ್ಪಟ್ಟಿವೆ. ವಿದ್ಯಾರ್ಥಿಗಳು ಈಗ ಪಠ್ಯಪುಸ್ತಕ ಆಧಾರಿತ ಉತ್ತರ ಪಡೆಯುತ್ತಾರೆ!
                    </p>
                  </div>
                )}
                {status.status === "error" && (
                  <div>
                    <p style={{ fontSize:13, color:"#dc2626", fontWeight:700 }}>❌ ದೋಷ ಸಂಭವಿಸಿದೆ</p>
                    <p style={{ fontSize:11, color:"#dc2626", marginTop:3 }}>{status.error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Upload progress for all chapters */}
        {allStatuses.length > 0 && (
          <div style={{ background:"white", borderRadius:16, padding:16, border:"1px solid #e2e8f0" }}>
            <h3 style={{ fontSize:13, fontWeight:700, color:"#1e293b", marginBottom:10 }}>✅ ಅಪ್ಲೋಡ್ ಆದ ಅಧ್ಯಾಯಗಳು</h3>
            {allStatuses.filter(s => s.status === "done").map(s => (
              <div key={s.chapterId} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:"1px solid #f1f5f9" }}>
                <span style={{ fontSize:16 }}>✅</span>
                <p style={{ fontSize:12, color:"#1e293b", flex:1 }}>{s.chapterId}</p>
                <span style={{ fontSize:10, color:"#64748b" }}>{s.chunks} chunks</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}