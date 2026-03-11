import React, { useState } from "react";
import { BlueprintSVG, DC, DimLine, RebarDot, Callout, Legend } from "./DrawingShared.jsx";

export function DrawingSlab({
  L,
  B,
  D,
  mainDia,
  distDia,
  mainSp,
  distSp,
  topDia,
  topSp,
}) {
  const [view, setView] = useState("plan");
  const l = +L || 4,
    b = +B || 3,
    d = +D || 0.125;
  const W = 600,
    H = 450,
    pad = 52;
  const scale = Math.min((W - 80) / l, (H - 2 * pad) / b, 300);
  const sw = l * scale,
    sh = b * scale;
  const ox = (W - sw) / 2,
    oy = (H - sh) / 2 + 25;
  const msp = ((+mainSp || 150) / 1000) * scale,
    dsp = ((+distSp || 200) / 1000) * scale;
  const mBars = [],
    dBars = [];
  for (let x = 0; x < sw + 0.5; x += msp) mBars.push(x);
  for (let y = 0; y < sh + 0.5; y += dsp) dBars.push(y);

  // ── SECTION A-A (cut along Lx, showing Lx × D) ──
  const minSlabH = Math.max(40, d * 700);
  const secSlabH = Math.min(minSlabH, 140); // slab depth in pixels
  const secSlabW = Math.min(l * 80, W - 40);
  const ssx = (W - secSlabW) / 2,
    ssy = (H - secSlabH) / 2 + 25;
  const scov = Math.min(0.02 * 600, secSlabH * 0.2); // 20mm cover
  const nMainSec = Math.max(
    2,
    Math.round(secSlabW / (((+mainSp || 150) / 1000) * 55)) + 1,
  );
  const secMain = Array.from(
    { length: nMainSec },
    (_, i) => ssx + i * (secSlabW / Math.max(1, nMainSec - 1)),
  );

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
          title={`SLAB — PLAN VIEW  |  Cover: 20mm  |  IS 456 Cl.26.3`}
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
          {dBars.map((y, i) => (
            <line
              key={i}
              x1={ox}
              y1={oy + y}
              x2={ox + sw}
              y2={oy + y}
              stroke={DC.dist}
              strokeWidth="1.2"
            />
          ))}
          {mBars.map((x, i) => (
            <line
              key={i}
              x1={ox + x}
              y1={oy}
              x2={ox + x}
              y2={oy + sh}
              stroke={DC.main}
              strokeWidth="1.4"
            />
          ))}
          <rect
            x={ox}
            y={oy}
            width={sw / 5}
            height={sh}
            fill={DC.top}
            opacity="0.1"
          />
          <rect
            x={ox + (sw * 4) / 5}
            y={oy}
            width={sw / 5}
            height={sh}
            fill={DC.top}
            opacity="0.1"
          />
          <DimLine
            x1={ox}
            y1={oy + sh}
            x2={ox + sw}
            y2={oy + sh}
            label={`Lx=${l}m`}
            offset={20}
          />
          <DimLine
            x1={ox}
            y1={oy}
            x2={ox}
            y2={oy + sh}
            label={`Ly=${b}m`}
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
            SLAB PLAN
          </text>
          <Callout
            px={ox + sw * 0.3}
            py={oy + 6}
            lx={ox + sw * 0.3}
            ly={oy - 25}
            label={`Main Bar φ${mainDia}mm @ ${mainSp}mm c/c`}
            anchor="middle"
            color={DC.main}
          />
          <Callout
            px={ox + sw - 4}
            py={oy + sh * 0.35}
            lx={ox + sw + 14}
            ly={oy + sh * 0.35}
            label={`Dist Bar φ${distDia}mm @ ${distSp}mm c/c`}
            anchor="start"
            color={DC.dist}
          />
          <Callout
            px={ox + sw * 0.08}
            py={oy + sh * 0.5}
            lx={ox - 10}
            ly={oy + sh * 0.5}
            label={`Top Bar φ${topDia}mm @ support zone`}
            anchor="end"
            color={DC.top}
          />
          <Callout
            px={ox + 4}
            py={oy + 4}
            lx={ox - 10}
            ly={oy + 22}
            label="Cover = 20 mm (IS 456)"
            anchor="end"
            color="#64748b"
          />
          <Legend
            x={W - 130}
            y={oy}
            items={[
              {
                color: DC.main,
                label: `Main φ${mainDia}@${mainSp}`,
                type: "line",
              },
              {
                color: DC.dist,
                label: `Dist φ${distDia}@${distSp}`,
                type: "line",
              },
              { color: DC.top, label: `Top φ${topDia} zone`, type: "line" },
            ]}
          />
        </BlueprintSVG>
      ) : (
        <BlueprintSVG
          width={W}
          height={H}
          title={`SLAB — SECTION A-A  |  D=${d}m (${d * 1000}mm)  |  Cover: 20mm`}
        >
          {/* Slab body */}
          <rect
            x={ssx}
            y={ssy}
            width={secSlabW}
            height={secSlabH}
            fill="url(#hatch)"
            stroke={DC.outline}
            strokeWidth="2"
          />
          {/* Cover zone */}
          <rect
            x={ssx + scov}
            y={ssy + scov}
            width={secSlabW - 2 * scov}
            height={secSlabH - 2 * scov}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="0.7"
            strokeDasharray="4,2"
          />
          {/* Main bars at bottom */}
          {secMain.map((x, i) => (
            <RebarDot
              key={i}
              cx={x}
              cy={ssy + secSlabH - scov}
              dia={+mainDia}
              color={DC.main}
            />
          ))}
          {/* Top bars at support zones (left 1/5 and right 1/5) */}
          {secMain
            .filter(
              (_, i) =>
                i < Math.ceil(nMainSec / 5) ||
                i >= Math.floor((nMainSec * 4) / 5),
            )
            .map((x, i) => (
              <RebarDot
                key={i}
                cx={x}
                cy={ssy + scov}
                dia={+(topDia || mainDia)}
                color={DC.top}
              />
            ))}
          {/* Support walls hint */}
          <rect
            x={ssx - 15}
            y={ssy}
            width={12}
            height={secSlabH}
            fill="#cbd5e1"
            stroke="#64748b"
            strokeWidth="1"
          />
          <rect
            x={ssx + secSlabW + 3}
            y={ssy}
            width={12}
            height={secSlabH}
            fill="#cbd5e1"
            stroke="#64748b"
            strokeWidth="1"
          />
          {/* Slab depth dimension */}
          <DimLine
            x1={ssx + secSlabW}
            y1={ssy}
            x2={ssx + secSlabW}
            y2={ssy + secSlabH}
            label={`D=${d}m`}
            offset={22}
            vertical
          />
          <DimLine
            x1={ssx}
            y1={ssy + secSlabH}
            x2={ssx + secSlabW}
            y2={ssy + secSlabH}
            label={`Lx=${l}m`}
            offset={22}
          />
          <text
            x={ssx + secSlabW / 2}
            y={ssy + secSlabH / 2 + 4}
            textAnchor="middle"
            fill={DC.outline}
            opacity={0.12}
            style={{
              fontSize: 14,
              fontFamily: "monospace",
              fontWeight: 900,
              letterSpacing: 3,
            }}
          >
            SLAB SECTION
          </text>
          <Callout
            px={secMain[Math.floor(nMainSec / 2)]}
            py={ssy + secSlabH - scov}
            lx={ssx + secSlabW / 2}
            ly={ssy + secSlabH + 45}
            label={`Main Bar φ${mainDia}mm @ ${mainSp}mm c/c`}
            anchor="middle"
            color={DC.main}
          />
          <Callout
            px={secMain[0]}
            py={ssy + scov}
            lx={ssx + secSlabW / 2}
            ly={ssy - 15}
            label={`Top Bar φ${topDia}mm @ support`}
            anchor="middle"
            color={DC.top}
          />
          <Callout
            px={ssx + secSlabW - scov}
            py={ssy + secSlabH - scov / 2}
            lx={ssx + secSlabW - 10}
            ly={ssy + secSlabH / 2}
            label="Cover = 20 mm"
            anchor="end"
            color="#64748b"
          />
          <text
            x={ssx - 3}
            y={ssy + secSlabH / 2}
            textAnchor="end"
            fill="#475569"
            style={{ fontSize: 10, fontFamily: "monospace" }}
          >
            Wall
          </text>
          <text
            x={ssx + secSlabW + 15}
            y={ssy + secSlabH / 2}
            textAnchor="start"
            fill="#475569"
            style={{ fontSize: 10, fontFamily: "monospace" }}
          >
            Wall
          </text>
        </BlueprintSVG>
      )}
    </div>
  );
}
