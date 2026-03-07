// src/pages/ResultPage.jsx
// ─── BBS Result / Report view ─────────────────────────────────────────────────

import { useState } from "react";
import { Card, CardHeader } from "../components/ui.jsx";
import { BBSTable, GroupedBBSTable, CostTable } from "../components/BBSResults.jsx";
import { downloadPDF, sendViaWhatsApp } from "../utils/pdfReport.js";
import { generateBarPurchaseMessage } from "../utils/calculations.js";
import { TABS } from "./CalculatorPage.jsx";

export default function ResultPage({ result, rates, details, onRateChange, onBack }) {
  const [sending, setSending] = useState(false);
  const [sentMsg, setSentMsg] = useState("");
  const [dlBusy,  setDlBusy]  = useState(false);

  const { byType, allRows, costs } = result;
  const totalWt   = allRows.reduce((s, r) => s + r.weight, 0);
  const totalCost = costs.reduce((s, r) => s + r.cost, 0);
  const totalRods = costs.reduce((s, r) => s + r.rods12m, 0);

  const handleDownload = () => {
    setDlBusy(true);
    setTimeout(() => { downloadPDF(details, byType, allRows, costs); setDlBusy(false); }, 100);
  };

  const handleWhatsApp = () => {
    if (!details.engineerPhone || details.engineerPhone.length < 10) {
      alert("Please enter a valid 10-digit WhatsApp number in Project Details.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      const fname = sendViaWhatsApp(details, byType, allRows, costs);
      setSending(false);
      setSentMsg(`PDF saved as "${fname}" · WhatsApp opened — attach the file and hit Send!`);
    }, 200);
  };

  const handleSendBarOrder = () => {
    if (!details.engineerPhone || details.engineerPhone.length < 10) {
      alert("Please enter a valid 10-digit WhatsApp number in Project Details.");
      return;
    }
    const message = encodeURIComponent(generateBarPurchaseMessage(costs, details));
    window.open(`https://wa.me/91${details.engineerPhone}?text=${message}`, "_blank");
  };

  const ActionBar = () => (
    <div className="action-bar">
      <button
        onClick={handleDownload}
        disabled={dlBusy}
        className="btn btn--secondary btn--md"
        style={{
          color: "#fff",
          background: dlBusy ? "#90a4ae" : "rgba(255,255,255,.15)",
          border: "1px solid rgba(255,255,255,.3)",
          backdropFilter: "blur(6px)",
        }}
      >
        {dlBusy ? "⏳ Generating…" : "⬇️ Download PDF"}
      </button>
      <button onClick={handleWhatsApp} disabled={sending} className="btn btn--whatsapp btn--md">
        {sending ? "⏳ Opening…" : "💬 Send Report via WhatsApp"}
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* Result Banner */}
      <div className="result-banner page-pad" style={{ padding: "24px 32px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 1 }}>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <button
              onClick={onBack}
              className="btn btn--sm"
              style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.25)", color: "#fff" }}
            >
              ← Back
            </button>
            {details.projectName && (
              <span style={{ color: "rgba(255,255,255,.9)", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)" }}>
                📌 {details.projectName}
              </span>
            )}
            {details.clientName && (
              <span style={{ color: "rgba(255,255,255,.55)", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                · {details.clientName}
              </span>
            )}
            {details.location && (
              <span style={{ color: "rgba(255,255,255,.45)", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                · {details.location}
              </span>
            )}
            <div style={{ flex: 1 }} />
            <ActionBar />
          </div>

          {/* KPI grid */}
          <div className="kpi-grid">
            {[
              { label: "Total Steel Weight", value: `${totalWt.toFixed(1)} kg`,              sub: "All elements combined" },
              { label: "Total Cost (WB)",    value: `₹${totalCost.toLocaleString("en-IN")}`, sub: "Per-piece rates" },
              { label: "Rods (12m)",         value: `${totalRods} nos`,                       sub: "Std 12m rods to buy" },
              { label: "Elements",           value: `${byType.filter(t => t.rows.length > 0).length}`, sub: `${allRows.length} bar entries` },
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
          <button className="wa-success__dismiss" onClick={() => setSentMsg("")}>✕</button>
        </div>
      )}

      <div className="page-pad" style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 28, paddingBottom: 48 }}>

        {/* Per-type BBS */}
        {byType.map(t => t.rows.length > 0 && (
          <Card key={t.type} style={{ marginBottom: 22 }}>
            <CardHeader
              icon={TABS.find(x => x.id === t.type)?.icon}
              title={`${TABS.find(x => x.id === t.type)?.label} — BBS`}
              subtitle={`${t.items.length} type(s) · ${t.items.reduce((s, i) => s + (+i.count || 1), 0)} nos · IS 2502:1963`}
              action={
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--primary-dark)", fontFamily: "var(--font-mono)" }}>
                  {t.rows.reduce((s, r) => s + r.weight, 0).toFixed(2)} kg
                </span>
              }
            />
            <div style={{ padding: 20 }}>
              <GroupedBBSTable rows={t.rows} />
            </div>
          </Card>
        ))}

        {/* Combined BBS */}
        <Card style={{ marginBottom: 22 }}>
          <CardHeader icon="📋" title="Combined BBS — All Elements" subtitle="Aggregate · IS 2502:1963" />
          <div style={{ padding: 20 }}>
            <BBSTable rows={allRows} showSource={true} />
          </div>
        </Card>

        {/* Cost */}
        <Card style={{ marginBottom: 22 }}>
          <CardHeader icon="💰" title="Material Estimate & Cost Summary" subtitle="West Bengal Market Rate · Per-piece (12m rod)" />
          <div style={{ padding: 20 }}>
            <CostTable costs={costs} onRateChange={onRateChange} details={details} onSendBarOrder={handleSendBarOrder} />
          </div>
        </Card>

        {/* Bottom CTA */}
        <div className="result-cta cta-block" style={{ marginBottom: 16 }}>
          <div>
            <div className="cta-block__title">📄 Generate & Share Report</div>
            <div className="cta-block__sub">Download PDF locally or send directly to WhatsApp</div>
          </div>
          <ActionBar />
        </div>

        <div className="is-note">
          <b>IS 456:2000 Cover:</b> Footing 75mm · Beam/Col 40mm · Wall Beam 25mm · Slab 20mm · Staircase 25mm
          &nbsp;·&nbsp; Lap: 40d · Hook: 9d · Verify before procurement.
        </div>
      </div>
    </div>
  );
}
