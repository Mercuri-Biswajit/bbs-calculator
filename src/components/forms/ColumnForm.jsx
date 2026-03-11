import React from "react";
import { DiaSelect } from "../ui.jsx";
import { MF, MMF, NF } from "./SharedFields.jsx";

export function ColumnForm({ item, onChange }) {
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
