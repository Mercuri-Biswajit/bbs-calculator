// ─── IS 456:2000 + IS 2502:1963 CALCULATION ENGINE ───────────────────────────
// UPDATED: Added staircase, 1-way/2-way slabs, unit conversions, per-piece rates

export const BAR_WEIGHT = {
  6: 0.222,
  8: 0.395,
  10: 0.617,
  12: 0.888,
  16: 1.578,
  20: 2.469,
  25: 3.858,
  32: 6.313,
};
export const BAR_DIAS = [6, 8, 10, 12, 16, 20, 25, 32];

// 🆕 Per-piece rates for 12m standard rods (West Bengal market rates)
export const DEFAULT_RATES_PER_PIECE = {
  6: 160, // ₹160 per 12m rod
  8: 280, // ₹280 per 12m rod
  10: 440, // ₹440 per 12m rod
  12: 635, // ₹635 per 12m rod
  16: 1130, // ₹1130 per 12m rod
  20: 1775, // ₹1775 per 12m rod
  25: 2775, // ₹2775 per 12m rod
  32: 4550, // ₹4550 per 12m rod
};

// 🆕 Unit conversion factors to meters
export const UNIT_TO_METERS = {
  m: 1,
  mm: 0.001,
  ft: 0.3048,
  in: 0.0254,
};

export const UNITS = ["m", "mm", "ft", "in"];

// Helper: Convert to meters
export function toMeters(value, unit) {
  return parseFloat(value) * UNIT_TO_METERS[unit];
}

export const COVER_MM = {
  footing: 75, // IS 456 Cl.26.4.2.2
  column: 40, // IS 456 Cl.26.4.2.1
  plinthBeam: 40, // IS 456 Cl.26.4.2.1
  wallBeam: 25, // IS 456 Cl.26.4.2.1
  slab: 20, // IS 456 Cl.26.4.2.1
  staircase: 25, // IS 456 Cl.26.4.2.1
};

// IS 2502 standard hook = 9d (90° bend)
export const hookLen = (d) => (9 * d) / 1000;

// IS 456 Cl.26.2.1 — tension lap = 40d
export const lapLen = (d) => (40 * d) / 1000;

// Stirrup perimeter with 135° hooks at both ends
export const stirrupPerim = (b, d, cov) =>
  2 * (b - 2 * cov + (d - 2 * cov)) + 2 * hookLen(8) * 3;

// ─── FOOTING ────────────────────────────────────────────────────────────────
export function calcSingleFooting({
  L,
  B,
  mainDia,
  distDia,
  spacing,
  unit = "m",
}) {
  const l = toMeters(L, unit);
  const b = toMeters(B, unit);
  const sp = toMeters(spacing, "mm") / 1000;
  const md = +mainDia,
    dd = +distDia;
  const cov = COVER_MM.footing / 1000;

  const nMain = Math.ceil((b - 2 * cov) / sp) + 1;
  const nDist = Math.ceil((l - 2 * cov) / sp) + 1;
  const lenMain = l - 2 * cov + 2 * hookLen(md);
  const lenDist = b - 2 * cov + 2 * hookLen(dd);

  return [
    {
      mark: "A",
      desc: `Main Bars along L (φ${md}mm)`,
      nos: nMain,
      cutLen: +lenMain.toFixed(3),
      dia: md,
    },
    {
      mark: "B",
      desc: `Dist Bars along B (φ${dd}mm)`,
      nos: nDist,
      cutLen: +lenDist.toFixed(3),
      dia: dd,
    },
  ];
}

// ─── COLUMN ─────────────────────────────────────────────────────────────────
export function calcSingleColumn({
  H,
  B,
  D,
  mainDia,
  mainNos,
  tieDia,
  tieSpacing,
  unit = "m",
}) {
  const h = toMeters(H, unit);
  const b = toMeters(B, unit);
  const d = toMeters(D, unit);
  const md = +mainDia,
    td = +tieDia;
  const cov = COVER_MM.column / 1000;
  const sp = toMeters(tieSpacing, "mm") / 1000;

  const nTies = Math.ceil(h / sp) + 1;
  const mainLen = h + 2 * lapLen(md);
  const tieLen = stirrupPerim(b, d, cov);

  return [
    {
      mark: "A",
      desc: `Main Bars (φ${md}mm)`,
      nos: +mainNos,
      cutLen: +mainLen.toFixed(3),
      dia: md,
    },
    {
      mark: "B",
      desc: `Lateral Ties (φ${td}mm @${tieSpacing}mm)`,
      nos: nTies,
      cutLen: +tieLen.toFixed(3),
      dia: td,
    },
  ];
}

