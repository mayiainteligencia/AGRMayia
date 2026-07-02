import React from 'react';
import { HeartHandshake, Sprout, DollarSign, Users, Scale } from 'lucide-react';
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
  { label: 'Productores', value: '124', unit: '', delta: '+9', trend: 'up' as const, accentColor: '#2D6A4F', icon: <Users size={18} /> },
  { label: 'Acopio mes', value: '96', unit: 't', delta: '+14%', trend: 'up' as const, accentColor: '#52B788', icon: <Sprout size={18} /> },
  { label: 'Pagos pendientes', value: '$780', unit: 'K MXN', delta: '+$120K', trend: 'down' as const, accentColor: '#D97706', icon: <DollarSign size={18} /> },
  { label: 'Anticipos vigentes', value: '$1.9', unit: 'M MXN', delta: '+6%', trend: 'neutral' as const, accentColor: '#5C3D8F', icon: <Scale size={18} /> },
];

interface ProdRow { id: string; productor: string; zona: string; kg: number; calidad: string; anticipo: number; saldo: number; estado: 'Pagado' | 'Pendiente' | 'Anticipo'; }
const PRODS: ProdRow[] = [
  { id: 'P-014', productor: 'José Hernández',  zona: 'Jocotepec', kg: 3200, calidad: 'A',  anticipo: 40_000, saldo: 0,       estado: 'Pagado' },
  { id: 'P-027', productor: 'Coop. El Roble',  zona: 'Zapotlán',  kg: 8100, calidad: 'A',  anticipo: 120_000, saldo: 180_000, estado: 'Pendiente' },
  { id: 'P-033', productor: 'María Ic',         zona: 'Tuxcueca',  kg: 1950, calidad: 'B',  anticipo: 20_000, saldo: 44_000,  estado: 'Pendiente' },
  { id: 'P-041', productor: 'Rancho San Luis',  zona: 'Jocotepec', kg: 5600, calidad: 'A',  anticipo: 90_000, saldo: 0,       estado: 'Anticipo' },
];

const money = (n: number) => `$${(n / 1000).toLocaleString('es-MX')}K`;

const COLS: DataTableColumn<ProdRow>[] = [
  { key: 'id', header: 'ID', nowrap: true },
  { key: 'productor', header: 'Productor' },
  { key: 'zona', header: 'Zona' },
  { key: 'kg', header: 'Kg', align: 'right', nowrap: true, render: r => r.kg.toLocaleString('es-MX') },
  { key: 'calidad', header: 'Calidad', render: r => <Badge variant={r.calidad === 'A' ? 'success' : 'warning'}>{`Grado ${r.calidad}`}</Badge> },
  { key: 'anticipo', header: 'Anticipo', align: 'right', nowrap: true, render: r => money(r.anticipo) },
  { key: 'saldo', header: 'Saldo', align: 'right', nowrap: true, render: r => money(r.saldo) },
  { key: 'estado', header: 'Estado', render: r => <Badge variant={r.estado === 'Pagado' ? 'success' : r.estado === 'Pendiente' ? 'warning' : 'info'}>{r.estado}</Badge> },
];

const ALERTAS: AlertItem[] = [
  { sev: 'warn', titulo: 'Coop. El Roble — $180K pendiente', detalle: 'Pago vence en 2 días; afecta relación con 12 familias.', accion: 'Programar dispersión prioritaria' },
  { sev: 'info', titulo: 'Anticipos = 41% del capital de trabajo', detalle: 'Financiamiento a productores presiona la liquidez.', accion: 'Cubrir con línea agrícola a tasa preferencial' },
  { sev: 'ok',   titulo: 'Zona Jocotepec — calidad Grado A al 94%', detalle: 'Acopio consistente, elegible para contrato de temporada.', accion: 'Ofrecer precio garantizado por volumen' },
];

const PALANCAS: Palanca[] = [
  { nombre: 'Deuda / Capital (apalancamiento financiero)', valor: '0.54×', estado: 'ok', consejo: 'Los anticipos a productores se financian mejor con deuda agrícola barata que con capital propio; el bajo apalancamiento deja margen para crecer el acopio.' },
  { nombre: 'Costo de capital (WACC)', valor: '10.2%', estado: 'ok', consejo: 'Las líneas de crédito agrícola (FIRA/FND) bajan el WACC frente al capital propio; usarlas para anticipos mejora el retorno del acopio.' },
  { nombre: 'Apalancamiento operativo', valor: '1.4×', estado: 'ok', consejo: 'Costo mayormente variable (pago por kg): la utilidad es estable ante caídas de volumen, pero limita el efecto amplificador al crecer.' },
  { nombre: 'ROE vs ROA', valor: '16.5% / 13.9%', estado: 'ok', consejo: 'ROE > ROA: la deuda para anticipos crea valor mientras su costo (~10%) sea menor al rendimiento del acopio; hay espacio para más apalancamiento.' },
];

export const AgricultoresMenores: React.FC = () => {
  const feed = useLiveFeed([
    { sev: 'ok',   texto: 'Acopio recibido — 2.1 t de Rancho San Luis' },
    { sev: 'info', texto: 'Anticipo dispersado — $40K a José Hernández' },
    { sev: 'warn', texto: 'Pago próximo a vencer — Coop. El Roble' },
    { sev: 'ok',   texto: 'Nuevo productor registrado — zona Tuxcueca' },
  ], [
    { id: 1, sev: 'warn', texto: 'Pago pendiente supera $780K', hora: '10:02:33' },
    { id: 2, sev: 'ok',   texto: 'Calidad Grado A al 94% en Jocotepec', hora: '09:58:12' },
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageTitle titulo="Agricultores Menores" bajada="Red de productores, acopio, anticipos y dispersión de pagos" />
      <AgentStrip
        agente="BRAIN™ #A — Acopio" rol="Agente de productores" icon={HeartHandshake}
        acciones={['Conciliando acopio por productor…', 'Priorizando dispersión de pagos…', 'Evaluando calidad por zona…', 'Calculando anticipos vs liquidez…']}
      />

      <div className="rg-4">{KPIS.map((k, i) => <StatCard key={i} id={i} {...k} />)}</div>
      <AlertStack alertas={ALERTAS} />
      <FinancialLevers palancas={PALANCAS} />

      <div className="rg-2-1" style={{ gap: 20 }}>
        <Card>
          <SectionHeader title="Productores y liquidación" subtitle="Acopio, calidad, anticipos y saldos" />
          <DataTable columns={COLS} rows={PRODS} rowKey={r => r.id} minWidth={720} />
        </Card>
        <LiveFeed items={feed} />
      </div>
    </div>
  );
};

export default AgricultoresMenores;
