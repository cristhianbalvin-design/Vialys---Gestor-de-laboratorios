// Vialys — App shell: routing, role-aware tabs, sheets, toasts

import React, { useCallback as uC, useState as uS } from 'react';
import { VIcon, VialysMark } from './icons.jsx';
import {
  ESTADO_NM, ESTADOS, ORDENES_SEED, ROLES, SEDES, TEST_BY_ID, USUARIOS,
  calcEdad, estadoOrden, fmtDate, sedeNm
} from './data.jsx';
import { AppBar, Btn, EstadoPill, Pill, SectionTitle, Sheet, TabBar, Toast } from './primitives.jsx';
import { LoginScreen } from './screens/Login.jsx';
import { RecepcionHome, NewOrder, OrderCard } from './screens/Recepcion.jsx';
import { TomaHome, TomaForm } from './screens/Toma.jsx';
import { ProcesamientoHome, ProcesamientoForm } from './screens/Procesamiento.jsx';
import { EmisionHome, ResultadosSheet } from './screens/Emision.jsx';
import { AdminScreen, Dashboard, Reportes } from './screens/Admin.jsx';

const TABS_BY_ROLE = {
  recepcion:    [{ id: 'home', label: 'Inicio', icon: 'home' }, { id: 'orders', label: 'Órdenes', icon: 'orders' }, { id: 'profile', label: 'Perfil', icon: 'user' }],
  toma:         [{ id: 'home', label: 'Cola', icon: 'drop' }, { id: 'orders', label: 'Órdenes', icon: 'orders' }, { id: 'profile', label: 'Perfil', icon: 'user' }],
  procesamiento:[{ id: 'home', label: 'Bandeja', icon: 'beaker' }, { id: 'orders', label: 'Órdenes', icon: 'orders' }, { id: 'profile', label: 'Perfil', icon: 'user' }],
  emision:      [{ id: 'home', label: 'Emisión', icon: 'printer' }, { id: 'orders', label: 'Órdenes', icon: 'orders' }, { id: 'profile', label: 'Perfil', icon: 'user' }],
  jefe:         [{ id: 'home', label: 'Dashboard', icon: 'chart' }, { id: 'reports', label: 'Reportes', icon: 'list' }, { id: 'orders', label: 'Órdenes', icon: 'orders' }, { id: 'profile', label: 'Perfil', icon: 'user' }],
  admin:        [{ id: 'home', label: 'Sistema', icon: 'settings' }, { id: 'profile', label: 'Perfil', icon: 'user' }],
};

const ROLE_TITLES = {
  recepcion: 'Recepción',
  toma: 'Toma de muestra',
  procesamiento: 'Procesamiento',
  emision: 'Emisión',
  jefe: 'Dashboard',
  admin: 'Administración',
};

