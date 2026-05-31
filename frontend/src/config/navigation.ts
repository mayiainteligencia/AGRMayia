import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard, Sprout, MapPin, Bug, ListChecks,
  Snowflake, Truck, ClipboardList, Users,
  Boxes, Building2, FileText, Trash2,
  User, Calendar, LogIn, GraduationCap, DollarSign, UserCheck,
  BadgeCheck, ShieldCheck, Bell,
  Receipt, BarChart3,
  Contact, Brain,
  Cloud, Thermometer, AlertTriangle, History,
  FlaskConical, Apple, Droplet, Microscope, Wrench, FileBadge,
  CloudLightning, Salad, Cpu,
  FileSpreadsheet, Ship, Database, Sparkles,
  TestTube, Beaker, Upload, Plug,
  Scale, Shield, Lock, AlertOctagon, BookOpen, Activity, Download,
  Settings, Key, Cog,
  Layers, Calculator, Droplets, Gauge,
  CalendarDays, Percent, Network,
  Radio, ScanEye,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Bajada corta — usada por el Placeholder y como sub-título del Header. */
  description?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'principal',
    label: 'Principal',
    items: [
      { id: 'panel-principal', label: 'Panel Principal', icon: LayoutDashboard, description: 'Vista global de operación' },
    ],
  },
  {
    id: 'campo',
    label: 'Campo',
    items: [
      { id: 'cosecha-siembra',     label: 'Cosecha y Siembra',     icon: Sprout,      description: 'Registro de cosecha y siembra (captura QR por cosechador)' },
      { id: 'campos-ranchos',      label: 'Campos / Ranchos',      icon: MapPin,      description: 'Fichas de ranchos y superficies' },
      { id: 'plagas-enfermedades', label: 'Plagas y Enfermedades', icon: Bug,         description: 'Detección, severidad y control biológico' },
      { id: 'listas-preparacion',  label: 'Listas de Preparación', icon: ListChecks,  description: 'Checklists operativos pre-labor' },
    ],
  },
  {
    id: 'distribucion',
    label: 'Distribución',
    items: [
      { id: 'cooler-empaque',   label: 'Cooler y Empaque',   icon: Snowflake,     description: 'Empaque, calidad y cadena de frío' },
      { id: 'logistica-envios', label: 'Logística y Envíos', icon: Truck,         description: 'Envíos, rutas y estado' },
      { id: 'pedidos',          label: 'Pedidos',            icon: ClipboardList, description: 'Pedidos de cliente' },
      { id: 'clientes',         label: 'Clientes',           icon: Users,         description: 'Directorio de compradores' },
    ],
  },
  {
    id: 'inventario',
    label: 'Inventario',
    items: [
      { id: 'inventario',      label: 'Inventario',         icon: Boxes,      description: 'Artículos, stock y mínimos' },
      { id: 'proveedores',     label: 'Proveedores',        icon: Building2,  description: 'Directorio de proveedores' },
      { id: 'ordenes-compra',  label: 'Órdenes de Compra',  icon: FileText,   description: 'OC a proveedores (auto-sugeridas por OP-003)' },
      { id: 'registro-merma',  label: 'Registro de Merma',  icon: Trash2,     description: 'Pérdidas de insumo o producto' },
    ],
  },
  {
    id: 'rh',
    label: 'Recursos Humanos',
    items: [
      { id: 'personal',                label: 'Personal',                  icon: User,           description: 'Directorio de colaboradores' },
      { id: 'turnos-horarios',         label: 'Turnos y Horarios',         icon: Calendar,       description: 'Programación por campo y turno' },
      { id: 'registro-entrada-turno',  label: 'Registro de Entrada — Turno', icon: LogIn,        description: 'Suite de Seguridad™ Capa 02 — facial + PIN' },
      { id: 'capacitacion',            label: 'Capacitación',              icon: GraduationCap,  description: 'Cursos y estatus' },
      { id: 'nomina',                  label: 'Nómina',                    icon: DollarSign,     description: 'Cálculo de pago (integra destajo por QR)' },
      { id: 'evaluacion-staff',        label: 'Evaluación de Staff',       icon: UserCheck,      description: 'Evaluaciones de desempeño' },
    ],
  },
  {
    id: 'cumplimiento',
    label: 'Cumplimiento',
    items: [
      { id: 'certificaciones',     label: 'Certificaciones',     icon: BadgeCheck,  description: 'PRIMUS GFS, GlobalGAP, SENASICA, FDA' },
      { id: 'registros-sanidad',   label: 'Registros de Sanidad', icon: ShieldCheck, description: 'Registros sanitarios e inocuidad' },
      { id: 'alertas-sistema',     label: 'Alertas del Sistema',  icon: Bell,        description: 'Centro de alertas (Reglas Operativas)' },
    ],
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    items: [
      { id: 'gastos-operativos',  label: 'Gastos Operativos',   icon: Receipt,    description: 'Desglose por categoría' },
      { id: 'analitica-reportes', label: 'Analítica y Reportes', icon: BarChart3,  description: 'Tendencias y dashboards' },
    ],
  },
  {
    id: 'equipo',
    label: 'Equipo',
    items: [
      { id: 'directorio-equipo',     label: 'Directorio del Equipo',   icon: Contact, description: 'Tarjetas del equipo técnico' },
      { id: 'prediccion-ia-cosecha', label: 'Predicción IA Cosecha',   icon: Brain,   description: 'Pronóstico de cosecha (curva de Gauss)' },
    ],
  },
  {
    id: 'meteo',
    label: 'Estación Meteorológica',
    items: [
      { id: 'panel-meteorologico',     label: 'Panel Meteorológico',     icon: Cloud,           description: 'Condiciones, pronóstico 7d y alertas BRAIN™ #W' },
      { id: 'termometro-barometro',    label: 'Termómetro / Barómetro',  icon: Thermometer,     description: 'Termo, barómetro, altímetro, anemómetro' },
      { id: 'alertas-meteorologicas',  label: 'Alertas Meteorológicas',  icon: AlertTriangle,   description: 'Alertas climáticas con plan de acción' },
      { id: 'historial-climatico',     label: 'Historial Climático',     icon: History,         description: 'Diario de clima y riesgos' },
    ],
  },
  {
    id: 'laboratorio',
    label: 'Laboratorio',
    items: [
      { id: 'panel-laboratorio',     label: 'Panel Laboratorio',     icon: FlaskConical, description: 'KPIs y análisis recientes' },
      { id: 'analisis-alimentos',    label: 'Análisis de Alimentos', icon: Apple,        description: 'BRAIN™ #F · COFEPRIS, NOM-251, FDA' },
      { id: 'suelo-aguas',           label: 'Suelo y Aguas',         icon: Droplet,      description: 'Análisis físico-químicos' },
      { id: 'microbiologia',         label: 'Microbiología',         icon: Microscope,   description: 'Salmonella, Listeria, E. coli' },
      { id: 'ingenieria-agronomia',  label: 'Ingeniería y Agronomía', icon: Wrench,      description: 'Diseño de riego y topografía' },
      { id: 'informes-certificados', label: 'Informes y Certificados', icon: FileBadge,  description: 'Generación de informes de lab' },
    ],
  },
  {
    id: 'brain',
    label: 'The Brain™',
    items: [
      { id: 'brain-central',      label: 'BRAIN™ Central (Maestro)',  icon: Brain,          description: 'Orquestador IA · salud del sistema' },
      { id: 'brain-meteorologia', label: 'BRAIN™ #W — Meteorología',  icon: CloudLightning, description: 'IA de clima y pronóstico' },
      { id: 'brain-alimentos',    label: 'BRAIN™ #F — Alimentos',     icon: Salad,          description: 'IA de inocuidad y normas' },
      { id: 'brain-ingenieria',   label: 'BRAIN™ #E — Ingeniería',    icon: Cpu,            description: 'IA de riego y topografía' },
    ],
  },
  {
    id: 'informes',
    label: 'Informes y Exportación',
    items: [
      { id: 'informes-generales',     label: 'Informes Generales',     icon: FileSpreadsheet, description: 'Reportes consolidados' },
      { id: 'control-exportacion',    label: 'Control de Exportación', icon: Ship,            description: 'Embarques y documentos' },
      { id: 'registros-exportacion',  label: 'Registros de Exportación', icon: FileText,      description: 'Histórico de exportaciones' },
      { id: 'residencia-datos',       label: 'Residencia de Datos',    icon: Database,        description: 'IP Vault Protected' },
      { id: 'datos-sinteticos',       label: 'Datos Sintéticos',       icon: Sparkles,        description: 'Datos generados para pruebas' },
    ],
  },
  {
    id: 'lab-avanzado',
    label: 'Laboratorio Avanzado',
    items: [
      { id: 'ensayos-laboratorio',     label: 'Ensayos de Laboratorio',    icon: TestTube, description: 'Ensayos avanzados' },
      { id: 'analisis-generales',      label: 'Análisis Generales',        icon: Beaker,   description: 'Análisis varios' },
      { id: 'vcf-uploader-alimentos',  label: 'VCF Uploader — Alimentos',  icon: Upload,   description: 'Carga de resultados de laboratorio (alimentos)' },
      { id: 'vcf-uploader-suelo',      label: 'VCF Uploader — Suelo/Tierra', icon: Upload, description: 'Carga de resultados de laboratorio (suelo)' },
      { id: 'laboratorio-api',         label: 'Laboratorio API',           icon: Plug,     description: 'Integración con laboratorios externos' },
    ],
  },
  {
    id: 'seguridad',
    label: 'Seguridad y Cumplimiento',
    items: [
      { id: 'reglas-operativas',      label: 'Reglas Operativas',     icon: Scale,         description: 'Reglas condición → acción' },
      { id: 'suite-seguridad',        label: 'Suite de Seguridad™',   icon: Shield,        description: 'Capas de seguridad del sistema' },
      { id: 'seguridad',              label: 'Seguridad',             icon: Lock,          description: 'Configuración de seguridad' },
      { id: 'incidentes',             label: 'Incidentes',            icon: AlertOctagon,  description: 'Bitácora de incidentes' },
      { id: 'protocolos',             label: 'Protocolos',            icon: BookOpen,      description: 'Protocolos documentados' },
      { id: 'monitoreo-general',      label: 'Monitoreo General',     icon: Activity,      description: 'Monitoreo global del sistema' },
      { id: 'exportacion-auditorias', label: 'Exportación de Auditorías', icon: Download,  description: 'Exportación de logs de auditoría' },
    ],
  },
  {
    id: 'admin',
    label: 'Administración del Sistema',
    items: [
      { id: 'administracion', label: 'Administración', icon: Settings, description: 'Gestión del sistema' },
      { id: 'usuarios',       label: 'Usuarios',       icon: Users,    description: 'Cuentas de usuario' },
      { id: 'roles',          label: 'Roles',          icon: Key,      description: 'Matriz de permisos por rol' },
      { id: 'configuracion',  label: 'Configuración',  icon: Cog,      description: 'Configuración general' },
    ],
  },
  {
    id: 'agronomia-avanzada',
    label: 'Agronomía Avanzada',
    items: [
      { id: 'soil-bio-vision',           label: 'Soil-Bio-Vision™',          icon: Layers,     description: 'Jar test 24h · triángulo USDA' },
      { id: 'calculadora-fertilizantes', label: 'Calculadora de Fertilizantes', icon: Calculator, description: 'Dosis NPK · sinergias y antagonismos' },
      { id: 'medicion-agua',             label: 'Medición de Agua',          icon: Droplets,   description: 'Aforo, lluvia, ETo' },
      { id: 'instrumentos-ambientales',  label: 'Instrumentos Ambientales',  icon: Gauge,      description: 'Captura manual con interpretación IA' },
    ],
  },
  {
    id: 'planificacion',
    label: 'Planificación de Campo',
    items: [
      { id: 'calendario-siembra',     label: 'Calendario de Siembra',         icon: CalendarDays, description: 'Idoneidad cultivo × mes por zona' },
      { id: 'motor-probabilidad',     label: 'Motor de Probabilidad™',        icon: Percent,      description: 'Probabilidad de siembra por mes' },
      { id: 'planificacion-cosecha',  label: 'Planificación Integral de Cosecha', icon: Network,  description: 'Gantt + proyección y excedente' },
    ],
  },
  {
    id: 'sensores',
    label: 'Sensores de Campo',
    items: [
      { id: 'bio-acoustic-sentinel', label: 'Bio-Acoustic Sentinel™', icon: Radio,   description: 'Audio del campo para detección de plagas' },
      { id: 'analisis-visual',       label: 'Análisis Visual',        icon: ScanEye, description: 'Diagnóstico visual con IA' },
    ],
  },
];

/** Lista plana de items, útil para registros / búsquedas por id. */
export const NAV_ITEMS_FLAT: NavItem[] = NAV_GROUPS.flatMap(g => g.items);

/** Mapa id → NavItem para resolver label, descripción e ícono desde cualquier parte. */
export const NAV_ITEMS_BY_ID: Record<string, NavItem> = Object.fromEntries(
  NAV_ITEMS_FLAT.map(i => [i.id, i]),
);

/** Lista de ids válidos (sirve como union type literal en runtime). */
export const NAV_IDS = NAV_ITEMS_FLAT.map(i => i.id);
export type NavId = string;
