import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Atom, Sparkles, ArrowRight, ChevronLeft, ChevronRight, EyeOff,
  BarChart3, Warehouse, Boxes, HeartHandshake, Cloud,
  FlaskConical, ShieldAlert, Server, Bot, Users,
} from 'lucide-react';
import { brandingConfig } from '../../config/branding';
import { useNav } from '../../config/navContext';

const { colores } = brandingConfig;

/* ── Cerebro / núcleo 3D en canvas (sin dependencias) ──── */
interface BrainHandle { boost: () => void; }
const BrainCanvas = forwardRef<BrainHandle, { onPulse: () => void }>(({ onPulse }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);
  const spinRef = useRef(0);
  const ripples = useRef<number[]>([]);

  const boost = () => { spinRef.current = Math.min(spinRef.current + 0.30, 0.6); ripples.current.push(tRef.current); };
  useImperativeHandle(ref, () => ({ boost }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth; h = parent.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const N = 340;
    const pts: { x: number; y: number; z: number }[] = [];
    const gr = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = gr * i;
      pts.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r });
    }

    const rings = [
      { a: 1.20, b: 0.5, sp: 0.7, ph: 0.0, c: '82,183,136' },
      { a: 0.55, b: 1.20, sp: -0.5, ph: 0.5, c: '45,106,79' },
      { a: 1.14, b: 0.88, sp: 0.4, ph: 1.2, c: '124,203,169' },
    ];

    const draw = () => {
      const t = tRef.current + 0.006 + spinRef.current;
      tRef.current = t;
      spinRef.current *= 0.94;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.34;
      const fov = R * 3.2;

      // Halo exterior
      const halo = ctx.createRadialGradient(cx, cy, R * 0.5, cx, cy, R * 1.7);
      halo.addColorStop(0, 'rgba(82,183,136,0.10)');
      halo.addColorStop(1, 'rgba(82,183,136,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      // Anillos orbitales + electrones
      for (const rg of rings) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * rg.sp + rg.ph);
        ctx.beginPath();
        ctx.ellipse(0, 0, R * rg.a, R * rg.b, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rg.c},0.32)`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(82,183,136,0.6)';
        ctx.shadowBlur = 8;
        ctx.stroke();
        // electrón
        const ex = Math.cos(t * 2 + rg.ph) * R * rg.a;
        const ey = Math.sin(t * 2 + rg.ph) * R * rg.b;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(124,203,169,0.95)';
        ctx.shadowColor = 'rgba(82,183,136,1)';
        ctx.shadowBlur = 14;
        ctx.arc(ex, ey, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.shadowBlur = 0;

      // Esfera de partículas (rotación 3D)
      const cosY = Math.cos(t), sinY = Math.sin(t);
      const tilt = 0.5, cosT = Math.cos(tilt), sinT = Math.sin(tilt);
      const proj = pts.map(p => {
        const x = p.x * cosY + p.z * sinY;
        const z = -p.x * sinY + p.z * cosY;
        const y2 = p.y * cosT - z * sinT;
        const z2 = p.y * sinT + z * cosT;
        const s = fov / (fov + z2 * R);
        return { sx: cx + x * R * s, sy: cy + y2 * R * s, z: z2 };
      }).sort((a, b) => a.z - b.z);

      for (const q of proj) {
        const depth = (q.z + 1) / 2;
        ctx.beginPath();
        ctx.fillStyle = `rgba(45,106,79,${0.12 + depth * 0.78})`;
        ctx.shadowColor = 'rgba(82,183,136,0.9)';
        ctx.shadowBlur = depth * 11;
        ctx.arc(q.sx, q.sy, 1.1 + depth * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Núcleo — halo + orbe + destello rotatorio + rim
      const cr = R * 0.27 * (1 + Math.sin(t * 3) * 0.13);
      const halo2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr * 2.4);
      halo2.addColorStop(0, 'rgba(82,183,136,0.30)');
      halo2.addColorStop(1, 'rgba(82,183,136,0)');
      ctx.fillStyle = halo2;
      ctx.beginPath(); ctx.arc(cx, cy, cr * 2.4, 0, Math.PI * 2); ctx.fill();

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
      g.addColorStop(0, 'rgba(255,255,255,0.98)');
      g.addColorStop(0.28, 'rgba(170,235,205,0.95)');
      g.addColorStop(0.6, 'rgba(82,183,136,0.82)');
      g.addColorStop(1, 'rgba(45,106,79,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2); ctx.fill();

      const hx = cx + Math.cos(t * 1.4) * cr * 0.32;
      const hy = cy + Math.sin(t * 1.4) * cr * 0.32;
      const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, cr * 0.6);
      hg.addColorStop(0, 'rgba(255,255,255,0.9)');
      hg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = hg;
      ctx.beginPath(); ctx.arc(hx, hy, cr * 0.6, 0, Math.PI * 2); ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(82,183,136,0.45)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(82,183,136,0.8)';
      ctx.shadowBlur = 12;
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Flujo de datos — módulos → núcleo (curvas + streams)
      const bez = (x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, u: number) => {
        const m = 1 - u;
        return { x: m * m * x0 + 2 * m * u * x1 + u * u * x2, y: m * m * y0 + 2 * m * u * y1 + u * u * y2 };
      };
      const spreadY = Math.min(h * 0.40, R * 2.4);
      const rels = [-0.5, -0.25, 0, 0.25, 0.5];
      const anchors: { ax: number; ay: number; incoming: boolean; seed: number }[] = [];
      rels.forEach((ry, i) => {
        anchors.push({ ax: w * 0.19, ay: cy + ry * spreadY, incoming: true, seed: i });
        anchors.push({ ax: w * 0.81, ay: cy + ry * spreadY, incoming: i % 3 !== 0, seed: i + 5 });
      });
      anchors.forEach(a => {
        const cpx = (a.ax + cx) / 2;
        const cpy = cy + (a.ay - cy) * 0.12;
        const lg = ctx.createLinearGradient(a.ax, a.ay, cx, cy);
        lg.addColorStop(0, 'rgba(82,183,136,0.28)');
        lg.addColorStop(1, 'rgba(45,106,79,0.95)');
        ctx.beginPath();
        ctx.moveTo(a.ax, a.ay);
        ctx.quadraticCurveTo(cpx, cpy, cx, cy);
        ctx.strokeStyle = lg;
        ctx.lineWidth = 2.4;
        ctx.shadowColor = 'rgba(82,183,136,0.9)';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
        for (let k = 0; k < 4; k++) {
          const raw = (t * 0.16 + a.seed * 0.21 + k * 0.25) % 1;
          const u = a.incoming ? raw : 1 - raw;
          const p = bez(a.ax, a.ay, cpx, cpy, cx, cy, u);
          const fade = Math.sin(raw * Math.PI);
          const size = (2.6 - k * 0.5) * fade;
          if (size <= 0.3) continue;
          ctx.beginPath();
          ctx.fillStyle = `rgba(${k === 0 ? '124,203,169' : '82,183,136'},${(k === 0 ? 0.95 : 0.55) * fade})`;
          ctx.shadowColor = 'rgba(82,183,136,1)';
          ctx.shadowBlur = 10 * fade;
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.shadowBlur = 0;

      // Ondas al hacer clic / sugerencia
      ripples.current = ripples.current.filter(r => t - r < 1.2);
      for (const r of ripples.current) {
        const p = (t - r) / 1.2;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(82,183,136,${(1 - p) * 0.5})`;
        ctx.lineWidth = 2;
        ctx.arc(cx, cy, R * (0.3 + p * 1.15), 0, Math.PI * 2);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onClick={() => { boost(); onPulse(); }}
      style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
    />
  );
});
BrainCanvas.displayName = 'BrainCanvas';

