import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles.css';
import './shell.css';
import { IOSDevice } from '../ios-frame.jsx';
import { TweakRadio, TweakSection, TweakToggle, TweaksPanel, useTweaks } from '../tweaks-panel.jsx';
import { VIcon } from '../icons.jsx';
import { App, OrderDetail } from '../app.jsx';
import { Btn, EstadoPill, Logo, Pill, Sheet, Toast } from '../primitives.jsx';
import { NewOrder, RecepcionHome } from '../screens/Recepcion.jsx';
import { TomaForm, TomaHome } from '../screens/Toma.jsx';
import { ProcesamientoForm, ProcesamientoHome } from '../screens/Procesamiento.jsx';
import { EmisionHome, ResultadosSheet } from '../screens/Emision.jsx';
import { AdminScreen, Dashboard, Reportes } from '../screens/Admin.jsx';
import { ESTADO_NM, ESTADOS, ORDENES_SEED, SEDES, TEST_BY_ID, USUARIOS, estadoOrden, fmtDate, sedeNm } from '../data.jsx';

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "viewMode": "desktop",
  "accent": "teal",
  "showFrame": true,
  "darkMode": false
}/*EDITMODE-END*/;

const ACCENTS = {
  teal:  { teal: '#0D9488', teal700: '#0B7A70', teal500: '#14B8A6', teal100: '#CCFBF1', teal50: '#F0FDFA' },
  cyan:  { teal: '#0891B2', teal700: '#0E7490', teal500: '#06B6D4', teal100: '#CFFAFE', teal50: '#ECFEFF' },
  emerald:{ teal: '#059669', teal700: '#047857', teal500: '#10B981', teal100: '#D1FAE5', teal50: '#ECFDF5' },
  rose:  { teal: '#BE185D', teal700: '#9D174D', teal500: '#E11D48', teal100: '#FCE7F3', teal50: '#FFF1F2' },
};

function Root() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // apply accent variables
  useEffect(() => {
    const a = ACCENTS[tweaks.accent] || ACCENTS.teal;
    const r = document.documentElement.style;
    r.setProperty('--v-teal', a.teal);
    r.setProperty('--v-teal-700', a.teal700);
    r.setProperty('--v-teal-600', a.teal);
    r.setProperty('--v-teal-500', a.teal500);
    r.setProperty('--v-teal-100', a.teal100);
    r.setProperty('--v-teal-50', a.teal50);
  }, [tweaks.accent]);

  useEffect(() => {
    document.documentElement.dataset.theme = tweaks.darkMode ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tweaks.darkMode ? '#0B1220' : '#1B3A6B');
  }, [tweaks.darkMode]);

  const isPhone = tweaks.viewMode === 'phone';
  const showFrame = tweaks.showFrame && isPhone;

  return (
    <>
      {isPhone && showFrame && (
        <div className="frame-wrap">
          <IOSDevice color="black">
            <App darkMode={tweaks.darkMode} onToggleTheme={() => setTweak('darkMode', !tweaks.darkMode)}/>
          </IOSDevice>
          <div className="frame-caption">VIALYS · iPhone 15 Pro · 393 × 852</div>
        </div>
      )}

      {isPhone && !showFrame && (
        <div className="frame-wrap">
          <div style={{ width: 393, height: 852, borderRadius: 32, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }}>
            <App darkMode={tweaks.darkMode} onToggleTheme={() => setTweak('darkMode', !tweaks.darkMode)}/>
          </div>
          <div className="frame-caption">VIALYS · 393 × 852</div>
        </div>
      )}

      {!isPhone && (
        <div className="desktop-stage">
          <DesktopShell setTweak={setTweak} tweaks={tweaks}/>
        </div>
      )}

      <TweaksPanel title="Tweaks · Vialys">
        <TweakSection title="Vista">
          <TweakRadio label="Modo" value={tweaks.viewMode} onChange={(v) => setTweak('viewMode', v)}
            options={[{ value: 'phone', label: 'Móvil' }, { value: 'desktop', label: 'Escritorio' }]}/>
          {tweaks.viewMode === 'phone' && (
            <TweakToggle label="Marco iPhone" value={tweaks.showFrame} onChange={(v) => setTweak('showFrame', v)}/>
          )}
        </TweakSection>
        <TweakSection title="Tema">
          <TweakToggle label="Modo oscuro" value={tweaks.darkMode} onChange={(v) => setTweak('darkMode', v)}/>
        </TweakSection>
        <TweakSection title="Acento">
          <TweakRadio label="Color" value={tweaks.accent} onChange={(v) => setTweak('accent', v)}
            options={[
              { value: 'teal', label: 'Teal' },
              { value: 'cyan', label: 'Cyan' },
              { value: 'emerald', label: 'Esmeralda' },
              { value: 'rose', label: 'Rosa' },
            ]}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// Desktop shell — sidebar + same App body, full-width
function LegacyDesktopShell() {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <aside style={{ width: 240, background: '#0F2447', color: '#fff', padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
        <div style={{ padding: '0 6px 18px', borderBottom: '1px solid rgba(255,255,255,0.10)', marginBottom: 14 }}>
          <Logo light/>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 8, letterSpacing: 0.06 }}>RED HUAROCHIRÍ</div>
        </div>
        {[
          { id: 'home', icon: 'chart', label: 'Dashboard', active: true },
          { id: 'orders', icon: 'orders', label: 'Órdenes' },
          { id: 'toma', icon: 'drop', label: 'Toma de muestra' },
          { id: 'proc', icon: 'beaker', label: 'Procesamiento' },
          { id: 'emit', icon: 'printer', label: 'Emisión' },
          { id: 'rep', icon: 'list', label: 'Reportes' },
          { id: 'adm', icon: 'settings', label: 'Administración' },
        ].map(it => {
          const Icon = VIcon[it.icon];
          return (
            <button key={it.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 8, color: it.active ? '#fff' : 'rgba(255,255,255,0.65)',
              background: it.active ? 'rgba(13,148,136,0.20)' : 'transparent',
              fontWeight: it.active ? 600 : 500, fontSize: 13, textAlign: 'left', cursor: 'pointer',
              border: it.active ? '1px solid rgba(13,148,136,0.40)' : '1px solid transparent',
            }}>
              <Icon size={18} color={it.active ? '#14B8A6' : 'rgba(255,255,255,0.6)'}/>
              {it.label}
            </button>
          );
        })}
        <div style={{ flex: 1 }}/>
        <div style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 99, background: '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#fff' }}>LS</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Tec. Lab. Luis Saldaña</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>Jefe Provincial</div>
          </div>
        </div>
      </aside>
      <main style={{ flex: 1, overflow: 'auto', background: '#F4F6FA' }}>
        <DesktopMain/>
      </main>
    </div>
  );
}

