import React from "react";
import { DiaSelect } from "../ui.jsx";
import { MF, MMF, NF } from "./SharedFields.jsx";

export function ColumnForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  const isCircular = item.shape === "circular";

  return (
    <div>
      {/* Shape Toggle */}
      <div style={{
        display: "flex",
        gap: 0,
        marginBottom: 14,
        background: "var(--surface-2)",
        borderRadius: "var(--radius-sm)",
        overflow: "hidden",
        border: "1px solid var(--border)",
      }}>
        {["rectangular", "circular"].map((s) => (
          <button
            key={s}
            onClick={() => onChange("shape", s)}
            style={{
              flex: 1,
              padding: "8px 12px",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              textTransform: "capitalize",
              border: "none",
              cursor: "pointer",
              background: (item.shape || "rectangular") === s ? "var(--primary)" : "transparent",
              color: (item.shape || "rectangular") === s ? "#fff" : "var(--text-3)",
              transition: "all var(--transition)",
            }}
          >
            {s === "rectangular" ? "▬ Rectangular" : "⬤ Circular"}
          </button>
        ))}
      </div>

      <div className="form-grid">
        <MF label="Storey Height H" value={item.H} onChange={u("H")} />
        {isCircular ? (
          <MF label="Diameter Φ" value={item.colDia} onChange={u("colDia")} />
        ) : (
          <>
            <MF label="Width B" value={item.B} onChange={u("B")} />
            <MF label="Depth D" value={item.D} onChange={u("D")} />
          </>
        )}
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
          label={isCircular ? "Spiral/Tie Dia" : "Lateral Tie Dia"}
          value={item.tieDia}
          onChange={u("tieDia")}
        />
        <MMF
          label={isCircular ? "Spiral Pitch" : "Tie Spacing"}
          value={item.tieSpacing}
          onChange={u("tieSpacing")}
        />
      </div>
    </div>
  );
}
