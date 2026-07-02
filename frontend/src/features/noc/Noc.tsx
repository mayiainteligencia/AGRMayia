import React from 'react';
import { Server, Wifi, Radio, Activity } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import {
  PageTitle, AgentStrip, AlertStack, LiveFeed, useLiveFeed,
  type AlertItem,
} from '../../components/command/CommandKit';

const KPIS = [
  { label: 'Uptime red', value: '99.97', unit: '%', delta: '+0.01', trend: 'up' as const, accentColor: '#2D6A4F', icon: <Wifi size={18} /> },
  { label: 'Nodos en línea', value: '46/48', unit: '', delta: '-2', trend: 'down' as const, accentColor: '#0284C7', icon: <Server size={18} /> },
  { label: 'Latencia media', value: '28', unit: 'ms', delta: '-4ms', trend: 'up' as const, accentColor: '#52B788', icon: <Activity size={18} /> },
  { label: 'Sensores activos', value: '212', unit: '', delta: '+8', trend: 'up' as const, accentColor: '#5C3D8F', icon: <Radio size={18} /> },
];

interface NodoRow { id: string; nodo: string; tipo: string; latencia: number; carga: number; estado: 'Activo' | 'Degradado' | 'Caído'; }
const NODOS: NodoRow[] = [
  { id: 'N-01', nodo: 'gw-riego-norte',   tipo: 'Gateway',  latencia: 22, carga: 34, estado: 'Activo' },
  { id: 'N-02', nodo: 'gw-invernadero-2', tipo: 'Gateway',  latencia: 91, carga: 72, estado: 'Degradado' },
  { id: 'N-03', nodo: 'edge-lab-01',      tipo: 'Edge',     latencia: 18, carga: 41, estado: 'Activo' },
  { id: 'N-04', nodo: 'repeater-campo-7', tipo: 'Repetidor', latencia: 0, carga: 0,  estado: 'Caído' },
  { id: 'N-05', nodo: 'core-cedis',       tipo: 'Core',     latencia: 12, carga: 55, estado: 'Activo' },
];

const COLS: DataTableColumn<NodoRow>[] = [
  { key: 'id', header: 'ID', nowrap: true },
  { key: 'nodo', header: 'Nodo' },
  { key: 'tipo', header: 'Tipo', render: r => <Badge variant="neutral">{r.tipo}</Badge> },
  { key: 'latencia', header: 'Latencia', align: 'right', render: r => r.estado === 'Caído' ? '—' : `${r.latencia} ms` },
  { key: 'carga', header: 'Carga', align: 'right', render: r => r.estado === 'Caído' ? '—' : `${r.carga}%` },
  { key: 'estado', header: 'Estado', render: r => <Badge variant={r.estado === 'Activo' ? 'success' : r.estado === 'Degradado' ? 'warning' : 'danger'}>{r.estado}</Badge> },
];

const ALERTAS: AlertItem[] = [
  { sev: 'crit', titulo: 'repeater-campo-7 caído', detalle: 'Sin señal hace 12 min; 6 sensores de humedad sin reporte.', accion: 'Enviar cuadrilla y conmutar a enlace redundante' },
  { sev: 'warn', titulo: 'gw-invernadero-2 degradado', detalle: 'Latencia 91 ms y carga 72%, packet loss 3%.', accion: 'Balancear tráfico a gw-riego-norte' },
  { sev: 'info', titulo: 'Ventana de mantenimiento programada', detalle: 'Actualización de firmware core-cedis 02:00–03:00.', accion: 'Notificar a operación de CEDIS' },
];

export const Noc: React.FC = () => {
  const feed = useLiveFeed([
    { sev: 'ok',   texto: 'Heartbeat OK — 46 nodos respondiendo' },
    { sev: 'crit', texto: 'Pérdida de enlace — repeater-campo-7' },
    { sev: 'warn', texto: 'Latencia elevada en gw-invernadero-2' },
    { sev: 'info', texto: 'Failover automático a enlace secundario' },
  ], [
    { id: 1, sev: 'crit', texto: 'Nodo caído detectado — repeater-campo-7', hora: '12:01:09' },
    { id: 2, sev: 'ok',   texto: 'Uptime de red 99.97% este mes', hora: '11:59:50' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageTitle titulo="NOC" bajada="Centro de operaciones de red — nodos, enlaces y sensores de campo" />
      <AgentStrip
        agente="BRAIN™ #N — NetOps" rol="Agente de red" estado="Monitoreando" icon={Server}
        acciones={['Sondeando estado de 48 nodos…', 'Midiendo latencia y packet loss…', 'Detectando enlaces degradados…', 'Balanceando tráfico entre gateways…']}
      />

      <div className="rg-4">{KPIS.map((k, i) => <StatCard key={i} id={i} {...k} />)}</div>
      <AlertStack alertas={ALERTAS} titulo="Alertas de red" />

      <div className="rg-2-1" style={{ gap: 20 }}>
        <Card>
          <SectionHeader title="Topología de nodos" subtitle="Gateways, edge y repetidores en campo" />
          <DataTable columns={COLS} rows={NODOS} rowKey={r => r.id} minWidth={640} />
        </Card>
        <LiveFeed items={feed} titulo="Telemetría de red" />
      </div>
    </div>
  );
};

export default Noc;
