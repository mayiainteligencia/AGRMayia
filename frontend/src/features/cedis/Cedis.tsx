import React from 'react';
import { Warehouse, Snowflake, Truck, Percent, Boxes } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import {
  PageTitle, AgentStrip, AlertStack, FinancialLevers, LiveFeed, useLiveFeed,
  type AlertItem, type Palanca,
} from '../../components/command/CommandKit';

const KPIS = [
  { label: 'Ocupación CEDIS', value: '86', unit: '%', delta: '+5%', trend: 'up' as const, accentColor: '#2D6A4F', icon: <Boxes size={18} /> },
  { label: 'Costo logístico', value: '$1.36', unit: 'M MXN', delta: '+7%', trend: 'down' as const, accentColor: '#D97706', icon: <Truck size={18} /> },
  { label: 'Cadena de frío', value: '99.4', unit: '%', delta: '+0.2%', trend: 'up' as const, accentColor: '#0284C7', icon: <Snowflake size={18} /> },
  { label: 'Merma en tránsito', value: '1.8', unit: '%', delta: '-0.4%', trend: 'up' as const, accentColor: '#5C3D8F', icon: <Percent size={18} /> },
];

interface CedisRow { id: string; cedis: string; capacidad: number; ocupacion: number; temp: number; costoMes: number; estado: 'Óptimo' | 'Saturado' | 'Alerta'; }
const CEDIS: CedisRow[] = [
  { id: 'CD-01', cedis: 'CEDIS Los Reyes',   capacidad: 1200, ocupacion: 92, temp: 0.4,  costoMes: 480_000, estado: 'Saturado' },
  { id: 'CD-02', cedis: 'CEDIS Bajío',       capacidad: 900,  ocupacion: 78, temp: 0.1,  costoMes: 360_000, estado: 'Óptimo' },
  { id: 'CD-03', cedis: 'CEDIS Frontera',    capacidad: 1500, ocupacion: 84, temp: 1.6,  costoMes: 520_000, estado: 'Alerta' },
];

const money = (n: number) => `$${(n / 1000).toLocaleString('es-MX')}K`;

const COLS: DataTableColumn<CedisRow>[] = [
  { key: 'id', header: 'ID', nowrap: true },
  { key: 'cedis', header: 'CEDIS' },
  { key: 'capacidad', header: 'Cap. (t)', align: 'right', nowrap: true },
  { key: 'ocupacion', header: 'Ocup.', align: 'right', render: r => `${r.ocupacion}%` },
  { key: 'temp', header: 'Temp °C', align: 'right', render: r => r.temp.toFixed(1) },
  { key: 'costoMes', header: 'Costo/mes', align: 'right', nowrap: true, render: r => money(r.costoMes) },
  { key: 'estado', header: 'Estado', render: r => <Badge variant={r.estado === 'Óptimo' ? 'success' : r.estado === 'Saturado' ? 'warning' : 'danger'}>{r.estado}</Badge> },
];

const ALERTAS: AlertItem[] = [
  { sev: 'crit', titulo: 'CEDIS Frontera — temperatura 1.6 °C', detalle: 'Fuera de rango objetivo (0–1 °C) en cámara 3.', accion: 'Revisar compresor y reubicar lote' },
  { sev: 'warn', titulo: 'CEDIS Los Reyes al 92%', detalle: 'Saturación limita recepción de la cosecha del jueves.', accion: 'Desviar 8 t a CEDIS Bajío' },
  { sev: 'info', titulo: 'Costo logístico +7% vs mes anterior', detalle: 'Alza de diésel y rutas sub-óptimas.', accion: 'Optimizar consolidación de envíos' },
];

const PALANCAS: Palanca[] = [
  { nombre: 'Deuda / Capital (apalancamiento financiero)', valor: '0.91×', estado: 'warn', consejo: 'La inversión en cámaras frías se financia bien con deuda de largo plazo, pero 0.91× ya presiona el flujo; no exceder 1.0× sin asegurar contratos.' },
  { nombre: 'Costo de capital (WACC)', valor: '12.1%', estado: 'warn', consejo: 'Un CEDIS es intensivo en activo fijo: buscar arrendamiento financiero o leaseback reduce el WACC frente a compra directa.' },
  { nombre: 'Apalancamiento operativo', valor: '2.6×', estado: 'crit', consejo: 'Costo fijo muy alto (refrigeración, renta). A baja ocupación la utilidad cae rápido: mantener ocupación > 80% es la palanca crítica.' },
  { nombre: 'ROA', valor: '9.8%', estado: 'warn', consejo: 'Activos pesados bajan el ROA; usar deuda barata para que ROE supere al ROA solo funciona si la ocupación sostiene el margen.' },
];

export const Cedis: React.FC = () => {
  const feed = useLiveFeed([
    { sev: 'ok',   texto: 'Recepción registrada — 6.4 t en CEDIS Bajío' },
    { sev: 'warn', texto: 'CEDIS Frontera — pico de temperatura en cámara 3' },
    { sev: 'info', texto: 'Ruta consolidada — ahorro estimado $12K' },
    { sev: 'ok',   texto: 'Despacho confirmado — 14 t a exportación' },
  ], [
    { id: 1, sev: 'warn', texto: 'Ocupación CEDIS Los Reyes superó 90%', hora: '09:14:02' },
    { id: 2, sev: 'ok',   texto: 'Cadena de frío estable — 99.4%', hora: '09:10:41' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageTitle titulo="Cedís" bajada="Centros de distribución, cadena de frío y costo logístico" />
      <AgentStrip
        agente="BRAIN™ #L — Logística" rol="Agente de distribución" icon={Warehouse}
        acciones={['Balanceando ocupación entre CEDIS…', 'Vigilando cadena de frío en tiempo real…', 'Optimizando consolidación de rutas…', 'Estimando costo logístico por tonelada…']}
      />

      <div className="rg-4">{KPIS.map((k, i) => <StatCard key={i} id={i} {...k} />)}</div>
      <AlertStack alertas={ALERTAS} />
      <FinancialLevers palancas={PALANCAS} />

      <div className="rg-2-1" style={{ gap: 20 }}>
        <Card>
          <SectionHeader title="Centros de distribución" subtitle="Capacidad, ocupación, temperatura y costo" />
          <DataTable columns={COLS} rows={CEDIS} rowKey={r => r.id} minWidth={640} />
        </Card>
        <LiveFeed items={feed} />
      </div>
    </div>
  );
};

export default Cedis;
