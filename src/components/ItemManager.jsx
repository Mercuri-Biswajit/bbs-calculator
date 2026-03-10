// src/components/ItemManager.jsx
// ALL dimensions in METRES. ALL spacings in mm.

import React, { useState } from "react";
import { Card, Field, DiaSelect, Button, Badge } from "./ui.jsx";
import {
  DrawingFooting,
  DrawingColumn,
  DrawingBeam,
  DrawingSlab,
  DrawingStaircase,
  DrawingLintel,
  DrawingRaft,
  DrawingPileCap,
} from "../utils/drawings.jsx";

export const DEFAULTS = {
  footing: {
    label: "Footing F1",
    count: 1,
    L: "1.5",
    B: "1.5",
    D: "0.45",
    mainDia: "12",
    distDia: "12",
    spacing: "150",
    hasStub: false,
    stubH: "0.45",
    colDia: "16",
    colNos: "4",
  },
  column: {
    label: "Column C1",
    count: 1,
    H: "3",
    B: "0.3",
    D: "0.3",
    mainDia: "16",
    mainNos: "4",
    tieDia: "8",
    tieSpacing: "150",
  },
  plinthBeam: {
    label: "Plinth Beam PB1",
    count: 1,
    L: "4",
    B: "0.23",
    D: "0.45",
    botDia: "16",
    botNos: "3",
    topDia: "12",
    topNos: "2",
    exTopDia: "12",
    exTopNos: "1",
    stirDia: "8",
    stirSpacing: "150",
    hasTorsion: false,
    torsDia: "12",
    torsNos: "0",
  },
  wallBeam: {
    label: "Wall Beam WB1",
    count: 1,
    L: "4",
    B: "0.23",
    D: "0.35",
    botDia: "12",
    botNos: "3",
    topDia: "10",
    topNos: "2",
    exTopDia: "10",
    exTopNos: "0",
    stirDia: "8",
    stirSpacing: "200",
    hasTorsion: false,
    torsDia: "10",
    torsNos: "0",
  },
  slab: {
    label: "Slab S1",
    count: 1,
    L: "4",
    B: "3",
    D: "0.125",
    mainDia: "10",
    distDia: "8",
    mainSp: "150",
    distSp: "200",
    topDia: "8",
    topSp: "150",
    slabType: "2-way",
  },
  staircase: {
    label: "Staircase ST1",
    count: 1,
    flightLen: "3.5",
    width: "1.2",
    waistThick: "0.15",
    mainDia: "10",
    mainSp: "150",
    distDia: "8",
    distSp: "200",
  },
  lintel: {
    label: "Lintel L1",
    count: 1,
    L: "1.5",
    B: "0.23",
    D: "0.15",
    botDia: "12",
    botNos: "2",
    topDia: "10",
    topNos: "2",
    stirDia: "8",
    stirSpacing: "150",
    hasChajja: false,
    chajjaL: "0.6",
    chajjaD: "0.1",
    chajjaDia: "8",
    chajjaSp: "150",
  },
  raft: {
    label: "Raft RF1",
    count: 1,
    L: "8",
    B: "6",
    D: "0.3",
    mainDia: "12",
    distDia: "12",
    mainSp: "150",
    distSp: "150",
    hasCrank: true,
    crankDia: "12",
    crankSp: "150",
  },
  pileCap: {
    label: "Pile Cap PC1",
    count: 1,
    L: "2",
    B: "2",
    D: "0.6",
    mainDia: "16",
    distDia: "16",
    spacing: "150",
    nPiles: "4",
    pileDia: "300",
  },
};

// FIX #6 — use crypto.randomUUID() so IDs are stable even in React 18 StrictMode
// double-invocation, avoiding the stale module-level counter problem.
const genId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const newItem = (type) => ({ id: genId(), ...DEFAULTS[type] });

