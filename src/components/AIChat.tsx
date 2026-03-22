// "use client";
// import { useState, useRef, useEffect } from "react";
// import { Chapter } from "@/lib/chapters";

// interface Message {
//   role: "user" | "ai";
//   text: string;
//   time: string;
// }

// interface Props {
//   chapter: Chapter;
//   subject: string;
//   classNum: string;
//   onClose: () => void;
// }

// // Quick question suggestions per subject type
// const QUICK_QUESTIONS: Record<string, string[]> = {
//   maths: [
//     "ಈ ಅಧ್ಯಾಯದ ಮುಖ್ಯ ಸೂತ್ರ ಯಾವುದು?",
//     "ಒಂದು ಸರಳ ಉದಾಹರಣೆ ಕೊಡಿ",
//     "ಪರೀಕ್ಷೆಯಲ್ಲಿ ಯಾವ ಪ್ರಶ್ನೆ ಬರುತ್ತದೆ?",
//     "ಹಂತ ಹಂತವಾಗಿ ಹೇಗೆ ಬಿಡಿಸುವುದು?",
//   ],
//   science: [
//     "ಈ ಪಾಠದ ಮುಖ್ಯ ಅಂಶ ಯಾವುದು?",
//     "ಸರಳ ಭಾಷೆಯಲ್ಲಿ ವಿವರಿಸಿ",
//     "ಚಿತ್ರ ಬಿಡಿಸಲು ಯಾವ ಭಾಗಗಳು ಬೇಕು?",
//     "ಪರೀಕ್ಷೆಗೆ ಏನು ಓದಬೇಕು?",
//   ],
//   english: [
//     "What is this chapter about?",
//     "Who are the main characters?",
//     "What is the moral/theme?",
//     "Important questions for exam?",
//   ],
//   default: [
//     "ಈ ಪಾಠ ಬಗ್ಗೆ ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ ಕೊಡಿ",
//     "ಮುಖ್ಯ ಅಂಶಗಳು ಯಾವುವು?",
//     "ಪರೀಕ್ಷೆಗೆ ಮುಖ್ಯ ಪ್ರಶ್ನೆ?",
//     "ಸರಳ ಉದಾಹರಣೆ ಕೊಡಿ",
//   ],
// };

// export default function AIChat({ chapter, subject, classNum, onClose }: Props) {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       role: "ai",
//       text: `ನಮಸ್ಕಾರ! 🙏 ನಾನು ನಿಮ್ಮ AI ಶಿಕ್ಷಕ.\n\n**${chapter.kannadaTitle}** ಬಗ್ಗೆ ಯಾವ ಪ್ರಶ್ನೆ ಬೇಕಾದರೂ ಕೇಳಿ — ಕನ್ನಡದಲ್ಲಿ ಅಥವಾ English ನಲ್ಲಿ! 😊`,
//       time: now(),
//     },
//   ]);
//   const [input, setInput]       = useState("");
//   const [loading, setLoading]   = useState(false);
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const inputRef  = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     setTimeout(() => inputRef.current?.focus(), 300);
//   }, []);

//   function now() {
//     return new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
//   }

//   const subjectType = subject.toLowerCase().includes("maths") ? "maths"
//     : subject.toLowerCase().includes("science") ? "science"
//     : subject.toLowerCase().includes("english") ? "english"
//     : "default";

//   const quickQs = QUICK_QUESTIONS[subjectType];

//   const sendMessage = async (text: string) => {
//     if (!text.trim() || loading) return;
//     setInput("");
//     setLoading(true);

//     const userMsg: Message = { role: "user", text: text.trim(), time: now() };
//     setMessages(prev => [...prev, userMsg]);

//     try {
//       const res = await fetch("/api/ai", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           question:     text.trim(),
//           chapterTitle: chapter.title,
//           kannadaTitle: chapter.kannadaTitle,
//           subject,
//           classNum,
//           concepts:     [], // optional
//         }),
//       });
//       const data = await res.json();
//       const aiMsg: Message = {
//         role: "ai",
//         text: data.answer || "ಉತ್ತರ ಸಿಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
//         time: now(),
//       };
//       setMessages(prev => [...prev, aiMsg]);
//     } catch {
//       setMessages(prev => [...prev, { role:"ai", text:"ಸಂಪರ್ಕ ತಪ್ಪಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.", time:now() }]);
//     }
//     setLoading(false);
//   };

//   // Simple markdown bold renderer
//   const renderText = (text: string) => {
//     return text.split("\n").map((line, i) => {
//       const parts = line.split(/\*\*([^*]+)\*\*/g);
//       return (
//         <span key={i}>
//           {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
//           {i < text.split("\n").length - 1 && <br />}
//         </span>
//       );
//     });
//   };

//   return (
//     <>
//       {/* Backdrop */}
//       <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:200 }} />

//       {/* Panel */}
//       <div style={{
//         position:"fixed", bottom:0, left:0, right:0,
//         height:"85vh", background:"white", borderRadius:"20px 20px 0 0",
//         zIndex:201, display:"flex", flexDirection:"column",
//         boxShadow:"0 -8px 40px rgba(0,0,0,0.2)",
//         animation:"slideUp 0.3s ease",
//       }}>
//         <style>{`@keyframes slideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }`}</style>

