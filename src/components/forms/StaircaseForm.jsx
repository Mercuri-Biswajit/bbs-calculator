import React from "react";
import { DiaSelect } from "../ui.jsx";
import { MF, MMF } from "./SharedFields.jsx";

export function StaircaseForm({ item, onChange }) {
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
