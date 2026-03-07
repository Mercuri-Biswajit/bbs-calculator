// src/components/ItemManager.jsx
// Handles adding multiple instances of any element type

import { useState } from 'react';
import { Card, CardHeader, Field, DiaSelect, Button, Badge, Divider } from './ui.jsx';
import { DrawingFooting, DrawingColumn, DrawingBeam, DrawingSlab } from '../utils/drawings.jsx';

// ─── DEFAULT PARAMS PER TYPE ──────────────────────────────────────────────────
export const DEFAULTS = {
  footing:    { label:'Footing F1',    L:'1.5', B:'1.5', D:'0.45', mainDia:'12', distDia:'12', spacing:'150' },
  column:     { label:'Column C1',     H:'3',   B:'0.3', D:'0.3',  mainDia:'16', mainNos:'4',  tieDia:'8', tieSpacing:'150' },
  plinthBeam: { label:'Plinth Beam PB1',L:'4',  B:'0.23',D:'0.45', botDia:'16', botNos:'3', topDia:'12', topNos:'2', exTopDia:'12', exTopNos:'1', stirDia:'8', stirSpacing:'150' },
  wallBeam:   { label:'Wall Beam WB1', L:'4',   B:'0.23',D:'0.35', botDia:'12', botNos:'3', topDia:'10', topNos:'2', exTopDia:'10', exTopNos:'0', stirDia:'8', stirSpacing:'200' },
  slab:       { label:'Slab S1',       L:'4',   B:'3',   D:'0.125',mainDia:'10', distDia:'8', mainSp:'150', distSp:'200', topDia:'8', topSp:'150' },
};

let _id = 0;
export const newItem = (type) => ({ id: ++_id, count: 1, ...DEFAULTS[type] });

// ─── FOOTING FORM ─────────────────────────────────────────────────────────────
function FootingForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 14px' }}>
      <Field label="Length L" value={item.L} onChange={u('L')} unit="m" />
      <Field label="Width B"  value={item.B} onChange={u('B')} unit="m" />
      <Field label="Depth D"  value={item.D} onChange={u('D')} unit="m" />
      <Field label="Bar Spacing" value={item.spacing} onChange={u('spacing')} unit="mm" step="10" />
      <DiaSelect label="Main Bar Dia" value={item.mainDia} onChange={u('mainDia')} />
      <DiaSelect label="Dist Bar Dia" value={item.distDia} onChange={u('distDia')} />
    </div>
  );
}

// ─── COLUMN FORM ──────────────────────────────────────────────────────────────
function ColumnForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 14px' }}>
      <Field label="Storey Height H" value={item.H} onChange={u('H')} unit="m" />
      <Field label="Width B" value={item.B} onChange={u('B')} unit="m" />
      <Field label="Depth D" value={item.D} onChange={u('D')} unit="m" />
      <Field label="No. of Main Bars" value={item.mainNos} onChange={u('mainNos')} unit="nos" step="1" />
      <DiaSelect label="Main Bar Dia" value={item.mainDia} onChange={u('mainDia')} />
      <DiaSelect label="Lateral Tie Dia" value={item.tieDia} onChange={u('tieDia')} />
      <Field label="Tie Spacing" value={item.tieSpacing} onChange={u('tieSpacing')} unit="mm" step="10" />
    </div>
  );
}

// ─── BEAM FORM ────────────────────────────────────────────────────────────────
function BeamForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 14px' }}>
      <Field label="Span L" value={item.L} onChange={u('L')} unit="m" />
      <Field label="Width B" value={item.B} onChange={u('B')} unit="m" />
      <Field label="Depth D" value={item.D} onChange={u('D')} unit="m" />
      <Field label="No. Bottom Bars" value={item.botNos} onChange={u('botNos')} unit="nos" step="1" />
      <DiaSelect label="Bottom Bar Dia" value={item.botDia} onChange={u('botDia')} />
      <Field label="No. Top Bars" value={item.topNos} onChange={u('topNos')} unit="nos" step="1" />
      <DiaSelect label="Top Bar Dia" value={item.topDia} onChange={u('topDia')} />
      <Field label="No. Extra Top Bars" value={item.exTopNos} onChange={u('exTopNos')} unit="nos" step="1" />
      <DiaSelect label="Extra Top Dia" value={item.exTopDia} onChange={u('exTopDia')} />
      <DiaSelect label="Stirrup Dia" value={item.stirDia} onChange={u('stirDia')} />
      <Field label="Stirrup Spacing" value={item.stirSpacing} onChange={u('stirSpacing')} unit="mm" step="10" />
    </div>
  );
}

// ─── SLAB FORM ────────────────────────────────────────────────────────────────
function SlabForm({ item, onChange }) {
  const u = (k) => (v) => onChange(k, v);
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 14px' }}>
      <Field label="Span Lx" value={item.L} onChange={u('L')} unit="m" />
      <Field label="Span Ly" value={item.B} onChange={u('B')} unit="m" />
      <Field label="Thickness D" value={item.D} onChange={u('D')} unit="m" />
      <DiaSelect label="Main Bar Dia" value={item.mainDia} onChange={u('mainDia')} />
      <Field label="Main Bar Spacing" value={item.mainSp} onChange={u('mainSp')} unit="mm" step="10" />
      <DiaSelect label="Dist Bar Dia" value={item.distDia} onChange={u('distDia')} />
      <Field label="Dist Bar Spacing" value={item.distSp} onChange={u('distSp')} unit="mm" step="10" />
      <DiaSelect label="Top Bar Dia (@supports)" value={item.topDia} onChange={u('topDia')} />
      <Field label="Top Bar Spacing" value={item.topSp} onChange={u('topSp')} unit="mm" step="10" />
    </div>
  );
}

