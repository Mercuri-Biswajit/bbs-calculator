// src/utils/pdfReport.js
// Generates professional BBS PDF report using jsPDF + jspdf-autotable
// Called from: reportHelpers → download PDF / send to WhatsApp
// FIX: Added proper table pagination handling to prevent text overlap

import jsPDF from "jspdf";
import "jspdf-autotable";
import { BAR_WEIGHT } from "./calculations.js";

// ─── COLOURS ──────────────────────────────────────────────────────────────────
const BLUE = [21, 101, 192];
const BLUE_LIGHT = [227, 238, 251];
const DARK = [26, 37, 53];
const GREY = [74, 85, 104];
const GREY_LIGHT = [240, 244, 248];
const WHITE = [255, 255, 255];
const GREEN = [30, 126, 52];
const GREEN_BG = [234, 250, 241];
const RED = [192, 57, 43];
const ORANGE = [211, 84, 0];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function setFont(doc, size, style = "normal", color = DARK) {
  doc.setFontSize(size);
  doc.setFont("helvetica", style);
  doc.setTextColor(...color);
}

function hLine(doc, y, x1, x2, color = [220, 230, 240], lw = 0.3) {
  doc.setDrawColor(...color);
  doc.setLineWidth(lw);
  doc.line(x1, y, x2, y);
}

function filledRect(doc, x, y, w, h, fill, stroke = null) {
  doc.setFillColor(...fill);
  if (stroke) {
    doc.setDrawColor(...stroke);
    doc.setLineWidth(0.3);
    doc.rect(x, y, w, h, "FD");
  } else doc.rect(x, y, w, h, "F");
}

// ─── PAGE HEADER (repeated on each page) ─────────────────────────────────────
function drawPageHeader(doc, details, pageW, logoDataUrl) {
  // Blue top bar
  filledRect(doc, 0, 0, pageW, 18, BLUE);

  // Logo placeholder / actual logo
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, "PNG", 10, 2, 28, 14);
    } catch (_) {}
  } else {
    // Text logo fallback
    setFont(doc, 13, "bold", WHITE);
    doc.text("BBS", 12, 12);
  }

  // Title in header
  setFont(doc, 11, "bold", WHITE);
  doc.text("BAR BENDING SCHEDULE REPORT", pageW / 2, 11, { align: "center" });

  // Ref + Date right side
  setFont(doc, 7, "normal", [200, 220, 255]);
  if (details.refNo)
    doc.text(`Ref: ${details.refNo}`, pageW - 10, 8, { align: "right" });
  doc.text(`Date: ${details.date || ""}`, pageW - 10, 13, { align: "right" });
}

// ─── PAGE FOOTER ─────────────────────────────────────────────────────────────
function drawPageFooter(doc, pageW, pageH, pageNum, totalPages, details) {
  filledRect(doc, 0, pageH - 12, pageW, 12, GREY_LIGHT);
  hLine(doc, pageH - 12, 0, pageW, [200, 215, 230], 0.4);

  setFont(doc, 7, "normal", GREY);
  doc.text(
    `${details.firmName || "BBS Calculator"} · IS 456:2000 · IS 2502:1963 · For reference only`,
    10,
    pageH - 4.5,
  );
  doc.text(`Page ${pageNum} of ${totalPages}`, pageW - 10, pageH - 4.5, {
    align: "right",
  });
}

// ─── PROJECT INFO BOX ────────────────────────────────────────────────────────
function drawProjectInfo(doc, details, pageW, startY) {
  let y = startY;

  // Box background
  filledRect(doc, 8, y, pageW - 16, 52, BLUE_LIGHT, [180, 210, 240]);

  // Left column
  const leftX = 14,
    rightX = pageW / 2 + 4;
  const labelColor = [80, 120, 180];
  const valueColor = DARK;

  const rows = [
    [
      "PROJECT",
      details.projectName || "—",
      "CLIENT",
      details.clientName || "—",
    ],
    [
      "LOCATION",
      details.location || "—",
      "ADDRESS",
      details.clientAddress || "—",
    ],
    ["ENGINEER", details.engineerName || "—", "FIRM", details.firmName || "—"],
    [
      "PHONE",
      details.engineerPhone ? `+91 ${details.engineerPhone}` : "—",
      "EMAIL",
      details.engineerEmail || "—",
    ],
  ];

  rows.forEach((row, i) => {
    const ry = y + 9 + i * 11;
    // left
    setFont(doc, 7, "bold", labelColor);
    doc.text(row[0] + ":", leftX, ry);
    setFont(doc, 8, "normal", valueColor);
    doc.text(String(row[1]).substring(0, 45), leftX + 22, ry);
    // right
    setFont(doc, 7, "bold", labelColor);
    doc.text(row[2] + ":", rightX, ry);
    setFont(doc, 8, "normal", valueColor);
    doc.text(String(row[3]).substring(0, 45), rightX + 22, ry);
  });

  if (details.remarks) {
    const ry = y + 48;
    setFont(doc, 7, "bold", labelColor);
    doc.text("REMARKS:", leftX, ry);
    setFont(doc, 7, "normal", GREY);
    doc.text(details.remarks.substring(0, 120), leftX + 22, ry);
  }

  return y + 56;
}

