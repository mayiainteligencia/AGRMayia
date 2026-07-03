import React, { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Activity, AlertTriangle, ShieldCheck, Zap, Plus, X, Check } from 'lucide-react';
import { brandingConfig } from '../../config/branding';

const { colores } = brandingConfig;

/* Estilos/keyframes inyectados una sola vez */
let stylesInjected = false;
const CommandStyles: React.FC = () => {
  if (stylesInjected) return null;
  stylesInjected = true;
  return (
    <style>{`
      @keyframes cc-ping { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.7); opacity: 0; } }
      @keyframes cc-in   { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes cc-scan { 0% { background-position: 0 0; } 100% { background-position: 0 26px; } }
      @keyframes cc-sug  { 0%,100% { box-shadow: 0 6px 16px rgba(45,106,79,0.18); } 50% { box-shadow: 0 6px 22px rgba(82,183,136,0.42); } }
      .cc-feed-item { animation: cc-in 0.35s cubic-bezier(.22,1,.36,1); }
    `}</style>
  );
};

/* ── Punto "vivo" pulsante ─────────────────────────────── */
export const LiveDot: React.FC<{ color?: string; size?: number }> = ({ color = colores.acento, size = 7 }) => (
  <span style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
    <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, opacity: 0.5, animation: 'cc-ping 2s ease-in-out infinite' }} />
    <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
  </span>
);

/* ── Barra de agente IA (Jarvis) ───────────────────────── */
interface AgentStripProps {
  agente: string;
  rol: string;
  estado?: string;
  icon: LucideIcon;
  acciones: string[]; // frases que rotan simulando "pensando"
}
export const AgentStrip: React.FC<AgentStripProps> = ({ agente, rol, estado = 'Operativo', icon: Icon, acciones }) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % acciones.length), 3200);
    return () => clearInterval(t);
  }, [acciones.length]);

  return (
    <>
      <CommandStyles />
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 14,
        background: 'linear-gradient(100deg, #0E2318 0%, #1A3C2E 55%, #204A37 100%)',
        border: '1px solid rgba(82,183,136,0.22)',
        boxShadow: '0 8px 24px rgba(14,35,24,0.28)',
        backgroundImage: 'linear-gradient(100deg, #0E2318 0%, #1A3C2E 55%, #204A37 100%), repeating-linear-gradient(0deg, rgba(82,183,136,0.04) 0 1px, transparent 1px 13px)',
        animation: 'cc-scan 6s linear infinite',
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11, flexShrink: 0,
          background: 'linear-gradient(135deg, #52B788 0%, #2D6A4F 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(82,183,136,0.4)',
        }}>
          <Icon size={20} color="#fff" strokeWidth={2.1} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>{agente}</span>
            <span style={{ fontSize: 9.5, color: colores.acento, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>{rol}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 3 }}>
            <LiveDot />
            <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', fontWeight: 400 }} className="cc-feed-item" key={i}>
              {acciones[i]}
            </span>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
          background: 'rgba(82,183,136,0.15)', border: '1px solid rgba(82,183,136,0.3)',
          borderRadius: 20, padding: '4px 10px',
        }}>
          <ShieldCheck size={12} color={colores.acento} />
          <span style={{ fontSize: 10, color: colores.acento, fontWeight: 700 }}>{estado}</span>
        </div>
      </div>
    </>
  );
};

/* ── Feed en tiempo real simulado ──────────────────────── */
export type FeedSev = 'ok' | 'info' | 'warn' | 'crit';
export interface FeedEvent { id: number; sev: FeedSev; texto: string; hora: string; }
const SEV_COLOR: Record<FeedSev, string> = { ok: colores.exito, info: colores.info, warn: colores.advertencia, crit: colores.peligro };

/** Hook: emite un evento nuevo cada `intervalMs` a partir de plantillas. */
export function useLiveFeed(plantillas: { sev: FeedSev; texto: string }[], seed: FeedEvent[] = [], intervalMs = 4000, max = 8): FeedEvent[] {
  const [items, setItems] = useState<FeedEvent[]>(seed);
  const nid = useRef(1000);
  useEffect(() => {
    if (plantillas.length === 0) return;
    const t = setInterval(() => {
      const p = plantillas[Math.floor(Math.random() * plantillas.length)];
      const hora = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setItems(prev => [{ id: nid.current++, ...p, hora }, ...prev].slice(0, max));
    }, intervalMs);
    return () => clearInterval(t);
  }, [plantillas, intervalMs, max]);
  return items;
}

