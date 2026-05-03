// Vialys — Login + role switch screens

const { useState: uS_l } = React;

function LoginScreen({ onLogin, darkMode, onToggleTheme }) {
  const [step, setStep] = useState('users'); // users | sede | role
  const [user, setUser] = useState(null);
  const [sede, setSede] = useState(null);
  const [role, setRole] = useState(null);

  const pickUser = (u) => {
    setUser(u);
    setSede(SEDES.find(s => s.id === u.sede));
    if (u.roles.length === 1) {
      onLogin({ user: u, sede: SEDES.find(s => s.id === u.sede), role: u.roles[0] });
    } else {
      setStep('role');
    }
  };

  return (
    <div className="v-app">
      <div style={{
        background: 'linear-gradient(160deg, #1B3A6B 0%, #142E58 60%, #0F2447 100%)',
        color: '#fff', padding: '36px 24px 36px', position: 'relative', overflow: 'hidden',
      }}>
        {onToggleTheme && (
          <button className="v-iconbtn" onClick={onToggleTheme} aria-label={darkMode ? 'Modo claro' : 'Modo oscuro'} style={{ position: 'absolute', top: 18, right: 18, zIndex: 2 }}>
            {darkMode ? <VIcon.sun size={17} color="#fff"/> : <VIcon.moon size={17} color="#fff"/>}
          </button>
        )}
        {/* subtle pattern */}
        <svg style={{ position: 'absolute', inset: 0, opacity: 0.10 }} width="100%" height="100%">
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#fff" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
        <div style={{ position: 'relative' }}>
          <Logo light size="lg"/>
          <div style={{ marginTop: 22, fontFamily: 'var(--v-font-display)', fontSize: 24, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Del análisis al<br/>resultado, sin<br/>perder el rastro.
          </div>
          <div style={{ marginTop: 14, fontSize: 13, color: 'rgba(255,255,255,0.72)', letterSpacing: 0.01 }}>
            Red de Salud · Provincia de Huarochirí
          </div>
          <div style={{ marginTop: 18, fontSize: 11, fontFamily: 'var(--v-mono)', color: 'rgba(255,255,255,0.5)', letterSpacing: 0.08 }}>
            ▌ MINSA · DIRIS LIMA ESTE
          </div>
        </div>
      </div>

      <div className="v-body" style={{ padding: '20px 16px 24px', paddingBottom: 40 }}>
        {step === 'users' && (
          <>
            <div style={{ fontFamily: 'var(--v-font-display)', fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Iniciar sesión</div>
            <div className="v-help" style={{ marginBottom: 14 }}>Selecciona tu usuario para continuar</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {USUARIOS.map(u => {
                const sd = SEDES.find(s => s.id === u.sede);
                return (
                  <button key={u.id} onClick={() => pickUser(u)} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: 14,
                    background: '#fff', border: '1px solid var(--v-line)', borderRadius: 'var(--r-lg)',
                    width: '100%', textAlign: 'left', transition: 'all 140ms', cursor: 'pointer',
                  }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--v-teal)'; e.currentTarget.style.boxShadow = 'var(--sh-2)'; }}
                     onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--v-line)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 99, background: 'var(--v-navy-100)', color: 'var(--v-navy)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14,
                      flexShrink: 0,
                    }}>{u.nm.split(' ').map(p => p[0]).slice(0, 2).join('')}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{u.nm}</div>
                      <div style={{ fontSize: 12, color: 'var(--v-muted)', marginTop: 1 }}>{sd.nombre} · {u.roles.length} {u.roles.length === 1 ? 'rol' : 'roles'}</div>
                    </div>
                    <VIcon.chevR size={18} color="var(--v-subtle)"/>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 'role' && user && (
          <>
            <button onClick={() => setStep('users')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--v-muted)', fontSize: 13, marginBottom: 12, cursor: 'pointer' }}>
              <VIcon.chevL size={14} color="var(--v-muted)"/> Cambiar usuario
            </button>
            <div style={{ fontFamily: 'var(--v-font-display)', fontSize: 17, fontWeight: 700, marginBottom: 2 }}>Hola, {user.nm.split(' ')[0]}</div>
            <div className="v-help" style={{ marginBottom: 14 }}>Selecciona tu modo activo</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {user.roles.map(rid => {
                const r = ROLES[rid];
                return (
                  <button key={rid} onClick={() => onLogin({ user, sede, role: rid })} style={{
                    padding: 16, background: '#fff', border: '1px solid var(--v-line)', borderRadius: 'var(--r-lg)',
                    textAlign: 'left', cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--v-navy)' }}>{r.nm}</div>
                        <div style={{ fontSize: 12, color: 'var(--v-muted)', marginTop: 2 }}>{r.desc}</div>
                      </div>
                      <VIcon.chevR size={18} color="var(--v-teal)"/>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

window.LoginScreen = LoginScreen;