// ─── KPI SUMMARY BOXES ───────────────────────────────────────────────────────
function drawKPISummary(
  doc,
  totalWt,
  totalCost,
  totalRods,
  elementCount,
  pageW,
  y,
) {
  const boxes = [
    {
      label: "TOTAL STEEL",
      value: `${totalWt.toFixed(1)} kg`,
      color: BLUE,
      bg: BLUE_LIGHT,
    },
    {
      label: "TOTAL COST",
      value: `Rs.${totalCost.toLocaleString("en-IN")}`,
      color: GREEN,
      bg: GREEN_BG,
    },
    {
      label: "RODS (12m)",
      value: `${totalRods} rods`,
      color: ORANGE,
      bg: [255, 245, 230],
    },
    {
      label: "ELEMENTS",
      value: `${elementCount} types`,
      color: [74, 85, 104],
      bg: GREY_LIGHT,
    },
  ];

  const bw = (pageW - 16 - 9) / 4;
  boxes.forEach((b, i) => {
    const bx = 8 + i * (bw + 3);
    filledRect(doc, bx, y, bw, 22, b.bg);
    doc.setDrawColor(...b.color);
    doc.setLineWidth(0.5);
    doc.rect(bx, y, bw, 22);

    setFont(doc, 7, "bold", b.color);
    doc.text(b.label, bx + bw / 2, y + 8, { align: "center" });
    setFont(doc, 11, "bold", b.color);
    doc.text(b.value, bx + bw / 2, y + 18, { align: "center" });
  });

  return y + 28;
}

// ─── BBS TABLE PER ELEMENT TYPE ──────────────────────────────────────────────
function drawBBSSection(
  doc,
  typeLabel,
  typeIcon,
  aggregatedRows,
  startY,
  pageW,
  details,
) {
  if (!aggregatedRows.length) return startY;
  let y = startY;

  // Section heading
  filledRect(doc, 8, y, pageW - 16, 10, BLUE);
  setFont(doc, 8, "bold", WHITE);
  doc.text(
    `${typeIcon}  ${typeLabel.toUpperCase()} — BAR BENDING SCHEDULE`,
    14,
    y + 7,
  );

  const typeWt = aggregatedRows.reduce((s, r) => s + r.weight, 0);
  doc.text(`Total: ${typeWt.toFixed(2)} kg`, pageW - 10, y + 7, {
    align: "right",
  });
  y += 12;

  // Group by sourceLabel
  const groups = {};
  aggregatedRows.forEach((r) => {
    const k = r.sourceLabel || "General";
    if (!groups[k]) groups[k] = { rows: [], count: r.count };
    groups[k].rows.push(r);
  });

  for (const [grpLabel, grp] of Object.entries(groups)) {
    // Check if we need a new page before drawing sub-heading
    const pageH = doc.internal.pageSize.getHeight();
    if (y > pageH - 40) {
      doc.addPage();
      drawPageHeader(doc, details, pageW, null);
      y = 22;
    }

    // Sub-heading
    filledRect(doc, 8, y, pageW - 16, 7, [232, 244, 253]);
    setFont(doc, 7, "bold", BLUE);
    doc.text(`  ${grpLabel}  (Qty: ${grp.count} nos)`, 12, y + 5);
    y += 9;

    const bodyRows = grp.rows.map((r) => [
      r.mark,
      r.desc,
      r.nos,
      r.cutLen.toFixed(3),
      r.totalLen.toFixed(3),
      BAR_WEIGHT[r.dia] || "—",
      r.weight.toFixed(2),
    ]);

    doc.autoTable({
      startY: y,
      margin: { left: 8, right: 8, bottom: 18 }, // Added bottom margin for footer
      head: [
        [
          "Mark",
          "Bar Description",
          "Nos",
          "Cut Len (m)",
          "Total Len (m)",
          "Unit Wt",
          "Weight (kg)",
        ],
      ],
      body: bodyRows,
      foot: [
        [
          "",
          "SUBTOTAL",
          "",
          "",
          "",
          "",
          grp.rows.reduce((s, r) => s + r.weight, 0).toFixed(2) + " kg",
        ],
      ],
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 2.5,
        textColor: DARK,
      },
      headStyles: {
        fillColor: [213, 230, 248],
        textColor: BLUE,
        fontStyle: "bold",
        fontSize: 8,
      },
      footStyles: {
        fillColor: [213, 230, 248],
        textColor: BLUE,
        fontStyle: "bold",
        fontSize: 8,
      },
      columnStyles: {
        0: { cellWidth: 12, halign: "center" },
        1: { cellWidth: "auto" },
        2: { cellWidth: 14, halign: "center" },
        3: { cellWidth: 22, halign: "right" },
        4: { cellWidth: 24, halign: "right", textColor: GREEN },
        5: { cellWidth: 18, halign: "right" },
        6: {
          cellWidth: 22,
          halign: "right",
          fontStyle: "bold",
          textColor: RED,
        },
      },
      alternateRowStyles: { fillColor: [247, 250, 253] },
      showFoot: "lastPage", // CRITICAL FIX: Only show footer on the last page of multi-page tables
      didParseCell: (data) => {
        if (data.section === "foot") {
          data.cell.styles.fillColor = [213, 230, 248];
          data.cell.styles.textColor = BLUE;
          data.cell.styles.fontStyle = "bold";
        }
      },
      didDrawPage: (data) => {
        // Draw header on continuation pages
        if (data.pageNumber > 1 || data.pageCount > 1) {
          const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
          const startPage =
            data.settings.startY < 30 ? currentPage : currentPage;

          // Only draw header if this is a continuation page
          if (data.pageNumber > 1) {
            drawPageHeader(doc, details, pageW, null);
          }
        }
      },
    });

    y = doc.lastAutoTable.finalY + 6;
  }

  return y + 4;
}

