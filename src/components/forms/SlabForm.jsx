import React from "react";
import { DiaSelect } from "../ui.jsx";
import { MF, MMF } from "./SharedFields.jsx";

export function SlabForm({ item, onChange }) {
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
