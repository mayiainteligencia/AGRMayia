import React, { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { LogIn, Truck, DollarSign, Sprout, ClipboardList, Snowflake, X, ArrowRight, Check } from 'lucide-react';
import { brandingConfig } from '../../config/branding';

const { colores } = brandingConfig;

type Kind = 'entrada' | 'salida' | 'venta' | 'cosecha' | 'pago' | 'pedido' | 'empaque';
type Accion =
  | { tipo: 'ir'; label: string; seccion: string }
  | { tipo: 'confirmar' };
interface Toast { id: number; kind: Kind; texto: string; hora: string; accion?: Accion; resuelto?: string; }

const META: Record<Kind, { icon: LucideIcon; color: string; etiqueta: string }> = {
  entrada: { icon: LogIn,         color: colores.info,       etiqueta: 'Registro de entrada' },
  salida:  { icon: Truck,         color: colores.secundario, etiqueta: 'Salida de paquete' },
  venta:   { icon: DollarSign,    color: colores.exito,      etiqueta: 'Venta' },
  cosecha: { icon: Sprout,        color: colores.acento,     etiqueta: 'Cosecha' },
  pago:    { icon: DollarSign,    color: colores.acentoBerry,etiqueta: 'Pago' },
  pedido:  { icon: ClipboardList, color: colores.advertencia,etiqueta: 'Nuevo pedido' },
  empaque: { icon: Snowflake,     color: colores.info,       etiqueta: 'Empaque' },
};

const COSECHADORES = ['Juan Pérez', 'María Ic', 'José Hernández', 'Ana López', 'Pedro Nuñez', 'Lucía Ramos'];
const CLIENTES = ['Driscoll’s Norte', 'Walmart México', 'Berries EU Export', 'La Comer', 'Central de Abastos'];
const RANCHOS = ['Rancho El Roble', 'Campo San Luis', 'Bloque A', 'Bloque C', 'Invernadero 2'];
const PRODUCTORES = ['Coop. El Roble', 'Rancho San Luis', 'José Hernández', 'María Ic'];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Genera un evento "vivo" relacionado a la cosecha/operación. */
function nuevoEvento(): { kind: Kind; texto: string; accion?: Accion } {
  const kind = pick<Kind>(['entrada', 'salida', 'venta', 'cosecha', 'pago', 'pedido', 'empaque']);
  switch (kind) {
    case 'entrada': return { kind, texto: `Registro de entrada — cosechador ${pick(COSECHADORES)} en ${pick(RANCHOS)}`, accion: { tipo: 'ir', label: 'Ver registro', seccion: 'registro-entrada-turno' } };
    case 'salida':  return { kind, texto: `Ha salido el paquete BF-${rnd(1000, 9999)} rumbo a ${pick(CLIENTES)}`, accion: { tipo: 'ir', label: 'Ver en Cedís', seccion: 'cedis' } };
    case 'venta':   return { kind, texto: `Se ha vendido lote L-${rnd(100, 999)} — ${rnd(300, 4200)} kg a ${pick(CLIENTES)}`, accion: { tipo: 'ir', label: 'Ver cliente', seccion: 'clientes' } };
    case 'cosecha': return { kind, texto: `Cosecha registrada — ${rnd(80, 640)} kg en ${pick(RANCHOS)}`, accion: { tipo: 'ir', label: 'Ver reportes', seccion: 'analitica-reportes' } };
    case 'pago':    return { kind, texto: `Pago dispersado — $${rnd(20, 180)}K a ${pick(PRODUCTORES)}`, accion: { tipo: 'ir', label: 'Ver pagos', seccion: 'agricultores-menores' } };
    case 'pedido':  return { kind, texto: `Nuevo pedido — ${pick(CLIENTES)} solicita ${rnd(2, 18)} t`, accion: { tipo: 'confirmar' } };
    case 'empaque': return { kind, texto: `Clamshell ${pick(['6oz', '12oz'])} empacado — ${rnd(40, 320)} cajas`, accion: { tipo: 'ir', label: 'Ver empaque', seccion: 'cooler-empaque' } };
  }
}

const hora = () => new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const INTERVALO_MS = 30_000;
const VIDA_MS = 7_000;
const MAX = 3;

export const LiveToasts: React.FC<{ onNavigate?: (seccion: string) => void }> = ({ onNavigate }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nid = useRef(1);

  useEffect(() => {
    const push = () => {
      const ev = nuevoEvento();
      const id = nid.current++;
      setToasts(prev => [{ id, hora: hora(), ...ev }, ...prev].slice(0, MAX));
      window.setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), VIDA_MS);
    };
    const primero = window.setTimeout(push, 3000); // arranque rápido para sentirse vivo
    const intervalo = window.setInterval(push, INTERVALO_MS);
    return () => { window.clearTimeout(primero); window.clearInterval(intervalo); };
  }, []);

  const cerrar = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));
  const irA = (id: number, seccion: string) => { onNavigate?.(seccion); cerrar(id); };
  const resolver = (id: number, texto: string) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, resuelto: texto } : t));
    window.setTimeout(() => cerrar(id), 2500);
  };

  const btnBase: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px',
    borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
  };

  return (
    <>
      <style>{`
        @keyframes toast-in { from { opacity: 0; transform: translateX(24px) scale(0.96); } to { opacity: 1; transform: translateX(0) scale(1); } }
        @keyframes toast-bar { from { width: 100%; } to { width: 0%; } }
      `}</style>
      <div style={{
        position: 'fixed', right: 20, bottom: 20, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 12, width: 340, maxWidth: 'calc(100vw - 40px)',
        pointerEvents: 'none',
      }}>
        {toasts.map(t => {
          const m = META[t.kind];
          const Icon = m.icon;
          return (
            <div key={t.id} style={{
              pointerEvents: 'auto',
              position: 'relative', overflow: 'hidden',
              background: 'linear-gradient(100deg, #0E2318 0%, #1A3C2E 70%, #204A37 100%)',
              border: `1px solid ${m.color}55`,
              borderRadius: 13,
              boxShadow: '0 12px 32px rgba(14,35,24,0.35)',
              padding: '13px 14px',
              display: 'flex', gap: 12, alignItems: 'flex-start',
              animation: 'toast-in 0.4s cubic-bezier(.22,1,.36,1)',
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                background: `${m.color}26`, border: `1px solid ${m.color}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={16} color={m.color} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: m.color }}>{m.etiqueta}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 9.5, color: 'rgba(255,255,255,0.35)', fontVariantNumeric: 'tabular-nums' }}>{t.hora}</span>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: 12.5, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>{t.texto}</p>

                {t.resuelto ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 9, fontSize: 11, fontWeight: 700, color: colores.acento }}>
                    <Check size={13} /> {t.resuelto}
                  </div>
                ) : t.accion?.tipo === 'ir' ? (
                  <button
                    onClick={() => irA(t.id, (t.accion as { seccion: string }).seccion)}
                    style={{ ...btnBase, marginTop: 9, background: 'rgba(82,183,136,0.16)', color: colores.acento }}
                  >
                    {t.accion.label} <ArrowRight size={12} />
                  </button>
                ) : t.accion?.tipo === 'confirmar' ? (
                  <div style={{ display: 'flex', gap: 8, marginTop: 9 }}>
                    <button onClick={() => resolver(t.id, 'Pedido aceptado')} style={{ ...btnBase, background: colores.acento, color: '#0E2318' }}>
                      <Check size={12} /> Aceptar
                    </button>
                    <button onClick={() => resolver(t.id, 'Pedido declinado')} style={{ ...btnBase, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                      Declinar
                    </button>
                  </div>
                ) : null}
              </div>
              <button onClick={() => cerrar(t.id)} style={{
                flexShrink: 0, width: 20, height: 20, borderRadius: 6, border: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <X size={12} />
              </button>
              <span style={{ position: 'absolute', left: 0, bottom: 0, height: 2, background: m.color, animation: `toast-bar ${VIDA_MS}ms linear forwards` }} />
            </div>
          );
        })}
      </div>
    </>
  );
};
