// Vialys — primitive UI components

import React from 'react';
import { VIcon, VialysMark } from './icons.jsx';
import { ESTADO_NM, ESTADO_PILL, TEST_BY_ID, calcEdad, estadoOrden } from './data.jsx';

function Pill({ kind = 'muted', children, dot = false }) {
  return <span className={`v-pill ${kind}`}>{dot && <span className="dot"/>}{children}</span>;
}

function EstadoPill({ estado }) {
  return <Pill kind={ESTADO_PILL[estado] || 'muted'} dot>{ESTADO_NM[estado]}</Pill>;
}

function AppBar({ title, sub, left, right, dark = true }) {
  return (
    <div className="v-appbar solid" style={dark ? {} : { background: '#fff', color: 'var(--v-ink)', borderBottom: '1px solid var(--v-line)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
        {left}
        <div style={{ minWidth: 0 }}>
          {sub && <div className="v-sub">{sub}</div>}
          <div className="v-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>{right}</div>
    </div>
  );
}

function BackBtn({ onClick }) {
  return <button className="v-iconbtn" onClick={onClick} aria-label="Volver"><VIcon.chevL size={18} color="#fff"/></button>;
}

function TabBar({ items, active, onChange }) {
  return (
    <nav className="v-tabbar">
      {items.map(it => {
        const Icon = VIcon[it.icon];
        const isActive = active === it.id;
        return (
          <button key={it.id} className={`v-tab ${isActive ? 'active' : ''}`} onClick={() => onChange(it.id)}>
            <span className="v-tab-icon"><Icon size={22} color={isActive ? 'var(--v-teal)' : 'var(--v-subtle)'}/></span>
            <span>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function SectionTitle({ children, action }) {
  return <div className="v-section-title">{children}{action && <span className="v-link">{action}</span>}</div>;
}

function Field({ label, help, children }) {
  return (
    <div className="v-field">
      {label && <label className="v-label">{label}</label>}
      {children}
      {help && <div className="v-help">{help}</div>}
    </div>
  );
}

function Btn({ children, onClick, kind = '', size = '', full = false, disabled = false, type = 'button' }) {
  return <button type={type} className={`v-btn ${kind} ${size} ${full ? 'full' : ''}`} onClick={onClick} disabled={disabled} style={disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>{children}</button>;
}

function Toast({ toasts }) {
  return (
    <div className="v-toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`v-toast ${t.kind || ''}`}>
          {t.kind === 'ok' && <VIcon.check size={18} color="#fff"/>}
          {t.kind === 'bad' && <VIcon.alert size={18} color="#fff"/>}
          {!t.kind && <VIcon.bell size={18} color="#fff"/>}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

function Sheet({ open, title, onClose, children, footer }) {
  if (!open) return null;
  return (
    <div className="v-sheet-scrim" onClick={onClose}>
      <div className="v-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="v-grab"/>
        <div className="v-sheet-head">
          <h3>{title}</h3>
          <button className="v-iconbtn dark" onClick={onClose}><VIcon.x size={16}/></button>
        </div>
        <div className="v-sheet-body">{children}</div>
        {footer && <div className="v-sheet-foot">{footer}</div>}
      </div>
    </div>
  );
}

function Logo({ size = 'md', light = false }) {
  return (
    <div className={`v-logo ${light ? 'inverse' : ''}`}>
      <VialysMark size={size === 'lg' ? 40 : 32} light={light}/>
      <span className="nm" style={{ fontSize: size === 'lg' ? 26 : 20 }}>Vialys</span>
    </div>
  );
}

// Mini stripe placeholder for imagery
function Placeholder({ h = 80, label = '' }) {
  return (
    <div style={{
      height: h, borderRadius: 'var(--r-md)',
      background: 'repeating-linear-gradient(135deg, var(--v-bg-soft) 0 8px, var(--v-line-2) 8px 16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--v-subtle)', fontSize: 11, fontFamily: 'var(--v-mono)', letterSpacing: 0.06,
    }}>{label}</div>
  );
}

function ProcessShell({ icon = 'orders', title, subtitle, tone = 'teal', stats = [], children }) {
  const palette = {
    teal: ['var(--v-teal)', 'var(--v-teal-50)', 'var(--v-teal-100)'],
    navy: ['var(--v-navy)', 'var(--v-navy-50)', 'var(--v-navy-100)'],
    info: ['var(--v-info)', 'var(--v-info-bg)', '#BAE6FD'],
    ok: ['var(--v-ok)', 'var(--v-ok-bg)', '#BBF7D0'],
    warn: ['var(--v-warn)', 'var(--v-warn-bg)', '#FED7AA'],
  };
  const c = palette[tone] || palette.teal;
  const Icon = VIcon[icon] || VIcon.orders;
  return (
    <div className="v-process">
      <div className="v-card v-card-pad" style={{ background: `linear-gradient(135deg, ${c[1]}, #fff 72%)`, border: `1px solid ${c[2]}`, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: c[0], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={22} color="#fff"/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 17, fontFamily: 'var(--v-font-display)' }}>{title}</div>
            <div style={{ fontSize: 12, color: 'var(--v-muted)', marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>
        {stats.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(118px, 1fr))', gap: 8, marginTop: 14 }}>
            {stats.map(s => <ProcessStat key={s.label} {...s}/>)}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function ProcessStat({ label, value, note, kind = 'muted' }) {
  const colors = {
    muted: ['var(--v-navy)', 'var(--v-bg)', 'var(--v-line)'],
    brand: ['var(--v-navy)', 'var(--v-navy-50)', 'var(--v-navy-100)'],
    teal: ['var(--v-teal)', 'var(--v-teal-50)', 'var(--v-teal-100)'],
    info: ['var(--v-info)', 'var(--v-info-bg)', '#BAE6FD'],
    warn: ['var(--v-warn)', 'var(--v-warn-bg)', '#FED7AA'],
    bad: ['var(--v-bad)', 'var(--v-bad-bg)', '#FECACA'],
    ok: ['var(--v-ok)', 'var(--v-ok-bg)', '#BBF7D0'],
  };
  const c = colors[kind] || colors.muted;
  return (
    <div style={{ minHeight: 76, padding: '10px 12px', borderRadius: 10, border: `1px solid ${c[2]}`, background: c[1] }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.06, textTransform: 'uppercase', color: 'var(--v-muted)' }}>{label}</div>
      <div style={{ fontFamily: 'var(--v-font-display)', fontWeight: 800, color: c[0], fontSize: 24, lineHeight: 1.05, marginTop: 4 }}>{value}</div>
      {note && <div style={{ fontSize: 11, color: c[0], fontWeight: 600, marginTop: 2 }}>{note}</div>}
    </div>
  );
}

function ProcessToolbar({ title, count, search, onSearch, placeholder = 'Buscar por DNI o nombre', action }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: action ? 'minmax(220px, 1fr) auto' : '1fr', gap: 10, alignItems: 'end', marginBottom: 12 }}>
      <div>
        <SectionTitle action={typeof count === 'number' ? `${count} registros` : null}>{title}</SectionTitle>
        {onSearch && (
          <div style={{ position: 'relative' }}>
            <input className="v-input" placeholder={placeholder} value={search} onChange={(e) => onSearch(e.target.value)} style={{ paddingLeft: 40 }}/>
            <div style={{ position: 'absolute', left: 12, top: 13 }}><VIcon.search size={18} color="var(--v-subtle)"/></div>
          </div>
        )}
      </div>
      {action}
    </div>
  );
}

function ProcessEmpty({ icon = 'check', title, subtitle }) {
  const Icon = VIcon[icon] || VIcon.check;
  return (
    <div className="v-card v-card-pad" style={{ textAlign: 'center', color: 'var(--v-muted)', padding: 26 }}>
      <Icon size={30} color="var(--v-subtle)"/>
      <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: 'var(--v-ink)' }}>{title}</div>
      {subtitle && <div style={{ marginTop: 3, fontSize: 12 }}>{subtitle}</div>}
    </div>
  );
}

function ProcessOrderCard({ orden, onClick, status, meta, action, alert, progress }) {
  return (
    <div className="v-order" onClick={onClick} style={{ minHeight: 128 }}>
      <div className="row">
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{orden.paciente.ap}, {orden.paciente.nm}</div>
          <div className="meta">DNI {orden.paciente.dni} · {calcEdad(orden.paciente.fn)} años · {orden.paciente.sx}</div>
        </div>
        {status || <EstadoPill estado={estadoOrden ? estadoOrden(orden) : orden.estado}/>}
      </div>
      {meta && <div style={{ fontSize: 12, color: 'var(--v-muted)', lineHeight: 1.35 }}>{meta}</div>}
      <div className="tests">
        {orden.tests.slice(0, 3).map(t => <Pill key={t} kind="muted">{TEST_BY_ID[t]?.nm}</Pill>)}
        {orden.tests.length > 3 && <Pill kind="muted">+{orden.tests.length - 3}</Pill>}
      </div>
      {typeof progress === 'number' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 7, borderRadius: 99, background: 'var(--v-line-2)', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--v-navy), var(--v-teal))' }}/>
          </div>
          <span style={{ fontFamily: 'var(--v-mono)', fontSize: 11, color: 'var(--v-muted)', fontWeight: 700 }}>{progress}%</span>
        </div>
      )}
      {alert}
      <div className="row" style={{ marginTop: 2 }}>
        <span className="code">{orden.code}</span>
        {action}
      </div>
    </div>
  );
}

export {
  Pill, EstadoPill, AppBar, BackBtn, TabBar, SectionTitle, Field, Btn, Toast, Sheet, Logo, Placeholder,
  ProcessShell, ProcessStat, ProcessToolbar, ProcessEmpty, ProcessOrderCard
};