//         {/* Header */}
//         <div style={{ padding:"16px 16px 12px", borderBottom:"1px solid #f1f5f9", background:"linear-gradient(135deg,#6366f1,#4f46e5)", borderRadius:"20px 20px 0 0" }}>
//           <div style={{ display:"flex", alignItems:"center", gap:10 }}>
//             <div style={{ width:36, height:36, borderRadius:12, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
//               🤖
//             </div>
//             <div style={{ flex:1 }}>
//               <p style={{ fontSize:13, fontWeight:700, color:"white" }}>AI ಶಿಕ್ಷಕ — Pariksha Sahayaka</p>
//               <p style={{ fontSize:10, color:"rgba(255,255,255,0.8)", marginTop:1 }}>
//                 {chapter.kannadaTitle}
//               </p>
//             </div>
//             <button onClick={onClose} style={{ background:"rgba(255,255,255,0.2)", border:"none", color:"white", borderRadius:20, padding:"4px 12px", fontSize:12, cursor:"pointer" }}>
//               ✕ ಮುಚ್ಚಿ
//             </button>
//           </div>

//           {/* Quick questions */}
//           <div style={{ display:"flex", gap:6, marginTop:10, overflowX:"auto", paddingBottom:4 }}>
//             {quickQs.map((q, i) => (
//               <button key={i} onClick={() => sendMessage(q)}
//                 style={{ flexShrink:0, padding:"5px 12px", borderRadius:20, border:"1px solid rgba(255,255,255,0.4)", background:"rgba(255,255,255,0.15)", color:"white", fontSize:11, cursor:"pointer", whiteSpace:"nowrap" }}>
//                 {q}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Messages */}
//         <div style={{ flex:1, overflowY:"auto", padding:"12px 16px", display:"flex", flexDirection:"column", gap:12 }}>
//           {messages.map((msg, i) => (
//             <div key={i} style={{ display:"flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap:8 }}>
//               {msg.role === "ai" && (
//                 <div style={{ width:28, height:28, borderRadius:10, background:"#ede9fe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, marginTop:2 }}>
//                   🤖
//                 </div>
//               )}
//               <div style={{
//                 maxWidth:"80%", padding:"10px 14px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
//                 background: msg.role === "user" ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "#f8fafc",
//                 border: msg.role === "ai" ? "1px solid #e2e8f0" : "none",
//                 color: msg.role === "user" ? "white" : "#1e293b",
//               }}>
//                 <p style={{ fontSize:13, lineHeight:1.6, fontFamily:"'Noto Sans Kannada', sans-serif" }}>
//                   {renderText(msg.text)}
//                 </p>
//                 <p style={{ fontSize:9, marginTop:4, opacity:0.6, textAlign:"right" }}>{msg.time}</p>
//               </div>
//               {msg.role === "user" && (
//                 <div style={{ width:28, height:28, borderRadius:10, background:"#6366f1", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"white", flexShrink:0, marginTop:2 }}>
//                   👤
//                 </div>
//               )}
//             </div>
//           ))}

//           {/* Loading bubble */}
//           {loading && (
//             <div style={{ display:"flex", gap:8 }}>
//               <div style={{ width:28, height:28, borderRadius:10, background:"#ede9fe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>🤖</div>
//               <div style={{ padding:"10px 14px", borderRadius:"18px 18px 18px 4px", background:"#f8fafc", border:"1px solid #e2e8f0" }}>
//                 <div style={{ display:"flex", gap:4, alignItems:"center" }}>
//                   {[0,1,2].map(i => (
//                     <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:"#6366f1",
//                       animation:"bounce 1s infinite", animationDelay:`${i * 0.2}s` }} />
//                   ))}
//                 </div>
//                 <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0.8);opacity:0.5} 40%{transform:scale(1.2);opacity:1} }`}</style>
//               </div>
//             </div>
//           )}
//           <div ref={bottomRef} />
//         </div>

//         {/* Input */}
//         <div style={{ padding:"12px 16px", borderTop:"1px solid #f1f5f9", background:"white" }}>
//           <div style={{ display:"flex", gap:8, alignItems:"center" }}>
//             <input
//               ref={inputRef}
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
//               placeholder="ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ... (Kannada or English)"
//               disabled={loading}
//               style={{ flex:1, padding:"11px 14px", borderRadius:12, border:"1.5px solid #e2e8f0", fontSize:13, outline:"none", fontFamily:"'Noto Sans Kannada', 'Poppins', sans-serif" }}
//               onFocus={e => (e.target.style.borderColor="#6366f1")}
//               onBlur={e => (e.target.style.borderColor="#e2e8f0")}
//             />
//             <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
//               style={{ width:44, height:44, borderRadius:12, border:"none",
//                 background: input.trim() && !loading ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "#e2e8f0",
//                 color: input.trim() && !loading ? "white" : "#94a3b8",
//                 fontSize:18, cursor: input.trim() && !loading ? "pointer" : "not-allowed",
//                 display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
//               {loading ? "⏳" : "➤"}
//             </button>
//           </div>
//           <p style={{ fontSize:9, color:"#94a3b8", textAlign:"center", marginTop:6 }}>
//             Powered by Groq AI · ಕನ್ನಡ ಮಾಧ್ಯಮ ವಿದ್ಯಾರ್ಥಿಗಳಿಗಾಗಿ
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }



// "use client";
// import { useState, useRef, useEffect } from "react";
// import { Chapter } from "@/lib/chapters";

// interface Message {
//   role: "user" | "ai";
//   text: string;
//   time: string;
// }

// interface Props {
//   chapter: Chapter;
//   subject: string;
//   classNum: string;
//   onClose: () => void;
// }

// // Exam-focused quick questions by subject
// const QUICK_QUESTIONS: Record<string, { label: string; q: string }[]> = {
//   maths: [
//     { label:"📋 ಸಂಪೂರ್ಣ ಸಾರಾಂಶ",         q:"ಈ ಅಧ್ಯಾಯದ ಸಂಪೂರ್ಣ ಸಾರಾಂಶ ಮತ್ತು ಎಲ್ಲ ಸೂತ್ರಗಳು ಕೊಡಿ" },
//     { label:"📝 5 ಅಂಕದ ಪ್ರಶ್ನೆ",           q:"ಈ ಅಧ್ಯಾಯದಿಂದ 5 ಅಂಕದ ಪ್ರಶ್ನೆ ಮತ್ತು ಉತ್ತರ ಕೊಡಿ" },
//     { label:"🔢 ಹಂತ ಹಂತ ಉದಾಹರಣೆ",         q:"ಒಂದು ಸಂಪೂರ್ಣ solved example ಹಂತ ಹಂತವಾಗಿ ಕೊಡಿ" },
//     { label:"⭐ ಪರೀಕ್ಷಾ ಮುಖ್ಯ ಅಂಶ",         q:"ಪರೀಕ್ಷೆಗೆ ಯಾವ ಯಾವ ಅಂಶ ತಪ್ಪದೆ ಓದಬೇಕು?" },
//   ],
//   science: [
//     { label:"📋 ಸಂಪೂರ್ಣ ಸಾರಾಂಶ",           q:"ಈ ಅಧ್ಯಾಯದ ಸಂಪೂರ್ಣ ಸಾರಾಂಶ — ಎಲ್ಲ ಪರಿಕಲ್ಪನೆ, ವ್ಯಾಖ್ಯೆ ಮತ್ತು ಮುಖ್ಯ ಅಂಶ ಕೊಡಿ" },
//     { label:"✏️ 5 ಅಂಕದ ಚಿತ್ರ ಪ್ರಶ್ನೆ",        q:"ಈ ಅಧ್ಯಾಯದಲ್ಲಿ ಯಾವ ಚಿತ್ರ ಬಿಡಿಸಬೇಕು? ಯಾವ ಭಾಗ label ಮಾಡಬೇಕು? ಸಂಪೂರ್ಣ ವಿವರ ಕೊಡಿ" },
//     { label:"📝 4 ಅಂಕ ಪ್ರಶ್ನೋತ್ತರ",          q:"ಈ ಅಧ್ಯಾಯದ 4 ಅಂಕದ ಪ್ರಮುಖ ಪ್ರಶ್ನೆ ಮತ್ತು ಸಂಪೂರ್ಣ ಉತ್ತರ ಕೊಡಿ" },
//     { label:"⭐ SSLC ಪರೀಕ್ಷಾ ತಯಾರಿ",        q:"SSLC ಪರೀಕ್ಷೆಗೆ ಈ ಅಧ್ಯಾಯದಿಂದ ಯಾವ ಪ್ರಶ್ನೆ ಬರುತ್ತದೆ? ಅಂಕ ವಿತರಣೆ ಸಹ ಹೇಳಿ" },
//   ],
//   english: [
//     { label:"📋 Full Summary",              q:"Give complete chapter summary with all important points, characters and themes" },
//     { label:"📝 5 Mark Answer",             q:"Give a model 5 mark answer for this chapter that will score full marks in KSEAB exam" },
//     { label:"💬 Important Q&A",            q:"List the most important questions and model answers for exam from this chapter" },
//     { label:"⭐ Exam Tips",                 q:"What are the key things to write to score full marks for this chapter in board exam?" },
//   ],
//   default: [
//     { label:"📋 ಸಂಪೂರ್ಣ ಸಾರಾಂಶ",           q:"ಈ ಅಧ್ಯಾಯದ ಸಂಪೂರ್ಣ ಸಾರಾಂಶ ಕೊಡಿ" },
//     { label:"📝 ಮುಖ್ಯ ಪ್ರಶ್ನೋತ್ತರ",           q:"ಈ ಅಧ್ಯಾಯದ ಪ್ರಮುಖ ಪ್ರಶ್ನೆ ಮತ್ತು ಉತ್ತರ ಕೊಡಿ" },
//     { label:"⭐ ಪರೀಕ್ಷಾ ಸೂಚನೆ",             q:"ಪರೀಕ್ಷೆಗೆ ಯಾವ ಅಂಶ ಮುಖ್ಯ?" },
//     { label:"🔢 ಉದಾಹರಣೆ",                  q:"ಒಂದು ಸಂಪೂರ್ಣ ಉದಾಹರಣೆ ಕೊಡಿ" },
//   ],
// };