export const LiveFeed: React.FC<{ items: FeedEvent[]; titulo?: string }> = ({ items, titulo = 'Actividad en tiempo real' }) => (
  <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${colores.borde}`, boxShadow: colores.sombra, overflow: 'hidden' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 16px', borderBottom: `1px solid ${colores.borde}` }}>
      <Activity size={15} color={colores.secundario} />
      <span style={{ fontSize: 13, fontWeight: 600, color: colores.textoClaro }}>{titulo}</span>
      <span style={{ marginLeft: 'auto' }}><LiveDot /></span>
    </div>
    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
      {items.map(ev => (
        <div key={ev.id} className="cc-feed-item" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid #F3F4F6' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: SEV_COLOR[ev.sev], boxShadow: `0 0 7px ${SEV_COLOR[ev.sev]}66`, flexShrink: 0 }} />
          <span style={{ fontSize: 12.5, color: colores.textoMedio, flex: 1, lineHeight: 1.4 }}>{ev.texto}</span>
          <span style={{ fontSize: 10.5, color: colores.textoOscuro, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{ev.hora}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── Sugerencia con confirmación ("¿estás seguro?") ────── */
export const Sugerencia: React.FC<{ accion: string }> = ({ accion }) => {
  const [estado, setEstado] = useState<'idle' | 'confirmar' | 'aplicada'>('idle');
  const btn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700 };

  if (estado === 'aplicada') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 9, fontSize: 11, fontWeight: 700, color: colores.exito }}>
        <Check size={13} /> Sugerencia aplicada
      </div>
    );
  }
  if (estado === 'confirmar') {
    return (
      <div style={{ marginTop: 9, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: colores.textoMedio }}>¿Estás seguro? · {accion}</span>
        <button onClick={() => setEstado('aplicada')} style={{ ...btn, background: colores.acento, color: '#0E2318' }}><Check size={12} /> Sí, aplicar</button>
        <button onClick={() => setEstado('idle')} style={{ ...btn, background: colores.fondoTerciario, color: colores.textoMedio }}>Cancelar</button>
      </div>
    );
  }
  return (
    <button
      onClick={() => setEstado('confirmar')}
      style={{
        ...btn, marginTop: 9, background: '#fff', border: `1px solid ${colores.acento}`,
        color: colores.secundario, borderRadius: 20, padding: '6px 11px',
        animation: 'cc-sug 2.4s ease-in-out infinite',
      }}
    >
      <Zap size={12} color={colores.acento} />
      <span style={{ fontSize: 8.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: colores.acento }}>Sugerencia</span>
      {accion}
    </button>
  );
};

/* ── Stack de alertas ──────────────────────────────────── */
export interface AlertItem { sev: FeedSev; titulo: string; detalle: string; accion?: string; }
export const AlertStack: React.FC<{ alertas: AlertItem[]; titulo?: string }> = ({ alertas, titulo = 'Alertas activas' }) => (
  <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${colores.borde}`, boxShadow: colores.sombra, padding: 18 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <AlertTriangle size={15} color={colores.advertencia} />
      <span style={{ fontSize: 13, fontWeight: 600, color: colores.textoClaro }}>{titulo}</span>
      <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: colores.advertencia, background: '#FFFBEB', borderRadius: 20, padding: '2px 9px' }}>{alertas.length}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {alertas.map((a, i) => (
        <div key={i} style={{
          display: 'flex', gap: 12, padding: 12, borderRadius: 10,
          background: colores.fondoTerciario, borderLeft: `3px solid ${SEV_COLOR[a.sev]}`,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: colores.textoClaro }}>{a.titulo}</div>
            <div style={{ fontSize: 11.5, color: colores.textoOscuro, marginTop: 2, lineHeight: 1.4 }}>{a.detalle}</div>
            {a.accion && <Sugerencia accion={a.accion} />}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ── Palancas financieras ──────────────────────────────── */
export interface Palanca { nombre: string; valor: string; estado: 'ok' | 'warn' | 'crit'; consejo: string; }
export const FinancialLevers: React.FC<{ palancas: Palanca[]; titulo?: string }> = ({ palancas, titulo = 'Palancas financieras' }) => {
  const c: Record<Palanca['estado'], string> = { ok: colores.exito, warn: colores.advertencia, crit: colores.peligro };
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: `1px solid ${colores.borde}`, boxShadow: colores.sombra, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: colores.textoClaro }}>{titulo}</span>
      </div>
      <p style={{ fontSize: 11.5, color: colores.textoOscuro, margin: '0 0 14px' }}>
        Estructura de capital y apalancamiento — recomendaciones de MAYIA
      </p>
      <div className="rg-2" style={{ gap: 12 }}>
        {palancas.map((p, i) => (
          <div key={i} style={{ padding: 14, borderRadius: 10, background: colores.fondoTerciario, border: `1px solid ${colores.borde}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: colores.textoMedio }}>{p.nombre}</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: c[p.estado], letterSpacing: '-0.3px', fontVariantNumeric: 'tabular-nums' }}>{p.valor}</span>
            </div>
            <p style={{ fontSize: 11, color: colores.textoOscuro, margin: '7px 0 0', lineHeight: 1.45 }}>{p.consejo}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Grid de videos (Robótica/IoT) ─────────────────────── */
export interface VideoSlot { titulo: string; alerta?: { sev: FeedSev; texto: string }; url?: string; }
export const VideoGrid: React.FC<{ slots: VideoSlot[] }> = ({ slots }) => {
  const [urls, setUrls] = useState<Record<number, string>>(
    Object.fromEntries(slots.map((s, i) => [i, s.url ?? ''])),
  );
  const [draft, setDraft] = useState<Record<number, string>>({});

  return (
    <div className="rg-3" style={{ gap: 16 }}>
      {slots.map((s, i) => {
        const url = urls[i];
        const esFija = !!s.url; // cámara predefinida: solo lectura, no se pausa ni se quita
        return (
          <div key={i} style={{ background: '#fff', borderRadius: 12, border: `1px solid ${colores.borde}`, boxShadow: colores.sombra, overflow: 'hidden' }}>
            <div style={{ position: 'relative', aspectRatio: '16 / 9', background: '#0E2318' }}>
              {url ? (
                <>
                  <video
                    src={url} autoPlay muted loop playsInline
                    controls={false} disablePictureInPicture
                    controlsList="nodownload noplaybackrate nofullscreen"
                    onContextMenu={e => e.preventDefault()}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                  />
                  <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 20, background: 'rgba(220,38,38,0.85)' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'cc-ping 1.6s ease-in-out infinite' }} />
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: '#fff' }}>EN VIVO</span>
                  </div>
                  {!esFija && (
                    <button
                      onClick={() => setUrls(u => ({ ...u, [i]: '' }))}
                      style={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'rgba(0,0,0,0.55)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X size={13} />
                    </button>
                  )}
                </>
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(82,183,136,0.15)', border: '1px dashed rgba(82,183,136,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={18} color={colores.acento} />
                  </div>
                  <input
                    value={draft[i] ?? ''}
                    onChange={e => setDraft(d => ({ ...d, [i]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter' && draft[i]) setUrls(u => ({ ...u, [i]: draft[i] })); }}
                    placeholder="Pega URL de video y Enter"
                    style={{ width: '100%', maxWidth: 220, padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 11, outline: 'none', textAlign: 'center' }}
                  />
                </div>
              )}
              {s.alerta && (
                <div style={{ position: 'absolute', bottom: 8, left: 8, display: 'flex', alignItems: 'center', gap: 6, padding: '4px 9px', borderRadius: 20, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: SEV_COLOR[s.alerta.sev], boxShadow: `0 0 7px ${SEV_COLOR[s.alerta.sev]}` }} />
                  <span style={{ fontSize: 10.5, color: '#fff', fontWeight: 600 }}>{s.alerta.texto}</span>
                </div>
              )}
            </div>
            <div style={{ padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: colores.textoClaro, flex: 1 }}>{s.titulo}</span>
              <LiveDot size={6} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ── Cabecera de página estándar ───────────────────────── */
export const PageTitle: React.FC<{ titulo: string; bajada: string }> = ({ titulo, bajada }) => (
  <div>
    <h1 className="page-title" style={{ fontSize: 28, fontWeight: 700, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}>{titulo}</h1>
    <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>{bajada}</p>
  </div>
);
