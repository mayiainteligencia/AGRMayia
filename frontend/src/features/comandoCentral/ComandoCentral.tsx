import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Atom, Sparkles, ArrowRight,
  Cpu, FlaskConical, Sprout, Droplets, Bug, Bell,
  BarChart3, Package, Truck, DollarSign, Globe,
  HeartHandshake, GraduationCap, Brain,
  Check, Zap, Lock, ChevronRight as ChevRight,
  Eye, EyeOff,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { brandingConfig } from '../../config/branding';
import { useNav } from '../../config/navContext';
import { BrainCanvas, type BrainHandle } from './BrainCanvas';

const { colores } = brandingConfig;


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
  precio?: string;
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
  { id:1,  nombre:'Cerebro Tecnológico',                    descripcion:'Base obligatoria de la plataforma. Usuarios, seguridad, APIs, motor de alertas, IA y arquitectura cloud.',                     icon:Cpu,            status:'activo',       paquete:1, color:'#52B788', subModulos:['Comando Central','Control de Decisiones','Panel Principal','Ciberseguridad','NOC','Monitoreo App','Reglas Operativas'], navTarget:'panel-principal', precio:'$5,264,600 MXN' },
  { id:2,  nombre:'Laboratorio e Inteligencia Agronómica',  descripcion:'Análisis foliar, agua, biometría, calidad de fruto, Brix, blush y relación fenológica.',                                      icon:FlaskConical,   status:'activo',       paquete:2, color:'#3B82F6', subModulos:['Panel Laboratorio','Análisis de Alimentos','Suelo y Aguas','Microbiología','Informes y Certificados','Análisis Visual'], navTarget:'panel-laboratorio', precio:'$4,237,200 MXN' },
  { id:3,  nombre:'Campo y Monitoreo Agrícola',             descripcion:'Registro de recorridos, muestreo por lote, fenología, incidencias y evidencia fotográfica.',                                  icon:Sprout,         status:'disponible',   paquete:2, color:'#10B981', subModulos:['Cosecha y Siembra','Campos / Ranchos','Plagas y Enfermedades','Listas de Preparación'], navTarget:'cosecha-siembra', precio:'Se cotiza por separado' },
  { id:4,  nombre:'Riego, Nutrición y Variables Críticas',  descripcion:'pH, EC/PPM, humedad, VPD, PPFD, DLI, horas de frío, programa de nutrición.',                                                 icon:Droplets,       status:'activo',       paquete:2, color:'#06B6D4', subModulos:['Medición de Agua','Instrumentos Ambientales','Soil-Bio-Vision™','Calculadora de Fertilizantes'], navTarget:'medicion-agua', precio:'$4,923,600 MXN' },
  { id:5,  nombre:'Control Biológico, Plagas y Enfermedades',descripcion:'Monitoreo preventivo y correctivo de agentes biológicos con protocolos y evidencia.',                                       icon:Bug,            status:'disponible',   paquete:2, color:'#F59E0B', subModulos:['Bio-Acoustic Sentinel™','Plagas y Enfermedades','Protocolos Preventivos','Protocolos Correctivos'], navTarget:'bio-acoustic-sentinel', precio:'Se cotiza por separado' },
  { id:6,  nombre:'Alertas e Inteligencia Operativa',       descripcion:'Alertas informativas, preventivas, críticas y ejecutivas de toda la operación.',                                             icon:Bell,           status:'activo',       paquete:1, color:'#EF4444', subModulos:['Reglas Operativas','Alertas del Sistema','Alertas Meteorológicas','Motor de Alertas'], navTarget:'reglas-operativas', precio:'$2,118,600 MXN' },
  { id:7,  nombre:'Cosecha y Predicción de Producción',     descripcion:'Estimación de volumen, ventana de corte, rendimiento por planta y programación.',                                           icon:BarChart3,      status:'activo',       paquete:3, color:'#8B5CF6', subModulos:['Motor de Probabilidad™','Planificación Integral','Calendario de Siembra','Predicción IA'], navTarget:'motor-probabilidad', precio:'$2,801,700 MXN' },
  { id:8,  nombre:'Empaque, Calidad y Trazabilidad',        descripcion:'Recepción de fruta, clasificación, empaque, trazabilidad, certificaciones.',                                                 icon:Package,        status:'activo',       paquete:3, color:'#EC4899', subModulos:['Cooler y Empaque','Calidad','Trazabilidad','Certificaciones'], navTarget:'cooler-empaque', precio:'$2,801,700 MXN' },
  { id:9,  nombre:'Logística, Inventarios y CEDIS',         descripcion:'Inventarios, insumos, almacén, CEDIS, embarques, rutas y cadena fría.',                                                     icon:Truck,          status:'activo',       paquete:4, color:'#F97316', subModulos:['CEDIS','Inventario','Logística y Envíos','Pedidos','Proveedores'], navTarget:'cedis', precio:'$3,361,600 MXN' },
  { id:10, nombre:'Ventas, Finanzas y Precios Predictivos', descripcion:'Precios históricos, proyectados, órdenes de compra, márgenes y rentabilidad.',                                              icon:DollarSign,     status:'activo',       paquete:5, color:'#14B8A6', subModulos:['Analítica y Reportes','Gastos Operativos','Clientes','Precios Predictivos'], navTarget:'analitica-reportes', precio:'$3,906,100 MXN' },
  { id:11, nombre:'Portal Clientes Internacionales',        descripcion:'Acceso B2B para compradores de USA y Canadá. Disponibilidad, precios, órdenes.',                                           icon:Globe,          status:'proximamente', paquete:6, color:'#6366F1', subModulos:['Portal B2B','Disponibilidad de Cosecha','Órdenes de Compra','Trazabilidad','Documentación'], navTarget:'portal-clientes-b2b', precio:'$3,361,600 MXN' },
  { id:12, nombre:'Cooperativas y Pequeños Productores',    descripcion:'Registro de productores, capacitación, certificaciones, financiamiento.',                                                   icon:HeartHandshake, status:'activo',       paquete:7, color:'#D946EF', subModulos:['Agricultores Menores','Certificaciones','Financiamiento','Oportunidades Comerciales'], navTarget:'agricultores-menores', precio:'$2,801,700 MXN' },
  { id:13, nombre:'Capacitación y Adopción',                descripcion:'Cursos, manuales, certificaciones internas, rutas de aprendizaje por rol.',                                                 icon:GraduationCap,  status:'proximamente', paquete:7, color:'#0EA5E9', subModulos:['Academia','Cursos por Rol','Certificaciones Internas','Biblioteca Agrícola'], navTarget:'academia-capacitacion', precio:'$495,000 MXN' },
  { id:14, nombre:'Inteligencia Artificial y Agentes',      descripcion:'Agentes especializados: agronómico, riego, laboratorio, plagas, cosecha, comercial.',                                      icon:Brain,          status:'activo',       paquete:8, color:'#A855F7', subModulos:['BRAIN™ Central','Agente Agronómico','Agente de Riego','Agente Comercial','Inteligencia Etapa 2'], navTarget:'inteligencia-etapa-2', precio:'Incluido en Cerebro' },
];

