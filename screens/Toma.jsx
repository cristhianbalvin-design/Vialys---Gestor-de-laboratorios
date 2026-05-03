// Vialys — Toma de muestra

function LegacyTomaHome({ orders, sedeId, onOpen, toast, onTake }) {
  const cola = orders.filter(o => o.sedeToma === sedeId && o.estado === 'registrada');
  const vencidas = cola.filter(o => fechaCitaVencida(o)).length;
  const tomadas = orders.filter(o => o.sedeToma === sedeId && o.estado !== 'registrada' && new Date(o.muestra?.hora || 0).toDateString() === new Date().toDateString()).slice(0, 5);

  return (
    <>
      <div className="v-card v-card-pad" style={{ background: 'linear-gradient(135deg, var(--v-teal-50), #fff)', border: '1px solid var(--v-teal-100)', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--v-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <VIcon.drop size={22} color="#fff"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{cola.length} en cola</div>
            <div style={{ fontSize: 12, color: 'var(--v-muted)' }}>{vencidas} vencida{vencidas !== 1 ? 's' : ''} por fecha de cita</div>
          </div>
        </div>
      </div>

      <SectionTitle>Cola de pacientes</SectionTitle>
      {cola.length === 0 && (
        <div className="v-card v-card-pad" style={{ textAlign: 'center', color: 'var(--v-muted)', padding: 24 }}>
          <VIcon.check size={28} color="var(--v-ok)"/>
          <div style={{ marginTop: 6, fontSize: 13 }}>Cola vacía — todas las muestras tomadas</div>
        </div>
      )}
      {cola.map(o => {
        const vencida = fechaCitaVencida(o);
        return (
        <div key={o.id} className="v-order" style={vencida ? { opacity: 0.72, background: 'var(--v-bad-bg)', borderColor: '#FECACA' } : {}}>
          <div className="row">
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="name">{o.paciente.ap}, {o.paciente.nm}</div>
              <div className="meta">DNI {o.paciente.dni} · {calcEdad(o.paciente.fn)} años</div>
            </div>
            {vencida ? <Pill kind="bad" dot>Vencido</Pill> : <Pill kind="warn" dot>Pendiente</Pill>}
          </div>
          <div style={{ fontSize: 12, color: vencida ? '#B42318' : 'var(--v-muted)', fontWeight: vencida ? 600 : 400 }}>
            Cita: {o.cita?.fechaHora ? fmtDate(o.cita.fechaHora) : 'Sin programar'}{vencida ? ' · toma inhabilitada' : ''}
          </div>
          <div className="tests">
            {o.tests.slice(0, 3).map(t => <Pill key={t} kind="muted">{TEST_BY_ID[t]?.nm}</Pill>)}
            {o.tests.length > 3 && <Pill kind="muted">+{o.tests.length - 3}</Pill>}
          </div>
          <div className="row">
            <span className="code">{o.code}</span>
            {o.sedeProc !== o.sedeToma && <Pill kind="info">→ {sedeNm(o.sedeProc).replace('C.S. ', '')}</Pill>}
          </div>
          <Btn full kind={vencida ? "ghost" : "teal"} size="sm" disabled={vencida} onClick={() => !vencida && onTake(o)}>
            {vencida ? <><VIcon.alert size={14}/> Inhabilitado</> : <><VIcon.drop size={14} color="#fff"/> Registrar toma</>}
          </Btn>
        </div>
      )})}

      {tomadas.length > 0 && (
        <>
          <SectionTitle>Tomadas hoy</SectionTitle>
          {tomadas.map(o => (
            <div key={o.id} className="v-order" onClick={() => onOpen(o)}>
              <div className="row">
                <div className="name">{o.paciente.ap}, {o.paciente.nm}</div>
                <EstadoPill estado={o.estado}/>
              </div>
              <div className="row">
                <span className="code">{o.code}</span>
                <span className="meta">{o.muestra && fmtDate(o.muestra.hora)}</span>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}

function TomaHome({ orders, sedeId, onOpen, toast, onTake }) {
  const [q, setQ] = useState('');
  const cola = orders.filter(o => o.sedeToma === sedeId && o.estado === 'registrada');
  const vencidas = cola.filter(o => fechaCitaVencida(o)).length;
  const disponibles = cola.length - vencidas;
  const tomadas = orders.filter(o => o.sedeToma === sedeId && o.estado !== 'registrada' && new Date(o.muestra?.hora || 0).toDateString() === new Date().toDateString()).slice(0, 5);
  const filt = cola.filter(o => !q || (o.paciente.nm + ' ' + o.paciente.ap + ' ' + o.paciente.dni + ' ' + o.code).toLowerCase().includes(q.toLowerCase()));

  return (
    <ProcessShell
      icon="drop"
      title="Toma de muestra"
      subtitle="Controla la cola, valida la cita y registra la muestra"
      tone="teal"
      stats={[
        { label: 'En cola', value: cola.length, note: 'registradas', kind: 'teal' },
        { label: 'Disponibles', value: disponibles, note: 'para tomar', kind: 'ok' },
        { label: 'Vencidas', value: vencidas, note: 'inhabilitadas', kind: vencidas ? 'bad' : 'muted' },
        { label: 'Tomadas hoy', value: tomadas.length, note: 'muestras', kind: 'info' },
      ]}
    >
      <ProcessToolbar title="Cola de pacientes" count={filt.length} search={q} onSearch={setQ}/>
      {filt.length === 0 && <ProcessEmpty icon="check" title="Cola vacia" subtitle="No hay pacientes pendientes para toma"/>}
      {filt.map(o => {
        const vencida = fechaCitaVencida(o);
        return (
          <ProcessOrderCard
            key={o.id}
            orden={o}
            onClick={() => onOpen(o)}
            status={vencida ? <Pill kind="bad" dot>Vencido</Pill> : <Pill kind="warn" dot>Pendiente</Pill>}
            meta={`Cita: ${o.cita?.fechaHora ? fmtDate(o.cita.fechaHora) : 'Sin programar'}${o.sedeProc !== o.sedeToma ? ` · Procesa ${sedeNm(o.sedeProc).replace('C.S. ', '')}` : ''}`}
            alert={vencida && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--v-bad)', fontWeight: 700 }}>
                <VIcon.alert size={14} color="var(--v-bad)"/> Toma inhabilitada por cita vencida
              </div>
            )}
            action={
              <Btn kind={vencida ? 'ghost' : 'teal'} size="sm" disabled={vencida} onClick={(e) => { e.stopPropagation(); if (!vencida) onTake(o); }}>
                {vencida ? <><VIcon.alert size={14}/> Inhabilitado</> : <><VIcon.drop size={14} color="#fff"/> Registrar</>}
              </Btn>
            }
          />
        );
      })}
      {tomadas.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <ProcessToolbar title="Tomadas hoy" count={tomadas.length}/>
          {tomadas.map(o => (
            <ProcessOrderCard key={o.id} orden={o} onClick={() => onOpen(o)} meta={o.muestra && `Toma: ${fmtDate(o.muestra.hora)} · ${o.muestra.tipo}`}/>
          ))}
        </div>
      )}
    </ProcessShell>
  );
}

function localTakeDateTimeInput(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function TomaForm({ orden, onSave, onCancel }) {
  const [tipo, setTipo] = useState('Sangre venosa');
  const [hora, setHora] = useState(localTakeDateTimeInput());
  const [cond, setCond] = useState('Ayunas');
  const [obs, setObs] = useState('');
  const vencida = orden.estado === 'registrada' && orden.cita?.fechaHora && new Date(hora).getTime() > new Date(orden.cita.fechaHora).getTime();

  return (
    <>
      <div className="v-card v-card-pad" style={{ marginBottom: 14, background: 'var(--v-navy-50)', border: '1px solid var(--v-navy-100)' }}>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{orden.paciente.ap}, {orden.paciente.nm}</div>
        <div style={{ fontSize: 12, color: 'var(--v-muted)', marginTop: 2 }}>DNI {orden.paciente.dni} · {orden.code}</div>
        <div style={{ fontSize: 12, color: vencida ? '#B42318' : 'var(--v-muted)', marginTop: 6, fontWeight: vencida ? 700 : 500 }}>
          Cita: {orden.cita?.fechaHora ? fmtDate(orden.cita.fechaHora) : 'Sin programar'}{vencida ? ' · vencida' : ''}
        </div>
        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {orden.tests.map(t => <Pill key={t} kind="muted">{TEST_BY_ID[t]?.nm}</Pill>)}
        </div>
      </div>

      <Field label="Tipo de muestra">
        <select className="v-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          {['Sangre venosa', 'Sangre capilar', 'Orina', 'Heces', 'Esputo', 'Secreción', 'Otro'].map(o => <option key={o}>{o}</option>)}
        </select>
      </Field>

      <Field label="Hora de toma">
        <input className="v-input" type="datetime-local" value={hora} onChange={(e) => setHora(e.target.value)}/>
      </Field>

      <Field label="Condición">
        <div className="v-seg">
          {['Ayunas', 'Post-prandial', 'Espontánea'].map(c => (
            <button key={c} className={cond === c ? 'active' : ''} onClick={() => setCond(c)}>{c}</button>
          ))}
        </div>
      </Field>

      <Field label="Observaciones (opcional)">
        <textarea className="v-textarea" value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Ej: muestra hemolizada parcialmente"/>
      </Field>

      <div className="v-card v-card-pad" style={{ background: 'var(--v-bg-soft)', textAlign: 'center', marginTop: 8 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--v-mono)', color: 'var(--v-muted)', letterSpacing: 0.08 }}>CÓDIGO DE MUESTRA</div>
        <div style={{ fontFamily: 'var(--v-mono)', fontSize: 22, fontWeight: 700, color: 'var(--v-navy)', letterSpacing: 0.04, marginTop: 4 }}>{orden.code}</div>
        {orden.sedeToma !== orden.sedeProc && (
          <div style={{ marginTop: 8, padding: '8px 12px', background: 'var(--v-warn-bg)', borderRadius: 'var(--r-sm)', fontSize: 12, color: '#92560D' }}>
            <VIcon.alert size={14} color="#92560D" style={{ verticalAlign: -2 }}/> Procesamiento en {sedeNm(orden.sedeProc)} — se enviará tras la toma
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
        <Btn kind="ghost" full onClick={onCancel}>Cancelar</Btn>
        <Btn kind="teal" full disabled={vencida} onClick={() => !vencida && onSave({ tipo, hora, cond, obs })}><VIcon.check size={16} color="#fff"/> Confirmar toma</Btn>
      </div>
    </>
  );
}

Object.assign(window, { TomaHome, TomaForm });
