export default function BriefContent({ act, animKey }) {
  return (
    <div key={animKey} style={{ background: act.contentBg, paddingBottom: "48px" }}>
      {/* Context + Task */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: `1px solid ${act.border}` }}>
        <div className="fu0" style={{ padding: "30px 36px", borderRight: `1px solid ${act.border}` }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: act.accent, marginBottom: "10px", fontWeight: 600 }}>Strategic Context</div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15.5px", lineHeight: "1.8", color: act.muted, margin: 0 }}>{act.context}</p>
        </div>
        <div className="fu1" style={{ padding: "30px 36px" }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: act.accent, marginBottom: "10px", fontWeight: 600 }}>Your Task · 15 min</div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15.5px", lineHeight: "1.8", color: "#1a1a1a", margin: 0 }}>{act.task}</p>
        </div>
      </div>

      {/* Criteria */}
      <div className="fu2" style={{ padding: "26px 36px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ height: "1px", flex: 1, background: act.border }} />
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: act.muted, whiteSpace: "nowrap", fontWeight: 600 }}>Four Criteria · Score Each Option 1–3</span>
          <div style={{ height: "1px", flex: 1, background: act.border }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {act.pillars.map((p, i) => (
            <div key={i} className="pil" style={{ background: act.cardBg, border: `1px solid ${act.border}`, borderRadius: "8px", padding: "13px", display: "flex", gap: "10px", alignItems: "flex-start", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ minWidth: "24px", height: "24px", borderRadius: "5px", background: act.accent, color: "#fff", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>{i + 1}</div>
              <div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, color: act.accent, marginBottom: "3px" }}>{p.label}</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: act.muted, lineHeight: "1.5", fontStyle: "italic" }}>{p.quote}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="fu3" style={{ padding: "22px 36px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ height: "1px", flex: 1, background: act.border }} />
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: act.muted, whiteSpace: "nowrap", fontWeight: 600 }}>{act.optLabel}</span>
          <div style={{ height: "1px", flex: 1, background: act.border }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: act.options.length === 7 ? "repeat(4,1fr)" : "repeat(3,1fr)", gap: "8px" }}>
          {act.options.map((o, i) => (
            <div key={i} className="opt" style={{ background: act.cardBg, borderRadius: "8px", padding: "13px", borderTop: `3px solid ${act.accent}`, border: `1px solid ${act.border}`, borderTopColor: act.accent, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", fontWeight: 600, color: "#111", marginBottom: "5px" }}>{o.name}</div>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: act.muted, lineHeight: "1.6" }}>{o.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: act.muted, fontStyle: "italic", marginTop: "8px", opacity: 0.7 }}>{act.scoring}</div>
      </div>

      {/* Slide */}
      <div style={{ padding: "22px 36px 0" }}>
        <div style={{ border: `2px dashed ${act.border}`, borderRadius: "10px", padding: "22px", background: act.cardBg, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: act.accent, marginBottom: "12px", fontWeight: 600 }}>Your One-Slide Presentation Must Include</div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {act.slide.map((s, i) => (
              <div key={i} style={{ flex: "1", minWidth: "180px", background: act.contentBg, border: `1px solid ${act.border}`, borderRadius: "8px", padding: "13px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ minWidth: "22px", height: "22px", borderRadius: "5px", background: act.accent, color: "#fff", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>{i + 1}</div>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14.5px", color: "#222", lineHeight: "1.5" }}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: act.muted, fontStyle: "italic", marginTop: "12px", opacity: 0.6 }}>Groups presenting should be ready to share their slide in under 3 minutes.</div>
        </div>
      </div>
    </div>
  );
}
