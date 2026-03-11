import React, { useState } from "react";
import { Card, Badge, Button } from "./ui.jsx";
import { getForm } from "./forms/index.js";
import { getDrawing } from "./drawings/index.js";

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

export function ItemCard({ item, type, onChange, onRemove, index }) {
  const [showDrawing, setShowDrawing] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const Form = getForm(type);

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
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "var(--primary-dark)", textTransform: "uppercase", letterSpacing: "1.2px", fontFamily: "var(--font-mono)" }}>
                    📐 Live Blueprint
                  </span>
                  <span style={{ fontSize: 10, color: "var(--text-3)", marginTop: 4 }}>
                    Auto-calculated diagram
                  </span>
                </div>
              </div>

              {getDrawing(type, item)}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