// ─── BEAM (plinth or wall) ───────────────────────────────────────────────────
export function calcSingleBeam(
  {
    L,
    B,
    D,
    botDia,
    botNos,
    topDia,
    topNos,
    exTopDia,
    exTopNos,
    stirDia,
    stirSpacing,
    unit = "m",
  },
  coverType,
) {
  const l = toMeters(L, unit);
  const b = toMeters(B, unit);
  const d = toMeters(D, unit);
  const cov = COVER_MM[coverType] / 1000;
  const sp = toMeters(stirSpacing, "mm") / 1000;

  const nStir = Math.ceil(l / sp) + 1;
  const stirLen = stirrupPerim(b, d, cov);

  const rows = [
    {
      mark: "A",
      desc: `Bottom Bars (φ${botDia}mm)`,
      nos: +botNos,
      cutLen: +(l + 2 * lapLen(+botDia)).toFixed(3),
      dia: +botDia,
    },
    {
      mark: "B",
      desc: `Top Bars (φ${topDia}mm)`,
      nos: +topNos,
      cutLen: +(l + 2 * lapLen(+topDia)).toFixed(3),
      dia: +topDia,
    },
  ];
  if (+exTopNos > 0) {
    rows.push({
      mark: "C",
      desc: `Extra Top at Supports (φ${exTopDia}mm)`,
      nos: +exTopNos,
      cutLen: +(l / 3 + 2 * lapLen(+exTopDia)).toFixed(3),
      dia: +exTopDia,
    });
  }
  rows.push({
    mark: "D",
    desc: `Stirrups (φ${stirDia}mm @${stirSpacing}mm c/c)`,
    nos: nStir,
    cutLen: +stirLen.toFixed(3),
    dia: +stirDia,
  });
  return rows;
}

// ─── SLAB (1-way or 2-way) ───────────────────────────────────────────────────
export function calcSingleSlab({
  L,
  B,
  mainDia,
  distDia,
  mainSp,
  distSp,
  topDia,
  topSp,
  slabType = "2-way",
  unit = "m",
}) {
  const l = toMeters(L, unit);
  const b = toMeters(B, unit);
  const cov = COVER_MM.slab / 1000;

  const is1Way = slabType === "1-way" || l / b > 2; // 1-way if Ly/Lx > 2

  const nMain = Math.ceil((b - 2 * cov) / toMeters(mainSp, "mm")) + 1;
  const nDist = Math.ceil((l - 2 * cov) / toMeters(distSp, "mm")) + 1;
  const lenMain = l - 2 * cov + 2 * hookLen(+mainDia);
  const lenDist = b - 2 * cov + 2 * hookLen(+distDia);

  const rows = [
    {
      mark: "A",
      desc: `Main Bars - ${is1Way ? "Short span" : "Both ways"} (φ${mainDia}mm @${mainSp}mm)`,
      nos: nMain,
      cutLen: +lenMain.toFixed(3),
      dia: +mainDia,
    },
    {
      mark: "B",
      desc: `Dist Bars - ${is1Way ? "Long span" : "Both ways"} (φ${distDia}mm @${distSp}mm)`,
      nos: nDist,
      cutLen: +lenDist.toFixed(3),
      dia: +distDia,
    },
  ];

  if (+topSp > 0 && topDia) {
    const nTop = Math.ceil((b - 2 * cov) / toMeters(topSp, "mm")) + 1;
    const lenTop = (l / 5) * 2 + 2 * hookLen(+topDia);
    rows.push({
      mark: "C",
      desc: `Top Bars @ supports (φ${topDia}mm @${topSp}mm)`,
      nos: nTop,
      cutLen: +lenTop.toFixed(3),
      dia: +topDia,
    });
  }
  return rows;
}

