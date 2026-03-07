// src/components/BBSResults.jsx
// UPDATED: Per-piece rates, WhatsApp bar purchase order

import {
  BAR_WEIGHT,
  generateBarPurchaseMessage,
} from "../utils/calculations.js";
import { Badge } from "./ui.jsx";

// ─── FULL BBS TABLE ───────────────────────────────────────────────────────────
export function BBSTable({ rows, showSource = true }) {
  const totalWt = rows.reduce((s, r) => s + r.weight, 0);

  if (!rows.length) return null;

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 12,
          fontFamily: "var(--font-mono)",
        }}
      >
        <thead>
          <tr style={{ background: "#eaf2fb" }}>
            {showSource && <th style={th}>Element</th>}
            <th style={th}>Mark</th>
            <th style={{ ...th, textAlign: "left" }}>Description</th>
            <th style={th}>Qty</th>
            <th style={th}>Cut Length (m)</th>
            <th style={th}>Total Length (m)</th>
            <th style={th}>Unit Wt (kg/m)</th>
            <th style={{ ...th, color: "var(--red)" }}>Weight (kg)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? "var(--row-even)" : "var(--row-odd)",
              }}
            >
              {showSource && (
                <td
                  style={{
                    ...td,
                    maxWidth: 140,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <span style={{ fontSize: 11, color: "var(--text2)" }}>
                    {r.sourceLabel}
                  </span>
                  {r.count > 1 && (
                    <span
                      style={{
                        marginLeft: 4,
                        fontSize: 10,
                        color: "var(--primary)",
                        fontWeight: 700,
                      }}
                    >
                      ×{r.count}
                    </span>
                  )}
                </td>
              )}
              <td style={{ ...td, textAlign: "center" }}>
                <Badge label={r.mark} color="blue" />
              </td>
              <td
                style={{
                  ...td,
                  color: "var(--text)",
                  textAlign: "left",
                  fontSize: 12,
                }}
              >
                {r.desc}
              </td>
              <td style={{ ...td, textAlign: "center" }}>{r.nos}</td>
              <td style={{ ...td, textAlign: "right" }}>
                {r.cutLen.toFixed(3)}
              </td>
              <td
                style={{
                  ...td,
                  textAlign: "right",
                  color: "var(--green)",
                  fontWeight: 600,
                }}
              >
                {r.totalLen.toFixed(3)}
              </td>
              <td style={{ ...td, textAlign: "right", color: "var(--text2)" }}>
                {BAR_WEIGHT[r.dia] || "—"}
              </td>
              <td
                style={{
                  ...td,
                  textAlign: "right",
                  color: "var(--red)",
                  fontWeight: 700,
                }}
              >
                {r.weight.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr
            style={{
              background: "#deeefb",
              borderTop: "2px solid var(--primary)",
            }}
          >
            <td
              colSpan={showSource ? 7 : 6}
              style={{
                padding: "10px 12px",
                fontWeight: 700,
                color: "var(--primary)",
                fontSize: 13,
              }}
            >
              TOTAL STEEL WEIGHT
            </td>
            <td
              style={{
                padding: "10px 12px",
                textAlign: "right",
                fontWeight: 800,
                color: "var(--primary-dark)",
                fontSize: 16,
              }}
            >
              {totalWt.toFixed(2)} kg
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ─── GROUPED TABLE ────────────────────────────────────────────────────────────
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
        <div key={label} style={{ marginBottom: 16 }}>
          <div
            style={{
              padding: "7px 14px",
              background: "var(--primary-light)",
              borderLeft: "3px solid var(--primary)",
              marginBottom: 0,
              fontSize: 12,
              fontWeight: 700,
              color: "var(--primary)",
            }}
          >
            {label}{" "}
            <span
              style={{ fontWeight: 400, color: "var(--text3)", fontSize: 11 }}
            >
              — {groupRows[0]?.count} nos
            </span>
          </div>
          <BBSTable rows={groupRows} showSource={false} />
        </div>
      ))}
    </div>
  );
}

