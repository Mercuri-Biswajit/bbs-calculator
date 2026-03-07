// src/App.jsx
// FINAL VERSION: Staircase, 1-way/2-way slabs, per-piece rates, WhatsApp bar orders, units

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
  { id: "footing", icon: "🏗", label: "Footings", color: "#d35400" },
  { id: "column", icon: "🏛", label: "Columns", color: "#1565c0" },
  { id: "plinthBeam", icon: "🔩", label: "Plinth Beams", color: "#1e7e34" },
  { id: "wallBeam", icon: "⚙️", label: "Wall Beams", color: "#6f42c1" },
  { id: "slab", icon: "▦", label: "Slabs", color: "#c0392b" },
  { id: "staircase", icon: "🪜", label: "Staircases", color: "#0e7490" },
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

// ─── RESULT PAGE ─────────────────────────────────────────────────────────────
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

  // 🆕 WhatsApp Bar Purchase Order
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
    const phone = `91${details.engineerPhone}`;
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const ActionBar = ({ style }) => (
    <div style={{ display: "flex", gap: 12, ...style }}>
      <button
        onClick={handleDownload}
        disabled={dlBusy}
        style={{
          background: dlBusy ? "#90a4ae" : "var(--primary)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "11px 22px",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        {dlBusy ? "⏳ Generating…" : "⬇️ Download PDF"}
      </button>
      <button
        onClick={handleWhatsApp}
        disabled={sending}
        style={{
          background: sending ? "#90a4ae" : "#25d366",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "11px 22px",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 7,
          boxShadow: "0 2px 8px rgba(37,211,102,.35)",
        }}
      >
        {sending ? "⏳ Opening…" : `💬 Send Report via WhatsApp`}
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* KPI Banner */}
      <div
        style={{
          background: "linear-gradient(135deg,#1565c0,#0d47a1)",
          padding: "22px 32px",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={onBack}
              style={{
                background: "rgba(255,255,255,.15)",
                border: "1px solid rgba(255,255,255,.3)",
                color: "#fff",
                borderRadius: 6,
                padding: "7px 16px",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              ← Back
            </button>
            {details.projectName && (
              <span
                style={{
                  color: "rgba(255,255,255,.85)",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                📌 {details.projectName}
              </span>
            )}
            {details.clientName && (
              <span style={{ color: "rgba(255,255,255,.6)", fontSize: 12 }}>
                · {details.clientName}
              </span>
            )}
            {details.location && (
              <span style={{ color: "rgba(255,255,255,.6)", fontSize: 12 }}>
                · {details.location}
              </span>
            )}
            <div style={{ flex: 1 }} />
            <ActionBar />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 14,
            }}
          >
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
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,.13)",
                  borderRadius: 10,
                  padding: "14px 18px",
                  border: "1px solid rgba(255,255,255,.2)",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,.65)",
                    fontWeight: 600,
                    letterSpacing: 0.5,
                  }}
                >
                  {k.label}
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: "#fff",
                    margin: "4px 0 2px",
                  }}
                >
                  {k.value}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)" }}>
                  {k.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WhatsApp success msg */}
      {sentMsg && (
        <div
          style={{
            background: "#f0fff4",
            borderBottom: "1px solid #25d366",
            padding: "11px 24px",
            fontSize: 13,
            color: "#1a7a3c",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 18 }}>💬</span>
          <span>{sentMsg}</span>
          <button
            onClick={() => setSentMsg("")}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#666",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      )}

      <div
        style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 32px 40px" }}
      >
        {/* Per-type BBS */}
        {byType.map(
          (t) =>
            t.rows.length > 0 && (
              <Card key={t.type} style={{ marginBottom: 20 }}>
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
                      }}
                    >
                      {t.rows.reduce((s, r) => s + r.weight, 0).toFixed(2)} kg
                    </span>
                  }
                />
                <div style={{ padding: 18 }}>
                  <GroupedBBSTable rows={t.rows} />
                </div>
              </Card>
            ),
        )}

        {/* Combined BBS */}
        <Card style={{ marginBottom: 20 }}>
          <CardHeader
            icon="📋"
            title="COMBINED BBS — All Elements"
            subtitle="Aggregate · IS 2502:1963"
          />
          <div style={{ padding: 18 }}>
            <BBSTable rows={allRows} showSource={true} />
          </div>
        </Card>

        {/* Cost table */}
        <Card style={{ marginBottom: 20 }}>
          <CardHeader
            icon="💰"
            title="Material Estimate & Cost Summary"
            subtitle="West Bengal Market Rate · Per-piece (12m rod)"
          />
          <div style={{ padding: 18 }}>
            <CostTable
              costs={costs}
              onRateChange={onRateChange}
              details={details}
              onSendBarOrder={handleSendBarOrder}
            />
          </div>
        </Card>

        {/* Bottom CTA */}
        <div
          style={{
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}
            >
              📄 Generate & Share Report
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
              Download PDF locally or send directly to WhatsApp
            </div>
          </div>
          <ActionBar />
        </div>

        <div
          style={{
            marginTop: 14,
            padding: "10px 16px",
            background: "#fffbe6",
            border: "1px solid #ffe082",
            borderRadius: 8,
            fontSize: 12,
            color: "#7d5000",
          }}
        >
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

    // Auto-save report
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

  // ─── VIEW: REPORTS HISTORY ───────────────────────────────────────────────────
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

  // ─── VIEW: RESULT PAGE ────────────────────────────────────────────────────────
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

  // ─── VIEW: CALCULATOR (DEFAULT) ──────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header
        onGenerateReport={handleCalculate}
        projectReady={projectReady}
        onViewHistory={() => setViewMode("history")}
      />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 32px" }}>
        {/* Project Details */}
        <ProjectDetails details={details} setDetails={setDetails} />

        {/* Overview strip */}
        <div
          style={{
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "12px 18px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>
            Elements:
          </span>
          {TABS.map((t) => {
            const nos = ITEMS[t.id].reduce((s, it) => s + (+it.count || 1), 0);
            return (
              <div
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                  background:
                    activeTab === t.id
                      ? "var(--primary-light)"
                      : "var(--surface2)",
                  border:
                    activeTab === t.id
                      ? "1px solid var(--primary)"
                      : "1px solid transparent",
                }}
              >
                <span>{t.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color:
                        activeTab === t.id ? "var(--primary)" : "var(--text)",
                    }}
                  >
                    {t.label}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--text3)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {ITEMS[t.id].length} types · {nos} nos
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: "var(--text3)" }}>
            Total: <b style={{ color: "var(--primary)" }}>{totalNos}</b> nos
          </span>
        </div>

        {/* Tab nav */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "2px solid var(--border)",
            marginBottom: 20,
            overflowX: "auto",
          }}
        >
          {TABS.map((t) => {
            const nos = ITEMS[t.id].reduce((s, it) => s + (+it.count || 1), 0);
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "11px 22px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  borderBottom:
                    activeTab === t.id
                      ? `3px solid ${t.color}`
                      : "3px solid transparent",
                  fontWeight: activeTab === t.id ? 700 : 500,
                  color: activeTab === t.id ? t.color : "var(--text2)",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  whiteSpace: "nowrap",
                  marginBottom: -2,
                }}
              >
                <span>{t.icon}</span> {t.label}
                {nos > 0 && (
                  <span
                    style={{
                      background:
                        activeTab === t.id ? t.color : "var(--surface2)",
                      color: activeTab === t.id ? "white" : "var(--text2)",
                      fontSize: 10,
                      padding: "1px 7px",
                      borderRadius: 99,
                      fontWeight: 700,
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

        {/* Calculate CTA */}
        <div
          style={{
            marginTop: 28,
            padding: "20px 24px",
            background: "linear-gradient(135deg,#e3eefb,#f0f6ff)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <div>
            <div
              style={{ fontWeight: 700, fontSize: 15, color: "var(--primary)" }}
            >
              {projectReady
                ? `✅ Ready: ${details.projectName}`
                : "⚠️  Enter Project Name above to enable report"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 3 }}>
              {totalNos} total nos · IS 456 covers auto-applied · Per-piece
              rates
              {details.engineerPhone &&
                ` · WhatsApp: +91 ${details.engineerPhone}`}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            disabled={!projectReady}
            style={{
              background: projectReady
                ? "linear-gradient(135deg,#1565c0,#0d47a1)"
                : "#b0bec5",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "13px 32px",
              fontSize: 15,
              fontWeight: 700,
              cursor: projectReady ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ⚡ Calculate & Generate BBS
          </button>
        </div>

        {/* 🆕 WB Rates (Per-Piece) */}
        <div
          style={{
            marginTop: 16,
            padding: "14px 18px",
            background: "white",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: 12,
              color: "var(--text2)",
              marginBottom: 10,
              letterSpacing: 0.5,
            }}
          >
            ₹ WEST BENGAL MARKET RATES (Per 12m Rod) — Edit anytime:
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {Object.keys(rates).map((d) => (
              <div
                key={d}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    color: "var(--red)",
                    fontWeight: 700,
                  }}
                >
                  φ{d}mm: ₹
                </span>
                <input
                  type="number"
                  value={rates[d]}
                  onChange={(e) => updateRate(+d, +e.target.value)}
                  style={{ width: 68, fontSize: 13, padding: "5px 6px" }}
                />
                <span style={{ fontSize: 11, color: "var(--text3)" }}>/pc</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "14px 28px",
          textAlign: "center",
          fontSize: 11,
          color: "var(--text3)",
          background: "white",
          marginTop: 20,
        }}
      >
        BBS Calculator · IS 456:2000 · IS 2502:1963 · West Bengal Per-Piece
        Rates · For reference only — verify with structural engineer
      </footer>
    </div>
  );
}
