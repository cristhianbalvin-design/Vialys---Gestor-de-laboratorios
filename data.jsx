// Vialys — mock data for prototype
// 7 sedes, 6 roles, ~20 órdenes, ejemplos de exámenes con valores normales/críticos

const SEDES = [
  { id: 'rp', nombre: 'C.S. Ricardo Palma', central: true, dir: 'Av. Mariscal Castilla 230, Ricardo Palma' },
  { id: 'mt', nombre: 'C.S. Matucana', dir: 'Jr. Lima 145, Matucana' },
  { id: 'sm', nombre: 'C.S. San Mateo', dir: 'Av. San Martín, San Mateo' },
  { id: 'ch', nombre: 'C.S. Chicla', dir: 'Plaza de Armas, Chicla' },
  { id: 'cs', nombre: 'C.S. Casapalca', dir: 'Av. Central, Casapalca' },
  { id: 'su', nombre: 'C.S. Surco', dir: 'Plaza Principal, Surco' },
  { id: 'an', nombre: 'C.S. Antioquía', dir: 'Plaza de Armas, Antioquía' },
];

const ROLES = {
  recepcion:    { id: 'recepcion',    nm: 'Recepción',         desc: 'Registro de órdenes' },
  toma:         { id: 'toma',         nm: 'Toma de muestra',   desc: 'Cola de pacientes' },
  procesamiento:{ id: 'procesamiento',nm: 'Procesamiento',     desc: 'Análisis de muestras' },
  emision:      { id: 'emision',      nm: 'Emisión',           desc: 'Validar y entregar' },
  jefe:         { id: 'jefe',         nm: 'Jefe Provincial',   desc: 'Dashboard y reportes' },
  admin:        { id: 'admin',        nm: 'Administrador',     desc: 'Sistema y catálogo' },
};

const USUARIOS = [
  { id: 'u1', nm: 'Ericka Medina',             dni: '44218975', sede: 'rp', roles: ['recepcion', 'toma'] },
  { id: 'u2', nm: 'Thania Noa',                dni: '40128844', sede: 'rp', roles: ['procesamiento', 'emision'] },
  { id: 'u3', nm: 'María Luisa',               dni: '46772301', sede: 'mt', roles: ['procesamiento', 'emision'] },
  { id: 'u4', nm: 'Katy Olarte',               dni: '07543219', sede: 'rp', roles: ['recepcion', 'toma', 'procesamiento', 'emision'] },
  { id: 'u5', nm: 'Tec. Lab. Luis Saldaña',    dni: '00000001', sede: 'rp', roles: ['jefe'] },
];

