import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar, LineChart, Line,
  ResponsiveContainer, Cell,
} from 'recharts';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight, Clock, TrendingUp, Zap, Bot, Radio as RadioIcon,
  Users, FlaskConical, Snowflake, Warehouse, HeartHandshake, Boxes, LogIn,
  BarChart3, Cloud, Thermometer, History, Apple, Sparkles, ShieldAlert,
  Server, MonitorSmartphone, Layers, Droplets, Gauge, CalendarDays, Percent, Network,
} from 'lucide-react';
import { brandingConfig } from '../../config/branding';
import { HeroCard } from '../../components/modules/dashboardModules/Herocard';
import { Sugerencia } from '../../components/command/CommandKit';
import { useNav } from '../../config/navContext';

const { colores } = brandingConfig;
type Sev = 'ok' | 'info' | 'warn' | 'crit';
const SEV: Record<Sev, string> = { ok: colores.exito, info: colores.info, warn: colores.advertencia, crit: colores.peligro };

interface Modulo {
  id: string;
  titulo: string;
  icon: LucideIcon;
  color: string;
  stats: { label: string; value: string }[];
  /** Visual dinámico opcional; si existe reemplaza a los stats numéricos. */
  visual?: React.ReactNode;
  /** Ancho en columnas del grid (1 por defecto). */
  span?: number;
  /** Nombre de la rutina automatizada; muestra barra interactiva. */
  auto?: string;
  alertas: { sev: Sev; texto: string; sugerencia: string }[];
  palanca: { nombre: string; valor: string; consejo: string };
}

const C = colores;

/* ── Visuales dinámicos (variedad, no solo números) ────── */
const AREA_INGRESO = [{ v: 3.6 }, { v: 3.9 }, { v: 4.1 }, { v: 4.0 }, { v: 4.5 }, { v: 4.82 }];
const SparkArea: React.FC<{ color: string; pie: string }> = ({ color, pie }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 9.5, color: colores.textoOscuro, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ingreso · 6 meses</span>
      <span style={{ fontSize: 15, fontWeight: 700, color, letterSpacing: '-0.3px' }}>{pie}</span>
    </div>
    <ResponsiveContainer width="100%" height={56}>
      <AreaChart data={AREA_INGRESO} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs><linearGradient id="cdAreaCli" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.4} /><stop offset="100%" stopColor={color} stopOpacity={0.02} /></linearGradient></defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill="url(#cdAreaCli)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const RadialGauge: React.FC<{ pct: number; color: string; label: string }> = ({ pct, color, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <div style={{ width: 88, height: 88, position: 'relative', flexShrink: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ v: pct }]} startAngle={90} endAngle={-270}>
          <RadialBar background={{ fill: colores.fondoTerciario }} dataKey="v" cornerRadius={8} fill={color} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <span style={{ fontSize: 18, fontWeight: 800, color, letterSpacing: '-0.5px' }}>{pct}%</span>
      </div>
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: colores.textoClaro }}>{label}</div>
      <div style={{ fontSize: 10.5, color: colores.textoOscuro, marginTop: 2 }}>34 análisis procesados hoy</div>
    </div>
  </div>
);

const BARS = [{ v: 22 }, { v: 31 }, { v: 28 }, { v: 40 }, { v: 36 }, { v: 48 }];
const MiniBars: React.FC<{ color: string; pie: string }> = ({ color, pie }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 9.5, color: colores.textoOscuro, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Crecimiento total</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: colores.exito }}>{pie}</span>
    </div>
    <ResponsiveContainer width="100%" height={56}>
      <BarChart data={BARS} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <Bar dataKey="v" radius={[3, 3, 0, 0]}>
          {BARS.map((_, i) => <Cell key={i} fill={i === BARS.length - 1 ? color : `${color}66`} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const LiveVideoMini: React.FC<{ src: string }> = ({ src }) => (
  <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '16 / 9', background: '#0E2318' }}>
    <video src={src} autoPlay muted loop playsInline controls={false} onContextMenu={e => e.preventDefault()} style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', top: 6, left: 6, display: 'flex', alignItems: 'center', gap: 5, padding: '2px 7px', borderRadius: 20, background: 'rgba(220,38,38,0.85)' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', animation: 'cd-ping 1.6s ease-in-out infinite' }} />
      <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.1em', color: '#fff' }}>EN VIVO</span>
    </div>
  </div>
);

