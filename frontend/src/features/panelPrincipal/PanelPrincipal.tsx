import React from 'react';
import {
  Wheat, Boxes, Users, Truck,
  BadgeCheck, ArrowRight, ChevronRight,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { HeroCard } from '../../components/modules/dashboardModules/Herocard';
import { brandingConfig } from '../../config/branding';
import {
  panelKPIs,
  gastosPorCategoria,
  certificacionesActivas,
  ciclosCosechaActivos,
  ordenesCompraRecientes,
  pedidosRecientes,
} from './data/panelPrincipal.dummy';
import type {
  CicloCosecha,
  EtapaFenologica,
  OrdenCompraInsumo,
  Pedido,
} from '../../types/agro.types';

const { colores } = brandingConfig;

/* ─── Helpers ─────────────────────────────────────────────── */
const ICONS = [
  <Wheat size={18} />,
  <Boxes size={18} />,
  <Users size={18} />,
  <Truck size={18} />,
];

const etapaBadge: Record<EtapaFenologica, 'neutral' | 'info' | 'success' | 'warning' | 'danger'> = {
  dormancia:   'neutral',
  brotacion:   'info',
  floracion:   'info',
  cuajado:     'success',
  maduracion:  'warning',
  cosecha:     'danger',
};

const etapaLabel: Record<EtapaFenologica, string> = {
  dormancia:  'Dormancia',
  brotacion:  'Brotación',
  floracion:  'Floración',
  cuajado:    'Cuajado',
  maduracion: 'Maduración',
  cosecha:    'Cosecha',
};

const ocEstadoVariant: Record<OrdenCompraInsumo['estado'], 'warning' | 'success' | 'info' | 'neutral'> = {
  pendiente:  'warning',
  confirmada: 'success',
  recibida:   'info',
  cancelada:  'neutral',
};

const pedidoEstadoVariant: Record<Pedido['estado'], 'warning' | 'success' | 'info' | 'neutral'> = {
  pendiente:    'warning',
  confirmado:   'info',
  'en-proceso': 'info',
  enviado:      'success',
  entregado:    'neutral',
};

const fmtMxn = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);

const fmtNum = (n: number) =>
  new Intl.NumberFormat('es-MX').format(n);

/* ─── Reusable bits ───────────────────────────────────────── */
const VerTodo: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: colores.secundario,
      fontSize: 12,
      fontWeight: 600,
    }}
  >
    Ver todo <ArrowRight size={13} />
  </button>
);

/* ─── Column sets ─────────────────────────────────────────── */

const ciclosColumns: DataTableColumn<CicloCosecha>[] = [
  {
    key: 'cultivo',
    header: 'Cultivo',
    render: c => <span style={{ color: colores.textoClaro, fontWeight: 600 }}>{c.cultivo}</span>,
  },
  { key: 'campo',    header: 'Campo' },
  { key: 'sembrado', header: 'Sembrado', nowrap: true },
  {
    key: 'etapa',
    header: 'Etapa',
    render: c => <Badge variant={etapaBadge[c.etapa]}>{etapaLabel[c.etapa]}</Badge>,
  },
  {
    key: 'diasActivo',
    header: 'Días Activo',
    render: c => <span style={{ fontWeight: 600 }}>{c.diasActivo} d</span>,
  },
  {
    key: 'accion',
    header: 'Acción',
    align: 'right',
    render: () => (
      <button
        type="button"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '6px 12px',
          borderRadius: 8,
          border: `1px solid ${colores.bordeHover}55`,
          background: colores.primarioClaro,
          color: colores.primario,
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Avanzar etapa <ChevronRight size={13} />
      </button>
    ),
  },
];

const ocColumns: DataTableColumn<OrdenCompraInsumo>[] = [
  {
    key: 'id',
    header: 'OC #',
    nowrap: true,
    render: oc => (
      <>
        <span style={{ color: colores.primario, fontWeight: 700 }}>{oc.id}</span>
        {oc.autoSugerida && (
          <span
            style={{
              marginLeft: 6,
              fontSize: 9,
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: 4,
              background: colores.acentoBerry + '22',
              color: colores.acentoBerry,
              letterSpacing: '0.04em',
            }}
          >
            AUTO
          </span>
        )}
      </>
    ),
  },
  { key: 'proveedor', header: 'Proveedor' },
  {
    key: 'totalMxn',
    header: 'Total',
    align: 'right',
    nowrap: true,
    render: oc => (
      <span style={{ fontWeight: 600, color: colores.textoClaro }}>{fmtMxn(oc.totalMxn)}</span>
    ),
  },
  {
    key: 'estado',
    header: 'Estado',
    render: oc => <Badge variant={ocEstadoVariant[oc.estado]}>{oc.estado}</Badge>,
  },
];