// export default function AIChat({ chapter, subject, classNum, onClose }: Props) {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       role: "ai",
//       text: `ನಮಸ್ಕಾರ! 🙏 ನಾನು ನಿಮ್ಮ AI ಪರೀಕ್ಷಾ ಶಿಕ್ಷಕ.\n\n**${chapter.kannadaTitle}** ಬಗ್ಗೆ ಕೇಳಿ:\n• 1, 2, 3, 4, 5 ಅಂಕದ ಪ್ರಶ್ನೆ ಉತ್ತರ\n• ಸಂಪೂರ್ಣ ಅಧ್ಯಾಯ ಸಾರಾಂಶ\n• ಚಿತ್ರ ಬಿಡಿಸುವ ವಿಧಾನ\n• ಪರೀಕ್ಷಾ ತಯಾರಿ ಸಲಹೆ\n\nಕನ್ನಡದಲ್ಲಿ ಅಥವಾ English ನಲ್ಲಿ ಕೇಳಿ! 😊`,
//       time: now(),
//     },
//   ]);
//   const [input, setInput]     = useState("");
//   const [loading, setLoading] = useState(false);
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const inputRef  = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior:"smooth" });
//   }, [messages]);

//   useEffect(() => {
//     setTimeout(() => inputRef.current?.focus(), 350);
//   }, []);

//   function now() {
//     return new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
//   }

//   const subjectType = subject.toLowerCase().includes("maths")   ? "maths"
//     : subject.toLowerCase().includes("science") ? "science"
//     : subject.toLowerCase().includes("english") ? "english"
//     : "default";

//   const quickQs = QUICK_QUESTIONS[subjectType];

//   const sendMessage = async (text: string) => {
//     if (!text.trim() || loading) return;
//     setInput("");
//     setLoading(true);

//     const userMsg: Message = { role:"user", text:text.trim(), time:now() };
//     setMessages(prev => [...prev, userMsg]);

//     try {
//       const res = await fetch("/api/ai", {
//         method: "POST",
//         headers: { "Content-Type":"application/json" },
//         body: JSON.stringify({
//           question:     text.trim(),
//           chapterTitle: chapter.title,
//           kannadaTitle: chapter.kannadaTitle,
//           subject,
//           classNum,
//           concepts: [],
//         }),
//       });
//       const data = await res.json();
//       const aiMsg: Message = {
//         role: "ai",
//         text: data.answer || "ಉತ್ತರ ಸಿಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
//         time: now(),
//       };
//       setMessages(prev => [...prev, aiMsg]);
//     } catch {
//       setMessages(prev => [...prev, { role:"ai", text:"ಸಂಪರ್ಕ ತಪ್ಪಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.", time:now() }]);
//     }
//     setLoading(false);
//   };

//   // Render markdown-like formatting
//   const renderText = (text: string) => {
//     return text.split("\n").map((line, i) => {
//       // Bold text **...**
//       const parts = line.split(/\*\*([^*]+)\*\*/g);
//       const rendered = parts.map((p, j) =>
//         j % 2 === 1 ? <strong key={j} style={{ color:"#1e293b" }}>{p}</strong> : p
//       );

//       // Heading lines (start with # or are all-caps Kannada section)
//       const isHeading = line.startsWith("##") || line.startsWith("# ");
//       const isPoint = line.trim().startsWith("•") || /^\d+\./.test(line.trim());
//       const isExamTip = line.includes("📌");
//       const isEmpty = line.trim() === "";

//       if (isEmpty) return <br key={i} />;

//       return (
//         <span key={i} style={{
//           display:"block",
//           marginTop: isHeading ? 10 : isPoint ? 2 : 2,
//           fontWeight: isHeading ? 700 : isExamTip ? 600 : 400,
//           color: isExamTip ? "#7c3aed" : isHeading ? "#1e293b" : "inherit",
//           fontSize: isHeading ? 13 : 12,
//           lineHeight: 1.7,
//           paddingLeft: isPoint ? 8 : 0,
//           background: isExamTip ? "#f5f3ff" : "transparent",
//           borderRadius: isExamTip ? 6 : 0,
//           padding: isExamTip ? "3px 8px" : (isPoint ? "0 0 0 8px" : "0"),
//         }}>
//           {rendered}
//         </span>
//       );
//     });
//   };

//   return (
//     <>
//       {/* Backdrop */}
//       <div onClick={onClose}
//         style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:200 }} />

