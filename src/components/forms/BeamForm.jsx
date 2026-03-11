import React from "react";
import { DiaSelect } from "../ui.jsx";
import { MF, MMF, NF } from "./SharedFields.jsx";

export function BeamForm({ item, onChange }) {
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
