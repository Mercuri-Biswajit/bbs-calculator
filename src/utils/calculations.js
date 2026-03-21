// src/utils/calculations.js
// ─── IS 456:2000 + IS 2502:1963 CALCULATION ENGINE ───────────────────────────

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

export const DEFAULT_RATES_PER_PIECE = {
  6: 160,
  8: 280,
  10: 440,
  12: 635,
  16: 1130,
  20: 1775,
  25: 2775,
  32: 4550,
};

export const COVER_MM = {
  footing: 75,
  column: 40,
  plinthBeam: 40,
  wallBeam: 25,
  slab: 20,
  staircase: 25,
  lintel: 25,
  chajja: 20,
  raft: 75,
  pileCap: 75,
};

export const hookLen = (d) => (9 * d) / 1000;
export const lapLen = (d) => (40 * d) / 1000;

// FIX #1 — stirrupPerim: a rectangular stirrup has perimeter = 2*(innerB + innerD)
// plus exactly 2 hooks (one at each end of the bar). The old formula used "* 3"
// which was wrong — a stirrup has 2 hooks, not 6.
export const stirrupPerim = (b, d, cov, stirDia = 8) =>
  2 * (b - 2 * cov + (d - 2 * cov)) + 2 * hookLen(stirDia);

// ─── FOOTING ──────────────────────────────────────────────────────────────────
export function calcSingleFooting({
  L,
  B,
  mainDia,
  distDia,
  spacing,
  stubH,
  colDia,
  colNos,
}) {
  const l = parseFloat(L),
    b = parseFloat(B);
  const sp = parseFloat(spacing) / 1000;
  const md = +mainDia,
    dd = +distDia;
  const cov = COVER_MM.footing / 1000;

  const nMain = Math.floor((b - 2 * cov) / sp) + 1;
  const nDist = Math.floor((l - 2 * cov) / sp) + 1;
  const lenMain = l - 2 * cov + 2 * hookLen(md);
  const lenDist = b - 2 * cov + 2 * hookLen(dd);

  const rows = [
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

  // ── Stub Column / Pedestal + Starter Dowels ───────────────────────────────
  if (stubH && +stubH > 0 && colDia && colNos) {
    const sh = parseFloat(stubH);
    const cd = +colDia;
    const cn = +colNos;
    const starterLen = lapLen(cd) + sh + lapLen(cd);
    const stubTieDia = 8;
    const stubTieSp = 0.15;
    const nStubTies = Math.ceil(sh / stubTieSp) + 1;
    const colCov = COVER_MM.column / 1000;
    // FIX #1 applies here too — stirrupPerim now uses correct 2-hook formula
    const stubTieLen = stirrupPerim(0.3, 0.3, colCov, stubTieDia);

    rows.push({
      mark: "C",
      desc: `Starter / Dowel Bars — Footing top to PB soffit (φ${cd}mm) [Lap 40d↓ + ${sh.toFixed(2)}m stub + Lap 40d↑]`,
      nos: cn,
      cutLen: +starterLen.toFixed(3),
      dia: cd,
    });
    rows.push({
      mark: "D",
      desc: `Stub Column Ties (φ${stubTieDia}mm @150mm) — ${sh.toFixed(2)}m stub height`,
      nos: nStubTies,
      cutLen: +stubTieLen.toFixed(3),
      dia: stubTieDia,
    });
  }

  return rows;
}

// ─── COLUMN ───────────────────────────────────────────────────────────────────
export function calcSingleColumn({
  H,
  B,
  D,
  mainDia,
  mainNos,
  tieDia,
  tieSpacing,
  shape,
  colDia,
}) {
  const h = parseFloat(H);
  const md = +mainDia,
    td = +tieDia;
  const sp = parseFloat(tieSpacing) / 1000;
  const isCircular = shape === "circular";

  // FIX #2 — Column main bars: add lap at TOP only (column-to-column splice).
  const mainLen = h + lapLen(md);

  if (isCircular) {
    const dia = parseFloat(colDia) || 0.3;
    const cov = COVER_MM.column / 1000;
    const nSpirals = Math.ceil(h / sp) + 1;
    // Spiral tie = circumference of circle at (D - 2*cover) + 2 hooks
    const spiralPerim = Math.PI * (dia - 2 * cov) + 2 * hookLen(td);
    return [
      {
        mark: "A",
        desc: `Main Bars (φ${md}mm) — Circular Φ${(dia * 1000).toFixed(0)}mm`,
        nos: +mainNos,
        cutLen: +mainLen.toFixed(3),
        dia: md,
      },
      {
        mark: "B",
        desc: `Spiral Ties (φ${td}mm @${tieSpacing}mm pitch) [IS 456 Cl.26.5.3.2]`,
        nos: nSpirals,
        cutLen: +spiralPerim.toFixed(3),
        dia: td,
      },
    ];
  }

  // Rectangular
  const b = parseFloat(B),
    d = parseFloat(D);
  const cov = COVER_MM.column / 1000;
  const nTies = Math.ceil(h / sp) + 1;
  // FIX #1 — pass actual tieDia to stirrupPerim
  const tieLen = stirrupPerim(b, d, cov, td);

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


// ─── BEAM ─────────────────────────────────────────────────────────────────────
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
    hasTorsion,
    torsDia,
    torsNos,
  },
  coverType,
) {
  const l = parseFloat(L),
    b = parseFloat(B),
    d = parseFloat(D);
  const cov = COVER_MM[coverType] / 1000;
  const sp = parseFloat(stirSpacing) / 1000;

  const nStirDense = Math.ceil(l / 4 / (sp / 2)) + 1;
  const nStirNormal = Math.ceil(l / 2 / sp) + 1;
  // FIX #1 — stirrupPerim now uses correct 2-hook formula
  const stirLen = stirrupPerim(b, d, cov, +stirDia);

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
      desc: `Extra Top — Curtailed @ L/3 from support (φ${exTopDia}mm)`,
      nos: +exTopNos,
      cutLen: +(l / 3 + 2 * lapLen(+exTopDia)).toFixed(3),
      dia: +exTopDia,
    });
  }
  if (hasTorsion && +torsNos > 0) {
    rows.push({
      mark: "T",
      desc: `Torsion Bars — Corner (φ${torsDia}mm)`,
      nos: +torsNos,
      cutLen: +(l + 2 * lapLen(+torsDia)).toFixed(3),
      dia: +torsDia,
    });
  }
  rows.push({
    mark: "D",
    desc: `Stirrups Dense Zone (φ${stirDia}mm @${Math.round(+stirSpacing / 2)}mm — L/4 each end)`,
    nos: nStirDense * 2,
    cutLen: +stirLen.toFixed(3),
    dia: +stirDia,
  });
  rows.push({
    mark: "E",
    desc: `Stirrups Normal Zone (φ${stirDia}mm @${stirSpacing}mm — middle L/2)`,
    nos: nStirNormal,
    cutLen: +stirLen.toFixed(3),
    dia: +stirDia,
  });
  return rows;
}