//       {/* Main panel */}
//       <div style={{
//         position:"fixed", bottom:0, left:0, right:0,
//         height:"92vh",
//         background:"white",
//         borderRadius:"20px 20px 0 0",
//         zIndex:201,
//         display:"flex",
//         flexDirection:"column",
//         boxShadow:"0 -8px 40px rgba(0,0,0,0.25)",
//         animation:"slideUp 0.3s ease",
//         maxWidth:640,
//         margin:"0 auto",
//       }}>
//         <style>{`
//           @keyframes slideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }
//           @keyframes bounce { 0%,80%,100%{transform:scale(0.7);opacity:0.5} 40%{transform:scale(1.1);opacity:1} }
//         `}</style>

//         {/* ── Header ── */}
//         <div style={{ background:"linear-gradient(135deg,#7c3aed,#6366f1)", borderRadius:"20px 20px 0 0", padding:"14px 16px 10px", flexShrink:0 }}>
//           <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
//             <div style={{ width:38, height:38, borderRadius:12, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
//               🤖
//             </div>
//             <div style={{ flex:1, minWidth:0 }}>
//               <p style={{ fontSize:13, fontWeight:800, color:"white" }}>AI ಪರೀಕ್ಷಾ ಶಿಕ್ಷಕ</p>
//               <p style={{ fontSize:10, color:"rgba(255,255,255,0.8)", marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
//                 📘 {chapter.kannadaTitle}
//               </p>
//             </div>
//             <button onClick={onClose}
//               style={{ padding:"5px 12px", borderRadius:20, border:"1px solid rgba(255,255,255,0.4)", background:"rgba(255,255,255,0.15)", color:"white", fontSize:11, cursor:"pointer", flexShrink:0 }}>
//               ✕ ಮುಚ್ಚಿ
//             </button>
//           </div>

//           {/* Quick question pills */}
//           <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:2 }}>
//             {quickQs.map((item, i) => (
//               <button key={i} onClick={() => sendMessage(item.q)} disabled={loading}
//                 style={{ flexShrink:0, padding:"6px 12px", borderRadius:20,
//                   border:"1px solid rgba(255,255,255,0.35)",
//                   background:"rgba(255,255,255,0.15)",
//                   color:"white", fontSize:11, fontWeight:600,
//                   cursor: loading ? "not-allowed" : "pointer",
//                   whiteSpace:"nowrap" }}>
//                 {item.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ── Messages ── */}
//         <div style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:14 }}>
//           {messages.map((msg, i) => (
//             <div key={i} style={{ display:"flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap:8, alignItems:"flex-start" }}>

//               {/* AI avatar */}
//               {msg.role === "ai" && (
//                 <div style={{ width:30, height:30, borderRadius:10, background:"#ede9fe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0, marginTop:2 }}>
//                   🤖
//                 </div>
//               )}

//               {/* Bubble */}
//               <div style={{
//                 maxWidth: msg.role === "user" ? "75%" : "88%",
//                 padding:"10px 14px",
//                 borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
//                 background: msg.role === "user" ? "linear-gradient(135deg,#7c3aed,#6366f1)" : "#f8fafc",
//                 border: msg.role === "ai" ? "1px solid #e2e8f0" : "none",
//                 color: msg.role === "user" ? "white" : "#1e293b",
//                 wordBreak:"break-word",
//               }}>
//                 <div style={{ fontSize:12.5, lineHeight:1.7, fontFamily:"'Noto Sans Kannada','Poppins',sans-serif" }}>
//                   {msg.role === "ai" ? renderText(msg.text) : msg.text}
//                 </div>
//                 <p style={{ fontSize:9, marginTop:5, opacity:0.55, textAlign:"right" }}>{msg.time}</p>
//               </div>

//               {/* User avatar */}
//               {msg.role === "user" && (
//                 <div style={{ width:30, height:30, borderRadius:10, background:"#6366f1", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"white", flexShrink:0, marginTop:2 }}>
//                   👤
//                 </div>
//               )}
//             </div>
//           ))}

//           {/* Typing indicator */}
//           {loading && (
//             <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
//               <div style={{ width:30, height:30, borderRadius:10, background:"#ede9fe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>🤖</div>
//               <div style={{ padding:"12px 16px", borderRadius:"4px 18px 18px 18px", background:"#f8fafc", border:"1px solid #e2e8f0" }}>
//                 <div style={{ display:"flex", gap:5, alignItems:"center" }}>
//                   {[0,1,2].map(i => (
//                     <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"#7c3aed", animation:"bounce 1.2s infinite", animationDelay:`${i * 0.2}s` }} />
//                   ))}
//                   <span style={{ fontSize:10, color:"#64748b", marginLeft:4 }}>ಉತ್ತರ ತಯಾರಾಗುತ್ತಿದೆ...</span>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={bottomRef} />
//         </div>