function DesktopMain() {
  const [range, setRange] = useState('hoy');
  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.08, color: 'var(--v-muted)', textTransform: 'uppercase' }}>DASHBOARD PROVINCIAL</div>
          <div style={{ fontFamily: 'var(--v-font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 2 }}>Red de Salud Huarochirí</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn kind="ghost" size="sm"><VIcon.filter size={14}/> Filtros</Btn>
          <Btn kind="teal" size="sm"><VIcon.download size={14} color="#fff"/> Exportar</Btn>
        </div>
      </div>
      <Dashboard orders={ORDENES_SEED} range={range} setRange={setRange}/>
    </div>
  );
}

// Desktop shell - full viewport, module navigation and shared mobile workflows.
function DesktopShell({ setTweak, tweaks }) {
  const [orders, setOrders] = useState(ORDENES_SEED);
  const [active, setActive] = useState('home');
  const [sheet, setSheet] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [range, setRange] = useState('hoy');
  const user = USUARIOS.find(u => u.id === 'u5');
  const sede = SEDES.find(s => s.id === 'rp');
  const session = { user, sede, role: 'jefe' };

  const toast = (t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 2400);
  };

  const updateOrder = (id, patch) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...patch } : o));
  };

  const nav = [
    { id: 'home', icon: 'chart', label: 'Dashboard', eyebrow: 'DASHBOARD PROVINCIAL', title: 'Red de Salud Huarochiri' },
    { id: 'orders', icon: 'orders', label: 'Ordenes', eyebrow: 'TRAZABILIDAD', title: 'Ordenes de laboratorio' },
    { id: 'recepcion', icon: 'id', label: 'Recepcion', eyebrow: 'REGISTRO', title: 'Recepcion y registro' },
    { id: 'toma', icon: 'drop', label: 'Toma de muestra', eyebrow: 'MUESTRAS', title: 'Toma de muestra' },
    { id: 'proc', icon: 'beaker', label: 'Procesamiento', eyebrow: 'ANALISIS', title: 'Procesamiento' },
    { id: 'emit', icon: 'printer', label: 'Emision', eyebrow: 'RESULTADOS', title: 'Emision de resultados' },
    { id: 'reports', icon: 'list', label: 'Reportes', eyebrow: 'INDICADORES', title: 'Reportes' },
    { id: 'admin', icon: 'settings', label: 'Administracion', eyebrow: 'SISTEMA', title: 'Administracion' },
  ];
  const current = nav.find(n => n.id === active) || nav[0];
  const openOrder = (orden) => setSheet({ type: 'detail', orden });

  const archivedOrders = orders.filter(o => {
    const estado = estadoOrden ? estadoOrden(o) : o.estado;
    return estado === 'vencido' || (o.estado === 'emitido' && !isOrderEmittedToday(o));
  });

  const renderOrders = () => (
    <OrdersKanban
      orders={orders}
      archivedCount={archivedOrders.length}
      onOpen={openOrder}
      onArchive={() => setSheet({ type: 'archive', orders: archivedOrders })}
    />
  );

  const renderContent = () => {
    if (active === 'home') return <Dashboard orders={orders} range={range} setRange={setRange}/>;
    if (active === 'orders') return renderOrders();
    if (active === 'recepcion') return <RecepcionHome orders={orders} sedeId={sede.id} onOpen={openOrder} onNew={() => setSheet({ type: 'newOrder' })}/>;
    if (active === 'toma') return <TomaHome orders={orders} sedeId={sede.id} onOpen={openOrder} toast={toast} onTake={(o) => setSheet({ type: 'takeForm', orden: o })}/>;
    if (active === 'proc') return <ProcesamientoHome orders={orders} sedeId={sede.id} onOpen={(o) => setSheet({ type: 'procForm', orden: o })}/>;
    if (active === 'emit') return <EmisionHome orders={orders} sedeId={sede.id} onOpen={(o) => setSheet({ type: 'emitView', orden: o })}/>;
    if (active === 'reports') return <Reportes orders={orders}/>;
    if (active === 'admin') return <AdminScreen/>;
    return null;
  };

  return (
    <div className="desktop-shell">
      <aside className="desktop-sidebar">
        <div className="desktop-brand" style={{ padding: '0 6px 18px', borderBottom: '1px solid rgba(255,255,255,0.10)', marginBottom: 14 }}>
          <Logo light/>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 8, letterSpacing: 0.06 }}>RED HUAROCHIRI</div>
        </div>
        {nav.map(it => {
          const Icon = VIcon[it.icon];
          const isActive = active === it.id;
          return (
            <button key={it.id} className={`desktop-nav-btn ${isActive ? 'active' : ''}`} onClick={() => setActive(it.id)}>
              <Icon size={18} color={isActive ? '#14B8A6' : 'rgba(255,255,255,0.6)'}/>
              {it.label}
            </button>
          );
        })}
        <div style={{ flex: 1 }}/>
        <div className="desktop-user">
          <div style={{ width: 32, height: 32, borderRadius: 99, background: '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#fff' }}>LS</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Tec. Lab. Luis Saldaña</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>Jefe Provincial</div>
          </div>
        </div>
      </aside>
      <main className="desktop-main">
        <div className="desktop-content">
          <div className="desktop-header">
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.08, color: 'var(--v-muted)', textTransform: 'uppercase' }}>{current.eyebrow}</div>
              <div style={{ fontFamily: 'var(--v-font-display)', fontSize: 'clamp(24px, 2.4vw, 36px)', fontWeight: 800, marginTop: 2 }}>{current.title}</div>
            </div>
            <div className="desktop-actions">
              <Btn kind="ghost" size="sm" onClick={() => setTweak('darkMode', !tweaks.darkMode)}>
                {tweaks.darkMode ? <VIcon.sun size={15}/> : <VIcon.moon size={15}/>}
                {tweaks.darkMode ? 'Modo claro' : 'Modo oscuro'}
              </Btn>
              <Btn kind="ghost" size="sm" onClick={() => setTweak('viewMode', 'phone')}><VIcon.phone size={15}/> Version mobile</Btn>
              <Btn kind="ghost" size="sm"><VIcon.filter size={14}/> Filtros</Btn>
              <Btn kind="teal" size="sm"><VIcon.download size={14} color="#fff"/> Exportar</Btn>
            </div>
          </div>
          {renderContent()}
        </div>
        <Toast toasts={toasts}/>

        {sheet?.type === 'newOrder' && (
          <Sheet open title="Nueva orden" onClose={() => setSheet(null)}>
            <NewOrder sedeId={sede.id} onCancel={() => setSheet(null)} toast={toast}
              onSave={(o) => { setOrders(prev => [o, ...prev]); setSheet(null); toast({ msg: 'Orden registrada - ' + o.code, kind: 'ok' }); }}/>
          </Sheet>
        )}
        {sheet?.type === 'detail' && (
          <Sheet open title={sheet.orden.code} onClose={() => setSheet(null)}>
            <OrderDetail orden={sheet.orden}/>
          </Sheet>
        )}
        {sheet?.type === 'archive' && (
          <Sheet open title="Ordenes archivadas" onClose={() => setSheet(null)}>
            <ArchivedOrdersReport orders={sheet.orders} onOpen={openOrder}/>
          </Sheet>
        )}
        {sheet?.type === 'takeForm' && (
          <Sheet open title="Registrar toma de muestra" onClose={() => setSheet(null)}>
            <TomaForm orden={sheet.orden} onCancel={() => setSheet(null)}
              onSave={(m) => {
                updateOrder(sheet.orden.id, {
                  estado: 'muestra_tomada',
                  muestra: { tipo: m.tipo, hora: new Date(m.hora).toISOString(), condicion: m.cond, observaciones: m.obs },
                  historial: [...sheet.orden.historial, { estado: 'muestra_tomada', usuario: session.user.nm, sede: session.sede.id, ts: new Date().toISOString() }],
                });
                setSheet(null);
                toast({ msg: 'Muestra registrada - ' + sheet.orden.code, kind: 'ok' });
              }}/>
          </Sheet>
        )}
        {sheet?.type === 'procForm' && (
          <Sheet open title="Procesar muestra" onClose={() => setSheet(null)}>
            <ProcesamientoForm orden={sheet.orden} onCancel={() => setSheet(null)}
              onSave={(results) => {
                updateOrder(sheet.orden.id, {
                  resultados: results,
                  estado: 'en_proceso',
                  historial: sheet.orden.historial.find(h => h.estado === 'en_proceso') ? sheet.orden.historial : [...sheet.orden.historial, { estado: 'en_proceso', usuario: session.user.nm, sede: session.sede.id, ts: new Date().toISOString() }],
                });
                setSheet(null);
                toast({ msg: 'Resultados parciales guardados', kind: 'ok' });
              }}
              onComplete={(results) => {
                updateOrder(sheet.orden.id, {
                  resultados: results,
                  estado: 'resultados_completos',
                  historial: [...sheet.orden.historial, { estado: 'resultados_completos', usuario: session.user.nm, sede: session.sede.id, ts: new Date().toISOString() }],
                });
                setSheet(null);
                toast({ msg: 'Procesamiento completo', kind: 'ok' });
              }}/>
          </Sheet>
        )}
        {sheet?.type === 'emitView' && (
          <Sheet open title={'Informe - ' + sheet.orden.code} onClose={() => setSheet(null)}>
            <ResultadosSheet orden={sheet.orden} mode="action" toast={toast}
              onValidate={() => {
                updateOrder(sheet.orden.id, { estado: 'validado', historial: [...sheet.orden.historial, { estado: 'validado', usuario: session.user.nm, sede: session.sede.id, ts: new Date().toISOString() }] });
                setSheet({ type: 'emitView', orden: { ...sheet.orden, estado: 'validado' } });
                toast({ msg: 'Resultados validados', kind: 'ok' });
              }}
              onEmit={() => {
                updateOrder(sheet.orden.id, { estado: 'emitido', historial: [...sheet.orden.historial, { estado: 'emitido', usuario: session.user.nm, sede: session.sede.id, ts: new Date().toISOString() }] });
                setSheet(null);
                toast({ msg: 'Informe emitido', kind: 'ok' });
              }}/>
          </Sheet>
        )}
      </main>
    </div>
  );
}