/* ── Insights del núcleo ───────────────────────────────── */
const INSIGHTS: { texto: string; seccion: string; label: string }[] = [
  { texto: 'Detecté saturación en CEDIS Los Reyes (92%). Sugiero desviar 8 t a CEDIS Bajío antes de la cosecha del jueves.', seccion: 'cedis', label: 'Cedís' },
  { texto: 'Cadena de frío fuera de rango en cámara 3. Recomiendo reubicar el lote y revisar el compresor de inmediato.', seccion: 'cooler-empaque', label: 'Cooler y Empaque' },
  { texto: 'Cartera vencida de $512K en Central de Abastos. Sugiero suspender despacho y renegociar el plazo.', seccion: 'clientes', label: 'Clientes' },
  { texto: 'Malware IoT en sensor-campo-14. Estoy aislando la VLAN y programando el reflasheo del firmware.', seccion: 'ciberseguridad', label: 'Ciberseguridad' },
  { texto: 'La ventana climática óptima para siembra cierra en 12 días. Confirma disponibilidad de plántula.', seccion: 'calendario-siembra', label: 'Calendario de Siembra' },
  { texto: 'BRAIN #P mejoró el pronóstico de cosecha 6%. Está listo para promover a producción.', seccion: 'inteligencia-etapa-2', label: 'Inteligencia · Etapa 2' },
  { texto: 'Nodo repeater-campo-7 caído; 6 sensores sin reporte. Ejecuté failover al enlace redundante.', seccion: 'noc', label: 'NOC' },
];