// ─── SLAB ─────────────────────────────────────────────────────────────────────
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
}) {
  const l = parseFloat(L),
    b = parseFloat(B);
  const cov = COVER_MM.slab / 1000;
  const is1Way = slabType === "1-way" || l / b > 2;
  const msp = parseFloat(mainSp) / 1000;
  const dsp = parseFloat(distSp) / 1000;

  const nMain = Math.floor((b - 2 * cov) / msp) + 1;
  const nDist = Math.floor((l - 2 * cov) / dsp) + 1;
  const lenMain = l - 2 * cov + 2 * hookLen(+mainDia);
  const lenDist = b - 2 * cov + 2 * hookLen(+distDia);

  const rows = [
    {
      mark: "A",
      nos: nMain,
      cutLen: +lenMain.toFixed(3),
      dia: +mainDia,
      desc: `Main Bars — ${is1Way ? "Short span" : "Both ways"} (φ${mainDia}mm @${mainSp}mm)`,
    },
    {
      mark: "B",
      nos: nDist,
      cutLen: +lenDist.toFixed(3),
      dia: +distDia,
      desc: `Dist Bars — ${is1Way ? "Long span" : "Both ways"} (φ${distDia}mm @${distSp}mm)`,
    },
  ];
  if (+topSp > 0 && topDia) {
    const tsp = parseFloat(topSp) / 1000;
    const nTop = Math.floor((b - 2 * cov) / tsp) + 1;
    const lenTop = (l / 5) * 2 + 2 * hookLen(+topDia);
    rows.push({
      mark: "C",
      nos: nTop,
      cutLen: +lenTop.toFixed(3),
      dia: +topDia,
      desc: `Top Bars @ supports — Curtailed L/5 (φ${topDia}mm @${topSp}mm)`,
    });
  }
  return rows;
}

