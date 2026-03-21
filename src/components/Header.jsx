// src/components/Header.jsx

import { useState, useEffect } from "react";

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("bbs_theme") === "dark"; } catch { return false; }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    try { localStorage.setItem("bbs_theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="btn btn--secondary btn--sm"
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{ fontSize: 16, padding: "6px 10px", lineHeight: 1 }}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

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
        <ThemeToggle />
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
