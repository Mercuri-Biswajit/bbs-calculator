// src/pages/CalculatorPage.jsx
// ─── Main calculator view ─────────────────────────────────────────────────────

import { useState } from "react";
import ProjectDetails from "../components/ProjectDetails.jsx";
import { ItemManager } from "../components/ItemManager.jsx";
import { TABS } from "../App.jsx";

export default function CalculatorPage({
  details,
  setDetails,
  rates,
  updateRate,
  elementSets,
  projectReady,
  onCalculate,
  activeTab,
  setActiveTab
}) {
  const currentIndex = TABS.findIndex((t) => t.id === activeTab);
  const prevTab = TABS[currentIndex - 1];
  const nextTab = TABS[currentIndex + 1];

  const totalNos = Object.values(elementSets)
    .flatMap((s) => s.items)
    .reduce((sum, it) => sum + (+it.count || 1), 0);

  return (
    <div className="calculator-layout fade-in">
      {/* Project details at the top as a beautiful glass card */}
      <ProjectDetails details={details} setDetails={setDetails} />

      {/* Spacing between modules */}
      <div style={{ height: 24 }} />

      {/* Active element manager wrapped in a glass container */}
      <div className="element-workspace">
        <ItemManager
          type={activeTab}
          items={elementSets[activeTab].items}
          setItems={elementSets[activeTab].setItems}
        />
      </div>

      {/* Prev / Next Navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 22,
          gap: 12,
        }}
      >
        {prevTab ? (
          <button
            onClick={() => setActiveTab(prevTab.id)}
            className="btn btn--md"
            style={{
              background: `color-mix(in srgb, ${prevTab.color} 15%, transparent)`,
              color: prevTab.color,
              border: `1px solid color-mix(in srgb, ${prevTab.color} 30%, transparent)`,
            }}
          >
            ← {prevTab.icon} {prevTab.label}
          </button>
        ) : (
          <div />
        )}

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {TABS.map((t, i) => (
            <div
              key={t.id}
              title={t.label}
              className="step-dot"
              style={{
                width: i === currentIndex ? 28 : 8,
                height: 8,
                borderRadius: 99,
                background:
                  i === currentIndex
                    ? TABS[currentIndex].color
                    : "var(--border-2)",
              }}
            />
          ))}
        </div>

        {nextTab ? (
          <button
            onClick={() => setActiveTab(nextTab.id)}
            className="btn btn--md"
            style={{
              background: nextTab.color,
              color: "#fff",
              border: "none",
              boxShadow: `0 4px 14px color-mix(in srgb, ${nextTab.color} 40%, transparent)`,
            }}
          >
            {nextTab.icon} {nextTab.label} →
          </button>
        ) : (
          <button
            className="btn btn--md"
            disabled={!projectReady}
            onClick={onCalculate}
            style={{
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              boxShadow: "0 4px 14px var(--primary-light)",
            }}
            title={
              !projectReady
                ? "Please enter Project Name"
                : "Calculate & Generate"
            }
          >
            🚀 Calculate
          </button>
        )}
      </div>

      {/* Calculate CTA */}
      <div className="calc-cta cta-block" style={{ marginTop: 28 }}>
        <div>
          <div className="cta-block__title">
            {projectReady
              ? `✅ Ready: ${details.projectName}`
              : "⚠️  Enter Project Name above to enable report"}
          </div>
          <div className="cta-block__sub">
            {totalNos} total nos · IS 456 covers auto-applied · Per-piece
            rates
            {details.engineerPhone &&
              ` · WhatsApp: +91 ${details.engineerPhone}`}
          </div>
        </div>
        <button
          onClick={onCalculate}
          disabled={!projectReady}
          className="btn btn--primary btn--lg"
        >
          ⚡ Calculate & Generate BBS
        </button>
      </div>

      {/* WB Rates */}
      <div className="rates-box card">
        <div className="rates-box__title">
          <span>₹</span> West Bengal Market Rates (Per 12m Rod) — Edit
          anytime:
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {Object.keys(rates).map((d) => (
            <div key={d} className="rates-box__item">
              <span className="rates-box__dia">φ{d}mm: ₹</span>
              <input
                type="number"
                value={rates[d]}
                onChange={(e) => updateRate(+d, +e.target.value)}
                style={{ width: 72, fontSize: 13, padding: "6px 8px" }}
              />
              <span className="rates-box__pc">/pc</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}
