// ─── IS 456:2000 + IS 2502:1963 CALCULATION ENGINE ───────────────────────────

export const BAR_WEIGHT = { 6:0.222, 8:0.395, 10:0.617, 12:0.888, 16:1.578, 20:2.469, 25:3.858, 32:6.313 };
export const BAR_DIAS   = [6, 8, 10, 12, 16, 20, 25, 32];
export const DEFAULT_RATES = { 6:60, 8:58, 10:57, 12:56, 16:55, 20:54, 25:53, 32:52 };

export const COVER_MM = {
  footing:    75,   // IS 456 Cl.26.4.2.2
  column:     40,   // IS 456 Cl.26.4.2.1
  plinthBeam: 40,   // IS 456 Cl.26.4.2.1
  wallBeam:   25,   // IS 456 Cl.26.4.2.1
  slab:       20,   // IS 456 Cl.26.4.2.1
};

// IS 2502 standard hook = 9d (90° bend)
export const hookLen = (d) => 9 * d / 1000;

// IS 456 Cl.26.2.1 — tension lap = 40d
export const lapLen  = (d) => 40 * d / 1000;

// Stirrup perimeter with 135° hooks at both ends
export const stirrupPerim = (b, d, cov) =>
  2 * ((b - 2 * cov) + (d - 2 * cov)) + 2 * hookLen(8) * 3;

// ─── FOOTING ────────────────────────────────────────────────────────────────
export function calcSingleFooting({ L, B, mainDia, distDia, spacing }) {
  const l = +L, b = +B, sp = +spacing / 1000;
  const md = +mainDia, dd = +distDia;
  const cov = COVER_MM.footing / 1000;

  const nMain = Math.ceil((b - 2 * cov) / sp) + 1;
  const nDist = Math.ceil((l - 2 * cov) / sp) + 1;
  const lenMain = l - 2 * cov + 2 * hookLen(md);
  const lenDist = b - 2 * cov + 2 * hookLen(dd);

  return [
    { mark:"A", desc:`Main Bars along L (φ${md}mm)`, nos: nMain, cutLen: +lenMain.toFixed(3), dia: md },
    { mark:"B", desc:`Dist Bars along B (φ${dd}mm)`, nos: nDist, cutLen: +lenDist.toFixed(3), dia: dd },
  ];
}

// ─── COLUMN ─────────────────────────────────────────────────────────────────
export function calcSingleColumn({ H, B, D, mainDia, mainNos, tieDia, tieSpacing }) {
  const h = +H, b = +B, d = +D;
  const md = +mainDia, td = +tieDia;
  const cov = COVER_MM.column / 1000;
  const sp  = +tieSpacing / 1000;

  // IS 456 Cl.26.5.3.2 — tie spacing ≤ min(least lat dim, 16Φ, 300mm)
  const nTies = Math.ceil(h / sp) + 1;
  const mainLen = h + 2 * lapLen(md);
  const tieLen  = stirrupPerim(b, d, cov);

  return [
    { mark:"A", desc:`Main Bars (φ${md}mm)`,               nos: +mainNos, cutLen: +mainLen.toFixed(3), dia: md },
    { mark:"B", desc:`Lateral Ties (φ${td}mm @${tieSpacing}mm)`, nos: nTies,    cutLen: +tieLen.toFixed(3),  dia: td },
  ];
}

