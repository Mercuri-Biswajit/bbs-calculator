// src/pages/ResultPage.jsx
// ─── BBS Result / Report view ─────────────────────────────────────────────────

import { useState } from "react";
import { Card, CardHeader } from "../components/ui.jsx";
import {
  BBSTable,
  GroupedBBSTable,
  CostTable,
} from "../components/BBSResults.jsx";
import { downloadPDF, sendViaWhatsApp } from "../utils/pdfReport.js";
import { downloadExcel } from "../utils/excelExport.js";
import {
  generateBarPurchaseMessage,
  cuttingLengthSummary,
  generateBarTagSchedule,
  generateLapSpliceSchedule,
  BAR_WEIGHT,
} from "../utils/calculations.js";
import { TABS } from "../App.jsx";

export default function ResultPage({
  result,
  rates,
  details,
  onRateChange,
  onBack,
}) {
  const [sending, setSending] = useState(false);
  const [sentMsg, setSentMsg] = useState("");
  const [dlBusy, setDlBusy] = useState(false);
  const [xlBusy, setXlBusy] = useState(false);
  const [activeView, setActiveView] = useState("bbs");

  const { byType, allRows, costs } = result;
  const totalWt = allRows.reduce((s, r) => s + r.weight, 0);
  const totalCost = costs.reduce((s, r) => s + r.cost, 0);
  const totalRods = costs.reduce((s, r) => s + r.rods12m, 0);

  const cutLengthData = cuttingLengthSummary(allRows);
  const barTagData = generateBarTagSchedule(allRows);
  const lapSpliceData = generateLapSpliceSchedule(allRows);

  const handleDownload = () => {
    setDlBusy(true);
    setTimeout(() => {
      downloadPDF(details, byType, allRows, costs);
      setDlBusy(false);
    }, 100);
  };

  const handleExcel = () => {
    setXlBusy(true);
    setTimeout(() => {
      downloadExcel(details, byType, allRows, costs, cutLengthData, barTagData);
      setXlBusy(false);
    }, 100);
  };

  const handleWhatsApp = () => {
    if (!details.engineerPhone || details.engineerPhone.length < 10) {
      alert(
        "Please enter a valid 10-digit WhatsApp number in Project Details.",
      );
      return;
    }
    setSending(true);
    setTimeout(() => {
      const fname = sendViaWhatsApp(details, byType, allRows, costs);
      setSending(false);
      setSentMsg(
        `PDF saved as "${fname}" · WhatsApp opened — attach the file and hit Send!`,
      );
    }, 200);
  };

  const handleSendBarOrder = () => {
    if (!details.engineerPhone || details.engineerPhone.length < 10) {
      alert(
        "Please enter a valid 10-digit WhatsApp number in Project Details.",
      );
      return;
    }
    const message = encodeURIComponent(
      generateBarPurchaseMessage(costs, details),
    );
    window.open(
      `https://wa.me/91${details.engineerPhone}?text=${message}`,
      "_blank",
    );
  };

  const ActionBar = () => (
    <div className="action-bar">
      <button
        onClick={handleDownload}
        disabled={dlBusy}
        className="btn btn--secondary btn--md btn--glass"
      >
        {dlBusy ? "⏳ Generating…" : "⬇️ Download PDF"}
      </button>
      <button
        onClick={handleExcel}
        disabled={xlBusy}
        className="btn btn--excel btn--md"
      >
        {xlBusy ? "⏳ Exporting…" : "📊 Export Excel"}
      </button>
      <button
        onClick={handleWhatsApp}
        disabled={sending}
        className="btn btn--whatsapp btn--md"
      >
        {sending ? "⏳ Opening…" : "💬 Send via WhatsApp"}
      </button>
    </div>
  );

  const VIEW_TABS = [
    { id: "bbs", icon: "📋", label: "BBS Tables" },
    { id: "cutting", icon: "📏", label: "Cutting Length / Dia" },
    { id: "bartag", icon: "🏷️", label: "Bar Tag Schedule" },
    { id: "lapsplice", icon: "🔗", label: "Lap Splice Schedule" },
    { id: "cost", icon: "💰", label: "Cost Summary" },
  ];

  return (
    <div className="result-page">
      {/* Result Banner */}
      <div className="result-banner page-pad">
        <div className="result-banner__inner">
          <div className="result-banner__toprow">
            <button onClick={onBack} className="btn btn--sm btn--glass-dark">
              ← Back
            </button>
            {details.projectName && (
              <span className="result-banner__project">
                📌 {details.projectName}
              </span>
            )}
            {details.clientName && (
              <span className="result-banner__client">
                · {details.clientName}
              </span>
            )}
            {details.location && (
              <span className="result-banner__location">
                · {details.location}
              </span>
            )}
            <div className="result-banner__spacer" />
            <ActionBar />
          </div>

          <div className="kpi-grid">
            {[
              {
                label: "Total Steel Weight",
                value: `${totalWt.toFixed(1)} kg`,
                sub: "All elements combined",
              },
              {
                label: "Total Cost (WB)",
                value: `₹${totalCost.toLocaleString("en-IN")}`,
                sub: "Per-piece rates",
              },
              {
                label: "Rods (12m)",
                value: `${totalRods} nos`,
                sub: "Std 12m rods to buy",
              },
              {
                label: "Elements",
                value: `${byType.filter((t) => t.rows.length > 0).length}`,
                sub: `${allRows.length} bar entries`,
              },
            ].map((k, i) => (
              <div key={i} className="kpi-card">
                <div className="kpi-card__label">{k.label}</div>
                <div className="kpi-card__value">{k.value}</div>
                <div className="kpi-card__sub">{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {sentMsg && (
        <div className="wa-success">
          <span className="wa-success__icon">💬</span>
          <span>{sentMsg}</span>
          <button
            className="wa-success__dismiss"
            onClick={() => setSentMsg("")}
          >
            ✕
          </button>
        </div>
      )}

      <div className="page-pad result-page__body">
        {/* View Switcher */}
        <div className="view-switcher">
          {VIEW_TABS.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              className={`view-switcher__btn${activeView === v.id ? " active" : ""}`}
            >
              {v.icon} {v.label}
            </button>
          ))}
        </div>

        {/* ── BBS TABLES ── */}
        {activeView === "bbs" && (
          <>
            {byType.map(
              (t) =>
                t.rows.length > 0 && (
                  <Card key={t.type} className="result-section-card">
                    <CardHeader
                      icon={TABS.find((x) => x.id === t.type)?.icon}
                      title={`${TABS.find((x) => x.id === t.type)?.label} — BBS`}
                      subtitle={`${t.items.length} type(s) · ${t.items.reduce((s, i) => s + (+i.count || 1), 0)} nos · IS 2502:1963`}
                      action={
                        <span className="section-total-wt">
                          {t.rows.reduce((s, r) => s + r.weight, 0).toFixed(2)}{" "}
                          kg
                        </span>
                      }
                    />
                    <div className="card-body-pad">
                      <GroupedBBSTable rows={t.rows} />
                    </div>
                  </Card>
                ),
            )}
            <Card className="result-section-card">
              <CardHeader
                icon="📋"
                title="Combined BBS — All Elements"
                subtitle="Aggregate · IS 2502:1963"
              />
              <div className="card-body-pad">
                <BBSTable rows={allRows} showSource={true} />
              </div>
            </Card>
          </>
        )}

        {/* ── CUTTING LENGTH SUMMARY ── */}
        {activeView === "cutting" && (
          <Card className="result-section-card">
            <CardHeader
              icon="📏"
              title="Cutting Length Summary — Per Diameter"
              subtitle="All elements consolidated by bar diameter"
            />
            <div className="card-body-pad">
              {cutLengthData.map((d) => (
                <div key={d.dia} className="cut-section-wrap">
                  <div className="cut-section-hdr">
                    <span className="cut-section-hdr__dia">φ{d.dia}mm</span>
                    <span className="cut-section-hdr__unit">
                      Unit wt: {BAR_WEIGHT[d.dia]} kg/m
                    </span>
                    <span className="cut-section-hdr__spacer" />
                    <span className="cut-section-hdr__len">
                      {d.totalLen.toFixed(3)} m total
                    </span>
                    <span className="cut-section-hdr__wt">
                      {d.weight.toFixed(2)} kg
                    </span>
                    <span className="cut-section-hdr__rods">
                      {Math.ceil(d.totalLen / 12)} rods × 12m
                    </span>
                  </div>
                  <div className="tbl-wrap">
                    <table className="bbs-table">
                      <thead>
                        <tr>
                          <th>Source Element</th>
                          <th>Mark</th>
                          <th className="th-left">Description</th>
                          <th>Nos</th>
                          <th>Cut Length (m)</th>
                          <th>Total Length (m)</th>
                          <th>Weight (kg)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {d.entries.map((e, i) => (
                          <tr key={i}>
                            <td className="td-source">{e.source}</td>
                            <td className="td-mark">{e.mark}</td>
                            <td className="td-source">{e.desc}</td>
                            <td className="td-center">{e.nos}</td>
                            <td className="td-right">{e.cutLen.toFixed(3)}</td>
                            <td className="td-len">{e.totalLen.toFixed(3)}</td>
                            <td className="td-wt">
                              {(e.nos * e.cutLen * BAR_WEIGHT[d.dia]).toFixed(
                                2,
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={5}>φ{d.dia}mm SUBTOTAL</td>
                          <td className="td-len">{d.totalLen.toFixed(3)} m</td>
                          <td className="td-wt">{d.weight.toFixed(2)} kg</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              ))}

              <div className="grand-total-bar">
                <span className="grand-total-bar__label">GRAND TOTAL:</span>
                <span className="grand-total-bar__len">
                  {allRows.reduce((s, r) => s + r.totalLen, 0).toFixed(3)} m
                </span>
                <span className="grand-total-bar__wt">
                  {totalWt.toFixed(2)} kg
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* ── BAR TAG SCHEDULE ── */}
        {activeView === "bartag" && (
          <Card className="result-section-card">
            <CardHeader
              icon="🏷️"
              title="Bar Tag / Label Schedule"
              subtitle="Unique tag for every bar entry — use for site marking"
            />
            <div className="card-body-pad">
              <div className="tbl-wrap">
                <table className="bbs-table">
                  <thead>
                    <tr>
                      <th>Tag No.</th>
                      <th>Source Element</th>
                      <th>Mark</th>
                      <th className="th-left">Description</th>
                      <th>Dia (mm)</th>
                      <th>Nos</th>
                      <th>Cut Length (m)</th>
                      <th>Total Length (m)</th>
                      <th>Weight (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {barTagData.map((r, i) => (
                      <tr key={i}>
                        <td>
                          <span className="bar-tag-pill">{r.tag}</span>
                        </td>
                        <td className="td-source">{r.source}</td>
                        <td className="td-mark">{r.mark}</td>
                        <td className="td-source">{r.desc}</td>
                        <td className="td-dia">φ{r.dia}</td>
                        <td className="td-center">{r.nos}</td>
                        <td className="td-right">{r.cutLen.toFixed(3)}</td>
                        <td className="td-len">{r.totalLen.toFixed(3)}</td>
                        <td className="td-wt">{r.weight.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={7}>TOTAL — {barTagData.length} bar tags</td>
                      <td className="td-len">
                        {allRows.reduce((s, r) => s + r.totalLen, 0).toFixed(3)}{" "}
                        m
                      </td>
                      <td className="td-wt">{totalWt.toFixed(2)} kg</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <p className="tbl-note">
                * Bar tags (BT-001, BT-002…) can be used for site labelling and
                bar identification during placing.
              </p>
            </div>
          </Card>
        )}

        {/* ── LAP SPLICE SCHEDULE ── */}
        {activeView === "lapsplice" && (
          <Card className="result-section-card">
            <CardHeader
              icon="🔗"
              title="Lap Splice Schedule"
              subtitle="IS 456:2000 Cl.26.2 — Lap length = 40d for Fe-500 in tension zone"
            />
            <div className="card-body-pad">
              <div className="lapsplice-diagram">
                <div className="lapsplice-diagram__title">
                  📐 Lap Splice Location Diagram (Schematic)
                </div>
                <svg viewBox="0 0 600 120" className="lapsplice-svg">
                  <line
                    x1="20"
                    y1="40"
                    x2="340"
                    y2="40"
                    stroke="#c0392b"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <line
                    x1="180"
                    y1="60"
                    x2="580"
                    y2="60"
                    stroke="#2563eb"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <rect
                    x="180"
                    y="28"
                    width="160"
                    height="44"
                    fill="rgba(245,158,11,.15)"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="5,3"
                    rx="3"
                  />
                  <text
                    x="260"
                    y="20"
                    textAnchor="middle"
                    fill="#d97706"
                    style={{
                      fontSize: 10,
                      fontFamily: "monospace",
                      fontWeight: 700,
                    }}
                  >
                    LAP ZONE = 40d
                  </text>
                  <line
                    x1="180"
                    y1="82"
                    x2="340"
                    y2="82"
                    stroke="#64748b"
                    strokeWidth="1"
                    markerEnd="url(#lae)"
                    markerStart="url(#las)"
                  />
                  <defs>
                    <marker
                      id="lae"
                      markerWidth="6"
                      markerHeight="6"
                      refX="5"
                      refY="3"
                      orient="auto"
                    >
                      <path d="M0,0 L0,6 L6,3z" fill="#64748b" />
                    </marker>
                    <marker
                      id="las"
                      markerWidth="6"
                      markerHeight="6"
                      refX="1"
                      refY="3"
                      orient="auto"
                    >
                      <path d="M6,0 L6,6 L0,3z" fill="#64748b" />
                    </marker>
                  </defs>
                  <text
                    x="260"
                    y="96"
                    textAnchor="middle"
                    fill="#64748b"
                    style={{ fontSize: 9, fontFamily: "monospace" }}
                  >
                    Lap Length (L_d)
                  </text>
                  <text
                    x="25"
                    y="33"
                    fill="#c0392b"
                    style={{
                      fontSize: 9,
                      fontFamily: "monospace",
                      fontWeight: 700,
                    }}
                  >
                    BAR 1
                  </text>
                  <text
                    x="440"
                    y="53"
                    fill="#2563eb"
                    style={{
                      fontSize: 9,
                      fontFamily: "monospace",
                      fontWeight: 700,
                    }}
                  >
                    BAR 2
                  </text>
                  <text
                    x="20"
                    y="112"
                    fill="#64748b"
                    style={{ fontSize: 8, fontFamily: "monospace" }}
                  >
                    ✓ Preferred location: Middle 1/3 of span (low bending moment
                    zone)
                  </text>
                </svg>
              </div>

              <div className="tbl-wrap">
                <table className="bbs-table">
                  <thead>
                    <tr>
                      <th>Source Element</th>
                      <th>Mark</th>
                      <th className="th-left">Bar Description</th>
                      <th>Dia (mm)</th>
                      <th>Lap Length (m)</th>
                      <th>Lap Length (mm)</th>
                      <th>Zone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lapSpliceData.length > 0 ? (
                      lapSpliceData.map((r, i) => (
                        <tr key={i}>
                          <td className="td-source">{r.source}</td>
                          <td className="td-mark">{r.mark}</td>
                          <td className="td-source">{r.desc}</td>
                          <td className="td-dia">φ{r.dia}</td>
                          <td className="td-right">{r.lapLen.toFixed(3)} m</td>
                          <td className="td-right td-orange">
                            {r.lapLenMm} mm
                          </td>
                          <td>
                            <span
                              className={`zone-badge ${r.zone.includes("Tension") ? "zone-badge--tension" : "zone-badge--compression"}`}
                            >
                              {r.zone}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="td-empty">
                          No lap splice entries found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="tbl-note">
                * IS 456:2000 Cl.26.2.5 — Lap splices preferred in middle 1/3 of
                span. Not more than half the bars spliced at same section.
              </p>
            </div>
          </Card>
        )}

        {/* ── COST SUMMARY ── */}
        {activeView === "cost" && (
          <Card className="result-section-card">
            <CardHeader
              icon="💰"
              title="Material Estimate & Cost Summary"
              subtitle="West Bengal Market Rate · Per-piece (12m rod) — edit rates below to update instantly"
            />
            <div className="card-body-pad">
              {/* FIX #8 — onRateChange now triggers immediate cost recalc in App.jsx */}
              <CostTable
                costs={costs}
                onRateChange={onRateChange}
                details={details}
                onSendBarOrder={handleSendBarOrder}
              />
            </div>
          </Card>
        )}

        {/* Bottom CTA */}
        <div className="result-cta cta-block" style={{ marginTop: 24 }}>
          <div>
            <div className="cta-block__title">📄 Generate & Share Report</div>
            <div className="cta-block__sub">
              Download PDF · Export Excel · Send via WhatsApp
            </div>
          </div>
          <ActionBar />
        </div>

        <div className="is-note">
          <b>IS 456:2000 Cover:</b> Footing/Raft/PileCap 75mm · Beam/Col 40mm ·
          Wall Beam 25mm · Slab 20mm · Staircase/Lintel 25mm &nbsp;·&nbsp; Lap:
          40d · Hook: 9d · Stirrup Dense Zone: L/4 each end · Verify before
          procurement.
        </div>
      </div>
    </div>
  );
}