function getForm(type) {
  return { footing: FootingForm, column: ColumnForm, plinthBeam: BeamForm, wallBeam: BeamForm, slab: SlabForm }[type];
}

function getDrawing(type, item) {
  if (type === 'footing')    return <DrawingFooting {...item} />;
  if (type === 'column')     return <DrawingColumn {...item} />;
  if (type === 'plinthBeam') return <DrawingBeam {...item} coverType="plinthBeam" />;
  if (type === 'wallBeam')   return <DrawingBeam {...item} coverType="wallBeam" />;
  if (type === 'slab')       return <DrawingSlab {...item} />;
}

const TYPE_COLORS = { footing:'orange', column:'blue', plinthBeam:'green', wallBeam:'purple', slab:'red' };
const TYPE_ICONS  = { footing:'🏗', column:'🏛', plinthBeam:'🔩', wallBeam:'⚙️', slab:'▦' };

// ─── SINGLE ITEM CARD ─────────────────────────────────────────────────────────
function ItemCard({ item, type, onChange, onRemove, index }) {
  const [showDrawing, setShowDrawing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const Form = getForm(type);

  return (
    <Card style={{ marginBottom: 12 }} className="fade-in">
      {/* Header */}
      <div style={{ padding:'10px 14px', background:'var(--surface2)', borderBottom:'1px solid var(--border2)', display:'flex', alignItems:'center', gap:10, borderRadius:'var(--radius) var(--radius) 0 0' }}>
        <Badge label={`#${index+1}`} color={TYPE_COLORS[type]} />
        <input
          value={item.label}
          onChange={e => onChange('label', e.target.value)}
          style={{ flex:1, border:'none', background:'transparent', fontWeight:600, fontSize:13, color:'var(--text)', outline:'none', fontFamily:'var(--font-sans)' }}
        />
        {/* Count */}
        <div style={{ display:'flex', alignItems:'center', gap:6, background:'white', border:'1px solid var(--border)', borderRadius:6, padding:'3px 8px' }}>
          <span style={{ fontSize:11, color:'var(--text3)', fontWeight:600, whiteSpace:'nowrap' }}>Qty:</span>
          <input
            type="number" min="1" step="1" value={item.count}
            onChange={e => onChange('count', Math.max(1, +e.target.value))}
            style={{ width:48, border:'none', textAlign:'center', fontFamily:'var(--font-mono)', fontWeight:700, color:'var(--primary)', fontSize:14, background:'transparent', outline:'none', padding:0 }}
          />
          <span style={{ fontSize:11, color:'var(--text3)' }}>nos</span>
        </div>
        <Button size="sm" variant="ghost" onClick={() => setShowDrawing(v => !v)}>
          {showDrawing ? '🗺 Hide' : '📐 Drawing'}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setCollapsed(v => !v)}>
          {collapsed ? '▼ Expand' : '▲ Collapse'}
        </Button>
        <Button size="sm" variant="danger" onClick={onRemove}>✕ Remove</Button>
      </div>

      {/* Drawing */}
      {showDrawing && !collapsed && (
        <div style={{ padding:'14px 18px', background:'var(--primary-light)', borderBottom:'1px solid var(--border2)' }}>
          {getDrawing(type, item)}
        </div>
      )}

      {/* Form */}
      {!collapsed && (
        <div style={{ padding:'14px 18px' }}>
          <Form item={item} onChange={onChange} />
        </div>
      )}
    </Card>
  );
}

// ─── ITEM MANAGER ─────────────────────────────────────────────────────────────
export function ItemManager({ type, items, setItems }) {
  const addItem = () => {
    const n = items.length + 1;
    const prefixes = { footing:'F', column:'C', plinthBeam:'PB', wallBeam:'WB', slab:'S' };
    const item = newItem(type);
    item.label = `${type.includes('Beam') ? type.replace(/([A-Z])/g,' $1').trim() : type.charAt(0).toUpperCase()+type.slice(1)} ${prefixes[type]}${n}`;
    setItems(prev => [...prev, item]);
  };

  const updateItem = (id, key, value) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [key]: value } : it));
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const totalCount = items.reduce((s, it) => s + (+it.count || 1), 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:20 }}>{TYPE_ICONS[type]}</span>
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:'var(--text)' }}>
              {type === 'plinthBeam' ? 'Plinth Beams' : type === 'wallBeam' ? 'Wall Beams' : type.charAt(0).toUpperCase()+type.slice(1)+'s'}
            </div>
            <div style={{ fontSize:11, color:'var(--text3)', fontFamily:'var(--font-mono)' }}>
              {items.length} types · {totalCount} total nos
            </div>
          </div>
        </div>
        <Button onClick={addItem} variant="primary" size="sm">
          + Add {TYPE_ICONS[type]}
        </Button>
      </div>

      {items.length === 0 && (
        <div style={{ textAlign:'center', padding:'32px 20px', color:'var(--text3)', border:'2px dashed var(--border)', borderRadius:'var(--radius)', background:'var(--surface2)' }}>
          <div style={{ fontSize:32, marginBottom:8 }}>{TYPE_ICONS[type]}</div>
          <div style={{ fontWeight:600, marginBottom:4 }}>No {type}s added yet</div>
          <div style={{ fontSize:12 }}>Click "+ Add" to start adding {type}s to the project</div>
        </div>
      )}

      {items.map((item, i) => (
        <ItemCard
          key={item.id}
          item={item}
          type={type}
          index={i}
          onChange={(k, v) => updateItem(item.id, k, v)}
          onRemove={() => removeItem(item.id)}
        />
      ))}
    </div>
  );
}
