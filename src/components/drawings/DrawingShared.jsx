import React from "react";

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
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      style={{
        maxWidth: "100%",
        display: "block",
        margin: "0 auto",
        borderRadius: 6,
        border: "1.5px solid #aac8e8",
        background: DC.bg,
      }}
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
        </pattern>
      </defs>
      <rect width={width} height={height} fill={DC.bg} />
      {gridLines}
      <rect
        x="2"
        y="2"
        width={width - 4}
        height={height - 4}
        fill="none"
        stroke={DC.outline}
        strokeWidth="1.5"
      />
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
      {children}
    </svg>
  );
}

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
      <g>
        <line
          x1={mx}
          y1={y1}
          x2={mx}
          y2={y2}
          stroke={DC.dim}
          strokeWidth="0.8"
          markerStart="url(#arr-l)"
          markerEnd="url(#arr-r)"
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
        <text
          x={mx - 5}
          y={my}
          textAnchor="middle"
          fill={DC.dim}
          style={font}
          transform={`rotate(-90,${mx - 5},${my})`}
        >
          {label}
        </text>
      </g>
    );
  }
  const mx = (x1 + x2) / 2,
    my = y1 + offset;
  return (
    <g>
      <line
        x1={x1}
        y1={my}
        x2={x2}
        y2={my}
        stroke={DC.dim}
        strokeWidth="0.8"
        markerStart="url(#arr-l)"
        markerEnd="url(#arr-r)"
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
      <text x={mx} y={my + 10} textAnchor="middle" fill={DC.dim} style={font}>
        {label}
      </text>
    </g>
  );
}

export function RebarDot({ cx, cy, dia, color, label }) {
  const r = Math.max(3, Math.min(8, dia / 3));
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r + 2}
        fill="white"
        stroke={color}
        strokeWidth="1"
      />
      <circle cx={cx} cy={cy} r={r} fill={color} opacity="0.85" />
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
    </g>
  );
}

export function Legend({ items, x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
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
        <g key={i} transform={`translate(6,${14 + i * 20})`}>
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
        </g>
      ))}
    </g>
  );
}

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
    <g>
      <circle cx={px} cy={py} r={2.5} fill={color} opacity={0.9} />
      <line
        x1={px}
        y1={py}
        x2={lx}
        y2={ly}
        stroke={color}
        strokeWidth={0.75}
        strokeDasharray="4,2"
        opacity={0.75}
      />
      <rect
        x={bx}
        y={ly - 9}
        width={bw}
        height={12}
        rx={2}
        fill="rgba(255,255,255,0.88)"
      />
      <text
        x={lx}
        y={ly}
        textAnchor={anchor}
        fill={color}
        style={{
          fontSize: 13,
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 700,
        }}
      >
        {label}
      </text>
    </g>
  );
}
