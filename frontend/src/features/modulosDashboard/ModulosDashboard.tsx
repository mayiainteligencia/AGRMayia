import React, { useState } from 'react';
import {
  Cpu, FlaskConical, Sprout, Droplets, Bug, Bell,
  BarChart3, Package, Truck, DollarSign, Globe,
  HeartHandshake, GraduationCap, Brain,
  ChevronRight, Sparkles, Lock, Check, Zap,
  Layers,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useNav } from '../../config/navContext';

/* ═══════════════════════════════════════════════════
   DEPARTAMENTOS COMERCIALES — 14 módulos
   ═══════════════════════════════════════════════════ */

type DeptStatus = 'activo' | 'disponible' | 'proximamente';

interface Departamento {
  id: number;
  nombre: string;
  descripcion: string;
  icon: React.ElementType;
  status: DeptStatus;
  paquete: number;
  color: string;
  subModulos: string[];
  navTarget?: string;           // id de navegación si quieres abrir un módulo
}

const DEPARTAMENTOS: Departamento[] = [
  {
    id: 1,
    nombre: 'Cerebro Tecnológico',
    descripcion: 'Base obligatoria de la plataforma. Usuarios, seguridad, APIs, motor de alertas, IA y arquitectura cloud.',
    icon: Cpu,
    status: 'activo',
    paquete: 1,
    color: '#52B788',
    subModulos: ['Comando Central', 'Control de Decisiones', 'Panel Principal', 'Ciberseguridad', 'NOC', 'Monitoreo App', 'Reglas Operativas'],
    navTarget: 'comando-central',
  },
  {
    id: 2,
    nombre: 'Laboratorio e Inteligencia Agronómica',
    descripcion: 'Análisis foliar, agua, biometría, calidad de fruto, Brix, blush y relación fenológica.',
    icon: FlaskConical,
    status: 'activo',
    paquete: 2,
    color: '#3B82F6',
    subModulos: ['Panel Laboratorio', 'Análisis de Alimentos', 'Suelo y Aguas', 'Microbiología', 'Informes y Certificados', 'Análisis Visual'],
    navTarget: 'panel-laboratorio',
  },
  {
    id: 3,
    nombre: 'Campo y Monitoreo Agrícola',
    descripcion: 'Registro de recorridos, muestreo por lote, fenología, incidencias y evidencia fotográfica.',
    icon: Sprout,
    status: 'disponible',
    paquete: 2,
    color: '#10B981',
    subModulos: ['Cosecha y Siembra', 'Campos / Ranchos', 'Plagas y Enfermedades', 'Listas de Preparación'],
    navTarget: 'cosecha-siembra',
  },
  {
    id: 4,
    nombre: 'Riego, Nutrición y Variables Críticas',
    descripcion: 'pH, EC/PPM, humedad, VPD, PPFD, DLI, horas de frío, programa de nutrición.',
    icon: Droplets,
    status: 'activo',
    paquete: 2,
    color: '#06B6D4',
    subModulos: ['Medición de Agua', 'Instrumentos Ambientales', 'Soil-Bio-Vision™', 'Calculadora de Fertilizantes'],
    navTarget: 'medicion-agua',
  },
  {
    id: 5,
    nombre: 'Control Biológico, Plagas y Enfermedades',
    descripcion: 'Monitoreo preventivo y correctivo de agentes biológicos con protocolos y evidencia.',
    icon: Bug,
    status: 'disponible',
    paquete: 2,
    color: '#F59E0B',
    subModulos: ['Bio-Acoustic Sentinel™', 'Plagas y Enfermedades', 'Protocolos Preventivos', 'Protocolos Correctivos'],
    navTarget: 'bio-acoustic-sentinel',
  },
  {
    id: 6,
    nombre: 'Alertas e Inteligencia Operativa',
    descripcion: 'Alertas informativas, preventivas, críticas y ejecutivas de toda la operación.',
    icon: Bell,
    status: 'activo',
    paquete: 1,
    color: '#EF4444',
    subModulos: ['Reglas Operativas', 'Alertas del Sistema', 'Alertas Meteorológicas', 'Motor de Alertas'],
    navTarget: 'reglas-operativas',
  },
  {
    id: 7,
    nombre: 'Cosecha y Predicción de Producción',
    descripcion: 'Estimación de volumen, ventana de corte, rendimiento por planta y programación.',
    icon: BarChart3,
    status: 'activo',
    paquete: 3,
    color: '#8B5CF6',
    subModulos: ['Motor de Probabilidad™', 'Planificación Integral', 'Calendario de Siembra', 'Predicción IA'],
    navTarget: 'motor-probabilidad',
  },
  {
    id: 8,
    nombre: 'Empaque, Calidad y Trazabilidad',
    descripcion: 'Recepción de fruta, clasificación, empaque, trazabilidad, certificaciones.',
    icon: Package,
    status: 'activo',
    paquete: 3,
    color: '#EC4899',
    subModulos: ['Cooler y Empaque', 'Calidad', 'Trazabilidad', 'Certificaciones'],
    navTarget: 'cooler-empaque',
  },
  {
    id: 9,
    nombre: 'Logística, Inventarios y CEDIS',
    descripcion: 'Inventarios, insumos, almacén, CEDIS, embarques, rutas y cadena fría.',
    icon: Truck,
    status: 'activo',
    paquete: 4,
    color: '#F97316',
    subModulos: ['CEDIS', 'Inventario', 'Logística y Envíos', 'Pedidos', 'Proveedores'],
    navTarget: 'cedis',
  },
  {
    id: 10,
    nombre: 'Ventas, Finanzas y Precios Predictivos',
    descripcion: 'Precios históricos, proyectados, órdenes de compra, márgenes y rentabilidad.',
    icon: DollarSign,
    status: 'activo',
    paquete: 5,
    color: '#14B8A6',
    subModulos: ['Analítica y Reportes', 'Gastos Operativos', 'Clientes', 'Precios Predictivos'],
    navTarget: 'analitica-reportes',
  },
  {
    id: 11,
    nombre: 'Portal Clientes Internacionales',
    descripcion: 'Acceso B2B para compradores de USA y Canadá. Disponibilidad, precios, órdenes.',
    icon: Globe,
    status: 'proximamente',
    paquete: 6,
    color: '#6366F1',
    subModulos: ['Portal B2B', 'Disponibilidad de Cosecha', 'Órdenes de Compra', 'Trazabilidad', 'Documentación'],
    navTarget: 'portal-clientes-b2b',
  },
  {
    id: 12,
    nombre: 'Cooperativas y Pequeños Productores',
    descripcion: 'Registro de productores, capacitación, certificaciones, financiamiento.',
    icon: HeartHandshake,
    status: 'activo',
    paquete: 7,
    color: '#D946EF',
    subModulos: ['Agricultores Menores', 'Certificaciones', 'Financiamiento', 'Oportunidades Comerciales'],
    navTarget: 'agricultores-menores',
  },
  {
    id: 13,
    nombre: 'Capacitación y Adopción',
    descripcion: 'Cursos, manuales, certificaciones internas, rutas de aprendizaje por rol.',
    icon: GraduationCap,
    status: 'proximamente',
    paquete: 7,
    color: '#0EA5E9',
    subModulos: ['Academia', 'Cursos por Rol', 'Certificaciones Internas', 'Biblioteca Agrícola'],
    navTarget: 'academia-capacitacion',
  },
  {
    id: 14,
    nombre: 'Inteligencia Artificial y Agentes',
    descripcion: 'Agentes especializados: agronómico, riego, laboratorio, plagas, cosecha, comercial.',
    icon: Brain,
    status: 'activo',
    paquete: 8,
    color: '#A855F7',
    subModulos: ['BRAIN™ Central', 'Agente Agronómico', 'Agente de Riego', 'Agente Comercial', 'Inteligencia Etapa 2'],
    navTarget: 'inteligencia-etapa-2',
  },
];