//         {/* ── Input ── */}
//         <div style={{ padding:"10px 16px 14px", borderTop:"1px solid #f1f5f9", background:"white", flexShrink:0 }}>
//           <div style={{ display:"flex", gap:8 }}>
//             <input
//               ref={inputRef}
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
//               placeholder="ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ... (eg: 5 ಅಂಕ ಪ್ರಶ್ನೆ ಕೊಡಿ)"
//               disabled={loading}
//               style={{ flex:1, padding:"11px 14px", borderRadius:12, border:"1.5px solid #e2e8f0", fontSize:13, outline:"none", fontFamily:"'Noto Sans Kannada','Poppins',sans-serif" }}
//               onFocus={e => (e.target.style.borderColor="#7c3aed")}
//               onBlur={e => (e.target.style.borderColor="#e2e8f0")}
//             />
//             <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
//               style={{ width:46, height:46, borderRadius:12, border:"none",
//                 background: input.trim() && !loading ? "linear-gradient(135deg,#7c3aed,#6366f1)" : "#e2e8f0",
//                 color: input.trim() && !loading ? "white" : "#94a3b8",
//                 fontSize:20, cursor: input.trim() && !loading ? "pointer" : "not-allowed",
//                 display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
//               {loading ? "⏳" : "➤"}
//             </button>
//           </div>
//           <p style={{ fontSize:9, color:"#94a3b8", textAlign:"center", marginTop:6 }}>
//             Powered by Groq · Llama 3.3 70B · ಕನ್ನಡ ಮಾಧ್ಯಮ ವಿದ್ಯಾರ್ಥಿಗಳಿಗಾಗಿ
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }


"use client";
import { useState, useRef, useEffect } from "react";
import { Chapter } from "@/lib/chapters";

interface Message {
  role: "user" | "ai";
  text: string;
  time: string;
}

interface Props {
  chapter: Chapter;
  subject: string;
  classNum: string;
  onClose: () => void;
}

// Exam-focused quick questions by subject
const QUICK_QUESTIONS: Record<string, { label: string; q: string }[]> = {
  maths: [
    { label:"📋 ಸಂಪೂರ್ಣ ಸಾರಾಂಶ",         q:"ಈ ಅಧ್ಯಾಯದ ಸಂಪೂರ್ಣ ಸಾರಾಂಶ ಮತ್ತು ಎಲ್ಲ ಸೂತ್ರಗಳು ಕೊಡಿ" },
    { label:"📝 5 ಅಂಕದ ಪ್ರಶ್ನೆ",           q:"ಈ ಅಧ್ಯಾಯದಿಂದ 5 ಅಂಕದ ಪ್ರಶ್ನೆ ಮತ್ತು ಉತ್ತರ ಕೊಡಿ" },
    { label:"🔢 ಹಂತ ಹಂತ ಉದಾಹರಣೆ",         q:"ಒಂದು ಸಂಪೂರ್ಣ solved example ಹಂತ ಹಂತವಾಗಿ ಕೊಡಿ" },
    { label:"⭐ ಪರೀಕ್ಷಾ ಮುಖ್ಯ ಅಂಶ",         q:"ಪರೀಕ್ಷೆಗೆ ಯಾವ ಯಾವ ಅಂಶ ತಪ್ಪದೆ ಓದಬೇಕು?" },
  ],
  science: [
    { label:"📋 ಸಂಪೂರ್ಣ ಸಾರಾಂಶ",           q:"ಈ ಅಧ್ಯಾಯದ ಸಂಪೂರ್ಣ ಸಾರಾಂಶ — ಎಲ್ಲ ಪರಿಕಲ್ಪನೆ, ವ್ಯಾಖ್ಯೆ ಮತ್ತು ಮುಖ್ಯ ಅಂಶ ಕೊಡಿ" },
    { label:"✏️ 5 ಅಂಕದ ಚಿತ್ರ ಪ್ರಶ್ನೆ",        q:"ಈ ಅಧ್ಯಾಯದಲ್ಲಿ ಯಾವ ಚಿತ್ರ ಬಿಡಿಸಬೇಕು? ಯಾವ ಭಾಗ label ಮಾಡಬೇಕು? ಸಂಪೂರ್ಣ ವಿವರ ಕೊಡಿ" },
    { label:"📝 4 ಅಂಕ ಪ್ರಶ್ನೋತ್ತರ",          q:"ಈ ಅಧ್ಯಾಯದ 4 ಅಂಕದ ಪ್ರಮುಖ ಪ್ರಶ್ನೆ ಮತ್ತು ಸಂಪೂರ್ಣ ಉತ್ತರ ಕೊಡಿ" },
    { label:"⭐ SSLC ಪರೀಕ್ಷಾ ತಯಾರಿ",        q:"SSLC ಪರೀಕ್ಷೆಗೆ ಈ ಅಧ್ಯಾಯದಿಂದ ಯಾವ ಪ್ರಶ್ನೆ ಬರುತ್ತದೆ? ಅಂಕ ವಿತರಣೆ ಸಹ ಹೇಳಿ" },
  ],
  english: [
    { label:"📋 Full Summary",              q:"Give complete chapter summary with all important points, characters and themes" },
    { label:"📝 5 Mark Answer",             q:"Give a model 5 mark answer for this chapter that will score full marks in KSEAB exam" },
    { label:"💬 Important Q&A",            q:"List the most important questions and model answers for exam from this chapter" },
    { label:"⭐ Exam Tips",                 q:"What are the key things to write to score full marks for this chapter in board exam?" },
  ],
  default: [
    { label:"📋 ಸಂಪೂರ್ಣ ಸಾರಾಂಶ",           q:"ಈ ಅಧ್ಯಾಯದ ಸಂಪೂರ್ಣ ಸಾರಾಂಶ ಕೊಡಿ" },
    { label:"📝 ಮುಖ್ಯ ಪ್ರಶ್ನೋತ್ತರ",           q:"ಈ ಅಧ್ಯಾಯದ ಪ್ರಮುಖ ಪ್ರಶ್ನೆ ಮತ್ತು ಉತ್ತರ ಕೊಡಿ" },
    { label:"⭐ ಪರೀಕ್ಷಾ ಸೂಚನೆ",             q:"ಪರೀಕ್ಷೆಗೆ ಯಾವ ಅಂಶ ಮುಖ್ಯ?" },
    { label:"🔢 ಉದಾಹರಣೆ",                  q:"ಒಂದು ಸಂಪೂರ್ಣ ಉದಾಹರಣೆ ಕೊಡಿ" },
  ],
};

