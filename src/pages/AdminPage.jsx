import { useState, useEffect, useRef } from "react";
import { ACTIVITIES } from "../data/activities";
import { supabase } from "../supabaseClient";

const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || "BELIADMIN";

function AdminLogin({ onAuth }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (pw.trim().toUpperCase() === ADMIN_PASSWORD.toUpperCase()) {
      sessionStorage.setItem("beli_admin", "1");
      onAuth();
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ fontFamily: "Georgia, serif", minHeight: "100vh", background: "#F8F6F1" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "40px" }}>
        <div style={{ width: "100%", maxWidth: "360px", background: "#fff", borderRadius: "12px", border: "1px solid #ddd", padding: "32px", boxShadow: "0 4px 30px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "19px", fontWeight: 700, color: "#111", margin: "0 0 8px" }}>Admin Dashboard</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#666", lineHeight: "1.6", margin: "0 0 22px" }}>Enter the admin password to continue.</p>
          <input type="password" placeholder="Admin password" value={pw}
            onChange={e => { setPw(e.target.value); setError(false); }}
            onKeyDown={e => e.key === "Enter" && submit()}
            style={{ width: "100%", padding: "10px 13px", fontSize: "14px", background: "#fafafa", color: "#111", border: `1px solid ${error ? "#e05555" : "#ddd"}`, borderRadius: "7px", outline: "none", fontFamily: "'DM Sans',sans-serif", marginBottom: "8px", boxSizing: "border-box" }}
          />
          {error && <p style={{ fontFamily: "'DM Sans',sans-serif", color: "#e05555", fontSize: "12px", margin: "0 0 8px" }}>Incorrect password.</p>}
          <button onClick={submit} style={{ width: "100%", padding: "11px", fontSize: "12px", fontWeight: 600, background: "#333", color: "#fff", border: "none", borderRadius: "7px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "4px" }}>
            Enter →
          </button>
        </div>
      </div>
    </div>
  );
}

function NameWithTooltip({ name, rankings, act, font }) {
  const [show, setShow] = useState(false);
  const ref = useRef(null);

  const sorted = rankings
    ? Object.entries(rankings).sort((a, b) => a[1] - b[1])
    : [];

  return (
    <div
      ref={ref}
      style={{ position: "relative", cursor: "default" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span style={{ fontFamily: font, fontSize: "13px", fontWeight: 600, color: "#111", borderBottom: "1px dashed " + act.muted }}>{name}</span>
      {show && sorted.length > 0 && (
        <div style={{
          position: "absolute", left: 0, top: "100%", marginTop: "6px", zIndex: 10,
          background: "#fff", border: `1px solid ${act.border}`, borderRadius: "8px",
          padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          whiteSpace: "nowrap", minWidth: "200px"
        }}>
          <div style={{ fontFamily: font, fontSize: "10px", fontWeight: 700, color: act.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
            {name}'s Rankings
          </div>
          {sorted.map(([optName, rank]) => (
            <div key={optName} style={{ fontFamily: font, fontSize: "12px", color: "#333", padding: "2px 0", display: "flex", gap: "8px" }}>
              <span style={{ fontWeight: 700, color: act.accent, minWidth: "18px" }}>{rank}</span>
              <span>{optName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("beli_admin") === "1");
  const [activeSection, setActiveSection] = useState(0);
  const [activeView, setActiveView] = useState("analysis");
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const act = ACTIVITIES[activeSection];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subRes, stuRes] = await Promise.all([
        supabase.from("submissions").select("*"),
        supabase.from("students").select("*"),
      ]);
      if (subRes.data) setSubmissions(subRes.data);
      if (stuRes.data) setStudents(stuRes.data);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearSection = async () => {
    setClearing(true);
    try {
      const section = act.section;
      // Delete submissions for this section first (FK constraint)
      await supabase.from("submissions").delete().eq("section", section);
      // Delete students for this section
      await supabase.from("students").delete().eq("section", section);
      await fetchData();
    } catch (err) {
      console.error("Clear error:", err);
    } finally {
      setClearing(false);
      setConfirmClear(false);
    }
  };

  useEffect(() => {
    if (authed) fetchData();
  }, [authed]); // eslint-disable-line

  if (!authed) return <AdminLogin onAuth={() => setAuthed(true)} />;

  const section = act.section;
  const sectionSubs = submissions.filter(s => s.section === section);
  const studentMap = {};
  students.forEach(s => { studentMap[s.id] = s; });

  // Compute averages
  const computeAverages = () => {
    if (sectionSubs.length === 0) return {};
    const sums = {};
    const counts = {};
    sectionSubs.forEach(sub => {
      Object.entries(sub.rankings).forEach(([name, rank]) => {
        sums[name] = (sums[name] || 0) + rank;
        counts[name] = (counts[name] || 0) + 1;
      });
    });
    const avgs = {};
    Object.keys(sums).forEach(name => { avgs[name] = sums[name] / counts[name]; });
    return avgs;
  };

  const averages = computeAverages();
  const sortedAvgs = Object.entries(averages).sort((a, b) => a[1] - b[1]);
  const maxRank = act.options.length;

  // Divergence
  const computeDivergence = () => {
    if (sectionSubs.length === 0) return { overall: [], outliers: {} };

    const overall = sectionSubs.map(sub => {
      const student = studentMap[sub.student_id];
      let sumSq = 0;
      Object.entries(sub.rankings).forEach(([name, rank]) => {
        const avg = averages[name] || rank;
        sumSq += (rank - avg) ** 2;
      });
      return { name: student?.name || "Unknown", studentId: sub.student_id, score: sumSq, rankings: sub.rankings };
    }).sort((a, b) => b.score - a.score);

    const outliers = {};
    act.options.forEach(o => {
      const avg = averages[o.name];
      if (avg == null) return;
      const devs = [];
      sectionSubs.forEach(sub => {
        const rank = sub.rankings[o.name];
        if (rank == null) return;
        const diff = rank - avg;
        if (Math.abs(diff) >= 2.0) {
          const student = studentMap[sub.student_id];
          devs.push({ name: student?.name || "Unknown", rank, avg, diff });
        }
      });
      if (devs.length > 0) outliers[o.name] = devs.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
    });

    return { overall, outliers };
  };

  const { overall: divOverall, outliers: divOutliers } = computeDivergence();

  const font = "'DM Sans',sans-serif";
  const viewBtns = [
    { key: "analysis", label: "Analysis" },
    { key: "submissions", label: "Submissions" },
  ];

  return (
    <div style={{ fontFamily: "Georgia, serif", minHeight: "100vh", background: "#F8F6F1" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Header */}
      <div style={{ background: "#1a1a2e", padding: "16px 36px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "20px", fontWeight: 700, color: "#fff" }}>Beli Admin</span>
            <span style={{ fontFamily: font, fontSize: "12px", color: "rgba(255,255,255,0.4)", marginLeft: "14px" }}>
              {submissions.length} total submissions · {students.length} students
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={fetchData} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)", fontFamily: font, fontSize: "11px", padding: "5px 14px", borderRadius: "4px", cursor: "pointer" }}>
              Refresh
            </button>
            <button onClick={() => { sessionStorage.removeItem("beli_admin"); setAuthed(false); }} style={{ background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)", fontFamily: font, fontSize: "11px", padding: "5px 14px", borderRadius: "4px", cursor: "pointer" }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Section tabs */}
        <div style={{ display: "flex", gap: "0", marginTop: "14px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          {ACTIVITIES.map((a, i) => (
            <button key={i} onClick={() => { setActiveSection(i); setActiveView("analysis"); setConfirmClear(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: font, fontSize: "13px", fontWeight: 500, padding: "10px 20px", color: activeSection === i ? a.heroLight : "rgba(255,255,255,0.4)", borderBottom: activeSection === i ? `2px solid ${a.heroLight}` : "2px solid transparent", transition: "all 0.2s" }}>
              {a.section}
            </button>
          ))}
        </div>
      </div>

      {/* View toggle + clear button */}
      <div style={{ background: act.contentBg, padding: "16px 36px 0", borderBottom: `1px solid ${act.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {viewBtns.map(v => (
            <button key={v.key} onClick={() => setActiveView(v.key)}
              style={{ fontFamily: font, fontSize: "12px", fontWeight: 600, padding: "8px 18px", border: `1px solid ${act.border}`, borderBottom: "none", borderRadius: "6px 6px 0 0", cursor: "pointer", background: activeView === v.key ? act.cardBg : "transparent", color: activeView === v.key ? act.accent : act.muted }}>
              {v.label}
            </button>
          ))}
        </div>
        <div style={{ paddingBottom: "8px" }}>
          {!confirmClear ? (
            <button
              onClick={() => setConfirmClear(true)}
              disabled={sectionSubs.length === 0}
              style={{ fontFamily: font, fontSize: "11px", fontWeight: 600, padding: "5px 14px", border: "1px solid #e0555555", borderRadius: "4px", cursor: sectionSubs.length === 0 ? "default" : "pointer", background: "transparent", color: sectionSubs.length === 0 ? "#ccc" : "#e05555" }}
            >
              Clear {act.section} Data
            </button>
          ) : (
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontFamily: font, fontSize: "11px", color: "#e05555", fontWeight: 600 }}>Delete all data for {act.section}?</span>
              <button
                onClick={clearSection}
                disabled={clearing}
                style={{ fontFamily: font, fontSize: "11px", fontWeight: 700, padding: "5px 14px", border: "none", borderRadius: "4px", cursor: "pointer", background: "#e05555", color: "#fff" }}
              >
                {clearing ? "Clearing..." : "Yes, Clear"}
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                style={{ fontFamily: font, fontSize: "11px", padding: "5px 14px", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer", background: "transparent", color: "#666" }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ background: act.contentBg, padding: "24px 36px 48px", minHeight: "60vh" }}>
        {loading && <p style={{ fontFamily: font, color: act.muted, textAlign: "center", padding: "40px" }}>Loading...</p>}

        {!loading && sectionSubs.length === 0 && (
          <p style={{ fontFamily: font, color: act.muted, textAlign: "center", padding: "40px", fontStyle: "italic" }}>No submissions yet for {section}.</p>
        )}

        {/* ANALYSIS VIEW (Averages + Divergence combined) */}
        {!loading && sectionSubs.length > 0 && activeView === "analysis" && (
          <div>
            {/* Average Rankings */}
            <div style={{ background: act.cardBg, border: `1px solid ${act.border}`, borderRadius: "10px", padding: "24px", marginBottom: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <div style={{ fontFamily: font, fontSize: "11px", color: act.muted, marginBottom: "16px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Average Rankings · {sectionSubs.length} submissions
              </div>
              {sortedAvgs.map(([name, avg], i) => {
                const pct = ((maxRank - avg) / (maxRank - 1)) * 100;
                return (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: i < sortedAvgs.length - 1 ? "10px" : 0 }}>
                    <div style={{ width: "24px", fontFamily: font, fontSize: "14px", fontWeight: 700, color: act.accent, textAlign: "center" }}>{i + 1}</div>
                    <div style={{ width: "180px", fontFamily: font, fontSize: "13px", fontWeight: 600, color: "#111", flexShrink: 0 }}>{name}</div>
                    <div style={{ flex: 1, background: act.contentBg, borderRadius: "4px", height: "24px", overflow: "hidden", border: `1px solid ${act.border}` }}>
                      <div style={{ width: `${Math.max(pct, 5)}%`, height: "100%", background: act.accent, borderRadius: "4px", transition: "width 0.5s ease" }} />
                    </div>
                    <div style={{ width: "55px", fontFamily: font, fontSize: "13px", color: act.muted, textAlign: "right", fontWeight: 600 }}>{avg.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>

            {/* Overall Divergence Scores */}
            <div style={{ background: act.cardBg, border: `1px solid ${act.border}`, borderRadius: "10px", padding: "24px", marginBottom: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <div style={{ fontFamily: font, fontSize: "11px", color: act.muted, marginBottom: "16px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Student Divergence Scores (Sum of Squared Deviations)
              </div>
              {divOverall.map((d, i) => {
                const maxScore = divOverall[0]?.score || 1;
                const pct = (d.score / maxScore) * 100;
                return (
                  <div key={d.studentId} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: i < divOverall.length - 1 ? "8px" : 0 }}>
                    <div style={{ width: "160px", flexShrink: 0 }}>
                      <NameWithTooltip name={d.name} rankings={d.rankings} act={act} font={font} />
                    </div>
                    <div style={{ flex: 1, background: act.contentBg, borderRadius: "4px", height: "20px", overflow: "hidden", border: `1px solid ${act.border}` }}>
                      <div style={{ width: `${Math.max(pct, 3)}%`, height: "100%", background: d.score > 0 ? "#e05555" : act.accent, borderRadius: "4px", opacity: 0.7 }} />
                    </div>
                    <div style={{ width: "55px", fontFamily: font, fontSize: "12px", color: act.muted, textAlign: "right" }}>{d.score.toFixed(1)}</div>
                  </div>
                );
              })}
            </div>

            {/* Item-Level Outliers */}
            <div style={{ background: act.cardBg, border: `1px solid ${act.border}`, borderRadius: "10px", padding: "24px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <div style={{ fontFamily: font, fontSize: "11px", color: act.muted, marginBottom: "16px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Item-Level Outliers (Deviating 2+ Ranks from Average)
              </div>
              {Object.keys(divOutliers).length === 0 && (
                <p style={{ fontFamily: font, fontSize: "13px", color: act.muted, fontStyle: "italic" }}>No significant outliers detected.</p>
              )}
              {Object.entries(divOutliers).map(([optionName, devs]) => (
                <div key={optionName} style={{ marginBottom: "14px" }}>
                  <div style={{ fontFamily: font, fontSize: "13px", fontWeight: 700, color: act.accent, marginBottom: "6px" }}>{optionName} <span style={{ fontWeight: 400, fontSize: "12px", color: act.muted }}>(avg: {averages[optionName]?.toFixed(1)})</span></div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {devs.map((d, i) => {
                      const isHigher = d.diff < 0;
                      return (
                        <span key={i} style={{
                          fontFamily: font, fontSize: "12px", padding: "4px 10px", borderRadius: "4px",
                          background: isHigher ? "#e6f9e6" : "#ffe6e6",
                          color: isHigher ? "#1a6b1a" : "#b33",
                          border: `1px solid ${isHigher ? "#b3e6b3" : "#f0b3b3"}`,
                        }}>
                          {d.name}: ranked {d.rank} ({d.diff > 0 ? "+" : ""}{d.diff.toFixed(1)})
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div style={{ fontFamily: font, fontSize: "11px", color: act.muted, marginTop: "12px", opacity: 0.6, fontStyle: "italic" }}>
                Green = ranked higher than consensus (more optimistic). Red = ranked lower (more skeptical).
              </div>
            </div>
          </div>
        )}

        {/* SUBMISSIONS VIEW */}
        {!loading && sectionSubs.length > 0 && activeView === "submissions" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: font, fontSize: "13px", background: act.cardBg, borderRadius: "10px", overflow: "hidden", border: `1px solid ${act.border}` }}>
              <thead>
                <tr style={{ background: `${act.accent}10` }}>
                  <th style={{ padding: "10px 14px", textAlign: "left", color: act.accent, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: `1px solid ${act.border}` }}>Student</th>
                  {act.options.map(o => (
                    <th key={o.name} style={{ padding: "10px 8px", textAlign: "center", color: act.accent, fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid ${act.border}`, minWidth: "60px" }}>{o.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sectionSubs.map((sub, i) => {
                  const student = studentMap[sub.student_id];
                  return (
                    <tr key={sub.id} style={{ borderBottom: i < sectionSubs.length - 1 ? `1px solid ${act.border}` : "none" }}>
                      <td style={{ padding: "10px 14px", fontWeight: 600, color: "#111" }}>{student?.name || "Unknown"}</td>
                      {act.options.map(o => (
                        <td key={o.name} style={{ padding: "10px 8px", textAlign: "center", color: act.muted }}>{sub.rankings[o.name] ?? "—"}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