/* ═══════════════════════════════════════════════════
   PAQUETES COMERCIALES — 8 paquetes
   ═══════════════════════════════════════════════════ */

interface PaqueteComercial {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
  icon: React.ElementType;
}

const PAQUETES: PaqueteComercial[] = [
  { id: 1, nombre: 'Plataforma Base',       descripcion: 'Cerebro tecnológico + alertas + seguridad',   color: '#52B788', icon: Cpu },
  { id: 2, nombre: 'Producción Agrícola',   descripcion: 'Campo + Lab + Riego + Control Biológico',     color: '#10B981', icon: Sprout },
  { id: 3, nombre: 'Cosecha y Calidad',     descripcion: 'Predicción + empaque + trazabilidad',         color: '#8B5CF6', icon: Package },
  { id: 4, nombre: 'Operación y Logística', descripcion: 'Inventarios + CEDIS + embarques',             color: '#F97316', icon: Truck },
  { id: 5, nombre: 'Comercial y Finanzas',  descripcion: 'Ventas + precios + reportes financieros',     color: '#14B8A6', icon: DollarSign },
  { id: 6, nombre: 'Clientes Internacionales', descripcion: 'Portal B2B para compradores USA/Canadá',   color: '#6366F1', icon: Globe },
  { id: 7, nombre: 'Cooperativas y Productores', descripcion: 'Red agrícola + capacitación + academia',  color: '#D946EF', icon: HeartHandshake },
  { id: 8, nombre: 'IA Avanzada',           descripcion: 'Agentes especializados + analítica predictiva', color: '#A855F7', icon: Brain },
];

