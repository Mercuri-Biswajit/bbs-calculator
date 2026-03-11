// src/components/ProjectDetails.jsx

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
  isWa = false,
}) {
  return (
    <div className="proj-full-field">
      <label className="proj-full-label">
        {isWa ? "📱 " : ""}{label}
        {required && <span style={{color: 'var(--red)', marginLeft: 4}}>*</span>}
      </label>
      {isWa ? (
        <div className="proj-wa-wrap">
          <span className="proj-wa-prefix">+91</span>
          <input
            type="tel"
            value={value}
            onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder={placeholder}
            maxLength={10}
            className="proj-wa-input proj-full-input"
          />
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="proj-full-input"
        />
      )}
    </div>
  );
}

export default function ProjectDetails({ details, setDetails, onStart, projectReady }) {
  const u = (key) => (val) => setDetails((p) => ({ ...p, [key]: val }));

  return (
    <Card className="proj-full-card">
      <div className="proj-full-header">
        <h2 className="proj-full-title">
          <span style={{ fontSize: 26 }}>📋</span> Project Details
        </h2>
        <div className="proj-full-subtitle">
          Please enter the project metadata before starting your calculations. This information will be printed on the final generated BBS report.
        </div>
      </div>

      <div className="proj-full-grid">
        <TF label="Project Name" value={details.projectName} onChange={u("projectName")} placeholder="e.g. G+2 Residential Building" required />
        <TF label="Date" value={details.date} onChange={u("date")} type="date" required />
        
        <TF label="Client Name" value={details.clientName} onChange={u("clientName")} placeholder="e.g. Ramesh Kumar Das" />
        <TF label="Client Address" value={details.clientAddress} onChange={u("clientAddress")} placeholder="e.g. Bhawanipur, Kolkata" />
        
        <TF label="Site Location" value={details.location} onChange={u("location")} placeholder="e.g. Salt Lake, Sector V" />
        <TF label="Ref No." value={details.refNo} onChange={u("refNo")} placeholder="BBS/2026/001" />

        <TF label="Engineer Name" value={details.engineerName} onChange={u("engineerName")} placeholder="Er. Amit Banerjee" />
        <TF label="Firm / Office" value={details.firmName} onChange={u("firmName")} placeholder="Banerjee Structural Consultants" />

        <TF label="Email" value={details.engineerEmail} onChange={u("engineerEmail")} placeholder="engineer@office.com" type="email" />
        <TF label="Phone (WhatsApp)" value={details.engineerPhone} onChange={u("engineerPhone")} placeholder="9876543210" isWa />
      </div>

      <div className="proj-full-field" style={{ marginBottom: 32 }}>
        <label className="proj-full-label">Remarks / Notes</label>
        <input
          type="text"
          value={details.remarks}
          onChange={(e) => u("remarks")(e.target.value)}
          placeholder="e.g. Steel as per HYSD Fe-500D. All dimensions in metres. Verify with structural drawings."
          className="proj-full-input"
        />
      </div>

      {onStart && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 24, borderTop: '1px solid var(--border-2)' }}>
          <button 
            className="btn btn--primary btn--lg" 
            onClick={onStart}
            disabled={!projectReady}
            style={{ padding: '14px 36px', fontSize: 14, letterSpacing: '0.3px' }}
          >
            Start Calculation 🚀
          </button>
        </div>
      )}
    </Card>
  );
}
