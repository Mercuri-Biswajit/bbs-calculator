// src/components/ui.jsx — Reusable UI primitives

export function Card({ children, style, className = '' }) {
  return (
    <div className={className} style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)',
      ...style
    }}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, icon }) {
  return (
    <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border2)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', letterSpacing: .2 }}>{title}</span>
        </div>
        {subtitle && <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

export function Field({ label, value, onChange, unit = '', step = '0.01', min = '0' }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 600, display: 'block', marginBottom: 4, letterSpacing: .4 }}>
        {label}{unit && <span style={{ color: 'var(--primary)', marginLeft: 4 }}>[{unit}]</span>}
      </label>
      <input type="number" value={value} onChange={e => onChange(e.target.value)} step={step} min={min} />
    </div>
  );
}

export function DiaSelect({ label, value, onChange }) {
  const dias = [6,8,10,12,16,20,25,32];
  const wt   = { 6:0.222,8:0.395,10:0.617,12:0.888,16:1.578,20:2.469,25:3.858,32:6.313 };
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 600, display: 'block', marginBottom: 4, letterSpacing: .4 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {dias.map(d => <option key={d} value={d}>φ{d}mm — {wt[d]} kg/m</option>)}
      </select>
    </div>
  );
}

export function Button({ children, onClick, variant = 'primary', size = 'md', fullWidth, style: extStyle }) {
  const base = {
    border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    transition: 'all .15s', cursor: 'pointer',
    width: fullWidth ? '100%' : undefined,
  };
  const variants = {
    primary:   { background: 'var(--primary)',      color: '#fff',             padding: size==='sm'?'6px 12px':'10px 18px', fontSize: size==='sm'?12:13 },
    secondary: { background: 'var(--surface2)',     color: 'var(--text)',      border: '1px solid var(--border)', padding: size==='sm'?'5px 12px':'9px 18px', fontSize: size==='sm'?12:13 },
    danger:    { background: '#fff0f0',             color: '#c0392b',          border: '1px solid #f5c6c6', padding: size==='sm'?'5px 10px':'9px 16px', fontSize: size==='sm'?12:13 },
    ghost:     { background: 'transparent',         color: 'var(--primary)',   padding: size==='sm'?'5px 10px':'9px 16px', fontSize: size==='sm'?12:13 },
    success:   { background: '#f0faf3',             color: 'var(--green)',     border: '1px solid #b7e4c7', padding: size==='sm'?'5px 12px':'9px 18px', fontSize: size==='sm'?12:13 },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...extStyle }} onClick={onClick}>{children}</button>
  );
}

export function Badge({ label, color = 'blue' }) {
  const colors = {
    blue:   { bg: 'var(--primary-light)', text: 'var(--primary)' },
    red:    { bg: '#fdecea',  text: '#c0392b' },
    green:  { bg: '#eafaf1',  text: '#1e7e34' },
    orange: { bg: '#fef5e7',  text: '#d35400' },
    purple: { bg: '#f4ecfd',  text: '#6f42c1' },
    grey:   { bg: 'var(--surface2)', text: 'var(--text2)' },
  };
  const c = colors[color] || colors.blue;
  return (
    <span style={{ display:'inline-block', padding:'2px 8px', borderRadius:99, fontSize:11, fontWeight:700, fontFamily:'var(--font-mono)', background:c.bg, color:c.text }}>
      {label}
    </span>
  );
}

export function Divider({ label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, margin:'14px 0' }}>
      <div style={{ flex:1, height:1, background:'var(--border2)' }}/>
      {label && <span style={{ fontSize:11, color:'var(--text3)', fontWeight:600, letterSpacing:.5 }}>{label}</span>}
      <div style={{ flex:1, height:1, background:'var(--border2)' }}/>
    </div>
  );
}

export function Tooltip({ text, children }) {
  return (
    <span style={{ position:'relative', display:'inline-flex' }} title={text}>
      {children}
    </span>
  );
}

export function SectionTitle({ icon, title, subtitle }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
      {icon && <div style={{ width:32, height:32, borderRadius:8, background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{icon}</div>}
      <div>
        <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>{title}</div>
        {subtitle && <div style={{ fontSize:11, color:'var(--text3)' }}>{subtitle}</div>}
      </div>
    </div>
  );
}
