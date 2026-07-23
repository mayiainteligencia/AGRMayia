import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import {
  Atom, Sparkles, ArrowRight,
  Cpu, FlaskConical, Sprout, Droplets, Bug, Bell,
  BarChart3, Package, Truck, DollarSign, Globe,
  HeartHandshake, GraduationCap, Brain,
  Check, Zap, Lock, ChevronRight as ChevRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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
        lg.addColorStop(0, 'rgba(82,183,136,0.14)');
        lg.addColorStop(1, 'rgba(82,183,136,0.65)');
        ctx.beginPath();
        ctx.moveTo(a.ax, a.ay);
        ctx.quadraticCurveTo(cpx, cpy, cx, cy);
        ctx.strokeStyle = lg;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = 'rgba(82,183,136,0.7)';
        ctx.shadowBlur = 8;
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

/* ── DEPARTAMENTOS COMERCIALES ─────────────────────────── */
type DeptStatus = 'activo' | 'disponible' | 'proximamente';
interface Dept {
  id: number; nombre: string; descripcion: string;
  icon: LucideIcon; status: DeptStatus; paquete: number;
  color: string; subModulos: string[]; navTarget: string;
}

const STATUS_CFG: Record<DeptStatus, { label: string; bg: string; border: string; color: string; icon: LucideIcon }> = {
  activo:       { label: 'ACTIVO',       bg: 'rgba(82,183,136,0.12)',  border: 'rgba(82,183,136,0.3)',  color: '#52B788', icon: Check },
  disponible:   { label: 'DISPONIBLE',   bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.25)', color: '#3B82F6', icon: Zap },
  proximamente: { label: 'PRÓXIMAMENTE', bg: 'rgba(156,163,175,0.10)', border: 'rgba(156,163,175,0.25)', color: '#9CA3AF', icon: Lock },
};

const PAQUETES_NAMES: Record<number, string> = {
  1: 'Plataforma Base', 2: 'Producción Agrícola', 3: 'Cosecha y Calidad',
  4: 'Operación y Logística', 5: 'Comercial y Finanzas', 6: 'Clientes Internacionales',
  7: 'Cooperativas y Productores', 8: 'IA Avanzada',
};

const DEPARTAMENTOS: Dept[] = [
  { id:1,  nombre:'Cerebro Tecnológico',                    descripcion:'Base obligatoria de la plataforma. Usuarios, seguridad, APIs, motor de alertas, IA y arquitectura cloud.',                     icon:Cpu,            status:'activo',       paquete:1, color:'#52B788', subModulos:['Comando Central','Control de Decisiones','Panel Principal','Ciberseguridad','NOC','Monitoreo App','Reglas Operativas'], navTarget:'panel-principal' },
  { id:2,  nombre:'Laboratorio e Inteligencia Agronómica',  descripcion:'Análisis foliar, agua, biometría, calidad de fruto, Brix, blush y relación fenológica.',                                      icon:FlaskConical,   status:'activo',       paquete:2, color:'#3B82F6', subModulos:['Panel Laboratorio','Análisis de Alimentos','Suelo y Aguas','Microbiología','Informes y Certificados','Análisis Visual'], navTarget:'panel-laboratorio' },
  { id:3,  nombre:'Campo y Monitoreo Agrícola',             descripcion:'Registro de recorridos, muestreo por lote, fenología, incidencias y evidencia fotográfica.',                                  icon:Sprout,         status:'disponible',   paquete:2, color:'#10B981', subModulos:['Cosecha y Siembra','Campos / Ranchos','Plagas y Enfermedades','Listas de Preparación'], navTarget:'cosecha-siembra' },
  { id:4,  nombre:'Riego, Nutrición y Variables Críticas',  descripcion:'pH, EC/PPM, humedad, VPD, PPFD, DLI, horas de frío, programa de nutrición.',                                                 icon:Droplets,       status:'activo',       paquete:2, color:'#06B6D4', subModulos:['Medición de Agua','Instrumentos Ambientales','Soil-Bio-Vision™','Calculadora de Fertilizantes'], navTarget:'medicion-agua' },
  { id:5,  nombre:'Control Biológico, Plagas y Enfermedades',descripcion:'Monitoreo preventivo y correctivo de agentes biológicos con protocolos y evidencia.',                                       icon:Bug,            status:'disponible',   paquete:2, color:'#F59E0B', subModulos:['Bio-Acoustic Sentinel™','Plagas y Enfermedades','Protocolos Preventivos','Protocolos Correctivos'], navTarget:'bio-acoustic-sentinel' },
  { id:6,  nombre:'Alertas e Inteligencia Operativa',       descripcion:'Alertas informativas, preventivas, críticas y ejecutivas de toda la operación.',                                             icon:Bell,           status:'activo',       paquete:1, color:'#EF4444', subModulos:['Reglas Operativas','Alertas del Sistema','Alertas Meteorológicas','Motor de Alertas'], navTarget:'reglas-operativas' },
  { id:7,  nombre:'Cosecha y Predicción de Producción',     descripcion:'Estimación de volumen, ventana de corte, rendimiento por planta y programación.',                                           icon:BarChart3,      status:'activo',       paquete:3, color:'#8B5CF6', subModulos:['Motor de Probabilidad™','Planificación Integral','Calendario de Siembra','Predicción IA'], navTarget:'motor-probabilidad' },
  { id:8,  nombre:'Empaque, Calidad y Trazabilidad',        descripcion:'Recepción de fruta, clasificación, empaque, trazabilidad, certificaciones.',                                                 icon:Package,        status:'activo',       paquete:3, color:'#EC4899', subModulos:['Cooler y Empaque','Calidad','Trazabilidad','Certificaciones'], navTarget:'cooler-empaque' },
  { id:9,  nombre:'Logística, Inventarios y CEDIS',         descripcion:'Inventarios, insumos, almacén, CEDIS, embarques, rutas y cadena fría.',                                                     icon:Truck,          status:'activo',       paquete:4, color:'#F97316', subModulos:['CEDIS','Inventario','Logística y Envíos','Pedidos','Proveedores'], navTarget:'cedis' },
  { id:10, nombre:'Ventas, Finanzas y Precios Predictivos', descripcion:'Precios históricos, proyectados, órdenes de compra, márgenes y rentabilidad.',                                              icon:DollarSign,     status:'activo',       paquete:5, color:'#14B8A6', subModulos:['Analítica y Reportes','Gastos Operativos','Clientes','Precios Predictivos'], navTarget:'analitica-reportes' },
  { id:11, nombre:'Portal Clientes Internacionales',        descripcion:'Acceso B2B para compradores de USA y Canadá. Disponibilidad, precios, órdenes.',                                           icon:Globe,          status:'proximamente', paquete:6, color:'#6366F1', subModulos:['Portal B2B','Disponibilidad de Cosecha','Órdenes de Compra','Trazabilidad','Documentación'], navTarget:'portal-clientes-b2b' },
  { id:12, nombre:'Cooperativas y Pequeños Productores',    descripcion:'Registro de productores, capacitación, certificaciones, financiamiento.',                                                   icon:HeartHandshake, status:'activo',       paquete:7, color:'#D946EF', subModulos:['Agricultores Menores','Certificaciones','Financiamiento','Oportunidades Comerciales'], navTarget:'agricultores-menores' },
  { id:13, nombre:'Capacitación y Adopción',                descripcion:'Cursos, manuales, certificaciones internas, rutas de aprendizaje por rol.',                                                 icon:GraduationCap,  status:'proximamente', paquete:7, color:'#0EA5E9', subModulos:['Academia','Cursos por Rol','Certificaciones Internas','Biblioteca Agrícola'], navTarget:'academia-capacitacion' },
  { id:14, nombre:'Inteligencia Artificial y Agentes',      descripcion:'Agentes especializados: agronómico, riego, laboratorio, plagas, cosecha, comercial.',                                      icon:Brain,          status:'activo',       paquete:8, color:'#A855F7', subModulos:['BRAIN™ Central','Agente Agronómico','Agente de Riego','Agente Comercial','Inteligencia Etapa 2'], navTarget:'inteligencia-etapa-2' },
];

/* ── 5 CLUSTERS COMERCIALES ────────────────────────────── */
interface Cluster {
  etapa: number;
  titulo: string;
  subtitulo: string;
  color: string;          // header background (pastel)
  colorBorder: string;    // border color
  colorText: string;      // header text color
  colorAccent: string;    // accent / icon color
  deptIds: number[];
}

const CLUSTERS: Cluster[] = [
  {
    etapa: 1,
    titulo: 'CEREBRO',
    subtitulo: 'Módulo base obligatorio — plataforma, seguridad, IA y aprendizaje',
    color: '#D6EFE4',
    colorBorder: '#A8D5BA',
    colorText: '#1A4731',
    colorAccent: '#2D6A4F',
    deptIds: [1, 2, 6, 13, 14],
  },
  {
    etapa: 2,
    titulo: 'ESSENTIALS',
    subtitulo: 'Módulo premium agronómico-operativo — riego, nutrición y cosecha',
    color: '#D4E8F5',
    colorBorder: '#A0C4E0',
    colorText: '#0C3556',
    colorAccent: '#1565C0',
    deptIds: [4, 7],
  },
  {
    etapa: 3,
    titulo: 'OPERACIÓN',
    subtitulo: 'Empaque, calidad, trazabilidad, logística e inventarios',
    color: '#F0D9E8',
    colorBorder: '#D4A8C5',
    colorText: '#4A1040',
    colorAccent: '#8B2475',
    deptIds: [8, 9],
  },
  {
    etapa: 4,
    titulo: 'AGRO BIO ROBOTICS',
    subtitulo: 'Campo, monitoreo, IoT, cámaras, drones y control biológico',
    color: '#FAE5D4',
    colorBorder: '#E8C4A4',
    colorText: '#4A2010',
    colorAccent: '#C0601A',
    deptIds: [3, 5],
  },
  {
    etapa: 5,
    titulo: 'VENTAS',
    subtitulo: 'Comercial, finanzas, clientes internacionales y cooperativas',
    color: '#E8D4F5',
    colorBorder: '#C8A4E0',
    colorText: '#2E0D55',
    colorAccent: '#6B21A8',
    deptIds: [10, 11, 12],
  },
];

/* ── Corners decorative element ────────────────────────── */
const Corners: React.FC<{ color: string }> = ({ color }) => {
  const base: React.CSSProperties = { position: 'absolute', width: 8, height: 8, borderColor: color, pointerEvents: 'none' };
  return (
    <>
      <span style={{ ...base, top: 4, left: 4, borderTop: `1.5px solid`, borderLeft: `1.5px solid`, opacity: 0.5 }} />
      <span style={{ ...base, top: 4, right: 4, borderTop: `1.5px solid`, borderRight: `1.5px solid`, opacity: 0.5 }} />
      <span style={{ ...base, bottom: 4, left: 4, borderBottom: `1.5px solid`, borderLeft: `1.5px solid`, opacity: 0.5 }} />
      <span style={{ ...base, bottom: 4, right: 4, borderBottom: `1.5px solid`, borderRight: `1.5px solid`, opacity: 0.5 }} />
    </>
  );
};

/* ── DeptTile — tarjeta individual expandible ───────────── */
const DeptTile: React.FC<{ dept: Dept }> = ({ dept }) => {
  const nav = useNav();
  const sc = STATUS_CFG[dept.status];
  const DeptIcon = dept.icon;
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div style={{ perspective: 1000, width: '100%' }}>
      <div
        role="button"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          position: 'relative',
          cursor: 'pointer',
          width: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.4s cubic-bezier(.22,1,.36,1)',
        }}
      >
        {/* Glass card */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 14,
          background: isExpanded ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.80)',
          backdropFilter: 'blur(12px)',
          border: isExpanded ? `1.5px solid ${dept.color}` : '1.5px solid rgba(82,183,136,0.20)',
          boxShadow: isExpanded
            ? `0 0 20px ${dept.color}40, 0 8px 20px rgba(14,35,24,0.08)`
            : '0 2px 8px rgba(14,35,24,0.06)',
          transition: 'all 0.35s ease',
        }} />
        {/* Glare */}
        <div style={{
          position: 'absolute', inset: 2, borderRadius: 12,
          background: 'linear-gradient(140deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.02) 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', padding: '11px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Corners color={dept.color} />

          {/* Row 1: icon + name + status dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, flexShrink: 0,
              background: `${dept.color}18`, border: `1px solid ${dept.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <DeptIcon size={15} color={dept.color} strokeWidth={2} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                DEP {String(dept.id).padStart(2, '0')}
              </span>
              <h3 style={{
                fontSize: 13, fontWeight: 800, color: '#111827',
                margin: 0, lineHeight: 1.2, letterSpacing: '-0.1px',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {dept.nombre}
              </h3>
            </div>

            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: sc.color, boxShadow: `0 0 6px ${sc.color}`,
              flexShrink: 0,
            }} />
          </div>

          {/* Row 2: paquete + "Expandir" label (collapsed) */}
          {!isExpanded && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                {PAQUETES_NAMES[dept.paquete]}
              </span>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: '#2D6A4F', letterSpacing: '0.02em' }}>
                Expandir
              </span>
            </div>
          )}

          {/* Expanded content */}
          {isExpanded && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 2, animation: 'cc-emerge2 0.22s ease' }}>
              <p style={{ fontSize: 11.5, color: '#374151', lineHeight: 1.5, margin: 0 }}>
                {dept.descripcion}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {dept.subModulos.map(s => (
                  <span key={s} style={{
                    padding: '2px 8px', borderRadius: 5, fontSize: 9.5, fontWeight: 500,
                    background: `${dept.color}12`, color: dept.color, border: `1px solid ${dept.color}25`,
                    whiteSpace: 'nowrap',
                  }}>
                    {s}
                  </span>
                ))}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); nav(dept.navTarget); }}
                style={{
                  marginTop: 2, width: '100%', padding: '8px 14px',
                  borderRadius: 8, background: dept.color, color: '#fff',
                  border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  boxShadow: `0 3px 10px ${dept.color}40`, fontFamily: 'inherit',
                  transition: 'opacity 0.15s',
                }}
              >
                <span>Más info</span>
                <ArrowRight size={12} color="#fff" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── ClusterAccordion — sección colapsable ──────────────── */
