// src/App.jsx — Professional redesign with CSS-class driven styling

import { useState, useCallback } from "react";
import Header from "./components/Header.jsx";
import ProjectDetails, {
  DEFAULT_PROJECT,
} from "./components/ProjectDetails.jsx";
import { ItemManager, newItem } from "./components/ItemManager.jsx";
import {
  BBSTable,
  GroupedBBSTable,
  CostTable,
} from "./components/BBSResults.jsx";
import ReportsHistory, { saveReport } from "./components/ReportsHistory.jsx";
import { Card, CardHeader, Button, Badge } from "./components/ui.jsx";
import {
  calcSingleFooting,
  calcSingleColumn,
  calcSingleBeam,
  calcSingleSlab,
  calcSingleStaircase,
  buildBBS,
  aggregateBBS,
  costSummary,
  DEFAULT_RATES_PER_PIECE,
  generateBarPurchaseMessage,
} from "./utils/calculations.js";
import { downloadPDF, sendViaWhatsApp } from "./utils/pdfReport.js";

const TABS = [
  { id: "footing", icon: "🏗", label: "Footings", color: "#d97706" },
  { id: "column", icon: "🏛", label: "Columns", color: "#1e5cb8" },
  { id: "plinthBeam", icon: "🔩", label: "Plinth Beams", color: "#059669" },
  { id: "wallBeam", icon: "⚙️", label: "Wall Beams", color: "#7c3aed" },
  { id: "slab", icon: "▦", label: "Slabs", color: "#dc2626" },
  { id: "staircase", icon: "🪜", label: "Staircases", color: "#0d9488" },
];

function calcItems(type, items) {
  return items.map((item) => {
    let rawRows;
    if (type === "footing") rawRows = calcSingleFooting(item);
    else if (type === "column") rawRows = calcSingleColumn(item);
    else if (type === "plinthBeam")
      rawRows = calcSingleBeam(item, "plinthBeam");
    else if (type === "wallBeam") rawRows = calcSingleBeam(item, "wallBeam");
    else if (type === "slab") rawRows = calcSingleSlab(item);
    else if (type === "staircase") rawRows = calcSingleStaircase(item);
    return {
      label: item.label,
      count: +item.count || 1,
      bbs: buildBBS(rawRows),
    };
  });
}

