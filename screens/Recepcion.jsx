// Vialys — Recepción / Registro de orden

function LegacyRecepcionHome({ orders, sedeId, onOpen, onNew }) {
  const [q, setQ] = useState('');
  const today = orders.filter(o => o.sedeOrigen === sedeId);
  const filt = today.filter(o => !q || (o.paciente.nm + ' ' + o.paciente.ap + ' ' + o.paciente.dni).toLowerCase().includes(q.toLowerCase()));

  const counts = {
    total: today.length,
    pend: today.filter(o => o.estado === 'registrada').length,
    proc: today.filter(o => ['muestra_tomada', 'en_proceso', 'resultados_completos', 'validado'].includes(o.estado)).length,
    emit: today.filter(o => o.estado === 'emitido').length,
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <div className="v-kpi"><span className="lab">Hoy</span><span className="num">{counts.total}</span><span className="delta up">↗ órdenes</span></div>
        <div className="v-kpi"><span className="lab">Pendientes</span><span className="num">{counts.pend}</span><span className="delta" style={{ color: 'var(--v-warn)' }}>● toma muestra</span></div>
      </div>

      <div style={{ position: 'relative', marginBottom: 12 }}>
        <input className="v-input" placeholder="Buscar por DNI o nombre" value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 40 }}/>
        <div style={{ position: 'absolute', left: 12, top: 13 }}><VIcon.search size={18} color="var(--v-subtle)"/></div>
      </div>

      <Btn full kind="teal" onClick={onNew}>
        <VIcon.plus size={18} color="#fff"/> Nueva orden
      </Btn>

      <div style={{ marginTop: 18 }}>
        <SectionTitle>Órdenes del día · {sedeNm(sedeId)}</SectionTitle>
        {filt.length === 0 && (
          <div className="v-card v-card-pad" style={{ textAlign: 'center', color: 'var(--v-muted)', padding: 24 }}>
            <VIcon.orders size={28} color="var(--v-subtle)"/>
            <div style={{ marginTop: 6, fontSize: 13 }}>Aún no hay órdenes registradas</div>
          </div>
        )}
        {filt.map(o => <OrderCard key={o.id} o={o} onClick={() => onOpen(o)}/>)}
      </div>
    </>
  );
}

function RecepcionHome({ orders, sedeId, onOpen, onNew }) {
  const [q, setQ] = useState('');
  const today = orders.filter(o => o.sedeOrigen === sedeId);
  const filt = today.filter(o => !q || (o.paciente.nm + ' ' + o.paciente.ap + ' ' + o.paciente.dni).toLowerCase().includes(q.toLowerCase()));
  const counts = {
    total: today.length,
    pend: today.filter(o => (estadoOrden ? estadoOrden(o) : o.estado) === 'registrada').length,
    venc: today.filter(o => (estadoOrden ? estadoOrden(o) : o.estado) === 'vencido').length,
    proc: today.filter(o => ['muestra_tomada', 'en_proceso', 'resultados_completos', 'validado'].includes(estadoOrden ? estadoOrden(o) : o.estado)).length,
    emit: today.filter(o => o.estado === 'emitido').length,
  };

  return (
    <ProcessShell
      icon="id"
      title="Recepcion y registro"
      subtitle="Digitaliza ordenes, registra pacientes y programa la cita de toma"
      tone="teal"
      stats={[
        { label: 'Hoy', value: counts.total, note: 'ordenes', kind: 'teal' },
        { label: 'Pendientes', value: counts.pend, note: 'para toma', kind: 'warn' },
        { label: 'Vencidas', value: counts.venc, note: 'inhabilitadas', kind: counts.venc ? 'bad' : 'muted' },
        { label: 'Emitidas', value: counts.emit, note: 'cerradas', kind: 'ok' },
      ]}
    >
      <ProcessToolbar
        title={`Ordenes del dia · ${sedeNm(sedeId)}`}
        count={filt.length}
        search={q}
        onSearch={setQ}
        action={<Btn kind="teal" onClick={onNew}><VIcon.plus size={18} color="#fff"/> Nueva orden</Btn>}
      />
      {filt.length === 0 && <ProcessEmpty icon="orders" title="Aun no hay ordenes registradas" subtitle="Registra una nueva orden para iniciar el flujo"/>}
      {filt.map(o => <OrderCard key={o.id} o={o} onClick={() => onOpen(o)}/>)}
    </ProcessShell>
  );
}

