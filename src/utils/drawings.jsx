// src/utils/drawings.jsx — SVG Blueprint Drawing Components

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
        maxWidth: width,
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
        height="20"
        fill="#d6eaf8"
        stroke={DC.outline}
        strokeWidth="1"
      />
      <text
        x={width / 2}
        y="15"
        textAnchor="middle"
        fill={DC.label}
        style={{
          fontSize: 10,
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 600,
          letterSpacing: 1.5,
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
  const font = { fontSize: 9, fontFamily: "'IBM Plex Mono', monospace" };
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
          style={{ fontSize: 8, fontFamily: "'IBM Plex Mono', monospace" }}
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
        height={items.length * 16 + 10}
        rx="3"
        fill="white"
        stroke="#aac8e8"
        strokeWidth="0.8"
        opacity="0.95"
      />
      {items.map((item, i) => (
        <g key={i} transform={`translate(6,${12 + i * 16})`}>
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
            style={{ fontSize: 8, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {item.label}
          </text>
        </g>
      ))}
    </g>
  );
}

// ─── EXISTING DRAWINGS ────────────────────────────────────────────────────────

export function DrawingFooting({ L, B, mainDia, distDia, spacing }) {
  const l = +L || 1.5,
    b = +B || 1.5,
    sp = +spacing / 1000,
    md = +mainDia,
    dd = +distDia;
  const W = 420,
    H = 300,
    pad = 55;
  const scale = Math.min((W - 2 * pad) / l, (H - 2 * pad) / b, 100);
  const fw = l * scale,
    fh = b * scale,
    ox = (W - fw) / 2,
    oy = (H - fh) / 2 + 5,
    cov = 0.075 * scale;
  const mBars = [],
    dBars = [];
  for (let x = cov; x < fw - cov + 0.5; x += sp * scale) mBars.push(x);
  for (let y = cov; y < fh - cov + 0.5; y += sp * scale) dBars.push(y);
  return (
    <BlueprintSVG
      width={W}
      height={H}
      title={`FOOTING — PLAN VIEW  |  Cover: 75mm  |  IS 456 Cl.34`}
    >
      <rect
        x={ox}
        y={oy}
        width={fw}
        height={fh}
        fill="url(#hatch)"
        stroke={DC.outline}
        strokeWidth="2"
      />
      {dBars.map((y, i) => (
        <line
          key={`d${i}`}
          x1={ox}
          y1={oy + y}
          x2={ox + fw}
          y2={oy + y}
          stroke={DC.dist}
          strokeWidth="1.5"
        />
      ))}
      {mBars.map((x, i) => (
        <line
          key={`m${i}`}
          x1={ox + x}
          y1={oy}
          x2={ox + x}
          y2={oy + fh}
          stroke={DC.main}
          strokeWidth="1.5"
        />
      ))}
      <DimLine
        x1={ox}
        y1={oy + fh}
        x2={ox + fw}
        y2={oy + fh}
        label={`${l}m`}
        offset={20}
      />
      <DimLine
        x1={ox}
        y1={oy}
        x2={ox}
        y2={oy + fh}
        label={`${b}m`}
        offset={-20}
        vertical
      />
      <Legend
        x={W - 125}
        y={oy}
        items={[
          { color: DC.main, label: `Main φ${md}@${spacing}`, type: "line" },
          { color: DC.dist, label: `Dist φ${dd}@${spacing}`, type: "line" },
        ]}
      />
    </BlueprintSVG>
  );
}

export function DrawingColumn({ B, D, mainDia, mainNos, tieDia, tieSpacing }) {
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
    oy = 32,
    cov = (40 / 1000) * scale;
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
    eH = H - 64,
    spPx = Math.max(10, (+tieSpacing / 1000) * scale),
    nT = Math.ceil(eH / spPx) + 1;
  return (
    <BlueprintSVG
      width={W}
      height={H}
      title={`COLUMN — CROSS-SECTION + ELEVATION  |  Cover: 40mm  |  IS 456 Cl.26.5`}
    >
      <rect
        x={ox}
        y={oy}
        width={bw}
        height={dh}
        fill="url(#hatch)"
        stroke={DC.outline}
        strokeWidth="2"
      />
      <rect
        x={ox + cov}
        y={oy + cov}
        width={bw - 2 * cov}
        height={dh - 2 * cov}
        fill="none"
        stroke={DC.tie}
        strokeWidth="1.8"
        strokeDasharray="5,2"
      />
      {bars.map((p, i) => (
        <RebarDot key={i} cx={p[0]} cy={p[1]} dia={md} color={DC.main} />
      ))}
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
      <rect
        x={eOx}
        y={oy}
        width={eW}
        height={eH}
        fill="#e8f4fd"
        stroke={DC.outline}
        strokeWidth="1.5"
      />
      <line
        x1={eOx + 4}
        y1={oy}
        x2={eOx + 4}
        y2={oy + eH}
        stroke={DC.main}
        strokeWidth="1.5"
      />
      <line
        x1={eOx + eW - 4}
        y1={oy}
        x2={eOx + eW - 4}
        y2={oy + eH}
        stroke={DC.main}
        strokeWidth="1.5"
      />
      {Array.from({ length: nT }).map((_, i) => (
        <line
          key={i}
          x1={eOx}
          y1={oy + i * spPx}
          x2={eOx + eW}
          y2={oy + i * spPx}
          stroke={DC.tie}
          strokeWidth="1.5"
        />
      ))}
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

// FIX #9 — DrawingBeam elevation: stirrups are now drawn as individual horizontal
// lines at their correct spacing positions, not as full-height overlapping rects.
// Dense zone shading is shown at each end (L/4), normal zone in the middle.
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
  const denseW = eW * 0.25;

  // FIX #9 — compute stirrup line positions scaled to elevation height
  // Dense zone: L/4 each end at spacing/2; Normal zone: middle L/2 at spacing
  // We represent the elevation as dh tall, so scale spacing to pixels
  const normalSpPx = Math.max(10, (+stirSpacing / 1000) * scale);
  const denseSpPx = normalSpPx / 2;
  const denseZoneH = dh * 0.25; // L/4 of beam = 25% of elevation height

  // Collect stirrup y positions
  const stirrupYs = [];
  // Dense zone — left (top in elevation = start of beam)
  for (let y = 0; y <= denseZoneH; y += denseSpPx) {
    stirrupYs.push({ y: oy + y, dense: true });
  }
  // Normal zone — middle
  for (
    let y = denseZoneH + normalSpPx;
    y <= dh - denseZoneH - normalSpPx;
    y += normalSpPx
  ) {
    stirrupYs.push({ y: oy + y, dense: false });
  }
  // Dense zone — right (bottom in elevation = end of beam)
  for (let y = dh - denseZoneH; y <= dh; y += denseSpPx) {
    stirrupYs.push({ y: oy + y, dense: true });
  }

  return (
    <BlueprintSVG
      width={W}
      height={H}
      title={`BEAM — CROSS-SECTION + STIRRUP ZONES  |  Cover: ${coverType === "wallBeam" ? 25 : 40}mm`}
    >
      <rect
        x={ox}
        y={oy}
        width={bw}
        height={dh}
        fill="url(#hatch)"
        stroke={DC.outline}
        strokeWidth="2"
      />
      <rect
        x={ox + cov}
        y={oy + cov}
        width={bw - 2 * cov}
        height={dh - 2 * cov}
        fill="none"
        stroke={DC.tie}
        strokeWidth="1.8"
        strokeDasharray="5,2"
      />
      {botXs.map((x, i) => (
        <RebarDot key={i} cx={x} cy={botY} dia={+botDia} color={DC.main} />
      ))}
      {topXs.map((x, i) => (
        <RebarDot key={i} cx={x} cy={topY} dia={+topDia} color={DC.top} />
      ))}
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
      <rect
        x={eX}
        y={oy}
        width={eW}
        height={dh}
        fill="#e8f4fd"
        stroke={DC.outline}
        strokeWidth="1.5"
      />
      {/* Dense zone shading — each end */}
      <rect
        x={eX}
        y={oy}
        width={eW}
        height={denseZoneH}
        fill="rgba(220,38,38,.08)"
        stroke="none"
      />
      <rect
        x={eX}
        y={oy + dh - denseZoneH}
        width={eW}
        height={denseZoneH}
        fill="rgba(220,38,38,.08)"
        stroke="none"
      />
      {/* Zone labels */}
      <text
        x={eX + eW / 2}
        y={oy - 3}
        textAnchor="middle"
        fill="#dc2626"
        style={{ fontSize: 7, fontFamily: "monospace" }}
      >
        DENSE
      </text>
      <text
        x={eX + eW / 2}
        y={oy + dh / 2}
        textAnchor="middle"
        fill="#059669"
        style={{ fontSize: 7, fontFamily: "monospace" }}
      >
        NORMAL
      </text>
      {/* Longitudinal bars in elevation */}
      <line
        x1={eX + 3}
        y1={oy}
        x2={eX + 3}
        y2={oy + dh}
        stroke={DC.main}
        strokeWidth="1.5"
      />
      <line
        x1={eX + eW - 3}
        y1={oy}
        x2={eX + eW - 3}
        y2={oy + dh}
        stroke={DC.main}
        strokeWidth="1.5"
      />
      {/* FIX #9 — Draw individual stirrup lines at correct positions */}
      {stirrupYs.map((s, i) => (
        <line
          key={i}
          x1={eX + 2}
          y1={s.y}
          x2={eX + eW - 2}
          y2={s.y}
          stroke={s.dense ? "#dc2626" : DC.tie}
          strokeWidth={s.dense ? 1.5 : 1.2}
          opacity={0.85}
        />
      ))}
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

export function DrawingSlab({
  L,
  B,
  mainDia,
  distDia,
  mainSp,
  distSp,
  topDia,
}) {
  const l = +L || 4,
    b = +B || 3;
  const W = 420,
    H = 300,
    pad = 52;
  const scale = Math.min((W - 2 * pad) / l, (H - 2 * pad) / b, 60);
  const sw = l * scale,
    sh = b * scale,
    ox = (W - sw) / 2,
    oy = (H - sh) / 2 + 5;
  const msp = ((+mainSp || 150) / 1000) * scale,
    dsp = ((+distSp || 200) / 1000) * scale;
  const mBars = [],
    dBars = [];
  for (let x = 0; x < sw + 0.5; x += msp) mBars.push(x);
  for (let y = 0; y < sh + 0.5; y += dsp) dBars.push(y);
  return (
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
      <Legend
        x={W - 130}
        y={oy}
        items={[
          { color: DC.main, label: `Main φ${mainDia}@${mainSp}`, type: "line" },
          { color: DC.dist, label: `Dist φ${distDia}@${distSp}`, type: "line" },
          { color: DC.top, label: `Top φ${topDia} zone`, type: "line" },
        ]}
      />
    </BlueprintSVG>
  );
}

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

// ─── NEW DRAWINGS ─────────────────────────────────────────────────────────────

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

  // FIX #9 applied to lintel elevation too: draw individual stirrup lines
  const stirrupYs = [];
  for (let y = 0; y <= dh; y += spPx) stirrupYs.push(y);

  return (
    <BlueprintSVG
      width={W}
      height={H}
      title={`LINTEL${hasChajja ? " + CHAJJA" : ""} — SECTION  |  Cover: 25mm  |  IS 456`}
    >
      {/* Lintel body */}
      <rect
        x={ox}
        y={oy}
        width={bw}
        height={dh}
        fill="url(#hatch)"
        stroke={DC.outline}
        strokeWidth="2"
      />
      <rect
        x={ox + cov}
        y={oy + cov}
        width={bw - 2 * cov}
        height={dh - 2 * cov}
        fill="none"
        stroke={DC.tie}
        strokeWidth="1.5"
        strokeDasharray="4,2"
      />
      {botXs.map((x, i) => (
        <RebarDot key={i} cx={x} cy={botY} dia={+botDia} color={DC.main} />
      ))}
      {topXs.map((x, i) => (
        <RebarDot key={i} cx={x} cy={topY} dia={+topDia} color={DC.top} />
      ))}
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

      {/* Chajja */}
      {hasChajja && (
        <g>
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
            style={{ fontSize: 8, fontFamily: "monospace" }}
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
        </g>
      )}

      {/* Elevation */}
      <rect
        x={eX}
        y={oy}
        width={eW}
        height={dh}
        fill="#e8f4fd"
        stroke={DC.outline}
        strokeWidth="1.5"
      />
      <line
        x1={eX + 3}
        y1={oy}
        x2={eX + 3}
        y2={oy + dh}
        stroke={DC.main}
        strokeWidth="1.5"
      />
      <line
        x1={eX + eW - 3}
        y1={oy}
        x2={eX + eW - 3}
        y2={oy + dh}
        stroke={DC.main}
        strokeWidth="1.5"
      />
      {/* FIX #9 — individual stirrup lines at correct positions */}
      {stirrupYs.map((y, i) => (
        <line
          key={i}
          x1={eX + 2}
          y1={oy + y}
          x2={eX + eW - 2}
          y2={oy + y}
          stroke={DC.tie}
          strokeWidth="1.2"
          opacity={0.8}
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

export function DrawingRaft({ L, B, mainDia, distDia, mainSp, distSp }) {
  const l = +L || 8,
    b = +B || 6;
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
  return (
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
  );
}

export function DrawingPileCap({
  L,
  B,
  mainDia,
  distDia,
  spacing,
  nPiles,
  pileDia,
}) {
  const l = +L || 2,
    b = +B || 2;
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

  return (
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
            style={{ fontSize: 8, fontFamily: "monospace", fontWeight: 700 }}
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
  );
}