// 🆕 ─── STAIRCASE ─────────────────────────────────────────────────────────────
export function calcSingleStaircase({
  flightLen, // Length of flight
  width, // Width of staircase
  waistThick, // Waist slab thickness
  mainDia, // Main bars (along flight)
  mainSp, // Main bar spacing
  distDia, // Distribution bars (across width)
  distSp, // Dist bar spacing
  unit = "m",
}) {
  const l = toMeters(flightLen, unit);
  const w = toMeters(width, unit);
  const cov = COVER_MM.staircase / 1000;

  // Main bars along the flight length
  const nMain = Math.ceil((w - 2 * cov) / toMeters(mainSp, "mm")) + 1;
  const lenMain = l + 2 * lapLen(+mainDia);

  // Distribution bars across width
  const nDist = Math.ceil((l - 2 * cov) / toMeters(distSp, "mm")) + 1;
  const lenDist = w - 2 * cov + 2 * hookLen(+distDia);

  return [
    {
      mark: "A",
      desc: `Main Bars along flight (φ${mainDia}mm @${mainSp}mm)`,
      nos: nMain,
      cutLen: +lenMain.toFixed(3),
      dia: +mainDia,
    },
    {
      mark: "B",
      desc: `Distribution Bars (φ${distDia}mm @${distSp}mm)`,
      nos: nDist,
      cutLen: +lenDist.toFixed(3),
      dia: +distDia,
    },
  ];
}

// ─── BUILD FULL BBS WITH WEIGHTS ─────────────────────────────────────────────
export function buildBBS(rows) {
  return rows.map((r) => ({
    ...r,
    totalLen: +(r.nos * r.cutLen).toFixed(3),
    weight: +(r.nos * r.cutLen * (BAR_WEIGHT[r.dia] || 0)).toFixed(2),
  }));
}

// ─── AGGREGATE MULTIPLE ITEMS ─────────────────────────────────────────────────
export function aggregateBBS(allItems) {
  const combined = [];
  allItems.forEach(({ label, count, bbs }) => {
    bbs.forEach((row) => {
      combined.push({
        ...row,
        nos: row.nos * count,
        totalLen: +(row.nos * count * row.cutLen).toFixed(3),
        weight: +(
          row.nos *
          count *
          row.cutLen *
          (BAR_WEIGHT[row.dia] || 0)
        ).toFixed(2),
        sourceLabel: label,
        count,
      });
    });
  });
  return combined;
}

// 🆕 ─── COST SUMMARY (PER-PIECE RATES) ───────────────────────────────────────
export function costSummary(bbs, ratesPerPiece) {
  const byDia = {};
  bbs.forEach((r) => {
    byDia[r.dia] = (byDia[r.dia] || 0) + r.weight;
  });

  return Object.entries(byDia)
    .sort(([a], [b]) => +a - +b)
    .map(([dia, kg]) => {
      const totalLen = +(kg / (BAR_WEIGHT[dia] || 1)).toFixed(2);
      const rods12m = Math.ceil(totalLen / 12);
      const ratePerPiece = ratesPerPiece[dia] || 0;
      const cost = rods12m * ratePerPiece;

      return {
        dia: +dia,
        kg: +kg.toFixed(2),
        totalLen,
        rods12m,
        ratePerPiece,
        cost: +cost.toFixed(0),
      };
    });
}

// 🆕 ─── GENERATE BAR PURCHASE ORDER MESSAGE ──────────────────────────────────
export function generateBarPurchaseMessage(costs, details) {
  const totalRods = costs.reduce((s, r) => s + r.rods12m, 0);
  const totalCost = costs.reduce((s, r) => s + r.cost, 0);

  let message = `📦 *BAR PURCHASE ORDER*\n\n`;
  message += `*Project:* ${details.projectName || "—"}\n`;
  message += `*Location:* ${details.location || "—"}\n`;
  message += `*Date:* ${details.date || new Date().toISOString().split("T")[0]}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*BARS REQUIRED (12m STD RODS)*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  costs.forEach((c) => {
    message += `φ${c.dia}mm: *${c.rods12m} rods* (${c.kg} kg)\n`;
    message += `   @ ₹${c.ratePerPiece}/piece = ₹${c.cost.toLocaleString("en-IN")}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*TOTAL: ${totalRods} rods*\n`;
  message += `*TOTAL COST: ₹${totalCost.toLocaleString("en-IN")}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `_Please confirm availability and delivery date._\n\n`;
  message += `Contact: ${details.engineerName || "—"}\n`;
  if (details.engineerPhone) message += `Phone: +91 ${details.engineerPhone}`;

  return message;
}
