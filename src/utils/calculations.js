// src/utils/calculations.js
// ─── IS 456:2000 + IS 2502:1963 CALCULATION ENGINE ───────────────────────────

export const BAR_WEIGHT = { 6: 0.222, 8: 0.395, 10: 0.617, 12: 0.888, 16: 1.578, 20: 2.469, 25: 3.858, 32: 6.313 };
export const BAR_DIAS   = [6, 8, 10, 12, 16, 20, 25, 32];

export const DEFAULT_RATES_PER_PIECE = { 6: 160, 8: 280, 10: 440, 12: 635, 16: 1130, 20: 1775, 25: 2775, 32: 4550 };

export const COVER_MM = { footing: 75, column: 40, plinthBeam: 40, wallBeam: 25, slab: 20, staircase: 25 };

export const hookLen     = (d) => (9  * d) / 1000;
export const lapLen      = (d) => (40 * d) / 1000;
export const stirrupPerim = (b, d, cov) => 2 * (b - 2 * cov + (d - 2 * cov)) + 2 * hookLen(8) * 3;

// ─── FOOTING ──────────────────────────────────────────────────────────────────
export function calcSingleFooting({ L, B, mainDia, distDia, spacing }) {
  const l = parseFloat(L), b = parseFloat(B);
  const sp = parseFloat(spacing) / 1000;
  const md = +mainDia, dd = +distDia;
  const cov = COVER_MM.footing / 1000;

  const nMain = Math.floor((b - 2 * cov) / sp) + 1;
  const nDist = Math.floor((l - 2 * cov) / sp) + 1;
  const lenMain = l - 2 * cov + 2 * hookLen(md);
  const lenDist = b - 2 * cov + 2 * hookLen(dd);

  return [
    { mark: "A", desc: `Main Bars along L (φ${md}mm)`, nos: nMain, cutLen: +lenMain.toFixed(3), dia: md },
    { mark: "B", desc: `Dist Bars along B (φ${dd}mm)`, nos: nDist, cutLen: +lenDist.toFixed(3), dia: dd },
  ];
}

// ─── COLUMN ───────────────────────────────────────────────────────────────────
export function calcSingleColumn({ H, B, D, mainDia, mainNos, tieDia, tieSpacing }) {
  const h = parseFloat(H), b = parseFloat(B), d = parseFloat(D);
  const md = +mainDia, td = +tieDia;
  const cov = COVER_MM.column / 1000;
  const sp  = parseFloat(tieSpacing) / 1000;

  const nTies  = Math.ceil(h / sp) + 1;
  const mainLen = h + 2 * lapLen(md);
  const tieLen  = stirrupPerim(b, d, cov);

  return [
    { mark: "A", desc: `Main Bars (φ${md}mm)`,                         nos: +mainNos, cutLen: +mainLen.toFixed(3), dia: md },
    { mark: "B", desc: `Lateral Ties (φ${td}mm @${tieSpacing}mm)`,     nos: nTies,   cutLen: +tieLen.toFixed(3),  dia: td },
  ];
}

// ─── BEAM ─────────────────────────────────────────────────────────────────────
export function calcSingleBeam({ L, B, D, botDia, botNos, topDia, topNos, exTopDia, exTopNos, stirDia, stirSpacing }, coverType) {
  const l = parseFloat(L), b = parseFloat(B), d = parseFloat(D);
  const cov = COVER_MM[coverType] / 1000;
  const sp  = parseFloat(stirSpacing) / 1000;

  const nStir  = Math.ceil(l / sp) + 1;
  const stirLen = stirrupPerim(b, d, cov);

  const rows = [
    { mark: "A", desc: `Bottom Bars (φ${botDia}mm)`, nos: +botNos, cutLen: +(l + 2 * lapLen(+botDia)).toFixed(3), dia: +botDia },
    { mark: "B", desc: `Top Bars (φ${topDia}mm)`,    nos: +topNos, cutLen: +(l + 2 * lapLen(+topDia)).toFixed(3), dia: +topDia },
  ];
  if (+exTopNos > 0) {
    rows.push({ mark: "C", desc: `Extra Top at Supports (φ${exTopDia}mm)`, nos: +exTopNos, cutLen: +(l / 3 + 2 * lapLen(+exTopDia)).toFixed(3), dia: +exTopDia });
  }
  rows.push({ mark: "D", desc: `Stirrups (φ${stirDia}mm @${stirSpacing}mm c/c)`, nos: nStir, cutLen: +stirLen.toFixed(3), dia: +stirDia });
  return rows;
}

