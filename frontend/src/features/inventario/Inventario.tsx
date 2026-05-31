import React from 'react';
import { Plus, Sliders, X, PackageSearch } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { brandingConfig } from '../../config/branding';
import { articulos, valorTotalInventario } from './data/inventario.dummy';
import type { ArticuloInventario } from '../../types/agro.types';

const { colores } = brandingConfig;

const fmtMxn = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 }).format(n);

const estadoVariant: Record<ArticuloInventario['estado'], 'success' | 'danger'> = {
  ok: 'success',
  alerta: 'danger',
};

const iconBtn = (color: string, hover: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: 7,
  border: `1px solid ${hover}33`,
  background: `${color}11`,
  color,
  cursor: 'pointer',
});

const columns: DataTableColumn<ArticuloInventario>[] = [
  {
    key: 'nombre',
    header: 'Artículo',
    render: a => (
      <span style={{ color: colores.textoClaro, fontWeight: 600 }}>{a.nombre}</span>
    ),
  },
  {
    key: 'sku',
    header: 'SKU',
    nowrap: true,
    render: a => <span style={{ color: colores.textoOscuro, fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{a.sku}</span>,
  },
  {
    key: 'cantidad',
    header: 'Cantidad',
    align: 'right',
    render: a => <span style={{ fontWeight: 600 }}>{a.cantidad.toLocaleString('es-MX')}</span>,
  },
  { key: 'unidad', header: 'Unidad', nowrap: true },
  {
    key: 'costoUnitario',
    header: 'Costo Unit.',
    align: 'right',
    nowrap: true,
    render: a => fmtMxn(a.costoUnitario),
  },
  { key: 'ubicacion', header: 'Ubicación', nowrap: true },
  {
    key: 'minimo',
    header: 'Mínimo',
    align: 'right',
    render: a => <span style={{ color: colores.textoOscuro }}>{a.minimo.toLocaleString('es-MX')}</span>,
  },
  { key: 'categoria', header: 'Categoría' },
  { key: 'proveedor', header: 'Proveedor' },
  {
    key: 'estado',
    header: 'Estado',
    render: a => <Badge variant={estadoVariant[a.estado]}>{a.estado === 'ok' ? 'OK' : 'Alerta'}</Badge>,
  },
  {
    key: 'acciones',
    header: 'Acción',
    align: 'right',
    render: () => (
      <div style={{ display: 'inline-flex', gap: 6 }}>
        <button type="button" title="Ajustar" style={iconBtn(colores.secundario, colores.bordeHover)}>
          <Sliders size={14} />
        </button>
        <button type="button" title="Eliminar" style={iconBtn(colores.peligro, colores.peligro)}>
          <X size={14} />
        </button>
      </div>
    ),
  },
];

export const Inventario: React.FC = () => {
  const enAlerta = articulos.filter(a => a.estado === 'alerta').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1
          className="page-title"
          style={{ fontSize: 28, fontWeight: 700, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}
        >
          Inventario
        </h1>
        <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>
          Insumos y materiales · alertas automáticas por umbral mínimo (regla OP-003)
        </p>
      </div>

      {/* ── Top bar: valor total + acción ── */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 48, height: 48, borderRadius: 12,
                background: colores.gradientePrimario,
                color: colores.textoEnOscuro,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <PackageSearch size={22} />
            </div>
            <div>
              <p style={{ fontSize: 11, color: colores.textoOscuro, margin: 0, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Valor total del inventario
              </p>
              <p style={{ fontSize: 26, color: colores.textoClaro, margin: 0, fontWeight: 700, letterSpacing: '-0.5px' }}>
                {fmtMxn(valorTotalInventario)}
              </p>
              <p style={{ fontSize: 12, color: enAlerta > 0 ? colores.peligro : colores.exito, margin: '2px 0 0 0', fontWeight: 500 }}>
                {enAlerta > 0 ? `${enAlerta} artículo(s) en alerta` : 'Todos los artículos en nivel OK'}
              </p>
            </div>
          </div>

          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              background: colores.gradientePrimario,
              color: colores.textoEnOscuro,
              fontSize: 13,
              fontWeight: 600,
              boxShadow: colores.sombraMedia,
            }}
          >
            <Plus size={16} />
            Agregar artículo
          </button>
        </div>
      </Card>

      {/* ── Tabla ── */}
      <Card padding={0}>
        <div style={{ padding: '20px 24px 12px' }}>
          <SectionHeader
            title="Catálogo de artículos"
            subtitle={`${articulos.length} artículos · estado calculado contra mínimo`}
          />
        </div>
        <DataTable<ArticuloInventario>
          columns={columns}
          rows={articulos}
          rowKey={a => a.id}
          minWidth={1100}
        />
      </Card>
    </div>
  );
};

export default Inventario;
