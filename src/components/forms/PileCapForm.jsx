import React from "react";
import { Field, DiaSelect } from "../ui.jsx";
import { MF, MMF, NF } from "./SharedFields.jsx";

export function PileCapForm({ item, onChange }) {
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