const MF = ({ label, value, onChange }) => (
  <Field
    label={label}
    value={value}
    onChange={onChange}
    unit="m"
    step="0.01"
    min="0"
  />
);
const MMF = ({ label, value, onChange }) => (
  <Field
    label={label}
    value={value}
    onChange={onChange}
    unit="mm"
    step="10"
    min="50"
  />
);
const NF = ({ label, value, onChange }) => (
  <Field
    label={label}
    value={value}
    onChange={onChange}
    unit="nos"
    step="1"
    min="1"
  />
);

// ─── FORMS ────────────────────────────────────────────────────────────────────

function FootingForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div>
      <div className="form-grid">
        <MF label="Length L" value={item.L} onChange={u("L")} />
        <MF label="Width B" value={item.B} onChange={u("B")} />
        <MF label="Depth D" value={item.D} onChange={u("D")} />
        <MMF label="Bar Spacing" value={item.spacing} onChange={u("spacing")} />
        <DiaSelect
          label="Main Bar Dia"
          value={item.mainDia}
          onChange={u("mainDia")}
        />
        <DiaSelect
          label="Dist Bar Dia"
          value={item.distDia}
          onChange={u("distDia")}
        />
      </div>

      <div className="feature-panel feature-panel--stub">
        <label className="feature-panel__toggle">
          <input
            type="checkbox"
            checked={!!item.hasStub}
            onChange={(e) => onChange("hasStub", e.target.checked)}
          />
          🏗 Include Stub Column / Pedestal (Footing top → Plinth Beam soffit)
        </label>

        {item.hasStub && (
          <div>
            <div className="stub-info-note">
              📐 <b>Stub = Footing top to Plinth Beam soffit.</b> Starter bars
              go <b>40d into footing</b> + stub height +{" "}
              <b>40d lap into superstructure column</b> (IS 456 Cl.26.2). Ties
              @150mm (dense zone as per IS 456 Cl.26.5.3).
            </div>
            <div className="feature-panel__body form-grid">
              <MF
                label="Stub Height (Footing top → PB soffit)"
                value={item.stubH}
                onChange={u("stubH")}
              />
              <NF
                label="No. of Starter / Dowel Bars"
                value={item.colNos}
                onChange={u("colNos")}
              />
              <DiaSelect
                label="Starter Bar Dia (= Col main bar)"
                value={item.colDia}
                onChange={u("colDia")}
              />
              <div className="stub-calc-preview">
                <div className="stub-calc-preview__label">
                  📏 Starter bar cut length:
                </div>
                <div className="stub-calc-preview__value">
                  40d ({((40 * +item.colDia) / 1000).toFixed(3)}m) +{" "}
                  {(+item.stubH).toFixed(3)}m + 40d (
                  {((40 * +item.colDia) / 1000).toFixed(3)}m)
                  {" = "}
                  <b>
                    {(((40 * +item.colDia) / 1000) * 2 + +item.stubH).toFixed(
                      3,
                    )}{" "}
                    m
                  </b>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ColumnForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div className="form-grid">
      <MF label="Storey Height H" value={item.H} onChange={u("H")} />
      <MF label="Width B" value={item.B} onChange={u("B")} />
      <MF label="Depth D" value={item.D} onChange={u("D")} />
      <NF
        label="No. of Main Bars"
        value={item.mainNos}
        onChange={u("mainNos")}
      />
      <DiaSelect
        label="Main Bar Dia"
        value={item.mainDia}
        onChange={u("mainDia")}
      />
      <DiaSelect
        label="Lateral Tie Dia"
        value={item.tieDia}
        onChange={u("tieDia")}
      />
      <MMF
        label="Tie Spacing"
        value={item.tieSpacing}
        onChange={u("tieSpacing")}
      />
    </div>
  );
}

function BeamForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div>
      <div className="form-grid">
        <MF label="Span L" value={item.L} onChange={u("L")} />
        <MF label="Width B" value={item.B} onChange={u("B")} />
        <MF label="Depth D" value={item.D} onChange={u("D")} />
        <NF
          label="No. Bottom Bars"
          value={item.botNos}
          onChange={u("botNos")}
        />
        <DiaSelect
          label="Bottom Bar Dia"
          value={item.botDia}
          onChange={u("botDia")}
        />
        <NF label="No. Top Bars" value={item.topNos} onChange={u("topNos")} />
        <DiaSelect
          label="Top Bar Dia"
          value={item.topDia}
          onChange={u("topDia")}
        />
        <NF
          label="No. Extra Top Bars"
          value={item.exTopNos}
          onChange={u("exTopNos")}
        />
        <DiaSelect
          label="Extra Top Dia"
          value={item.exTopDia}
          onChange={u("exTopDia")}
        />
        <DiaSelect
          label="Stirrup Dia"
          value={item.stirDia}
          onChange={u("stirDia")}
        />
        <MMF
          label="Stirrup Spacing (Normal Zone)"
          value={item.stirSpacing}
          onChange={u("stirSpacing")}
        />
      </div>

      <div className="stirrup-zone-info">
        📐 <b>Stirrup Zones (IS 13920):</b> Dense @
        {Math.round(+item.stirSpacing / 2)}mm for L/4 from each end · Normal @
        {item.stirSpacing}mm in middle L/2
      </div>

      <div className="feature-panel feature-panel--torsion">
        <label className="feature-panel__toggle">
          <input
            type="checkbox"
            checked={!!item.hasTorsion}
            onChange={(e) => onChange("hasTorsion", e.target.checked)}
          />
          🌀 Include Torsion Bars (corner bars for torsion)
        </label>
        {item.hasTorsion && (
          <div className="feature-panel__body form-grid">
            <DiaSelect
              label="Torsion Bar Dia"
              value={item.torsDia}
              onChange={u("torsDia")}
            />
            <NF
              label="No. of Torsion Bars"
              value={item.torsNos}
              onChange={u("torsNos")}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SlabForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  const lbRatio = +item.L / +item.B;
  const autoIs1Way = lbRatio > 2;

  return (
    <div className="form-grid">
      <div className="field">
        <label className="field__label">Slab Type</label>
        <select
          value={item.slabType || "2-way"}
          onChange={(e) => u("slabType")(e.target.value)}
        >
          <option value="1-way">1-Way Slab (Ly/Lx &gt; 2)</option>
          <option value="2-way">2-Way Slab (Ly/Lx &lt; 2)</option>
        </select>
        {/* Warn user when ratio conflicts with selection */}
        {autoIs1Way && item.slabType === "2-way" && (
          <div
            style={{
              marginTop: 4,
              fontSize: 10,
              color: "#d97706",
              fontFamily: "var(--font-mono)",
            }}
          >
            ⚠️ Ly/Lx = {lbRatio.toFixed(2)} &gt; 2 — behaves as 1-way slab
          </div>
        )}
      </div>
      <div />
      <MF label="Span Lx (shorter)" value={item.L} onChange={u("L")} />
      <MF label="Span Ly (longer)" value={item.B} onChange={u("B")} />
      <MF label="Thickness D" value={item.D} onChange={u("D")} />
      <DiaSelect
        label="Main Bar Dia"
        value={item.mainDia}
        onChange={u("mainDia")}
      />
      <MMF
        label="Main Bar Spacing"
        value={item.mainSp}
        onChange={u("mainSp")}
      />
      <DiaSelect
        label="Dist Bar Dia"
        value={item.distDia}
        onChange={u("distDia")}
      />
      <MMF
        label="Dist Bar Spacing"
        value={item.distSp}
        onChange={u("distSp")}
      />
      <DiaSelect
        label="Top Bar Dia (@sup)"
        value={item.topDia}
        onChange={u("topDia")}
      />
      <MMF label="Top Bar Spacing" value={item.topSp} onChange={u("topSp")} />
    </div>
  );
}

function StaircaseForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div className="form-grid">
      <MF
        label="Flight Length"
        value={item.flightLen}
        onChange={u("flightLen")}
      />
      <MF label="Width" value={item.width} onChange={u("width")} />
      <MF
        label="Waist Thickness"
        value={item.waistThick}
        onChange={u("waistThick")}
      />
      <DiaSelect
        label="Main Bar Dia"
        value={item.mainDia}
        onChange={u("mainDia")}
      />
      <MMF
        label="Main Bar Spacing"
        value={item.mainSp}
        onChange={u("mainSp")}
      />
      <DiaSelect
        label="Dist Bar Dia"
        value={item.distDia}
        onChange={u("distDia")}
      />
      <MMF
        label="Dist Bar Spacing"
        value={item.distSp}
        onChange={u("distSp")}
      />
    </div>
  );
}

function LintelForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div>
      <div className="form-grid">
        <MF label="Span L" value={item.L} onChange={u("L")} />
        <MF label="Width B" value={item.B} onChange={u("B")} />
        <MF label="Depth D" value={item.D} onChange={u("D")} />
        <NF
          label="No. Bottom Bars"
          value={item.botNos}
          onChange={u("botNos")}
        />
        <DiaSelect
          label="Bottom Bar Dia"
          value={item.botDia}
          onChange={u("botDia")}
        />
        <NF label="No. Top Bars" value={item.topNos} onChange={u("topNos")} />
        <DiaSelect
          label="Top Bar Dia"
          value={item.topDia}
          onChange={u("topDia")}
        />
        <DiaSelect
          label="Stirrup Dia"
          value={item.stirDia}
          onChange={u("stirDia")}
        />
        <MMF
          label="Stirrup Spacing"
          value={item.stirSpacing}
          onChange={u("stirSpacing")}
        />
      </div>

      <div className="feature-panel feature-panel--chajja">
        <label className="feature-panel__toggle">
          <input
            type="checkbox"
            checked={!!item.hasChajja}
            onChange={(e) => onChange("hasChajja", e.target.checked)}
          />
          ☀️ Include Chajja (Sun Shade / Canopy)
        </label>
        {item.hasChajja && (
          <div className="feature-panel__body form-grid">
            <MF
              label="Chajja Projection"
              value={item.chajjaL}
              onChange={u("chajjaL")}
            />
            <MF
              label="Chajja Thickness"
              value={item.chajjaD}
              onChange={u("chajjaD")}
            />
            <DiaSelect
              label="Chajja Bar Dia"
              value={item.chajjaDia}
              onChange={u("chajjaDia")}
            />
            <MMF
              label="Chajja Bar Spacing"
              value={item.chajjaSp}
              onChange={u("chajjaSp")}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function RaftForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div>
      <div className="form-grid">
        <MF label="Length L" value={item.L} onChange={u("L")} />
        <MF label="Width B" value={item.B} onChange={u("B")} />
        <MF label="Depth D" value={item.D} onChange={u("D")} />
        <DiaSelect
          label="Main Bar Dia"
          value={item.mainDia}
          onChange={u("mainDia")}
        />
        <MMF
          label="Main Bar Spacing"
          value={item.mainSp}
          onChange={u("mainSp")}
        />
        <DiaSelect
          label="Dist Bar Dia"
          value={item.distDia}
          onChange={u("distDia")}
        />
        <MMF
          label="Dist Bar Spacing"
          value={item.distSp}
          onChange={u("distSp")}
        />
      </div>
      <div className="raft-info-note">
        ℹ️ Top + Bottom mat calculated automatically (2× bars)
      </div>
      <div className="feature-panel feature-panel--crank">
        <label className="feature-panel__toggle">
          <input
            type="checkbox"
            checked={!!item.hasCrank}
            onChange={(e) => onChange("hasCrank", e.target.checked)}
          />
          ↗ Include Crank / Bent-up Bars at Edges
        </label>
        {item.hasCrank && (
          <div className="feature-panel__body form-grid">
            <DiaSelect
              label="Crank Bar Dia"
              value={item.crankDia}
              onChange={u("crankDia")}
            />
            <MMF
              label="Crank Bar Spacing"
              value={item.crankSp}
              onChange={u("crankSp")}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function PileCapForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div className="form-grid">
      <MF label="Length L" value={item.L} onChange={u("L")} />
      <MF label="Width B" value={item.B} onChange={u("B")} />
      <MF label="Depth D" value={item.D} onChange={u("D")} />
      <NF label="No. of Piles" value={item.nPiles} onChange={u("nPiles")} />
      <Field
        label="Pile Dia"
        value={item.pileDia}
        onChange={u("pileDia")}
        unit="mm"
        step="50"
        min="150"
      />
      <MMF label="Bar Spacing" value={item.spacing} onChange={u("spacing")} />
      <DiaSelect
        label="Main Bar Dia"
        value={item.mainDia}
        onChange={u("mainDia")}
      />
      <DiaSelect
        label="Dist Bar Dia"
        value={item.distDia}
        onChange={u("distDia")}
      />
      <div
        style={{
          gridColumn: "1 / -1",
          fontSize: 11,
          color: "var(--text-3)",
          fontFamily: "var(--font-mono)",
          padding: "6px 0",
        }}
      >
        ℹ️ Anchor dowels calculated as 4 bars per pile (IS 456 Cl.34.4)
      </div>
    </div>
  );
}

function getForm(type) {
  return {
    footing: FootingForm,
    column: ColumnForm,
    plinthBeam: BeamForm,
    wallBeam: BeamForm,
    slab: SlabForm,
    staircase: StaircaseForm,
    lintel: LintelForm,
    raft: RaftForm,
    pileCap: PileCapForm,
  }[type];
}

function getDrawing(type, item) {
  if (type === "footing") return <DrawingFooting {...item} />;
  if (type === "column") return <DrawingColumn {...item} />;
  if (type === "plinthBeam")
    return <DrawingBeam {...item} coverType="plinthBeam" />;
  if (type === "wallBeam")
    return <DrawingBeam {...item} coverType="wallBeam" />;
  if (type === "slab") return <DrawingSlab {...item} />;
  if (type === "staircase") return <DrawingStaircase {...item} />;
  if (type === "lintel") return <DrawingLintel {...item} />;
  if (type === "raft") return <DrawingRaft {...item} />;
  if (type === "pileCap") return <DrawingPileCap {...item} />;
}

const TYPE_COLORS = {
  footing: "orange",
  column: "blue",
  plinthBeam: "green",
  wallBeam: "purple",
  slab: "red",
  staircase: "teal",
  lintel: "brown",
  raft: "indigo",
  pileCap: "grey",
};
const TYPE_ICONS = {
  footing: "🏗",
  column: "🏛",
  plinthBeam: "🔩",
  wallBeam: "⚙️",
  slab: "▦",
  staircase: "🪜",
  lintel: "🪟",
  raft: "🟫",
  pileCap: "🔵",
};

// ─── ITEM CARD ────────────────────────────────────────────────────────────────
function ItemCard({ item, type, onChange, onRemove, index }) {
  const [showDrawing, setShowDrawing] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const fileInputRef = React.useRef(null);
  const Form = getForm(type);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onChange("blueprintImage", event.target.result);
    };
    reader.readAsDataURL(file);
    // Reset input so the same file could be selected again if needed
    e.target.value = null;
  };

  const removeImage = () => {
    onChange("blueprintImage", null);
  };

  return (
    <Card className="item-card fade-in">
      <div className="item-card__header item-hdr">
        <Badge label={`#${index + 1}`} color={TYPE_COLORS[type] || "blue"} />
        <input
          value={item.label}
          onChange={(e) => onChange("label", e.target.value)}
          className="item-card__label-input"
        />
        <div className="item-card__qty">
          <span className="item-card__qty-label">Qty:</span>
          <input
            type="number"
            min="1"
            step="1"
            value={item.count}
            onChange={(e) => onChange("count", Math.max(1, +e.target.value))}
            className="item-card__qty-input"
          />
          <span className="item-card__qty-unit">nos</span>
        </div>
        <button
          onClick={() => setShowDrawing((v) => !v)}
          className={`btn btn--sm item-card__draw-btn${showDrawing ? " item-card__draw-btn--active" : ""}`}
        >
          📐 {showDrawing ? "Hide Drawing" : "Drawing"}
        </button>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="btn btn--sm item-card__hdr-btn"
        >
          {collapsed ? "▼ Expand" : "▲ Collapse"}
        </button>
        <Button size="sm" variant="danger" onClick={onRemove}>
          ✕ Remove
        </Button>
      </div>

      {!collapsed && (
        <div
          className={`item-card__body${showDrawing ? " item-card__body--split" : ""}`}
        >
          <div className="item-card__form-panel">
            <div className="item-card__unit-reminder">
              <span>📐</span>
              <span>
                <b>Dimensions → metres (m)</b> &nbsp;·&nbsp;{" "}
                <b>Spacings → millimetres (mm)</b>
              </span>
            </div>
            <Form item={item} onChange={onChange} />
          </div>
          {showDrawing && (
            <div className="item-card__drawing-panel">
              <div className="item-card__drawing-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>📐 Live Blueprint Preview</span>

                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />

                <button
                  className="btn btn--secondary btn--sm"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ fontSize: 10, padding: "4px 8px" }}
                >
                  {item.blueprintImage ? "📷 Change Photo" : "📷 Upload Photo"}
                </button>
              </div>

              {item.blueprintImage ? (
                <div style={{ position: "relative", marginTop: 8 }}>
                  <img
                    src={item.blueprintImage}
                    alt="Uploaded Blueprint"
                    style={{
                      width: "100%",
                      maxHeight: "350px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      border: "1px solid var(--border-2)",
                      background: "rgba(0,0,0,0.02)"
                    }}
                  />
                  <button
                    onClick={removeImage}
                    className="btn btn--danger"
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 28,
                      height: 28,
                      padding: 0,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                    }}
                    title="Remove custom photo"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                getDrawing(type, item)
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ─── ITEM MANAGER ─────────────────────────────────────────────────────────────
export function ItemManager({ type, items, setItems, elementConfig }) {
  const addItem = () => {
    const n = items.length + 1;
    const prefixes = {
      footing: "F",
      column: "C",
      plinthBeam: "PB",
      wallBeam: "WB",
      slab: "S",
      staircase: "ST",
      lintel: "L",
      raft: "RF",
      pileCap: "PC",
    };
    const typeNames = {
      footing: "Footing",
      column: "Column",
      plinthBeam: "Plinth Beam",
      wallBeam: "Wall Beam",
      slab: "Slab",
      staircase: "Staircase",
      lintel: "Lintel",
      raft: "Raft",
      pileCap: "Pile Cap",
    };
    const item = newItem(type);
    item.label = `${typeNames[type]} ${prefixes[type]}${n}`;
    setItems((prev) => [...prev, item]);
  };

  const updateItem = (id, key, value) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [key]: value } : it)),
    );
  const removeItem = (id) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  const totalCount = items.reduce((s, it) => s + (+it.count || 1), 0);
  const typeLabels = {
    footing: "Footings",
    column: "Columns",
    plinthBeam: "Plinth Beams",
    wallBeam: "Wall Beams",
    slab: "Slabs",
    staircase: "Staircases",
    lintel: "Lintel / Chajja",
    raft: "Raft Foundation",
    pileCap: "Pile Caps",
  };


  return (
    <div>
      <div className="item-manager__toolbar">
        <div className="item-manager__info">
          <span className="item-manager__icon">{TYPE_ICONS[type]}</span>
          <div>
            <div className="item-manager__title">{typeLabels[type]}</div>
            <div className="item-manager__meta">
              {items.length} types · {totalCount} total nos
            </div>
          </div>
        </div>
        <Button onClick={addItem} variant="primary" size="sm">
          + Add {TYPE_ICONS[type]}
        </Button>
      </div>

      {items.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon">{TYPE_ICONS[type]}</div>
          <div className="empty-state__title">
            No {typeLabels[type]} added yet
          </div>
          <div className="empty-state__sub">Click "+ Add" to start</div>
        </div>
      )}

      {items.map((item, i) => (
        <ItemCard
          key={item.id}
          item={item}
          type={type}
          index={i}
          onChange={(k, v) => updateItem(item.id, k, v)}
          onRemove={() => removeItem(item.id)}
        />
      ))}
    </div>
  );
}