/** Línea que se mueve sola (telemetría "viva"). */
const LiveLineMini: React.FC<{ color: string; label: string; unidad: string }> = ({ color, label, unidad }) => {
  const [data, setData] = useState(() => Array.from({ length: 14 }, () => ({ v: 20 + Math.random() * 30 })));
  const [cur, setCur] = useState(28);
  useEffect(() => {
    const t = setInterval(() => {
      const nv = Math.max(8, Math.min(70, 20 + Math.random() * 40));
      setCur(Math.round(nv));
      setData(prev => [...prev.slice(1), { v: nv }]);
    }, 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 9.5, color: colores.textoOscuro, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{cur} {unidad}</span>
      </div>
      <ResponsiveContainer width="100%" height={56}>
        <LineChart data={data} margin={{ top: 6, right: 2, left: 2, bottom: 0 }}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/** Barras que laten (amenazas bloqueadas). */
const LiveBarsMini: React.FC<{ color: string }> = ({ color }) => {
  const [data, setData] = useState(() => Array.from({ length: 12 }, () => ({ v: 10 + Math.random() * 40 })));
  const [tot, setTot] = useState(1284);
  useEffect(() => {
    const t = setInterval(() => {
      setData(prev => [...prev.slice(1), { v: 10 + Math.random() * 45 }]);
      setTot(v => v + Math.floor(Math.random() * 6));
    }, 1200);
    return () => clearInterval(t);
  }, []);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 9.5, color: colores.textoOscuro, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Amenazas bloqueadas</span>
        <span style={{ fontSize: 15, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{tot.toLocaleString('es-MX')}</span>
      </div>
      <ResponsiveContainer width="100%" height={56}>
        <BarChart data={data} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
          <Bar dataKey="v" radius={[2, 2, 0, 0]} fill={color} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/* ── Módulos esenciales (flanquean al Hero) ────────────── */
const CLIENTES: Modulo = {
  id: 'clientes', titulo: 'Clientes', icon: Users, color: C.secundario,
  stats: [{ label: 'Ingreso mes', value: '$4.82M' }, { label: 'Recompra', value: '72%' }],
  visual: <SparkArea color={C.secundario} pie="$4.82M" />,
  alertas: [
    { sev: 'crit', texto: 'Central de Abastos $512K vencido', sugerencia: 'Suspender despacho y renegociar plazo' },
    { sev: 'warn', texto: 'Cartera concentrada 43% en 2 clientes', sugerencia: 'Diversificar canal mayoreo' },
  ],
  palanca: { nombre: 'ROE vs ROA', valor: '18.2% / 12.6%', consejo: 'ROE > ROA: la deuda para capital de trabajo crea valor mientras su costo < rendimiento.' },
};
const LABORATORIO: Modulo = {
  id: 'panel-laboratorio', titulo: 'Panel Laboratorio', icon: FlaskConical, color: C.acentoBerry,
  stats: [{ label: 'Análisis hoy', value: '34' }, { label: 'Aprobación', value: '96%' }],
  visual: <RadialGauge pct={96} color={C.acentoBerry} label="Aprobación de calidad" />,
  alertas: [
    { sev: 'crit', texto: 'Muestra L-233 fuera de norma (acidez)', sugerencia: 'Retener lote y repetir ensayo' },
    { sev: 'info', texto: '2 certificados por vencer esta semana', sugerencia: 'Renovar antes de embarque' },
  ],
  palanca: { nombre: 'Costo de no-calidad', valor: '2.1% ventas', consejo: 'Cada rechazo evitado protege margen; invertir en QC reduce merma y multas.' },
};

/* ── Resto de módulos (grid) ───────────────────────────── */
const MODULOS: Modulo[] = [
  { id: 'cooler-empaque', titulo: 'Cooler y Empaque', icon: Snowflake, color: C.info,
    stats: [{ label: 'Cadena de frío', value: '99.4%' }, { label: 'Rechazo', value: '3.1%' }],
    alertas: [{ sev: 'warn', texto: 'Cámara 3 a 1.6 °C', sugerencia: 'Reubicar lote y revisar compresor' }, { sev: 'ok', texto: 'Línea 2 empacando 320 cajas/h', sugerencia: 'Mantener ritmo actual' }],
    palanca: { nombre: 'Apalancamiento operativo', valor: '2.6×', consejo: 'Alto costo fijo de frío: sostener volumen > 80% amplifica utilidad.' } },
  { id: 'cedis', titulo: 'Cedís', icon: Warehouse, color: C.primario,
    stats: [{ label: 'Ocupación', value: '86%' }, { label: 'Costo log.', value: '$1.36M' }],
    alertas: [{ sev: 'warn', texto: 'CEDIS Los Reyes al 92%', sugerencia: 'Desviar 8 t a CEDIS Bajío' }, { sev: 'info', texto: 'Costo logístico +7%', sugerencia: 'Optimizar consolidación de envíos' }],
    palanca: { nombre: 'WACC', valor: '12.1%', consejo: 'Activo fijo intensivo: leaseback baja el WACC frente a compra directa.' }, auto: 'Balanceo de cámaras frías' },
  { id: 'agricultores-menores', titulo: 'Agricultores Menores', icon: HeartHandshake, color: C.acento,
    stats: [{ label: 'Acopio mes', value: '96 t' }, { label: 'Pendiente', value: '$780K' }],
    alertas: [{ sev: 'warn', texto: 'Coop. El Roble $180K vence en 2d', sugerencia: 'Dispersión prioritaria' }, { sev: 'ok', texto: 'Jocotepec Grado A 94%', sugerencia: 'Ofrecer precio garantizado' }],
    palanca: { nombre: 'Deuda / Capital', valor: '0.54×', consejo: 'Anticipos con crédito agrícola barato (FIRA) elevan retorno del acopio.' } },
  { id: 'inventario', titulo: 'Inventario', icon: Boxes, color: C.secundario,
    stats: [{ label: 'SKUs bajo mín.', value: '7' }, { label: 'Valor', value: '$2.4M' }],
    alertas: [{ sev: 'crit', texto: 'Fungicida bajo mínimo', sugerencia: 'Generar OC sugerida OP-003' }, { sev: 'info', texto: 'Clamshells 12oz al 20%', sugerencia: 'Reordenar antes del pico' }],
    palanca: { nombre: 'Rotación de inventario', valor: '8.4×/año', consejo: 'Menos stock inmóvil libera capital de trabajo y reduce merma.' } },
  { id: 'registro-entrada-turno', titulo: 'Registro de Entrada — Turno', icon: LogIn, color: C.info,
    stats: [{ label: 'En turno', value: '148' }, { label: 'Asistencia', value: '92%' }],
    alertas: [{ sev: 'warn', texto: '11 accesos con PIN sin biométrico', sugerencia: 'Reforzar captura facial' }, { sev: 'ok', texto: 'Cuadrilla Bloque A completa', sugerencia: 'Iniciar corte programado' }],
    palanca: { nombre: 'Costo laboral / kg', valor: '$3.20', consejo: 'Destajo por QR alinea pago a productividad y controla costo variable.' } },
  { id: 'analitica-reportes', titulo: 'Analítica y Reportes', icon: BarChart3, color: C.acentoBerry,
    stats: [{ label: 'Crecimiento', value: '+40.3%' }, { label: 'Gasto mes', value: '$3.1M' }],
    visual: <MiniBars color={C.acentoBerry} pie="+40.3%" />, span: 2,
    alertas: [{ sev: 'info', texto: 'Gasto insumos +9% vs plan', sugerencia: 'Revisar dosis y proveedores' }, { sev: 'ok', texto: 'Meta semanal superada', sugerencia: 'Reasignar excedente a comercial' }],
    palanca: { nombre: 'Margen operativo', valor: '21.4%', consejo: 'Vigilar punto de equilibrio; cada +1% de precio impacta directo la utilidad.' } },
  { id: 'panel-meteorologico', titulo: 'Panel Meteorológico', icon: Cloud, color: C.info,
    stats: [{ label: 'VPD', value: '1.2 kPa' }, { label: 'Lluvia 7d', value: '18 mm' }],
    alertas: [{ sev: 'warn', texto: 'Helada probable madrugada', sugerencia: 'Activar riego antihelada' }, { sev: 'info', texto: 'Ventana seca 3 días', sugerencia: 'Adelantar aplicaciones' }],
    palanca: { nombre: 'Riesgo climático', valor: 'Medio', consejo: 'Cobertura/seguro agrícola protege flujo ante siniestro; evaluar prima vs pérdida.' } },
  { id: 'termometro-barometro', titulo: 'Termómetro / Barómetro', icon: Thermometer, color: C.peligro,
    stats: [{ label: 'Temp', value: '24.6 °C' }, { label: 'Presión', value: '1013 hPa' }],
    alertas: [{ sev: 'warn', texto: 'Caída de presión brusca', sugerencia: 'Preparar protección de cultivo' }, { sev: 'ok', texto: 'Anemómetro estable 8 km/h', sugerencia: 'Condición apta para fumigar' }],
    palanca: { nombre: 'Costo energético frío', valor: '$142K/mes', consejo: 'Temperatura estable optimiza consumo; picos elevan el OPEX de refrigeración.' } },
  { id: 'historial-climatico', titulo: 'Historial Climático', icon: History, color: C.secundario,
    stats: [{ label: 'GDD acum.', value: '842' }, { label: 'Días riesgo', value: '5' }],
    alertas: [{ sev: 'info', texto: 'GDD adelantado vs año previo', sugerencia: 'Ajustar calendario de cosecha' }, { sev: 'ok', texto: 'Sin eventos extremos 30d', sugerencia: 'Mantener plan actual' }],
    palanca: { nombre: 'Precisión de pronóstico', valor: '88%', consejo: 'Mejor pronóstico reduce pérdidas y sobre-costos de contingencia.' } },
  { id: 'analisis-alimentos', titulo: 'Análisis de Alimentos', icon: Apple, color: C.exito,
    stats: [{ label: 'Inocuidad', value: 'OK' }, { label: 'Residuos', value: '<LMR' }],
    alertas: [{ sev: 'crit', texto: 'Sospecha Listeria en línea 2', sugerencia: 'Cuarentena y muestreo dirigido' }, { sev: 'info', texto: 'NOM-251 auditoría en 10d', sugerencia: 'Cerrar checklist de sanidad' }],
    palanca: { nombre: 'Riesgo de recall', valor: 'Bajo', consejo: 'Un recall cuesta más que todo el QC anual; prevención protege ventas y marca.' } },
  { id: 'inteligencia-etapa-2', titulo: 'Inteligencia · Etapa 2', icon: Sparkles, color: C.acentoBerry,
    stats: [{ label: 'Agentes', value: '4' }, { label: 'Despliegue', value: '46%' }],
    alertas: [{ sev: 'info', texto: 'BRAIN #M requiere datos de precios', sugerencia: 'Conectar fuente de mercado' }, { sev: 'ok', texto: 'BRAIN #P mejoró RMSE 6%', sugerencia: 'Promover a producción' }],
    palanca: { nombre: 'ROI de automatización', valor: '3.1×', consejo: 'Autonomía IA reduce costo operativo; priorizar agentes con mayor payback.' }, auto: 'Orquestación de agentes' },
  { id: 'ciberseguridad', titulo: 'Ciberseguridad', icon: ShieldAlert, color: C.peligro,
    stats: [{ label: 'Postura', value: '94/100' }, { label: 'Bloqueadas', value: '1,284' }],
    visual: <LiveBarsMini color={C.peligro} />, span: 2, auto: 'Respuesta a incidentes',
    alertas: [{ sev: 'crit', texto: 'Malware IoT en sensor-14', sugerencia: 'Aislar VLAN y reflashear' }, { sev: 'warn', texto: '3 vulns críticas sin parchar', sugerencia: 'Ventana de parcheo hoy' }],
    palanca: { nombre: 'Costo esperado de brecha', valor: '$1.8M', consejo: 'Invertir en seguridad < pérdida esperada; el seguro cyber transfiere riesgo residual.' } },
  { id: 'noc', titulo: 'NOC', icon: Server, color: C.info,
    stats: [{ label: 'Uptime', value: '99.97%' }, { label: 'Nodos', value: '46/48' }],
    visual: <LiveLineMini color={C.info} label="Latencia de red" unidad="ms" />, auto: 'Failover de red',
    alertas: [{ sev: 'crit', texto: 'repeater-campo-7 caído', sugerencia: 'Conmutar a enlace redundante' }, { sev: 'warn', texto: 'gw-invernadero-2 degradado', sugerencia: 'Balancear tráfico' }],
    palanca: { nombre: 'Costo de downtime', valor: '$9K/h', consejo: 'Redundancia cuesta menos que la caída; dimensionar respaldo por criticidad.' } },
  { id: 'monitoreo-aplicacion', titulo: 'Monitoreo de Aplicación', icon: MonitorSmartphone, color: C.secundario,
    stats: [{ label: 'Disponibilidad', value: '99.95%' }, { label: 'p95', value: '312 ms' }],
    alertas: [{ sev: 'crit', texto: '/api/lab/resultados 2.4% error', sugerencia: 'Activar circuit breaker' }, { sev: 'warn', texto: 'Chat MAYIA lento (820 ms)', sugerencia: 'Cachear contexto y streamear' }],
    palanca: { nombre: 'Costo cloud / usuario', valor: '$0.42', consejo: 'Optimizar latencia baja consumo y mejora retención; vigilar gasto de API IA.' } },
  { id: 'robotics-iot', titulo: 'Robótica e IoT', icon: Bot, color: C.primario,
    stats: [{ label: 'Robots', value: '6/8' }, { label: 'Área hoy', value: '42 ha' }],
    visual: <LiveVideoMini src="/assets/extrasAgro/Iot/dronScoutingBloqueA.mp4" />, span: 2, auto: 'Patrullaje de flota',
    alertas: [{ sev: 'crit', texto: 'Dron Térmico sin respuesta', sugerencia: 'Enviar cuadrilla de recuperación' }, { sev: 'warn', texto: 'Rover C batería 22%', sugerencia: 'Reprogramar muestreo' }],
    palanca: { nombre: 'Payback de flota', valor: '1.8 años', consejo: 'Automatizar labores caras (scouting, poda) acelera el retorno del CAPEX.' } },
  { id: 'soil-bio-vision', titulo: 'Soil-Bio-Vision™', icon: Layers, color: C.acento,
    stats: [{ label: 'Materia org.', value: '3.4%' }, { label: 'Textura', value: 'Franco' }],
    alertas: [{ sev: 'warn', texto: 'pH 5.2 en Bloque C', sugerencia: 'Encalar dosis sugerida' }, { sev: 'ok', texto: 'Jar test 24h estable', sugerencia: 'Sin acción requerida' }],
    palanca: { nombre: 'Costo por hectárea', valor: '$8,400', consejo: 'Diagnóstico de suelo evita sobre-fertilizar: ahorra insumo y protege rendimiento.' } },
  { id: 'medicion-agua', titulo: 'Medición de Agua', icon: Droplets, color: C.info,
    stats: [{ label: 'ETo', value: '4.1 mm' }, { label: 'Aforo', value: '32 L/s' }],
    alertas: [{ sev: 'warn', texto: 'Consumo +12% sobre plan', sugerencia: 'Revisar fugas y programación' }, { sev: 'ok', texto: 'Lluvia efectiva 14 mm', sugerencia: 'Reducir riego 1 día' }],
    palanca: { nombre: 'Costo de agua/kg', valor: '$0.09', consejo: 'Riego de precisión reduce bombeo y energía; agua es OPEX creciente.' }, auto: 'Riego de precisión' },
  { id: 'instrumentos-ambientales', titulo: 'Instrumentos Ambientales', icon: Gauge, color: C.secundario,
    stats: [{ label: 'Sensores', value: '212' }, { label: 'Calibrados', value: '98%' }],
    alertas: [{ sev: 'info', texto: '4 sensores requieren calibración', sugerencia: 'Programar mantenimiento' }, { sev: 'ok', texto: 'Lectura IA sin anomalías', sugerencia: 'Continuar monitoreo' }],
    palanca: { nombre: 'CAPEX sensórica', valor: '$310K', consejo: 'Datos confiables mejoran decisiones; amortizar sensores contra ahorro logrado.' } },
  { id: 'calendario-siembra', titulo: 'Calendario de Siembra', icon: CalendarDays, color: C.exito,
    stats: [{ label: 'Idoneidad', value: 'Alta' }, { label: 'Ventana', value: '12 d' }],
    alertas: [{ sev: 'info', texto: 'Ventana óptima cierra en 12d', sugerencia: 'Confirmar disponibilidad de plántula' }, { sev: 'ok', texto: 'Zona apta para Biloxi', sugerencia: 'Reservar cuadrillas' }],
    palanca: { nombre: 'Costo de oportunidad', valor: 'Alto', consejo: 'Sembrar en ventana óptima maximiza rendimiento por peso invertido.' } },
  { id: 'motor-probabilidad', titulo: 'Motor de Probabilidad™', icon: Percent, color: C.acentoBerry,
    stats: [{ label: 'Prob. éxito', value: '81%' }, { label: 'Mes óptimo', value: 'Ago' }],
    alertas: [{ sev: 'info', texto: 'Probabilidad baja a 62% en sep', sugerencia: 'Priorizar siembra agosto' }, { sev: 'ok', texto: 'Modelo actualizado hoy', sugerencia: 'Validar con agronomía' }],
    palanca: { nombre: 'Retorno esperado', valor: '+14%', consejo: 'Decidir por probabilidad mejora la relación riesgo/retorno del capital sembrado.' } },
  { id: 'planificacion-cosecha', titulo: 'Planificación Integral de Cosecha', icon: Network, color: C.primario,
    stats: [{ label: 'Excedente', value: '+8%' }, { label: 'Cuadrillas', value: '6' }],
    alertas: [{ sev: 'warn', texto: 'Pico de cosecha choca con packing', sugerencia: 'Escalonar corte por bloque' }, { sev: 'ok', texto: 'Gantt alineado a demanda', sugerencia: 'Confirmar con comercial' }],
    palanca: { nombre: 'Utilización de capacidad', valor: '88%', consejo: 'Nivelar picos evita horas extra y cuellos de botella caros en empaque.' }, span: 2, auto: 'Escalonamiento de corte' },
  { id: 'bio-acoustic-sentinel', titulo: 'Bio-Acoustic Sentinel™', icon: RadioIcon, color: C.acento,
    stats: [{ label: 'Detecciones', value: '3' }, { label: 'Confianza', value: '91%' }],
    alertas: [{ sev: 'warn', texto: 'Patrón acústico de plaga Bloque A', sugerencia: 'Enviar a Análisis Visual' }, { sev: 'ok', texto: 'Cobertura audio 100%', sugerencia: 'Sin acción requerida' }],
    palanca: { nombre: 'Ahorro por detección temprana', valor: '$220K', consejo: 'Detectar plaga antes reduce pérdida de cosecha y gasto en control químico.' } },
];

/* ── Barra de automatización interactiva ───────────────── */
const AutomationStrip: React.FC<{ nombre: string; color: string }> = ({ nombre, color }) => {
  const [on, setOn] = useState(true);
  const [n, setN] = useState(() => 12 + Math.floor(Math.random() * 40));
  useEffect(() => {
    if (!on) return;
    const t = setInterval(() => setN(v => v + 1), 4000);
    return () => clearInterval(t);
  }, [on]);

  return (
    <div style={{
      position: 'relative', overflow: 'hidden', borderRadius: 10, padding: '8px 11px',
      background: on ? `${color}12` : colores.fondoTerciario,
      border: `1px solid ${on ? `${color}40` : colores.borde}`,
      display: 'flex', alignItems: 'center', gap: 9,
    }}>
      <span style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: on ? color : colores.textoOscuro }} />
        {on && <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, animation: 'cd-ping 1.8s ease-in-out infinite' }} />}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: colores.textoClaro }}>Automatización · {nombre}</div>
        <div style={{ fontSize: 10, color: colores.textoOscuro, fontVariantNumeric: 'tabular-nums' }}>
          {on ? `${n} acciones ejecutadas hoy` : 'En pausa — control manual'}
        </div>
      </div>
      <button onClick={() => setOn(v => !v)} style={{
        flexShrink: 0, padding: '4px 10px', borderRadius: 20, cursor: 'pointer', fontSize: 10, fontWeight: 800, letterSpacing: '0.04em',
        border: `1px solid ${on ? `${color}66` : colores.borde}`,
        background: on ? color : '#fff', color: on ? '#fff' : colores.textoOscuro,
      }}>
        {on ? 'ACTIVA' : 'PAUSADA'}
      </button>
      {on && <span style={{ position: 'absolute', left: 0, bottom: 0, height: 2, width: '40%', background: color, animation: 'cd-scanx 2.2s linear infinite' }} />}
    </div>
  );
};

/* ── Card de módulo ────────────────────────────────────── */
const DecisionModule: React.FC<{ m: Modulo; tick: number }> = ({ m, tick }) => {
  const nav = useNav();
  const Icon = m.icon;
  const a = m.alertas[tick % m.alertas.length];

  return (
    <div className="cd-mod" style={{
      gridColumn: m.span ? `span ${m.span}` : undefined,
      background: '#fff', borderRadius: 16, border: `1px solid ${colores.borde}`,
      boxShadow: colores.sombra, padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
      borderTop: `3px solid ${m.color}`,
    }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: `${m.color}1A`, border: `1px solid ${m.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={17} color={m.color} strokeWidth={2.1} />
        </div>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: colores.textoClaro, flex: 1, lineHeight: 1.2, letterSpacing: '-0.2px' }}>{m.titulo}</span>
        <button onClick={() => nav(m.id)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 9px', borderRadius: 8,
          border: `1px solid ${m.color}40`, background: `${m.color}0D`, color: m.color, fontSize: 10.5, fontWeight: 700, cursor: 'pointer',
        }}>
          Ir <ArrowRight size={11} />
        </button>
      </div>

      {/* info: visual dinámico o stats numéricos */}
      {m.visual ? m.visual : (
        <div style={{ display: 'flex', gap: 8 }}>
          {m.stats.map((s, i) => (
            <div key={i} style={{ flex: 1, background: colores.fondoTerciario, borderRadius: 10, padding: '9px 11px' }}>
              <div style={{ fontSize: 9.5, color: colores.textoOscuro, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: colores.textoClaro, letterSpacing: '-0.4px', marginTop: 2 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* alerta emergente (rota con tick) */}
      <div key={a.texto} style={{
        display: 'flex', flexDirection: 'column', gap: 2, padding: '9px 11px', borderRadius: 10,
        background: colores.fondoTerciario, borderLeft: `3px solid ${SEV[a.sev]}`,
        animation: 'cd-emerge 0.45s cubic-bezier(.22,1,.36,1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: SEV[a.sev], boxShadow: `0 0 7px ${SEV[a.sev]}`, flexShrink: 0 }} />
          <span style={{ fontSize: 11.5, fontWeight: 600, color: colores.textoClaro }}>{a.texto}</span>
        </div>
        <Sugerencia accion={a.sugerencia} />
      </div>

      {/* palanca financiera */}
      <div style={{ padding: '10px 12px', borderRadius: 10, background: `${m.color}0A`, border: `1px solid ${m.color}26` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: colores.textoMedio }}>{m.palanca.nombre}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: m.color, letterSpacing: '-0.3px' }}>{m.palanca.valor}</span>
        </div>
        <p style={{ fontSize: 10.5, color: colores.textoOscuro, margin: '5px 0 0', lineHeight: 1.4 }}>{m.palanca.consejo}</p>
      </div>

      {/* automatización interactiva */}
      {m.auto && <AutomationStrip nombre={m.auto} color={m.color} />}
    </div>
  );
};

/* ── Header tipo command center ────────────────────────── */
const TICKERS = [
  '[Seguimiento urgente] — Paola M.: dar seguimiento a cosecha Bloque A',
  '[Cadena de frío] — CEDIS Frontera cámara 3 fuera de rango',
  '[Comercial] — Walmart confirma pedido de 12 t',
  '[Sanidad] — Muestra L-233 requiere re-análisis',
];

const CommandHeader: React.FC = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const [tk, setTk] = useState(0);
  useEffect(() => { const t = setInterval(() => setTk(v => v + 1), 4500); return () => clearInterval(t); }, []);

  const hora = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const fecha = now.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  const saludo = now.getHours() < 12 ? 'Buenos días' : now.getHours() < 19 ? 'Buenas tardes' : 'Buenas noches';

  const chip = (icon: React.ReactNode, label: string, value: string, color: string) => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 12, background: '#fff', border: `1px solid ${colores.borde}` }}>
      <span style={{ color }}>{icon}</span>
      <span style={{ fontSize: 12.5, color: colores.textoMedio }}>{label}:</span>
      <span style={{ fontSize: 13.5, fontWeight: 700, color }}>{value}</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: colores.gradientePrimario, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 20px ${colores.primario}40` }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>MAYiA</span>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: colores.textoClaro, letterSpacing: '-0.8px', lineHeight: 1.1 }}>
              {saludo}, <span style={{ color: colores.primario }}>Control de Decisiones</span>
            </h1>
            <p style={{ margin: '3px 0 0', fontSize: 13.5, color: colores.textoOscuro }}>Centro de mando con inteligencia artificial activa</p>
          </div>
        </div>
        <div style={{ background: '#fff', border: `1px solid ${colores.borde}`, borderRadius: 14, padding: '12px 18px', textAlign: 'right', boxShadow: colores.sombra }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
            <Clock size={16} color={colores.primario} />
            <span style={{ fontSize: 20, fontWeight: 800, color: colores.textoClaro, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px' }}>{hora}</span>
          </div>
          <div style={{ fontSize: 12, color: colores.textoOscuro, marginTop: 2, textTransform: 'capitalize' }}>{fecha}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {chip(<TrendingUp size={15} />, 'Cosecha hoy', '640 kg', colores.exito)}
        {chip(<Zap size={15} />, 'Lotes activos', '38', colores.acentoBerry)}
        {chip(<Bot size={15} />, 'Agentes IA', '4 Online', colores.secundario)}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: '#fff', border: `1px solid ${colores.peligro}33` }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: colores.peligro, boxShadow: `0 0 8px ${colores.peligro}`, animation: 'cd-ping 1.6s ease-in-out infinite' }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: colores.peligro, letterSpacing: '0.06em' }}>EN VIVO</span>
        </span>
        <span key={tk} style={{ fontSize: 13, color: colores.textoMedio, flex: 1, animation: 'cd-emerge 0.4s ease' }}>{TICKERS[tk % TICKERS.length]}</span>
        <span style={{ fontSize: 11.5, color: colores.textoOscuro, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{hora}</span>
      </div>
    </div>
  );
};