/* ── Resúmenes laterales (HUD) ─────────────────────────── */
type Sev = 'ok' | 'warn' | 'crit';
interface Resumen { id: string; nombre: string; metrica: string; sev: Sev; icon: LucideIcon; bars: number[]; }
const SEV: Record<Sev, string> = { ok: colores.exito, warn: colores.advertencia, crit: colores.peligro };

const IZQ: Resumen[] = [
  { id: 'analitica-reportes', nombre: 'Finanzas y Analítica', metrica: '+40.3% crecimiento', sev: 'ok', icon: BarChart3, bars: [40, 55, 48, 70, 62, 88] },
  { id: 'cedis', nombre: 'Cedís', metrica: '86% ocupación', sev: 'warn', icon: Warehouse, bars: [60, 72, 68, 80, 86, 84] },
  { id: 'inventario', nombre: 'Inventario', metrica: '7 SKUs bajo mínimo', sev: 'warn', icon: Boxes, bars: [30, 45, 38, 28, 20, 15] },
  { id: 'agricultores-menores', nombre: 'Agricultores Menores', metrica: '96 t acopiadas', sev: 'ok', icon: HeartHandshake, bars: [50, 58, 65, 72, 84, 96] },
  { id: 'panel-meteorologico', nombre: 'Panel Meteorológico', metrica: 'Helada probable', sev: 'crit', icon: Cloud, bars: [70, 60, 45, 30, 22, 12] },
];
const DER: Resumen[] = [
  { id: 'panel-laboratorio', nombre: 'Panel Laboratorio', metrica: '96% aprobación', sev: 'ok', icon: FlaskConical, bars: [88, 90, 92, 91, 95, 96] },
  { id: 'ciberseguridad', nombre: 'Ciberseguridad', metrica: '1,284 amenazas bloq.', sev: 'warn', icon: ShieldAlert, bars: [40, 62, 55, 78, 70, 92] },
  { id: 'noc', nombre: 'NOC', metrica: '99.97% uptime', sev: 'ok', icon: Server, bars: [96, 98, 97, 99, 98, 99] },
  { id: 'robotics-iot', nombre: 'Robótica e IoT', metrica: '6/8 robots activos', sev: 'warn', icon: Bot, bars: [80, 75, 70, 65, 72, 60] },
  { id: 'clientes', nombre: 'Clientes', metrica: '$4.82M ingreso', sev: 'ok', icon: Users, bars: [55, 60, 58, 68, 74, 82] },
];

const MiniBars: React.FC<{ bars: number[]; color: string }> = ({ bars, color }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 22, flexShrink: 0 }}>
    {bars.map((b, i) => (
      <span key={i} style={{ width: 3, height: `${b}%`, background: i === bars.length - 1 ? color : `${color}66`, borderRadius: 1 }} />
    ))}
  </div>
);

const Corners: React.FC<{ color: string }> = ({ color }) => {
  const base: React.CSSProperties = { position: 'absolute', width: 10, height: 10, borderColor: color, pointerEvents: 'none' };
  return (
    <>
      <span style={{ ...base, top: 6, left: 6, borderTop: `1.5px solid`, borderLeft: `1.5px solid` }} />
      <span style={{ ...base, top: 6, right: 6, borderTop: `1.5px solid`, borderRight: `1.5px solid` }} />
      <span style={{ ...base, bottom: 6, left: 6, borderBottom: `1.5px solid`, borderLeft: `1.5px solid` }} />
      <span style={{ ...base, bottom: 6, right: 6, borderBottom: `1.5px solid`, borderRight: `1.5px solid` }} />
    </>
  );
};

