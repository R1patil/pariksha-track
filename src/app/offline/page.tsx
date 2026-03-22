export default function OfflinePage() {
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, padding:24, background:"#f1f5f9", textAlign:"center" }}>
      <div style={{ fontSize:64 }}>📚</div>
      <h1 style={{ fontSize:22, fontWeight:800, color:"#1e293b" }}>No Internet Connection</h1>
      <p style={{ fontFamily:"'Noto Sans Kannada',sans-serif", fontSize:16, color:"#64748b" }}>
        ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಇಲ್ಲ
      </p>
      <p style={{ fontSize:13, color:"#94a3b8", maxWidth:300, lineHeight:1.6 }}>
        Please check your connection and try again. Your saved progress is safe.
      </p>
      <button onClick={() => window.location.href = "/"}
        style={{ padding:"12px 28px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#6366f1,#4f46e5)", color:"white", fontSize:14, fontWeight:700, cursor:"pointer" }}>
        Try Again
      </button>
    </div>
  );
}