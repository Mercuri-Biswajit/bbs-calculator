// src/utils/excelExport.js
// ─── Excel (.xlsx) Export using SheetJS ──────────────────────────────────────
// Import SheetJS via CDN in index.html or use npm: npm install xlsx

import * as XLSX from "xlsx";
import { BAR_WEIGHT } from "./calculations.js";

const TABS_META = {
  footing:    { icon: "F",  label: "Footings"       },
  column:     { icon: "C",  label: "Columns"        },
  plinthBeam: { icon: "PB", label: "Plinth Beams"   },
  wallBeam:   { icon: "WB", label: "Wall Beams"     },
  slab:       { icon: "S",  label: "Slabs"          },
  staircase:  { icon: "ST", label: "Staircases"     },
  lintel:     { icon: "L",  label: "Lintel/Chajja"  },
  raft:       { icon: "RF", label: "Raft Foundation" },
  pileCap:    { icon: "PC", label: "Pile Caps"       },
};

function autoColWidths(data) {
  if (!data.length) return [];
  return Object.keys(data[0]).map(key => ({
    wch: Math.max(key.length, ...data.map(r => String(r[key] ?? "").length)) + 2,
  }));
}

export function downloadExcel(details, byType, allRows, costs, cutLengthData, barTagData) {
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Project Info ──────────────────────────────────────────────────
  const infoData = [
    ["BAR BENDING SCHEDULE REPORT"],
    [],
    ["Project Name",   details.projectName  || "—"],
    ["Client Name",    details.clientName   || "—"],
    ["Client Address", details.clientAddress || "—"],
    ["Site Location",  details.location     || "—"],
    ["Ref No.",        details.refNo        || "—"],
    ["Date",           details.date         || "—"],
    ["Engineer",       details.engineerName  || "—"],
    ["Firm / Company", details.firmName     || "—"],
    ["Email",          details.engineerEmail || "—"],
    ["WhatsApp",       details.engineerPhone ? `+91 ${details.engineerPhone}` : "—"],
    ["Remarks",        details.remarks      || "—"],
    [],
    ["Standard",       "IS 456:2000 + IS 2502:1963"],
    ["Cover Footing/Raft/PileCap", "75 mm"],
    ["Cover Column/Plinth Beam",   "40 mm"],
    ["Cover Wall Beam/Lintel",     "25 mm"],
    ["Cover Slab",                 "20 mm"],
    ["Cover Staircase",            "25 mm"],
    ["Lap Length",                 "40d"],
    ["Hook Length",                "9d"],
  ];
  const wsInfo = XLSX.utils.aoa_to_sheet(infoData);
  wsInfo["!cols"] = [{ wch: 28 }, { wch: 45 }];
  XLSX.utils.book_append_sheet(wb, wsInfo, "Project Info");

  // ── Sheet 2: Combined BBS ──────────────────────────────────────────────────
  const bbsHeader = ["Element", "Mark", "Description", "Nos", "Cut Length (m)", "Total Length (m)", "Unit Wt (kg/m)", "Weight (kg)"];
  const bbsRows = allRows.map(r => ({
    "Element":          r.sourceLabel,
    "Mark":             r.mark,
    "Description":      r.desc,
    "Nos":              r.nos,
    "Cut Length (m)":   +r.cutLen.toFixed(3),
    "Total Length (m)": +r.totalLen.toFixed(3),
    "Unit Wt (kg/m)":   BAR_WEIGHT[r.dia] || 0,
    "Weight (kg)":      +r.weight.toFixed(2),
  }));
  // Totals row
  bbsRows.push({
    "Element":          "TOTAL",
    "Mark":             "",
    "Description":      "",
    "Nos":              allRows.reduce((s, r) => s + r.nos, 0),
    "Cut Length (m)":   "",
    "Total Length (m)": +allRows.reduce((s, r) => s + r.totalLen, 0).toFixed(3),
    "Unit Wt (kg/m)":   "",
    "Weight (kg)":      +allRows.reduce((s, r) => s + r.weight, 0).toFixed(2),
  });
  const wsBBS = XLSX.utils.json_to_sheet(bbsRows);
  wsBBS["!cols"] = autoColWidths(bbsRows);
  XLSX.utils.book_append_sheet(wb, wsBBS, "Combined BBS");

  // ── Sheet 3: Per-type BBS sheets ──────────────────────────────────────────
  byType.forEach(t => {
    if (!t.rows.length) return;
    const meta = TABS_META[t.type] || { label: t.type };
    const rows = t.rows.map(r => ({
      "Element":          r.sourceLabel,
      "Count":            r.count,
      "Mark":             r.mark,
      "Description":      r.desc,
      "Dia (mm)":         r.dia,
      "Nos":              r.nos,
      "Cut Length (m)":   +r.cutLen.toFixed(3),
      "Total Length (m)": +r.totalLen.toFixed(3),
      "Unit Wt (kg/m)":   BAR_WEIGHT[r.dia] || 0,
      "Weight (kg)":      +r.weight.toFixed(2),
    }));
    rows.push({
      "Element":          "SUBTOTAL",
      "Count":            "",
      "Mark":             "",
      "Description":      "",
      "Dia (mm)":         "",
      "Nos":              "",
      "Cut Length (m)":   "",
      "Total Length (m)": +t.rows.reduce((s, r) => s + r.totalLen, 0).toFixed(3),
      "Unit Wt (kg/m)":   "",
      "Weight (kg)":      +t.rows.reduce((s, r) => s + r.weight, 0).toFixed(2),
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = autoColWidths(rows);
    // Sheet name max 31 chars
    const sheetName = meta.label.substring(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  // ── Sheet 4: Cutting Length Summary ───────────────────────────────────────
  const cutRows = [];
  cutLengthData.forEach(d => {
    d.entries.forEach(e => {
      cutRows.push({
        "Dia (mm)":         d.dia,
        "Source Element":   e.source,
        "Mark":             e.mark,
        "Description":      e.desc,
        "Nos":              e.nos,
        "Cut Length (m)":   +e.cutLen.toFixed(3),
        "Total Length (m)": +e.totalLen.toFixed(3),
        "Weight (kg)":      +(e.nos * e.cutLen * (BAR_WEIGHT[d.dia] || 0)).toFixed(2),
      });
    });
    cutRows.push({
      "Dia (mm)":         `φ${d.dia}mm SUBTOTAL`,
      "Source Element":   "",
      "Mark":             "",
      "Description":      "",
      "Nos":              d.totalNos,
      "Cut Length (m)":   "",
      "Total Length (m)": +d.totalLen.toFixed(3),
      "Weight (kg)":      +d.weight.toFixed(2),
    });
  });
  const wsCut = XLSX.utils.json_to_sheet(cutRows);
  wsCut["!cols"] = autoColWidths(cutRows);
  XLSX.utils.book_append_sheet(wb, wsCut, "Cutting Length Summary");

  // ── Sheet 5: Bar Tag Schedule ─────────────────────────────────────────────
  const tagRows = barTagData.map(r => ({
    "Tag No.":          r.tag,
    "Source Element":   r.source,
    "Mark":             r.mark,
    "Description":      r.desc,
    "Dia (mm)":         r.dia,
    "Nos":              r.nos,
    "Cut Length (m)":   +r.cutLen.toFixed(3),
    "Total Length (m)": +r.totalLen.toFixed(3),
    "Weight (kg)":      +r.weight.toFixed(2),
  }));
  const wsTag = XLSX.utils.json_to_sheet(tagRows);
  wsTag["!cols"] = autoColWidths(tagRows);
  XLSX.utils.book_append_sheet(wb, wsTag, "Bar Tag Schedule");

  // ── Sheet 6: Cost Summary ─────────────────────────────────────────────────
  const costRows = costs.map(c => ({
    "Bar Dia (mm)":     `φ${c.dia}mm`,
    "Total Length (m)": c.totalLen,
    "Weight (kg)":      c.kg,
    "Rods (12m)":       c.rods12m,
    "Rate (₹/rod)":     c.ratePerPiece,
    "Amount (₹)":       c.cost,
  }));
  costRows.push({
    "Bar Dia (mm)":     "TOTAL",
    "Total Length (m)": "",
    "Weight (kg)":      +costs.reduce((s, r) => s + r.kg, 0).toFixed(2),
    "Rods (12m)":       costs.reduce((s, r) => s + r.rods12m, 0),
    "Rate (₹/rod)":     "",
    "Amount (₹)":       costs.reduce((s, r) => s + r.cost, 0),
  });
  const wsCost = XLSX.utils.json_to_sheet(costRows);
  wsCost["!cols"] = autoColWidths(costRows);
  XLSX.utils.book_append_sheet(wb, wsCost, "Cost Summary");

  // ── Save file ─────────────────────────────────────────────────────────────
  const fileName = `BBS_${(details.projectName || "Project").replace(/\s+/g, "_")}_${details.date || ""}.xlsx`;
  XLSX.writeFile(wb, fileName);
  return fileName;
}