// ─── COMBINED + COST SUMMARY ─────────────────────────────────────────────────
function drawCombinedSummary(doc, costs, pageW, y) {
  // Heading
  filledRect(doc, 8, y, pageW - 16, 10, [26, 37, 53]);
  setFont(doc, 8, "bold", WHITE);
  doc.text(
    "MATERIAL ESTIMATE & COST SUMMARY — WEST BENGAL MARKET RATE",
    14,
    y + 7,
  );
  y += 12;

  const tableRows = costs.map((c) => [
    `phi${c.dia}mm`,
    `${c.totalLen} m`,
    `${c.kg} kg`,
    `${c.rods12m} rods`,
    `Rs.${c.rate}/kg`,
    `Rs.${c.cost.toLocaleString("en-IN")}`,
  ]);

  const totalKg = costs.reduce((s, r) => s + r.kg, 0);
  const totalRods = costs.reduce((s, r) => s + r.rods12m, 0);
  const totalCost = costs.reduce((s, r) => s + r.cost, 0);

  doc.autoTable({
    startY: y,
    margin: { left: 8, right: 8, bottom: 18 },
    head: [
      [
        "Bar Dia",
        "Total Length",
        "Weight (kg)",
        "Rods (12m)",
        "Rate (Rs/kg)",
        "Amount (Rs)",
      ],
    ],
    body: tableRows,
    foot: [
      [
        "TOTAL",
        "—",
        `${totalKg.toFixed(2)} kg`,
        `${totalRods} rods`,
        "—",
        `Rs.${totalCost.toLocaleString("en-IN")}`,
      ],
    ],
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 8.5,
      cellPadding: 3,
      textColor: DARK,
    },
    headStyles: {
      fillColor: [26, 37, 53],
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 8,
    },
    footStyles: {
      fillColor: GREEN,
      textColor: WHITE,
      fontStyle: "bold",
      fontSize: 9,
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: RED },
      2: { halign: "right", textColor: ORANGE },
      3: { halign: "center", textColor: BLUE, fontStyle: "bold" },
      5: { halign: "right", fontStyle: "bold", textColor: GREEN },
    },
    alternateRowStyles: { fillColor: [247, 250, 253] },
  });

  y = doc.lastAutoTable.finalY + 6;

  // Note
  setFont(doc, 7, "italic", GREY);
  doc.text(
    "* Add 5% wastage for actual procurement.  Rates are indicative West Bengal market rates. Verify before purchase.",
    10,
    y + 5,
  );

  return y + 12;
}

// ─── SIGNATURE BLOCK ─────────────────────────────────────────────────────────
function drawSignatureBlock(doc, details, pageW, y) {
  filledRect(doc, 8, y, pageW - 16, 28, GREY_LIGHT);
  hLine(doc, y, 8, pageW - 8, [200, 215, 230], 0.4);

  const leftX = 16,
    rightX = pageW / 2 + 10;

  setFont(doc, 7, "bold", GREY);
  doc.text("PREPARED BY:", leftX, y + 8);
  setFont(doc, 9, "bold", DARK);
  doc.text(details.engineerName || "___________________", leftX, y + 16);
  setFont(doc, 7, "normal", GREY);
  doc.text(details.firmName || "", leftX, y + 22);

  setFont(doc, 7, "bold", GREY);
  doc.text("CHECKED / APPROVED BY:", rightX, y + 8);
  setFont(doc, 9, "normal", DARK);
  doc.text("___________________________", rightX, y + 16);
  setFont(doc, 7, "normal", GREY);
  doc.text("Signature & Stamp", rightX, y + 22);

  // IS note right
  setFont(doc, 7, "normal", GREY);
  doc.text(
    "IS 456:2000  ·  IS 2502:1963  ·  For reference only — verify with structural engineer",
    pageW / 2,
    y + 27,
    { align: "center" },
  );
}