// ─── RESULT PAGE ──────────────────────────────────────────────────────────────
function ResultPage({ result, rates, onRateChange, onBack, details }) {
  const [sending, setSending] = useState(false);
  const [sentMsg, setSentMsg] = useState("");
  const [dlBusy, setDlBusy] = useState(false);

  const { byType, allRows, costs } = result;
  const totalWt = allRows.reduce((s, r) => s + r.weight, 0);
  const totalCost = costs.reduce((s, r) => s + r.cost, 0);
  const totalRods = costs.reduce((s, r) => s + r.rods12m, 0);

  const handleDownload = () => {
    setDlBusy(true);
    setTimeout(() => {
      downloadPDF(details, byType, allRows, costs);
      setDlBusy(false);
    }, 100);
  };

  const handleWhatsApp = () => {
    if (!details.engineerPhone || details.engineerPhone.length < 10) {
      alert(
        "Please enter a valid 10-digit WhatsApp number in Project Details.",
      );
      return;
    }
    setSending(true);
    setTimeout(() => {
      const fname = sendViaWhatsApp(details, byType, allRows, costs);
      setSending(false);
      setSentMsg(
        `PDF saved as "${fname}" · WhatsApp opened — attach the file and hit Send!`,
      );
    }, 200);
  };

  const handleSendBarOrder = () => {
    if (!details.engineerPhone || details.engineerPhone.length < 10) {
      alert(
        "Please enter a valid 10-digit WhatsApp number in Project Details to send bar purchase order.",
      );
      return;
    }
    const message = encodeURIComponent(
      generateBarPurchaseMessage(costs, details),
    );
    window.open(
      `https://wa.me/91${details.engineerPhone}?text=${message}`,
      "_blank",
    );
  };

  const ActionBar = () => (
    <div className="action-bar">
      <button
        onClick={handleDownload}
        disabled={dlBusy}
        className="btn btn--secondary btn--md"
        style={{
          color: "#fff",
          background: dlBusy ? "#90a4ae" : "rgba(255,255,255,.15)",
          border: "1px solid rgba(255,255,255,.3)",
          backdropFilter: "blur(6px)",
        }}
      >
        {dlBusy ? "⏳ Generating…" : "⬇️ Download PDF"}
      </button>
      <button
        onClick={handleWhatsApp}
        disabled={sending}
        className="btn btn--whatsapp btn--md"
      >
        {sending ? "⏳ Opening…" : "💬 Send Report via WhatsApp"}
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* ── Result Banner ── */}
      <div className="result-banner page-pad" style={{ padding: "24px 32px" }}>
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Top row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={onBack}
              className="btn btn--sm"
              style={{
                background: "rgba(255,255,255,.12)",
                border: "1px solid rgba(255,255,255,.25)",
                color: "#fff",
              }}
            >
              ← Back
            </button>
            {details.projectName && (
              <span
                style={{
                  color: "rgba(255,255,255,.9)",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                }}
              >
                📌 {details.projectName}
              </span>
            )}
            {details.clientName && (
              <span
                style={{
                  color: "rgba(255,255,255,.55)",
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                }}
              >
                · {details.clientName}
              </span>
            )}
            {details.location && (
              <span
                style={{
                  color: "rgba(255,255,255,.45)",
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                }}
              >
                · {details.location}
              </span>
            )}
            <div style={{ flex: 1 }} />
            <ActionBar />
          </div>

          {/* KPI grid */}
          <div className="kpi-grid">
            {[
              {
                label: "Total Steel Weight",
                value: `${totalWt.toFixed(1)} kg`,
                sub: "All elements combined",
              },
              {
                label: "Total Cost (WB)",
                value: `₹${totalCost.toLocaleString("en-IN")}`,
                sub: "Per-piece rates",
              },
              {
                label: "Rods (12m)",
                value: `${totalRods} nos`,
                sub: "Std 12m rods to buy",
              },
              {
                label: "Elements",
                value: `${byType.filter((t) => t.rows.length > 0).length}`,
                sub: `${allRows.length} bar entries`,
              },
            ].map((k, i) => (
              <div key={i} className="kpi-card">
                <div className="kpi-card__label">{k.label}</div>
                <div className="kpi-card__value">{k.value}</div>
                <div className="kpi-card__sub">{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WhatsApp success */}
      {sentMsg && (
        <div className="wa-success">
          <span className="wa-success__icon">💬</span>
          <span>{sentMsg}</span>
          <button
            className="wa-success__dismiss"
            onClick={() => setSentMsg("")}
          >
            ✕
          </button>
        </div>
      )}

      <div
        className="page-pad"
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          paddingTop: 28,
          paddingBottom: 48,
        }}
      >
        {/* Per-type BBS */}
        {byType.map(
          (t) =>
            t.rows.length > 0 && (
              <Card key={t.type} style={{ marginBottom: 22 }}>
                <CardHeader
                  icon={TABS.find((x) => x.id === t.type)?.icon}
                  title={`${TABS.find((x) => x.id === t.type)?.label} — BBS`}
                  subtitle={`${t.items.length} type(s) · ${t.items.reduce((s, i) => s + (+i.count || 1), 0)} nos · IS 2502:1963`}
                  action={
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 800,
                        color: "var(--primary-dark)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {t.rows.reduce((s, r) => s + r.weight, 0).toFixed(2)} kg
                    </span>
                  }
                />
                <div style={{ padding: 20 }}>
                  <GroupedBBSTable rows={t.rows} />
                </div>
              </Card>
            ),
        )}

        {/* Combined BBS */}
        <Card style={{ marginBottom: 22 }}>
          <CardHeader
            icon="📋"
            title="Combined BBS — All Elements"
            subtitle="Aggregate · IS 2502:1963"
          />
          <div style={{ padding: 20 }}>
            <BBSTable rows={allRows} showSource={true} />
          </div>
        </Card>

        {/* Cost */}
        <Card style={{ marginBottom: 22 }}>
          <CardHeader
            icon="💰"
            title="Material Estimate & Cost Summary"
            subtitle="West Bengal Market Rate · Per-piece (12m rod)"
          />
          <div style={{ padding: 20 }}>
            <CostTable
              costs={costs}
              onRateChange={onRateChange}
              details={details}
              onSendBarOrder={handleSendBarOrder}
            />
          </div>
        </Card>

        {/* Bottom CTA */}
        <div className="result-cta cta-block" style={{ marginBottom: 16 }}>
          <div>
            <div className="cta-block__title">📄 Generate & Share Report</div>
            <div className="cta-block__sub">
              Download PDF locally or send directly to WhatsApp
            </div>
          </div>
          <ActionBar />
        </div>

        <div className="is-note">
          <b>IS 456:2000 Cover:</b> Footing 75mm · Beam/Col 40mm · Wall Beam
          25mm · Slab 20mm · Staircase 25mm &nbsp;·&nbsp; Lap: 40d · Hook: 9d ·
          Verify before procurement.
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("footing");
  const [details, setDetails] = useState(DEFAULT_PROJECT);
  const [rates, setRates] = useState({ ...DEFAULT_RATES_PER_PIECE });
  const [result, setResult] = useState(null);
  const [viewMode, setViewMode] = useState("calculator");

  const [footings, setFootings] = useState([
    { ...newItem("footing"), label: "Footing F1", count: 4 },
  ]);
  const [columns, setColumns] = useState([
    { ...newItem("column"), label: "Column C1 (Int.)", count: 6 },
  ]);
  const [plinthBeams, setPlinthBeams] = useState([
    { ...newItem("plinthBeam"), label: "Plinth Beam PB1", count: 4 },
  ]);
  const [wallBeams, setWallBeams] = useState([
    { ...newItem("wallBeam"), label: "Wall Beam WB1", count: 3 },
  ]);
  const [slabs, setSlabs] = useState([
    { ...newItem("slab"), label: "Slab S1", count: 1 },
  ]);
  const [staircases, setStaircases] = useState([]);

  const ITEMS = {
    footing: footings,
    column: columns,
    plinthBeam: plinthBeams,
    wallBeam: wallBeams,
    slab: slabs,
    staircase: staircases,
  };
  const SETTERS = {
    footing: setFootings,
    column: setColumns,
    plinthBeam: setPlinthBeams,
    wallBeam: setWallBeams,
    slab: setSlabs,
    staircase: setStaircases,
  };

  const allItemsByType = [
    { type: "footing", items: footings },
    { type: "column", items: columns },
    { type: "plinthBeam", items: plinthBeams },
    { type: "wallBeam", items: wallBeams },
    { type: "slab", items: slabs },
    { type: "staircase", items: staircases },
  ];

  const projectReady = details.projectName.trim().length > 0;
  const totalNos = [
    ...footings,
    ...columns,
    ...plinthBeams,
    ...wallBeams,
    ...slabs,
    ...staircases,
  ].reduce((s, it) => s + (+it.count || 1), 0);
  const updateRate = (dia, val) => setRates((p) => ({ ...p, [dia]: val }));

  const handleCalculate = useCallback(() => {
    const byType = allItemsByType.map(({ type, items }) => {
      const itemResults = calcItems(type, items);
      const aggregated = aggregateBBS(itemResults);
      return { type, items, rows: aggregated };
    });
    const allRows = byType.flatMap((t) => t.rows);
    const costs = costSummary(allRows, rates);
    const resultData = { byType, allRows, costs };
    setResult(resultData);
    saveReport({
      details: { ...details },
      byType,
      allRows,
      costs,
      rates: { ...rates },
    });
    setViewMode("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [
    footings,
    columns,
    plinthBeams,
    wallBeams,
    slabs,
    staircases,
    rates,
    details,
  ]);

  const handleLoadReport = (report) => {
    setResult({
      byType: report.byType,
      allRows: report.allRows,
      costs: report.costs,
    });
    setDetails(report.details);
    if (report.rates) setRates(report.rates);
    setViewMode("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (viewMode === "history") {
    return (
      <>
        <Header
          onGenerateReport={handleCalculate}
          projectReady={projectReady}
          onViewHistory={() => setViewMode("history")}
          showHistoryButton={false}
        />
        <ReportsHistory
          onLoadReport={handleLoadReport}
          onClose={() => setViewMode("calculator")}
        />
      </>
    );
  }

  if (viewMode === "result" && result) {
    return (
      <>
        <Header
          onGenerateReport={handleCalculate}
          projectReady={projectReady}
          onViewHistory={() => setViewMode("history")}
        />
        <ResultPage
          result={result}
          rates={rates}
          onRateChange={updateRate}
          onBack={() => setViewMode("calculator")}
          details={details}
        />
      </>
    );
  }

  // ─── CALCULATOR VIEW ────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header
        onGenerateReport={handleCalculate}
        projectReady={projectReady}
        onViewHistory={() => setViewMode("history")}
      />

      <div
        className="page-pad"
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          paddingTop: 28,
          paddingBottom: 48,
        }}
      >
        <ProjectDetails details={details} setDetails={setDetails} />

        {/* Overview strip */}
        <div className="overview-strip hscroll">
          <span className="overview-strip__label">Elements:</span>
          {TABS.map((t) => {
            const nos = ITEMS[t.id].reduce((s, it) => s + (+it.count || 1), 0);
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
                    style={{
                      color:
                        activeTab === t.id ? "var(--primary)" : "var(--text)",
                    }}
                  >
                    {t.label}
                  </div>
                  <div className="element-chip__meta">
                    {ITEMS[t.id].length} types · {nos} nos
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ flex: 1 }} />
          <span
            style={{
              fontSize: 12,
              color: "var(--text-3)",
              flexShrink: 0,
              fontFamily: "var(--font-mono)",
            }}
          >
            Total: <b style={{ color: "var(--primary)" }}>{totalNos}</b> nos
          </span>
        </div>

        {/* Tab nav */}
        <div className="tab-nav hscroll">
          {TABS.map((t) => {
            const nos = ITEMS[t.id].reduce((s, it) => s + (+it.count || 1), 0);
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
            items={ITEMS[activeTab]}
            setItems={SETTERS[activeTab]}
          />
        </div>

        {/* Prev / Next Navigation */}
        {(() => {
          const currentIndex = TABS.findIndex((t) => t.id === activeTab);
          const prevTab = TABS[currentIndex - 1];
          const nextTab = TABS[currentIndex + 1];
          return (
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
                  className="nav-prev"
                  style={{
                    border: `1.5px solid ${prevTab.color}`,
                    color: prevTab.color,
                  }}
                >
                  ← {prevTab.icon} {prevTab.label}
                </button>
              ) : (
                <div />
              )}

              {/* Step dots */}
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {TABS.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    title={t.label}
                    className="step-dot"
                    style={{
                      width: i === currentIndex ? 28 : 8,
                      background:
                        i === currentIndex
                          ? TABS[currentIndex].color
                          : "var(--border)",
                    }}
                  />
                ))}
              </div>

              {nextTab ? (
                <button
                  onClick={() => setActiveTab(nextTab.id)}
                  className="nav-next"
                  style={{
                    background: `linear-gradient(135deg, ${nextTab.color}, ${nextTab.color}cc)`,
                  }}
                >
                  {nextTab.icon} {nextTab.label} →
                </button>
              ) : (
                <button
                  onClick={handleCalculate}
                  disabled={!projectReady}
                  className="btn btn--primary btn--md"
                  style={{
                    animation: projectReady ? "pulse-ring 2s infinite" : "none",
                  }}
                >
                  ⚡ Calculate BBS →
                </button>
              )}
            </div>
          );
        })()}

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
            onClick={handleCalculate}
            disabled={!projectReady}
            className="btn btn--primary btn--lg"
          >
            ⚡ Calculate & Generate BBS
          </button>
        </div>

        {/* WB Rates */}
        <div className="rates-box">
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
      </div>

      <footer className="site-footer">
        BBS Calculator · IS 456:2000 · IS 2502:1963 · West Bengal Per-Piece
        Rates · For reference only — verify with structural engineer
      </footer>
    </div>
  );
}
