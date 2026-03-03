import { useState } from "react";
import { PASSWORDS, ACTIVITIES } from "../data/activities";
import { supabase } from "../supabaseClient";

export default function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) { setError("Please enter your name."); return; }
    if (!password.trim()) { setError("Please enter the section password."); return; }

    // Find which section this password unlocks
    const upper = password.trim().toUpperCase();
    const sectionEntry = Object.entries(PASSWORDS).find(([, pw]) => pw === upper);
    if (!sectionEntry) { setError("Incorrect password. Please try again."); return; }

    const section = sectionEntry[0];
    setLoading(true);
    setError("");

    try {
      // Try to find existing student first
      let { data } = await supabase
        .from("students")
        .select("*")
        .eq("name", trimmedName)
        .eq("section", section)
        .single();

      // If not found, insert new student
      if (!data) {
        const { data: newStudent, error: insertErr } = await supabase
          .from("students")
          .insert({ name: trimmedName, section })
          .select()
          .single();
        if (insertErr) throw insertErr;
        data = newStudent;
      }

      const session = { studentId: data.id, name: trimmedName, section };
      localStorage.setItem("beli_session", JSON.stringify(session));
      onLogin(session);
    } catch (err) {
      console.error("Login error:", err);
      setError("Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Use Section 1's theme for login screen
  const act = ACTIVITIES[0];

  return (
    <div style={{ fontFamily: "Georgia, serif", minHeight: "100vh", background: "#F8F6F1" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(140deg, #0D2B24 0%, #1a1a2e 65%)", padding: "20px 36px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.65)", letterSpacing: "0.02em" }}>Columbia Business School</span>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "22px", fontWeight: 700, color: "rgba(255,255,255,0.65)" }}>beli</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 62px)", padding: "40px" }}>
        <div style={{ width: "100%", maxWidth: "380px", background: "#fff", borderRadius: "12px", border: `1px solid ${act.border}`, padding: "36px", boxShadow: "0 4px 30px rgba(0,0,0,0.08)" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: `${act.accent}15`, border: `1px solid ${act.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", marginBottom: "18px" }}>👤</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "22px", fontWeight: 700, color: "#111", margin: "0 0 6px" }}>Welcome to the Beli Exercise</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: act.muted, lineHeight: "1.6", margin: "0 0 24px" }}>Enter your name and section password to begin.</p>

          <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: 600, color: "#555", letterSpacing: "0.04em", display: "block", marginBottom: "5px" }}>YOUR NAME</label>
          <input
            type="text"
            placeholder="First and Last Name"
            value={name}
            onChange={e => { setName(e.target.value); setError(""); }}
            style={{ width: "100%", padding: "10px 13px", fontSize: "14px", background: "#fafafa", color: "#111", border: `1px solid ${error ? "#e05555" : act.border}`, borderRadius: "7px", outline: "none", fontFamily: "'DM Sans',sans-serif", marginBottom: "14px", boxSizing: "border-box" }}
          />

          <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: 600, color: "#555", letterSpacing: "0.04em", display: "block", marginBottom: "5px" }}>SECTION PASSWORD</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{ width: "100%", padding: "10px 13px", fontSize: "14px", background: "#fafafa", color: "#111", border: `1px solid ${error ? "#e05555" : act.border}`, borderRadius: "7px", outline: "none", fontFamily: "'DM Sans',sans-serif", marginBottom: "8px", boxSizing: "border-box" }}
          />

          {error && <p style={{ fontFamily: "'DM Sans',sans-serif", color: "#e05555", fontSize: "12px", margin: "0 0 8px" }}>{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: "100%", padding: "11px", fontSize: "12px", fontWeight: 600, background: act.accent, color: "#fff", border: "none", borderRadius: "7px", cursor: loading ? "wait" : "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "4px", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in..." : "Enter Exercise →"}
          </button>
        </div>
      </div>
    </div>
  );
}