// ─── SLAB ─────────────────────────────────────────────────────────────────────
export function calcSingleSlab({ L, B, mainDia, distDia, mainSp, distSp, topDia, topSp, slabType = "2-way" }) {
  const l = parseFloat(L), b = parseFloat(B);
  const cov   = COVER_MM.slab / 1000;
  const is1Way = slabType === "1-way" || l / b > 2;
  const msp = parseFloat(mainSp) / 1000;
  const dsp = parseFloat(distSp) / 1000;

  const nMain = Math.floor((b - 2 * cov) / msp) + 1;
  const nDist = Math.floor((l - 2 * cov) / dsp) + 1;
  const lenMain = l - 2 * cov + 2 * hookLen(+mainDia);
  const lenDist = b - 2 * cov + 2 * hookLen(+distDia);

  const rows = [
    { mark: "A", nos: nMain, cutLen: +lenMain.toFixed(3), dia: +mainDia, desc: `Main Bars — ${is1Way ? "Short span" : "Both ways"} (φ${mainDia}mm @${mainSp}mm)` },
    { mark: "B", nos: nDist, cutLen: +lenDist.toFixed(3), dia: +distDia, desc: `Dist Bars — ${is1Way ? "Long span"  : "Both ways"} (φ${distDia}mm @${distSp}mm)` },
  ];
  if (+topSp > 0 && topDia) {
    const tsp = parseFloat(topSp) / 1000;
    const nTop   = Math.floor((b - 2 * cov) / tsp) + 1;
    const lenTop = (l / 5) * 2 + 2 * hookLen(+topDia);
    rows.push({ mark: "C", nos: nTop, cutLen: +lenTop.toFixed(3), dia: +topDia, desc: `Top Bars @ supports (φ${topDia}mm @${topSp}mm)` });
  }
  return rows;
}

// ─── STAIRCASE ────────────────────────────────────────────────────────────────
export function calcSingleStaircase({ flightLen, width, waistThick, mainDia, mainSp, distDia, distSp }) {
  const l = parseFloat(flightLen), w = parseFloat(width);
  const cov = COVER_MM.staircase / 1000;
  const msp = parseFloat(mainSp) / 1000;
  const dsp = parseFloat(distSp) / 1000;

  const nMain  = Math.floor((w - 2 * cov) / msp) + 1;
  const lenMain = l + 2 * lapLen(+mainDia);
  const nDist  = Math.floor((l - 2 * cov) / dsp) + 1;
  const lenDist = w - 2 * cov + 2 * hookLen(+distDia);

  return [
    { mark: "A", nos: nMain, cutLen: +lenMain.toFixed(3), dia: +mainDia, desc: `Main Bars along flight (φ${mainDia}mm @${mainSp}mm)` },
    { mark: "B", nos: nDist, cutLen: +lenDist.toFixed(3), dia: +distDia, desc: `Distribution Bars (φ${distDia}mm @${distSp}mm)` },
  ];
}

// ─── BUILD BBS ────────────────────────────────────────────────────────────────
export function buildBBS(rows) {
  return rows.map(r => ({
    ...r,
    totalLen: +(r.nos * r.cutLen).toFixed(3),
    weight:   +(r.nos * r.cutLen * (BAR_WEIGHT[r.dia] || 0)).toFixed(2),
  }));
}

// ─── AGGREGATE ────────────────────────────────────────────────────────────────
export function aggregateBBS(allItems) {
  const combined = [];
  allItems.forEach(({ label, count, bbs }) => {
    bbs.forEach(row => {
      combined.push({
        ...row,
        nos:        row.nos * count,
        totalLen:   +(row.nos * count * row.cutLen).toFixed(3),
        weight:     +(row.nos * count * row.cutLen * (BAR_WEIGHT[row.dia] || 0)).toFixed(2),
        sourceLabel: label,
        count,
      });
    });
  });
  return combined;
}

// ─── COST SUMMARY ─────────────────────────────────────────────────────────────
export function costSummary(bbs, ratesPerPiece) {
  const byDia = {};
  bbs.forEach(r => { byDia[r.dia] = (byDia[r.dia] || 0) + r.weight; });

  return Object.entries(byDia)
    .sort(([a], [b]) => +a - +b)
    .map(([dia, kg]) => {
      const totalLen    = +(kg / (BAR_WEIGHT[dia] || 1)).toFixed(2);
      const rods12m     = Math.ceil(totalLen / 12);
      const ratePerPiece = ratesPerPiece[dia] || 0;
      const cost        = rods12m * ratePerPiece;
      return { dia: +dia, kg: +kg.toFixed(2), totalLen, rods12m, ratePerPiece, cost: +cost.toFixed(0) };
    });
}

// ─── WHATSAPP BAR PURCHASE MESSAGE ────────────────────────────────────────────
export function generateBarPurchaseMessage(costs, details) {
  const totalRods = costs.reduce((s, r) => s + r.rods12m, 0);
  const totalCost = costs.reduce((s, r) => s + r.cost, 0);
  let msg = `📦 *BAR PURCHASE ORDER*\n\n`;
  msg += `*Project:* ${details.projectName || "—"}\n`;
  msg += `*Location:* ${details.location || "—"}\n`;
  msg += `*Date:* ${details.date || new Date().toISOString().split("T")[0]}\n\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n*BARS REQUIRED (12m STD RODS)*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
  costs.forEach(c => {
    msg += `φ${c.dia}mm: *${c.rods12m} rods* (${c.kg} kg)\n`;
    msg += `   @ ₹${c.ratePerPiece}/piece = ₹${c.cost.toLocaleString("en-IN")}\n\n`;
  });
  msg += `━━━━━━━━━━━━━━━━━━━━\n*TOTAL: ${totalRods} rods*\n*TOTAL COST: ₹${totalCost.toLocaleString("en-IN")}*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `_Please confirm availability and delivery date._\n\nContact: ${details.engineerName || "—"}\n`;
  if (details.engineerPhone) msg += `Phone: +91 ${details.engineerPhone}`;
  return msg;
}
