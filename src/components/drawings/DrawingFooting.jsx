import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlueprintSVG, DC, DimLine, RebarDot, Callout, Legend, scaleIn, fadeInUp, staggerContainer } from "./DrawingShared.jsx";

const viewTransition = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -10 },
  transition: { type: "spring", stiffness: 200, damping: 22 },
};

export function DrawingFooting({ L, B, D, mainDia, distDia, spacing, hasStub, stubH, colDia, colNos }) {
  const [view, setView] = useState("plan");
  const l = +L || 1.5,
    b = +B || 1.5,
    d = +D || 0.45;
  const sp = +spacing / 1000,
    md = +mainDia,
    dd = +distDia;

  // ── PLAN VIEW ──
  const pad = 65;
  const targetFw = 500;
  const scale = Math.min((targetFw - 2 * pad) / l, (400 - 2 * pad) / b, 300);
  const fw = l * scale,
    fh = b * scale;
  const W = Math.round(fw + 2 * pad);
  const H = Math.round(fh + 2 * pad);
  const ox = pad,
    oy = pad + 10;
  const cov = (75 / 1000) * scale;
  
  const mBars = [],
    dBars = [];
  for (let x = cov; x < fw - cov + 0.5; x += sp * scale) mBars.push(x);
  for (let y = cov; y < fh - cov + 0.5; y += sp * scale) dBars.push(y);

  // ── SECTION A-A ──
  const sPadX = 75;
  const sPadY = 120;
  const targetSw = 500;
  const sSc = targetSw / l;
  const sw = targetSw,
    sh = d * sSc;
  const sW = Math.round(sw + 2 * sPadX);
  const sH = Math.round(Math.max(300, sh + 2 * sPadY + (hasStub ? (+stubH * sSc) : 0)));
  const sox = sPadX,
    soy = sH - sPadY - sh + 20;
  const scov = (75 / 1000) * sSc;
  const nMain = Math.max(2, Math.round((sw - 2 * scov) / (sp * sSc)) + 1);
  const secMainXs = Array.from(
    { length: nMain },
    (_, i) => sox + scov + i * ((sw - 2 * scov) / Math.max(1, nMain - 1)),
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
    transition: "all 0.3s ease",
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

      <AnimatePresence mode="wait">
        {view === "plan" ? (
          <motion.div key="plan" {...viewTransition}>
            <BlueprintSVG
              width={W}
              height={H}
              title={`FOOTING — PLAN VIEW  |  Cover: 75mm  |  IS 456 Cl.34`}
            >
              {/* Concrete body */}
              <motion.rect
                x={ox}
                y={oy}
                width={fw}
                height={fh}
                fill="url(#hatch)"
                stroke={DC.outline}
                strokeWidth="2"
                variants={scaleIn}
                style={{ transformOrigin: `${ox + fw / 2}px ${oy + fh / 2}px` }}
              />
              {/* Dist bars — sweep top→bottom */}
              {dBars.map((y, i) => (
                <motion.line
                  key={`d${i}`}
                  x1={ox}
                  y1={oy + y}
                  x2={ox + fw}
                  y2={oy + y}
                  stroke={DC.dist}
                  strokeWidth="1.5"
                  className="rebar-line-hover"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.04 }}
                />
              ))}
              {/* Main bars — sweep left→right */}
              {mBars.map((x, i) => (
                <motion.line
                  key={`m${i}`}
                  x1={ox + x}
                  y1={oy}
                  x2={ox + x}
                  y2={oy + fh}
                  stroke={DC.main}
                  strokeWidth="1.5"
                  className="rebar-line-hover"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.04 }}
                />
              ))}
              <DimLine
                x1={ox}
                y1={oy + fh}
                x2={ox + fw}
                y2={oy + fh}
                label={`L=${l}m`}
                offset={20}
              />
              <DimLine
                x1={ox}
                y1={oy}
                x2={ox}
                y2={oy + fh}
                label={`B=${b}m`}
                offset={-20}
                vertical
              />
              <text
                x={ox + fw / 2}
                y={oy + fh / 2 + 5}
                textAnchor="middle"
                fill={DC.outline}
                className="watermark-text"
                style={{
                  fontSize: 16,
                  fontFamily: "monospace",
                  fontWeight: 900,
                  letterSpacing: 3,
                  opacity: 0,
                }}
              >
                FOOTING PLAN
              </text>
              {hasStub && (
                <motion.rect
                  x={ox + fw / 2 - 30}
                  y={oy + fh / 2 - 30}
                  width={60}
                  height={60}
                  fill="rgba(0,0,0,0.1)"
                  stroke={DC.outline}
                  strokeWidth={1}
                  strokeDasharray="4,2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.6 }}
                  style={{ transformOrigin: `${ox + fw / 2}px ${oy + fh / 2}px` }}
                />
              )}
              <Callout
                px={ox + fw * 0.28}
                py={oy + fh * 0.14}
                lx={ox + fw / 2}
                ly={oy - 20}
                label={`Main Bar φ${md}mm @ ${spacing}mm c/c`}
                anchor="middle"
                color={DC.main}
              />
              <Callout
                px={ox + fw - cov}
                py={oy + fh * 0.42}
                lx={ox + fw / 2}
                ly={oy + fh + 45}
                label={`Dist Bar φ${dd}mm @ ${spacing}mm c/c`}
                anchor="middle"
                color={DC.dist}
              />
              <Callout
                px={ox + cov}
                py={oy + fh - cov}
                lx={20}
                ly={oy + fh / 2}
                label="Cover = 75 mm"
                anchor="start"
                color="#64748b"
              />
              <Legend
                x={W - 145}
                y={20}
                items={[
                  { color: DC.main, label: `Main φ${md}@${spacing}`, type: "line" },
                  { color: DC.dist, label: `Dist φ${dd}@${spacing}`, type: "line" },
                ]}
              />
            </BlueprintSVG>
          </motion.div>
        ) : (
          <motion.div key="section" {...viewTransition}>
            <BlueprintSVG
              width={sW}
              height={sH}
              title={`FOOTING — SECTION A-A  |  Cover: 75mm  |  D=${d}m`}
            >
              {/* Outer concrete body */}
              <motion.rect
                x={sox}
                y={soy}
                width={sw}
                height={sh}
                fill="url(#hatch)"
                stroke={DC.outline}
                strokeWidth="2"
                variants={scaleIn}
                style={{ transformOrigin: `${sox + sw / 2}px ${soy + sh}px` }}
              />
              
              {hasStub && (
                <motion.rect
                  x={sox + sw / 2 - 40}
                  y={soy - (+stubH * sSc)}
                  width={80}
                  height={(+stubH * sSc) + 2}
                  fill={DC.bg}
                  stroke={DC.outline}
                  strokeWidth="2"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                  style={{ transformOrigin: `${sox + sw / 2}px ${soy}px` }}
                />
              )}

              {/* Cover zone */}
              <motion.rect
                x={sox + scov}
                y={soy + scov}
                width={sw - 2 * scov}
                height={sh - 2 * scov}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="0.8"
                strokeDasharray="4,2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              />
              {/* Ground line */}
              <motion.line
                x1={sox - 15}
                y1={soy + sh}
                x2={sox + sw + 15}
                y2={soy + sh}
                stroke="#92400e"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.line
                  key={i}
                  x1={sox - 15 + (i * (sw + 30)) / 8}
                  y1={soy + sh}
                  x2={sox - 30 + (i * (sw + 30)) / 8}
                  y2={soy + sh + 10}
                  stroke="#92400e"
                  strokeWidth="1"
                  className="soil-wave"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                />
              ))}

              {/* Dowels/Starters */}
              {hasStub && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.path
                    d={`M ${sox + sw / 2 - 25} ${soy + sh - scov} L ${sox + sw / 2 - 10} ${soy + sh - scov} L ${sox + sw / 2 - 10} ${soy - (+stubH * sSc) - 20}`}
                    fill="none" stroke="#2980b9" strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  />
                  <motion.path
                    d={`M ${sox + sw / 2 + 25} ${soy + sh - scov} L ${sox + sw / 2 + 10} ${soy + sh - scov} L ${sox + sw / 2 + 10} ${soy - (+stubH * sSc) - 20}`}
                    fill="none" stroke="#2980b9" strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.85 }}
                  />
                  <Callout
                    px={sox + sw / 2 + 10}
                    py={soy - (+stubH * sSc) / 2}
                    lx={sox + sw - 20}
                    ly={soy - (+stubH * sSc) / 2}
                    label={`Stub column / Pedestal`}
                    anchor="start"
                    color={DC.outline}
                  />
                   <Callout
                    px={sox + sw / 2 - 10}
                    py={soy - (+stubH * sSc) - 10}
                    lx={sox + 10}
                    ly={soy - (+stubH * sSc) - 20}
                    label={`Dowels 40d`}
                    anchor="start"
                    color="#2980b9"
                  />
                </motion.g>
              )}

              {/* Main bars in section */}
              <motion.g variants={staggerContainer} initial="hidden" animate="visible">
                {secMainXs.map((x, i) => (
                  <RebarDot
                    key={i}
                    cx={x}
                    cy={soy + sh - scov}
                    dia={md}
                    color={DC.main}
                  />
                ))}
              </motion.g>
              {/* Dist bars */}
              <motion.line
                x1={sox + scov}
                y1={soy + sh - scov}
                x2={sox + sw - scov}
                y2={soy + sh - scov}
                stroke={DC.dist}
                strokeWidth="2"
                opacity="0.7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
              {/* Top bars hint */}
              <motion.line
                x1={sox + scov}
                y1={soy + scov}
                x2={sox + sw - scov}
                y2={soy + scov}
                stroke={DC.dist}
                strokeWidth="1"
                strokeDasharray="6,3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 0.6, delay: 0.55 }}
              />
              {/* Section label */}
              <text
                x={sox + sw / 2}
                y={soy + sh / 2 + 4}
                textAnchor="middle"
                fill={DC.outline}
                className="watermark-text"
                style={{
                  fontSize: 15,
                  fontFamily: "monospace",
                  fontWeight: 900,
                  letterSpacing: 3,
                  opacity: 0,
                }}
              >
                SECTION
              </text>
              {/* Section cut markers */}
              <motion.text
                x={sox - 20}
                y={soy - 5}
                textAnchor="middle"
                fill={DC.dim}
                style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", delay: 0.3 }}
              >
                A
              </motion.text>
              <motion.text
                x={sox + sw + 20}
                y={soy - 5}
                textAnchor="middle"
                fill={DC.dim}
                style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", delay: 0.35 }}
              >
                A
              </motion.text>
              <DimLine
                x1={sox}
                y1={soy + sh}
                x2={sox + sw}
                y2={soy + sh}
                label={`L=${l}m`}
                offset={25}
              />
              <DimLine
                x1={sox}
                y1={soy}
                x2={sox}
                y2={soy + sh}
                label={`D=${d}m`}
                offset={-22}
                vertical
              />
              <Callout
                px={secMainXs[0]}
                py={soy + sh - scov}
                lx={10}
                ly={soy + sh / 2}
                label={`Main Bar φ${md}mm × ${nMain} nos`}
                anchor="start"
                color={DC.main}
              />
              <Callout
                px={sox + sw / 2}
                py={soy + sh - scov}
                lx={sox + sw / 2}
                ly={soy + sh + 45}
                label={`Dist Bar φ${dd}mm (horiz)`}
                anchor="middle"
                color={DC.dist}
              />
              <Callout
                px={sox + scov}
                py={soy + sh - scov / 2}
                lx={sox + sw / 2}
                ly={soy - 30}
                label="Cover = 75 mm"
                anchor="middle"
                color="#64748b"
              />
              <Legend
                x={sW - 145}
                y={20}
                items={[
                  { color: DC.main, label: `Main φ${md}×${nMain}`, type: "circle" },
                  { color: DC.dist, label: `Dist φ${dd}`, type: "line" },
                ]}
              />
            </BlueprintSVG>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
