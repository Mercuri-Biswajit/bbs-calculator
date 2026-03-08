// src/App.jsx
// ─── ROOT: Only routing + shared state. Zero UI here. ────────────────────────

import { useState, useCallback } from "react";
import { DEFAULT_PROJECT } from "./components/ProjectDetails.jsx";
import { newItem } from "./components/ItemManager.jsx";
import { saveReport } from "./components/ReportsHistory.jsx";
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
import HistoryPage from "./pages/HistoryPage.jsx";

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
export default function App() {
  const [viewMode, setViewMode] = useState("calculator"); // "calculator" | "result" | "history"
  const [details, setDetails] = useState(DEFAULT_PROJECT);
  const [rates, setRates] = useState({ ...DEFAULT_RATES_PER_PIECE });
  const [result, setResult] = useState(null);
  const [saveError, setSaveError] = useState(null);

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

    // FIX #7 — saveReport is now async (uses window.storage); handle the promise
    saveReport({
      details: { ...details },
      byType,
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
  // so that editing rates on ResultPage produces a fully consistent result.
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
    <div style={{ minHeight: "100vh" }}>
      <Header
        onGenerateReport={handleCalculate}
        projectReady={projectReady}
        onViewHistory={() => setViewMode("history")}
        showHistoryButton={viewMode !== "history"}
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

      {viewMode === "history" && (
        <HistoryPage
          onLoadReport={handleLoadReport}
          onClose={() => setViewMode("calculator")}
        />
      )}

      {viewMode === "result" && result && (
        <ResultPage
          result={result}
          rates={rates}
          details={details}
          onRateChange={handleRateChange}
          onBack={() => setViewMode("calculator")}
        />
      )}

      {viewMode === "calculator" && (
        <CalculatorPage
          details={details}
          setDetails={setDetails}
          rates={rates}
          updateRate={updateRate}
          elementSets={elementSets}
          projectReady={projectReady}
          onCalculate={handleCalculate}
        />
      )}
    </div>
  );
}
