// src/components/ProjectDetails.jsx
// Client info, engineer info, WhatsApp number — used in report

import { useState } from 'react';
import { Card, CardHeader } from './ui.jsx';

const today = () => new Date().toISOString().split('T')[0];

export const DEFAULT_PROJECT = {
  projectName:    '',
  clientName:     '',
  clientAddress:  '',
  location:       '',
  engineerName:   '',
  engineerPhone:  '',   // This is the WhatsApp target number
  engineerEmail:  '',
  firmName:       '',
  date:           today(),
  refNo:          '',
  remarks:        '',
};

function TF({ label, value, onChange, placeholder = '', type = 'text', required = false, hint = '' }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{
        fontSize: 11, fontWeight: 600, color: '#4a5568',
        display: 'block', marginBottom: 4, letterSpacing: 0.4,
      }}>
        {label}
        {required && <span style={{ color: '#c0392b', marginLeft: 3 }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', border: '1.5px solid #d0dce8',
          borderRadius: 6, padding: '8px 11px',
          fontSize: 13, color: '#1a2535',
          fontFamily: type === 'tel' ? 'var(--font-mono)' : 'var(--font-sans)',
          background: '#fff', outline: 'none', boxSizing: 'border-box',
          transition: 'border-color .15s',
        }}
        onFocus={e => e.target.style.borderColor = '#1565c0'}
        onBlur={e => e.target.style.borderColor = '#d0dce8'}
      />
      {hint && <div style={{ fontSize: 10, color: '#8090a8', marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

function TA({ label, value, onChange, placeholder = '', rows = 2 }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: 4, letterSpacing: 0.4 }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: '100%', border: '1.5px solid #d0dce8',
          borderRadius: 6, padding: '8px 11px',
          fontSize: 13, color: '#1a2535',
          fontFamily: 'var(--font-sans)',
          background: '#fff', outline: 'none',
          boxSizing: 'border-box', resize: 'vertical',
        }}
      />
    </div>
  );
}

export default function ProjectDetails({ details, setDetails }) {
  const u = key => val => setDetails(p => ({ ...p, [key]: val }));
  const [open, setOpen] = useState(true);

  return (
    <Card style={{ marginBottom: 20 }}>
      <CardHeader
        icon="📋"
        title="Project & Client Details"
        subtitle="These details will appear in the generated report"
        action={
          <button
            onClick={() => setOpen(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1565c0', fontSize: 13, fontWeight: 600 }}
          >
            {open ? '▲ Collapse' : '▼ Expand'}
          </button>
        }
      />

      {open && (
        <div style={{ padding: '18px 20px' }}>

          {/* Row 1: Project + Ref + Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0 16px' }}>
            <TF label="Project Name" value={details.projectName} onChange={u('projectName')}
              placeholder="e.g. Residential G+2 Building" required />
            <TF label="Ref No." value={details.refNo} onChange={u('refNo')}
              placeholder="e.g. BBS/2025/001" />
            <TF label="Date" value={details.date} onChange={u('date')} type="date" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>

            {/* ── CLIENT DETAILS ── */}
            <div>
              <div style={{
                fontSize: 12, fontWeight: 700, color: '#1565c0',
                borderBottom: '2px solid #e3eefb', paddingBottom: 6, marginBottom: 12,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                👤 Client Details
              </div>
              <TF label="Client Name" value={details.clientName} onChange={u('clientName')}
                placeholder="e.g. Ramesh Kumar Das" required />
              <TF label="Client Address" value={details.clientAddress} onChange={u('clientAddress')}
                placeholder="e.g. 12, Bhawanipur, Kolkata - 700025" />
              <TF label="Site Location" value={details.location} onChange={u('location')}
                placeholder="e.g. Plot No. 45, Salt Lake, Kolkata" required />
            </div>

            {/* ── ENGINEER DETAILS ── */}
            <div>
              <div style={{
                fontSize: 12, fontWeight: 700, color: '#1565c0',
                borderBottom: '2px solid #e3eefb', paddingBottom: 6, marginBottom: 12,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                🧑‍💼 Engineer / Firm Details
              </div>
              <TF label="Engineer Name" value={details.engineerName} onChange={u('engineerName')}
                placeholder="e.g. Er. Amit Banerjee" required />
              <TF label="Firm / Company Name" value={details.firmName} onChange={u('firmName')}
                placeholder="e.g. Banerjee Structural Consultants" />
              <TF label="Engineer Email" value={details.engineerEmail} onChange={u('engineerEmail')}
                placeholder="e.g. amit@firm.com" type="email" />

              {/* WhatsApp Number — highlighted */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#1a7a3c', display: 'block', marginBottom: 4, letterSpacing: 0.4 }}>
                  📱 WhatsApp Number <span style={{ color: '#c0392b' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 13, color: '#4a5568', fontFamily: 'var(--font-mono)',
                  }}>+91</span>
                  <input
                    type="tel"
                    value={details.engineerPhone}
                    onChange={e => u('engineerPhone')(e.target.value.replace(/\D/g,'').slice(0,10))}
                    placeholder="9876543210"
                    maxLength={10}
                    style={{
                      width: '100%', border: '2px solid #25d366',
                      borderRadius: 6, padding: '8px 11px 8px 40px',
                      fontSize: 14, color: '#1a2535',
                      fontFamily: 'var(--font-mono)', fontWeight: 600,
                      background: '#f0fff4', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                  <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>💬</span>
                </div>
                <div style={{ fontSize: 10, color: '#1a7a3c', marginTop: 3 }}>
                  ✓ Report PDF will be sent directly to this WhatsApp number
                </div>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <TA label="Remarks / Notes" value={details.remarks} onChange={u('remarks')}
            placeholder="e.g. Steel as per HYSD Fe-500D. All dimensions in metres. Verify with structural drawings before procurement." />
        </div>
      )}
    </Card>
  );
}
