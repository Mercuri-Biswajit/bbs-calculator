// src/components/ui.jsx — Reusable UI primitives (CSS-class driven)

export function Card({ children, style, className = "" }) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, icon }) {
  return (
    <div className="card__header">
      <div className="card__header-left">
        <div className="card__header-title-row">
          {icon && <span className="card__header-icon">{icon}</span>}
          <span className="card__header-title">{title}</span>
        </div>
        {subtitle && (
          <div className="card__header-subtitle">{subtitle}</div>
        )}
      </div>
      {action}
    </div>
  );
}

export function Field({ label, value, onChange, unit = "", step = "0.01", min = "0" }) {
  return (
    <div className="field">
      <label className="field__label">
        {label}
        {unit && <span className="field__label-unit">[{unit}]</span>}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={step}
        min={min}
      />
    </div>
  );
}

export function DiaSelect({ label, value, onChange }) {
  const dias = [6, 8, 10, 12, 16, 20, 25, 32];
  const wt = { 6: 0.222, 8: 0.395, 10: 0.617, 12: 0.888, 16: 1.578, 20: 2.469, 25: 3.858, 32: 6.313 };
  return (
    <div className="field">
      <label className="field__label">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {dias.map((d) => (
          <option key={d} value={d}>φ{d}mm — {wt[d]} kg/m</option>
        ))}
      </select>
    </div>
  );
}

export function Button({ children, onClick, variant = "primary", size = "md", fullWidth, style: extStyle, disabled }) {
  return (
    <button
      className={`btn btn--${variant} btn--${size}${fullWidth ? " btn--full" : ""}`}
      style={{ width: fullWidth ? "100%" : undefined, ...extStyle }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function Badge({ label, color = "blue" }) {
  return (
    <span className={`badge badge--${color}`}>{label}</span>
  );
}

export function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "14px 0" }}>
      <div style={{ flex: 1, height: 1, background: "var(--border-2)" }} />
      {label && (
        <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, letterSpacing: 0.5 }}>
          {label}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: "var(--border-2)" }} />
    </div>
  );
}

export function Tooltip({ text, children }) {
  return (
    <span style={{ position: "relative", display: "inline-flex" }} title={text}>
      {children}
    </span>
  );
}

export function SectionTitle({ icon, title, subtitle }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      {icon && (
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "var(--primary-light)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16,
        }}>
          {icon}
        </div>
      )}
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: "var(--text-3)" }}>{subtitle}</div>}
      </div>
    </div>
  );
}