// ─── STAIRCASE ────────────────────────────────────────────────────────────────
// FIX #3 — waistThick is now used to calculate the actual inclined bar length.
// Inclined length = sqrt(planLength² + riseHeight²). Since rise ≈ planLength/2
// (typical 1:2 rise:run), riseHeight ≈ planLength/2. waistThick contributes to
// the slab depth but does not change the plan length. We calculate:
//   inclined ≈ sqrt(flightLen² + (flightLen/2)²) = flightLen × sqrt(1.25) ≈ 1.118×
// The waist thickness adds a small extra at each end for the landing hook:
//   extra = sqrt(2) × waistThick (bar bends at ~45° into landing)
export function calcSingleStaircase({
  flightLen,
  width,
  waistThick,
  mainDia,
  mainSp,
  distDia,
  distSp,
}) {
  const l = parseFloat(flightLen);
  const w = parseFloat(width);
  const wt = parseFloat(waistThick) || 0.15;
  const cov = COVER_MM.staircase / 1000;
  const msp = parseFloat(mainSp) / 1000;
  const dsp = parseFloat(distSp) / 1000;

  // FIX #3 — use waistThick in the inclined length calculation:
  // slope factor from typical 1:2 rise:run = sqrt(1 + 0.5²) ≈ 1.118
  const slopeFactor = Math.sqrt(1 + 0.25); // = sqrt(1.25) ≈ 1.118
  // landing hooks: bar bends ~45° for waistThick depth at each end
  const landingExtra = Math.sqrt(2) * wt;
  const inclinedLen = l * slopeFactor + landingExtra + 2 * lapLen(+mainDia);

  const nMain = Math.floor((w - 2 * cov) / msp) + 1;
  const lenMain = +inclinedLen.toFixed(3);

  const nDist = Math.floor((l - 2 * cov) / dsp) + 1;
  const lenDist = +(w - 2 * cov + 2 * hookLen(+distDia)).toFixed(3);

  return [
    {
      mark: "A",
      nos: nMain,
      cutLen: lenMain,
      dia: +mainDia,
      desc: `Main Bars along flight — inclined (φ${mainDia}mm @${mainSp}mm, waist: ${wt * 1000}mm, slope factor: ${slopeFactor.toFixed(3)})`,
    },
    {
      mark: "B",
      nos: nDist,
      cutLen: lenDist,
      dia: +distDia,
      desc: `Distribution Bars (φ${distDia}mm @${distSp}mm)`,
    },
  ];
}