/* ── Sección ───────────────────────────────────────────── */
export const ControlDecisiones: React.FC = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(v => v + 1), 3500); return () => clearInterval(t); }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <style>{`
        @keyframes cd-emerge { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cd-ping { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.6); opacity: 0.4; } }
        @keyframes cd-scanx { 0% { left: -40%; } 100% { left: 100%; } }
        .cd-mod { transition: transform 0.18s cubic-bezier(.22,1,.36,1), box-shadow 0.18s; }
        .cd-mod:hover { transform: translateY(-3px); box-shadow: 0 14px 30px rgba(14,35,24,0.12); }
        .cd-hero-row { display: grid; grid-template-columns: 1fr 1.15fr 1fr; gap: 20; align-items: stretch; }
        .cd-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18; }
        @media (max-width: 1200px) { .cd-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 1023px) {
          .cd-hero-row { grid-template-columns: 1fr; }
          .cd-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) { .cd-grid { grid-template-columns: 1fr; } }
      `}</style>

      <CommandHeader />

      {/* Fila Hero: Clientes | HeroCard | Laboratorio (esencial, derecha) */}
      <div className="cd-hero-row" style={{ gap: 20 }}>
        <DecisionModule m={CLIENTES} tick={tick} />
        <HeroCard />
        <DecisionModule m={LABORATORIO} tick={tick} />
      </div>

      {/* Grid del resto de módulos */}
      <div className="cd-grid" style={{ gap: 18 }}>
        {MODULOS.map(m => <DecisionModule key={m.id} m={m} tick={tick} />)}
      </div>
    </div>
  );
};

export default ControlDecisiones;
