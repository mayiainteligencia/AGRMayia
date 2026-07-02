import React from 'react';
import { Users, DollarSign, Repeat, Wallet, Clock } from 'lucide-react';
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
  { label: 'Clientes activos', value: '38', unit: '', delta: '+4', trend: 'up' as const, accentColor: '#2D6A4F', icon: <Users size={18} /> },
  { label: 'Ingreso mes', value: '$4.82', unit: 'M MXN', delta: '+11%', trend: 'up' as const, accentColor: '#52B788', icon: <DollarSign size={18} /> },
  { label: 'Recompra', value: '72', unit: '%', delta: '+3%', trend: 'up' as const, accentColor: '#5C3D8F', icon: <Repeat size={18} /> },
  { label: 'Cuentas por cobrar', value: '$1.14', unit: 'M MXN', delta: '+$180K', trend: 'down' as const, accentColor: '#D97706', icon: <Clock size={18} /> },
];

interface ClienteRow { id: string; cliente: string; canal: string; kg: number; ticket: number; saldo: number; estado: 'Al día' | 'Por vencer' | 'Vencido'; }
const CLIENTES: ClienteRow[] = [
  { id: 'C-01', cliente: 'Driscoll’s Norte',   canal: 'Exportación', kg: 42000, ticket: 1_680_000, saldo: 0,        estado: 'Al día' },
  { id: 'C-02', cliente: 'Walmart México',      canal: 'Retail',      kg: 28500, ticket: 1_140_000, saldo: 340_000,  estado: 'Por vencer' },
  { id: 'C-03', cliente: 'Central de Abastos',  canal: 'Mayoreo',     kg: 19800, ticket: 594_000,   saldo: 512_000,  estado: 'Vencido' },
  { id: 'C-04', cliente: 'La Comer',            canal: 'Retail',      kg: 15200, ticket: 608_000,   saldo: 120_000,  estado: 'Por vencer' },
  { id: 'C-05', cliente: 'Berries EU Export',   canal: 'Exportación', kg: 33100, ticket: 1_986_000, saldo: 168_000,  estado: 'Al día' },
];

const money = (n: number) => `$${(n / 1000).toLocaleString('es-MX')}K`;

const COLS: DataTableColumn<ClienteRow>[] = [
  { key: 'id', header: 'ID', nowrap: true },
  { key: 'cliente', header: 'Cliente' },
  { key: 'canal', header: 'Canal', render: r => <Badge variant="neutral">{r.canal}</Badge> },
  { key: 'kg', header: 'Kg', align: 'right', nowrap: true, render: r => r.kg.toLocaleString('es-MX') },
  { key: 'ticket', header: 'Ticket', align: 'right', nowrap: true, render: r => money(r.ticket) },
  { key: 'saldo', header: 'Saldo', align: 'right', nowrap: true, render: r => money(r.saldo) },
  { key: 'estado', header: 'Cobranza', render: r => <Badge variant={r.estado === 'Al día' ? 'success' : r.estado === 'Por vencer' ? 'warning' : 'danger'}>{r.estado}</Badge> },
];

const ALERTAS: AlertItem[] = [
  { sev: 'crit', titulo: 'Central de Abastos — $512K vencido', detalle: 'Saldo con 18 días de mora, supera límite de crédito.', accion: 'Suspender despacho y renegociar plazo' },
  { sev: 'warn', titulo: 'Concentración de cartera', detalle: 'Driscoll’s + Berries EU = 43% del ingreso mensual.', accion: 'Diversificar canal mayoreo nacional' },
  { sev: 'info', titulo: 'Walmart — pedido recurrente', detalle: 'Recompra mensual estable, candidato a contrato anual.', accion: 'Ofrecer precio fijo por volumen' },
];

const PALANCAS: Palanca[] = [
  { nombre: 'Deuda / Capital (apalancamiento financiero)', valor: '0.68×', estado: 'ok', consejo: 'Financiar el capital de trabajo de la cartera con deuda barata eleva el ROE mientras el costo de la deuda sea menor al rendimiento de la operación.' },
  { nombre: 'Costo de capital (WACC)', valor: '11.4%', estado: 'warn', consejo: 'Mezcla deuda/capital actual está por encima del óptimo; sustituir factoraje caro por línea revolvente reduce el WACC.' },
  { nombre: 'Apalancamiento operativo', valor: '1.9×', estado: 'ok', consejo: 'Alta proporción de costo fijo en empaque: cada +10% en ventas amplifica la utilidad, pero exige asegurar volumen contratado.' },
  { nombre: 'ROE vs ROA', valor: '18.2% / 12.6%', estado: 'ok', consejo: 'ROE > ROA confirma que la deuda genera valor. Mantener mientras el rendimiento operativo supere el costo de la deuda.' },
];

export const Clientes: React.FC = () => {
  const feed = useLiveFeed([
    { sev: 'ok',   texto: 'Pago recibido — Driscoll’s Norte $420K' },
    { sev: 'info', texto: 'Nuevo pedido registrado — La Comer 3.2 t' },
    { sev: 'warn', texto: 'Cliente Central de Abastos cerca de límite de crédito' },
    { sev: 'ok',   texto: 'Contrato anual firmado — Berries EU Export' },
  ], [
    { id: 1, sev: 'crit', texto: 'Saldo vencido detectado — Central de Abastos', hora: '08:42:10' },
    { id: 2, sev: 'ok',   texto: 'Recompra confirmada — Walmart México', hora: '08:39:55' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageTitle titulo="Clientes" bajada="Directorio de compradores, cartera y cobranza" />
      <AgentStrip
        agente="BRAIN™ #C — Comercial" rol="Agente de cartera" icon={Wallet}
        acciones={['Analizando riesgo de crédito por cliente…', 'Priorizando cobranza vencida…', 'Detectando oportunidades de recompra…', 'Proyectando ingreso a 30 días…']}
      />

      {/* info arriba */}
      <div className="rg-4">{KPIS.map((k, i) => <StatCard key={i} id={i} {...k} />)}</div>

      {/* alertas */}
      <AlertStack alertas={ALERTAS} />

      {/* palancas financieras */}
      <FinancialLevers palancas={PALANCAS} />

      <div className="rg-2-1" style={{ gap: 20 }}>
        <Card>
          <SectionHeader title="Cartera de clientes" subtitle="Volumen, ticket y estado de cobranza" />
          <DataTable columns={COLS} rows={CLIENTES} rowKey={r => r.id} minWidth={720} />
        </Card>
        <LiveFeed items={feed} />
      </div>
    </div>
  );
};

export default Clientes;
