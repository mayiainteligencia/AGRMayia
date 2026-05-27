import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Calendar,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Menu,
} from 'lucide-react';
import { brandingConfig } from '../config/branding';

interface HeaderProps {
  title: string;
  onMenuToggle: () => void;
}

interface Notification {
  id: number;
  tipo: 'alerta' | 'exito' | 'info' | 'urgente';
  titulo: string;
  mensaje: string;
  tiempo: string;
  leida: boolean;
}

const notificacionesEstaticas: Notification[] = [
  { id: 1, tipo: 'alerta',  titulo: 'Mal comentario en red social',  mensaje: 'Se detectaron malos comentarios en Facebook',                    tiempo: 'Hace 5 min',   leida: false },
  { id: 2, tipo: 'urgente', titulo: 'Desabasto de modelo 34-12aw',   mensaje: 'En la sucursal 12 hay un desabasto del modelo 34-12aw',          tiempo: 'Hace 15 min',  leida: false },
  { id: 3, tipo: 'exito',   titulo: '50 personas activas',           mensaje: 'Realizar intervención humana en el selector',                    tiempo: 'Hace 1 hora',  leida: true  },
  { id: 4, tipo: 'info',    titulo: 'Lumel: Nueva Sesión',           mensaje: 'Un empleado solicitó apoyo psicológico',                         tiempo: 'Hace 2 horas', leida: true  },
  { id: 5, tipo: 'exito',   titulo: 'Ventas: Meta Alcanzada',        mensaje: 'El equipo de ventas superó la meta mensual en un 15%',           tiempo: 'Hace 3 horas', leida: true  },
];

/* ── section display names ── */
const SECTION_NAMES: Record<string, string> = {
  resumen:        'Resumen',
  fenologia:      'Fenología',
  riego:          'Riego y Nutrición',
  biometria:      'Biometría',
  packing:        'Packing',
  proyeccion:     'Proyección',
  analisisVisual: 'Análisis Visual',
};

/* ── notification icon + colors ── */
const NOTIF_CONFIG = {
  alerta:  { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)',  icon: AlertTriangle },
  urgente: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)',   icon: AlertTriangle },
  exito:   { color: '#10B981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.25)',  icon: CheckCircle   },
  info:    { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.25)',  icon: Info          },
};

