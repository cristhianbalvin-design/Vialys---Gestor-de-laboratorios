// Vialys — Emisión y vista detalle/PDF

function LegacyEmisionHome({ orders, sedeId, onOpen }) {
  const cola = orders.filter(o => o.sedeProc === sedeId && (o.estado === 'resultados_completos' || o.estado === 'validado'));
  const emitidos = orders.filter(o => o.sedeProc === sedeId && o.estado === 'emitido').slice(0, 5);

  return (
    <>
      <SectionTitle>Por validar y emitir</SectionTitle>
      {cola.length === 0 && (
        <div className="v-card v-card-pad" style={{ textAlign: 'center', color: 'var(--v-muted)', padding: 24 }}>
          <div style={{ marginTop: 6, fontSize: 13 }}>No hay resultados pendientes de emisión</div>
        </div>
      )}
      {cola.map(o => {
        const criticos = Object.values(o.resultados).filter(r => r.flag === 'alto' || r.flag === 'bajo' || r.flag === 'reactivo').length;
        return (
          <div key={o.id} className="v-order" onClick={() => onOpen(o)}>
            <div className="row">
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="name">{o.paciente.ap}, {o.paciente.nm}</div>
                <div className="meta">{o.code} · {o.tests.length} pruebas</div>
              </div>
              <EstadoPill estado={o.estado}/>
            </div>
            {criticos > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--v-bad)', fontWeight: 600 }}>
                <VIcon.alert size={14} color="var(--v-bad)"/> {criticos} valor{criticos !== 1 ? 'es' : ''} alterado{criticos !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        );
      })}

      {emitidos.length > 0 && <>
        <SectionTitle>Emitidos recientes</SectionTitle>
        {emitidos.map(o => (
          <div key={o.id} className="v-order" onClick={() => onOpen(o)}>
            <div className="row">
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="name">{o.paciente.ap}, {o.paciente.nm}</div>
                <div className="meta">{o.code} · {fmtDate(o.fecha)}</div>
              </div>
              <EstadoPill estado={o.estado}/>
            </div>
          </div>
        ))}
      </>}
    </>
  );
}

function EmisionHome({ orders, sedeId, onOpen }) {
  const [q, setQ] = useState('');
  const cola = orders.filter(o => o.sedeProc === sedeId && (o.estado === 'resultados_completos' || o.estado === 'validado'));
  const porValidar = cola.filter(o => o.estado === 'resultados_completos').length;
  const porEmitir = cola.filter(o => o.estado === 'validado').length;
  const conCriticos = cola.filter(o => Object.values(o.resultados).some(r => r.flag === 'alto' || r.flag === 'bajo' || r.flag === 'reactivo')).length;
  const emitidos = orders.filter(o => o.sedeProc === sedeId && o.estado === 'emitido').slice(0, 5);
  const filt = cola.filter(o => !q || (o.paciente.nm + ' ' + o.paciente.ap + ' ' + o.paciente.dni + ' ' + o.code).toLowerCase().includes(q.toLowerCase()));

  return (
    <ProcessShell
      icon="printer"
      title="Emision de resultados"
      subtitle="Valida informes, controla valores criticos y emite documentos"
      tone="navy"
      stats={[
        { label: 'Bandeja', value: cola.length, note: 'informes', kind: 'teal' },
        { label: 'Por validar', value: porValidar, note: 'completos', kind: 'warn' },
        { label: 'Por emitir', value: porEmitir, note: 'validados', kind: 'info' },
        { label: 'Criticos', value: conCriticos, note: 'con alerta', kind: conCriticos ? 'bad' : 'muted' },
      ]}
    >
      <ProcessToolbar title="Por validar y emitir" count={filt.length} search={q} onSearch={setQ}/>
      {filt.length === 0 && <ProcessEmpty icon="printer" title="No hay resultados pendientes" subtitle="Los informes completos apareceran aqui"/>}
      {filt.map(o => {
        const criticos = Object.values(o.resultados).filter(r => r.flag === 'alto' || r.flag === 'bajo' || r.flag === 'reactivo').length;
        return (
          <ProcessOrderCard
            key={o.id}
            orden={o}
            onClick={() => onOpen(o)}
            meta={`${o.tests.length} pruebas · Procesa ${sedeNm(o.sedeProc).replace('C.S. ', '')}`}
            alert={criticos > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--v-bad)', fontWeight: 700 }}>
                <VIcon.alert size={14} color="var(--v-bad)"/> {criticos} valor{criticos !== 1 ? 'es' : ''} alterado{criticos !== 1 ? 's' : ''}
              </div>
            )}
            action={<VIcon.chevR size={16} color="var(--v-subtle)"/>}
          />
        );
      })}
      {emitidos.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <ProcessToolbar title="Emitidos recientes" count={emitidos.length}/>
          {emitidos.map(o => (
            <ProcessOrderCard key={o.id} orden={o} onClick={() => onOpen(o)} meta={`Emitido: ${fmtDate(o.fecha)} · ${o.tests.length} pruebas`}/>
          ))}
        </div>
      )}
    </ProcessShell>
  );
}

