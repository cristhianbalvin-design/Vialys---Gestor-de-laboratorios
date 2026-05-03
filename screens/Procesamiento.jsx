// Vialys — Procesamiento de muestras

import React, { useState } from 'react';
import { VIcon } from '../icons.jsx';
import { Btn, Field, Pill, ProcessEmpty, ProcessOrderCard, ProcessShell, ProcessToolbar, SectionTitle } from '../primitives.jsx';
import { TEST_BY_ID, estadoOrden, fmtDate, genResultado, sedeNm } from '../data.jsx';

function LegacyProcesamientoHome({ orders, sedeId, onOpen }) {
  const cola = orders.filter(o => o.sedeProc === sedeId && (o.estado === 'muestra_tomada' || o.estado === 'en_proceso'));

  return (
    <>
      <div className="v-card v-card-pad" style={{ background: 'linear-gradient(135deg, var(--v-navy-50), #fff)', border: '1px solid var(--v-navy-100)', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--v-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <VIcon.beaker size={22} color="#fff"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{cola.length} muestras en bandeja</div>
            <div style={{ fontSize: 12, color: 'var(--v-muted)' }}>Pendientes de procesar o completar</div>
          </div>
        </div>
      </div>

      <SectionTitle>Bandeja de procesamiento</SectionTitle>
      {cola.map(o => {
        const done = Object.keys(o.resultados).length;
        const total = o.tests.length;
        const pct = Math.round((done / total) * 100);
        return (
          <div key={o.id} className="v-order" onClick={() => onOpen(o)}>
            <div className="row">
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="name">{o.paciente.ap}, {o.paciente.nm}</div>
                <div className="meta">{o.code} · {sedeNm(o.sedeToma).replace('C.S. ', '')}</div>
              </div>
              {o.estado === 'en_proceso' ? <Pill kind="info" dot>En proceso</Pill> : <Pill kind="brand" dot>Por iniciar</Pill>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <div style={{ flex: 1, height: 6, borderRadius: 99, background: 'var(--v-line-2)', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: 'var(--v-teal)' }}/>
              </div>
              <span style={{ fontFamily: 'var(--v-mono)', fontSize: 11, color: 'var(--v-muted)' }}>{done}/{total}</span>
            </div>
          </div>
        );
      })}
      {cola.length === 0 && (
        <div className="v-card v-card-pad" style={{ textAlign: 'center', color: 'var(--v-muted)', padding: 24 }}>
          <VIcon.check size={28} color="var(--v-ok)"/>
          <div style={{ marginTop: 6, fontSize: 13 }}>Bandeja vacía</div>
        </div>
      )}
    </>
  );
}

function ProcesamientoHome({ orders, sedeId, onOpen }) {
  const [q, setQ] = useState('');
  const cola = orders.filter(o => o.sedeProc === sedeId && (o.estado === 'muestra_tomada' || o.estado === 'en_proceso'));
  const porIniciar = cola.filter(o => o.estado === 'muestra_tomada').length;
  const enProceso = cola.filter(o => o.estado === 'en_proceso').length;
  const pruebasPendientes = cola.reduce((a, o) => a + Math.max(o.tests.length - Object.keys(o.resultados).filter(k => o.resultados[k]?.val).length, 0), 0);
  const filt = cola.filter(o => !q || (o.paciente.nm + ' ' + o.paciente.ap + ' ' + o.paciente.dni + ' ' + o.code).toLowerCase().includes(q.toLowerCase()));

  return (
    <ProcessShell
      icon="beaker"
      title="Procesamiento"
      subtitle="Ingresa resultados, guarda avances y completa la orden"
      tone="navy"
      stats={[
        { label: 'Bandeja', value: cola.length, note: 'muestras', kind: 'teal' },
        { label: 'Por iniciar', value: porIniciar, note: 'sin resultados', kind: 'warn' },
        { label: 'En proceso', value: enProceso, note: 'parciales', kind: 'info' },
        { label: 'Pendientes', value: pruebasPendientes, note: 'pruebas', kind: 'brand' },
      ]}
    >
      <ProcessToolbar title="Bandeja de procesamiento" count={filt.length} search={q} onSearch={setQ}/>
      {filt.length === 0 && <ProcessEmpty icon="check" title="Bandeja vacia" subtitle="No hay muestras pendientes de procesar"/>}
      {filt.map(o => {
        const done = Object.keys(o.resultados).filter(k => o.resultados[k]?.val).length;
        const total = o.tests.length;
        const pct = Math.round((done / total) * 100);
        return (
          <ProcessOrderCard
            key={o.id}
            orden={o}
            onClick={() => onOpen(o)}
            status={o.estado === 'en_proceso' ? <Pill kind="info" dot>En proceso</Pill> : <Pill kind="brand" dot>Por iniciar</Pill>}
            meta={`Muestra: ${o.muestra?.tipo || 'Sin dato'} · Origen ${sedeNm(o.sedeToma).replace('C.S. ', '')}`}
            progress={pct}
            action={<span style={{ fontFamily: 'var(--v-mono)', fontSize: 12, color: 'var(--v-muted)', fontWeight: 700 }}>{done}/{total}</span>}
          />
        );
      })}
    </ProcessShell>
  );
}

function ProcesamientoForm({ orden, onSave, onComplete, onCancel }) {
  const [results, setResults] = useState({ ...orden.resultados });
  const [equipo, setEquipo] = useState('Mindray BC-3000');
  const [openTest, setOpenTest] = useState(orden.tests[0]);

  const setField = (tid, k, v) => {
    setResults(prev => {
      const cur = prev[tid] || {};
      const next = { ...cur, [k]: v };
      // recalc flag for numeric
      const t = TEST_BY_ID[tid];
      if (t.tipo === 'num' && k === 'val' && next.ref) {
        const m = next.ref.match(/(\d+\.?\d*)\D+(\d+\.?\d*)/);
        const num = parseFloat(v);
        if (m && !isNaN(num)) {
          const lo = parseFloat(m[1]), hi = parseFloat(m[2]);
          next.flag = num < lo ? 'bajo' : num > hi ? 'alto' : 'normal';
        }
      }
      return { ...prev, [tid]: next };
    });
  };

  const initTest = (tid) => {
    if (results[tid]) return results[tid];
    const seed = genResultado(tid);
    const blank = { val: '', unidad: seed.unidad || '', ref: seed.ref || '', flag: 'normal', obs: '' };
    return blank;
  };

  return (
    <>
      <div className="v-card v-card-pad" style={{ marginBottom: 14, background: 'var(--v-navy-50)', border: '1px solid var(--v-navy-100)' }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{orden.paciente.ap}, {orden.paciente.nm}</div>
        <div style={{ fontSize: 12, color: 'var(--v-muted)', marginTop: 2 }}>{orden.code} · Muestra: {orden.muestra?.tipo} · {orden.muestra?.cond}</div>
      </div>

      <Field label="Equipo utilizado"><input className="v-input" value={equipo} onChange={(e) => setEquipo(e.target.value)}/></Field>

      <SectionTitle>Resultados ({Object.keys(results).length}/{orden.tests.length})</SectionTitle>
      {orden.tests.map(tid => {
        const t = TEST_BY_ID[tid];
        const r = results[tid] || initTest(tid);
        const isOpen = openTest === tid;
        return (
          <div key={tid} className="v-acc" style={{ borderColor: r.val && results[tid] ? 'var(--v-teal-100)' : 'var(--v-line)' }}>
            <button className="v-acc-head" onClick={() => setOpenTest(isOpen ? null : tid)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                {results[tid] && results[tid].val ? <VIcon.check size={14} color="var(--v-teal)"/> : <span style={{ width: 14, height: 14, border: '1.5px solid var(--v-line)', borderRadius: 99 }}/>}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.nm}</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {results[tid]?.val && <Pill kind={r.flag === 'normal' ? 'ok' : r.flag === 'alto' ? 'bad' : r.flag === 'bajo' ? 'info' : 'bad'}>{r.flag === 'reactivo' ? 'REACT' : r.flag.toUpperCase()}</Pill>}
                <VIcon.chevD size={14} color="var(--v-muted)" style={{ transform: isOpen ? 'rotate(180deg)' : '' }}/>
              </span>
            </button>
            {isOpen && (
              <div className="v-acc-body" style={{ padding: 14 }}>
                {t.tipo === 'num' && (
                  <>
                    <div className="v-input-grid-2">
                      <Field label="Valor"><input className="v-input" inputMode="decimal" value={r.val || ''} onChange={(e) => setField(tid, 'val', e.target.value)} placeholder="0.0"/></Field>
                      <Field label="Unidad"><input className="v-input" value={r.unidad} onChange={(e) => setField(tid, 'unidad', e.target.value)}/></Field>
                    </div>
                    <Field label="Rango referencial"><input className="v-input" value={r.ref} onChange={(e) => setField(tid, 'ref', e.target.value)}/></Field>
                  </>
                )}
                {t.tipo === 'reac' && (
                  <Field label="Resultado">
                    <div className="v-seg">
                      <button className={r.val === 'No reactivo' ? 'active' : ''} onClick={() => { setField(tid, 'val', 'No reactivo'); setField(tid, 'flag', 'normal'); }}>No reactivo</button>
                      <button className={r.val === 'Reactivo' ? 'active' : ''} onClick={() => { setField(tid, 'val', 'Reactivo'); setField(tid, 'flag', 'reactivo'); }}>Reactivo</button>
                    </div>
                  </Field>
                )}
                {t.tipo === 'tx' && (
                  <Field label="Resultado"><input className="v-input" value={r.val || ''} onChange={(e) => setField(tid, 'val', e.target.value)} placeholder="Texto del resultado"/></Field>
                )}
                <Field label="Observación"><textarea className="v-textarea" value={r.obs || ''} onChange={(e) => setField(tid, 'obs', e.target.value)}/></Field>
                <Btn kind="teal" size="sm" onClick={() => { setOpenTest(null); }}><VIcon.check size={14} color="#fff"/> Guardar</Btn>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
        <Btn kind="ghost" full onClick={() => onSave(results, equipo, 'partial')}>Guardar parcial</Btn>
        <Btn kind="teal" full onClick={() => onComplete(results, equipo)} disabled={Object.keys(results).filter(k => results[k]?.val).length < orden.tests.length}>Marcar completo</Btn>
      </div>
    </>
  );
}

export { ProcesamientoHome, ProcesamientoForm };