// ─── LINTEL / CHAJJA ─────────────────────────────────────────────────────────
// FIX #4 — Chajja distribution bars run along the lintel span (L direction),
// so their count is based on chajjaL (projection), not lintel span L.
// Main bars are cantilever rods spaced along L (nChMain uses L).
// Dist bars span across the chajja width = along lintel span L,
// their count uses chajjaL / spacing.
export function calcSingleLintel({
  L,
  B,
  D,
  botDia,
  botNos,
  topDia,
  topNos,
  stirDia,
  stirSpacing,
  hasChajja,
  chajjaL,
  chajjaD,
  chajjaDia,
  chajjaSp,
}) {
  const l = parseFloat(L),
    b = parseFloat(B),
    d = parseFloat(D);
  const cov = COVER_MM.lintel / 1000;
  const sp = parseFloat(stirSpacing) / 1000;
  const nStir = Math.ceil(l / sp) + 1;
  // FIX #1 — stirrupPerim uses corrected 2-hook formula
  const stirLen = stirrupPerim(b, d, cov, +stirDia);

  const rows = [
    {
      mark: "A",
      desc: `Bottom Bars (φ${botDia}mm)`,
      nos: +botNos,
      cutLen: +(l + 2 * hookLen(+botDia)).toFixed(3),
      dia: +botDia,
    },
    {
      mark: "B",
      desc: `Top Bars (φ${topDia}mm)`,
      nos: +topNos,
      cutLen: +(l + 2 * hookLen(+topDia)).toFixed(3),
      dia: +topDia,
    },
    {
      mark: "C",
      desc: `Stirrups (φ${stirDia}mm @${stirSpacing}mm)`,
      nos: nStir,
      cutLen: +stirLen.toFixed(3),
      dia: +stirDia,
    },
  ];

  if (hasChajja) {
    const cl = parseFloat(chajjaL) || 0.6;
    const csp = parseFloat(chajjaSp) / 1000;
    const chajjaCov = COVER_MM.chajja / 1000;

    // Main (cantilever) bars: spaced along lintel span L, run in projection direction
    const nChMain = Math.floor((l - 2 * chajjaCov) / csp) + 1;
    const lenChMain = cl + hookLen(+chajjaDia) + lapLen(+chajjaDia);

    // FIX #4 — Distribution bars: span across lintel width (along L),
    // their count is based on chajja projection cl, not lintel span l.
    const nChDist = Math.floor((cl - chajjaCov) / csp) + 1;
    const lenChDist = l - 2 * chajjaCov + 2 * hookLen(+chajjaDia);

    rows.push({
      mark: "D",
      desc: `Chajja Main Bars — cantilever (φ${chajjaDia}mm @${chajjaSp}mm) along lintel span`,
      nos: nChMain,
      cutLen: +lenChMain.toFixed(3),
      dia: +chajjaDia,
    });
    rows.push({
      mark: "E",
      desc: `Chajja Dist Bars (φ${chajjaDia}mm @${chajjaSp}mm) across projection`,
      nos: nChDist,
      cutLen: +lenChDist.toFixed(3),
      dia: +chajjaDia,
    });
  }
  return rows;
}

// ─── RAFT FOUNDATION ─────────────────────────────────────────────────────────
// FIX #5 — Crank bar variable naming clarified and logic corrected.
// "Along L edges" means bars run in the B direction, placed along L.
// "Along B edges" means bars run in the L direction, placed along B.
export function calcSingleRaft({
  L,
  B,
  D,
  mainDia,
  distDia,
  mainSp,
  distSp,
  hasCrank,
  crankDia,
  crankSp,
}) {
  const l = parseFloat(L),
    b = parseFloat(B);
  const cov = COVER_MM.raft / 1000;
  const msp = parseFloat(mainSp) / 1000;
  const dsp = parseFloat(distSp) / 1000;

  const nMainBot = Math.floor((b - 2 * cov) / msp) + 1;
  const nDistBot = Math.floor((l - 2 * cov) / dsp) + 1;
  const lenMain = l - 2 * cov + 2 * hookLen(+mainDia);
  const lenDist = b - 2 * cov + 2 * hookLen(+distDia);

  const rows = [
    {
      mark: "A",
      desc: `Bottom Mat — Main Bars along L (φ${mainDia}mm @${mainSp}mm)`,
      nos: nMainBot,
      cutLen: +lenMain.toFixed(3),
      dia: +mainDia,
    },
    {
      mark: "B",
      desc: `Bottom Mat — Dist Bars along B (φ${distDia}mm @${distSp}mm)`,
      nos: nDistBot,
      cutLen: +lenDist.toFixed(3),
      dia: +distDia,
    },
    {
      mark: "C",
      desc: `Top Mat — Main Bars along L (φ${mainDia}mm @${mainSp}mm)`,
      nos: nMainBot,
      cutLen: +lenMain.toFixed(3),
      dia: +mainDia,
    },
    {
      mark: "D",
      desc: `Top Mat — Dist Bars along B (φ${distDia}mm @${distSp}mm)`,
      nos: nDistBot,
      cutLen: +lenDist.toFixed(3),
      dia: +distDia,
    },
  ];

  if (hasCrank) {
    const csp = parseFloat(crankSp) / 1000;
    const crankDepth = parseFloat(D) * 0.4;

    // FIX #5 — Crank bars along the two LONG edges (parallel to L):
    //   - These bars run in the B direction (cross the width)
    //   - Count: how many fit along L (spaced by crankSp), × 2 edges
    //   - Cut length: spans B + depth bends at each end
    const nCrankAlongLEdges = Math.floor((l - 2 * cov) / csp) + 1;
    const lCrankRunsB = b - 2 * cov + 2 * crankDepth + 2 * hookLen(+crankDia);

    // Crank bars along the two SHORT edges (parallel to B):
    //   - These bars run in the L direction (cross the length)
    //   - Count: how many fit along B (spaced by crankSp), × 2 edges
    //   - Cut length: spans L + depth bends at each end
    const nCrankAlongBEdges = Math.floor((b - 2 * cov) / csp) + 1;
    const lCrankRunsL = l - 2 * cov + 2 * crankDepth + 2 * hookLen(+crankDia);

    rows.push({
      mark: "E",
      desc: `Crank Bars — Along long edges (φ${crankDia}mm @${crankSp}mm, 2 edges × ${nCrankAlongLEdges} bars)`,
      nos: nCrankAlongLEdges * 2,
      cutLen: +lCrankRunsB.toFixed(3),
      dia: +crankDia,
    });
    rows.push({
      mark: "F",
      desc: `Crank Bars — Along short edges (φ${crankDia}mm @${crankSp}mm, 2 edges × ${nCrankAlongBEdges} bars)`,
      nos: nCrankAlongBEdges * 2,
      cutLen: +lCrankRunsL.toFixed(3),
      dia: +crankDia,
    });
  }
  return rows;
}

