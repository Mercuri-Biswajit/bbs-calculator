// src/components/ProjectDetails.jsx

import { useState } from "react";
import { Card } from "./ui.jsx";

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
  labelClass = "proj-compact-label",
}) {
  return (
    <div className="proj-compact-field">
      <label className={labelClass}>
        {label}
        {required && <span className="proj-required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function ProjectDetails({ details, setDetails }) {
  const u = (key) => (val) => setDetails((p) => ({ ...p, [key]: val }));
  const [open, setOpen] = useState(true);

  return (
    <Card className="proj-card">
      <div className="proj-compact-header">
        <div className="proj-compact-header__left">
          <span className="proj-compact-header__icon">📋</span>
          <span className="proj-compact-header__title">Project Details</span>
          {details.projectName && (
            <span className="proj-compact-header__name">
              — {details.projectName}
            </span>
          )}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="btn btn--ghost btn--sm"
        >
          {open ? "▲ Collapse" : "▼ Expand"}
        </button>
      </div>

      {open && (
        <div className="proj-compact-body">
          {/* Row 1 */}
          <div className="proj-row-fields proj-row-fields--row1">
            <TF
              label="Project Name"
              value={details.projectName}
              onChange={u("projectName")}
              placeholder="e.g. Residential G+2 Building"
              required
            />
            <TF
              label="Client Name"
              value={details.clientName}
              onChange={u("clientName")}
              placeholder="Ramesh Kumar Das"
            />
            <TF
              label="Client Address"
              value={details.clientAddress}
              onChange={u("clientAddress")}
              placeholder="e.g. Bhawanipur, Kolkata"
            />
            <TF
              label="Site Location"
              value={details.location}
              onChange={u("location")}
              placeholder="e.g. Salt Lake, Kolkata"
            />
            <TF
              label="Ref No."
              value={details.refNo}
              onChange={u("refNo")}
              placeholder="BBS/2025/001"
            />
          </div>

          {/* Row 2 */}
          <div className="proj-row-fields proj-row-fields--row2">
            <TF
              label="Date"
              value={details.date}
              onChange={u("date")}
              type="date"
              required
            />
            <TF
              label="Engineer Name"
              value={details.engineerName}
              onChange={u("engineerName")}
              placeholder="Er. Amit Banerjee"
            />
            <TF
              label="Firm / Office"
              value={details.firmName}
              onChange={u("firmName")}
              placeholder="Banerjee Structural Consultants"
            />
            <TF
              label="Email"
              value={details.engineerEmail}
              onChange={u("engineerEmail")}
              placeholder="amit@firm.com"
              type="email"
            />

            {/* WhatsApp */}
            <div className="proj-compact-field">
              <label className="proj-compact-label proj-compact-label--wa">
                📱 Phone (WhatsApp)
              </label>
              <div className="proj-wa-wrap">
                <span className="proj-wa-prefix">+91</span>
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
                  className="proj-wa-input"
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="proj-remarks-label">Remarks / Notes</label>
            <input
              type="text"
              value={details.remarks}
              onChange={(e) => u("remarks")(e.target.value)}
              placeholder="e.g. Steel as per HYSD Fe-500D. All dimensions in metres. Verify with structural drawings."
            />
          </div>
        </div>
      )}
    </Card>
  );
}