const ClusterAccordion: React.FC<{ cluster: Cluster; defaultOpen?: boolean }> = ({ cluster, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const depts = cluster.deptIds.map(id => DEPARTAMENTOS.find(d => d.id === id)!).filter(Boolean);
  const activeCount = depts.filter(d => d.status === 'activo').length;

  return (
    <div style={{
      borderRadius: 18,
      border: `1.5px solid ${cluster.colorBorder}`,
      overflow: 'hidden',
      boxShadow: open
        ? `0 8px 32px ${cluster.color}80, 0 2px 8px rgba(0,0,0,0.04)`
        : '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.4s ease',
    }}>
      {/* ── Header / Toggle ── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          background: cluster.color,
          padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}
      >
        {/* Etapa badge */}
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: `${cluster.colorAccent}20`, border: `1.5px solid ${cluster.colorAccent}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 12, fontWeight: 900, color: cluster.colorAccent }}>
            {cluster.etapa}
          </span>
        </div>

        {/* Titles */}
        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: cluster.colorText, letterSpacing: '-0.2px' }}>
              ETAPA {cluster.etapa} — {cluster.titulo}
            </span>
            {/* active count badge */}
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
              background: `${cluster.colorAccent}18`, color: cluster.colorAccent,
              border: `1px solid ${cluster.colorAccent}30`,
            }}>
              {activeCount}/{depts.length} ACTIVOS
            </span>
          </div>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: cluster.colorText, opacity: 0.65, fontWeight: 500 }}>
            {cluster.subtitulo}
          </p>
        </div>

        {/* Chevron */}
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: `${cluster.colorAccent}15`, border: `1px solid ${cluster.colorAccent}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.35s cubic-bezier(.22,1,.36,1)',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        }}>
          <ChevRight size={14} color={cluster.colorAccent} />
        </div>
      </button>

      {/* ── Dept tiles grid ── */}
      {open && (
        <div style={{
          background: `${cluster.color}50`,
          padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 12,
          animation: 'cc-emerge2 0.28s ease',
        }}>
          {depts.map(dept => (
            <DeptTile key={dept.id} dept={dept} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Sección principal ─────────────────────────────────── */
export const ComandoCentral: React.FC = () => {
  const nav = useNav();
  const brainRef = useRef<BrainHandle>(null);
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
        @keyframes cc-emerge2 { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .cc-arena {
          display: grid;
          grid-template-columns: 280px 1fr 280px;
          gap: 16px;
          align-items: start;
        }
        .cc-nucleus {
          position: relative; height: 640px;
          background: radial-gradient(circle at 50% 46%, rgba(82,183,136,0.22) 0%, rgba(82,183,136,0.07) 45%, transparent 72%);
          border-radius: 20px;
        }
        .cc-brain { position: absolute; inset: 0; border-radius: 20px; overflow: hidden; }
        .cc-col-side { display: flex; flex-direction: column; gap: 10px; }

        @media (max-width: 900px) {
          .cc-arena { grid-template-columns: 1fr; }
          .cc-nucleus { height: 360px; order: -1; }
        }
      `}</style>

      {/* ── Cabecera ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 13,
          background: colores.gradientePrimario,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 20px ${colores.primario}40`,
        }}>
          <Atom size={24} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: colores.textoClaro, letterSpacing: '-0.6px' }}>
            Comando Central
          </h1>
          <p style={{ margin: '3px 0 0', fontSize: 13.5, color: colores.textoOscuro }}>
            Núcleo de inteligencia MAYIA — 14 departamentos · 5 etapas comerciales
          </p>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '8px 13px', borderRadius: 20,
          background: '#fff', border: `1px solid ${colores.acento}40`,
          boxShadow: colores.sombra,
        }}>
          <span style={{ position: 'relative', width: 8, height: 8 }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: colores.acento }} />
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: colores.acento, animation: 'cc-ping2 1.8s ease-in-out infinite' }} />
          </span>
          <span style={{ fontSize: 11.5, fontWeight: 800, color: colores.secundario, letterSpacing: '0.04em' }}>NÚCLEO ACTIVO</span>
        </div>
      </div>

      {/* ── Layout 3 columnas ── */}
      <div className="cc-arena">

        {/* COLUMNA IZQUIERDA — Cerebro · Essentials · Operación */}
        <div className="cc-col-side">
          {CLUSTERS.slice(0, 3).map((cluster, i) => (
            <ClusterAccordion key={cluster.etapa} cluster={cluster} defaultOpen={i === 0} />
          ))}
        </div>

        {/* COLUMNA CENTRO — Núcleo 3D MAYIA */}
        <div className="cc-nucleus">
          <div className="cc-brain">
            <BrainCanvas ref={brainRef} onPulse={advance} />
          </div>

          {/* HUD insight */}
          <div key={idx} style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 16,
            width: 'min(360px, calc(100% - 24px))', animation: 'cc-emerge2 0.4s ease',
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
            border: `1px solid ${colores.acento}40`, borderRadius: 999,
            padding: '8px 10px 8px 12px',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: colores.sombraMedia, zIndex: 10,
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
              background: colores.gradienteAcento,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={13} color="#fff" />
            </div>
            <p style={{
              margin: 0, flex: 1, minWidth: 0, fontSize: 11.5, color: colores.textoMedio, lineHeight: 1.35,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              <span style={{ fontWeight: 800, color: colores.secundario }}>MAYIA · </span>{insight.texto}
            </p>
            <button onClick={() => nav(insight.seccion)} title={`Ir a ${insight.label}`} style={{
              flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
              border: 'none', cursor: 'pointer',
              background: colores.secundario, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Hint label top */}
          <div style={{ position: 'absolute', top: 10, left: 0, right: 0, textAlign: 'center', pointerEvents: 'none', zIndex: 5 }}>
            <span style={{
              fontSize: 11, color: colores.textoOscuro,
              background: 'rgba(255,255,255,0.78)', padding: '4px 12px',
              borderRadius: 20, border: `1px solid ${colores.borde}`,
            }}>
              Toca el núcleo — gira y te da la siguiente lectura
            </span>
          </div>
        </div>

        {/* COLUMNA DERECHA — Agro Bio Robotics · Ventas */}
        <div className="cc-col-side">
          {CLUSTERS.slice(3).map((cluster) => (
            <ClusterAccordion key={cluster.etapa} cluster={cluster} defaultOpen={false} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default ComandoCentral;

