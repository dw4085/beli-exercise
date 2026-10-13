import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../lib/hub";

const font = "'DM Sans',sans-serif";
const when = (iso) =>
  iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—";

// Activity reports the class hub hasn't received yet, with "Send now".
export default function HubOutboxPanel() {
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState(null);

  const load = useCallback(async () => {
    const res = await apiFetch("/api/hub/outbox");
    if (res.ok) setStatus(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  const sendNow = async () => {
    setSending(true);
    setNote(null);
    try {
      const res = await apiFetch("/api/hub/outbox", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
        setNote(data.status.waiting === 0 ? `Sent ${data.delivered}. Everything has reached the class hub.` : `Sent ${data.delivered}; ${data.status.waiting} still waiting.`);
      }
    } finally {
      setSending(false);
    }
  };

  if (!status) return null;
  const ok = status.waiting === 0 && status.failed === 0;
  return (
    <div style={{ background: ok ? "#F3F2EE" : "#FFF8E1", borderBottom: `1px solid ${ok ? "#E2DFD6" : "#F0D58A"}`, padding: "12px 36px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", fontFamily: font }}>
      <div>
        <div style={{ fontSize: "10px", color: "#888", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600 }}>Class hub activity</div>
        {status.waiting > 0 ? (
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#8A6100" }}>
            {status.waiting} activity report{status.waiting === 1 ? "" : "s"} waiting to be sent
            <span style={{ fontWeight: 400, color: "#888" }}> · oldest {when(status.oldestWaitingAt)}</span>
          </div>
        ) : (
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#333" }}>
            All activity has reached the class hub
            {status.lastDeliveredAt && <span style={{ fontWeight: 400, color: "#888" }}> · last sent {when(status.lastDeliveredAt)}</span>}
          </div>
        )}
        {status.failed > 0 && (
          <div style={{ fontSize: "12px", color: "#b33" }}>{status.failed} report{status.failed === 1 ? " was" : "s were"} rejected by the hub and won't be resent.</div>
        )}
        {status.waiting > 0 && status.lastError && <div style={{ fontSize: "11px", color: "#999", marginTop: "2px" }}>Last error: {status.lastError}</div>}
        {note && <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>{note}</div>}
      </div>
      {status.waiting > 0 && (
        <button onClick={sendNow} disabled={sending}
          style={{ fontFamily: font, fontSize: "12px", fontWeight: 700, padding: "7px 16px", border: "none", borderRadius: "5px", cursor: sending ? "default" : "pointer", background: "#C28A00", color: "#fff", opacity: sending ? 0.7 : 1 }}>
          {sending ? "Sending…" : "Send now"}
        </button>
      )}
    </div>
  );
}
