import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../supabaseClient";

const ANIM_MS = 250;
const GAP = 6; // must match the grid gap in px

export default function RankingForm({ act, studentId, section, onSubmitted }) {
  const options = act.options;

  const [order, setOrder] = useState(() => options.map(o => o.name));
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [animating, setAnimating] = useState(false);

  // Refs to each row DOM element, keyed by option name
  const rowRefs = useRef({});

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("submissions")
          .select("rankings")
          .eq("student_id", studentId)
          .eq("section", section)
          .single();

        if (data?.rankings) {
          const sorted = Object.entries(data.rankings)
            .sort((a, b) => a[1] - b[1])
            .map(([name]) => name);
          setOrder(sorted);
          setSubmitted(true);
          onSubmitted(true);
        }
      } catch {
        // No existing submission
      }
    })();
  }, [studentId, section]); // eslint-disable-line

  const move = useCallback((index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= order.length || animating) return;

    const movingName = order[index];
    const displacedName = order[target];
    const movingEl = rowRefs.current[movingName];
    const displacedEl = rowRefs.current[displacedName];

    if (!movingEl || !displacedEl) {
      // Fallback: just swap without animation
      setOrder(prev => {
        const next = [...prev];
        [next[index], next[target]] = [next[target], next[index]];
        return next;
      });
      return;
    }

    setAnimating(true);

    // Measure row heights to compute slide distance
    const movingH = movingEl.offsetHeight;
    const displacedH = displacedEl.offsetHeight;

    // direction = -1 (up): moving row slides up by displacedH+gap, displaced slides down by movingH+gap
    // direction = +1 (down): moving row slides down by displacedH+gap, displaced slides up by movingH+gap
    const movingOffset = direction * (displacedH + GAP);
    const displacedOffset = -direction * (movingH + GAP);

    movingEl.style.transition = `transform ${ANIM_MS}ms ease-out`;
    displacedEl.style.transition = `transform ${ANIM_MS}ms ease-out`;
    movingEl.style.transform = `translateY(${movingOffset}px)`;
    displacedEl.style.transform = `translateY(${displacedOffset}px)`;
    movingEl.style.zIndex = "2";
    displacedEl.style.zIndex = "1";

    setTimeout(() => {
      // Clear transforms before React re-renders with new order
      movingEl.style.transition = "none";
      displacedEl.style.transition = "none";
      movingEl.style.transform = "none";
      displacedEl.style.transform = "none";
      movingEl.style.zIndex = "";
      displacedEl.style.zIndex = "";

      setOrder(prev => {
        const next = [...prev];
        [next[index], next[target]] = [next[target], next[index]];
        return next;
      });
      setAnimating(false);
    }, ANIM_MS);
  }, [order, animating]);

  const toRankings = () => {
    const r = {};
    order.forEach((name, i) => { r[name] = i + 1; });
    return r;
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    try {
      const { error: dbError } = await supabase
        .from("submissions")
        .upsert(
          { student_id: studentId, section, rankings: toRankings() },
          { onConflict: "student_id,section" }
        );
      if (dbError) throw dbError;
      setSubmitted(true);
      onSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const optionMap = {};
  options.forEach(o => { optionMap[o.name] = o; });

  return (
    <div style={{ padding: "22px 36px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
        <div style={{ height: "1px", flex: 1, background: act.border }} />
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: act.muted, whiteSpace: "nowrap", fontWeight: 600 }}>
          {submitted ? "Your Rankings (Revise Anytime)" : "Rank the Options — Reorder with Arrows"}
        </span>
        <div style={{ height: "1px", flex: 1, background: act.border }} />
      </div>

      <div style={{ background: act.cardBg, border: `1px solid ${act.border}`, borderRadius: "10px", padding: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "grid", gap: `${GAP}px`, position: "relative" }}>
          {order.map((name, i) => {
            const o = optionMap[name];
            const isFirst = i === 0;
            const isLast = i === order.length - 1;
            return (
              <div
                key={name}
                ref={el => { rowRefs.current[name] = el; }}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: act.contentBg, border: `1px solid ${act.border}`, borderRadius: "8px", position: "relative" }}
              >
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "16px", fontWeight: 700, color: act.accent, minWidth: "24px", textAlign: "center" }}>
                  {i + 1}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <button
                    onClick={() => move(i, -1)}
                    disabled={isFirst || animating}
                    style={{ width: "28px", height: "20px", border: `1px solid ${act.border}`, borderRadius: "4px 4px 0 0", background: isFirst ? "#f0f0f0" : "#fff", cursor: isFirst || animating ? "default" : "pointer", fontSize: "11px", color: isFirst ? "#ccc" : act.accent, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                  >&#9650;</button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={isLast || animating}
                    style={{ width: "28px", height: "20px", border: `1px solid ${act.border}`, borderRadius: "0 0 4px 4px", background: isLast ? "#f0f0f0" : "#fff", cursor: isLast || animating ? "default" : "pointer", fontSize: "11px", color: isLast ? "#ccc" : act.accent, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                  >&#9660;</button>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "14px", fontWeight: 600, color: "#111" }}>{o.name}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: act.muted, lineHeight: "1.5", marginTop: "2px" }}>{o.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {error && <p style={{ fontFamily: "'DM Sans',sans-serif", color: "#e05555", fontSize: "12px", margin: "12px 0 0" }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            marginTop: "16px", width: "100%", padding: "12px", fontSize: "13px", fontWeight: 600,
            background: act.accent, color: "#fff", border: "none", borderRadius: "7px",
            cursor: saving ? "default" : "pointer",
            fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.06em", textTransform: "uppercase",
            opacity: saving ? 0.7 : 1
          }}
        >
          {saving ? "Saving..." : submitted ? "Update Rankings" : "Submit Rankings"}
        </button>
      </div>
    </div>
  );
}