function ResultadosSheet({ orden, mode = 'view', onValidate, onEmit, onClose, toast }) {
  const grouped = {};
  orden.tests.forEach(tid => {
    const t = TEST_BY_ID[tid];
    if (!t) return;
    grouped[t.catNm] = grouped[t.catNm] || [];
    grouped[t.catNm].push({ tid, t, r: orden.resultados[tid] });
  });

  const criticos = Object.values(orden.resultados).filter(r => r?.flag === 'alto' || r?.flag === 'bajo' || r?.flag === 'reactivo').length;

  return (
    <div style={{ background: '#fff', padding: 18 }}>
      {/* Encabezado oficial */}
      <div style={{ borderBottom: '2px solid var(--v-navy)', paddingBottom: 10, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ width: 38, height: 38, background: 'var(--v-navy)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <VialysMark size={28}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9, color: 'var(--v-muted)', fontWeight: 700, letterSpacing: 0.08 }}>MINSA · DIRIS LIMA ESTE · RED HUAROCHIRÍ</div>
            <div style={{ fontFamily: 'var(--v-font-display)', fontWeight: 800, fontSize: 14, color: 'var(--v-navy)', marginTop: 1 }}>{sedeNm(orden.sedeProc)}</div>
            <div style={{ fontSize: 10, color: 'var(--v-muted)' }}>{SEDES.find(s => s.id === orden.sedeProc)?.dir}</div>
          </div>
        </div>
        <div style={{ marginTop: 8, fontFamily: 'var(--v-font-display)', fontSize: 13, fontWeight: 700, letterSpacing: 0.06, textAlign: 'center', color: 'var(--v-ink)' }}>
          LABORATORIO CLÍNICO — INFORME DE RESULTADOS
        </div>
      </div>

      {/* Datos paciente */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', fontSize: 11, marginBottom: 14 }}>
        <div><b>Paciente:</b> {orden.paciente.ap}, {orden.paciente.nm}</div>
        <div><b>DNI:</b> {orden.paciente.dni}</div>
        <div><b>Edad:</b> {calcEdad(orden.paciente.fn)} años · {orden.paciente.sx === 'F' ? 'Femenino' : 'Masculino'}</div>
        <div><b>HC N°:</b> {orden.paciente.hc}</div>
        <div><b>Médico:</b> {orden.medico}</div>
        <div><b>Orden:</b> <span style={{ fontFamily: 'var(--v-mono)' }}>{orden.code}</span></div>
        <div style={{ gridColumn: '1 / -1' }}><b>Diagnóstico:</b> {orden.diagnostico || '—'}</div>
      </div>

      {/* Resultados por categoría */}
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 14 }}>
          <div style={{ background: 'var(--v-navy)', color: '#fff', padding: '5px 10px', fontSize: 11, fontWeight: 700, letterSpacing: 0.05, textTransform: 'uppercase' }}>{cat}</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
            <thead>
              <tr style={{ background: 'var(--v-bg-soft)', borderBottom: '1px solid var(--v-line)' }}>
                <th style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 700, color: 'var(--v-muted)' }}>Examen</th>
                <th style={{ textAlign: 'right', padding: '6px 8px', fontWeight: 700, color: 'var(--v-muted)' }}>Resultado</th>
                <th style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 700, color: 'var(--v-muted)' }}>Ref.</th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ tid, t, r }) => (
                <tr key={tid} style={{ borderBottom: '1px solid var(--v-line-2)' }}>
                  <td style={{ padding: '6px 8px' }}>{t.nm}</td>
                  <td style={{
                    padding: '6px 8px', textAlign: 'right', fontFamily: 'var(--v-mono)', fontWeight: 700,
                    color: r?.flag === 'alto' || r?.flag === 'reactivo' ? 'var(--v-bad)' : r?.flag === 'bajo' ? 'var(--v-info)' : 'var(--v-ink)',
                  }}>
                    {r ? `${r.val}${r.unidad ? ' ' + r.unidad : ''}` : '—'}
                    {r && (r.flag === 'alto' || r.flag === 'bajo' || r.flag === 'reactivo') && <span style={{ marginLeft: 4, fontSize: 9, fontWeight: 800 }}>{r.flag === 'alto' ? '↑' : r.flag === 'bajo' ? '↓' : '!'}</span>}
                  </td>
                  <td style={{ padding: '6px 8px', color: 'var(--v-muted)' }}>{r?.ref || t.ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Firma */}
      <div style={{ marginTop: 30, paddingTop: 12, borderTop: '1px solid var(--v-line)', display: 'flex', justifyContent: 'space-between', gap: 14 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ borderBottom: '1px solid var(--v-ink)', height: 28, fontFamily: 'cursive', fontStyle: 'italic', color: 'var(--v-navy)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 2, fontSize: 14 }}>L. Quispe</div>
          <div style={{ fontSize: 10, marginTop: 4 }}><b>Tec. Thania Noa</b></div>
          <div style={{ fontSize: 9, color: 'var(--v-muted)' }}>Tec. Laboratorio Clínico</div>
        </div>
      </div>

      <div style={{ marginTop: 14, fontSize: 9, textAlign: 'center', color: 'var(--v-muted)', fontStyle: 'italic' }}>
        Documento generado digitalmente — para historia clínica · {fmtDate(new Date().toISOString())}
      </div>

      {mode !== 'view' && (
        <div className="v-no-print" style={{ marginTop: 18, display: 'flex', gap: 8, flexDirection: 'column' }}>
          {criticos > 0 && (
            <div style={{ padding: 10, background: 'var(--v-bad-bg)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#B42318' }}>
              <VIcon.alert size={16} color="#B42318"/> <span><b>{criticos}</b> valor{criticos !== 1 ? 'es' : ''} críticos detectados</span>
            </div>
          )}
          {orden.estado === 'resultados_completos' && <Btn full kind="" onClick={() => onValidate && onValidate()}><VIcon.shield size={16} color="#fff"/> Validar resultados</Btn>}
          {orden.estado === 'validado' && (
            <>
              <div style={{ display: 'flex', gap: 8 }}>
                <Btn kind="ghost" full onClick={() => { window.print(); }}><VIcon.printer size={16}/> Imprimir</Btn>
                <Btn kind="ghost" full onClick={() => toast && toast({ msg: 'PDF generado (simulación)', kind: 'ok' })}><VIcon.download size={16}/> PDF</Btn>
              </div>
              <Btn full kind="teal" onClick={() => onEmit && onEmit()}><VIcon.check size={16} color="#fff"/> Confirmar emisión</Btn>
            </>
          )}
          {orden.estado === 'emitido' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn kind="ghost" full onClick={() => window.print()}><VIcon.printer size={16}/> Imprimir</Btn>
              <Btn kind="ghost" full onClick={() => toast && toast({ msg: 'PDF descargado (simulación)', kind: 'ok' })}><VIcon.download size={16}/> PDF</Btn>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { EmisionHome, ResultadosSheet });
