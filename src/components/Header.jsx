// src/components/Header.jsx

import logo from "../assets/icons/My__Logo.png";

export default function Header({
  onGenerateReport,
  projectReady,
  onViewHistory,
  showHistoryButton = true,
  onHome,
}) {
  return (
    <header className="header site-header">
      <div className="hdr-logo-placeholder" />

      <nav className="hdr-nav" style={{ alignItems: "center", gap: 4 }}>

        <span className="hdr-nav__pill">Bar Bending Schedule</span>
      </nav>

      <div className="header__actions">
        <button
          onClick={onGenerateReport}
          className="btn btn--primary btn--md"
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
