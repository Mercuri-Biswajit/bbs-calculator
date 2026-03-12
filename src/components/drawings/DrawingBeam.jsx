import React from "react";
import { motion } from "framer-motion";
import { BlueprintSVG, DC, DimLine, RebarDot, Callout, Legend, scaleIn, fadeInUp, staggerContainer } from "./DrawingShared.jsx";

export function DrawingBeam({
  B,
  D,
  botDia,
  botNos,
  topDia,
  topNos,
  stirDia,
  stirSpacing,
  coverType,
}) {
  const b = +B || 0.23,
    d = +D || 0.45;
  const W = 420,
    H = 300,
    scale = 260;
  const bw = Math.min(b * scale, 110),
    dh = Math.min(d * scale, 180);
  const ox = W * 0.38 - bw / 2,
    oy = (H - dh) / 2 + 10;
  const cov = ((coverType === "wallBeam" ? 25 : 40) / 1000) * scale;
  const nBot = +botNos || 3,
    nTop = +topNos || 2;
  const botY = oy + dh - cov,
    topY = oy + cov;
  const botXs = Array.from(
    { length: nBot },
    (_, i) => ox + cov + i * (nBot > 1 ? (bw - 2 * cov) / (nBot - 1) : 0),
  );
  const topXs = Array.from(
    { length: nTop },
    (_, i) => ox + cov + i * (nTop > 1 ? (bw - 2 * cov) / (nTop - 1) : 0),
  );

  const eX = ox + bw + 28,
    eW = 60;

  const normalSpPx = Math.max(10, (+stirSpacing / 1000) * scale);
  const denseSpPx = normalSpPx / 2;
  const denseZoneH = dh * 0.25;

  const stirrupYs = [];
  for (let y = 0; y <= denseZoneH; y += denseSpPx) {
    stirrupYs.push({ y: oy + y, dense: true });
  }
  for (
    let y = denseZoneH + normalSpPx;
    y <= dh - denseZoneH - normalSpPx;
    y += normalSpPx
  ) {
    stirrupYs.push({ y: oy + y, dense: false });
  }
  for (let y = dh - denseZoneH; y <= dh; y += denseSpPx) {
    stirrupYs.push({ y: oy + y, dense: true });
  }

  return (
    <BlueprintSVG
      width={W}
      height={H}
      title={`BEAM — CROSS-SECTION + STIRRUP ZONES  |  Cover: ${coverType === "wallBeam" ? 25 : 40}mm`}
    >
      {/* Concrete body — scale-in */}
      <motion.rect
        x={ox}
        y={oy}
        width={bw}
        height={dh}
        fill="url(#hatch)"
        stroke={DC.outline}
        strokeWidth="2"
        variants={scaleIn}
        style={{ transformOrigin: `${ox + bw / 2}px ${oy + dh / 2}px` }}
      />
      {/* Stirrup cover zone */}
      <motion.rect
        x={ox + cov}
        y={oy + cov}
        width={bw - 2 * cov}
        height={dh - 2 * cov}
        fill="none"
        stroke={DC.tie}
        strokeWidth="1.8"
        strokeDasharray="5,2"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      {/* Bottom bars — staggered pop */}
      <motion.g variants={staggerContainer} initial="hidden" animate="visible">
        {botXs.map((x, i) => (
          <RebarDot key={`b${i}`} cx={x} cy={botY} dia={+botDia} color={DC.main} />
        ))}
      </motion.g>
      {/* Top bars — staggered pop */}
      <motion.g variants={staggerContainer} initial="hidden" animate="visible">
        {topXs.map((x, i) => (
          <RebarDot key={`t${i}`} cx={x} cy={topY} dia={+topDia} color={DC.top} />
        ))}
      </motion.g>
      <DimLine
        x1={ox}
        y1={oy + dh}
        x2={ox + bw}
        y2={oy + dh}
        label={`${B}m`}
        offset={18}
      />
      <DimLine
        x1={ox}
        y1={oy}
        x2={ox}
        y2={oy + dh}
        label={`${D}m`}
        offset={-18}
        vertical
      />

      {/* Elevation box */}
      <motion.rect
        x={eX}
        y={oy}
        width={eW}
        height={dh}
        fill="#e8f4fd"
        stroke={DC.outline}
        strokeWidth="1.5"
        variants={scaleIn}
      />
      {/* Dense zone shading — pulsing */}
      <motion.rect
        x={eX}
        y={oy}
        width={eW}
        height={denseZoneH}
        fill="rgba(220,38,38,.08)"
        stroke="none"
        className="dense-zone-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      />
      <motion.rect
        x={eX}
        y={oy + dh - denseZoneH}
        width={eW}
        height={denseZoneH}
        fill="rgba(220,38,38,.08)"
        stroke="none"
        className="dense-zone-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.4 }}
      />
      {/* Zone labels */}
      <motion.text
        x={eX + eW / 2}
        y={oy - 3}
        textAnchor="middle"
        fill="#dc2626"
        style={{ fontSize: 10, fontFamily: "monospace" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        DENSE
      </motion.text>
      <motion.text
        x={eX + eW / 2}
        y={oy + dh / 2}
        textAnchor="middle"
        fill="#059669"
        style={{ fontSize: 10, fontFamily: "monospace" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
      >
        NORMAL
      </motion.text>
      {/* Main bars in elevation */}
      <motion.line
        x1={eX + 3}
        y1={oy}
        x2={eX + 3}
        y2={oy + dh}
        stroke={DC.main}
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      />
      <motion.line
        x1={eX + eW - 3}
        y1={oy}
        x2={eX + eW - 3}
        y2={oy + dh}
        stroke={DC.main}
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      />
      {/* Stirrup lines — staggered draw */}
      {stirrupYs.map((s, i) => (
        <motion.line
          key={i}
          x1={eX + 2}
          y1={s.y}
          x2={eX + eW - 2}
          y2={s.y}
          stroke={s.dense ? "#dc2626" : DC.tie}
          strokeWidth={s.dense ? 1.5 : 1.2}
          className="rebar-line-hover"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.85 }}
          transition={{ duration: 0.25, delay: 0.45 + i * 0.03 }}
        />
      ))}
      {/* Watermark */}
      <text
        x={ox + bw / 2}
        y={oy + dh / 2 + 4}
        textAnchor="middle"
        fill={DC.outline}
        opacity={0.1}
        className="watermark-text"
        style={{
          fontSize: 12,
          fontFamily: "monospace",
          fontWeight: 900,
          letterSpacing: 2,
        }}
      >
        SECTION
      </text>
      {/* Callouts */}
      <Callout
        px={botXs[0]}
        py={botY}
        lx={ox - 10}
        ly={oy + dh * 0.85}
        label={`Bottom Bar  φ${botDia}mm × ${nBot} nos`}
        anchor="end"
        color={DC.main}
      />
      <Callout
        px={topXs[0]}
        py={topY}
        lx={ox - 10}
        ly={oy + dh * 0.12}
        label={`Top Bar  φ${topDia}mm × ${nTop} nos`}
        anchor="end"
        color={DC.top}
      />
      <Callout
        px={ox + bw - cov}
        py={oy + dh / 2}
        lx={eX - 6}
        ly={oy + dh * 0.5}
        label={`Stirrup  φ${stirDia}mm @ ${stirSpacing}mm`}
        anchor="end"
        color={DC.tie}
      />
      <Callout
        px={ox}
        py={oy + cov}
        lx={ox - 10}
        ly={oy + dh * 0.32}
        label={`Cover = ${coverType === "wallBeam" ? 25 : 40} mm`}
        anchor="end"
        color="#64748b"
      />
      <Callout
        px={eX + eW / 2}
        py={oy + denseZoneH * 0.5}
        lx={eX + eW + 10}
        ly={oy + denseZoneH * 0.5}
        label="Dense Zone (L/4)"
        anchor="start"
        color="#dc2626"
      />
      <Legend
        x={eX + eW + 10}
        y={oy}
        items={[
          { color: DC.main, label: `Bot φ${botDia}×${nBot}`, type: "circle" },
          { color: DC.top, label: `Top φ${topDia}×${nTop}`, type: "circle" },
          {
            color: DC.tie,
            label: `Stir φ${stirDia}@${stirSpacing}`,
            type: "line",
            dashed: true,
          },
        ]}
      />
    </BlueprintSVG>
  );
}
