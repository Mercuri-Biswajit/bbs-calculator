import React, { useState } from "react";
import { BlueprintSVG, DC, DimLine, RebarDot, Callout, Legend } from "./DrawingShared.jsx";

export function DrawingPileCap({
  L,
  B,
  D,
  mainDia,
  distDia,
  spacing,
  nPiles,
  pileDia,
}) {
  const [view, setView] = useState("plan");
  const l = +L || 2,
    b = +B || 2,
    d = +D || 0.6;
  const W = 420,
    H = 300,
    pad = 55;
  const scale = Math.min((W - 2 * pad) / l, (H - 2 * pad) / b, 90);
  const sw = l * scale,
    sh = b * scale,
    ox = (W - sw) / 2,
    oy = (H - sh) / 2 + 5;
  const sp = ((+spacing || 150) / 1000) * scale,
    cov = 0.075 * scale;
  const nM = Math.floor((sh - 2 * cov) / sp) + 1,
    nD = Math.floor((sw - 2 * cov) / sp) + 1;
  const mBars = Array.from({ length: nM }, (_, i) => cov + i * sp);
  const dBars = Array.from({ length: nD }, (_, i) => cov + i * sp);
  const np = +nPiles || 4,
    pd = Math.max(8, Math.min(20, (+pileDia || 300) / 30));
  let pilePos = [];
  if (np === 4)
    pilePos = [
      [0.2, 0.2],
      [0.8, 0.2],
      [0.8, 0.8],
      [0.2, 0.8],
    ].map((p) => [ox + p[0] * sw, oy + p[1] * sh]);
  else if (np === 3)
    pilePos = [
      [0.5, 0.15],
      [0.15, 0.82],
      [0.85, 0.82],
    ].map((p) => [ox + p[0] * sw, oy + p[1] * sh]);
  else if (np === 2)
    pilePos = [
      [0.25, 0.5],
      [0.75, 0.5],
    ].map((p) => [ox + p[0] * sw, oy + p[1] * sh]);
  else {
    for (let i = 0; i < np; i++)
      pilePos.push([
        ox + sw / 2 + Math.cos((i * 2 * Math.PI) / np) * sw * 0.3,
        oy + sh / 2 + Math.sin((i * 2 * Math.PI) / np) * sh * 0.3,
      ]);
  }

  // ── SECTION A-A ──
  const pSc = Math.min((W - 100) / l, (H - 110) / d, 85);
  const psw = l * pSc,
    psh = Math.max(50, d * pSc);
  const psx = (W - psw) / 2,
    psy = (H - psh) / 2 - 10;
  const pcov = 0.075 * pSc,
    ppd = Math.max(10, Math.min(25, (+pileDia || 300) / 25));
  const pilePosX =
    np <= 2
      ? [[0.25], [0.75]]
          .flat()
          .slice(0, np)
          .map((t) => psx + t * psw)
      : np === 3
        ? [0.2, 0.5, 0.8].map((t) => psx + t * psw)
        : [0.15, 0.38, 0.62, 0.85]
            .map((t) => psx + t * psw)
            .slice(0, Math.min(np, 4));
  const pileStemH = 35;

  const planBtn = {
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    borderRadius: "4px 4px 0 0",
    fontFamily: "monospace",
    letterSpacing: 1,
    background: view === "plan" ? "#1e3a5f" : "#d6eaf8",
    color: view === "plan" ? "#fff" : "#1e6091",
  };
  const secBtn = {
    ...planBtn,
    background: view === "section" ? "#1e3a5f" : "#d6eaf8",
    color: view === "section" ? "#fff" : "#1e6091",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 3, marginBottom: 1, paddingLeft: 4 }}>
        <button style={planBtn} onClick={() => setView("plan")}>
          ▦ Plan View
        </button>
        <button style={secBtn} onClick={() => setView("section")}>
          ▧ Section A-A
        </button>
      </div>
      {view === "plan" ? (
        <BlueprintSVG
          width={W}
          height={H}
          title={`PILE CAP — PLAN VIEW  |  Cover: 75mm  |  ${np} Piles φ${pileDia}mm`}
        >
          <rect
            x={ox}
            y={oy}
            width={sw}
            height={sh}
            fill="url(#hatch)"
            stroke={DC.outline}
            strokeWidth="2"
          />
          {mBars.map((y, i) => (
            <line
              key={`m${i}`}
              x1={ox}
              y1={oy + y}
              x2={ox + sw}
              y2={oy + y}
              stroke={DC.main}
              strokeWidth="1.4"
            />
          ))}
          {dBars.map((x, i) => (
            <line
              key={`d${i}`}
              x1={ox + x}
              y1={oy}
              x2={ox + x}
              y2={oy + sh}
              stroke={DC.dist}
              strokeWidth="1.2"
            />
          ))}
          {pilePos.map((p, i) => (
            <g key={i}>
              <circle
                cx={p[0]}
                cy={p[1]}
                r={pd}
                fill="#cbd5e1"
                stroke="#475569"
                strokeWidth="1.5"
                opacity="0.85"
              />
              <text
                x={p[0]}
                y={p[1] + 3}
                textAnchor="middle"
                fill="#1e293b"
                style={{
                  fontSize: 11,
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
              >
                P{i + 1}
              </text>
            </g>
          ))}
          <DimLine
            x1={ox}
            y1={oy + sh}
            x2={ox + sw}
            y2={oy + sh}
            label={`${l}m`}
            offset={20}
          />
          <DimLine
            x1={ox}
            y1={oy}
            x2={ox}
            y2={oy + sh}
            label={`${b}m`}
            offset={-20}
            vertical
          />
          <text
            x={ox + sw / 2}
            y={oy + sh / 2 + 5}
            textAnchor="middle"
            fill={DC.outline}
            opacity={0.09}
            style={{
              fontSize: 14,
              fontFamily: "monospace",
              fontWeight: 900,
              letterSpacing: 3,
            }}
          >
            PILE CAP PLAN
          </text>
          <Callout
            px={ox + sw * 0.35}
            py={oy + sp * 0.4}
            lx={ox + sw * 0.35}
            ly={oy - 17}
            label={`Main Bar φ${mainDia}mm @ ${spacing}mm c/c`}
            anchor="middle"
            color={DC.main}
          />
          <Callout
            px={ox + sp * 0.4}
            py={oy + sh * 0.35}
            lx={ox - 12}
            ly={oy + sh * 0.35}
            label={`Dist Bar φ${distDia}mm @ ${spacing}mm c/c`}
            anchor="end"
            color={DC.dist}
          />
          <Callout
            px={ox + sw + 4}
            py={oy + sh * 0.65}
            lx={ox + sw + 14}
            ly={oy + sh * 0.65}
            label={`Pile φ${pileDia}mm × ${np} nos`}
            anchor="start"
            color="#475569"
          />
          <Callout
            px={ox + 4}
            py={oy + 4}
            lx={ox - 10}
            ly={oy + 22}
            label="Cover = 75 mm"
            anchor="end"
            color="#64748b"
          />
          <Legend
            x={W - 130}
            y={oy}
            items={[
              {
                color: DC.main,
                label: `Main φ${mainDia}@${spacing}`,
                type: "line",
              },
              {
                color: DC.dist,
                label: `Dist φ${distDia}@${spacing}`,
                type: "line",
              },
              { color: "#475569", label: `Piles ×${np}`, type: "circle" },
            ]}
          />
        </BlueprintSVG>
      ) : (
        <BlueprintSVG
          width={W}
          height={H}
          title={`PILE CAP — SECTION A-A  |  D=${d}m  |  ${np} Piles φ${pileDia}mm`}
        >
          {/* Pile stems below cap */}
          {pilePosX.map((x, i) => (
            <g key={i}>
              <rect
                x={x - ppd}
                y={psy + psh}
                width={ppd * 2}
                height={pileStemH}
                fill="#94a3b8"
                stroke="#475569"
                strokeWidth="1"
                opacity="0.8"
              />
              <text
                x={x}
                y={psy + psh + pileStemH / 2 + 3}
                textAnchor="middle"
                fill="#1e293b"
                style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  fontWeight: 700,
                }}
              >
                P{i + 1}
              </text>
            </g>
          ))}
          {/* Soil below piles */}
          <rect
            x={psx - 10}
            y={psy + psh + pileStemH}
            width={psw + 20}
            height={14}
            fill="#c8a86f"
            opacity="0.2"
          />
          {/* Pile cap body */}
          <rect
            x={psx}
            y={psy}
            width={psw}
            height={psh}
            fill="url(#hatch)"
            stroke={DC.outline}
            strokeWidth="2"
          />
          {/* Cover zone */}
          <rect
            x={psx + pcov}
            y={psy + pcov}
            width={psw - 2 * pcov}
            height={psh - 2 * pcov}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="0.7"
            strokeDasharray="4,2"
          />
          {/* Main bars at bottom */}
          <line
            x1={psx + pcov}
            y1={psy + psh - pcov}
            x2={psx + psw - pcov}
            y2={psy + psh - pcov}
            stroke={DC.main}
            strokeWidth="2.5"
            opacity="0.9"
          />
          {/* Dist bar dots */}
          {[0.2, 0.5, 0.8].map((t, i) => (
            <RebarDot
              key={i}
              cx={psx + t * psw}
              cy={psy + psh - pcov}
              dia={+distDia}
              color={DC.dist}
            />
          ))}
          {/* Top bars */}
          <line
            x1={psx + pcov}
            y1={psy + pcov}
            x2={psx + psw - pcov}
            y2={psy + pcov}
            stroke={DC.main}
            strokeWidth="1.5"
            strokeDasharray="8,3"
            opacity="0.7"
          />
          {/* Anchor dowels from piles */}
          {pilePosX.map((x, i) => (
            <line
              key={i}
              x1={x}
              y1={psy + psh}
              x2={x}
              y2={psy + pcov + 5}
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="3,2"
              opacity="0.8"
            />
          ))}
          {/* Dimensions */}
          <DimLine
            x1={psx}
            y1={psy + psh}
            x2={psx + psw}
            y2={psy + psh}
            label={`L=${l}m`}
            offset={pileStemH + 20}
          />
          <DimLine
            x1={psx}
            y1={psy}
            x2={psx}
            y2={psy + psh}
            label={`D=${d}m`}
            offset={-22}
            vertical
          />
          <text
            x={psx + psw / 2}
            y={psy + psh / 2 + 4}
            textAnchor="middle"
            fill={DC.outline}
            opacity={0.1}
            style={{
              fontSize: 13,
              fontFamily: "monospace",
              fontWeight: 900,
              letterSpacing: 3,
            }}
          >
            PILE CAP SECTION
          </text>
          <Callout
            px={psx + pcov + 20}
            py={psy + psh - pcov}
            lx={psx - 12}
            ly={psy + psh * 0.8}
            label={`Main Bar φ${mainDia}mm (bot)`}
            anchor="end"
            color={DC.main}
          />
          <Callout
            px={pilePosX[0]}
            py={psy + psh - psh / 3}
            lx={psx - 12}
            ly={psy + psh * 0.4}
            label={`Anchor Dowel (pile)`}
            anchor="end"
            color="#f59e0b"
          />
          <Callout
            px={psx + pcov}
            py={psy + psh / 2}
            lx={psx + psw + 14}
            ly={psy + psh * 0.5}
            label="Cover = 75 mm"
            anchor="start"
            color="#64748b"
          />
          <Callout
            px={pilePosX[0]}
            py={psy + psh + pileStemH / 2}
            lx={psx + psw + 14}
            ly={psy + psh + 15}
            label={`Pile φ${pileDia}mm × ${np}`}
            anchor="start"
            color="#475569"
          />
          <Legend
            x={W - 130}
            y={psy}
            items={[
              { color: DC.main, label: `Main Bar φ${mainDia}`, type: "line" },
              { color: "#f59e0b", label: `Anchor Dowel`, type: "line" },
              { color: "#475569", label: `Piles ×${np}`, type: "circle" },
            ]}
          />
        </BlueprintSVG>
      )}
    </div>
  );
}
