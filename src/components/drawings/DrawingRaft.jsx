import React, { useState } from "react";
import { BlueprintSVG, DC, DimLine, RebarDot, Callout, Legend } from "./DrawingShared.jsx";

export function DrawingRaft({ L, B, D, mainDia, distDia, mainSp, distSp }) {
  const [view, setView] = useState("plan");
  const l = +L || 8,
    b = +B || 6,
    d = +D || 0.3;
  const W = 420,
    H = 300,
    pad = 52;
  const scale = Math.min((W - 2 * pad) / l, (H - 2 * pad) / b, 40);
  const sw = l * scale,
    sh = b * scale,
    ox = (W - sw) / 2,
    oy = (H - sh) / 2 + 5;
  const msp = ((+mainSp || 150) / 1000) * scale,
    dsp = ((+distSp || 150) / 1000) * scale;
  const mBars = [],
    dBars = [];
  for (let x = 0; x < sw + 0.5; x += msp) mBars.push(x);
  for (let y = 0; y < sh + 0.5; y += dsp) dBars.push(y);

  // ── SECTION A-A ──
  const rSc = Math.min((W - 100) / l, (H - 120) / d, 80);
  const rsw = l * rSc,
    rsh = Math.max(40, d * rSc);
  const rsx = (W - rsw) / 2,
    rsy = (H - rsh) / 2;
  const rcov = 0.075 * rSc;

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
          title={`RAFT FOUNDATION — PLAN (Top + Bot Mat)  |  Cover: 75mm`}
        >
          <rect
            x={ox}
            y={oy}
            width={sw}
            height={sh}
            fill="url(#hatch)"
            stroke={DC.outline}
            strokeWidth="2.5"
          />
          {dBars.map((y, i) => (
            <line
              key={`db${i}`}
              x1={ox}
              y1={oy + y}
              x2={ox + sw}
              y2={oy + y}
              stroke={DC.dist}
              strokeWidth="1.4"
              opacity="0.7"
            />
          ))}
          {mBars.map((x, i) => (
            <line
              key={`mb${i}`}
              x1={ox + x}
              y1={oy}
              x2={ox + x}
              y2={oy + sh}
              stroke={DC.main}
              strokeWidth="1.4"
              opacity="0.7"
            />
          ))}
          {dBars.map((y, i) => (
            <line
              key={`dt${i}`}
              x1={ox + msp / 3}
              y1={oy + y + dsp / 3}
              x2={ox + sw - msp / 3}
              y2={oy + y + dsp / 3}
              stroke="#8e44ad"
              strokeWidth="1"
              strokeDasharray="6,4"
              opacity="0.6"
            />
          ))}
          {mBars.map((x, i) => (
            <line
              key={`mt${i}`}
              x1={ox + x + msp / 3}
              y1={oy + dsp / 3}
              x2={ox + x + msp / 3}
              y2={oy + sh - dsp / 3}
              stroke="#3b82f6"
              strokeWidth="1"
              strokeDasharray="6,4"
              opacity="0.6"
            />
          ))}
          <DimLine
            x1={ox}
            y1={oy + sh}
            x2={ox + sw}
            y2={oy + sh}
            label={`L=${l}m`}
            offset={20}
          />
          <DimLine
            x1={ox}
            y1={oy}
            x2={ox}
            y2={oy + sh}
            label={`B=${b}m`}
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
              fontSize: 15,
              fontFamily: "monospace",
              fontWeight: 900,
              letterSpacing: 3,
            }}
          >
            RAFT PLAN
          </text>
          <Callout
            px={ox + sw * 0.3}
            py={oy + dsp * 0.3}
            lx={ox + sw * 0.3}
            ly={oy - 17}
            label={`Bot Main φ${mainDia}mm @ ${mainSp}mm c/c`}
            anchor="middle"
            color={DC.main}
          />
          <Callout
            px={ox + msp * 0.3}
            py={oy + sh * 0.35}
            lx={ox - 12}
            ly={oy + sh * 0.35}
            label={`Bot Dist φ${distDia}mm @ ${distSp}mm c/c`}
            anchor="end"
            color={DC.dist}
          />
          <Callout
            px={ox + sw - msp * 0.3}
            py={oy + sh * 0.6}
            lx={ox + sw + 14}
            ly={oy + sh * 0.6}
            label="Top Mat (dashed)"
            anchor="start"
            color="#3b82f6"
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
            x={W - 135}
            y={oy}
            items={[
              {
                color: DC.main,
                label: `Bot Main φ${mainDia}@${mainSp}`,
                type: "line",
              },
              {
                color: DC.dist,
                label: `Bot Dist φ${distDia}@${distSp}`,
                type: "line",
              },
              {
                color: "#3b82f6",
                label: `Top Mat (dashed)`,
                type: "line",
                dashed: true,
              },
            ]}
          />
        </BlueprintSVG>
      ) : (
        <BlueprintSVG
          width={W}
          height={H}
          title={`RAFT — SECTION A-A  |  D=${d}m  |  Top + Bottom Mat  |  Cover: 75mm`}
        >
          {/* Soil below */}
          <rect
            x={rsx - 10}
            y={rsy + rsh}
            width={rsw + 20}
            height={18}
            fill="#c8a86f"
            opacity="0.25"
          />
          {Array.from({ length: 7 }).map((_, i) => (
            <line
              key={i}
              x1={rsx - 10 + (i * (rsw + 20)) / 6}
              y1={rsy + rsh}
              x2={rsx - 20 + (i * (rsw + 20)) / 6}
              y2={rsy + rsh + 12}
              stroke="#92400e"
              strokeWidth="1"
              opacity="0.45"
            />
          ))}
          {/* Raft body */}
          <rect
            x={rsx}
            y={rsy}
            width={rsw}
            height={rsh}
            fill="url(#hatch)"
            stroke={DC.outline}
            strokeWidth="2"
          />
          {/* Cover zones */}
          <rect
            x={rsx + rcov}
            y={rsy + rcov}
            width={rsw - 2 * rcov}
            height={rsh - 2 * rcov}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="0.7"
            strokeDasharray="4,2"
          />
          {/* Bottom mat — main bars (horizontal, running in L) */}
          <line
            x1={rsx + rcov}
            y1={rsy + rsh - rcov}
            x2={rsx + rsw - rcov}
            y2={rsy + rsh - rcov}
            stroke={DC.main}
            strokeWidth="2.5"
            opacity="0.85"
          />
          {/* Bottom mat — dist bars (dots, running in B) */}
          {[0.15, 0.35, 0.55, 0.75, 0.9].map((t, i) => (
            <RebarDot
              key={i}
              cx={rsx + t * rsw}
              cy={rsy + rsh - rcov}
              dia={+distDia}
              color={DC.dist}
            />
          ))}
          {/* Top mat — main bars (horizontal, dashed) */}
          <line
            x1={rsx + rcov}
            y1={rsy + rcov}
            x2={rsx + rsw - rcov}
            y2={rsy + rcov}
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="8,3"
            opacity="0.8"
          />
          {/* Top mat — dist bars (dots) */}
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((t, i) => (
            <RebarDot
              key={i}
              cx={rsx + t * rsw}
              cy={rsy + rcov}
              dia={+distDia}
              color="#8e44ad"
            />
          ))}
          {/* Dimension lines */}
          <DimLine
            x1={rsx}
            y1={rsy + rsh}
            x2={rsx + rsw}
            y2={rsy + rsh}
            label={`L=${l}m`}
            offset={25}
          />
          <DimLine
            x1={rsx}
            y1={rsy}
            x2={rsx}
            y2={rsy + rsh}
            label={`D=${d}m`}
            offset={-22}
            vertical
          />
          <text
            x={rsx + rsw / 2}
            y={rsy + rsh / 2 + 4}
            textAnchor="middle"
            fill={DC.outline}
            opacity={0.1}
            style={{
              fontSize: 14,
              fontFamily: "monospace",
              fontWeight: 900,
              letterSpacing: 3,
            }}
          >
            RAFT SECTION
          </text>
          <Callout
            px={rsx + rcov + 20}
            py={rsy + rsh - rcov}
            lx={rsx - 12}
            ly={rsy + rsh * 0.85}
            label={`Bottom Mat  φ${mainDia}mm @ ${mainSp}mm`}
            anchor="end"
            color={DC.main}
          />
          <Callout
            px={rsx + rcov + 20}
            py={rsy + rcov}
            lx={rsx - 12}
            ly={rsy + rsh * 0.15}
            label={`Top Mat  φ${mainDia}mm @ ${mainSp}mm`}
            anchor="end"
            color="#3b82f6"
          />
          <Callout
            px={rsx + rcov}
            py={rsy + rsh / 2}
            lx={rsx + rsw + 14}
            ly={rsy + rsh * 0.5}
            label="Cover = 75 mm"
            anchor="start"
            color="#64748b"
          />
          <Callout
            px={rsx + rsw / 2}
            py={rsy + rsh + 6}
            lx={rsx + rsw / 2}
            ly={rsy + rsh + 30}
            label="Soil / PCC Bed"
            anchor="middle"
            color="#92400e"
          />
          <Legend
            x={W - 130}
            y={rsy}
            items={[
              { color: DC.main, label: `Bot Main φ${mainDia}`, type: "line" },
              { color: "#3b82f6", label: `Top Main φ${mainDia}`, type: "line" },
              { color: DC.dist, label: `Bot Dist φ${distDia}`, type: "circle" },
            ]}
          />
        </BlueprintSVG>
      )}
    </div>
  );
}
