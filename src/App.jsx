// src/App.jsx
// ─── ROOT: Only routing + shared state. Zero UI here. ────────────────────────

import { useState, useCallback } from "react";
import { DEFAULT_PROJECT } from "./components/ProjectDetails.jsx";
import { newItem } from "./components/ItemManager.jsx";
import ReportsHistory, { saveReport } from "./components/ReportsHistory.jsx";
import {
  calcSingleFooting,
  calcSingleColumn,
  calcSingleBeam,
  calcSingleSlab,
  calcSingleStaircase,
  calcSingleLintel,
  calcSingleRaft,
  calcSinglePileCap,
  buildBBS,
  aggregateBBS,
  costSummary,
  DEFAULT_RATES_PER_PIECE,
} from "./utils/calculations.js";

import Header from "./components/Header.jsx";
import CalculatorPage from "./pages/CalculatorPage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import ProjectDetails from "./components/ProjectDetails.jsx";

// ─── helper ───────────────────────────────────────────────────────────────────
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
    else if (type === "lintel") rawRows = calcSingleLintel(item);
    else if (type === "raft") rawRows = calcSingleRaft(item);
    else if (type === "pileCap") rawRows = calcSinglePileCap(item);
    return {
      label: item.label,
      count: +item.count || 1,
      bbs: buildBBS(rawRows),
    };
  });
}

// ─── App ──────────────────────────────────────────────────────────────────────
import Sidebar from "./components/Sidebar.jsx";

export const TABS = [
  { id: "footing", icon: "🏗", label: "Footings", color: "#d97706" },
  { id: "column", icon: "🏛", label: "Columns", color: "#1e5cb8" },
  { id: "plinthBeam", icon: "🔩", label: "Plinth Beams", color: "#059669" },
  { id: "wallBeam", icon: "⚙️", label: "Wall Beams", color: "#7c3aed" },
  { id: "slab", icon: "▦", label: "Slabs", color: "#dc2626" },
  { id: "staircase", icon: "🪜", label: "Staircases", color: "#0d9488" },
  { id: "lintel", icon: "🪟", label: "Lintel/Chajja", color: "#b45309" },
  { id: "raft", icon: "🟫", label: "Raft", color: "#4338ca" },
  { id: "pileCap", icon: "🔵", label: "Pile Cap", color: "#0369a1" },
];