const CATEGORIAS = [
  { id: 'hema', nm: 'Hematología', tests: [
    { id: 'hemo-comp', nm: 'Hemograma completo', tipo: 'panel', unidad: '', ref: 'ver panel' },
    { id: 'hcto',      nm: 'Hematocrito',         tipo: 'num',   unidad: '%',         ref: '37–47 (M) / 42–52 (V)' },
    { id: 'hb',        nm: 'Hemoglobina',         tipo: 'num',   unidad: 'g/dL',      ref: '12–16 (M) / 14–18 (V)' },
    { id: 'grupo',     nm: 'Grupo sanguíneo y Rh',tipo: 'tx',    unidad: '',          ref: '—' },
    { id: 'tcoag',     nm: 'Tiempo de coagulación', tipo: 'num', unidad: 'min',       ref: '5–10' },
    { id: 'tsang',     nm: 'Tiempo de sangría',   tipo: 'num',   unidad: 'min',       ref: '1–3' },
    { id: 'plaq',      nm: 'Recuento de plaquetas', tipo: 'num', unidad: '×10³/µL',   ref: '150–450' },
  ]},
  { id: 'bioq', nm: 'Bioquímica', tests: [
    { id: 'gluc', nm: 'Glucosa',         tipo: 'num', unidad: 'mg/dL', ref: '70–100' },
    { id: 'urea', nm: 'Urea',            tipo: 'num', unidad: 'mg/dL', ref: '15–45' },
    { id: 'crea', nm: 'Creatinina',      tipo: 'num', unidad: 'mg/dL', ref: '0.6–1.2' },
    { id: 'auri', nm: 'Ácido úrico',     tipo: 'num', unidad: 'mg/dL', ref: '3.5–7.2' },
    { id: 'colt', nm: 'Colesterol total', tipo: 'num', unidad: 'mg/dL', ref: '<200' },
    { id: 'trig', nm: 'Triglicéridos',   tipo: 'num', unidad: 'mg/dL', ref: '<150' },
    { id: 'hdl',  nm: 'HDL',             tipo: 'num', unidad: 'mg/dL', ref: '>40' },
    { id: 'ldl',  nm: 'LDL',             tipo: 'num', unidad: 'mg/dL', ref: '<130' },
    { id: 'tgo',  nm: 'TGO',             tipo: 'num', unidad: 'U/L',   ref: '<40' },
    { id: 'tgp',  nm: 'TGP',             tipo: 'num', unidad: 'U/L',   ref: '<40' },
  ]},
  { id: 'micro', nm: 'Microbiología', tests: [
    { id: 'curo', nm: 'Cultivo de orina',     tipo: 'tx',  ref: 'Negativo' },
    { id: 'chec', nm: 'Cultivo de heces',     tipo: 'tx',  ref: 'Negativo' },
    { id: 'cesp', nm: 'Cultivo de esputo',    tipo: 'tx',  ref: 'Negativo' },
    { id: 'bk',   nm: 'BK esputo (baciloscopia)', tipo: 'tx', ref: 'Negativo' },
    { id: 'gram', nm: 'Gram de secreción',    tipo: 'tx',  ref: 'Sin observ. patológicas' },
  ]},
  { id: 'inmu', nm: 'Inmunología / Serología', tests: [
    { id: 'rpr',   nm: 'RPR / VDRL',         tipo: 'reac', ref: 'No reactivo' },
    { id: 'vih',   nm: 'VIH (prueba rápida)', tipo: 'reac', ref: 'No reactivo' },
    { id: 'hbsag', nm: 'HBsAg',              tipo: 'reac', ref: 'No reactivo' },
    { id: 'emba',  nm: 'Prueba de embarazo', tipo: 'reac', ref: 'Negativo' },
    { id: 'pcr',   nm: 'PCR cualitativa',    tipo: 'reac', ref: 'Negativo' },
    { id: 'wid',   nm: 'Widal',              tipo: 'tx',   ref: 'No reactivo' },
  ]},
  { id: 'uro', nm: 'Uroanálisis / Coprológico', tests: [
    { id: 'uo',  nm: 'Examen completo de orina', tipo: 'tx', ref: 'Normal' },
    { id: 'ph',  nm: 'Examen parasitológico',    tipo: 'tx', ref: 'Negativo' },
    { id: 'cop', nm: 'Coprocultivo',             tipo: 'tx', ref: 'Negativo' },
    { id: 'gra', nm: 'Test de Graham',           tipo: 'tx', ref: 'Negativo' },
  ]},
];

const TEST_BY_ID = {};
CATEGORIAS.forEach(c => c.tests.forEach(t => { TEST_BY_ID[t.id] = { ...t, categoria: c.id, catNm: c.nm }; }));

// Pacientes para órdenes
const PACIENTES = [
  { dni: '46772338', ap: 'Quispe Mendoza', nm: 'Rosa Elena',     fn: '1962-03-12', sx: 'F', hc: 'HC-12453' },
  { dni: '08812904', ap: 'Huamán Rojas',   nm: 'Carlos Antonio', fn: '1958-07-04', sx: 'M', hc: 'HC-09087' },
  { dni: '70341182', ap: 'Mamani Yauri',   nm: 'Lucía Patricia', fn: '1995-11-23', sx: 'F', hc: 'HC-21998' },
  { dni: '47120993', ap: 'Cárdenas Soto',  nm: 'José Manuel',    fn: '1981-02-09', sx: 'M', hc: 'HC-15004' },
  { dni: '74980123', ap: 'Vargas Llosa',   nm: 'Andrea',         fn: '2001-09-17', sx: 'F', hc: 'HC-22871' },
  { dni: '09812341', ap: 'Pérez Tito',     nm: 'Miguel Ángel',   fn: '1949-12-30', sx: 'M', hc: 'HC-04211' },
  { dni: '45129087', ap: 'Soto Alarcón',   nm: 'Karina',         fn: '1988-06-15', sx: 'F', hc: 'HC-17630' },
  { dni: '76334028', ap: 'Cusi Tinoco',    nm: 'Edgar',          fn: '1993-04-22', sx: 'M', hc: 'HC-19872' },
  { dni: '42678301', ap: 'Quintana Pari',  nm: 'Inés',           fn: '1976-08-08', sx: 'F', hc: 'HC-13322' },
  { dni: '71223344', ap: 'Tello Ramos',    nm: 'Diana',          fn: '1999-01-19', sx: 'F', hc: 'HC-23018' },
];

