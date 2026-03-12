import React from "react";
import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════
   Design Constants
   ═══════════════════════════════════════════════════════ */
export const DC = {
  concrete: "#dbe8f5",
  outline: "#1e6091",
  main: "#c0392b",
  dist: "#27ae60",
  top: "#8e44ad",
  tie: "#d35400",
  dim: "#2c3e50",
  bg: "#f0f6ff",
  grid: "#cce0f5",
  label: "#1a3a5c",
};

/* ═══════════════════════════════════════════════════════
   Framer Motion — Shared Variants
   ═══════════════════════════════════════════════════════ */

// Container that staggers children entrance
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.15,
    },
  },
};

// Fade + slight scale up
export const fadeInUp = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

// Scale from center
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

// Slide in from left
export const slideInLeft = {
  hidden: { opacity: 0, x: -15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 250, damping: 22 },
  },
};

// Slide in from right
export const slideInRight = {
  hidden: { opacity: 0, x: 15 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 250, damping: 22 },
  },
};

// Pop in (for dots / circles)
export const popIn = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 15 },
  },
};

// Draw line (stroke-dashoffset based)
export const drawLine = {
  hidden: { pathLength: 0, opacity: 0.3 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

/* ═══════════════════════════════════════════════════════
   BlueprintSVG — Animated Container
   ═══════════════════════════════════════════════════════ */
export function BlueprintSVG({ width = 420, height = 300, title, children }) {
  const gridLines = [];
  for (let x = 0; x <= width; x += 20)
    gridLines.push(
      <line
        key={`v${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke={DC.grid}
        strokeWidth="0.5"
      />,
    );
  for (let y = 0; y <= height; y += 20)
    gridLines.push(
      <line
        key={`h${y}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke={DC.grid}
        strokeWidth="0.5"
      />,
    );

  return (
    <motion.svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      style={{
        maxWidth: "100%",
        display: "block",
        margin: "0 auto",
        borderRadius: 6,
        border: "1.5px solid #aac8e8",
        background: DC.bg,
        overflow: "hidden",
      }}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <defs>
        <marker
          id="arr-r"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0,0 L0,7 L7,3.5z" fill={DC.dim} />
        </marker>
        <marker
          id="arr-l"
          markerWidth="7"
          markerHeight="7"
          refX="1"
          refY="3.5"
          orient="auto"
        >
          <path d="M7,0 L7,7 L0,3.5z" fill={DC.dim} />
        </marker>
        <pattern
          id="hatch"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="#b0c8e0"
            strokeWidth="1.5"
          />
          {/* Shimmer animation on hatch */}
          <animateTransform
            attributeName="patternTransform"
            type="translate"
            from="0 0"
            to="6 0"
            dur="4s"
            repeatCount="indefinite"
            additive="sum"
          />
        </pattern>
        {/* Glow filter for hover effects */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Scan line gradient */}
        <linearGradient id="scanGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(30,96,145,0)" />
          <stop offset="40%" stopColor="rgba(30,96,145,0.08)" />
          <stop offset="50%" stopColor="rgba(30,96,145,0.15)" />
          <stop offset="60%" stopColor="rgba(30,96,145,0.08)" />
          <stop offset="100%" stopColor="rgba(30,96,145,0)" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width={width} height={height} fill={DC.bg} />
      {gridLines}

      {/* Scan line overlay */}
      <motion.rect
        x={0}
        y={0}
        width={width * 0.3}
        height={height}
        fill="url(#scanGrad)"
        initial={{ x: -width * 0.3, opacity: 0.6 }}
        animate={{ x: width + 10, opacity: 0 }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
        pointerEvents="none"
      />

      {children}

      {/* Border (renders on top) */}
      <rect
        x="2"
        y="2"
        width={width - 4}
        height={height - 4}
        fill="none"
        stroke={DC.outline}
        strokeWidth="1.5"
      />

      {/* Title bar (renders on top of drawings) */}
      <motion.g variants={fadeInUp}>
        <rect
          x="2"
          y="2"
          width={width - 4}
          height="34"
          fill="#d6eaf8"
          stroke={DC.outline}
          strokeWidth="1"
        />
        <text
          x={width / 2}
          y="22"
          textAnchor="middle"
          alignmentBaseline="middle"
          fill={DC.label}
          style={{
            fontSize: 12,
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          {title}
        </text>
      </motion.g>
    </motion.svg>
  );
}

/* ═══════════════════════════════════════════════════════
   DimLine — Animated Dimension Line
   ═══════════════════════════════════════════════════════ */
export function DimLine({
  x1,
  y1,
  x2,
  y2,
  label,
  offset = 0,
  vertical = false,
}) {
  const font = { fontSize: 14, fontFamily: "'IBM Plex Mono', monospace" };
  if (vertical) {
    const mx = x1 + offset,
      my = (y1 + y2) / 2;
    return (
      <motion.g variants={slideInLeft} className="blueprint-element-hover">
        <motion.line
          x1={mx}
          y1={y1}
          x2={mx}
          y2={y2}
          stroke={DC.dim}
          strokeWidth="0.8"
          markerStart="url(#arr-l)"
          markerEnd="url(#arr-r)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
        />
        <line
          x1={x1}
          y1={y1}
          x2={mx + 4}
          y2={y1}
          stroke={DC.dim}
          strokeWidth="0.5"
          strokeDasharray="3,2"
        />
        <line
          x1={x1}
          y1={y2}
          x2={mx + 4}
          y2={y2}
          stroke={DC.dim}
          strokeWidth="0.5"
          strokeDasharray="3,2"
        />
        <motion.text
          x={mx - 5}
          y={my}
          textAnchor="middle"
          fill={DC.dim}
          style={font}
          transform={`rotate(-90,${mx - 5},${my})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          {label}
        </motion.text>
      </motion.g>
    );
  }
  const mx = (x1 + x2) / 2,
    my = y1 + offset;
  return (
    <motion.g variants={fadeInUp} className="blueprint-element-hover">
      <motion.line
        x1={x1}
        y1={my}
        x2={x2}
        y2={my}
        stroke={DC.dim}
        strokeWidth="0.8"
        markerStart="url(#arr-l)"
        markerEnd="url(#arr-r)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
      />
      <line
        x1={x1}
        y1={y1}
        x2={x1}
        y2={my + 4}
        stroke={DC.dim}
        strokeWidth="0.5"
        strokeDasharray="3,2"
      />
      <line
        x1={x2}
        y1={y1}
        x2={x2}
        y2={my + 4}
        stroke={DC.dim}
        strokeWidth="0.5"
        strokeDasharray="3,2"
      />
      <motion.text
        x={mx}
        y={my + 10}
        textAnchor="middle"
        fill={DC.dim}
        style={font}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        {label}
      </motion.text>
    </motion.g>
  );
}

/* ═══════════════════════════════════════════════════════
   RebarDot — Animated with Pulse
   ═══════════════════════════════════════════════════════ */
export function RebarDot({ cx, cy, dia, color, label }) {
  const r = Math.max(3, Math.min(8, dia / 3));
  return (
    <motion.g
      variants={popIn}
      className="rebar-dot-pulse"
      whileHover={{ scale: 1.3, filter: "url(#glow)" }}
    >
      <circle
        cx={cx}
        cy={cy}
        r={r + 2}
        fill="white"
        stroke={color}
        strokeWidth="1"
      />
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        opacity="0.85"
      />
      {label && (
        <text
          x={cx + r + 4}
          y={cy + 4}
          fill={color}
          style={{ fontSize: 13, fontFamily: "'IBM Plex Mono', monospace" }}
        >
          {label}
        </text>
      )}
    </motion.g>
  );
}

/* ═══════════════════════════════════════════════════════
   Legend — Animated Slide-In
   ═══════════════════════════════════════════════════════ */
export function Legend({ items, x, y }) {
  return (
    <motion.g
      transform={`translate(${x},${y})`}
      variants={slideInRight}
      className="legend-hover"
    >
      <rect
        width="115"
        height={items.length * 20 + 8}
        rx="3"
        fill="white"
        stroke="#aac8e8"
        strokeWidth="0.8"
        opacity="0.95"
      />
      {items.map((item, i) => (
        <motion.g
          key={i}
          transform={`translate(6,${14 + i * 20})`}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 + i * 0.1, type: "spring", stiffness: 200 }}
        >
          {item.type === "circle" ? (
            <circle cx="7" cy="0" r="5" fill={item.color} opacity="0.85" />
          ) : (
            <line
              x1="0"
              y1="0"
              x2="16"
              y2="0"
              stroke={item.color}
              strokeWidth={item.dashed ? 0 : 2}
              strokeDasharray={item.dashed ? "4,2" : undefined}
            />
          )}
          <text
            x="20"
            y="4"
            fill={DC.label}
            style={{ fontSize: 13, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {item.label}
          </text>
        </motion.g>
      ))}
    </motion.g>
  );
}

/* ═══════════════════════════════════════════════════════
   Callout — Animated Fly-In
   ═══════════════════════════════════════════════════════ */
export function Callout({
  px,
  py,
  lx,
  ly,
  label = "",
  anchor = "start",
  color = "#1a3a5c",
}) {
  const sl = label.length;
  const bw = sl * 4.7 + 8;
  const bx =
    anchor === "end" ? lx - bw + 2 : anchor === "middle" ? lx - bw / 2 : lx - 2;
  return (
    <motion.g
      className="callout-hover"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.6 }}
      whileHover={{ scale: 1.04 }}
    >
      <motion.circle
        cx={px}
        cy={py}
        r={2.5}
        fill={color}
        opacity={0.9}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 400 }}
      />
      <motion.line
        x1={px}
        y1={py}
        x2={lx}
        y2={ly}
        stroke={color}
        strokeWidth={0.75}
        strokeDasharray="4,2"
        opacity={0.75}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      />
      <rect
        x={bx}
        y={ly - 9}
        width={bw}
        height={14}
        rx={2}
        fill="rgba(240,246,255,0.92)"
        stroke="rgba(170,200,232,0.3)"
        strokeWidth="0.5"
      />
      <motion.text
        x={lx}
        y={ly}
        textAnchor={anchor}
        fill={color}
        style={{
          fontSize: 13,
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.3 }}
      >
        {label}
      </motion.text>
    </motion.g>
  );
}