const pedidoColumns: DataTableColumn<Pedido>[] = [
  {
    key: 'id',
    header: 'Pedido #',
    nowrap: true,
    render: p => <span style={{ color: colores.primario, fontWeight: 700 }}>{p.id}</span>,
  },
  { key: 'cliente', header: 'Cliente' },
  {
    key: 'kilos',
    header: 'KG',
    align: 'right',
    nowrap: true,
    render: p => (
      <span style={{ fontWeight: 600, color: colores.textoClaro }}>{fmtNum(p.kilos)} kg</span>
    ),
  },
  {
    key: 'estado',
    header: 'Estado',
    render: p => <Badge variant={pedidoEstadoVariant[p.estado]}>{p.estado}</Badge>,
  },
];

/* ─── Página ──────────────────────────────────────────────── */
export const PanelPrincipal: React.FC = () => {
  const maxGasto = Math.max(...gastosPorCategoria.map(g => g.montoMxn));
  const totalGasto = gastosPorCategoria.reduce((s, g) => s + g.montoMxn, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Welcome header ── */}
      <div className="welcome-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1
            className="page-title"
            style={{ fontSize: 32, fontWeight: 300, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}
          >
            Panel <span style={{ fontWeight: 700 }}>Principal.</span>
          </h1>
          <p style={{ fontSize: 16, color: colores.textoOscuro, margin: '6px 0 0 0', fontWeight: 300 }}>
            Vista global de operación — Temporada 2026
          </p>
        </div>
        <div className="welcome-logos" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'rgba(0,0,0,0.45)', borderRadius: 12, padding: '8px 14px' }}>
            <img src="/assets/logosNativos/mayiaLogoBlanco.png" alt="Mayia" style={{ height: 32, objectFit: 'contain', display: 'block' }} />
          </div>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="rg-4">
        {panelKPIs.map((kpi, i) => (
          <StatCard key={kpi.id} {...kpi} icon={ICONS[i]} />
        ))}
      </div>

      {/* ── Gastos por categoría · Certificaciones activas ── */}
      <div className="rg-2-1">
        <Card>
          <SectionHeader
            title="Gastos por categoría"
            subtitle={`Total acumulado: ${fmtMxn(totalGasto)}`}
            action={<VerTodo />}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {gastosPorCategoria.map(g => {
              const pct = (g.montoMxn / maxGasto) * 100;
              return (
                <div key={g.categoria} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: colores.textoMedio, fontWeight: 500 }}>
                      {g.categoria}
                    </span>
                    <span style={{ fontSize: 13, color: colores.textoClaro, fontWeight: 700 }}>
                      {fmtMxn(g.montoMxn)}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      borderRadius: 6,
                      background: colores.fondoTerciario,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: colores.gradienteAcento,
                        borderRadius: 6,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <SectionHeader
            title="Certificaciones activas"
            subtitle={`${certificacionesActivas.length} vigentes`}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {certificacionesActivas.map(c => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: `1px solid ${colores.borde}`,
                  background: colores.fondoSecundario,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: colores.primarioClaro,
                    color: colores.secundario,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <BadgeCheck size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: colores.textoClaro, margin: 0 }}>
                    {c.nombre}
                  </p>
                  {c.numero && (
                    <p style={{ fontSize: 11, color: colores.textoOscuro, margin: 0 }}>
                      {c.numero} · vence {c.vencimiento}
                    </p>
                  )}
                </div>
                <Badge variant="success">Vigente</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Ciclos de cosecha activos ── */}
      <Card padding={0}>
        <div style={{ padding: '20px 24px 12px' }}>
          <SectionHeader
            title="Ciclos de cosecha activos"
            subtitle={`${ciclosCosechaActivos.length} ciclos en operación`}
            action={<VerTodo />}
          />
        </div>
        <DataTable<CicloCosecha>
          columns={ciclosColumns}
          rows={ciclosCosechaActivos}
          rowKey={c => c.id}
        />
      </Card>

      {/* ── OC recientes · Pedidos recientes ── */}
      <div className="rg-2">
        <Card padding={0}>
          <div style={{ padding: '20px 24px 12px' }}>
            <SectionHeader
              title="Órdenes de compra recientes"
              subtitle="OC a proveedores (algunas auto-sugeridas por OP-003)"
              action={<VerTodo />}
            />
          </div>
          <DataTable<OrdenCompraInsumo>
            columns={ocColumns}
            rows={ordenesCompraRecientes}
            rowKey={oc => oc.id}
          />
        </Card>

        <Card padding={0}>
          <div style={{ padding: '20px 24px 12px' }}>
            <SectionHeader
              title="Pedidos recientes"
              subtitle="Pedidos de cliente — MXN / USD"
              action={<VerTodo />}
            />
          </div>
          <DataTable<Pedido>
            columns={pedidoColumns}
            rows={pedidosRecientes}
            rowKey={p => p.id}
          />
        </Card>
      </div>

      {/* ── MAYIA — embebido sin modificar ── */}
      <HeroCard />
    </div>
  );
};

export default PanelPrincipal;