export default function AIChat({ chapter, subject, classNum, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: `ನಮಸ್ಕಾರ! 🙏 ನಾನು ನಿಮ್ಮ AI ಪರೀಕ್ಷಾ ಶಿಕ್ಷಕ.\n\n**${chapter.kannadaTitle}** ಬಗ್ಗೆ ಕೇಳಿ:\n• 1, 2, 3, 4, 5 ಅಂಕದ ಪ್ರಶ್ನೆ ಉತ್ತರ\n• ಸಂಪೂರ್ಣ ಅಧ್ಯಾಯ ಸಾರಾಂಶ\n• ಚಿತ್ರ ಬಿಡಿಸುವ ವಿಧಾನ\n• ಪರೀಕ್ಷಾ ತಯಾರಿ ಸಲಹೆ\n\nಕನ್ನಡದಲ್ಲಿ ಅಥವಾ English ನಲ್ಲಿ ಕೇಳಿ! 😊`,
      time: now(),
    },
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 350);
  }, []);

  function now() {
    return new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
  }

  const subjectType = subject.toLowerCase().includes("maths")   ? "maths"
    : subject.toLowerCase().includes("science") ? "science"
    : subject.toLowerCase().includes("english") ? "english"
    : "default";

  const quickQs = QUICK_QUESTIONS[subjectType];

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    setLoading(true);

    const userMsg: Message = { role:"user", text:text.trim(), time:now() };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch("/api/rag", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
          question:     text.trim(),
          chapterTitle: chapter.title,
          kannadaTitle: chapter.kannadaTitle,
          chapterId:    chapter.id,
          subject,
          classNum,
        }),
      });
      const data = await res.json();
      const ragTag = data.hasRAG ? "\n\n📚 *ಪಠ್ಯಪುಸ್ತಕ ಆಧಾರಿತ ಉತ್ತರ*" : "\n\n⚠️ *PDF ಅಪ್ಲೋಡ್ ಆಗಿಲ್ಲ — ಸಾಮಾನ್ಯ ಜ್ಞಾನ*";
      const aiMsg: Message = {
        role: "ai",
        text: (data.answer || "ಉತ್ತರ ಸಿಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.") + ragTag,
        time: now(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, { role:"ai", text:"ಸಂಪರ್ಕ ತಪ್ಪಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.", time:now() }]);
    }
    setLoading(false);
  };

  // Render markdown-like formatting
  const renderText = (text: string) => {
    return text.split("\n").map((line, i) => {
      // Bold text **...**
      const parts = line.split(/\*\*([^*]+)\*\*/g);
      const rendered = parts.map((p, j) =>
        j % 2 === 1 ? <strong key={j} style={{ color:"#1e293b" }}>{p}</strong> : p
      );

      // Heading lines (start with # or are all-caps Kannada section)
      const isHeading = line.startsWith("##") || line.startsWith("# ");
      const isPoint = line.trim().startsWith("•") || /^\d+\./.test(line.trim());
      const isExamTip = line.includes("📌");
      const isEmpty = line.trim() === "";

      if (isEmpty) return <br key={i} />;

      return (
        <span key={i} style={{
          display:"block",
          marginTop: isHeading ? 10 : isPoint ? 2 : 2,
          fontWeight: isHeading ? 700 : isExamTip ? 600 : 400,
          color: isExamTip ? "#7c3aed" : isHeading ? "#1e293b" : "inherit",
          fontSize: isHeading ? 13 : 12,
          lineHeight: 1.7,
          paddingLeft: isPoint ? 8 : 0,
          background: isExamTip ? "#f5f3ff" : "transparent",
          borderRadius: isExamTip ? 6 : 0,
          padding: isExamTip ? "3px 8px" : (isPoint ? "0 0 0 8px" : "0"),
        }}>
          {rendered}
        </span>
      );
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose}
        style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:200 }} />

      {/* Main panel */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0,
        height:"92vh",
        background:"white",
        borderRadius:"20px 20px 0 0",
        zIndex:201,
        display:"flex",
        flexDirection:"column",
        boxShadow:"0 -8px 40px rgba(0,0,0,0.25)",
        animation:"slideUp 0.3s ease",
        maxWidth:640,
        margin:"0 auto",
      }}>
        <style>{`
          @keyframes slideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }
          @keyframes bounce { 0%,80%,100%{transform:scale(0.7);opacity:0.5} 40%{transform:scale(1.1);opacity:1} }
        `}</style>

        {/* ── Header ── */}
        <div style={{ background:"linear-gradient(135deg,#7c3aed,#6366f1)", borderRadius:"20px 20px 0 0", padding:"14px 16px 10px", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{ width:38, height:38, borderRadius:12, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
              🤖
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:13, fontWeight:800, color:"white" }}>AI ಪರೀಕ್ಷಾ ಶಿಕ್ಷಕ</p>
              <p style={{ fontSize:10, color:"rgba(255,255,255,0.8)", marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                📘 {chapter.kannadaTitle}
              </p>
            </div>
            <button onClick={onClose}
              style={{ padding:"5px 12px", borderRadius:20, border:"1px solid rgba(255,255,255,0.4)", background:"rgba(255,255,255,0.15)", color:"white", fontSize:11, cursor:"pointer", flexShrink:0 }}>
              ✕ ಮುಚ್ಚಿ
            </button>
          </div>

          {/* Quick question pills */}
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:2 }}>
            {quickQs.map((item, i) => (
              <button key={i} onClick={() => sendMessage(item.q)} disabled={loading}
                style={{ flexShrink:0, padding:"6px 12px", borderRadius:20,
                  border:"1px solid rgba(255,255,255,0.35)",
                  background:"rgba(255,255,255,0.15)",
                  color:"white", fontSize:11, fontWeight:600,
                  cursor: loading ? "not-allowed" : "pointer",
                  whiteSpace:"nowrap" }}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Messages ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:14 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display:"flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap:8, alignItems:"flex-start" }}>

              {/* AI avatar */}
              {msg.role === "ai" && (
                <div style={{ width:30, height:30, borderRadius:10, background:"#ede9fe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0, marginTop:2 }}>
                  🤖
                </div>
              )}

              {/* Bubble */}
              <div style={{
                maxWidth: msg.role === "user" ? "75%" : "88%",
                padding:"10px 14px",
                borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                background: msg.role === "user" ? "linear-gradient(135deg,#7c3aed,#6366f1)" : "#f8fafc",
                border: msg.role === "ai" ? "1px solid #e2e8f0" : "none",
                color: msg.role === "user" ? "white" : "#1e293b",
                wordBreak:"break-word",
              }}>
                <div style={{ fontSize:12.5, lineHeight:1.7, fontFamily:"'Noto Sans Kannada','Poppins',sans-serif" }}>
                  {msg.role === "ai" ? renderText(msg.text) : msg.text}
                </div>
                <p style={{ fontSize:9, marginTop:5, opacity:0.55, textAlign:"right" }}>{msg.time}</p>
              </div>

              {/* User avatar */}
              {msg.role === "user" && (
                <div style={{ width:30, height:30, borderRadius:10, background:"#6366f1", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"white", flexShrink:0, marginTop:2 }}>
                  👤
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
              <div style={{ width:30, height:30, borderRadius:10, background:"#ede9fe", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>🤖</div>
              <div style={{ padding:"12px 16px", borderRadius:"4px 18px 18px 18px", background:"#f8fafc", border:"1px solid #e2e8f0" }}>
                <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"#7c3aed", animation:"bounce 1.2s infinite", animationDelay:`${i * 0.2}s` }} />
                  ))}
                  <span style={{ fontSize:10, color:"#64748b", marginLeft:4 }}>ಉತ್ತರ ತಯಾರಾಗುತ್ತಿದೆ...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── Input ── */}
        <div style={{ padding:"10px 16px 14px", borderTop:"1px solid #f1f5f9", background:"white", flexShrink:0 }}>
          <div style={{ display:"flex", gap:8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              placeholder="ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ... (eg: 5 ಅಂಕ ಪ್ರಶ್ನೆ ಕೊಡಿ)"
              disabled={loading}
              style={{ flex:1, padding:"11px 14px", borderRadius:12, border:"1.5px solid #e2e8f0", fontSize:13, outline:"none", fontFamily:"'Noto Sans Kannada','Poppins',sans-serif" }}
              onFocus={e => (e.target.style.borderColor="#7c3aed")}
              onBlur={e => (e.target.style.borderColor="#e2e8f0")}
            />
            <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
              style={{ width:46, height:46, borderRadius:12, border:"none",
                background: input.trim() && !loading ? "linear-gradient(135deg,#7c3aed,#6366f1)" : "#e2e8f0",
                color: input.trim() && !loading ? "white" : "#94a3b8",
                fontSize:20, cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {loading ? "⏳" : "➤"}
            </button>
          </div>
          <p style={{ fontSize:9, color:"#94a3b8", textAlign:"center", marginTop:6 }}>
            Powered by Groq · Llama 3.3 70B · ಕನ್ನಡ ಮಾಧ್ಯಮ ವಿದ್ಯಾರ್ಥಿಗಳಿಗಾಗಿ
          </p>
        </div>
      </div>
    </>
  );
}