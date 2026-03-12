import React from "react";
import { motion } from "framer-motion";
import { BlueprintSVG, DC, DimLine, RebarDot, Callout, Legend, scaleIn, staggerContainer } from "./DrawingShared.jsx";

export function DrawingLintel({
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
}) {
  const l = +L || 1.5,
    b = +B || 0.23,
    d = +D || 0.15;
  const W = 420,
    H = 300,
    scale = 200;
  const bw = Math.min(b * scale, 90),
    dh = Math.min(d * scale, 70);
  const chL = hasChajja ? Math.min((+chajjaL || 0.6) * scale, 70) : 0;
  const ox = W * 0.35 - bw / 2,
    oy = (H - dh) / 2 + 10;
  const cov = (25 / 1000) * scale;
  const nBot = +botNos || 2,
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
  const spPx = Math.max(12, (+stirSpacing / 1000) * scale);
  const eX = ox + bw + 24,
    eW = 55;

  const stirrupYs = [];
  for (let y = 0; y <= dh; y += spPx) stirrupYs.push(y);

  return (
    <BlueprintSVG
      width={W}
      height={H}
      title={`LINTEL${hasChajja ? " + CHAJJA" : ""} — SECTION  |  Cover: 25mm  |  IS 456`}
    >
      {/* Lintel body */}
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
        strokeWidth="1.5"
        strokeDasharray="4,2"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      />
      {/* Bottom bars */}
      <motion.g variants={staggerContainer} initial="hidden" animate="visible">
        {botXs.map((x, i) => (
          <RebarDot key={`b${i}`} cx={x} cy={botY} dia={+botDia} color={DC.main} />
        ))}
      </motion.g>
      {/* Top bars */}
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
        offset={16}
      />
      <DimLine
        x1={ox}
        y1={oy}
        x2={ox}
        y2={oy + dh}
        label={`${D}m`}
        offset={-16}
        vertical
      />

      {/* Chajja — extends outward */}
      {hasChajja && (
        <motion.g
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.5 }}
          style={{ transformOrigin: `${ox + bw}px ${oy + dh / 2}px` }}
        >
          <rect
            x={ox + bw}
            y={oy}
            width={chL}
            height={Math.min(dh * 0.4, 28)}
            fill="url(#hatch)"
            stroke={DC.outline}
            strokeWidth="1.5"
            opacity="0.8"
          />
          <line
            x1={ox + bw}
            y1={oy + 8}
            x2={ox + bw + chL}
            y2={oy + 8}
            stroke="#8e44ad"
            strokeWidth="2"
          />
          <text
            x={ox + bw + chL / 2}
            y={oy + 22}
            textAnchor="middle"
            fill="#8e44ad"
            style={{ fontSize: 11, fontFamily: "monospace" }}
          >
            CHAJJA
          </text>
          <DimLine
            x1={ox + bw}
            y1={oy + dh}
            x2={ox + bw + chL}
            y2={oy + dh}
            label={`${chajjaL || 0.6}m`}
            offset={16}
          />
        </motion.g>
      )}

      {/* Elevation */}
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
        transition={{ duration: 0.6, delay: 0.4 }}
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
        transition={{ duration: 0.6, delay: 0.45 }}
      />
      {/* Stirrups — sequential draw */}
      {stirrupYs.map((y, i) => (
        <motion.line
          key={i}
          x1={eX + 2}
          y1={oy + y}
          x2={eX + eW - 2}
          y2={oy + y}
          stroke={DC.tie}
          strokeWidth="1.2"
          className="rebar-line-hover"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 0.25, delay: 0.5 + i * 0.04 }}
        />
      ))}
      <DimLine
        x1={eX}
        y1={oy + dh}
        x2={eX + eW}
        y2={oy + dh}
        label={`${l}m`}
        offset={16}
      />
      {/* watermark */}
      <text
        x={ox + bw / 2}
        y={oy + dh / 2 + 4}
        textAnchor="middle"
        fill={DC.outline}
        className="watermark-text"
        style={{
          fontSize: 12,
          fontFamily: "monospace",
          fontWeight: 900,
          letterSpacing: 2,
          opacity: 0,
        }}
      >
        SECTION
      </text>
      {/* callouts */}
      <Callout
        px={botXs[0]}
        py={botY}
        lx={ox - 10}
        ly={oy + dh * 0.88}
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
        ly={oy + dh * 0.3}
        label="Cover = 25 mm"
        anchor="end"
        color="#64748b"
      />
      <Legend
        x={eX + eW + 12}
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