// ─── PILE CAP ─────────────────────────────────────────────────────────────────
export function calcSinglePileCap({
  L,
  B,
  D,
  mainDia,
  distDia,
  spacing,
  nPiles,
  pileDia,
}) {
  const l = parseFloat(L),
    b = parseFloat(B);
  const sp = parseFloat(spacing) / 1000;
  const md = +mainDia,
    dd = +distDia;
  const cov = COVER_MM.pileCap / 1000;

  const nMain = Math.floor((b - 2 * cov) / sp) + 1;
  const nDist = Math.floor((l - 2 * cov) / sp) + 1;
  const lenMain = l - 2 * cov + 2 * hookLen(md);
  const lenDist = b - 2 * cov + 2 * hookLen(dd);

  const nPilesNum = +nPiles || 4;
  const anchorLen = (40 * md) / 1000 + parseFloat(D);

  return [
    {
      mark: "A",
      desc: `Main Bars along L (φ${md}mm @${spacing}mm)`,
      nos: nMain,
      cutLen: +lenMain.toFixed(3),
      dia: md,
    },
    {
      mark: "B",
      desc: `Dist Bars along B (φ${dd}mm @${spacing}mm)`,
      nos: nDist,
      cutLen: +lenDist.toFixed(3),
      dia: dd,
    },
    {
      mark: "C",
      desc: `Pile Anchor Dowels — ${nPilesNum} piles × 4 bars/pile (φ${md}mm) [IS 456 Cl.34.4]`,
      nos: nPilesNum * 4,
      cutLen: +anchorLen.toFixed(3),
      dia: md,
    },
  ];
}

// ─── BUILD BBS ────────────────────────────────────────────────────────────────
export function buildBBS(rows) {
  return rows.map((r) => ({
    ...r,
    totalLen: +(r.nos * r.cutLen).toFixed(3),
    weight: +(r.nos * r.cutLen * (BAR_WEIGHT[r.dia] || 0)).toFixed(2),
  }));
}

// ─── AGGREGATE ────────────────────────────────────────────────────────────────
// FIX #6 — Avoid double-rounding: compute weight from raw values, not from
// pre-rounded row.weight. This prevents cumulative floating-point drift when
// multiplying already-rounded numbers by count.
export function aggregateBBS(allItems) {
  const combined = [];
  allItems.forEach(({ label, count, bbs }) => {
    bbs.forEach((row) => {
      const totalNos = row.nos * count;
      const totalLen = +(totalNos * row.cutLen).toFixed(3);
      const weight = +(
        totalNos *
        row.cutLen *
        (BAR_WEIGHT[row.dia] || 0)
      ).toFixed(2);
      combined.push({
        ...row,
        nos: totalNos,
        totalLen,
        weight,
        sourceLabel: label,
        count,
      });
    });
  });
  return combined;
}

