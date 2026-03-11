import React from "react";
import { DiaSelect } from "../ui.jsx";
import { MF, MMF, NF } from "./SharedFields.jsx";

export function FootingForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div>
      <div className="form-grid">
        <MF label="Length L" value={item.L} onChange={u("L")} />
        <MF label="Width B" value={item.B} onChange={u("B")} />
        <MF label="Depth D" value={item.D} onChange={u("D")} />
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
      </div>

      <div className="feature-panel feature-panel--stub">
        <label className="feature-panel__toggle">
          <input
            type="checkbox"
            checked={!!item.hasStub}
            onChange={(e) => onChange("hasStub", e.target.checked)}
          />
          🏗 Include Stub Column / Pedestal (Footing top → Plinth Beam soffit)
        </label>

        {item.hasStub && (
          <div>
            <div className="stub-info-note">
              📐 <b>Stub = Footing top to Plinth Beam soffit.</b> Starter bars
              go <b>40d into footing</b> + stub height +{" "}
              <b>40d lap into superstructure column</b> (IS 456 Cl.26.2). Ties
              @150mm (dense zone as per IS 456 Cl.26.5.3).
            </div>
            <div className="feature-panel__body form-grid">
              <MF
                label="Stub Height (Footing top → PB soffit)"
                value={item.stubH}
                onChange={u("stubH")}
              />
              <NF
                label="No. of Starter / Dowel Bars"
                value={item.colNos}
                onChange={u("colNos")}
              />
              <DiaSelect
                label="Starter Bar Dia (= Col main bar)"
                value={item.colDia}
                onChange={u("colDia")}
              />
              <div className="stub-calc-preview">
                <div className="stub-calc-preview__label">
                  📏 Starter bar cut length:
                </div>
                <div className="stub-calc-preview__value">
                  40d ({((40 * +item.colDia) / 1000).toFixed(3)}m) +{" "}
                  {(+item.stubH).toFixed(3)}m + 40d (
                  {((40 * +item.colDia) / 1000).toFixed(3)}m)
                  {" = "}
                  <b>
                    {(((40 * +item.colDia) / 1000) * 2 + +item.stubH).toFixed(
                      3,
                    )}{" "}
                    m
                  </b>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
