import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ACTIVITIES } from "../data/activities";
import { useHubUser, apiFetch, hubHome } from "../lib/hub";
import HubStatus from "../components/HubStatus";
import SectionPicker from "../components/SectionPicker";
import Hero from "../components/Hero";
import BriefContent from "../components/BriefContent";
import RankingForm from "../components/RankingForm";
import ClassAverages from "../components/ClassAverages";

export default function StudentPage() {
  const { user, error: hubError } = useHubUser();
  // { name, section, staff } from /api/students; section comes from the class roster, or is
  // chosen once by the student; instructors and TAs may view any section.
  const [info, setInfo] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [params, setParams] = useSearchParams();

  const [key, setKey] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await apiFetch("/api/students");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setInfo(await res.json());
      } catch (err) {
        console.error("Load error:", err);
        setLoadError(true);
      }
    })();
  }, [user]);

  const onSubmitted = useCallback((val) => setHasSubmitted(val), []);

  if (hubError || loadError) return <HubStatus title="Can't load the exercise" message="Could not connect to the server. Please refresh the page." />;
  if (!user || !info) return <HubStatus message="Loading..." />;
  if (!info.staff && !info.section) return <SectionPicker name={info.name} onPicked={setInfo} />;

  // Students are locked to their own section. Staff pick a section with the tabs (?section=)
  // and can open a student's ranking read-only from the class activity log (?student=).
  const wanted = info.staff ? params.get("section") || info.section : info.section;
  const found = ACTIVITIES.findIndex(a => a.section === wanted);
  const sectionIndex = found >= 0 ? found : 0;
  const act = ACTIVITIES[sectionIndex];
  const viewStudent = info.staff && params.get("student") && params.get("student") !== user.id ? params.get("student") : null;

  const switchSection = (i) => {
    setParams({ section: ACTIVITIES[i].section });
    setHasSubmitted(false);
    setKey(k => k + 1);
  };

  return (
    <div style={{ fontFamily: "Georgia, serif", minHeight: "100vh", background: "#F8F6F1" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fu { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .fu0 { animation: fu 0.35s ease 0s both; }
        .fu1 { animation: fu 0.35s ease 0.07s both; }
        .fu2 { animation: fu 0.35s ease 0.13s both; }
        .fu3 { animation: fu 0.35s ease 0.19s both; }
        .opt { transition: transform 0.15s, box-shadow 0.15s; }
        .opt:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
        .pil { transition: transform 0.15s; }
        .pil:hover { transform: translateX(3px); }
        @media (max-width: 768px) {
          .session-bar { padding: 8px 16px !important; }
          .hero-top { padding: 16px 16px 0 !important; }
          .hero-badge { display: none !important; }
          .hero-title { padding: 20px 16px 0 !important; }
          .hero-bottom { padding: 0 16px !important; }
          .brief-grid { grid-template-columns: 1fr !important; }
          .brief-section { padding: 20px 16px !important; }
          .brief-divider { border-right: none !important; }
          .criteria-wrap { padding: 20px 16px 0 !important; }
          .criteria-grid { grid-template-columns: 1fr !important; }
          .options-wrap { padding: 16px 16px 0 !important; }
          .options-grid { grid-template-columns: 1fr 1fr !important; }
          .ranking-wrap { padding: 16px 16px 0 !important; }
          .ranking-box { padding: 14px !important; }
          .ranking-row { padding: 8px 10px !important; gap: 8px !important; }
          .ranking-arrows { width: 32px !important; }
          .ranking-arrows button { width: 32px !important; height: 24px !important; }
          .avg-wrap { padding: 16px 16px 0 !important; }
          .avg-row { flex-wrap: wrap !important; }
          .avg-rank { display: none !important; }
          .avg-label { width: 100% !important; margin-bottom: 4px !important; }
          .login-header { padding: 16px !important; }
          .login-body { padding: 20px !important; }
          .login-card { padding: 24px !important; }
        }
      `}</style>

      {/* Session bar */}
      <div className="session-bar" style={{ background: "#1a1a2e", padding: "8px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
          Signed in as <strong style={{ color: "rgba(255,255,255,0.9)" }}>{info.name}</strong> · {info.staff ? "Instructor view" : act.section}
        </span>
        <span style={{ display: "flex", gap: "8px" }}>
          {info.staff && (
            <a href="/admin" style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans',sans-serif", fontSize: "11px", padding: "4px 12px", borderRadius: "4px", textDecoration: "none" }}>
              Admin
            </a>
          )}
          <a href={hubHome} style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans',sans-serif", fontSize: "11px", padding: "4px 12px", borderRadius: "4px", textDecoration: "none" }}>
            Class hub
          </a>
        </span>
      </div>

      <Hero active={sectionIndex} hideTabs={!info.staff} onSwitchTab={switchSection} />

      <BriefContent act={act} animKey={key} />

      <RankingForm
        key={`${act.section}:${viewStudent || ""}`}
        act={act}
        section={act.section}
        viewStudent={viewStudent}
        onSubmitted={onSubmitted}
      />
      {(hasSubmitted || info.staff) && (
        <ClassAverages act={act} section={act.section} />
      )}

      {/* Bottom padding */}
      <div style={{ height: "48px", background: act.contentBg }} />
    </div>
  );
}
