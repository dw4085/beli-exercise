import { hubHome } from "../lib/hub";

// Full-page message: loading, hub unreachable, or not allowed here.
export default function HubStatus({ title, message, showHubLink }) {
  return (
    <div style={{ fontFamily: "Georgia, serif", minHeight: "100vh", background: "#F8F6F1", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <div style={{ width: "100%", maxWidth: "380px", background: "#fff", borderRadius: "12px", border: "1px solid #ddd", padding: "32px", boxShadow: "0 4px 30px rgba(0,0,0,0.08)", textAlign: "center" }}>
        {title && <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "20px", fontWeight: 700, color: "#111", margin: "0 0 8px" }}>{title}</h2>}
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#666", lineHeight: "1.6", margin: 0 }}>{message}</p>
        {showHubLink && (
          <a href={hubHome} style={{ display: "inline-block", marginTop: "18px", fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: 600, color: "#fff", background: "#333", padding: "9px 18px", borderRadius: "7px", textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Back to the class hub
          </a>
        )}
      </div>
    </div>
  );
}
