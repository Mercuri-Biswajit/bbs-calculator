// src/components/Header.jsx
// Desktop: unchanged. Mobile: compact, labels shorten.

export default function Header({
  onGenerateReport,
  projectReady,
  onViewHistory,
  showHistoryButton = true,
}) {
  return (
    <header
      className="site-header"
      style={{
        background: "#fff",
        borderBottom: "1px solid #dce6f0",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 200,
        boxShadow: "0 2px 8px rgba(0,0,0,.06)",
        gap: 8,
      }}
    >
      <style>{`
        @media (max-width: 600px) {
          .site-header { padding: 0 14px !important; }
        }
        .hdr-subtitle { display: block; }
        @media (max-width: 500px) { .hdr-subtitle { display: none; } }
        .hdr-nav { display: flex; }
        @media (max-width: 640px) { .hdr-nav { display: none; } }
        .hdr-btn-full { display: inline; }
        .hdr-btn-short { display: none; }
        @media (max-width: 440px) {
          .hdr-btn-full { display: none; }
          .hdr-btn-short { display: inline; }
        }
      `}</style>

      {/* ── LEFT: Logo ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
        }}
      >
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
          <div
            style={{
              fontWeight: 800,
              fontSize: 17,
              color: "#1565c0",
              letterSpacing: 0.3,
            }}
          >
            BBS Calculator
          </div>
          <div
            className="hdr-subtitle"
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

      {/* ── CENTER: Nav (hidden on mobile) ── */}
      <nav className="hdr-nav" style={{ alignItems: "center", gap: 4 }}>
        <span
          style={{
            padding: "7px 20px",
            border: "1.5px solid #1565c0",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "#1565c0",
            background: "#f0f6ff",
            whiteSpace: "nowrap",
          }}
        >
          BBS Calculator
        </span>
      </nav>

      {/* ── RIGHT: CTA ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
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
              display: "flex",
              alignItems: "center",
              gap: 7,
              whiteSpace: "nowrap",
            }}
          >
            <span>📚</span>
            <span className="hdr-btn-full">Saved Reports</span>
            <span className="hdr-btn-short">Saved</span>
          </button>
        )}

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
            boxShadow: projectReady
              ? "0 2px 10px rgba(21,101,192,.35)"
              : "none",
            display: "flex",
            alignItems: "center",
            gap: 7,
            whiteSpace: "nowrap",
          }}
        >
          <span>📄</span>
          <span className="hdr-btn-full">Generate Report</span>
          <span className="hdr-btn-short">Generate</span>
        </button>
      </div>
    </header>
  );
}