// ─── BEAM (plinth or wall) ───────────────────────────────────────────────────
export function calcSingleBeam({ L, B, D, botDia, botNos, topDia, topNos, exTopDia, exTopNos, stirDia, stirSpacing }, coverType) {
  const l = +L, b = +B, d = +D;
  const cov = COVER_MM[coverType] / 1000;
  const sp  = +stirSpacing / 1000;

  const nStir   = Math.ceil(l / sp) + 1;
  const stirLen = stirrupPerim(b, d, cov);

  const rows = [
    { mark:"A", desc:`Bottom Bars (φ${botDia}mm)`,           nos: +botNos,    cutLen: +(l + 2*lapLen(+botDia)).toFixed(3),  dia: +botDia },
    { mark:"B", desc:`Top Bars (φ${topDia}mm)`,              nos: +topNos,    cutLen: +(l + 2*lapLen(+topDia)).toFixed(3),  dia: +topDia },
  ];
  if (+exTopNos > 0) {
    rows.push({ mark:"C", desc:`Extra Top at Supports (φ${exTopDia}mm)`, nos: +exTopNos, cutLen: +(l/3 + 2*lapLen(+exTopDia)).toFixed(3), dia: +exTopDia });
  }
  rows.push({ mark:"D", desc:`Stirrups (φ${stirDia}mm @${stirSpacing}mm c/c)`, nos: nStir, cutLen: +stirLen.toFixed(3), dia: +stirDia });
  return rows;
}

// ─── SLAB ────────────────────────────────────────────────────────────────────
export function calcSingleSlab({ L, B, mainDia, distDia, mainSp, distSp, topDia, topSp }) {
  const l = +L, b = +B;
  const cov = COVER_MM.slab / 1000;

  const nMain = Math.ceil((b - 2*cov) / (+mainSp/1000)) + 1;
  const nDist = Math.ceil((l - 2*cov) / (+distSp/1000)) + 1;
  const lenMain = l - 2*cov + 2*hookLen(+mainDia);
  const lenDist = b - 2*cov + 2*hookLen(+distDia);

  const rows = [
    { mark:"A", desc:`Main Bars (φ${mainDia}mm @${mainSp}mm c/c)`, nos: nMain, cutLen: +lenMain.toFixed(3), dia: +mainDia },
    { mark:"B", desc:`Dist Bars (φ${distDia}mm @${distSp}mm c/c)`, nos: nDist, cutLen: +lenDist.toFixed(3), dia: +distDia },
  ];
  if (+topSp > 0 && topDia) {
    const nTop = Math.ceil((b - 2*cov) / (+topSp/1000)) + 1;
    const lenTop = (l/5)*2 + 2*hookLen(+topDia);
    rows.push({ mark:"C", desc:`Top Bars @ supports (φ${topDia}mm @${topSp}mm)`, nos: nTop, cutLen: +lenTop.toFixed(3), dia: +topDia });
  }
  return rows;
}

// ─── BUILD FULL BBS WITH WEIGHTS ─────────────────────────────────────────────
export function buildBBS(rows) {
  return rows.map(r => ({
    ...r,
    totalLen: +(r.nos * r.cutLen).toFixed(3),
    weight:   +(r.nos * r.cutLen * (BAR_WEIGHT[r.dia] || 0)).toFixed(2),
  }));
}

// ─── AGGREGATE MULTIPLE ITEMS ─────────────────────────────────────────────────
export function aggregateBBS(allItems) {
  // allItems: [{ label, count, bbs }]
  const combined = [];
  allItems.forEach(({ label, count, bbs }) => {
    bbs.forEach(row => {
      combined.push({
        ...row,
        nos:      row.nos * count,
        totalLen: +(row.nos * count * row.cutLen).toFixed(3),
        weight:   +(row.nos * count * row.cutLen * (BAR_WEIGHT[row.dia] || 0)).toFixed(2),
        sourceLabel: label,
        count,
      });
    });
  });
  return combined;
}

// ─── COST SUMMARY ────────────────────────────────────────────────────────────
export function costSummary(bbs, rates) {
  const byDia = {};
  bbs.forEach(r => {
    byDia[r.dia] = (byDia[r.dia] || 0) + r.weight;
  });
  return Object.entries(byDia)
    .sort(([a],[b]) => +a - +b)
    .map(([dia, kg]) => ({
      dia: +dia,
      kg:  +kg.toFixed(2),
      totalLen: +(kg / (BAR_WEIGHT[dia] || 1)).toFixed(2),
      rods12m:  Math.ceil(kg / (BAR_WEIGHT[dia] || 1) / 12),
      rate:     rates[dia] || 0,
      cost:     +(kg * (rates[dia] || 0)).toFixed(0),
    }));
}