// 🆕 ─── COST TABLE (PER-PIECE RATES) ──────────────────────────────────────────
export function CostTable({ costs, onRateChange, details, onSendBarOrder }) {
  const total = costs.reduce((s, r) => s + r.cost, 0);
  const totalKg = costs.reduce((s, r) => s + r.kg, 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Purchase summary */}
      <div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 12,
            color: "var(--text)",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>📦</span> BARS TO PURCHASE — 12m Standard Rods
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12,
            fontFamily: "var(--font-mono)",
          }}
        >
          <thead>
            <tr style={{ background: "#f0f4f8" }}>
              {["Dia", "Total Length", "Weight (kg)", "12m Rods Reqd"].map(
                (h) => (
                  <th key={h} style={{ ...th, fontSize: 11 }}>
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {costs.map((r, i) => (
              <tr
                key={r.dia}
                style={{ background: i % 2 === 0 ? "white" : "var(--row-odd)" }}
              >
                <td style={{ ...td, color: "var(--red)", fontWeight: 700 }}>
                  φ{r.dia}mm
                </td>
                <td style={{ ...td, textAlign: "right" }}>{r.totalLen} m</td>
                <td style={{ ...td, textAlign: "right" }}>{r.kg} kg</td>
                <td
                  style={{
                    ...td,
                    textAlign: "center",
                    color: "var(--primary)",
                    fontWeight: 700,
                  }}
                >
                  <span
                    style={{
                      background: "var(--primary-light)",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {r.rods12m} rods
                  </span>
                </td>
              </tr>
            ))}
            <tr
              style={{
                background: "#f0f4f8",
                borderTop: "2px solid var(--border)",
              }}
            >
              <td colSpan={2} style={{ ...td, fontWeight: 700 }}>
                TOTAL
              </td>
              <td
                style={{
                  ...td,
                  textAlign: "right",
                  fontWeight: 700,
                  color: "var(--primary-dark)",
                }}
              >
                {totalKg.toFixed(2)} kg
              </td>
              <td
                style={{
                  ...td,
                  textAlign: "center",
                  fontWeight: 700,
                  color: "var(--primary-dark)",
                }}
              >
                {costs.reduce((s, r) => s + r.rods12m, 0)} rods
              </td>
            </tr>
          </tbody>
        </table>

        {/* 🆕 WhatsApp Bar Purchase Order Button */}
        {onSendBarOrder && (
          <button
            onClick={onSendBarOrder}
            style={{
              width: "100%",
              marginTop: 12,
              background: "#25d366",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 2px 8px rgba(37,211,102,.3)",
            }}
          >
            💬 Send Bar Order via WhatsApp
          </button>
        )}
      </div>

      {/* 🆕 Cost (PER-PIECE RATES) */}
      <div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 12,
            color: "var(--text)",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>💰</span> COST ESTIMATE — PER-PIECE RATE (12m rod)
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12,
            fontFamily: "var(--font-mono)",
          }}
        >
          <thead>
            <tr style={{ background: "#f0f4f8" }}>
              {["Dia", "12m Rods", "Rate (₹/pc)", "Amount (₹)"].map((h) => (
                <th key={h} style={{ ...th, fontSize: 11 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {costs.map((r, i) => (
              <tr
                key={r.dia}
                style={{ background: i % 2 === 0 ? "white" : "var(--row-odd)" }}
              >
                <td style={{ ...td, color: "var(--red)", fontWeight: 700 }}>
                  φ{r.dia}mm
                </td>
                <td style={{ ...td, textAlign: "center", fontWeight: 600 }}>
                  {r.rods12m} pcs
                </td>
                <td style={{ ...td, textAlign: "center", padding: "4px 8px" }}>
                  {onRateChange ? (
                    <input
                      type="number"
                      value={r.ratePerPiece}
                      onChange={(e) => onRateChange(r.dia, +e.target.value)}
                      style={{ width: 74, textAlign: "center", fontSize: 12 }}
                    />
                  ) : (
                    <span>₹{r.ratePerPiece}</span>
                  )}
                </td>
                <td
                  style={{
                    ...td,
                    textAlign: "right",
                    color: "var(--green)",
                    fontWeight: 600,
                  }}
                >
                  ₹{r.cost.toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr
              style={{
                background: "#eafaf1",
                borderTop: "2px solid var(--green)",
              }}
            >
              <td
                colSpan={3}
                style={{
                  ...td,
                  fontWeight: 700,
                  color: "var(--green)",
                  fontSize: 13,
                }}
              >
                TOTAL COST
              </td>
              <td
                style={{
                  ...td,
                  textAlign: "right",
                  fontWeight: 800,
                  color: "var(--green)",
                  fontSize: 18,
                }}
              >
                ₹{total.toLocaleString("en-IN")}
              </td>
            </tr>
          </tfoot>
        </table>
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            color: "var(--text3)",
            fontStyle: "italic",
          }}
        >
          * Rates shown per 12m rod. Add 5% wastage for actual procurement.
        </div>
      </div>
    </div>
  );
}

const th = {
  padding: "8px 12px",
  border: "1px solid var(--border)",
  color: "var(--primary)",
  fontWeight: 700,
  textAlign: "center",
  whiteSpace: "nowrap",
  fontSize: 11,
};
const td = { padding: "7px 12px", border: "1px solid var(--border2)" };
