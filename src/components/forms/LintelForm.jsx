import React from "react";
import { DiaSelect } from "../ui.jsx";
import { MF, MMF, NF } from "./SharedFields.jsx";

export function LintelForm({ item, onChange }) {
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
