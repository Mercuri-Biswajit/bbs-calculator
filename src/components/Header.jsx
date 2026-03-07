// src/components/Header.jsx
// Logo slot + navigation + CTA button
// UPDATED: Added Reports History button

export default function Header({
  onGenerateReport,
  projectReady,
  onViewHistory,
  showHistoryButton = true,
}) {
  return (
    <header
      style={{
        background: "#fff",
        borderBottom: "1px solid #dce6f0",
        padding: "0 32px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 200,
        boxShadow: "0 2px 8px rgba(0,0,0,.06)",
      }}
    >
      {/* ── LEFT: Logo Area ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* 
          LOGO SLOT: Replace the div below with your <img> tag.
          Example: <img src="/logo.png" alt="Your Logo" style={{ height: 40 }} />
        */}
        <div
          style={{
            height: 42,
            width: 42,
            background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            color: "#fff",
            fontWeight: 900,
            boxShadow: "0 2px 8px rgba(21,101,192,.3)",
            flexShrink: 0,
          }}
        >
          ⚙
        </div>

        <div>
          {/* Replace this text with your company name */}
          <div
            style={{
              fontWeight: 800,
              fontSize: 17,
              color: "#1565c0",
              letterSpacing: 0.3,
              fontFamily: "var(--font-sans)",
            }}
          >
            BBS Calculator
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#8090a8",
              fontFamily: "var(--font-mono)",
              letterSpacing: 1.2,
            }}
          >
            IS 456:2000 · West Bengal
          </div>
        </div>
      </div>

      {/* ── CENTER: Nav ── */}
      <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span
          style={{
            padding: "7px 20px",
            border: "1.5px solid #1565c0",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "#1565c0",
            background: "#f0f6ff",
          }}
        >
          BBS Calculator
        </span>
      </nav>

      {/* ── RIGHT: CTA ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Reports History Button */}
        {showHistoryButton && onViewHistory && (
          <button
            onClick={onViewHistory}
            style={{
              background: "white",
              color: "#1565c0",
              border: "1.5px solid #1565c0",
              borderRadius: 8,
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              letterSpacing: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 7,
              transition: "all .2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#f0f6ff";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "white";
            }}
          >
            📚 Saved Reports
          </button>
        )}

        {/* Generate Report Button */}
        <button
          onClick={onGenerateReport}
          style={{
            background: projectReady
              ? "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)"
              : "#b0bec5",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 22px",
            fontSize: 13,
            fontWeight: 700,
            cursor: projectReady ? "pointer" : "not-allowed",
            fontFamily: "var(--font-sans)",
            letterSpacing: 0.5,
            boxShadow: projectReady
              ? "0 2px 10px rgba(21,101,192,.35)"
              : "none",
            display: "flex",
            alignItems: "center",
            gap: 7,
            transition: "all .2s",
          }}
        >
          📄 Generate Report
        </button>
      </div>
    </header>
  );
}