// Cálculo de edad
const calcEdad = (fn) => {
  const d = new Date(fn);
  const a = new Date('2026-05-03');
  let e = a.getFullYear() - d.getFullYear();
  const m = a.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && a.getDate() < d.getDate())) e--;
  return e;
};

// Estados
const ESTADOS = ['registrada', 'vencido', 'muestra_tomada', 'en_proceso', 'resultados_completos', 'validado', 'emitido'];
const ESTADO_NM = {
  registrada: 'Registrada',
  vencido: 'Vencido',
  muestra_tomada: 'Muestra tomada',
  en_proceso: 'En proceso',
  resultados_completos: 'Resultados completos',
  validado: 'Validado',
  emitido: 'Emitido',
};
const ESTADO_PILL = {
  registrada: 'warn',
  vencido: 'bad',
  muestra_tomada: 'info',
  en_proceso: 'info',
  resultados_completos: 'brand',
  validado: 'teal',
  emitido: 'ok',
};

function fechaCitaVencida(orden, now = new Date()) {
  if (!orden || orden.estado !== 'registrada' || !orden.cita?.fechaHora) return false;
  return now.getTime() > new Date(orden.cita.fechaHora).getTime();
}

function estadoOrden(orden, now = new Date()) {
  return fechaCitaVencida(orden, now) ? 'vencido' : orden.estado;
}

// Generador de órdenes ejemplo
let _seq = 100;
const newCode = (sede) => `${sede.toUpperCase()}-2026-${String(++_seq).padStart(5, '0')}`;

// Genera resultado plausible para un test
function genResultado(testId, force) {
  const t = TEST_BY_ID[testId];
  if (!t) return null;
  if (t.tipo === 'num') {
    // Rango 'simple' del ref para sembrar valor
    const map = {
      hcto: [42, 52], hb: [14, 18], plaq: [150, 450],
      gluc: [70, 100], urea: [15, 45], crea: [0.6, 1.2], auri: [3.5, 7.2],
      colt: [140, 200], trig: [80, 150], hdl: [40, 70], ldl: [70, 130],
      tgo: [10, 40], tgp: [10, 40], tcoag: [5, 10], tsang: [1, 3],
    };
    const r = map[testId] || [0, 1];
    let val;
    if (force === 'alto') val = +(r[1] * (1.15 + Math.random() * 0.4)).toFixed(1);
    else if (force === 'bajo') val = +(r[0] * (0.45 + Math.random() * 0.4)).toFixed(1);
    else val = +(r[0] + Math.random() * (r[1] - r[0])).toFixed(1);
    let flag = 'normal';
    if (val < r[0]) flag = 'bajo';
    if (val > r[1]) flag = 'alto';
    return { val, unidad: t.unidad, ref: `${r[0]}–${r[1]}`, flag };
  }
  if (t.tipo === 'reac') {
    return { val: force === 'alto' ? 'Reactivo' : 'No reactivo', ref: 'No reactivo', flag: force === 'alto' ? 'reactivo' : 'normal' };
  }
  if (t.tipo === 'tx') {
    return { val: force === 'alto' ? 'Positivo' : 'Negativo', ref: t.ref || 'Negativo', flag: force === 'alto' ? 'reactivo' : 'normal' };
  }
  return { val: '—', flag: 'normal' };
}