/* ── 5 CLUSTERS COMERCIALES CON PRECIOS ACTUALIZADOS (+10%) ────── */
interface Cluster {
  etapa: number;
  titulo: string;
  subtitulo: string;
  color: string;
  colorBorder: string;
  colorText: string;
  colorAccent: string;
  deptIds: number[];
  precio: string;
  precioIva: string;
  isCustomQuote?: boolean;
}

const CLUSTERS: Cluster[] = [
  {
    etapa: 1,
    titulo: 'CONSTRUCCIÓN CEREBRO',
    subtitulo: 'Módulo base obligatorio — plataforma, seguridad, IA y aprendizaje',
    color: '#D6EFE4',
    colorBorder: '#A8D5BA',
    colorText: '#1A4731',
    colorAccent: '#2D6A4F',
    deptIds: [1, 2, 6, 13, 14],
    precio: '$12,115,400',
    precioIva: 'Precios en MXN más IVA',
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
    precio: '$7,725,300',
    precioIva: 'Precios en MXN más IVA',
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
    precio: '$6,163,300',
    precioIva: 'Precios en MXN más IVA',
  },
  {
    etapa: 4,
    titulo: 'IOT CAMERAS ROBOTICS',
    subtitulo: 'Campo, monitoreo, IoT, cámaras, drones y control biológico',
    color: '#FAE5D4',
    colorBorder: '#E8C4A4',
    colorText: '#4A2010',
    colorAccent: '#C0601A',
    deptIds: [3, 5],
    precio: 'Se cotiza por separado',
    precioIva: 'Pendiente cotización robótica',
    isCustomQuote: true,
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
    precio: '$10,069,400',
    precioIva: 'Precios en MXN más IVA',
  },
];

