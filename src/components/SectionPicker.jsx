import { useState } from "react";
import { ACTIVITIES } from "../data/activities";
import { apiFetch } from "../lib/hub";

// Shown once, when the class roster doesn't say which section a student is in.
export default function SectionPicker({ name, onPicked }) {
  const [choice, setChoice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!choice) { setError("Please choose your section."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: choice }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const info = await res.json();
      onPicked(info);
    } catch (err) {
      console.error("Section error:", err);
      setError("Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Use Section 1's theme for this screen
  const act = ACTIVITIES[0];

  return (
    <div style={{ fontFamily: "Georgia, serif", minHeight: "100vh", background: "#F8F6F1" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        @media (max-width: 768px) {
          .login-header { padding: 16px !important; }
          .login-body { padding: 20px !important; }
          .login-card { padding: 24px !important; }
        }
      `}</style>

      {/* Header */}
      <div className="login-header" style={{ background: "linear-gradient(140deg, #0D2B24 0%, #1a1a2e 65%)", padding: "20px 36px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.65)", letterSpacing: "0.02em" }}>Columbia Business School</span>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "22px", fontWeight: 700, color: "rgba(255,255,255,0.65)" }}>beli</span>
        </div>
      </div>

      <div className="login-body" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 62px)", padding: "40px" }}>
        <div className="login-card" style={{ width: "100%", maxWidth: "380px", background: "#fff", borderRadius: "12px", border: `1px solid ${act.border}`, padding: "36px", boxShadow: "0 4px 30px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "22px", fontWeight: 700, color: "#111", margin: "0 0 6px" }}>Welcome to the Beli Exercise{name ? `, ${name.split(" ")[0]}` : ""}</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: act.muted, lineHeight: "1.6", margin: "0 0 20px" }}>Which section are you in? You choose once; ask your instructor if it needs changing.</p>

          <div style={{ display: "grid", gap: "8px", marginBottom: "12px" }}>
            {ACTIVITIES.map(a => (
              <label key={a.section} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 13px", border: `1px solid ${choice === a.section ? a.accent : act.border}`, background: choice === a.section ? `${a.accent}10` : "#fafafa", borderRadius: "7px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
                <input type="radio" name="section" value={a.section} checked={choice === a.section} onChange={() => { setChoice(a.section); setError(""); }} />
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>{a.section}</span>
              </label>
            ))}
          </div>

          {error && <p style={{ fontFamily: "'DM Sans',sans-serif", color: "#e05555", fontSize: "12px", margin: "0 0 8px" }}>{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: "100%", padding: "11px", fontSize: "12px", fontWeight: 600, background: act.accent, color: "#fff", border: "none", borderRadius: "7px", cursor: loading ? "wait" : "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "4px", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Saving..." : "Enter Exercise →"}
          </button>
        </div>
      </div>
    </div>
  );
}