function OrderCard({ o, onClick, action }) {
  const estado = estadoOrden ? estadoOrden(o) : o.estado;
  return (
    <div className="v-order" onClick={onClick}>
      <div className="row">
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.paciente.ap}, {o.paciente.nm}</div>
          <div className="meta">DNI {o.paciente.dni} · {calcEdad(o.paciente.fn)} años · {o.paciente.sx}</div>
        </div>
        <EstadoPill estado={estado}/>
      </div>
      <div className="tests">
        {o.tests.slice(0, 3).map(t => <Pill key={t} kind="muted">{TEST_BY_ID[t]?.nm}</Pill>)}
        {o.tests.length > 3 && <Pill kind="muted">+{o.tests.length - 3}</Pill>}
      </div>
      <div className="row" style={{ marginTop: 2 }}>
        <span className="code">{o.code}</span>
        <span className="meta">{o.cita?.fechaHora ? `Cita ${fmtDate(o.cita.fechaHora)}` : fmtDate(o.fecha)}</span>
      </div>
      {action}
    </div>
  );
}

function localDateTimeInput(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function NewOrder({ sedeId, onCancel, onSave, toast }) {
  const [step, setStep] = useState(1);
  const [dni, setDni] = useState('');
  const [scanning, setScanning] = useState(false);
  const [paciente, setPaciente] = useState({ ap: '', nm: '', fn: '', sx: 'F', hc: '' });
  const [meta, setMeta] = useState({ medico: '', diag: '', sedeOrigen: sedeId, sedeToma: sedeId, sedeProc: sedeId, citaFechaHora: localDateTimeInput() });
  const [tests, setTests] = useState([]);
  const [openCat, setOpenCat] = useState('hema');

  const consultarReniec = () => {
    if (dni.length < 8) { toast({ msg: 'DNI debe tener 8 dígitos', kind: 'bad' }); return; }
    // simulación: tomar un paciente al azar de seed o crear coherente
    const p = PACIENTES[Math.floor(Math.random() * PACIENTES.length)];
    setPaciente({ ap: p.ap, nm: p.nm, fn: p.fn, sx: p.sx, hc: p.hc });
    toast({ msg: 'Datos cargados desde RENIEC (simulación)', kind: 'ok' });
  };

  const escanearDNI = () => {
    setScanning(true);
    setTimeout(() => {
      const p = PACIENTES[Math.floor(Math.random() * PACIENTES.length)];
      setDni(p.dni);
      setPaciente({ ap: p.ap, nm: p.nm, fn: p.fn, sx: p.sx, hc: p.hc });
      setScanning(false);
      toast({ msg: 'DNI leído por OCR — verifica los datos', kind: 'ok' });
    }, 1800);
  };

  const toggleTest = (id) => {
    setTests(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const submit = () => {
    if (!dni || !paciente.ap || !meta.citaFechaHora || tests.length === 0) {
      toast({ msg: 'Completa los datos requeridos', kind: 'bad' }); return;
    }
    const code = newCode(meta.sedeProc);
    const orden = {
      id: code,
      code,
      paciente: { dni, ...paciente },
      sedeOrigen: meta.sedeOrigen, sedeToma: meta.sedeToma, sedeProc: meta.sedeProc,
      medico: meta.medico || 'Dr. (sin especificar)',
      diagnostico: meta.diag, tests, estado: 'registrada',
      cita: { fechaHora: new Date(meta.citaFechaHora).toISOString() },
      fecha: new Date().toISOString(),
      resultados: {},
      historial: [{ estado: 'registrada', usuario: 'Ericka Medina', sede: meta.sedeOrigen, ts: new Date().toISOString() }],
      muestra: null,
    };
    onSave(orden);
  };

  return (
    <>
      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {[1, 2, 3].map(n => (
          <div key={n} style={{
            flex: 1, height: 4, borderRadius: 99,
            background: n <= step ? 'var(--v-teal)' : 'var(--v-line-2)',
            transition: 'background 220ms',
          }}/>
        ))}
      </div>

      {step === 1 && (
        <>
          <div style={{ fontFamily: 'var(--v-font-display)', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Paciente</div>
          <div className="v-help" style={{ marginBottom: 14 }}>Escanea el DNI o consulta RENIEC</div>

          <div className="v-card v-card-pad" style={{ background: 'var(--v-navy-50)', border: '1px solid var(--v-navy-100)', marginBottom: 14 }}>
            <Field label="DNI">
              <div className="v-input-wrap">
                <input className="v-input with-action" value={dni} onChange={(e) => setDni(e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="00000000" inputMode="numeric"/>
                <button className="v-input-action teal" onClick={consultarReniec}>RENIEC</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--v-muted)', marginTop: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--v-warn)' }}/>
                Consulta RENIEC — modo simulación
              </div>
            </Field>

            <button onClick={escanearDNI} disabled={scanning} style={{
              width: '100%', height: 56, marginTop: 4,
              border: '1.5px dashed var(--v-teal)', borderRadius: 'var(--r-md)',
              background: scanning ? 'var(--v-teal-50)' : '#fff', color: 'var(--v-teal-700)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontWeight: 600, fontSize: 14, cursor: scanning ? 'wait' : 'pointer',
            }}>
              {scanning ? <><div style={{ width: 16, height: 16, border: '2px solid var(--v-teal)', borderTopColor: 'transparent', borderRadius: 99, animation: 'spin 0.7s linear infinite' }}/> Leyendo DNI…</>
                : <><VIcon.camera size={20} color="var(--v-teal)"/> Escanear DNI con cámara</>}
            </button>
          </div>

          <div className="v-input-grid-2">
            <Field label="Apellidos"><input className="v-input" value={paciente.ap} onChange={(e) => setPaciente({ ...paciente, ap: e.target.value })}/></Field>
            <Field label="Nombres"><input className="v-input" value={paciente.nm} onChange={(e) => setPaciente({ ...paciente, nm: e.target.value })}/></Field>
          </div>
          <div className="v-input-grid-2">
            <Field label="Fecha nac."><input className="v-input" type="date" value={paciente.fn} onChange={(e) => setPaciente({ ...paciente, fn: e.target.value })}/></Field>
            <Field label="Sexo">
              <div className="v-seg">
                <button className={paciente.sx === 'F' ? 'active' : ''} onClick={() => setPaciente({ ...paciente, sx: 'F' })}>Femenino</button>
                <button className={paciente.sx === 'M' ? 'active' : ''} onClick={() => setPaciente({ ...paciente, sx: 'M' })}>Masculino</button>
              </div>
            </Field>
          </div>
          <Field label="Historia clínica N°"><input className="v-input" value={paciente.hc} onChange={(e) => setPaciente({ ...paciente, hc: e.target.value })}/></Field>
          <Field label="Fecha y hora de cita">
            <input className="v-input" type="datetime-local" value={meta.citaFechaHora} onChange={(e) => setMeta({ ...meta, citaFechaHora: e.target.value })}/>
          </Field>

          <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            <Btn kind="ghost" full onClick={onCancel}>Cancelar</Btn>
            <Btn full onClick={() => setStep(2)} disabled={!dni || !paciente.ap}>Continuar</Btn>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div style={{ fontFamily: 'var(--v-font-display)', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Datos clínicos</div>
          <div className="v-help" style={{ marginBottom: 14 }}>Médico solicitante y sedes</div>

          <Field label="Médico solicitante"><input className="v-input" value={meta.medico} onChange={(e) => setMeta({ ...meta, medico: e.target.value })} placeholder="Dr. / Dra."/></Field>
          <Field label="Diagnóstico presuntivo"><textarea className="v-textarea" value={meta.diag} onChange={(e) => setMeta({ ...meta, diag: e.target.value })}/></Field>

          <SectionTitle>Multi-sede</SectionTitle>
          <Field label="Toma de muestra">
            <select className="v-select" value={meta.sedeToma} onChange={(e) => setMeta({ ...meta, sedeToma: e.target.value })}>
              {SEDES.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </Field>
          <Field label="Procesamiento">
            <select className="v-select" value={meta.sedeProc} onChange={(e) => setMeta({ ...meta, sedeProc: e.target.value })}>
              {SEDES.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </Field>

          <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            <Btn kind="ghost" full onClick={() => setStep(1)}>Atrás</Btn>
            <Btn full onClick={() => setStep(3)}>Continuar</Btn>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div style={{ fontFamily: 'var(--v-font-display)', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Exámenes</div>
          <div className="v-help" style={{ marginBottom: 12 }}>{tests.length} seleccionado{tests.length !== 1 ? 's' : ''}</div>

          {tests.length > 0 && (
            <div className="v-strip">
              {tests.map(tid => (
                <span key={tid} className="item" onClick={() => toggleTest(tid)}>
                  {TEST_BY_ID[tid]?.nm}
                  <span className="x"><VIcon.x size={10} color="var(--v-teal-700)"/></span>
                </span>
              ))}
            </div>
          )}

          {CATEGORIAS.map(c => (
            <div key={c.id} className="v-acc">
              <button className="v-acc-head" onClick={() => setOpenCat(openCat === c.id ? null : c.id)}>
                <span>{c.nm} <span className="count">{c.tests.length} pruebas</span></span>
                <VIcon.chevD size={16} color="var(--v-muted)" style={{ transform: openCat === c.id ? 'rotate(180deg)' : '' }}/>
              </button>
              {openCat === c.id && (
                <div className="v-acc-body">
                  {c.tests.map(t => (
                    <label key={t.id} className="v-test-opt">
                      <input type="checkbox" checked={tests.includes(t.id)} onChange={() => toggleTest(t.id)}/>
                      <span style={{ flex: 1 }}>{t.nm}</span>
                      {t.unidad && <span style={{ fontFamily: 'var(--v-mono)', fontSize: 11, color: 'var(--v-muted)' }}>{t.unidad}</span>}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            <Btn kind="ghost" full onClick={() => setStep(2)}>Atrás</Btn>
            <Btn kind="teal" full onClick={submit} disabled={tests.length === 0}><VIcon.save size={16} color="#fff"/> Registrar orden</Btn>
          </div>
        </>
      )}
    </>
  );
}

Object.assign(window, { RecepcionHome, NewOrder, OrderCard });
