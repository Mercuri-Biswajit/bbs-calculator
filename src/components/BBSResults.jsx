// src/components/BBSResults.jsx

import { BAR_WEIGHT, generateBarPurchaseMessage } from "../utils/calculations.js";
import { Badge } from "./ui.jsx";

export function BBSTable({ rows, showSource = true }) {
  const totalWt = rows.reduce((s, r) => s + r.weight, 0);
  if (!rows.length) return null;

  return (
    <div className="tbl-wrap">
      <table className="bbs-table">
        <thead>
          <tr>
            {showSource && <th>Element</th>}
            <th>Mark</th>
            <th style={{ textAlign: "left" }}>Description</th>
            <th>Qty</th>
            <th>Cut Length (m)</th>
            <th>Total Length (m)</th>
            <th>Unit Wt (kg/m)</th>
            <th style={{ color: "var(--red)" }}>Weight (kg)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {showSource && (
                <td style={{ maxWidth: 140, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  <span style={{ fontSize: 11, color: "var(--text-2)" }}>{r.sourceLabel}</span>
                  {r.count > 1 && (
                    <span style={{ marginLeft: 4, fontSize: 10, color: "var(--primary)", fontWeight: 700 }}>×{r.count}</span>
                  )}
                </td>
              )}
              <td style={{ textAlign: "center" }}><Badge label={r.mark} color="blue" /></td>
              <td style={{ color: "var(--text)", textAlign: "left", fontSize: 12 }}>{r.desc}</td>
              <td style={{ textAlign: "center" }}>{r.nos}</td>
              <td style={{ textAlign: "right" }}>{r.cutLen.toFixed(3)}</td>
              <td style={{ textAlign: "right", color: "var(--green)", fontWeight: 600 }}>{r.totalLen.toFixed(3)}</td>
              <td style={{ textAlign: "right", color: "var(--text-2)" }}>{BAR_WEIGHT[r.dia] || "—"}</td>
              <td style={{ textAlign: "right", color: "var(--red)", fontWeight: 700 }}>{r.weight.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={showSource ? 7 : 6} style={{ padding: "10px 12px", fontWeight: 700, color: "var(--primary)", fontSize: 13 }}>
              TOTAL STEEL WEIGHT
            </td>
            <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: "var(--primary-dark)", fontSize: 16 }}>
              {totalWt.toFixed(2)} kg
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export function GroupedBBSTable({ rows }) {
  const groups = {};
  rows.forEach((r) => {
    const key = r.sourceLabel || "Unnamed";
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });

  return (
    <div>
      {Object.entries(groups).map(([label, groupRows]) => (
        <div key={label} style={{ marginBottom: 18 }}>
          <div className="section-heading">
            {label}
            <span className="section-heading__count">— {groupRows[0]?.count} nos</span>
          </div>
          <BBSTable rows={groupRows} showSource={false} />
        </div>
      ))}
    </div>
  );
}

export function CostTable({ costs, onRateChange, details, onSendBarOrder }) {
  const total   = costs.reduce((s, r) => s + r.cost, 0);
  const totalKg = costs.reduce((s, r) => s + r.kg, 0);

  return (
    <div className="cost-grid">
      {/* Purchase summary */}
      <div>
        <div className="cost-section-title"><span>📦</span> Bars to Purchase — 12m Standard Rods</div>
        <div className="tbl-wrap">
          <table className="cost-table">
            <thead>
              <tr>{["Dia", "Total Length", "Weight (kg)", "12m Rods Reqd"].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {costs.map((r) => (
                <tr key={r.dia}>
                  <td style={{ color: "var(--red)", fontWeight: 700 }}>φ{r.dia}mm</td>
                  <td style={{ textAlign: "right" }}>{r.totalLen} m</td>
                  <td style={{ textAlign: "right" }}>{r.kg} kg</td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{ background: "var(--primary-light)", color: "var(--primary)", padding: "3px 10px", borderRadius: 6, fontWeight: 700, fontSize: 12 }}>
                      {r.rods12m} rods
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} style={{ padding: "9px 12px", fontWeight: 700 }}>TOTAL</td>
                <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, color: "var(--primary-dark)" }}>{totalKg.toFixed(2)} kg</td>
                <td style={{ padding: "9px 12px", textAlign: "center", fontWeight: 700, color: "var(--primary-dark)" }}>
                  {costs.reduce((s, r) => s + r.rods12m, 0)} rods
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        {onSendBarOrder && (
          <button onClick={onSendBarOrder} className="btn btn--whatsapp btn--md" style={{ width: "100%", marginTop: 14 }}>
            💬 Send Bar Order via WhatsApp
          </button>
        )}
      </div>

      {/* Cost estimate */}
      <div>
        <div className="cost-section-title"><span>💰</span> Cost Estimate — Per-Piece Rate (12m rod)</div>
        <div className="tbl-wrap">
          <table className="cost-table">
            <thead>
              <tr>{["Dia", "12m Rods", "Rate (₹/pc)", "Amount (₹)"].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {costs.map((r) => (
                <tr key={r.dia}>
                  <td style={{ color: "var(--red)", fontWeight: 700 }}>φ{r.dia}mm</td>
                  <td style={{ textAlign: "center", fontWeight: 600 }}>{r.rods12m} pcs</td>
                  <td style={{ textAlign: "center", padding: "5px 8px" }}>
                    {onRateChange ? (
                      <input
                        type="number"
                        value={r.ratePerPiece}
                        onChange={(e) => onRateChange(r.dia, +e.target.value)}
                        style={{ width: 80, textAlign: "center", fontSize: 12 }}
                      />
                    ) : (
                      <span>₹{r.ratePerPiece}</span>
                    )}
                  </td>
                  <td style={{ textAlign: "right", color: "var(--green)", fontWeight: 600 }}>₹{r.cost.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ padding: "10px 12px", fontWeight: 700, color: "var(--green)", fontSize: 13 }}>TOTAL COST</td>
                <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 800, color: "var(--green)", fontSize: 18 }}>
                  ₹{total.toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-3)", fontStyle: "italic" }}>
          * Rates shown per 12m rod. Add 5% wastage for actual procurement.
        </div>
      </div>
    </div>
  );
}
