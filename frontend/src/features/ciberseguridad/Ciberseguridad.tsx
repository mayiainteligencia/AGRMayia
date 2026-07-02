import React from 'react';
import { ShieldAlert, ShieldCheck, Lock, Bug, Globe } from 'lucide-react';
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
  { label: 'Postura de seguridad', value: '94', unit: '/100', delta: '+2', trend: 'up' as const, accentColor: '#2D6A4F', icon: <ShieldCheck size={18} /> },
  { label: 'Amenazas bloqueadas', value: '1,284', unit: '24h', delta: '+312', trend: 'neutral' as const, accentColor: '#DC2626', icon: <ShieldAlert size={18} /> },
  { label: 'Endpoints protegidos', value: '218', unit: '', delta: '100%', trend: 'up' as const, accentColor: '#0284C7', icon: <Lock size={18} /> },
  { label: 'Vulns abiertas', value: '3', unit: 'críticas', delta: '-4', trend: 'up' as const, accentColor: '#D97706', icon: <Bug size={18} /> },
];

interface EventoRow { id: string; tipo: string; origen: string; objetivo: string; severidad: 'Crítica' | 'Alta' | 'Media'; estado: 'Bloqueado' | 'En análisis'; }
const EVENTOS: EventoRow[] = [
  { id: 'SEC-9021', tipo: 'Brute force SSH',      origen: '45.12.x.x (RU)',  objetivo: 'gw-riego-01',   severidad: 'Alta',    estado: 'Bloqueado' },
  { id: 'SEC-9022', tipo: 'Escaneo de puertos',   origen: '190.8.x.x (BR)',  objetivo: 'api-lab',       severidad: 'Media',   estado: 'Bloqueado' },
  { id: 'SEC-9023', tipo: 'Phishing (correo)',    origen: 'externo',         objetivo: 'admin@agro',    severidad: 'Crítica', estado: 'En análisis' },
  { id: 'SEC-9024', tipo: 'Malware IoT (Mirai)',  origen: 'sensor-campo-14', objetivo: 'red interna',   severidad: 'Crítica', estado: 'En análisis' },
];

const COLS: DataTableColumn<EventoRow>[] = [
  { key: 'id', header: 'ID', nowrap: true },
  { key: 'tipo', header: 'Evento' },
  { key: 'origen', header: 'Origen', nowrap: true },
  { key: 'objetivo', header: 'Objetivo', nowrap: true },
  { key: 'severidad', header: 'Severidad', render: r => <Badge variant={r.severidad === 'Crítica' ? 'danger' : r.severidad === 'Alta' ? 'warning' : 'neutral'}>{r.severidad}</Badge> },
  { key: 'estado', header: 'Estado', render: r => <Badge variant={r.estado === 'Bloqueado' ? 'success' : 'info'}>{r.estado}</Badge> },
];

const ALERTAS: AlertItem[] = [
  { sev: 'crit', titulo: 'Malware IoT en sensor-campo-14', detalle: 'Patrón Mirai detectado; posible botnet en red de sensores.', accion: 'Aislar VLAN de IoT y reflashear firmware' },
  { sev: 'crit', titulo: 'Phishing dirigido a admin', detalle: 'Correo suplantando a proveedor de fertilizantes.', accion: 'Bloquear dominio y forzar reset MFA' },
  { sev: 'warn', titulo: '3 vulnerabilidades críticas sin parchar', detalle: 'CVE en gateway de riego pendiente 6 días.', accion: 'Programar ventana de parcheo esta noche' },
];

export const Ciberseguridad: React.FC = () => {
  const feed = useLiveFeed([
    { sev: 'ok',   texto: 'Intento de acceso bloqueado — geo RU' },
    { sev: 'crit', texto: 'Firmado de malware coincide — sensor-campo-14' },
    { sev: 'info', texto: 'Escaneo de vulnerabilidades completado' },
    { sev: 'warn', texto: 'Pico de tráfico saliente inusual en api-lab' },
  ], [
    { id: 1, sev: 'ok',   texto: '1,284 amenazas bloqueadas en 24h', hora: '11:20:00' },
    { id: 2, sev: 'crit', texto: 'Incidente abierto — phishing admin', hora: '11:18:41' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageTitle titulo="Ciberseguridad" bajada="Postura de seguridad, amenazas y respuesta a incidentes" />
      <AgentStrip
        agente="BRAIN™ #S — SOC" rol="Agente de seguridad" estado="Vigilando" icon={ShieldAlert}
        acciones={['Correlacionando eventos de seguridad…', 'Analizando tráfico anómalo en tiempo real…', 'Priorizando incidentes por severidad…', 'Verificando integridad de endpoints…']}
      />

      <div className="rg-4">{KPIS.map((k, i) => <StatCard key={i} id={i} {...k} />)}</div>
      <AlertStack alertas={ALERTAS} titulo="Incidentes de seguridad" />

      <div className="rg-2-1" style={{ gap: 20 }}>
        <Card>
          <SectionHeader title="Eventos recientes" subtitle="Detección y respuesta (últimas 24h)" action={<Badge variant="info"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Globe size={10} /> SIEM</span></Badge>} />
          <DataTable columns={COLS} rows={EVENTOS} rowKey={r => r.id} minWidth={680} />
        </Card>
        <LiveFeed items={feed} titulo="Telemetría en vivo" />
      </div>
    </div>
  );
};

export default Ciberseguridad;