// ─── MAIN EXPORT FUNCTION ────────────────────────────────────────────────────
export function generatePDF(details, byType, allRows, costs) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const TABS_META = [
    { id: "footing", icon: "[F]", label: "Footings" },
    { id: "column", icon: "[C]", label: "Columns" },
    { id: "plinthBeam", icon: "[PB]", label: "Plinth Beams" },
    { id: "wallBeam", icon: "[WB]", label: "Wall Beams" },
    { id: "slab", icon: "[S]", label: "Slabs" },
  ];

  const totalWt = allRows.reduce((s, r) => s + r.weight, 0);
  const totalCost = costs.reduce((s, r) => s + r.cost, 0);
  const totalRods = costs.reduce((s, r) => s + r.rods12m, 0);
  const elemTypes = byType.filter((t) => t.rows.length > 0).length;

  // ── PAGE 1: Cover + KPIs + Project Info ───────────────────────────────────
  drawPageHeader(doc, details, pageW, null);
  let y = 22;

  // Project info
  y = drawProjectInfo(doc, details, pageW, y);
  y += 4;

  // KPIs
  y = drawKPISummary(doc, totalWt, totalCost, totalRods, elemTypes, pageW, y);
  y += 4;

  // ── BBS sections (may span multiple pages) ─────────────────────────────────
  byType.forEach((t) => {
    if (!t.rows.length) return;
    const meta = TABS_META.find((m) => m.id === t.type);

    // Check space — new page if <40mm remaining
    if (y > pageH - 50) {
      doc.addPage();
      drawPageHeader(doc, details, pageW, null);
      y = 22;
    }

    y = drawBBSSection(doc, meta.label, meta.icon, t.rows, y, pageW, details);
  });

  // ── Cost summary ──────────────────────────────────────────────────────────
  if (y > pageH - 80) {
    doc.addPage();
    drawPageHeader(doc, details, pageW, null);
    y = 22;
  }
  y = drawCombinedSummary(doc, costs, pageW, y);

  // ── Signature block ───────────────────────────────────────────────────────
  if (y > pageH - 45) {
    doc.addPage();
    drawPageHeader(doc, details, pageW, null);
    y = 22;
  }
  drawSignatureBlock(doc, details, pageW, y + 4);

  // ── Add footers to all pages ───────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawPageFooter(doc, pageW, pageH, i, totalPages, details);
  }

  return doc;
}

// ─── DOWNLOAD PDF ─────────────────────────────────────────────────────────────
export function downloadPDF(details, byType, allRows, costs) {
  const doc = generatePDF(details, byType, allRows, costs);
  const fileName = `BBS_Report_${(details.projectName || "Project").replace(/\s+/g, "_")}_${details.date || ""}.pdf`;
  doc.save(fileName);
  return fileName;
}

// ─── SEND VIA WHATSAPP ────────────────────────────────────────────────────────
// WhatsApp Web can only share via URL with text. For PDF sharing:
// Step 1: Generate + download PDF locally
// Step 2: Open WhatsApp Web with pre-filled message + phone
// The user then manually attaches the downloaded PDF in WhatsApp
export function sendViaWhatsApp(details, byType, allRows, costs) {
  // First download the PDF
  const fileName = downloadPDF(details, byType, allRows, costs);

  const phone = `91${details.engineerPhone}`;
  const totalWt = allRows.reduce((s, r) => s + r.weight, 0).toFixed(1);
  const totalCost = costs.reduce((s, r) => s + r.cost, 0);

  const message = encodeURIComponent(
    `📐 *BBS Report Generated*

*Project:* ${details.projectName || "—"}
*Client:* ${details.clientName || "—"}
*Location:* ${details.location || "—"}
*Engineer:* ${details.engineerName || "—"}
*Date:* ${details.date || "—"}

*Total Steel:* ${totalWt} kg
*Total Cost (WB):* Rs.${totalCost.toLocaleString("en-IN")}

_File: ${fileName}_

📄 BBS Report attached. Please verify with structural drawings before procurement.
IS 456:2000 · IS 2502:1963`,
  );

  // Open WhatsApp Web — user attaches downloaded PDF
  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  return fileName;
}