/* ═══════════════════════════════════════════════════
   5 CLUSTERS COMERCIALES
   ═══════════════════════════════════════════════════ */

interface Cluster {
  etapa: number;
  titulo: string;
  subtitulo: string;
  color: string;
  colorBorder: string;
  colorText: string;
  colorAccent: string;
  deptIds: number[];
}

const CLUSTERS: Cluster[] = [
  {
    etapa: 1, titulo: 'CEREBRO',
    subtitulo: 'Módulo base obligatorio — plataforma, seguridad, IA y aprendizaje',
    color: '#D6EFE4', colorBorder: '#A8D5BA', colorText: '#1A4731', colorAccent: '#2D6A4F',
    deptIds: [1, 2, 6, 13, 14],
  },
  {
    etapa: 2, titulo: 'ESSENTIALS',
    subtitulo: 'Módulo premium agronómico-operativo — riego, nutrición y cosecha',
    color: '#D4E8F5', colorBorder: '#A0C4E0', colorText: '#0C3556', colorAccent: '#1565C0',
    deptIds: [4, 7],
  },
  {
    etapa: 3, titulo: 'OPERACIÓN',
    subtitulo: 'Empaque, calidad, trazabilidad, logística e inventarios',
    color: '#F0D9E8', colorBorder: '#D4A8C5', colorText: '#4A1040', colorAccent: '#8B2475',
    deptIds: [8, 9],
  },
  {
    etapa: 4, titulo: 'AGRO BIO ROBOTICS',
    subtitulo: 'Campo, monitoreo, IoT, cámaras, drones y control biológico',
    color: '#FAE5D4', colorBorder: '#E8C4A4', colorText: '#4A2010', colorAccent: '#C0601A',
    deptIds: [3, 5],
  },
  {
    etapa: 5, titulo: 'VENTAS',
    subtitulo: 'Comercial, finanzas, clientes internacionales y cooperativas',
    color: '#E8D4F5', colorBorder: '#C8A4E0', colorText: '#2E0D55', colorAccent: '#6B21A8',
    deptIds: [10, 11, 12],
  },
];