export default function App() {
  const [viewMode, setViewMode] = useState("calculator"); // "calculator" | "result" | "history"
  const [details, setDetails] = useState(DEFAULT_PROJECT);
  const [rates, setRates] = useState({ ...DEFAULT_RATES_PER_PIECE });
  const [result, setResult] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // Default to dashboard

  // ─── Element state ─────────────────────────────────────────────────────────
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
  const [lintels, setLintels] = useState([]);
  const [rafts, setRafts] = useState([]);
  const [pileCaps, setPileCaps] = useState([]);

  const elementSets = {
    footing: { items: footings, setItems: setFootings },
    column: { items: columns, setItems: setColumns },
    plinthBeam: { items: plinthBeams, setItems: setPlinthBeams },
    wallBeam: { items: wallBeams, setItems: setWallBeams },
    slab: { items: slabs, setItems: setSlabs },
    staircase: { items: staircases, setItems: setStaircases },
    lintel: { items: lintels, setItems: setLintels },
    raft: { items: rafts, setItems: setRafts },
    pileCap: { items: pileCaps, setItems: setPileCaps },
  };

  const allItemsByType = [
    { type: "footing", items: footings },
    { type: "column", items: columns },
    { type: "plinthBeam", items: plinthBeams },
    { type: "wallBeam", items: wallBeams },
    { type: "slab", items: slabs },
    { type: "staircase", items: staircases },
    { type: "lintel", items: lintels },
    { type: "raft", items: rafts },
    { type: "pileCap", items: pileCaps },
  ];

  // ─── Derived ───────────────────────────────────────────────────────────────
  const projectReady = details.projectName.trim().length > 0;
  const updateRate = (dia, val) => setRates((p) => ({ ...p, [dia]: val }));

  const totalNos = Object.values(elementSets)
    .flatMap((s) => s.items)
    .reduce((sum, it) => sum + (+it.count || 1), 0);

  // ─── Actions ────────────────────────────────────────────────────────────────
  const handleCalculate = useCallback(() => {
    const byType = allItemsByType.map(({ type, items }) => ({
      type,
      items,
      rows: aggregateBBS(calcItems(type, items)),
    }));
    const allRows = byType.flatMap((t) => t.rows);
    const costs = costSummary(allRows, rates);
    const data = { byType, allRows, costs };

    setResult(data);

    // Strip out heavy base64 image payloads before saving to history to prevent QuotaExceeded errors
    const sanitizedByType = byType.map(t => ({
      ...t,
      items: t.items.map(item => {
        const itemCopy = { ...item };
        delete itemCopy.blueprintImage;
        return itemCopy;
      })
    }));

    // FIX #7 — saveReport is now async (uses window.storage); handle the promise
    saveReport({
      details: { ...details },
      byType: sanitizedByType,
      allRows,
      costs,
      rates: { ...rates },
    }).then((saveResult) => {
      if (!saveResult.ok) {
        setSaveError(
          "⚠️ Report generated but could not be saved to history due to a storage error.",
        );
      } else {
        setSaveError(null);
      }
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
    lintels,
    rafts,
    pileCaps,
    rates,
    details,
  ]);

  // FIX #8 — handleRecalculate: recalculates BBS+costs with current rates
  const handleRecalculate = useCallback(
    (newRates) => {
      const byType = allItemsByType.map(({ type, items }) => ({
        type,
        items,
        rows: aggregateBBS(calcItems(type, items)),
      }));
      const allRows = byType.flatMap((t) => t.rows);
      const costs = costSummary(allRows, newRates || rates);
      setResult({ byType, allRows, costs });
    },
    [
      footings,
      columns,
      plinthBeams,
      wallBeams,
      slabs,
      staircases,
      lintels,
      rafts,
      pileCaps,
      rates,
    ],
  );

  const handleRateChange = useCallback(
    (dia, val) => {
      const newRates = { ...rates, [dia]: val };
      setRates(newRates);
      // FIX #8 — immediately recalculate costs when a rate is edited on ResultPage
      if (result) {
        const costs = costSummary(result.allRows, newRates);
        setResult((prev) => ({ ...prev, costs }));
      }
    },
    [rates, result],
  );

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

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="app-container">
      {viewMode === "calculator" && (
        <Sidebar
          tabs={TABS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          elementSets={elementSets}
          totalNos={totalNos}
        />
      )}

      <main className="main-content">
        <Header
          onGenerateReport={handleCalculate}
          projectReady={projectReady}
          onHome={() => {
            setActiveTab("dashboard");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />

        {/* Storage error banner */}
        {saveError && (
          <div
            style={{
              background: "#fffbeb",
              borderBottom: "1px solid #fde68a",
              padding: "10px 28px",
              fontSize: 12,
              color: "#92400e",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span>{saveError}</span>
            <button
              onClick={() => setSaveError(null)}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#92400e",
                fontSize: 16,
              }}
            >
              ✕
            </button>
          </div>
        )}

        <div className="content-scrollable">
          {/* History Page is now Dashboard Tab */}

          {viewMode === "result" && result && (
            <ResultPage
              result={result}
              rates={rates}
              details={details}
              onRateChange={handleRateChange}
              onBack={() => setViewMode("calculator")}
            />
          )}

          {viewMode === "calculator" && activeTab === "dashboard" && (
            <ReportsHistory
              onLoadReport={handleLoadReport}
              onNewProject={() => {
                setDetails(DEFAULT_PROJECT); // Reset details for new project
                setResult(null); // Clear previous result
                setActiveTab("project_details");
              }}
            />
          )}

          {viewMode === "calculator" && activeTab === "project_details" && (
            <div className="page-pad fade-in" style={{ maxWidth: 860, margin: "0 auto", marginTop: 40 }}>
               <ProjectDetails 
                 details={details} 
                 setDetails={setDetails} 
                 onStart={() => setActiveTab('footing')}
                 projectReady={projectReady}
               />
            </div>
          )}

          {viewMode === "calculator" && activeTab !== "dashboard" && activeTab !== "project_details" && (
            <CalculatorPage
              details={details}
              setDetails={setDetails}
              rates={rates}
              updateRate={updateRate}
              elementSets={elementSets}
              projectReady={projectReady}
              onCalculate={handleCalculate}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}
        </div>
      </main>
    </div>
  );
}