const BOARD_TODAY = '2026-05-03';

function emittedDateKey(order) {
  const emitted = order.historial?.find(h => h.estado === 'emitido')?.ts || order.fecha;
  return emitted ? emitted.slice(0, 10) : '';
}

function isOrderEmittedToday(order) {
  return emittedDateKey(order) === BOARD_TODAY;
}

function OrdersKanban({ orders, archivedCount, onOpen, onArchive }) {
  const columns = [
    { id: 'registrada', title: 'Registrada', hint: 'Orden ingresada', color: '#D97706', soft: '#FFF7ED', line: '#FED7AA' },
    { id: 'muestra_tomada', title: 'Muestra tomada', hint: 'Pendiente de analisis', color: '#0EA5E9', soft: '#E0F2FE', line: '#BAE6FD' },
    { id: 'en_proceso', title: 'En proceso', hint: 'Resultados parciales', color: '#3D63A0', soft: '#EEF4FF', line: '#C7D7FE' },
    { id: 'resultados_completos', title: 'Resultados completos', hint: 'Lista para validar', color: '#1B3A6B', soft: '#E5EBF4', line: '#CBD5E1' },
    { id: 'validado', title: 'Validado', hint: 'Pendiente de emision', color: '#0D9488', soft: '#F0FDFA', line: '#CCFBF1' },
    { id: 'emitido', title: 'Emitido hoy', hint: 'Cierre del dia', color: '#16A34A', soft: '#ECFDF3', line: '#BBF7D0' },
  ];

  const visibleOrders = orders.filter(o => {
    const estado = estadoOrden ? estadoOrden(o) : o.estado;
    return estado !== 'vencido' && (o.estado !== 'emitido' || isOrderEmittedToday(o));
  });
  const byEstado = {};
  columns.forEach(c => { byEstado[c.id] = []; });
  visibleOrders.forEach(o => {
    const estado = estadoOrden ? estadoOrden(o) : o.estado;
    if (byEstado[estado]) byEstado[estado].push(o);
  });
  Object.values(byEstado).forEach(list => list.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)));
  const inFlight = visibleOrders.filter(o => {
    const estado = estadoOrden ? estadoOrden(o) : o.estado;
    return !['emitido', 'vencido'].includes(estado);
  }).length;

  return (
    <>
      <div className="kanban-toolbar">
        <div className="kanban-meta">
          <Pill kind="brand">{inFlight} en proceso</Pill>
          <Pill kind="ok">{byEstado.emitido.length} emitidas hoy</Pill>
          <span>Las ordenes vencidas y las emitidas antes de hoy se mueven al archivo.</span>
        </div>
        <Btn kind="ghost" size="sm" onClick={onArchive}>
          <VIcon.list size={15}/> Archivadas ({archivedCount})
        </Btn>
      </div>

      <div className="kanban-board">
        {columns.map(col => (
          <section key={col.id} className="kanban-col">
            <div className="kanban-head" style={{ '--k-color': col.color, '--k-soft': col.soft, '--k-line': col.line, '--k-text': col.color }}>
              <div className="kanban-title">
                <span>{col.title}</span>
                <span style={{ minWidth: 28, height: 24, padding: '0 9px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: col.color, border: `1px solid ${col.line}`, fontFamily: 'var(--v-mono)', fontWeight: 800, fontSize: 12 }}>{byEstado[col.id].length}</span>
              </div>
              <div className="kanban-hint">{col.hint}</div>
            </div>
            <div className="kanban-list">
              {byEstado[col.id].length === 0 && <div className="kanban-empty">Sin ordenes en este estado</div>}
              {byEstado[col.id].map(o => <OrderCard key={o.id} o={o} onClick={() => onOpen(o)}/>)}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function ArchivedOrdersReport({ orders, onOpen }) {
  if (!orders.length) {
    return (
      <div className="v-card v-card-pad" style={{ textAlign: 'center', color: 'var(--v-muted)' }}>
        No hay ordenes archivadas todavia.
      </div>
    );
  }

  return (
    <div className="v-card" style={{ overflow: 'hidden' }}>
      <table className="archive-table">
        <thead>
          <tr>
            <th>Codigo</th>
            <th>Paciente</th>
            <th>Estado</th>
            <th>Sede</th>
            <th>Fecha</th>
            <th>Pruebas</th>
          </tr>
        </thead>
        <tbody>
          {orders
            .slice()
            .sort((a, b) => {
              const dateA = a.estado === 'emitido' ? emittedDateKey(a) : (a.cita?.fechaHora || a.fecha).slice(0, 10);
              const dateB = b.estado === 'emitido' ? emittedDateKey(b) : (b.cita?.fechaHora || b.fecha).slice(0, 10);
              return dateB.localeCompare(dateA);
            })
            .map(o => (
              <tr key={o.id} onClick={() => onOpen(o)} style={{ cursor: 'pointer' }}>
                <td style={{ fontFamily: 'var(--v-mono)', color: 'var(--v-navy)', fontWeight: 700 }}>{o.code}</td>
                <td>
                  <div style={{ fontWeight: 700 }}>{o.paciente.ap}, {o.paciente.nm}</div>
                  <div style={{ color: 'var(--v-muted)', fontSize: 11 }}>DNI {o.paciente.dni}</div>
                </td>
                <td><EstadoPill estado={estadoOrden ? estadoOrden(o) : o.estado}/></td>
                <td>{sedeNm(o.sedeProc).replace('C.S. ', '')}</td>
                <td>{o.estado === 'emitido' ? emittedDateKey(o) : (o.cita?.fechaHora || o.fecha).slice(0, 10)}</td>
                <td>{o.tests.length}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Root/>);