// Crea una orden
function makeOrden({ pacIdx, sedeOrigen, sedeToma, sedeProc, tests, estado, dayOffset = 0, hourBase = 9, completado = false, criticos = false }) {
  const p = PACIENTES[pacIdx];
  const fecha = new Date(2026, 4, 3 - dayOffset, hourBase + Math.floor(Math.random() * 5), Math.floor(Math.random() * 60));
  const code = newCode(sedeProc);
  const resultados = {};
  if (estado === 'en_proceso' || estado === 'resultados_completos' || estado === 'validado' || estado === 'emitido') {
    tests.forEach((tid, i) => {
      const force = criticos && i === 0 ? 'alto' : (criticos && i === 2 ? 'bajo' : null);
      // partial in_proceso — only fill some
      if (estado === 'en_proceso' && i > tests.length / 2) return;
      resultados[tid] = genResultado(tid, force);
    });
  }
  const historial = [
    { estado: 'registrada', usuario: 'Ericka Medina', sede: sedeOrigen, ts: fecha.toISOString() },
  ];
  if (estado !== 'registrada') historial.push({ estado: 'muestra_tomada', usuario: 'Ericka Medina', sede: sedeToma, ts: new Date(fecha.getTime() + 30 * 60000).toISOString() });
  if (['en_proceso', 'resultados_completos', 'validado', 'emitido'].includes(estado))
    historial.push({ estado: 'en_proceso', usuario: 'Thania Noa', sede: sedeProc, ts: new Date(fecha.getTime() + 90 * 60000).toISOString() });
  if (['resultados_completos', 'validado', 'emitido'].includes(estado))
    historial.push({ estado: 'resultados_completos', usuario: 'Thania Noa', sede: sedeProc, ts: new Date(fecha.getTime() + 180 * 60000).toISOString() });
  if (['validado', 'emitido'].includes(estado))
    historial.push({ estado: 'validado', usuario: 'Thania Noa', sede: sedeProc, ts: new Date(fecha.getTime() + 240 * 60000).toISOString() });
  if (estado === 'emitido')
    historial.push({ estado: 'emitido', usuario: 'Thania Noa', sede: sedeProc, ts: new Date(fecha.getTime() + 300 * 60000).toISOString() });
  return {
    id: code,
    code,
    paciente: p,
    sedeOrigen, sedeToma, sedeProc,
    medico: 'Dr. Roberto Aliaga',
    diagnostico: 'Síndrome anémico — descarte',
    cita: { fechaHora: fecha.toISOString() },
    tests,
    estado,
    fecha: fecha.toISOString(),
    resultados,
    historial,
    muestra: estado !== 'registrada' ? {
      tipo: 'Sangre venosa', hora: new Date(fecha.getTime() + 30 * 60000).toISOString(),
      condicion: 'Ayunas', observaciones: '',
    } : null,
    observaciones: '',
    criticos,
  };
}

