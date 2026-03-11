import React from "react";
import { BlueprintSVG, DC, DimLine, Callout, Legend } from "./DrawingShared.jsx";

export function DrawingStaircase({
  flightLen,
  width,
  mainDia,
  mainSp,
  distDia,
  distSp,
}) {
  const l = +flightLen || 3.5,
    w = +width || 1.2;
  const W = 420,
    H = 300,
    scale = 60;
  const fw = Math.min(l * scale, 240),
    ww = Math.min(w * scale, 140);
  const ox = (W - fw) / 2,
    oy = (H - ww) / 2 + 10;
  const msp = ((+mainSp || 150) / 1000) * scale,
    dsp = ((+distSp || 200) / 1000) * scale;
  const mBars = [],
    dBars = [];
  for (let y = 0; y < ww + 0.5; y += msp) mBars.push(y);
  for (let x = 0; x < fw + 0.5; x += dsp) dBars.push(x);
  return (
    <BlueprintSVG
      width={W}
      height={H}
      title={`STAIRCASE — PLAN VIEW  |  Cover: 25mm  |  IS 456`}
    >
      <rect
        x={ox}
        y={oy}
        width={fw}
        height={ww}
        fill="url(#hatch)"
        stroke={DC.outline}
        strokeWidth="2"
      />
      {dBars.map((x, i) => (
        <line
          key={`d${i}`}
          x1={ox + x}
          y1={oy}
          x2={ox + x}
          y2={oy + ww}
          stroke={DC.dist}
          strokeWidth="1.2"
        />
      ))}
      {mBars.map((y, i) => (
        <line
          key={`m${i}`}
          x1={ox}
          y1={oy + y}
          x2={ox + fw}
          y2={oy + y}
          stroke={DC.main}
          strokeWidth="1.5"
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => {
        const sx = ox + (fw / 8) * i;
        return (
          <line
            key={`step${i}`}
            x1={sx}
            y1={oy}
            x2={sx}
            y2={oy + ww}
            stroke={DC.outline}
            strokeWidth="0.5"
            strokeDasharray="3,3"
            opacity="0.3"
          />
        );
      })}
      <DimLine
        x1={ox}
        y1={oy + ww}
        x2={ox + fw}
        y2={oy + ww}
        label={`Flight: ${l}m`}
        offset={20}
      />
      <DimLine
        x1={ox}
        y1={oy}
        x2={ox}
        y2={oy + ww}
        label={`Width: ${w}m`}
        offset={-20}
        vertical
      />
      {/* ── watermark ── */}
      <text
        x={ox + fw / 2}
        y={oy + ww / 2 + 4}
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
        STAIRCASE PLAN
      </text>
      {/* ── callouts ── */}
      <Callout
        px={ox + fw * 0.15}
        py={oy + ww * 0.5}
        lx={ox - 10}
        ly={oy + ww * 0.4}
        label={`Main Bar  φ${mainDia}mm @ ${mainSp}mm c/c`}
        anchor="end"
        color={DC.main}
      />
      <Callout
        px={ox + fw * 0.5}
        py={oy + 6}
        lx={ox + fw * 0.5}
        ly={oy - 16}
        label={`Dist Bar  φ${distDia}mm @ ${distSp}mm c/c`}
        anchor="middle"
        color={DC.dist}
      />
      <Callout
        px={ox + fw * 0.3}
        py={oy + ww - 4}
        lx={ox + fw * 0.3}
        ly={oy + ww + 22}
        label="Waist Slab (Inclined)"
        anchor="middle"
        color={DC.outline}
      />
      <Callout
        px={ox + fw / 8}
        py={oy + ww * 0.15}
        lx={ox + fw + 12}
        ly={oy + 15}
        label="Stair Steps (dashed)"
        anchor="start"
        color="#94a3b8"
      />
      <Legend
        x={W - 140}
        y={oy}
        items={[
          { color: DC.main, label: `Main φ${mainDia}@${mainSp}`, type: "line" },
          { color: DC.dist, label: `Dist φ${distDia}@${distSp}`, type: "line" },
        ]}
      />
    </BlueprintSVG>
  );
}