// ─── COST SUMMARY ─────────────────────────────────────────────────────────────
// FIX #6 — accumulate raw totalLen directly to avoid precision loss from
// summing pre-rounded values. Weight is also re-summed from raw.
export function costSummary(bbs, ratesPerPiece) {
  const byDia = {};
  bbs.forEach((r) => {
    if (!byDia[r.dia]) byDia[r.dia] = { kg: 0, totalLen: 0 };
    byDia[r.dia].kg += r.weight;
    byDia[r.dia].totalLen += r.totalLen;
  });

  return Object.entries(byDia)
    .sort(([a], [b]) => +a - +b)
    .map(([dia, { kg, totalLen }]) => {
      const rods12m = Math.ceil(totalLen / 12);
      const ratePerPiece = ratesPerPiece[+dia] ?? ratesPerPiece[dia] ?? 0;
      const cost = rods12m * ratePerPiece;
      return {
        dia: +dia,
        kg: +kg.toFixed(2),
        totalLen: +totalLen.toFixed(2),
        rods12m,
        ratePerPiece,
        cost: +cost.toFixed(0),
      };
    });
}

// ─── CUTTING LENGTH SUMMARY PER DIA ───────────────────────────────────────────
export function cuttingLengthSummary(bbs) {
  const byDia = {};
  bbs.forEach((r) => {
    if (!byDia[r.dia])
      byDia[r.dia] = {
        dia: r.dia,
        totalLen: 0,
        totalNos: 0,
        weight: 0,
        entries: [],
      };
    byDia[r.dia].totalLen += r.totalLen;
    byDia[r.dia].totalNos += r.nos;
    byDia[r.dia].weight += r.weight;
    byDia[r.dia].entries.push({
      mark: r.mark,
      desc: r.desc,
      nos: r.nos,
      cutLen: r.cutLen,
      totalLen: r.totalLen,
      source: r.sourceLabel,
    });
  });
  return Object.values(byDia).sort((a, b) => a.dia - b.dia);
}

// ─── BAR TAG / LABEL SCHEDULE ─────────────────────────────────────────────────
export function generateBarTagSchedule(bbs) {
  let tagNo = 1;
  return bbs.map((r) => ({
    tag: `BT-${String(tagNo++).padStart(3, "0")}`,
    source: r.sourceLabel,
    mark: r.mark,
    dia: r.dia,
    nos: r.nos,
    cutLen: r.cutLen,
    totalLen: r.totalLen,
    weight: r.weight,
    desc: r.desc,
  }));
}

// ─── LAP SPLICE SCHEDULE ──────────────────────────────────────────────────────
export function generateLapSpliceSchedule(bbs) {
  return bbs
    .filter((r) => ["Main", "Bottom", "Top"].some((k) => r.desc?.includes(k)))
    .map((r) => ({
      source: r.sourceLabel,
      mark: r.mark,
      dia: r.dia,
      lapLen: +lapLen(r.dia).toFixed(3),
      lapLenMm: Math.round(40 * r.dia),
      desc: r.desc,
      zone: r.desc?.toLowerCase().includes("bottom")
        ? "Bottom Zone (Tension)"
        : "Top Zone (Compression)",
    }));
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
  costs.forEach((c) => {
    msg += `φ${c.dia}mm: *${c.rods12m} rods* (${c.kg} kg)\n`;
    msg += `   @ ₹${c.ratePerPiece}/piece = ₹${c.cost.toLocaleString("en-IN")}\n\n`;
  });
  msg += `━━━━━━━━━━━━━━━━━━━━\n*TOTAL: ${totalRods} rods*\n*TOTAL COST: ₹${totalCost.toLocaleString("en-IN")}*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `_Please confirm availability and delivery date._\n\nContact: ${details.engineerName || "—"}\n`;
  if (details.engineerPhone) msg += `Phone: +91 ${details.engineerPhone}`;
  return msg;
}