function App({ darkMode = false, onToggleTheme }) {
  const [session, setSession] = uS(null); // { user, sede, role }
  const [orders, setOrders] = uS(ORDENES_SEED);
  const [tab, setTab] = uS('home');
  const [sheet, setSheet] = uS(null); // { type, payload }
  const [toasts, setToasts] = uS([]);
  const [range, setRange] = uS('hoy');
  const [profileOpen, setProfileOpen] = uS(false);

  const toast = uC((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== id)), 2400);
  }, []);

  const updateOrder = (id, patch) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...patch } : o));
  };

  if (!session) return <LoginScreen onLogin={setSession} darkMode={darkMode} onToggleTheme={onToggleTheme}/>;

  const tabs = TABS_BY_ROLE[session.role];

  const switchRole = () => {
    if (session.user.roles.length > 1) setProfileOpen(true);
  };

  const renderHome = () => {
    if (session.role === 'recepcion') return <RecepcionHome orders={orders} sedeId={session.sede.id} onOpen={(o) => setSheet({ type: 'detail', orden: o })} onNew={() => setSheet({ type: 'newOrder' })}/>;
    if (session.role === 'toma') return <TomaHome orders={orders} sedeId={session.sede.id} onOpen={(o) => setSheet({ type: 'detail', orden: o })} toast={toast} onTake={(o) => setSheet({ type: 'takeForm', orden: o })}/>;
    if (session.role === 'procesamiento') return <ProcesamientoHome orders={orders} sedeId={session.sede.id} onOpen={(o) => setSheet({ type: 'procForm', orden: o })}/>;
    if (session.role === 'emision') return <EmisionHome orders={orders} sedeId={session.sede.id} onOpen={(o) => setSheet({ type: 'emitView', orden: o })}/>;
    if (session.role === 'jefe') return <Dashboard orders={orders} range={range} setRange={setRange}/>;
    if (session.role === 'admin') return <AdminScreen/>;
    return null;
  };

  const renderOrders = () => (
    <>
      <SectionTitle>Todas las órdenes</SectionTitle>
      {orders.slice(0, 14).map(o => <OrderCard key={o.id} o={o} onClick={() => setSheet({ type: 'detail', orden: o })}/>)}
    </>
  );

  return (
    <div className="v-app">
      <AppBar
        sub={ROLE_TITLES[session.role]}
        title={session.sede.nombre.replace('C.S. ', '')}
        left={<VialysMark size={28}/>}
        right={<>
          {onToggleTheme && (
            <button className="v-iconbtn" onClick={onToggleTheme} aria-label={darkMode ? 'Modo claro' : 'Modo oscuro'}>
              {darkMode ? <VIcon.sun size={18} color="#fff"/> : <VIcon.moon size={18} color="#fff"/>}
            </button>
          )}
          <button className="v-iconbtn" onClick={() => toast({ msg: 'Sin notificaciones nuevas' })}><VIcon.bell size={18} color="#fff"/></button>
          <button className="v-iconbtn" onClick={() => setProfileOpen(true)}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>{session.user.nm.split(' ').map(p => p[0]).slice(0,2).join('')}</span>
          </button>
        </>}
      />

      <div className="v-body">
        {tab === 'home' && renderHome()}
        {tab === 'orders' && renderOrders()}
        {tab === 'reports' && <Reportes orders={orders}/>}
        {tab === 'profile' && (
          <ProfilePane session={session} onSwitch={switchRole} onLogout={() => { setSession(null); setTab('home'); }}/>
        )}
      </div>

      <TabBar items={tabs} active={tab} onChange={setTab}/>

      <Toast toasts={toasts}/>

      {/* Sheets */}
      {sheet?.type === 'newOrder' && (
        <Sheet open title="Nueva orden" onClose={() => setSheet(null)}>
          <NewOrder sedeId={session.sede.id} onCancel={() => setSheet(null)} toast={toast}
            onSave={(o) => { setOrders(prev => [o, ...prev]); setSheet(null); toast({ msg: 'Orden registrada · ' + o.code, kind: 'ok' }); }}/>
        </Sheet>
      )}
      {sheet?.type === 'detail' && (
        <Sheet open title={sheet.orden.code} onClose={() => setSheet(null)}>
          <OrderDetail orden={sheet.orden}/>
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
              toast({ msg: 'Muestra registrada · ' + sheet.orden.code, kind: 'ok' });
            }}/>
        </Sheet>
      )}
      {sheet?.type === 'procForm' && (
        <Sheet open title="Procesar muestra" onClose={() => setSheet(null)}>
          <ProcesamientoForm orden={sheet.orden} onCancel={() => setSheet(null)}
            onSave={(results, equipo) => {
              updateOrder(sheet.orden.id, { resultados: results, estado: 'en_proceso',
                historial: sheet.orden.historial.find(h => h.estado === 'en_proceso') ? sheet.orden.historial : [...sheet.orden.historial, { estado: 'en_proceso', usuario: session.user.nm, sede: session.sede.id, ts: new Date().toISOString() }] });
              setSheet(null);
              toast({ msg: 'Resultados parciales guardados', kind: 'ok' });
            }}
            onComplete={(results, equipo) => {
              updateOrder(sheet.orden.id, { resultados: results, estado: 'resultados_completos',
                historial: [...sheet.orden.historial, { estado: 'resultados_completos', usuario: session.user.nm, sede: session.sede.id, ts: new Date().toISOString() }] });
              setSheet(null);
              toast({ msg: 'Procesamiento completo', kind: 'ok' });
            }}/>
        </Sheet>
      )}
      {sheet?.type === 'emitView' && (
        <Sheet open title={'Informe · ' + sheet.orden.code} onClose={() => setSheet(null)}>
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

      {profileOpen && (
        <Sheet open title="Mi perfil" onClose={() => setProfileOpen(false)}>
          <ProfilePane session={session} embedded onSwitch={(rid) => { setSession({ ...session, role: rid }); setTab('home'); setProfileOpen(false); }} onLogout={() => { setSession(null); setProfileOpen(false); setTab('home'); }}/>
        </Sheet>
      )}
    </div>
  );
}