/* ── Cluster Accordion sub-component ─────────────── */
const ClusterSection: React.FC<{
  cluster: Cluster;
  depts: Departamento[];
  defaultOpen?: boolean;
  nav: (id: string) => void;
}> = ({ cluster, depts, defaultOpen = false, nav }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [hovered, setHovered] = useState<number | null>(null);
  const activeCount = depts.filter(d => d.status === 'activo').length;

  return (
    <div style={{
      borderRadius: 18,
      border: `1.5px solid ${cluster.colorBorder}`,
      overflow: 'hidden',
      boxShadow: open
        ? `0 8px 28px ${cluster.color}90, 0 2px 8px rgba(0,0,0,0.04)`
        : '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.4s ease',
      marginBottom: 0,
    }}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          background: cluster.color, padding: '16px 22px',
          display: 'flex', alignItems: 'center', gap: 16,
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 11, flexShrink: 0,
          background: `${cluster.colorAccent}1A`, border: `1.5px solid ${cluster.colorAccent}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: cluster.colorAccent }}>{cluster.etapa}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: cluster.colorText, letterSpacing: '-0.2px' }}>
              ETAPA {cluster.etapa} — {cluster.titulo}
            </span>
            <span style={{
              fontSize: 9.5, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
              background: `${cluster.colorAccent}18`, color: cluster.colorAccent,
              border: `1px solid ${cluster.colorAccent}30`,
            }}>
              {activeCount}/{depts.length} ACTIVOS
            </span>
          </div>
          <p style={{ margin: '2px 0 0', fontSize: 11.5, color: cluster.colorText, opacity: 0.6, fontWeight: 500 }}>
            {cluster.subtitulo}
          </p>
        </div>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: `${cluster.colorAccent}15`, border: `1px solid ${cluster.colorAccent}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.35s cubic-bezier(.22,1,.36,1)',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        }}>
          <ChevronRight size={15} color={cluster.colorAccent} />
        </div>
      </button>

      {/* Cards grid */}
      {open && (
        <div style={{
          background: `${cluster.color}55`,
          padding: '20px 22px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
          animation: 'md-fadein 0.28s ease',
        }}>
          {depts.map((dept, idx) => {
            const sc = STATUS_CONFIG[dept.status];
            const StatusIcon = sc.icon as LucideIcon;
            const DeptIcon = dept.icon as LucideIcon;
            const paq = PAQUETES.find(p => p.id === dept.paquete);
            const isHov = hovered === dept.id;
            return (
              <div
                key={dept.id}
                className="md-card"
                style={{ animation: `md-fadein 0.3s ease ${idx * 0.05}s backwards` }}
                onMouseEnter={() => setHovered(dept.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => dept.navTarget && nav(dept.navTarget)}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: 3, borderRadius: '16px 16px 0 0',
                  background: `linear-gradient(90deg, ${dept.color}, ${dept.color}80)`,
                  opacity: isHov ? 1 : 0.55, transition: 'opacity 0.25s',
                }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: `${dept.color}12`, border: `1px solid ${dept.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: isHov ? 'scale(1.08)' : 'none', transition: 'all 0.25s',
                  }}>
                    <DeptIcon size={20} color={dept.color} strokeWidth={2} />
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: sc.bg, border: `1px solid ${sc.border}`,
                    borderRadius: 20, padding: '3px 10px',
                  }}>
                    <StatusIcon size={10} color={sc.color} strokeWidth={3} />
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: sc.color, letterSpacing: '0.06em' }}>{sc.label}</span>
                  </div>
                </div>
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                    DEPARTAMENTO {String(dept.id).padStart(2, '0')}
                  </span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 7px', lineHeight: 1.25 }}>
                  {dept.nombre}
                </h3>
                <p style={{
                  fontSize: 12, color: '#6B7280', lineHeight: 1.5, margin: '0 0 12px',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                }}>
                  {dept.descripcion}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 5, marginBottom: 14 }}>
                  {dept.subModulos.slice(0, 4).map(sub => (
                    <span key={sub} className="md-sub-tag">{sub}</span>
                  ))}
                  {dept.subModulos.length > 4 && (
                    <span className="md-sub-tag" style={{ background: '#E5E7EB', color: '#9CA3AF' }}>+{dept.subModulos.length - 4}</span>
                  )}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: 10, borderTop: '1px solid #F3F4F6',
                }}>
                  {paq && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6B7280', fontWeight: 500 }}>
                      <Layers size={12} color={paq.color} />
                      <span>Paquete {paq.id}: {paq.nombre}</span>
                    </div>
                  )}
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: isHov ? '#1A3C2E' : '#F3F4F6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}>
                    <ChevronRight size={14} color={isHov ? '#fff' : '#9CA3AF'} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   STATUS HELPERS
   ═══════════════════════════════════════════════════ */

const STATUS_CONFIG: Record<DeptStatus, { label: string; bg: string; border: string; color: string; icon: React.ElementType }> = {
  activo:       { label: 'ACTIVO',        bg: 'rgba(82,183,136,0.12)',  border: 'rgba(82,183,136,0.3)',  color: '#52B788', icon: Check },
  disponible:   { label: 'DISPONIBLE',    bg: 'rgba(59,130,246,0.10)',  border: 'rgba(59,130,246,0.25)', color: '#3B82F6', icon: Zap },
  proximamente: { label: 'PRÓXIMAMENTE',  bg: 'rgba(156,163,175,0.10)', border: 'rgba(156,163,175,0.25)', color: '#9CA3AF', icon: Lock },
};

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */

export const ModulosDashboard: React.FC = () => {
  const nav = useNav();
  const [expandedPaquete, setExpandedPaquete] = useState<number | null>(null);

  const stats = {
    activos:       DEPARTAMENTOS.filter(d => d.status === 'activo').length,
    disponibles:   DEPARTAMENTOS.filter(d => d.status === 'disponible').length,
    proximamente:  DEPARTAMENTOS.filter(d => d.status === 'proximamente').length,
    total:         DEPARTAMENTOS.length,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes md-fadein  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
        @keyframes md-shine   { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes md-float   { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-4px); } }
        @keyframes md-glow    { 0%,100% { box-shadow: 0 0 8px rgba(82,183,136,0.2); } 50% { box-shadow: 0 0 20px rgba(82,183,136,0.4); } }

        .md-card {
          position: relative;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(.22,1,.36,1);
          overflow: hidden;
        }
        .md-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.04);
          border-color: rgba(82,183,136,0.35);
        }
        .md-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 16px 16px 0 0;
          transition: opacity 0.25s;
        }
        .md-card:hover::before { opacity: 1; }

        .md-filter-btn {
          padding: 7px 16px;
          border-radius: 20px;
          border: 1px solid #E5E7EB;
          background: #fff;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s;
          font-family: inherit;
          color: #6B7280;
        }
        .md-filter-btn:hover { border-color: rgba(82,183,136,0.4); color: #2D6A4F; }
        .md-filter-btn.is-active {
          background: linear-gradient(135deg, #1A3C2E 0%, #2D6A4F 100%);
          border-color: transparent;
          color: #fff;
          font-weight: 600;
        }

        .md-paquete {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
        }
        .md-paquete:hover { border-color: rgba(82,183,136,0.3); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

        .md-sub-tag {
          display: inline-flex;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          background: #F3F4F6;
          color: #374151;
          white-space: nowrap;
        }

        @media (max-width: 767px) {
          .md-hero-grid { grid-template-columns: 1fr !important; }
          .md-dept-grid { grid-template-columns: 1fr !important; }
          .md-paq-grid  { grid-template-columns: 1fr !important; }
          .md-stats-row { flex-direction: column !important; gap: 8px !important; }
        }
        @media (min-width: 768px) and (max-width: 1279px) {
          .md-dept-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .md-paq-grid  { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(135deg, #0E2318 0%, #1A3C2E 40%, #2D6A4F 100%)',
        borderRadius: 20,
        padding: '36px 32px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -60, right: -40,
          width: 220, height: 220, borderRadius: '50%',
          background: 'rgba(82,183,136,0.08)',
          border: '1px solid rgba(82,183,136,0.12)',
        }} />
        <div style={{
          position: 'absolute', bottom: -30, right: 100,
          width: 120, height: 120, borderRadius: '50%',
          background: 'rgba(82,183,136,0.06)',
        }} />

        <div className="md-hero-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 32,
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          <div>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(82,183,136,0.15)',
              border: '1px solid rgba(82,183,136,0.25)',
              borderRadius: 20, padding: '5px 14px',
              marginBottom: 14,
            }}>
              <Sparkles size={13} color="#52B788" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#52B788', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                AgroTech IA · AgroBotanicals™
              </span>
            </div>

            <h1 style={{
              fontSize: 32, fontWeight: 700, color: '#fff',
              margin: '0 0 8px', letterSpacing: '-0.5px', lineHeight: 1.15,
            }}>
              Módulos Comerciales
            </h1>
            <p style={{
              fontSize: 14.5, color: 'rgba(255,255,255,0.6)',
              margin: 0, maxWidth: 520, lineHeight: 1.55,
            }}>
              14 departamentos funcionales · 8 paquetes de venta.
              El cliente compra el cerebro base y activa capacidades por departamento,
              conforme cada módulo demuestra valor operativo.
            </p>
          </div>

          {/* Stats cards */}
          <div className="md-stats-row" style={{ display: 'flex', gap: 12 }}>
            {[
              { label: 'Activos', value: stats.activos, color: '#52B788', total: stats.total },
              { label: 'Disponibles', value: stats.disponibles, color: '#3B82F6', total: stats.total },
              { label: 'Próximos', value: stats.proximamente, color: '#9CA3AF', total: stats.total },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14, padding: '16px 20px',
                backdropFilter: 'blur(10px)',
                minWidth: 100, textAlign: 'center' as const,
              }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: s.color, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4, fontWeight: 500 }}>
                  {s.label}
                </div>
                {/* mini progress */}
                <div style={{
                  marginTop: 8, height: 3, borderRadius: 2,
                  background: 'rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    width: `${(s.value / s.total) * 100}%`,
                    background: s.color,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          5 ETAPAS COMERCIALES — CLUSTERS
      ════════════════════════════════════════════ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        {CLUSTERS.map((cluster) => (
          <ClusterSection
            key={cluster.etapa}
            cluster={cluster}
            depts={cluster.deptIds.map(id => DEPARTAMENTOS.find(d => d.id === id)!).filter(Boolean)}
            defaultOpen={false}
            nav={nav}
          />
        ))}
      </div>

      {/* ════════════════════════════════════════════
          PAQUETES COMERCIALES
      ════════════════════════════════════════════ */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #1A3C2E 0%, #2D6A4F 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Layers size={16} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>
              Paquetes Comerciales
            </h2>
            <p style={{ fontSize: 12.5, color: '#6B7280', margin: 0 }}>
              8 paquetes modulares — activa capacidades conforme crece tu operación
            </p>
          </div>
        </div>

        <div className="md-paq-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
        }}>
          {PAQUETES.map(paq => {
            const PaqIcon = paq.icon;
            const depts = DEPARTAMENTOS.filter(d => d.paquete === paq.id);
            const isExpanded = expandedPaquete === paq.id;

            return (
              <div
                key={paq.id}
                className="md-paquete"
                onClick={() => setExpandedPaquete(isExpanded ? null : paq.id)}
              >
                {/* Top bar */}
                <div style={{
                  height: 3,
                  background: `linear-gradient(90deg, ${paq.color}, ${paq.color}60)`,
                }} />

                <div style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                      background: `${paq.color}12`,
                      border: `1px solid ${paq.color}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <PaqIcon size={16} color={paq.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 9.5, fontWeight: 700, color: '#9CA3AF',
                        letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                      }}>
                        Paquete {paq.id}
                      </div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#111827' }}>
                        {paq.nombre}
                      </div>
                    </div>
                    <ChevronRight
                      size={14}
                      color="#9CA3AF"
                      style={{
                        transition: 'transform 0.2s',
                        transform: isExpanded ? 'rotate(90deg)' : 'none',
                      }}
                    />
                  </div>

                  <p style={{ fontSize: 11.5, color: '#6B7280', margin: '0 0 10px', lineHeight: 1.4 }}>
                    {paq.descripcion}
                  </p>

                  {/* Expanded: show department list */}
                  {isExpanded && (
                    <div style={{
                      borderTop: '1px solid #F3F4F6',
                      paddingTop: 10,
                      animation: 'md-fadein 0.2s ease forwards',
                    }}>
                      {depts.map(d => {
                        const dsc = STATUS_CONFIG[d.status];
                        return (
                          <div
                            key={d.id}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 8,
                              padding: '6px 0',
                              fontSize: 12, color: '#374151',
                            }}
                          >
                            <div style={{
                              width: 6, height: 6, borderRadius: '50%',
                              background: dsc.color, flexShrink: 0,
                            }} />
                            <span style={{ flex: 1 }}>{d.nombre}</span>
                            <span style={{
                              fontSize: 9, fontWeight: 600, color: dsc.color,
                              padding: '2px 7px', borderRadius: 10,
                              background: dsc.bg,
                            }}>
                              {dsc.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════
          RECOMENDACIÓN ESTRATÉGICA (footer callout)
      ════════════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(135deg, #0E2318 0%, #1A3C2E 60%, #2D6A4F 100%)',
        borderRadius: 16, padding: '28px 28px',
        marginTop: 32,
        display: 'flex', alignItems: 'center', gap: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 140, height: 140, borderRadius: '50%',
          background: 'rgba(82,183,136,0.08)',
        }} />
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: 'rgba(82,183,136,0.15)',
          border: '1px solid rgba(82,183,136,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'md-glow 3s ease infinite',
        }}>
          <Sparkles size={22} color="#52B788" />
        </div>
        <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>
            Recomendación Estratégica
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.55 }}>
            Primera etapa: <strong style={{ color: '#52B788' }}>Cerebro Tecnológico + Campo + Laboratorio + Riego + Alertas + IA Inicial</strong>.
            El cliente compra el cerebro base y después activa capacidades por departamento, conforme cada módulo demuestra valor.
          </p>
        </div>
      </div>
    </div>
  );
};
