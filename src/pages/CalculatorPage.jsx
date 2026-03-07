// src/pages/CalculatorPage.jsx
// ─── Main calculator view ─────────────────────────────────────────────────────

import { useState } from "react";
import ProjectDetails from "../components/ProjectDetails.jsx";
import { ItemManager } from "../components/ItemManager.jsx";

export const TABS = [
  { id: "footing",    icon: "🏗",  label: "Footings",     color: "#d97706" },
  { id: "column",     icon: "🏛",  label: "Columns",      color: "#1e5cb8" },
  { id: "plinthBeam", icon: "🔩",  label: "Plinth Beams", color: "#059669" },
  { id: "wallBeam",   icon: "⚙️",  label: "Wall Beams",   color: "#7c3aed" },
  { id: "slab",       icon: "▦",   label: "Slabs",        color: "#dc2626" },
  { id: "staircase",  icon: "🪜",  label: "Staircases",   color: "#0d9488" },
];

export default function CalculatorPage({
  details, setDetails,
  rates, updateRate,
  elementSets,
  projectReady,
  onCalculate,
}) {
  const [activeTab, setActiveTab] = useState("footing");

  const totalNos = Object.values(elementSets)
    .flatMap(s => s.items)
    .reduce((sum, it) => sum + (+it.count || 1), 0);

  const currentIndex = TABS.findIndex(t => t.id === activeTab);
  const prevTab = TABS[currentIndex - 1];
  const nextTab = TABS[currentIndex + 1];

  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="page-pad" style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 28, paddingBottom: 48 }}>

        <ProjectDetails details={details} setDetails={setDetails} />

        {/* Overview strip */}
        <div className="overview-strip hscroll">
          <span className="overview-strip__label">Elements:</span>
          {TABS.map(t => {
            const { items } = elementSets[t.id];
            const nos = items.reduce((s, it) => s + (+it.count || 1), 0);
            return (
              <div
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`element-chip${activeTab === t.id ? " active" : ""}`}
              >
                <span>{t.icon}</span>
                <div>
                  <div
                    className="element-chip__name"
                    style={{ color: activeTab === t.id ? "var(--primary)" : "var(--text)" }}
                  >
                    {t.label}
                  </div>
                  <div className="element-chip__meta">{items.length} types · {nos} nos</div>
                </div>
              </div>
            );
          })}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: "var(--text-3)", flexShrink: 0, fontFamily: "var(--font-mono)" }}>
            Total: <b style={{ color: "var(--primary)" }}>{totalNos}</b> nos
          </span>
        </div>

        {/* Tab nav */}
        <div className="tab-nav hscroll">
          {TABS.map(t => {
            const nos = elementSets[t.id].items.reduce((s, it) => s + (+it.count || 1), 0);
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`tab-btn${isActive ? " active" : ""}`}
                style={{
                  borderBottomColor: isActive ? t.color : "transparent",
                  color: isActive ? t.color : "var(--text-2)",
                }}
              >
                <span>{t.icon}</span> {t.label}
                {nos > 0 && (
                  <span
                    className="tab-count"
                    style={{
                      background: isActive ? t.color : "var(--surface-3)",
                      color: isActive ? "#fff" : "var(--text-2)",
                    }}
                  >
                    {nos}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active element manager */}
        <div className="fade-in">
          <ItemManager
            type={activeTab}
            items={elementSets[activeTab].items}
            setItems={elementSets[activeTab].setItems}
          />
        </div>

        {/* Prev / Next Navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 22, gap: 12 }}>
          {prevTab ? (
            <button
              onClick={() => setActiveTab(prevTab.id)}
              className="nav-prev"
              style={{ border: `1.5px solid ${prevTab.color}`, color: prevTab.color }}
            >
              ← {prevTab.icon} {prevTab.label}
            </button>
          ) : <div />}

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {TABS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                title={t.label}
                className="step-dot"
                style={{
                  width: i === currentIndex ? 28 : 8,
                  background: i === currentIndex ? TABS[currentIndex].color : "var(--border)",
                }}
              />
            ))}
          </div>

          {nextTab ? (
            <button
              onClick={() => setActiveTab(nextTab.id)}
              className="nav-next"
              style={{ background: `linear-gradient(135deg, ${nextTab.color}, ${nextTab.color}cc)` }}
            >
              {nextTab.icon} {nextTab.label} →
            </button>
          ) : (
            <button
              onClick={onCalculate}
              disabled={!projectReady}
              className="btn btn--primary btn--md"
              style={{ animation: projectReady ? "pulse-ring 2s infinite" : "none" }}
            >
              ⚡ Calculate BBS →
            </button>
          )}
        </div>

        {/* Calculate CTA */}
        <div className="calc-cta cta-block" style={{ marginTop: 28 }}>
          <div>
            <div className="cta-block__title">
              {projectReady ? `✅ Ready: ${details.projectName}` : "⚠️  Enter Project Name above to enable report"}
            </div>
            <div className="cta-block__sub">
              {totalNos} total nos · IS 456 covers auto-applied · Per-piece rates
              {details.engineerPhone && ` · WhatsApp: +91 ${details.engineerPhone}`}
            </div>
          </div>
          <button onClick={onCalculate} disabled={!projectReady} className="btn btn--primary btn--lg">
            ⚡ Calculate & Generate BBS
          </button>
        </div>

        {/* WB Rates */}
        <div className="rates-box">
          <div className="rates-box__title">
            <span>₹</span> West Bengal Market Rates (Per 12m Rod) — Edit anytime:
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {Object.keys(rates).map(d => (
              <div key={d} className="rates-box__item">
                <span className="rates-box__dia">φ{d}mm: ₹</span>
                <input
                  type="number"
                  value={rates[d]}
                  onChange={e => updateRate(+d, +e.target.value)}
                  style={{ width: 72, fontSize: 13, padding: "6px 8px" }}
                />
                <span className="rates-box__pc">/pc</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="site-footer">
        BBS Calculator · IS 456:2000 · IS 2502:1963 · West Bengal Per-Piece Rates · For reference only — verify with structural engineer
      </footer>
    </div>
  );
}
