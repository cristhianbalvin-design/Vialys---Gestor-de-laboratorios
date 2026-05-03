// Vialys — Dashboard / Reportes / Admin

function LegacyDashboard({ orders, range, setRange }) {
  const total = orders.length;
  const byEstado = {};
  ESTADOS.forEach(e => byEstado[e] = 0);
  orders.forEach(o => byEstado[o.estado]++);

  const bySede = {};
  SEDES.forEach(s => bySede[s.id] = { sede: s, ord: 0, pend: 0, proc: 0, comp: 0, emit: 0 });
  orders.forEach(o => {
    const r = bySede[o.sedeProc]; if (!r) return;
    r.ord++;
    if (o.estado === 'registrada') r.pend++;
    else if (['muestra_tomada', 'en_proceso'].includes(o.estado)) r.proc++;
    else if (['resultados_completos', 'validado'].includes(o.estado)) r.comp++;
    else if (o.estado === 'emitido') r.emit++;
  });

  const totPruebas = orders.reduce((a, o) => a + o.tests.length, 0);
  const criticos = orders.reduce((a, o) => a + Object.values(o.resultados).filter(r => r?.flag === 'alto' || r?.flag === 'bajo' || r?.flag === 'reactivo').length, 0);

  // Top tests
  const testCount = {};
  orders.forEach(o => o.tests.forEach(t => { testCount[t] = (testCount[t] || 0) + 1; }));
  const topTests = Object.entries(testCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const topMax = topTests[0]?.[1] || 1;

  // Sede con mayor volumen
  const topSede = Object.values(bySede).sort((a, b) => b.ord - a.ord)[0];

  return (
    <>
      <div className="v-seg" style={{ marginBottom: 14 }}>
        {[['hoy', 'Hoy'], ['sem', 'Semana'], ['mes', 'Mes']].map(([k, l]) => (
          <button key={k} className={range === k ? 'active' : ''} onClick={() => setRange(k)}>{l}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <div className="v-kpi"><span className="lab">Órdenes</span><span className="num">{total}</span><span className="delta up">↗ 12% vs ayer</span></div>
        <div className="v-kpi"><span className="lab">Pruebas</span><span className="num">{totPruebas}</span><span className="delta up">↗ 8%</span></div>
        <div className="v-kpi"><span className="lab">Tiempo prom.</span><span className="num">3.2<span style={{ fontSize: 14, marginLeft: 2 }}>h</span></span><span className="delta up">↘ -0.4h</span></div>
        <div className="v-kpi" style={{ background: 'var(--v-bad-bg)', borderColor: '#FECACA' }}>
          <span className="lab" style={{ color: '#B42318' }}>Críticos</span>
          <span className="num" style={{ color: '#B42318' }}>{criticos}</span>
          <span className="delta" style={{ color: '#B42318' }}>● requieren atención</span>
        </div>
      </div>

      {/* Distribución por estado — donut visual */}
      <div className="v-card v-card-pad" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Distribución por estado</div>
        </div>
        <DonutEstados byEstado={byEstado} total={total}/>
      </div>

      {/* Top exámenes — bars */}
      <div className="v-card v-card-pad" style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Exámenes más solicitados</div>
        {topTests.map(([tid, n]) => (
          <div key={tid} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
              <span>{TEST_BY_ID[tid]?.nm}</span>
              <span style={{ fontFamily: 'var(--v-mono)', color: 'var(--v-muted)', fontWeight: 600 }}>{n}</span>
            </div>
            <div style={{ height: 8, background: 'var(--v-line-2)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: `${(n / topMax) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--v-navy), var(--v-teal))', borderRadius: 99 }}/>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla por sede */}
      <div className="v-card v-card-pad" style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Por sede</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {Object.values(bySede).filter(r => r.ord > 0).sort((a, b) => b.ord - a.ord).map(r => {
            const pct = r.ord ? Math.round((r.emit / r.ord) * 100) : 0;
            return (
              <div key={r.sede.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--v-line-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{r.sede.nombre.replace('C.S. ', '')}</span>
                  <span style={{ fontFamily: 'var(--v-mono)', fontSize: 12, color: 'var(--v-muted)' }}>{r.ord} ord. · {pct}%</span>
                </div>
                <div style={{ display: 'flex', height: 6, borderRadius: 99, overflow: 'hidden', background: 'var(--v-line-2)' }}>
                  <div style={{ width: `${(r.emit / r.ord) * 100}%`, background: 'var(--v-ok)' }}/>
                  <div style={{ width: `${(r.comp / r.ord) * 100}%`, background: 'var(--v-teal)' }}/>
                  <div style={{ width: `${(r.proc / r.ord) * 100}%`, background: 'var(--v-info)' }}/>
                  <div style={{ width: `${(r.pend / r.ord) * 100}%`, background: 'var(--v-warn)' }}/>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap', fontSize: 10, color: 'var(--v-muted)' }}>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--v-ok)', borderRadius: 99, marginRight: 4 }}/>Emitidos</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--v-teal)', borderRadius: 99, marginRight: 4 }}/>Completos</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--v-info)', borderRadius: 99, marginRight: 4 }}/>En proceso</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--v-warn)', borderRadius: 99, marginRight: 4 }}/>Pendientes</span>
        </div>
      </div>

      {/* Heatmap día x hora */}
      <div className="v-card v-card-pad">
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Volumen · día × hora</div>
        <Heatmap/>
      </div>
    </>
  );
}

function DonutEstados({ byEstado, total }) {
  const colors = { registrada: '#D97706', vencido: '#DC2626', muestra_tomada: '#0EA5E9', en_proceso: '#3D63A0', resultados_completos: '#1B3A6B', validado: '#0D9488', emitido: '#16A34A' };
  let acc = 0;
  const r = 50, c = 60, sw = 18;
  const segs = ESTADOS.map(e => {
    const v = byEstado[e] || 0;
    const frac = total ? v / total : 0;
    const len = 2 * Math.PI * r * frac;
    const off = -2 * Math.PI * r * acc;
    acc += frac;
    return { e, v, frac, len, off };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg width="120" height="120" viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--v-line-2)" strokeWidth={sw}/>
        {segs.map(s => (
          <circle key={s.e} cx={c} cy={c} r={r} fill="none" stroke={colors[s.e]} strokeWidth={sw}
            strokeDasharray={`${s.len} ${2 * Math.PI * r}`} strokeDashoffset={s.off}
            transform={`rotate(-90 ${c} ${c})`}/>
        ))}
        <text x={c} y={c - 2} textAnchor="middle" style={{ fontFamily: 'var(--v-font-display)', fontSize: 22, fontWeight: 800, fill: 'var(--v-navy)' }}>{total}</text>
        <text x={c} y={c + 14} textAnchor="middle" style={{ fontSize: 9, fill: 'var(--v-muted)', letterSpacing: 0.06 }}>ÓRDENES</text>
      </svg>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {ESTADOS.map(e => (
          <div key={e} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: colors[e] }}/>
              {ESTADO_NM[e]}
            </span>
            <span style={{ fontFamily: 'var(--v-mono)', fontWeight: 600 }}>{byEstado[e] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Heatmap() {
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  // pseudo-random based seed
  const cells = days.map((_, di) => hours.map((_, hi) => {
    const x = Math.sin((di + 1) * 23.7 + (hi + 1) * 11.3) * 10000;
    const v = Math.abs(x - Math.floor(x));
    // bias toward weekday morning
    const bias = (di < 5 ? 1 : 0.4) * (hi < 5 ? 1 : 0.6);
    return Math.min(1, v * 1.4 * bias);
  }));
  const tone = (v) => `oklch(${0.97 - v * 0.5} ${0.05 + v * 0.10} 195)`;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '20px repeat(11, 1fr)', gap: 3 }}>
        <div/>
        {hours.map(h => <div key={h} style={{ fontSize: 9, color: 'var(--v-muted)', textAlign: 'center' }}>{h}</div>)}
        {days.map((d, di) => (
          <React.Fragment key={d}>
            <div style={{ fontSize: 10, color: 'var(--v-muted)', display: 'flex', alignItems: 'center' }}>{d}</div>
            {hours.map((h, hi) => (
              <div key={hi} style={{ aspectRatio: '1', background: tone(cells[di][hi]), borderRadius: 3 }}/>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function Reportes({ orders }) {
  const [tipo, setTipo] = useState('libro');
  const tipos = [
    { id: 'libro', nm: 'Libro de registros' },
    { id: 'prod', nm: 'Producción por sede' },
    { id: 'tiempo', nm: 'Tiempo de procesamiento' },
    { id: 'crit', nm: 'Valores críticos' },
    { id: 'tec', nm: 'Actividad por técnica' },
  ];

  return (
    <>
      <SectionTitle>Reportes</SectionTitle>
      <div className="v-card v-card-pad" style={{ marginBottom: 14 }}>
        <Field label="Tipo de reporte">
          <select className="v-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {tipos.map(t => <option key={t.id} value={t.id}>{t.nm}</option>)}
          </select>
        </Field>
        <div className="v-input-grid-2">
          <Field label="Desde"><input className="v-input" type="date" defaultValue="2026-04-01"/></Field>
          <Field label="Hasta"><input className="v-input" type="date" defaultValue="2026-05-03"/></Field>
        </div>
        <Field label="Sede">
          <select className="v-select"><option>Todas las sedes</option>{SEDES.map(s => <option key={s.id}>{s.nombre}</option>)}</select>
        </Field>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn kind="ghost" full><VIcon.printer size={16}/> Imprimir</Btn>
          <Btn kind="teal" full><VIcon.download size={16} color="#fff"/> Exportar</Btn>
        </div>
      </div>

      <div className="v-card" style={{ overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ background: 'var(--v-navy)', color: '#fff', padding: '10px 14px', fontSize: 12, fontWeight: 700, letterSpacing: 0.04 }}>
          {tipos.find(t => t.id === tipo).nm.toUpperCase()}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ background: 'var(--v-bg-soft)' }}>
              <th style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 700, color: 'var(--v-muted)' }}>Código</th>
              <th style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 700, color: 'var(--v-muted)' }}>Paciente</th>
              <th style={{ textAlign: 'right', padding: '8px 10px', fontWeight: 700, color: 'var(--v-muted)' }}>Pruebas</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 10).map(o => (
              <tr key={o.id} style={{ borderTop: '1px solid var(--v-line-2)' }}>
                <td style={{ padding: '8px 10px', fontFamily: 'var(--v-mono)', fontSize: 10 }}>{o.code}</td>
                <td style={{ padding: '8px 10px' }}>{o.paciente.ap}</td>
                <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>{o.tests.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AdminScreen() {
  const [tab, setTab] = useState('users');
  return (
    <>
      <div className="v-seg" style={{ marginBottom: 14 }}>
        {[['users', 'Usuarios'], ['sedes', 'Sedes'], ['cat', 'Catálogo'], ['log', 'Log']].map(([k, l]) => (
          <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === 'users' && (
        <>
          <Btn full kind="teal" style={{ marginBottom: 12 }}><VIcon.plus size={16} color="#fff"/> Nuevo usuario</Btn>
          {USUARIOS.map(u => (
            <div key={u.id} className="v-card v-card-pad" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 99, background: 'var(--v-navy-100)', color: 'var(--v-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                  {u.nm.split(' ').map(p => p[0]).slice(0, 2).join('')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{u.nm}</div>
                  <div style={{ fontSize: 11, color: 'var(--v-muted)' }}>DNI {u.dni} · {sedeNm(u.sede).replace('C.S. ', '')}</div>
                </div>
                <Pill kind="ok" dot>Activo</Pill>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                {u.roles.map(rid => <Pill key={rid} kind="brand">{ROLES[rid].nm}</Pill>)}
              </div>
            </div>
          ))}
        </>
      )}

      {tab === 'sedes' && (
        <>
          {SEDES.map(s => (
            <div key={s.id} className="v-card v-card-pad" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {s.nombre} {s.central && <Pill kind="teal">Central</Pill>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--v-muted)', marginTop: 2 }}>{s.dir}</div>
                </div>
                <Pill kind="ok" dot>Activa</Pill>
              </div>
            </div>
          ))}
        </>
      )}

      {tab === 'cat' && (
        <>
          {CATEGORIAS.map(c => (
            <div key={c.id} className="v-card v-card-pad" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{c.nm}</div>
                <Pill kind="muted">{c.tests.length} pruebas</Pill>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {c.tests.slice(0, 5).map(t => <Pill key={t.id} kind="muted">{t.nm}</Pill>)}
                {c.tests.length > 5 && <Pill kind="muted">+{c.tests.length - 5}</Pill>}
              </div>
            </div>
          ))}
        </>
      )}

      {tab === 'log' && (
        <div className="v-card" style={{ overflow: 'hidden' }}>
          {[
            { t: '14:32', u: 'Ericka Medina', a: 'registró orden RP-2026-00115' },
            { t: '14:28', u: 'Thania Noa', a: 'emitió resultados RP-2026-00109' },
            { t: '14:15', u: 'Katy Olarte', a: 'tomó muestra MT-2026-00103' },
            { t: '13:58', u: 'María Luisa', a: 'validó RP-2026-00108' },
            { t: '13:42', u: 'Ericka Medina', a: 'registró orden RP-2026-00114' },
          ].map((l, i) => (
            <div key={i} style={{ padding: '10px 14px', borderBottom: i < 4 ? '1px solid var(--v-line-2)' : 'none', display: 'flex', gap: 10, fontSize: 12 }}>
              <span style={{ fontFamily: 'var(--v-mono)', color: 'var(--v-muted)', minWidth: 36 }}>{l.t}</span>
              <span><b>{l.u}</b> {l.a}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function DashboardSection({ title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--v-muted)', letterSpacing: 0.08, textTransform: 'uppercase', margin: '0 0 8px 2px' }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 10 }}>
        {children}
      </div>
    </div>
  );
}

function MetricCard({ label, value, note, kind = 'brand', icon = 'chart', compact = false }) {
  const colors = {
    brand: ['var(--v-navy)', 'var(--v-navy-50)', 'var(--v-navy-100)'],
    teal: ['var(--v-teal)', 'var(--v-teal-50)', 'var(--v-teal-100)'],
    ok: ['var(--v-ok)', 'var(--v-ok-bg)', '#BBF7D0'],
    warn: ['var(--v-warn)', 'var(--v-warn-bg)', '#FED7AA'],
    bad: ['var(--v-bad)', 'var(--v-bad-bg)', '#FECACA'],
    info: ['var(--v-info)', 'var(--v-info-bg)', '#BAE6FD'],
  };
  const c = colors[kind] || colors.brand;
  const Icon = VIcon[icon] || VIcon.chart;
  return (
    <div className="v-kpi" style={{ minHeight: 118, background: `linear-gradient(135deg, ${c[1]}, #fff 72%)`, borderColor: c[2] }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <span className="lab" style={{ color: compact ? 'var(--v-muted)' : c[0] }}>{label}</span>
        <span style={{ width: 34, height: 34, borderRadius: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: c[1], border: `1px solid ${c[2]}` }}>
          <Icon size={17} color={c[0]}/>
        </span>
      </div>
      <span className="num" style={{ color: c[0], fontSize: compact ? 21 : 30, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
      <span className={kind === 'bad' ? 'delta dn' : 'delta up'} style={{ color: c[0] }}>{note}</span>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="v-card v-card-pad" style={{ minHeight: 260 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>{title}</div>
          {subtitle && <div style={{ color: 'var(--v-muted)', fontSize: 12, marginTop: 2 }}>{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

function FlowChart({ byEstado, total }) {
  const colors = {
    registrada: '#D97706', vencido: '#DC2626', muestra_tomada: '#0EA5E9',
    en_proceso: '#3D63A0', resultados_completos: '#1B3A6B', validado: '#0D9488', emitido: '#16A34A',
  };
  const estados = ['registrada', 'vencido', 'muestra_tomada', 'en_proceso', 'resultados_completos', 'validado', 'emitido'];
  const max = Math.max(...estados.map(e => byEstado[e] || 0), 1);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${estados.length}, minmax(64px, 1fr))`, gap: 8, alignItems: 'end', minHeight: 190 }}>
      {estados.map(e => {
        const n = byEstado[e] || 0;
        const h = 28 + (n / max) * 118;
        return (
          <div key={e} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--v-mono)', fontWeight: 800, color: colors[e], fontSize: 13 }}>{n}</div>
            <div style={{ width: '100%', maxWidth: 72, height: h, borderRadius: '10px 10px 4px 4px', background: `linear-gradient(180deg, ${colors[e]}, color-mix(in srgb, ${colors[e]} 68%, white))`, boxShadow: 'inset 0 -10px 18px rgba(255,255,255,0.18)' }}/>
            <div style={{ fontSize: 10, color: 'var(--v-muted)', textAlign: 'center', lineHeight: 1.15, minHeight: 28 }}>{ESTADO_NM[e]}</div>
            <div style={{ fontSize: 10, color: 'var(--v-subtle)' }}>{total ? Math.round((n / total) * 100) : 0}%</div>
          </div>
        );
      })}
    </div>
  );
}

function CategoryDonut({ cats, total }) {
  const palette = ['#1B3A6B', '#0D9488', '#0EA5E9', '#16A34A', '#D97706', '#DC2626'];
  let acc = 0;
  const r = 54, c = 68, sw = 20;
  const segs = cats.map((cat, i) => {
    const frac = total ? cat.n / total : 0;
    const len = 2 * Math.PI * r * frac;
    const off = -2 * Math.PI * r * acc;
    acc += frac;
    return { ...cat, len, off, color: palette[i % palette.length] };
  });
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 18, alignItems: 'center' }}>
      <svg width="150" height="150" viewBox="0 0 136 136">
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--v-line-2)" strokeWidth={sw}/>
        {segs.map(s => (
          <circle key={s.id} cx={c} cy={c} r={r} fill="none" stroke={s.color} strokeWidth={sw}
            strokeDasharray={`${s.len} ${2 * Math.PI * r}`} strokeDashoffset={s.off}
            transform={`rotate(-90 ${c} ${c})`}/>
        ))}
        <text x={c} y={c - 2} textAnchor="middle" style={{ fontFamily: 'var(--v-font-display)', fontSize: 24, fontWeight: 800, fill: 'var(--v-navy)' }}>{total}</text>
        <text x={c} y={c + 15} textAnchor="middle" style={{ fontSize: 9, fill: 'var(--v-muted)' }}>PRUEBAS</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {segs.map(s => (
          <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '10px 1fr auto', gap: 8, alignItems: 'center', fontSize: 12 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }}/>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.nm}</span>
            <b style={{ fontFamily: 'var(--v-mono)' }}>{s.n}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function SedeProductionChart({ sedes }) {
  const max = Math.max(...sedes.map(s => s.pruebas), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {sedes.map(s => {
        const pct = s.ord ? Math.round((s.emit / s.ord) * 100) : 0;
        return (
          <div key={s.sede.id}>
            <div style={{ display: 'grid', gridTemplateColumns: '145px 1fr auto', gap: 10, alignItems: 'center', fontSize: 12 }}>
              <b style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.sede.nombre.replace('C.S. ', '')}</b>
              <div style={{ height: 18, background: 'var(--v-line-2)', borderRadius: 99, overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${(s.pruebas / max) * 100}%`, background: 'linear-gradient(90deg, var(--v-navy), var(--v-teal))', borderRadius: 99 }}/>
              </div>
              <span style={{ fontFamily: 'var(--v-mono)', color: 'var(--v-muted)' }}>{s.pruebas}</span>
            </div>
            <div style={{ marginLeft: 145, marginTop: 5, color: 'var(--v-muted)', fontSize: 11 }}>{s.ord} ordenes · {pct}% emitidas · {s.venc} vencidas</div>
          </div>
        );
      })}
    </div>
  );
}

function TopTestsChart({ topTests }) {
  const max = Math.max(...topTests.map(([, n]) => n), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {topTests.map(([tid, n], i) => (
        <div key={tid}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 12, marginBottom: 4 }}>
            <span style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i + 1}. {TEST_BY_ID[tid]?.nm}</span>
            <span style={{ fontFamily: 'var(--v-mono)', color: 'var(--v-muted)', fontWeight: 700 }}>{n}</span>
          </div>
          <div style={{ height: 10, background: 'var(--v-line-2)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ width: `${(n / max) * 100}%`, height: '100%', background: i < 2 ? 'linear-gradient(90deg, var(--v-navy), var(--v-teal))' : 'var(--v-navy-500)', borderRadius: 99 }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function Dashboard({ orders, range, setRange }) {
  const total = orders.length;
  const byEstado = {};
  ESTADOS.forEach(e => byEstado[e] = 0);
  orders.forEach(o => { byEstado[estadoOrden ? estadoOrden(o) : o.estado]++; });

  const bySede = {};
  SEDES.forEach(s => bySede[s.id] = { sede: s, ord: 0, pruebas: 0, pend: 0, proc: 0, comp: 0, emit: 0, venc: 0 });
  orders.forEach(o => {
    const r = bySede[o.sedeProc]; if (!r) return;
    const estado = estadoOrden ? estadoOrden(o) : o.estado;
    r.ord++;
    r.pruebas += o.tests.length;
    if (estado === 'vencido') r.venc++;
    else if (estado === 'registrada') r.pend++;
    else if (['muestra_tomada', 'en_proceso'].includes(estado)) r.proc++;
    else if (['resultados_completos', 'validado'].includes(estado)) r.comp++;
    else if (estado === 'emitido') r.emit++;
  });

  const totPruebas = orders.reduce((a, o) => a + o.tests.length, 0);
  const criticos = orders.reduce((a, o) => a + Object.values(o.resultados).filter(r => r?.flag === 'alto' || r?.flag === 'bajo' || r?.flag === 'reactivo').length, 0);
  const emitidas = byEstado.emitido || 0;
  const vencidas = byEstado.vencido || 0;
  const backlog = (byEstado.registrada || 0) + (byEstado.muestra_tomada || 0) + (byEstado.en_proceso || 0);
  const tasaEmision = total ? Math.round((emitidas / total) * 100) : 0;
  const cumplimientoCita = total ? Math.round(((total - vencidas) / total) * 100) : 0;
  const promPruebas = total ? (totPruebas / total).toFixed(1) : '0.0';
  const muestrasTomadas = total - (byEstado.registrada || 0) - vencidas;

  const testCount = {};
  orders.forEach(o => o.tests.forEach(t => { testCount[t] = (testCount[t] || 0) + 1; }));
  const topTests = Object.entries(testCount).sort((a, b) => b[1] - a[1]).slice(0, 7);

  const catCount = {};
  CATEGORIAS.forEach(c => catCount[c.id] = { nm: c.nm, n: 0 });
  orders.forEach(o => o.tests.forEach(tid => {
    const cat = TEST_BY_ID[tid]?.categoria;
    if (catCount[cat]) catCount[cat].n++;
  }));
  const cats = Object.entries(catCount).map(([id, c]) => ({ id, ...c })).filter(c => c.n > 0).sort((a, b) => b.n - a.n);
  const sedes = Object.values(bySede).filter(r => r.ord > 0).sort((a, b) => b.pruebas - a.pruebas);
  const topSede = sedes[0];

  return (
    <>
      <div className="v-seg" style={{ marginBottom: 14 }}>
        {[['hoy', 'Hoy'], ['sem', 'Semana'], ['mes', 'Mes']].map(([k, l]) => (
          <button key={k} className={range === k ? 'active' : ''} onClick={() => setRange(k)}>{l}</button>
        ))}
      </div>

      <DashboardSection title="Gestion">
        <MetricCard label="Cumplimiento cita" value={`${cumplimientoCita}%`} note={`${vencidas} vencidas`} kind={vencidas ? 'bad' : 'ok'} icon="clock"/>
        <MetricCard label="Backlog operativo" value={backlog} note="Pendientes + proceso" kind={backlog > 6 ? 'warn' : 'ok'} icon="orders"/>
        <MetricCard label="Tasa de emision" value={`${tasaEmision}%`} note={`${emitidas} emitidas`} kind="ok" icon="printer"/>
        <MetricCard label="Criticos" value={criticos} note="Requieren atencion" kind={criticos ? 'bad' : 'ok'} icon="alert"/>
      </DashboardSection>

      <DashboardSection title="Produccion">
        <MetricCard label="Ordenes" value={total} note="Registradas en periodo" kind="brand" icon="orders"/>
        <MetricCard label="Pruebas" value={totPruebas} note={`${promPruebas} por orden`} kind="brand" icon="beaker"/>
        <MetricCard label="Muestras tomadas" value={muestrasTomadas} note={`${Math.round((muestrasTomadas / Math.max(total, 1)) * 100)}% del total`} kind="info" icon="drop"/>
        <MetricCard label="Sede lider" value={topSede?.sede.nombre.replace('C.S. ', '') || '-'} note={`${topSede?.pruebas || 0} pruebas`} kind="teal" icon="building" compact/>
      </DashboardSection>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 14, marginBottom: 14 }}>
        <ChartCard title="Flujo por estado" subtitle="Vista de cuello de botella">
          <FlowChart byEstado={byEstado} total={total}/>
        </ChartCard>
        <ChartCard title="Pruebas por categoria" subtitle="Composicion de la demanda">
          <CategoryDonut cats={cats} total={totPruebas}/>
        </ChartCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 14, marginBottom: 14 }}>
        <ChartCard title="Produccion por sede" subtitle="Ordenes, pruebas y avance">
          <SedeProductionChart sedes={sedes}/>
        </ChartCard>
        <ChartCard title="Examenes mas solicitados" subtitle="Top demanda">
          <TopTestsChart topTests={topTests}/>
        </ChartCard>
      </div>

      <ChartCard title="Volumen por dia y hora" subtitle="Mapa de calor de carga operativa">
        <Heatmap/>
      </ChartCard>
    </>
  );
}

Object.assign(window, { Dashboard, Reportes, AdminScreen });
