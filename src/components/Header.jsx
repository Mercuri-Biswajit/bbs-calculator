// src/components/Header.jsx

import logo from "../assets/icons/My__Logo.png";

export default function Header({
  onGenerateReport,
  projectReady,
  onViewHistory,
  showHistoryButton = true,
}) {
  return (
    <header className="header site-header">
      {/* ── LEFT: Logo ── */}
      <img src={logo} alt="Logo" className="header__logo-img" />

      {/* ── CENTER: Nav (hidden on mobile) ── */}
      <nav className="hdr-nav" style={{ alignItems: "center", gap: 4 }}>
        <span className="hdr-nav__pill">Bar Bending Schedule</span>
      </nav>

      {/* ── RIGHT: CTAs ── */}
      <div className="header__actions">
        {showHistoryButton && onViewHistory && (
          <button
            onClick={onViewHistory}
            className="btn btn--secondary btn--md"
            style={{ whiteSpace: "nowrap" }}
          >
            <span>📚</span>
            <span className="hdr-btn-full">Saved Reports</span>
            <span className="hdr-btn-short">Saved</span>
          </button>
        )}

        <button
          onClick={onGenerateReport}
          className={`btn btn--primary btn--md${!projectReady ? "" : ""}`}
          disabled={!projectReady}
          style={{ whiteSpace: "nowrap" }}
        >
          <span>📄</span>
          <span className="hdr-btn-full">Generate Report</span>
          <span className="hdr-btn-short">Generate</span>
        </button>
      </div>
    </header>
  );
}