/* ── DeptTile — tarjeta compacta de departamento (expandible) ───── */
const DeptTile: React.FC<{ dept: Dept; showPrice?: boolean }> = ({ dept, showPrice }) => {
  const nav = useNav();
  const sc = STATUS_CFG[dept.status];
  const DeptIcon = dept.icon;
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className={`cc-tile${isExpanded ? ' is-open' : ''}`} style={{ ['--dc' as string]: dept.color }}>
      <button className="cc-tile-head" onClick={() => setIsExpanded(v => !v)} aria-expanded={isExpanded}>
        <span className="cc-tile-icon">
          <DeptIcon size={15} color={dept.color} strokeWidth={2} />
        </span>
        <span className="cc-tile-text">
          <span className="cc-tile-dep">DEP {String(dept.id).padStart(2, '0')} · {PAQUETES_NAMES[dept.paquete]}</span>
          <span className="cc-tile-name">{dept.nombre}</span>
        </span>
        {showPrice && dept.precio && (
          <span className={`cc-dept-price-tag${dept.precio === 'Se cotiza por separado' ? ' is-quote' : ''}`}>
            {dept.precio}
          </span>
        )}
        <span className="cc-tile-dot" title={sc.label} style={{ background: sc.color, boxShadow: `0 0 6px ${sc.color}` }} />
        <ChevRight className="cc-tile-chev" size={13} />
      </button>

      {isExpanded && (
        <div className="cc-tile-body">
          <p>{dept.descripcion}</p>
          {showPrice && dept.precio && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(0,0,0,0.03)', borderRadius: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#4B5563' }}>Inversión módulo:</span>
              <span style={{ fontSize: 12.5, fontWeight: 900, color: dept.color }}>{dept.precio}</span>
            </div>
          )}
          <div className="cc-tile-chips">
            {dept.subModulos.map(s => <span key={s}>{s}</span>)}
          </div>
          <button className="cc-tile-go" onClick={() => nav(dept.navTarget)}>
            <span>Ir al módulo</span>
            <ArrowRight size={12} color="#fff" />
          </button>
        </div>
      )}
    </div>
  );
};

