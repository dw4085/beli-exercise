import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function ClassAverages({ act, section }) {
  const [averages, setAverages] = useState(null);
  const [count, setCount] = useState(0);

  const fetchAverages = async () => {
    try {
      const { data, error } = await supabase
        .from("submissions")
        .select("rankings")
        .eq("section", section);

      if (error) throw error;
      if (!data || data.length === 0) { setAverages(null); setCount(0); return; }

      setCount(data.length);
      const sums = {};
      const counts = {};
      data.forEach(row => {
        Object.entries(row.rankings).forEach(([name, rank]) => {
          sums[name] = (sums[name] || 0) + rank;
          counts[name] = (counts[name] || 0) + 1;
        });
      });

      const avgs = {};
      Object.keys(sums).forEach(name => {
        avgs[name] = sums[name] / counts[name];
      });
      setAverages(avgs);
    } catch (err) {
      console.error("Error fetching averages:", err);
    }
  };

  useEffect(() => {
    fetchAverages();
    const interval = setInterval(fetchAverages, 30000);
    return () => clearInterval(interval);
  }, [section]); // eslint-disable-line

  if (!averages) return null;

  const sorted = Object.entries(averages).sort((a, b) => a[1] - b[1]);
  const maxRank = act.options.length;

  return (
    <div style={{ padding: "22px 36px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
        <div style={{ height: "1px", flex: 1, background: act.border }} />
        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: act.muted, whiteSpace: "nowrap", fontWeight: 600 }}>
          Live Class Averages · {count} submission{count !== 1 ? "s" : ""}
        </span>
        <div style={{ height: "1px", flex: 1, background: act.border }} />
      </div>

      <div style={{ background: act.cardBg, border: `1px solid ${act.border}`, borderRadius: "10px", padding: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        {sorted.map(([name, avg], i) => {
          const pct = ((maxRank - avg) / (maxRank - 1)) * 100;
          return (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: i < sorted.length - 1 ? "10px" : 0 }}>
              <div style={{ width: "24px", fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 700, color: act.accent, textAlign: "center" }}>
                {i + 1}
              </div>
              <div style={{ width: "160px", fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: 600, color: "#111", flexShrink: 0 }}>{name}</div>
              <div style={{ flex: 1, background: act.contentBg, borderRadius: "4px", height: "20px", overflow: "hidden", border: `1px solid ${act.border}` }}>
                <div style={{ width: `${Math.max(pct, 5)}%`, height: "100%", background: act.accent, borderRadius: "4px", transition: "width 0.5s ease" }} />
              </div>
              <div style={{ width: "50px", fontFamily: "'DM Sans',sans-serif", fontSize: "12px", color: act.muted, textAlign: "right" }}>
                {avg.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "11px", color: act.muted, marginTop: "8px", opacity: 0.6, fontStyle: "italic" }}>
        Lower average rank = higher consensus priority. Updates every 30 seconds.
      </div>
    </div>
  );
}
