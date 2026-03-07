// src/components/ItemManager.jsx
// ALL dimensions in METRES. ALL spacings in mm.

import { useState } from "react";
import { Card, Field, DiaSelect, Button, Badge } from "./ui.jsx";
import {
  DrawingFooting,
  DrawingColumn,
  DrawingBeam,
  DrawingSlab,
  DrawingStaircase,
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
};

let _id = 0;
export const newItem = (type) => ({ id: ++_id, ...DEFAULTS[type] });

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
    <div className="form-grid">
      <MF label="Span L" value={item.L} onChange={u("L")} />
      <MF label="Width B" value={item.B} onChange={u("B")} />
      <MF label="Depth D" value={item.D} onChange={u("D")} />
      <NF label="No. Bottom Bars" value={item.botNos} onChange={u("botNos")} />
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
        label="Stirrup Spacing"
        value={item.stirSpacing}
        onChange={u("stirSpacing")}
      />
    </div>
  );
}

function SlabForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
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

function getForm(type) {
  return {
    footing: FootingForm,
    column: ColumnForm,
    plinthBeam: BeamForm,
    wallBeam: BeamForm,
    slab: SlabForm,
    staircase: StaircaseForm,
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
}

const TYPE_COLORS = {
  footing: "orange",
  column: "blue",
  plinthBeam: "green",
  wallBeam: "purple",
  slab: "red",
  staircase: "teal",
};
const TYPE_ICONS = {
  footing: "🏗",
  column: "🏛",
  plinthBeam: "🔩",
  wallBeam: "⚙️",
  slab: "▦",
  staircase: "🪜",
};

// ─── ITEM CARD ────────────────────────────────────────────────────────────────
function ItemCard({ item, type, onChange, onRemove, index }) {
  const [showDrawing, setShowDrawing] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const Form = getForm(type);

  return (
    <Card className="item-card fade-in">
      <div className="item-card__header item-hdr">
        <Badge label={`#${index + 1}`} color={TYPE_COLORS[type]} />
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
              <div className="item-card__drawing-label">
                📐 Live Blueprint Preview
              </div>
              {getDrawing(type, item)}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ─── ITEM MANAGER ─────────────────────────────────────────────────────────────
export function ItemManager({ type, items, setItems }) {
  const addItem = () => {
    const n = items.length + 1;
    const prefixes = {
      footing: "F",
      column: "C",
      plinthBeam: "PB",
      wallBeam: "WB",
      slab: "S",
      staircase: "ST",
    };
    const typeNames = {
      footing: "Footing",
      column: "Column",
      plinthBeam: "Plinth Beam",
      wallBeam: "Wall Beam",
      slab: "Slab",
      staircase: "Staircase",
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