function ProfilePane({ session, onSwitch, onLogout, embedded = false }) {
  return (
    <div>
      <div className="v-card v-card-pad" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 56, height: 56, borderRadius: 99, background: 'var(--v-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
          {session.user.nm.split(' ').map(p => p[0]).slice(0, 2).join('')}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{session.user.nm}</div>
          <div style={{ fontSize: 12, color: 'var(--v-muted)' }}>{session.sede.nombre}</div>
          <div style={{ fontSize: 11, color: 'var(--v-muted)', fontFamily: 'var(--v-mono)' }}>DNI {session.user.dni}</div>
        </div>
      </div>

      <SectionTitle>Cambiar de modo</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {session.user.roles.map(rid => {
          const r = ROLES[rid];
          const active = session.role === rid;
          return (
            <button key={rid} onClick={() => onSwitch && onSwitch(rid)} style={{
              padding: 14, background: active ? 'var(--v-teal-50)' : '#fff',
              border: '1px solid ' + (active ? 'var(--v-teal-100)' : 'var(--v-line)'),
              borderRadius: 'var(--r-md)', textAlign: 'left', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: active ? 'var(--v-teal-700)' : 'var(--v-ink)' }}>{r.nm}</div>
                <div style={{ fontSize: 12, color: 'var(--v-muted)' }}>{r.desc}</div>
              </div>
              {active ? <Pill kind="teal">Actual</Pill> : <VIcon.chevR size={16} color="var(--v-subtle)"/>}
            </button>
          );
        })}
      </div>

      <Btn full kind="ghost" onClick={onLogout}><VIcon.logout size={16}/> Cerrar sesión</Btn>
    </div>
  );
}

function OrderDetail({ orden }) {
  const estado = estadoOrden ? estadoOrden(orden) : orden.estado;
  const timelineEstados = estado === 'vencido' ? ['registrada', 'vencido'] : ESTADOS.filter(e => e !== 'vencido');
  const idx = timelineEstados.indexOf(estado);
  return (
    <>
      <div className="v-card v-card-pad" style={{ marginBottom: 14, background: 'var(--v-navy-50)', border: '1px solid var(--v-navy-100)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{orden.paciente.ap}, {orden.paciente.nm}</div>
            <div style={{ fontSize: 12, color: 'var(--v-muted)' }}>DNI {orden.paciente.dni} · {calcEdad(orden.paciente.fn)} años</div>
          </div>
          <EstadoPill estado={estado}/>
        </div>
        {orden.cita?.fechaHora && (
          <div style={{ marginTop: 8, fontSize: 12, color: estado === 'vencido' ? '#B42318' : 'var(--v-muted)', fontWeight: estado === 'vencido' ? 700 : 500 }}>
            Cita de toma: {fmtDate(orden.cita.fechaHora)}{estado === 'vencido' ? ' · toma inhabilitada' : ''}
          </div>
        )}
        <div style={{ marginTop: 10, fontFamily: 'var(--v-mono)', fontSize: 12, color: 'var(--v-muted)' }}>{orden.code}</div>
      </div>

      <SectionTitle>Trazabilidad</SectionTitle>
      <div className="v-card v-card-pad" style={{ marginBottom: 14 }}>
        <div className="v-tl">
          {timelineEstados.map((e, i) => {
            const h = orden.historial.find(x => x.estado === e);
            const cls = i < idx ? 'done' : i === idx ? 'active' : 'future';
            return (
              <div key={e} className={`step ${cls}`}>
                <div className="dot">{i < idx ? <VIcon.check size={12} color="#fff"/> : i + 1}</div>
                <div>
                  <div className="nm">{ESTADO_NM[e]}</div>
                  {h && <div className="meta">{h.usuario} · {sedeNm(h.sede).replace('C.S. ', '')} · {fmtDate(h.ts)}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <SectionTitle>Pruebas solicitadas</SectionTitle>
      <div className="v-card v-card-pad">
        {orden.tests.map(tid => {
          const t = TEST_BY_ID[tid];
          const r = orden.resultados[tid];
          return (
            <div key={tid} className={`v-rrow ${r?.flag || ''}`}>
              <div>
                <div className="nm">{t.nm}</div>
                <div className="ref">Ref: {r?.ref || t.ref}</div>
              </div>
              <div>
                <div className="val">{r ? `${r.val}${r.unidad ? ' ' + r.unidad : ''}` : '—'}</div>
                {r && <div className="flag">{r.flag === 'reactivo' ? 'REACT' : r.flag.toUpperCase()}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export { App, OrderDetail };
