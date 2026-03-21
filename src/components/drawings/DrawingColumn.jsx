import React from "react";
import { motion } from "framer-motion";
import { BlueprintSVG, DC, DimLine, RebarDot, Callout, Legend, scaleIn, fadeInUp, staggerContainer, popIn } from "./DrawingShared.jsx";

export function DrawingColumn({ B, D, mainDia, mainNos, tieDia, tieSpacing, shape, colDia }) {
  const isCircular = shape === "circular";

  // ── CIRCULAR COLUMN ──
  if (isCircular) {
    const dia = (+colDia || 0.3);
    const md = +mainDia, nos = +mainNos || 6, td = +tieDia;
    const W = 420, H = 300, scale = 210;
    const r = Math.min(dia * scale, 130) / 2;
    const cx = W * 0.38, cy = H / 2 + 20;
    const cov = (40 / 1000) * scale;
    const rInner = r - cov;

    // Distribute bars around circle
    const bars = [];
    for (let i = 0; i < nos; i++) {
      const angle = (2 * Math.PI * i) / nos - Math.PI / 2;
      bars.push([cx + rInner * Math.cos(angle), cy + rInner * Math.sin(angle)]);
    }

    // Elevation
    const eOx = cx + r + 36, eW = 24, eH = H - 100;
    const spPx = Math.max(10, (+tieSpacing / 1000) * scale);
    const nT = Math.ceil(eH / spPx) + 1;
    const eOy = (H - eH) / 2 + 20;

    return (
      <BlueprintSVG width={W} height={H} title={`CIRCULAR COLUMN | Φ${(dia*1000).toFixed(0)}mm | Cover: 40mm | IS 456`}>
        {/* Concrete circle */}
        <motion.circle cx={cx} cy={cy} r={r} fill="url(#hatch)" stroke={DC.outline} strokeWidth="2" variants={scaleIn} style={{ transformOrigin: `${cx}px ${cy}px` }} />
        {/* Spiral tie circle */}
        <motion.circle cx={cx} cy={cy} r={rInner} fill="none" stroke={DC.tie} strokeWidth="1.8" strokeDasharray="6,3"
          initial={{ opacity: 0, pathLength: 0 }} animate={{ opacity: 1, pathLength: 1 }} transition={{ duration: 0.8, delay: 0.3 }} />
        {/* Rebar dots */}
        <motion.g variants={staggerContainer} initial="hidden" animate="visible">
          {bars.map((p, i) => <RebarDot key={i} cx={p[0]} cy={p[1]} dia={md} color={DC.main} />)}
        </motion.g>
        {/* Diameter dimension */}
        <DimLine x1={cx - r} y1={cy + r} x2={cx + r} y2={cy + r} label={`Φ${(dia*1000).toFixed(0)}mm`} offset={18} />
        {/* Elevation */}
        <motion.rect x={eOx} y={eOy} width={eW} height={eH} fill="#e8f4fd" stroke={DC.outline} strokeWidth="1.5" variants={scaleIn} />
        <motion.line x1={eOx+4} y1={eOy} x2={eOx+4} y2={eOy+eH} stroke={DC.main} strokeWidth="1.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.4 }} />
        <motion.line x1={eOx+eW-4} y1={eOy} x2={eOx+eW-4} y2={eOy+eH} stroke={DC.main} strokeWidth="1.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.45 }} />
        {Array.from({ length: nT }).map((_, i) => (
          <motion.line key={i} x1={eOx} y1={eOy+i*spPx} x2={eOx+eW} y2={eOy+i*spPx} stroke={DC.tie} strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.04 }} />
        ))}
        <Callout px={bars[0][0]} py={bars[0][1]} lx={20} ly={cy-r-15} label={`Main φ${md}mm × ${nos}`} anchor="start" color={DC.main} />
        <Callout px={cx+rInner*0.7} py={cy-rInner*0.7} lx={W-20} ly={cy-r-15} label={`Spiral φ${td}mm @${tieSpacing}mm`} anchor="end" color={DC.tie} />
        <Legend x={eOx+eW+12} y={eOy} items={[
          { color: DC.main, label: `φ${md}mm × ${nos}`, type: "circle" },
          { color: DC.tie, label: `Spiral φ${td}@${tieSpacing}`, type: "line", dashed: true },
        ]} />
      </BlueprintSVG>
    );
  }

  // ── RECTANGULAR COLUMN (original) ──

  const b = +B || 0.3,
    d = +D || 0.3,
    md = +mainDia,
    nos = +mainNos || 4,
    td = +tieDia;
  const W = 420,
    H = 300,
    scale = 210;
  const bw = Math.min(b * scale, 140),
    dh = Math.min(d * scale, 140);
  const ox = W * 0.38 - bw / 2,
    oy = (H - dh) / 2 + 35;
  const cov = (40 / 1000) * scale;
  const px = ox + cov,
    py = oy + cov,
    px2 = ox + bw - cov,
    py2 = oy + dh - cov;
  const corners = [
    [px, py],
    [px2, py],
    [px2, py2],
    [px, py2],
  ];
  const mid = [
    [(px + px2) / 2, py],
    [(px + px2) / 2, py2],
    [px, (py + py2) / 2],
    [px2, (py + py2) / 2],
  ];
  let bars = [];
  if (nos <= 4) bars = corners.slice(0, nos);
  else if (nos === 6)
    bars = [corners[0], mid[0], corners[1], corners[2], mid[1], corners[3]];
  else if (nos === 8) bars = [...corners, ...mid];
  else {
    for (let i = 0; i < nos; i++) bars.push(corners[i % 4]);
  }
  const eOx = ox + bw + 36,
    eW = 24,
    eH = H - 100,
    spPx = Math.max(10, (+tieSpacing / 1000) * scale),
    nT = Math.ceil(eH / spPx) + 1;
  return (
    <BlueprintSVG
      width={W}
      height={H}
      title={`COLUMN SECTION & ELEVATION | Cover: 40mm | IS 456`}
    >
      {/* Concrete body — animated scale-in */}
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
      {/* Stirrup cover zone — draw in */}
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
      {/* Rebar dots — staggered pop-in */}
      <motion.g variants={staggerContainer} initial="hidden" animate="visible">
        {bars.map((p, i) => (
          <RebarDot key={i} cx={p[0]} cy={p[1]} dia={md} color={DC.main} />
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
      {/* Elevation box — fade in */}
      <motion.rect
        x={eOx}
        y={oy}
        width={eW}
        height={eH}
        fill="#e8f4fd"
        stroke={DC.outline}
        strokeWidth="1.5"
        variants={scaleIn}
      />
      {/* Main bars in elevation */}
      <motion.line
        x1={eOx + 4}
        y1={oy}
        x2={eOx + 4}
        y2={oy + eH}
        stroke={DC.main}
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      />
      <motion.line
        x1={eOx + eW - 4}
        y1={oy}
        x2={eOx + eW - 4}
        y2={oy + eH}
        stroke={DC.main}
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.45 }}
      />
      {/* Tie lines — staggered draw-in */}
      {Array.from({ length: nT }).map((_, i) => (
        <motion.line
          key={i}
          x1={eOx}
          y1={oy + i * spPx}
          x2={eOx + eW}
          y2={oy + i * spPx}
          stroke={DC.tie}
          strokeWidth="1.5"
          className="rebar-line-hover"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 + i * 0.04 }}
        />
      ))}
      {/* ── watermarks ── */}
      <text
        x={ox + bw / 2}
        y={oy + dh / 2 + 4}
        textAnchor="middle"
        fill={DC.outline}
        opacity={0.04}
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
      <text
        x={eOx + eW / 2}
        y={oy + eH / 2}
        textAnchor="middle"
        fill={DC.outline}
        opacity={0.04}
        className="watermark-text"
        style={{
          fontSize: 12,
          fontFamily: "monospace",
          fontWeight: 900,
          letterSpacing: 2,
        }}
      >
        ELEV
      </text>
      {/* ── callouts ── */}
      <Callout
        px={corners[0][0]}
        py={corners[0][1]}
        lx={20}
        ly={oy - 20}
        label={`Main Bar  φ${md}mm × ${nos} nos`}
        anchor="start"
        color={DC.main}
      />
      <Callout
        px={eOx + eW / 2}
        py={oy + dh / 2}
        lx={W - 20}
        ly={oy - 20}
        label={`Lateral Tie  φ${td}mm @ ${tieSpacing}mm`}
        anchor="end"
        color={DC.tie}
      />
      <Callout
        px={ox + cov}
        py={oy + dh - cov}
        lx={ox + bw / 2}
        ly={oy + dh + 45}
        label="Cover = 40 mm"
        anchor="middle"
        color="#64748b"
      />
      <Callout
        px={eOx + eW / 2}
        py={oy + eH}
        lx={eOx + eW / 2}
        ly={oy + eH + 35}
        label="Elevation View - Tied"
        anchor="middle"
        color={DC.dim}
      />
      <Legend
        x={eOx + eW + 12}
        y={oy}
        items={[
          { color: DC.main, label: `φ${md}mm × ${nos}`, type: "circle" },
          {
            color: DC.tie,
            label: `Ties φ${td}@${tieSpacing}`,
            type: "line",
            dashed: true,
          },
        ]}
      />
    </BlueprintSVG>
  );
}
