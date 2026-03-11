import React from "react";
import { DiaSelect } from "../ui.jsx";
import { MF, MMF } from "./SharedFields.jsx";

export function RaftForm({ item, onChange }) {
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
