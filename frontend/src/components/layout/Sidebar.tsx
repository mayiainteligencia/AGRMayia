import React, { useState } from 'react';
import {
  LayoutDashboard, Package, TrendingUp,
  Leaf, Activity, Droplet, ScanEye,
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
}

const NAV_ITEMS = [
  { id: 'resumen',        label: 'Resumen',           icon: LayoutDashboard },
  { id: 'fenologia',      label: 'Fenología',         icon: Leaf },
  { id: 'riego',          label: 'Riego y Nutrición', icon: Droplet },
  { id: 'biometria',      label: 'Biometría',         icon: Activity },
  { id: 'packing',        label: 'Packing',           icon: Package },
  { id: 'proyeccion',     label: 'Proyección',        icon: TrendingUp },
  { id: 'analisisVisual', label: 'Análisis Visual',   icon: ScanEye },
];

const SECTION_LABELS: Record<string, string> = {
  resumen: 'Panel principal',
  fenologia: 'Desarrollo vegetativo',
  riego: 'Gestión hídrica',
  biometria: 'Medición de planta',
  packing: 'Empaque y calidad',
  proyeccion: 'Estimación de cosecha',
  analisisVisual: 'Diagnóstico IA',
};

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, isOpen }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      <style>{`
        /* Sidebar scrollbar */
        .sb-nav::-webkit-scrollbar { width: 3px; }
        .sb-nav::-webkit-scrollbar-track { background: transparent; }
        .sb-nav::-webkit-scrollbar-thumb { background: rgba(82,183,136,0.25); border-radius: 4px; }

        @keyframes sb-ping {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.6); opacity: 0; }
        }

        .sb-nav-btn {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 9px 14px 9px 16px;
          border-radius: 10px;
          margin-bottom: 2px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.18s ease;
          text-align: left;
          font-family: inherit;
          overflow: hidden;
        }

        .sb-nav-btn::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%) scaleY(0);
          width: 3px;
          height: 60%;
          border-radius: 0 3px 3px 0;
          background: #52B788;
          transition: transform 0.2s cubic-bezier(.22,1,.36,1);
        }

        .sb-nav-btn.is-active::before { transform: translateY(-50%) scaleY(1); }
      `}</style>

      <aside
        className={`sidebar-drawer ${isOpen ? 'is-open' : 'is-closed'}`}
        style={{
          width: 236,
          height: '100vh',
          background: 'linear-gradient(180deg, #0E2318 0%, #152D1F 35%, #1A3C2E 100%)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          overflow: 'hidden',
          boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
        }}
      >

        {/* ── Logo / Brand ── */}
        <div style={{
          padding: '22px 18px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            {/* Icon mark */}
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg, #52B788 0%, #2D6A4F 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(82,183,136,0.35)',
            }}>
              <Leaf size={18} color="#fff" strokeWidth={2.2} />
            </div>

            {/* Name + tagline */}
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 15, fontWeight: 700, color: '#FFFFFF',
                letterSpacing: '-0.3px', lineHeight: 1.2,
              }}>
                AgroMayia
              </div>
              <div style={{
                fontSize: 9.5, color: 'rgba(255,255,255,0.32)',
                fontWeight: 400, marginTop: 2, letterSpacing: 0.2,
              }}>
                Inteligencia para el campo
              </div>
            </div>

            {/* Live badge */}
            <div style={{
              marginLeft: 'auto', flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'rgba(82,183,136,0.15)',
              border: '1px solid rgba(82,183,136,0.3)',
              borderRadius: 20, padding: '3px 7px',
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: '#52B788',
                boxShadow: '0 0 6px rgba(82,183,136,0.8)',
                animation: 'sb-ping 2s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 8.5, color: '#52B788', fontWeight: 700, letterSpacing: 0.5 }}>
                LIVE
              </span>
            </div>
          </div>
        </div>

        {/* ── Section label ── */}
        <div style={{ padding: '18px 18px 6px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              Módulos
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>
        </div>

        {/* ── Nav Items ── */}
        <nav
          className="sb-nav"
          style={{
            flex: 1, padding: '4px 10px', overflowY: 'auto', minHeight: 0,
          }}
        >
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive  = activeSection === id;
            const isHovered = hovered === id;

            return (
              <button
                key={id}
                className={`sb-nav-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => onSectionChange(id)}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(82,183,136,0.18) 0%, rgba(82,183,136,0.06) 100%)'
                    : isHovered
                    ? 'rgba(255,255,255,0.05)'
                    : 'transparent',
                  border: `1px solid ${isActive
                    ? 'rgba(82,183,136,0.22)'
                    : 'transparent'}`,
                  color: isActive
                    ? '#7ECBA9'
                    : isHovered
                    ? 'rgba(255,255,255,0.8)'
                    : 'rgba(255,255,255,0.42)',
                }}
              >
                {/* Icon */}
                <span style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                  background: isActive
                    ? 'rgba(82,183,136,0.2)'
                    : isHovered
                    ? 'rgba(255,255,255,0.06)'
                    : 'transparent',
                  transition: 'background 0.18s',
                }}>
                  <Icon
                    size={15}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    color={isActive ? '#7ECBA9' : isHovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.38)'}
                  />
                </span>

                {/* Label */}
                <span style={{
                  fontSize: 13.5, fontWeight: isActive ? 600 : 400,
                  letterSpacing: '-0.1px', flex: 1,
                  transition: 'color 0.18s',
                }}>
                  {label}
                </span>

                {/* Active dot */}
                {isActive && (
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#52B788',
                    boxShadow: '0 0 8px rgba(82,183,136,0.7)',
                    flexShrink: 0,
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Footer — User mini-card ── */}
        <div style={{
          padding: '12px 14px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          {/* Active section info */}
          {activeSection && (
            <div style={{
              marginBottom: 10,
              padding: '8px 10px',
              borderRadius: 8,
              background: 'rgba(82,183,136,0.08)',
              border: '1px solid rgba(82,183,136,0.12)',
            }}>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', margin: '0 0 2px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
                Vista activa
              </p>
              <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.65)', margin: 0, fontWeight: 500 }}>
                {SECTION_LABELS[activeSection] ?? activeSection}
              </p>
            </div>
          )}

          {/* User row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #52B788 0%, #1A3C2E 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid rgba(82,183,136,0.4)',
              fontSize: 13, fontWeight: 700, color: '#fff',
            }}>
              M
            </div>

            {/* Name & role */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.3 }}>
                Martín Cortés
              </p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', margin: 0 }}>
                Administrador
              </p>
            </div>

            {/* Online indicator */}
            <div style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: '#52B788',
              boxShadow: '0 0 8px rgba(82,183,136,0.8)',
            }} />
          </div>
        </div>
      </aside>
    </>
  );
};
