// src/components/ProjectDetails.jsx

import { useState } from "react";
import { Card, CardHeader } from "./ui.jsx";

const today = () => new Date().toISOString().split("T")[0];

export const DEFAULT_PROJECT = {
  projectName: "",
  clientName: "",
  clientAddress: "",
  location: "",
  engineerName: "Biswajit Deb Barman",
  engineerPhone: "",
  engineerEmail: "biswajitdebbarman.civil@gmail.com",
  firmName: "Urban Matrix",
  date: today(),
  refNo: "",
  remarks: "",
};

function TF({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  hint = "",
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label className="proj-field-label">
        {label}
        {required && <span className="proj-required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          fontFamily: type === "tel" ? "var(--font-mono)" : "var(--font-sans)",
        }}
      />
      {hint && <div className="field__hint">{hint}</div>}
    </div>
  );
}

function TA({ label, value, onChange, placeholder = "", rows = 2 }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label className="proj-field-label">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{ resize: "vertical" }}
      />
    </div>
  );
}

export default function ProjectDetails({ details, setDetails }) {
  const u = (key) => (val) => setDetails((p) => ({ ...p, [key]: val }));
  const [open, setOpen] = useState(true);

  return (
    <Card style={{ marginBottom: 22 }}>
      <CardHeader
        icon="📋"
        title="Project & Client Details"
        subtitle="These details will appear in the generated report"
        action={
          <button
            onClick={() => setOpen((v) => !v)}
            className="btn btn--ghost btn--sm"
          >
            {open ? "▲ Collapse" : "▼ Expand"}
          </button>
        }
      />

      {open && (
        <div style={{ padding: "20px 22px" }}>
          {/* Row 1 */}
          <div className="proj-row1">
            <TF
              label="Project Name"
              value={details.projectName}
              onChange={u("projectName")}
              placeholder="e.g. Residential G+2 Building"
              required
            />
            <TF
              label="Ref No."
              value={details.refNo}
              onChange={u("refNo")}
              placeholder="e.g. BBS/2025/001"
            />
            <TF
              label="Date"
              value={details.date}
              onChange={u("date")}
              type="date"
              required
            />
          </div>

          {/* 2-col: Client + Engineer */}
          <div className="proj-cols">
            {/* CLIENT */}
            <div>
              <div className="proj-section-title">👤 Client Details</div>
              <TF
                label="Client Name"
                value={details.clientName}
                onChange={u("clientName")}
                placeholder="e.g. Ramesh Kumar Das"
                required
              />
              <TF
                label="Client Address"
                value={details.clientAddress}
                onChange={u("clientAddress")}
                placeholder="e.g. 12, Bhawanipur, Kolkata - 700025"
              />
              <TF
                label="Site Location"
                value={details.location}
                onChange={u("location")}
                placeholder="e.g. Plot No. 45, Salt Lake, Kolkata"
                required
              />
            </div>

            {/* ENGINEER */}
            <div>
              <div className="proj-section-title">
                🧑‍💼 Engineer / Firm Details
              </div>
              <TF
                label="Engineer Name"
                value={details.engineerName}
                onChange={u("engineerName")}
                placeholder="e.g. Er. Amit Banerjee"
                required
              />
              <TF
                label="Firm / Company Name"
                value={details.firmName}
                onChange={u("firmName")}
                placeholder="e.g. Banerjee Structural Consultants"
              />
              <TF
                label="Engineer Email"
                value={details.engineerEmail}
                onChange={u("engineerEmail")}
                placeholder="e.g. amit@firm.com"
                type="email"
              />

              {/* WhatsApp */}
              <div style={{ marginBottom: 14 }}>
                <label
                  className="proj-field-label"
                  style={{ color: "#059669" }}
                >
                  📱 WhatsApp Number <span className="proj-required">*</span>
                </label>
                <div className="wa-input-wrap">
                  <span className="wa-input-prefix">+91</span>
                  <input
                    type="tel"
                    value={details.engineerPhone}
                    onChange={(e) =>
                      u("engineerPhone")(
                        e.target.value.replace(/\D/g, "").slice(0, 10),
                      )
                    }
                    placeholder="9876543210"
                    maxLength={10}
                    className="wa-input"
                    style={{ paddingLeft: "44px" }}
                  />
                  <span className="wa-input-suffix">💬</span>
                </div>
                <div className="wa-hint">
                  ✓ Report PDF will be sent directly to this WhatsApp number
                </div>
              </div>
            </div>
          </div>

          <TA
            label="Remarks / Notes"
            value={details.remarks}
            onChange={u("remarks")}
            placeholder="e.g. Steel as per HYSD Fe-500D. All dimensions in metres. Verify with structural drawings before procurement."
          />
        </div>
      )}
    </Card>
  );
}
