import React, { useState } from "react";
import { Card, Badge, Button } from "./ui.jsx";
import { getForm } from "./forms/index.js";
import { getDrawing } from "./drawings/index.jsx";

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
            <div className="item-card__drawing-panel" style={{ position: "relative", minHeight: "360px" }}>
              <div style={{ 
                position: "absolute", 
                top: "16px", 
                left: "20px", 
                zIndex: 20, 
                display: "flex", 
                alignItems: "center", 
                gap: "5px",
                background: "rgba(255, 255, 255, 0.7)", 
                padding: "2px 8px", 
                borderRadius: "20px", 
                border: "1px solid rgba(30, 96, 145, 0.15)", 
                backdropFilter: "blur(4px)", 
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                pointerEvents: "none" 
              }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--primary)", boxShadow: "0 0 4px var(--primary)" }} />
                <span style={{ fontSize: 7.5, fontWeight: 900, color: "var(--primary-dark)", textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: "var(--font-mono)" }}>
                  Live Blueprint
                </span>
                <span style={{ fontSize: 7.5, color: "var(--text-3)", marginLeft: 2, opacity: 0.7 }}>
                  (Auto)
                </span>
              </div>

              <div style={{ transform: "scale(0.65)", transformOrigin: "center center", width: "100%" }}>
                {getDrawing(type, item)}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