/* ── ClusterAccordion — tarjeta de etapa dinámica con badge +10% y precio toggle ───── */
const ClusterAccordion: React.FC<{
  cluster: Cluster;
  open: boolean;
  onToggle: () => void;
  index?: number;
  showAllPrices: boolean;
}> = ({ cluster, open, onToggle, index = 0, showAllPrices }) => {
  const depts = cluster.deptIds.map(id => DEPARTAMENTOS.find(d => d.id === id)!).filter(Boolean);
  const activeCount = depts.filter(d => d.status === 'activo').length;
  const [cardPriceVisible, setCardPriceVisible] = useState(false);
  const isPriceShown = showAllPrices || cardPriceVisible;

  const vars = {
    '--accent': cluster.colorAccent,
    '--tint': cluster.color,
    '--bd': cluster.colorBorder,
    '--tx': cluster.colorText,
    '--delay': `${index * 90}ms`,
  } as React.CSSProperties;

  return (
    <div className={`cc-cluster${open ? ' is-open' : ''}`} style={vars}>
      <button
        className="cc-cluster-head"
        data-accent={cluster.colorAccent}
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="cc-watermark" aria-hidden>{cluster.etapa}</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 13, position: 'relative' }}>
          {/* Badge de etapa con anillo giratorio */}
          <div className="cc-badge">
            <span className="cc-badge-ring" />
            <span className="cc-badge-in">{cluster.etapa}</span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="cc-etapa-row">
              <span className="cc-etapa-label">ETAPA {cluster.etapa}</span>
              <span className="cc-pill">
                <span className="cc-pill-dot" />
                {activeCount}/{depts.length} ACTIVOS
              </span>
            </div>
            <div className="cc-title">{cluster.titulo}</div>
          </div>

          <div className="cc-chev">
            <ChevRight size={14} color={cluster.colorAccent} />
          </div>
        </div>

        <p className="cc-sub">{cluster.subtitulo}</p>

        {/* ── Fila de Precio (oculto por defecto con botón "Ver precio") ── */}
        <div className="cc-price-container" onClick={e => e.stopPropagation()}>
          {isPriceShown ? (
            <div className="cc-price-display">
              <div className="cc-price-main">
                <span className={`cc-price-val${cluster.isCustomQuote ? ' is-quote' : ''}`}>
                  {cluster.precio}
                </span>
                <span className="cc-price-tax">{cluster.precioIva}</span>
              </div>
              <button
                type="button"
                className="cc-price-action-btn"
                onClick={() => setCardPriceVisible(false)}
                title="Ocultar precio de esta etapa"
              >
                <EyeOff size={11} />
                <span>Ocultar</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="cc-see-price-btn"
              onClick={() => setCardPriceVisible(true)}
              title="Ver precio de esta etapa"
            >
              <Eye size={12} />
              <span>Ver precio</span>
            </button>
          )}
        </div>

        {/* Barra de progreso segmentada + chips de departamentos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
          <div className="cc-segs">
            {depts.map(d => (
              <span key={d.id} className={`cc-seg cc-seg-${d.status}`} title={`${d.nombre} · ${STATUS_CFG[d.status].label}`} />
            ))}
          </div>
          <div className="cc-chips">
            {depts.map((d, i) => {
              const I = d.icon;
              return (
                <span
                  key={d.id}
                  className="cc-chip"
                  title={d.nombre}
                  style={{ background: `${d.color}1c`, border: `1px solid ${d.color}40`, ['--i' as string]: `${i * 40}ms` }}
                >
                  <I size={12} color={d.color} strokeWidth={2.2} />
                </span>
              );
            })}
          </div>
        </div>
      </button>

      {open && (
        <div className="cc-cluster-body">
          {depts.map(dept => (
            <DeptTile key={dept.id} dept={dept} showPrice={isPriceShown} />
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
  // Solo una etapa abierta a la vez: al abrir una, se cierran las demás.
  const [openEtapa, setOpenEtapa] = useState<number | null>(null);
  const toggleEtapa = (e: number) => setOpenEtapa(cur => (cur === e ? null : e));

  // Control comercial de precios: ocultos por defecto
  const [showTotal, setShowTotal] = useState(false);
  const [showAllPrices, setShowAllPrices] = useState(false);

  const advance = () => { setIdx(i => (i + 1) % INSIGHTS.length); brainRef.current?.boost(); };

  /* ── Enlaces etapa → núcleo (SVG liviano, medido sobre el DOM) ── */
  const arenaRef = useRef<HTMLDivElement>(null);
  const nucleusRef = useRef<HTMLDivElement>(null);
  const [links, setLinks] = useState<{ id: number; d: string; color: string; x: number; y: number }[]>([]);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  const recompute = useCallback(() => {
    const arena = arenaRef.current, nuc = nucleusRef.current;
    if (!arena || !nuc) return;
    if (window.innerWidth <= 900) { setLinks(prev => (prev.length ? [] : prev)); return; }
    const ar = arena.getBoundingClientRect();
    const nr = nuc.getBoundingClientRect();
    const cx = nr.left + nr.width / 2 - ar.left;
    const cy = nr.top + nr.height / 2 - ar.top;
    const out: { id: number; d: string; color: string; x: number; y: number }[] = [];
    arena.querySelectorAll<HTMLElement>('.cc-cluster-head').forEach((el, i) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;
      const isLeft = r.left + r.width / 2 < nr.left + nr.width / 2;
      const x = (isLeft ? r.right : r.left) - ar.left;
      const y = r.top + r.height / 2 - ar.top;
      const cpx = (x + cx) / 2;
      const cpy = cy + (y - cy) * 0.15;
      out.push({
        id: i,
        d: `M${x.toFixed(1)},${y.toFixed(1)} Q${cpx.toFixed(1)},${cpy.toFixed(1)} ${cx.toFixed(1)},${cy.toFixed(1)}`,
        color: el.dataset.accent || '#2D6A4F',
        x, y,
      });
    });
    setLinks(prev => (JSON.stringify(prev) === JSON.stringify(out) ? prev : out));
    setDims(prev => (prev.w === ar.width && prev.h === ar.height ? prev : { w: ar.width, h: ar.height }));
  }, []);

  useLayoutEffect(() => {
    const raf = requestAnimationFrame(recompute);
    const ro = new ResizeObserver(recompute);
    if (arenaRef.current) {
      ro.observe(arenaRef.current);
      arenaRef.current.querySelectorAll('.cc-col-side').forEach(c => ro.observe(c));
    }
    window.addEventListener('resize', recompute);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('resize', recompute); };
  }, [recompute]);

  // Re-medir cuando una etapa se abre/cierra (el layout cambia de altura)
  useEffect(() => {
    const t1 = setTimeout(recompute, 60);
    const t2 = setTimeout(recompute, 450);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [openEtapa, recompute]);

  useEffect(() => {
    const t = setInterval(advance, 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <style>{`
        @keyframes cc-ping2 { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.7); opacity: 0.3; } }
        @keyframes cc-emerge2 { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @keyframes cc-flow { from { background-position: 0% 0; } to { background-position: 200% 0; } }
        @keyframes cc-spin { to { transform: rotate(360deg); } }
        @keyframes cc-glow { 0%,100% { opacity: .75; } 50% { opacity: 1; } }

        @keyframes cc-dash { to { stroke-dashoffset: -18; } }

        .cc-arena {
          position: relative;
          display: grid;
          grid-template-columns: minmax(260px, 300px) minmax(0, 1fr) minmax(260px, 300px);
          gap: 16px;
          align-items: center;
        }

        /* Enlaces etapa → núcleo */
        .cc-links { position: absolute; left: 0; top: 0; pointer-events: none; overflow: visible; }
        .cc-link-flow { stroke-dasharray: 5 13; animation: cc-dash 1.1s linear infinite; }
        @media (max-width: 900px) { .cc-links { display: none; } }
        @media (prefers-reduced-motion: reduce) { .cc-link-flow { animation: none; } .cc-pk { display: none; } }

        /* Núcleo sin marco: comparte el fondo de la página */
        .cc-nucleus { position: relative; height: 560px; }
        .cc-brain { position: absolute; top: 0; bottom: 0; left: 0; right: 0; overflow: visible; z-index: 1; }
        .cc-col-side { display: flex; flex-direction: column; gap: 20px; min-width: 0; }

        /* ── Tarjetas de etapa ── */
        .cc-cluster {
          position: relative; border-radius: 18px; overflow: hidden;
          border: 1.5px solid var(--bd);
          background: linear-gradient(135deg, var(--tint) 0%, #ffffff 135%);
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease;
          animation: cc-emerge2 .55s cubic-bezier(.22,1,.36,1) backwards;
          animation-delay: var(--delay);
        }
        .cc-cluster:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 34px color-mix(in srgb, var(--accent) 30%, transparent), 0 2px 8px rgba(0,0,0,0.05);
        }
        .cc-cluster.is-open {
          box-shadow: 0 10px 34px color-mix(in srgb, var(--accent) 28%, transparent);
        }
        .cc-cluster::before {
          content: ''; position: absolute; left: 0; right: 0; top: 0; height: 3px; z-index: 2;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          background-size: 200% 100%;
          animation: cc-flow 3.2s linear infinite;
        }

        /* ── Badge +10% estilo anuncio Netflix ── */
        .cc-netflix-badge {
          position: absolute;
          top: 10px;
          right: 12px;
          z-index: 8;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          background: linear-gradient(135deg, #E50914 0%, #990000 100%);
          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.04em;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(229, 9, 20, 0.42), 0 0 0 1px rgba(255, 255, 255, 0.3) inset;
          transform: rotate(-1.5deg);
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
          pointer-events: auto;
          cursor: default;
          user-select: none;
        }
        .cc-netflix-badge:hover {
          transform: scale(1.1) rotate(0deg);
          box-shadow: 0 6px 18px rgba(229, 9, 20, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
        }

        .cc-cluster-head {
          position: relative; width: 100%; border: none; background: transparent; cursor: pointer;
          font-family: inherit; text-align: left; overflow: hidden;
          padding: 16px 16px 14px; display: flex; flex-direction: column; gap: 10px;
        }
        .cc-cluster-head::after {
          content: ''; position: absolute; top: 0; bottom: 0; left: -60%; width: 40%; pointer-events: none;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.6), transparent);
          transform: skewX(-18deg); transition: left .8s ease;
        }
        .cc-cluster:hover .cc-cluster-head::after { left: 130%; }

        .cc-watermark {
          position: absolute; right: 8px; top: -18px; font-size: 100px; font-weight: 900; line-height: 1;
          color: var(--accent); opacity: .08; pointer-events: none;
          transition: transform .6s cubic-bezier(.22,1,.36,1), opacity .3s;
        }
        .cc-cluster:hover .cc-watermark { opacity: .16; transform: scale(1.1) rotate(-5deg); }

        .cc-badge { position: relative; width: 42px; height: 42px; flex-shrink: 0; }
        .cc-badge-ring {
          position: absolute; inset: 0; border-radius: 13px;
          background: conic-gradient(from 0deg, var(--accent), transparent 55%, var(--accent));
          animation: cc-spin 5s linear infinite; opacity: .85;
        }
        .cc-badge-in {
          position: absolute; inset: 2px; border-radius: 11px; background: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 900; color: var(--accent);
        }
        .cc-etapa-label { font-size: 9.5px; font-weight: 800; letter-spacing: .16em; color: var(--accent); opacity: .85; }
        .cc-etapa-row { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; margin-bottom: 3px; }
        .cc-title { font-size: 16px; font-weight: 900; color: var(--tx); letter-spacing: -.3px; line-height: 1.15; overflow-wrap: anywhere; }
        .cc-sub { margin: 0; font-size: 11px; line-height: 1.4; color: var(--tx); opacity: .66; font-weight: 500; position: relative; }

        /* ── Fila de precios por etapa ── */
        .cc-price-container {
          margin: 2px 0 0;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 5;
        }
        .cc-see-price-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 7px;
          border: 1px dashed color-mix(in srgb, var(--accent) 50%, #9CA3AF);
          background: rgba(255, 255, 255, 0.78);
          color: var(--accent);
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .cc-see-price-btn:hover {
          background: #ffffff;
          border-style: solid;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px color-mix(in srgb, var(--accent) 25%, transparent);
        }
        .cc-price-display {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          width: 100%;
          gap: 8px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        }
        .cc-price-main {
          display: flex;
          align-items: baseline;
          gap: 6px;
          flex-wrap: wrap;
        }
        .cc-price-val {
          font-size: 16px;
          font-weight: 900;
          color: #111827;
          letter-spacing: -0.4px;
        }
        .cc-price-val.is-quote {
          font-size: 13px;
          color: #B45309;
          font-weight: 800;
        }
        .cc-price-tax {
          font-size: 9.5px;
          font-weight: 600;
          color: #6B7280;
        }
        .cc-price-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 3px 6px;
          border-radius: 5px;
          border: none;
          background: #F3F4F6;
          color: #4B5563;
          font-size: 9.5px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
        }
        .cc-price-action-btn:hover {
          background: #E5E7EB;
          color: #111827;
        }

        /* ── Precio individual por departamento en DeptTile ── */
        .cc-dept-price-tag {
          display: inline-flex;
          align-items: center;
          padding: 2px 7px;
          border-radius: 5px;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          color: #065F46;
          font-size: 10.5px;
          font-weight: 800;
          margin-left: auto;
          white-space: nowrap;
        }
        .cc-dept-price-tag.is-quote {
          background: #FEF3C7;
          border-color: #FDE68A;
          color: #92400E;
          font-size: 9.5px;
        }

        .cc-pill {
          display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0;
          font-size: 9px; font-weight: 800; letter-spacing: .04em; padding: 3px 8px; border-radius: 20px;
          color: var(--accent); background: rgba(255,255,255,.7);
          border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
        }
        .cc-pill-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: cc-ping2 1.8s ease-in-out infinite; }

        .cc-chev {
          width: 28px; height: 28px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.65); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
          transition: transform .35s cubic-bezier(.22,1,.36,1), background .2s;
        }
        .cc-cluster.is-open .cc-chev { transform: rotate(90deg); background: #fff; }

        .cc-segs { display: flex; gap: 4px; flex: 1; min-width: 0; }
        .cc-seg { flex: 1; height: 6px; border-radius: 4px; transition: transform .3s; }
        .cc-seg-activo { background: var(--accent); animation: cc-glow 2.4s ease-in-out infinite; box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 60%, transparent); }
        .cc-seg-disponible { background: color-mix(in srgb, var(--accent) 38%, transparent); }
        .cc-seg-proximamente { background: transparent; border: 1px dashed color-mix(in srgb, var(--accent) 50%, transparent); }
        .cc-cluster:hover .cc-seg { transform: scaleY(1.5); }

        .cc-chips { display: flex; gap: 4px; flex-shrink: 0; }
        .cc-chip {
          width: 24px; height: 24px; border-radius: 7px; display: flex; align-items: center; justify-content: center;
          transition: transform .3s cubic-bezier(.22,1,.36,1); transition-delay: var(--i);
        }
        .cc-cluster:hover .cc-chip { transform: translateY(-3px); }

        .cc-cluster-body {
          background: color-mix(in srgb, var(--tint) 45%, #fff);
          border-top: 1px solid color-mix(in srgb, var(--accent) 18%, transparent);
          padding: 12px; display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px;
          animation: cc-emerge2 .28s ease;
        }

        /* ── Tarjetas de departamento ── */
        .cc-tile {
          position: relative; min-width: 0; overflow: hidden; border-radius: 12px;
          background: rgba(255,255,255,.85);
          border: 1px solid color-mix(in srgb, var(--dc) 22%, #e5e7eb);
          border-left: 3px solid var(--dc);
          transition: box-shadow .25s ease, background .25s ease;
        }
        .cc-tile:hover { box-shadow: 0 4px 14px color-mix(in srgb, var(--dc) 22%, transparent); }
        .cc-tile.is-open { background: #fff; box-shadow: 0 6px 18px color-mix(in srgb, var(--dc) 22%, transparent); }
        .cc-tile-head {
          width: 100%; min-width: 0; display: flex; align-items: center; gap: 9px; padding: 9px 10px;
          background: transparent; border: none; cursor: pointer; font-family: inherit; text-align: left;
        }
        .cc-tile-icon {
          width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: color-mix(in srgb, var(--dc) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--dc) 28%, transparent);
        }
        .cc-tile-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
        .cc-tile-dep { font-size: 8.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #9CA3AF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cc-tile-name { font-size: 12.5px; font-weight: 800; color: #111827; line-height: 1.2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .cc-tile-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .cc-tile-chev { flex-shrink: 0; color: #9CA3AF; transition: transform .25s ease; }
        .cc-tile.is-open .cc-tile-chev { transform: rotate(90deg); }
        .cc-tile-body { padding: 2px 12px 12px; display: flex; flex-direction: column; gap: 9px; animation: cc-emerge2 .22s ease; }
        .cc-tile-body p { margin: 0; font-size: 11.5px; line-height: 1.5; color: #374151; overflow-wrap: anywhere; }
        .cc-tile-chips { display: flex; flex-wrap: wrap; gap: 4px; }
        .cc-tile-chips span {
          max-width: 100%; overflow-wrap: anywhere; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 600;
          background: color-mix(in srgb, var(--dc) 10%, #fff); color: color-mix(in srgb, var(--dc) 80%, #000);
          border: 1px solid color-mix(in srgb, var(--dc) 25%, transparent);
        }
        .cc-tile-go {
          width: 100%; padding: 8px 12px; border: none; border-radius: 9px; cursor: pointer; font-family: inherit;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          background: var(--dc); color: #fff; font-size: 11px; font-weight: 700;
          box-shadow: 0 3px 10px color-mix(in srgb, var(--dc) 35%, transparent);
          transition: filter .15s, transform .15s;
        }
        .cc-tile-go:hover { filter: brightness(1.08); transform: translateY(-1px); }

        /* ── Botones y tarjeta de Total bajo Núcleo Activo ── */
        .cc-total-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 13px;
          border-radius: 20px;
          border: 1px solid ${colores.acento}50;
          background: #ffffff;
          color: ${colores.secundario};
          font-size: 11.5px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: ${colores.sombra};
          transition: all 0.2s ease;
        }
        .cc-total-btn:hover {
          background: ${colores.secundario};
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px ${colores.primario}30;
        }
        .cc-total-btn.secondary {
          border-color: #E5E7EB;
          color: #4B5563;
        }
        .cc-total-btn.secondary:hover {
          background: #374151;
          color: #ffffff;
        }
        .cc-total-btn.secondary.active {
          background: #111827;
          color: #ffffff;
          border-color: #111827;
        }
        .cc-total-card {
          background: #ffffff;
          border-radius: 14px;
          border: 1.5px solid ${colores.acento}40;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          animation: cc-emerge2 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          max-width: 380px;
        }
        .cc-total-sum-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid #F3F4F6;
          padding-bottom: 6px;
        }
        .cc-total-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #6B7280;
        }
        .cc-total-num {
          font-size: 20px;
          font-weight: 900;
          color: #111827;
          letter-spacing: -0.5px;
        }
        .cc-total-currency {
          font-size: 11px;
          font-weight: 700;
          color: ${colores.secundario};
        }
        .cc-total-subtext {
          font-size: 11px;
          color: #4B5563;
          font-weight: 600;
        }
        .cc-total-cloud-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 3px;
          padding: 6px 10px;
          background: #F0FDF4;
          border-radius: 8px;
          border: 1px solid #BBF7D0;
        }
        .cc-total-cloud-text {
          font-size: 11px;
          font-weight: 700;
          color: #166534;
          letter-spacing: -0.1px;
        }
        .cc-total-robotics-alert {
          display: flex;
          flex-direction: column;
          gap: 3px;
          margin-top: 4px;
          padding: 7px 9px;
          background: #FFFBEB;
          border-radius: 8px;
          border: 1px solid #FDE68A;
          font-size: 10.5px;
          color: #92400E;
          line-height: 1.35;
        }
        .cc-total-robotics-badge {
          font-weight: 800;
          font-size: 9.5px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #B45309;
        }

        @media (prefers-reduced-motion: reduce) {
          .cc-cluster, .cc-cluster::before, .cc-badge-ring, .cc-seg-activo, .cc-pill-dot, .cc-nucleus::after { animation: none !important; }
        }

        @media (max-width: 900px) {
          .cc-arena { grid-template-columns: 1fr; }
          .cc-nucleus { height: 360px; order: -1; }
        }
      `}</style>

      {/* ── Cabecera ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 260 }}>
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
        </div>

        {/* ── Bloque Núcleo Activo + Total comercial ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '8px 14px', borderRadius: 20,
              background: '#fff', border: `1px solid ${colores.acento}40`,
              boxShadow: colores.sombra,
            }}>
              <span style={{ position: 'relative', width: 8, height: 8 }}>
                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: colores.acento }} />
                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: colores.acento, animation: 'cc-ping2 1.8s ease-in-out infinite' }} />
              </span>
              <span style={{ fontSize: 11.5, fontWeight: 800, color: colores.secundario, letterSpacing: '0.04em' }}>NÚCLEO ACTIVO</span>
            </div>

            <button
              type="button"
              className="cc-total-btn"
              onClick={() => setShowTotal(v => !v)}
              title={showTotal ? 'Ocultar resumen total' : 'Ver inversión total del proyecto'}
            >
              {showTotal ? <EyeOff size={13} /> : <Eye size={13} />}
              <span>{showTotal ? 'Ocultar total' : 'Ver total'}</span>
            </button>

            <button
              type="button"
              className={`cc-total-btn secondary ${showAllPrices ? 'active' : ''}`}
              onClick={() => setShowAllPrices(v => !v)}
              title={showAllPrices ? 'Ocultar precios de las etapas' : 'Ver precios en todas las etapas'}
            >
              <DollarSign size={13} />
              <span>{showAllPrices ? 'Ocultar precios' : 'Ver precios'}</span>
            </button>
          </div>

          {/* Tarjeta de Total desplegada abajo de Núcleo Activo */}
          {showTotal && (
            <div className="cc-total-card">
              <div className="cc-total-sum-row">
                <span className="cc-total-label">INVERSIÓN TOTAL ESTIMADA</span>
                <span className="cc-total-num">$36,073,400 <span className="cc-total-currency">MXN</span></span>
              </div>
              <div className="cc-total-subtext">
                + IVA (Cubre Etapas 1, 2, 3 y 5 completas)
              </div>
              <div className="cc-total-cloud-row">
                <span className="cc-total-cloud-text">+ $380,000 MXN mensuales por nube y GPU</span>
              </div>
              <div className="cc-total-robotics-alert">
                <span className="cc-total-robotics-badge">Etapa 4 (IoT & Robótica)</span>
                <span>Pendiente — Se cotiza por separado según volumen de sensores y robótica en campo.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Layout 3 columnas ── */}
      <div className="cc-arena" ref={arenaRef}>
        <svg className="cc-links" width={dims.w} height={dims.h} aria-hidden="true">
          {links.map(l => (
            <g key={l.id}>
              <path d={l.d} fill="none" stroke={l.color} strokeOpacity="0.40" strokeWidth="2" strokeLinecap="round" />
              <path d={l.d} className="cc-link-flow" fill="none" stroke={l.color} strokeOpacity="0.95" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx={l.x} cy={l.y} r="4.5" fill={l.color} />
              <circle cx={l.x} cy={l.y} r="9" fill="none" stroke={l.color} strokeOpacity="0.40" />
              {[0, 1, 2].map(k => (
                <circle key={k} className="cc-pk" r="4" fill={l.color} stroke="#fff" strokeWidth="1.3" opacity="0">
                  <animateMotion dur="2.8s" begin={`${-(k * 0.93 + l.id * 0.4).toFixed(2)}s`} repeatCount="indefinite" path={l.d} />
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.85;1" dur="2.8s" begin={`${-(k * 0.93 + l.id * 0.4).toFixed(2)}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
          ))}
        </svg>

        {/* COLUMNA IZQUIERDA — Cerebro · Essentials · Operación */}
        <div className="cc-col-side">
          {CLUSTERS.slice(0, 3).map((cluster) => (
            <ClusterAccordion
              key={cluster.etapa}
              cluster={cluster}
              open={openEtapa === cluster.etapa}
              onToggle={() => toggleEtapa(cluster.etapa)}
              index={cluster.etapa - 1}
              showAllPrices={showAllPrices}
            />
          ))}
        </div>

        {/* COLUMNA CENTRO — Núcleo 3D MAYIA */}
        <div className="cc-nucleus" ref={nucleusRef}>
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
            <ClusterAccordion
              key={cluster.etapa}
              cluster={cluster}
              open={openEtapa === cluster.etapa}
              onToggle={() => toggleEtapa(cluster.etapa)}
              index={cluster.etapa - 1}
              showAllPrices={showAllPrices}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default ComandoCentral;

