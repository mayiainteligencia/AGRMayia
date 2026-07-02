import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Gauge, Timer, AlertOctagon, Users, MonitorSmartphone } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { CustomTooltip } from '../../components/charts/CustomTooltip';
import { brandingConfig } from '../../config/branding';
import {
  PageTitle, AgentStrip, AlertStack, LiveFeed, useLiveFeed,
  type AlertItem,
} from '../../components/command/CommandKit';

const { colores } = brandingConfig;

const KPIS = [
  { label: 'Disponibilidad', value: '99.95', unit: '%', delta: '+0.02', trend: 'up' as const, accentColor: '#2D6A4F', icon: <Gauge size={18} /> },
  { label: 'Latencia p95', value: '312', unit: 'ms', delta: '-28ms', trend: 'up' as const, accentColor: '#52B788', icon: <Timer size={18} /> },
  { label: 'Tasa de error', value: '0.42', unit: '%', delta: '+0.1%', trend: 'down' as const, accentColor: '#D97706', icon: <AlertOctagon size={18} /> },
  { label: 'Usuarios activos', value: '87', unit: 'ahora', delta: '+12', trend: 'up' as const, accentColor: '#5C3D8F', icon: <Users size={18} /> },
];

const LATENCIA = [
  { t: '09:00', p95: 340, err: 0.3 }, { t: '10:00', p95: 305, err: 0.2 },
  { t: '11:00', p95: 360, err: 0.5 }, { t: '12:00', p95: 298, err: 0.4 },
  { t: '13:00', p95: 312, err: 0.42 }, { t: '14:00', p95: 288, err: 0.3 },
];

interface EndpointRow { id: string; endpoint: string; p95: number; err: number; rpm: number; estado: 'OK' | 'Lento' | 'Error'; }
const ENDPOINTS: EndpointRow[] = [
  { id: 'E-01', endpoint: 'POST /api/chat/message', p95: 820, err: 0.1, rpm: 42, estado: 'Lento' },
  { id: 'E-02', endpoint: 'GET /api/departamentos', p95: 96,  err: 0.0, rpm: 210, estado: 'OK' },
  { id: 'E-03', endpoint: 'GET /api/lab/resultados', p95: 210, err: 2.4, rpm: 18,  estado: 'Error' },
  { id: 'E-04', endpoint: 'GET /health',            p95: 12,  err: 0.0, rpm: 60,  estado: 'OK' },
];

const COLS: DataTableColumn<EndpointRow>[] = [
  { key: 'endpoint', header: 'Endpoint', nowrap: true },
  { key: 'p95', header: 'p95', align: 'right', render: r => `${r.p95} ms` },
  { key: 'err', header: 'Error', align: 'right', render: r => `${r.err}%` },
  { key: 'rpm', header: 'req/min', align: 'right' },
  { key: 'estado', header: 'Estado', render: r => <Badge variant={r.estado === 'OK' ? 'success' : r.estado === 'Lento' ? 'warning' : 'danger'}>{r.estado}</Badge> },
];

const ALERTAS: AlertItem[] = [
  { sev: 'crit', titulo: 'GET /api/lab/resultados — 2.4% error', detalle: 'Timeouts hacia laboratorio externo elevan la tasa de error.', accion: 'Activar reintentos y circuit breaker' },
  { sev: 'warn', titulo: 'POST /api/chat/message lento (p95 820ms)', detalle: 'Latencia de Gemini impacta el chat de MAYIA.', accion: 'Cachear contexto y streamear respuesta' },
  { sev: 'info', titulo: 'Pico de usuarios a las 11:00', detalle: '87 usuarios concurrentes, dentro de capacidad.', accion: 'Sin acción; monitorear autoescalado' },
];

export const MonitoreoAplicacion: React.FC = () => {
  const feed = useLiveFeed([
    { sev: 'ok',   texto: 'Health check OK — 200 en 12ms' },
    { sev: 'warn', texto: 'Latencia p95 subió en /api/chat/message' },
    { sev: 'crit', texto: 'Error 504 en /api/lab/resultados' },
    { sev: 'info', texto: 'Despliegue v1.4.2 sin regresiones' },
  ], [
    { id: 1, sev: 'ok',   texto: 'Disponibilidad 99.95% en la ventana', hora: '13:00:00' },
    { id: 2, sev: 'warn', texto: 'Tasa de error subió a 0.42%', hora: '12:58:20' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageTitle titulo="Monitoreo de Aplicación" bajada="Disponibilidad, rendimiento y errores de la plataforma" />
      <AgentStrip
        agente="BRAIN™ #O — Observabilidad" rol="Agente APM" estado="Monitoreando" icon={MonitorSmartphone}
        acciones={['Trazando peticiones end-to-end…', 'Detectando anomalías de latencia…', 'Correlacionando errores por endpoint…', 'Vigilando SLA de disponibilidad…']}
      />

      <div className="rg-4">{KPIS.map((k, i) => <StatCard key={i} id={i} {...k} />)}</div>
      <AlertStack alertas={ALERTAS} titulo="Alertas de aplicación" />

      <div className="rg-2" style={{ gap: 20 }}>
        <Card>
          <SectionHeader title="Latencia p95" subtitle="ms · últimas 6 horas" />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={LATENCIA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="apmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colores.secundario} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={colores.acento} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="t" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="p95" name="p95 (ms)" stroke={colores.secundario} strokeWidth={2} fill="url(#apmGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <LiveFeed items={feed} titulo="Eventos de la app" />
      </div>

      <Card>
        <SectionHeader title="Endpoints" subtitle="Rendimiento por ruta de la API" />
        <DataTable columns={COLS} rows={ENDPOINTS} rowKey={r => r.id} minWidth={560} />
      </Card>
    </div>
  );
};

export default MonitoreoAplicacion;