/* Tarjeta 3D individual por sección */
const GlassTile: React.FC<{ it: Resumen; side: 'left' | 'right' }> = ({ it, side }) => {
  const nav = useNav();
  const Icon = it.icon;
  return (
    <div className={`cc-tilt ${side}`}>
      <div className="cc-panel3d" role="button" onClick={() => nav(it.id)} style={{ cursor: 'pointer' }}>
        <div className="cc-glass" />
        <div className="cc-glare" />
        <div className="cc-content" style={{ padding: 13, gap: 9 }}>
          <Corners color={colores.acento} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: `${colores.secundario}16`, border: `1px solid ${colores.secundario}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={16} color={colores.secundario} strokeWidth={2} />
            </div>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 800, color: colores.textoClaro, letterSpacing: '-0.2px', lineHeight: 1.15 }}>{it.nombre}</span>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: SEV[it.sev], boxShadow: `0 0 7px ${SEV[it.sev]}`, flexShrink: 0 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11.5, color: colores.textoOscuro, fontVariantNumeric: 'tabular-nums' }}>{it.metrica}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 10.5, fontWeight: 700, color: colores.secundario }}>
                Abrir <ArrowRight size={11} />
              </div>
            </div>
            <MiniBars bars={it.bars} color={SEV[it.sev]} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* Columna de tarjetas individuales (con ocultar/llamar) */
const SidePanel: React.FC<{ titulo: string; items: Resumen[]; open: boolean; onToggle: () => void; side: 'left' | 'right' }> = ({ titulo, items, open, onToggle, side }) => {
  if (!open) {
    return (
      <button onClick={onToggle} title={`Mostrar ${titulo}`} className="cc-rail" style={{
        width: 38, alignSelf: 'stretch', minHeight: 120, borderRadius: 12, cursor: 'pointer',
        background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', border: `1px solid ${colores.acento}40`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px 0',
      }}>
        {side === 'left' ? <ChevronRight size={15} color={colores.secundario} /> : <ChevronLeft size={15} color={colores.secundario} />}
        <span style={{ writingMode: 'vertical-rl', fontSize: 10.5, fontWeight: 800, color: colores.secundario, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{titulo}</span>
      </button>
    );
  }
  return (
    <div className="cc-col" style={{ width: 260, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 2px', flexDirection: side === 'right' ? 'row-reverse' : 'row' }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: colores.primario, letterSpacing: '0.12em', textTransform: 'uppercase', flex: 1, textAlign: side === 'right' ? 'right' : 'left' }}>{titulo}</span>
        <button onClick={onToggle} title="Ocultar" style={{ width: 24, height: 24, borderRadius: 7, border: `1px solid ${colores.borde}`, background: 'rgba(255,255,255,0.85)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <EyeOff size={12} color={colores.textoOscuro} />
        </button>
      </div>
      {items.map(it => <GlassTile key={it.id} it={it} side={side} />)}
    </div>
  );
};

/* ── Sección ───────────────────────────────────────────── */
export const ComandoCentral: React.FC = () => {
  const nav = useNav();
  const brainRef = useRef<BrainHandle>(null);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [idx, setIdx] = useState(0);
  const insight = INSIGHTS[idx];

  const advance = () => { setIdx(i => (i + 1) % INSIGHTS.length); brainRef.current?.boost(); };

  useEffect(() => {
    const t = setInterval(advance, 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <style>{`
        @keyframes cc-ping2 { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.7); opacity: 0.3; } }
        @keyframes cc-emerge2 { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .cc-card { transition: transform 0.16s, box-shadow 0.16s; }
        .cc-card:hover { transform: translateX(2px); box-shadow: 0 8px 20px rgba(14,35,24,0.1); }
        .cc-stage {
          position: relative; height: 640px; overflow: visible;
          background: radial-gradient(circle at 50% 46%, rgba(82,183,136,0.16) 0%, rgba(82,183,136,0.05) 42%, rgba(255,255,255,0) 72%);
        }
        .cc-brain { position: absolute; inset: 0; }
        .cc-slot { position: absolute; top: 16px; z-index: 5; }
        .cc-slot.left { left: 16px; }
        .cc-slot.right { right: 16px; }

        /* Tarjeta 3D individual (glass tilt) */
        .cc-tilt { perspective: 1000px; }
        .cc-panel3d { position: relative; width: 260px; transform-style: preserve-3d; transition: transform 0.5s cubic-bezier(.22,1,.36,1); will-change: transform; }
        /* Hundidas por defecto; se enderezan al hover */
        .cc-tilt.left  .cc-panel3d { transform: rotate3d(1, 1,0,16deg); }
        .cc-tilt.right .cc-panel3d { transform: rotate3d(1,-1,0,16deg); }
        .cc-tilt.left:hover  .cc-panel3d,
        .cc-tilt.right:hover .cc-panel3d { transform: none; }
        .cc-glass { position: absolute; inset: 0; border-radius: 18px; background: rgba(255,255,255,0.62); backdrop-filter: blur(12px); border: 1.5px solid ${colores.acento}; transition: box-shadow 0.5s; animation: cc-glow 3.2s ease-in-out infinite; }
        .cc-tilt:hover .cc-glass { box-shadow: 0 0 28px rgba(82,183,136,0.75), 0 16px 30px rgba(14,35,24,0.12); animation: none; border-color: ${colores.acento}; }
        @keyframes cc-glow {
          0%,100% { box-shadow: 0 0 12px rgba(82,183,136,0.35), 0 10px 22px rgba(14,35,24,0.07); }
          50%     { box-shadow: 0 0 24px rgba(82,183,136,0.65), 0 10px 22px rgba(14,35,24,0.07); }
        }
        .cc-glare { position: absolute; inset: 3px; border-radius: 16px; background: linear-gradient(140deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.04) 60%); border-bottom: 1px solid rgba(255,255,255,0.5); border-left: 1px solid rgba(255,255,255,0.5); pointer-events: none; }
        .cc-content { position: relative; padding: 14px; display: flex; flex-direction: column; gap: 9px; }
        .cc-tile { transition: transform 0.55s cubic-bezier(.22,1,.36,1), box-shadow 0.16s; }

        @media (max-width: 1023px) {
          .cc-stage { height: auto; display: flex; flex-direction: column; gap: 14px; }
          .cc-brain { position: relative; inset: auto; height: 420px; }
          .cc-slot { position: static; }
          .cc-slot.left, .cc-slot.right { left: auto; right: auto; }
          .cc-tilt { perspective: none; }
          .cc-tilt.left .cc-panel3d, .cc-tilt.right .cc-panel3d { transform: none; }
          .cc-panel3d, .cc-col, .cc-rail { width: 100% !important; }
          .cc-content { transform: none; }
          .cc-glare { display: none; }
        }
      `}</style>

      {/* Cabecera */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ width: 48, height: 48, borderRadius: 13, background: colores.gradientePrimario, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 20px ${colores.primario}40` }}>
          <Atom size={24} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: colores.textoClaro, letterSpacing: '-0.6px' }}>Comando Central</h1>
          <p style={{ margin: '3px 0 0', fontSize: 13.5, color: colores.textoOscuro }}>Núcleo de inteligencia MAYIA — orquestación viva de todas las secciones</p>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 13px', borderRadius: 20, background: '#fff', border: `1px solid ${colores.acento}40`, boxShadow: colores.sombra }}>
          <span style={{ position: 'relative', width: 8, height: 8 }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: colores.acento }} />
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: colores.acento, animation: 'cc-ping2 1.8s ease-in-out infinite' }} />
          </span>
          <span style={{ fontSize: 11.5, fontWeight: 800, color: colores.secundario, letterSpacing: '0.04em' }}>NÚCLEO ACTIVO</span>
        </div>
      </div>

      {/* Sin cuadro: átomo centrado de fondo, laterales flotan encima */}
      <div className="cc-stage">
        <div className="cc-brain">
          <BrainCanvas ref={brainRef} onPulse={advance} />

          {/* HUD inferior con la lectura del núcleo */}
          <div key={idx} style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 16,
            width: 'min(440px, calc(100% - 32px))', animation: 'cc-emerge2 0.4s ease',
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
            border: `1px solid ${colores.acento}40`, borderRadius: 999, padding: '8px 10px 8px 12px',
            display: 'flex', alignItems: 'center', gap: 10, boxShadow: colores.sombraMedia,
          }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: colores.gradienteAcento, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={13} color="#fff" />
            </div>
            <p style={{
              margin: 0, flex: 1, minWidth: 0, fontSize: 12, color: colores.textoMedio, lineHeight: 1.35,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              <span style={{ fontWeight: 800, color: colores.secundario }}>MAYIA · </span>{insight.texto}
            </p>
            <button onClick={() => nav(insight.seccion)} title={`Ir a ${insight.label}`} style={{
              flexShrink: 0, width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: colores.secundario, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Pista superior */}
          <div style={{ position: 'absolute', top: 6, left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: 11.5, color: colores.textoOscuro, background: 'rgba(255,255,255,0.7)', padding: '5px 12px', borderRadius: 20, border: `1px solid ${colores.borde}` }}>
              Toca el núcleo — gira y te da la siguiente lectura
            </span>
          </div>
        </div>

        <div className="cc-slot left">
          <SidePanel titulo="Operación" items={IZQ} open={leftOpen} onToggle={() => setLeftOpen(o => !o)} side="left" />
        </div>
        <div className="cc-slot right">
          <SidePanel titulo="Tecnología" items={DER} open={rightOpen} onToggle={() => setRightOpen(o => !o)} side="right" />
        </div>
      </div>
    </div>
  );
};

export default ComandoCentral;