// Construye 20 órdenes con buena distribución
const ORDENES_SEED = [
  makeOrden({ pacIdx: 0, sedeOrigen: 'rp', sedeToma: 'rp', sedeProc: 'rp', tests: ['hb', 'hcto', 'gluc', 'plaq'], estado: 'registrada', dayOffset: 0, hourBase: 8 }),
  makeOrden({ pacIdx: 1, sedeOrigen: 'rp', sedeToma: 'rp', sedeProc: 'rp', tests: ['gluc', 'urea', 'crea', 'colt', 'trig'], estado: 'registrada', dayOffset: 0, hourBase: 9 }),
  makeOrden({ pacIdx: 2, sedeOrigen: 'mt', sedeToma: 'mt', sedeProc: 'mt', tests: ['emba', 'hb'], estado: 'registrada', dayOffset: 0, hourBase: 10 }),

  makeOrden({ pacIdx: 3, sedeOrigen: 'rp', sedeToma: 'rp', sedeProc: 'rp', tests: ['hb', 'hcto', 'plaq', 'gluc'], estado: 'muestra_tomada', dayOffset: 0, hourBase: 8 }),
  makeOrden({ pacIdx: 4, sedeOrigen: 'sm', sedeToma: 'sm', sedeProc: 'rp', tests: ['rpr', 'vih'], estado: 'muestra_tomada', dayOffset: 0, hourBase: 9 }),
  makeOrden({ pacIdx: 5, sedeOrigen: 'mt', sedeToma: 'mt', sedeProc: 'mt', tests: ['gluc', 'urea', 'crea'], estado: 'muestra_tomada', dayOffset: 0, hourBase: 10 }),

  makeOrden({ pacIdx: 6, sedeOrigen: 'rp', sedeToma: 'rp', sedeProc: 'rp', tests: ['hb', 'hcto', 'plaq', 'gluc', 'urea'], estado: 'en_proceso', dayOffset: 1, hourBase: 8 }),
  makeOrden({ pacIdx: 7, sedeOrigen: 'rp', sedeToma: 'rp', sedeProc: 'rp', tests: ['colt', 'trig', 'hdl', 'ldl', 'tgo', 'tgp'], estado: 'en_proceso', dayOffset: 1, hourBase: 9, criticos: true }),
  makeOrden({ pacIdx: 8, sedeOrigen: 'ch', sedeToma: 'ch', sedeProc: 'rp', tests: ['bk', 'gram'], estado: 'en_proceso', dayOffset: 1, hourBase: 10 }),

  makeOrden({ pacIdx: 9, sedeOrigen: 'rp', sedeToma: 'rp', sedeProc: 'rp', tests: ['hb', 'hcto', 'gluc', 'urea', 'crea'], estado: 'resultados_completos', dayOffset: 1, hourBase: 11, criticos: true }),
  makeOrden({ pacIdx: 0, sedeOrigen: 'mt', sedeToma: 'mt', sedeProc: 'mt', tests: ['emba', 'hb', 'gluc'], estado: 'resultados_completos', dayOffset: 1, hourBase: 12 }),

  makeOrden({ pacIdx: 1, sedeOrigen: 'rp', sedeToma: 'rp', sedeProc: 'rp', tests: ['gluc', 'colt', 'ldl', 'hdl'], estado: 'validado', dayOffset: 2, hourBase: 8, criticos: true }),

  makeOrden({ pacIdx: 2, sedeOrigen: 'rp', sedeToma: 'rp', sedeProc: 'rp', tests: ['hb', 'hcto', 'plaq'], estado: 'emitido', dayOffset: 2, hourBase: 9 }),
  makeOrden({ pacIdx: 3, sedeOrigen: 'rp', sedeToma: 'rp', sedeProc: 'rp', tests: ['gluc', 'urea', 'crea'], estado: 'emitido', dayOffset: 2, hourBase: 10 }),
  makeOrden({ pacIdx: 4, sedeOrigen: 'mt', sedeToma: 'mt', sedeProc: 'mt', tests: ['hb', 'hcto', 'gluc'], estado: 'emitido', dayOffset: 3, hourBase: 8 }),
  makeOrden({ pacIdx: 5, sedeOrigen: 'sm', sedeToma: 'sm', sedeProc: 'rp', tests: ['rpr', 'vih', 'hbsag'], estado: 'emitido', dayOffset: 3, hourBase: 9 }),
  makeOrden({ pacIdx: 6, sedeOrigen: 'cs', sedeToma: 'cs', sedeProc: 'rp', tests: ['bk'], estado: 'emitido', dayOffset: 3, hourBase: 10 }),
  makeOrden({ pacIdx: 7, sedeOrigen: 'rp', sedeToma: 'rp', sedeProc: 'rp', tests: ['colt', 'trig', 'gluc'], estado: 'emitido', dayOffset: 4, hourBase: 8 }),
  makeOrden({ pacIdx: 8, sedeOrigen: 'an', sedeToma: 'an', sedeProc: 'an', tests: ['hb', 'gluc'], estado: 'emitido', dayOffset: 4, hourBase: 9 }),
  makeOrden({ pacIdx: 9, sedeOrigen: 'rp', sedeToma: 'rp', sedeProc: 'rp', tests: ['hb', 'hcto', 'gluc', 'urea', 'crea', 'colt'], estado: 'emitido', dayOffset: 5, hourBase: 8 }),
];

// Helpers
const sedeNm = (id) => SEDES.find(s => s.id === id)?.nombre || id;
const fmtDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
};
const fmtDateOnly = (iso) => new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });

Object.assign(window, {
  SEDES, ROLES, USUARIOS, CATEGORIAS, TEST_BY_ID, PACIENTES, ESTADOS, ESTADO_NM, ESTADO_PILL,
  ORDENES_SEED, calcEdad, sedeNm, fmtDate, fmtDateOnly, genResultado, newCode, fechaCitaVencida, estadoOrden,
});
