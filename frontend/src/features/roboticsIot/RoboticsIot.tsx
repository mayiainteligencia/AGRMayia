import React from 'react';
import { Bot, Cpu, BatteryCharging, Radio, Wrench } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import {
  PageTitle, AgentStrip, AlertStack, VideoGrid, LiveFeed, useLiveFeed,
  type AlertItem, type VideoSlot,
} from '../../components/command/CommandKit';

const KPIS = [
  { label: 'Robots activos', value: '6/8', unit: '', delta: '-2', trend: 'down' as const, accentColor: '#2D6A4F', icon: <Bot size={18} /> },
  { label: 'Dispositivos IoT', value: '212', unit: 'en línea', delta: '+8', trend: 'up' as const, accentColor: '#0284C7', icon: <Radio size={18} /> },
  { label: 'Batería flota', value: '74', unit: '% prom', delta: '-6%', trend: 'down' as const, accentColor: '#D97706', icon: <BatteryCharging size={18} /> },
  { label: 'Área cubierta hoy', value: '42', unit: 'ha', delta: '+9%', trend: 'up' as const, accentColor: '#5C3D8F', icon: <Cpu size={18} /> },
];

/* El usuario pega las URLs de sus videos; las alertas las define el agente. */
const SLOTS: VideoSlot[] = [
  { titulo: 'Dron de scouting — Bloque A', url: '/assets/extrasAgro/Iot/dronScoutingBloqueA.mp4', alerta: { sev: 'warn', texto: 'Posible foco de plaga detectado' } },
  { titulo: 'Robot de poda — Invernadero 2', url: '/assets/extrasAgro/Iot/Robotdepodanvernadero2.mp4', alerta: { sev: 'ok', texto: 'Operando normal' } },
  { titulo: 'Cámara fija — CEDIS Frontera', url: '/assets/extrasAgro/Iot/camaraFijaCedisFrontera.mp4', alerta: { sev: 'crit', texto: 'Temperatura fuera de rango' } },
  { titulo: 'Rover de suelo — Bloque C', url: '/assets/extrasAgro/Iot/roverSueloBloqueC.mp4', alerta: { sev: 'info', texto: 'Muestreo en curso' } },
  { titulo: 'Dron térmico — Riego norte', url: '/assets/extrasAgro/Iot/dronTermicoRiegoNorte.mp4', alerta: { sev: 'warn', texto: 'Zona seca identificada' } },
  { titulo: 'Cámara portón — Acceso principal', url: '/assets/extrasAgro/Iot/camaraPortonAccesoPrincipal.mp4', alerta: { sev: 'ok', texto: 'Sin novedad' } },
];

interface DispRow { id: string; equipo: string; tipo: string; bateria: number; tarea: string; estado: 'Operando' | 'Cargando' | 'Falla'; }
const DISP: DispRow[] = [
  { id: 'R-01', equipo: 'Dron Scout A',   tipo: 'Dron',   bateria: 68, tarea: 'Scouting Bloque A',   estado: 'Operando' },
  { id: 'R-02', equipo: 'PodaBot 2',      tipo: 'Robot',  bateria: 91, tarea: 'Poda Invernadero 2',  estado: 'Operando' },
  { id: 'R-03', equipo: 'Rover Suelo C',  tipo: 'Rover',  bateria: 22, tarea: 'Muestreo Bloque C',   estado: 'Cargando' },
  { id: 'R-04', equipo: 'Dron Térmico',   tipo: 'Dron',   bateria: 0,  tarea: '—',                   estado: 'Falla' },
];

const COLS: DataTableColumn<DispRow>[] = [
  { key: 'id', header: 'ID', nowrap: true },
  { key: 'equipo', header: 'Equipo' },
  { key: 'tipo', header: 'Tipo', render: r => <Badge variant="neutral">{r.tipo}</Badge> },
  { key: 'bateria', header: 'Batería', align: 'right', render: r => r.estado === 'Falla' ? '—' : `${r.bateria}%` },
  { key: 'tarea', header: 'Tarea' },
  { key: 'estado', header: 'Estado', render: r => <Badge variant={r.estado === 'Operando' ? 'success' : r.estado === 'Cargando' ? 'warning' : 'danger'}>{r.estado}</Badge> },
];

const ALERTAS: AlertItem[] = [
  { sev: 'crit', titulo: 'Dron Térmico sin respuesta', detalle: 'Batería 0% y última posición en riego norte.', accion: 'Enviar cuadrilla de recuperación' },
  { sev: 'warn', titulo: 'Rover Suelo C batería 22%', detalle: 'Regresando a base de carga automáticamente.', accion: 'Reprogramar muestreo restante' },
  { sev: 'info', titulo: 'Dron Scout A — anomalía en Bloque A', detalle: 'Patrón de color compatible con plaga; requiere validación.', accion: 'Enviar a Análisis Visual para diagnóstico' },
];

export const RoboticsIot: React.FC = () => {
  const feed = useLiveFeed([
    { sev: 'ok',   texto: 'PodaBot 2 completó tramo — Invernadero 2' },
    { sev: 'warn', texto: 'Batería baja — Rover Suelo C (22%)' },
    { sev: 'crit', texto: 'Pérdida de telemetría — Dron Térmico' },
    { sev: 'info', texto: 'Dron Scout A cargó 240 imágenes' },
  ], [
    { id: 1, sev: 'crit', texto: 'Falla detectada — Dron Térmico', hora: '13:30:15' },
    { id: 2, sev: 'ok',   texto: '6 de 8 robots operando', hora: '13:28:40' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageTitle titulo="Robótica e IoT" bajada="Flota de robots, drones y dispositivos de campo — video en vivo" />
      <AgentStrip
        agente="BRAIN™ #R — Robótica" rol="Agente de flota" estado="Coordinando" icon={Bot}
        acciones={['Coordinando rutas de la flota…', 'Monitoreando batería y telemetría…', 'Analizando video en busca de anomalías…', 'Reasignando tareas ante fallas…']}
      />

      <div className="rg-4">{KPIS.map((k, i) => <StatCard key={i} id={i} {...k} />)}</div>

      <Card padding={18}>
        <SectionHeader title="Video en vivo" subtitle="Pega la URL de cada cámara/dron — el agente sobrepone alertas" action={<Badge variant="info"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Wrench size={10} /> Editable</span></Badge>} />
        <VideoGrid slots={SLOTS} />
      </Card>

      <AlertStack alertas={ALERTAS} titulo="Alertas de flota" />

      <div className="rg-2-1" style={{ gap: 20 }}>
        <Card>
          <SectionHeader title="Estado de dispositivos" subtitle="Batería, tarea y disponibilidad" />
          <DataTable columns={COLS} rows={DISP} rowKey={r => r.id} minWidth={600} />
        </Card>
        <LiveFeed items={feed} titulo="Telemetría de flota" />
      </div>
    </div>
  );
};

export default RoboticsIot;
