import { ACTIVITIES } from "../data/activities";

export default function Hero({ active, onSwitchTab, hideTabs }) {
  const act = ACTIVITIES[active];

  return (
    <div style={{ background: `linear-gradient(140deg, ${act.heroDark} 0%, #1a1a2e 65%)`, position: "relative", overflow: "hidden", transition: "background 0.6s" }}>
      <div style={{ position:"absolute", right:"-10px", top:"-30px", fontFamily:"'Playfair Display',serif", fontSize:"240px", fontWeight:900, color:"rgba(255,255,255,0.025)", lineHeight:1, userSelect:"none", pointerEvents:"none" }}>{act.num}</div>

      {/* Top bar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 36px 0" }}>
        <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:600, color:"rgba(255,255,255,0.65)", letterSpacing:"0.02em" }}>Columbia Business School</span>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", background:"rgba(255,255,255,0.07)", padding:"6px 16px", borderRadius:"40px", border:"1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)" }}>Technology Strategy @ CBS</span>
          <div style={{ width:"1px", height:"12px", background:"rgba(255,255,255,0.2)" }} />
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"10px", letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.45)" }}>Spring 2026</span>
        </div>
        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"22px", fontWeight:700, color:"rgba(255,255,255,0.65)" }}>beli</span>
      </div>

      {/* Title */}
      <div style={{ padding:"26px 36px 0" }}>
        <div style={{ display:"inline-block", background:`${act.accent}30`, border:`1px solid ${act.accent}60`, color:act.heroLight, fontFamily:"'DM Sans',sans-serif", fontSize:"10px", letterSpacing:"0.16em", textTransform:"uppercase", padding:"4px 12px", borderRadius:"20px", fontWeight:600, marginBottom:"12px" }}>{act.tag}</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(26px,4vw,48px)", fontWeight:900, color:"#fff", lineHeight:1.1, letterSpacing:"-0.02em", margin:0 }}>
          <span style={{ color:act.heroLight, opacity:0.4, fontSize:"0.5em", verticalAlign:"middle", marginRight:"10px" }}>{act.num}</span>
          {act.title}
        </h1>
        <div style={{ height:"3px", width:"48px", background:act.accent, borderRadius:"2px", marginTop:"14px" }} />
      </div>

      {/* Tabs + case link */}
      <div style={{ display:"flex", alignItems:"center", justifyContent: hideTabs ? "flex-end" : "space-between", marginTop:"22px", borderBottom:"1px solid rgba(255,255,255,0.07)", padding: hideTabs ? "0 36px 0 28px" : "0 36px 0 0" }}>
        {!hideTabs && (
          <div style={{ display:"flex", paddingLeft:"28px" }}>
            {ACTIVITIES.map((a, i) => (
              <button key={i} onClick={() => onSwitchTab(i)} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:500, padding:"12px 20px", letterSpacing:"0.04em", color: active===i ? a.heroLight : "rgba(255,255,255,0.4)", borderBottom: active===i ? `2px solid ${a.heroLight}` : "2px solid transparent", transition:"all 0.2s" }}>{a.section}</button>
            ))}
          </div>
        )}
        <a href="https://drive.google.com/file/d/1Vv3uC43SzevPQQa3b3LZ9_AlMo3EDtzI/view?usp=sharing" target="_blank" rel="noopener noreferrer" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"11px", fontWeight:500, color:"rgba(255,255,255,0.45)", textDecoration:"none", padding:"5px 13px", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"20px", letterSpacing:"0.05em", display:"flex", alignItems:"center", gap:"6px", marginBottom:"10px" }}>
          Case Draft
        </a>
      </div>
    </div>
  );
}