export const Header: React.FC<HeaderProps> = ({ title, onMenuToggle }) => {
  const { colores, empresa } = brandingConfig;
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notification[]>(notificacionesEstaticas);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fecha = new Date();
  const fechaFormateada = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });

  const sectionName = SECTION_NAMES[title] ?? title;
  const noLeidas    = notificaciones.filter(n => !n.leida).length;

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const marcarLeida     = (id: number) => setNotificaciones(ns => ns.map(n => n.id === id ? { ...n, leida: true } : n));
  const marcarTodas     = ()           => setNotificaciones(ns => ns.map(n => ({ ...n, leida: true })));

  return (
    <>
      <style>{`
        @keyframes hdr-badge-bounce {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.15); }
        }
        .hdr-icon-btn {
          display: flex; align-items: center; justify-content: center;
          border: none; cursor: pointer; transition: all 0.18s ease;
          background: transparent;
        }
        .hdr-icon-btn:hover { opacity: 0.85; transform: scale(1.06); }

        .hdr-date-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 7px 14px; border-radius: 10px;
          border: 1px solid ${colores.borde};
          background: ${colores.fondoTerciario};
          cursor: pointer; transition: all 0.18s;
          font-family: inherit;
        }
        .hdr-date-btn:hover {
          background: #E4EFE9;
          border-color: rgba(82,183,136,0.35);
        }

        .hdr-notif-item {
          padding: 13px 18px;
          border-bottom: 1px solid ${colores.borde};
          cursor: pointer;
          transition: background 0.15s;
          display: flex; gap: 11px; align-items: flex-start;
        }
        .hdr-notif-item:hover { background: ${colores.fondoTerciario}; }
        .hdr-notif-item:last-child { border-bottom: none; }
      `}</style>

      <header
        className="header-root"
        style={{
          height: 64,
          backgroundColor: colores.fondoSecundario,
          borderBottom: `1px solid ${colores.borde}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
          boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)',
          gap: 12,
        }}
      >
        {/* ── LEFT: Hamburger + Breadcrumb ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
          {/* Hamburger — mobile only */}
          <button
            className="hamburger-btn hdr-icon-btn"
            onClick={onMenuToggle}
            style={{
              display: 'none',
              width: 36, height: 36, borderRadius: 8,
              backgroundColor: colores.fondoTerciario,
              border: `1px solid ${colores.borde}`,
              flexShrink: 0,
            }}
          >
            <Menu size={18} color={colores.textoMedio} />
          </button>

          {/* Date pill */}
          <button className="hdr-date-btn">
            <Calendar size={15} color={colores.textoOscuro} />
            <span style={{ fontSize: 13, fontWeight: 500, color: colores.textoMedio }}>
              {fechaFormateada}
            </span>
            <ChevronDown size={13} color={colores.textoOscuro} />
          </button>

          {/* Separator + Breadcrumb */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, minWidth: 0,
          }}>
            <div style={{ width: 1, height: 20, background: colores.borde }} />
            <span style={{
              fontSize: 13, color: colores.textoOscuro,
              fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              AgroMayia
            </span>
            <ChevronDown size={12} color={colores.textoOscuro} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }} />
            <span style={{
              fontSize: 13, fontWeight: 600, color: colores.textoClaro,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {sectionName}
            </span>
          </div>
        </div>

        {/* ── CENTER: Logo ── */}
        <div
          className="header-center"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <img
            className="header-logo-img"
            src={empresa.logo}
            alt={`${empresa.nombre} logo`}
            style={{ height: 50, width: 'auto', objectFit: 'contain' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        {/* ── RIGHT: Notifications + Avatar ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' }}>

          {/* Notifications */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              className="hdr-icon-btn"
              onClick={() => setNotifOpen(o => !o)}
              style={{
                width: 38, height: 38, borderRadius: 10,
                background: notifOpen ? colores.fondoTerciario : 'transparent',
                border: `1px solid ${notifOpen ? colores.borde : 'transparent'}`,
                position: 'relative',
              }}
            >
              <Bell size={18} color={colores.textoMedio} />
              {noLeidas > 0 && (
                <span style={{
                  position: 'absolute', top: 5, right: 5,
                  minWidth: 16, height: 16, borderRadius: 8,
                  background: colores.peligro,
                  border: `2px solid ${colores.fondoSecundario}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700, color: '#fff', padding: '0 3px',
                  animation: 'hdr-badge-bounce 2s ease-in-out infinite',
                }}>
                  {noLeidas}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {notifOpen && (
              <div
                className="notif-dropdown"
                style={{
                  position: 'absolute',
                  top: 46, right: 0,
                  width: 360,
                  maxHeight: 480,
                  background: colores.fondoSecundario,
                  borderRadius: 16,
                  border: `1px solid ${colores.borde}`,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  zIndex: 1000,
                }}
              >
                {/* Dropdown header */}
                <div style={{
                  padding: '14px 18px 12px',
                  borderBottom: `1px solid ${colores.borde}`,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: colores.fondoTerciario,
                }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: colores.textoClaro }}>
                      Notificaciones
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: 11.5, color: colores.textoOscuro }}>
                      {noLeidas > 0 ? `${noLeidas} sin leer` : 'Todas leídas'}
                    </p>
                  </div>
                  {noLeidas > 0 && (
                    <button
                      onClick={marcarTodas}
                      style={{
                        background: 'rgba(26,60,46,0.08)', border: 'none',
                        color: colores.primario, fontSize: 11.5, fontWeight: 600,
                        cursor: 'pointer', padding: '5px 10px', borderRadius: 8,
                        fontFamily: 'inherit',
                      }}
                    >
                      Marcar todas
                    </button>
                  )}
                </div>

                {/* List */}
                <div style={{ maxHeight: 370, overflowY: 'auto' }}>
                  {notificaciones.map(notif => {
                    const cfg = NOTIF_CONFIG[notif.tipo];
                    const IconComp = cfg.icon;
                    return (
                      <div
                        key={notif.id}
                        className="hdr-notif-item"
                        onClick={() => marcarLeida(notif.id)}
                        style={{
                          background: notif.leida ? 'transparent' : `${colores.fondoTerciario}60`,
                        }}
                      >
                        {/* Icon badge */}
                        <div style={{
                          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                          background: cfg.bg, border: `1px solid ${cfg.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <IconComp size={15} color={cfg.color} />
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                            <h4 style={{
                              margin: 0, fontSize: 12.5,
                              fontWeight: notif.leida ? 500 : 700,
                              color: colores.textoClaro,
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 210,
                            }}>
                              {notif.titulo}
                            </h4>
                            {!notif.leida && (
                              <div style={{
                                width: 7, height: 7, borderRadius: '50%',
                                background: colores.acento, flexShrink: 0, marginTop: 3,
                              }} />
                            )}
                          </div>
                          <p style={{ margin: '0 0 4px', fontSize: 11.5, color: colores.textoOscuro, lineHeight: 1.4 }}>
                            {notif.mensaje}
                          </p>
                          <span style={{ fontSize: 10.5, color: '#9CA3AF' }}>
                            {notif.tiempo}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div style={{
                  padding: '10px 18px',
                  borderTop: `1px solid ${colores.borde}`,
                  background: colores.fondoTerciario,
                  textAlign: 'center',
                }}>
                  <button style={{
                    background: 'none', border: 'none',
                    color: colores.secundario, fontSize: 12.5, fontWeight: 600,
                    cursor: 'pointer', width: '100%', padding: '6px',
                    fontFamily: 'inherit', borderRadius: 8,
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = colores.fondoPrincipal; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                  >
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 24, background: colores.borde }} />

          {/* Avatar */}
          <button
            className="hdr-icon-btn"
            style={{
              width: 36, height: 36, borderRadius: '50%', padding: 0, overflow: 'hidden',
              border: `2px solid ${colores.borde}`,
              background: `linear-gradient(135deg, ${colores.acento} 0%, ${colores.primario} 100%)`,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = colores.acento; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = colores.borde; }}
          >
            <img
              src="/assets/logosEmpresas/"
              alt="Perfil"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={e => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
                const btn = img.parentElement as HTMLButtonElement;
                if (btn) {
                  btn.style.fontSize = '14px';
                  btn.style.fontWeight = '700';
                  btn.style.color = '#fff';
                  btn.textContent = 'M';
                }
              }}
            />
          </button>
        </div>
      </header>
    </>
  );
};
