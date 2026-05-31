import React from 'react';
import { Scale, Plus, Zap, Bell } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { brandingConfig } from '../../config/branding';
import { reglasOperativas } from './data/reglasOperativas.dummy';
import type { PrioridadNivel, ReglaOperativa } from '../../types/agro.types';

const { colores } = brandingConfig;

const prioridadVariant: Record<PrioridadNivel, 'danger' | 'warning' | 'neutral'> = {
  alta: 'danger',
  media: 'warning',
  baja: 'neutral',
};

const estadoVariant: Record<ReglaOperativa['estado'], 'success' | 'neutral'> = {
  activa: 'success',
  inactiva: 'neutral',
};

const columns: DataTableColumn<ReglaOperativa>[] = [
  {
    key: 'id',
    header: 'Regla #',
    nowrap: true,
    render: r => (
      <span style={{ color: colores.primario, fontWeight: 700 }}>{r.id}</span>
    ),
  },
  {
    key: 'modulo',
    header: 'Módulo',
    nowrap: true,
    render: r => (
      <span style={{ color: colores.textoClaro, fontWeight: 600 }}>{r.modulo}</span>
    ),
  },
  {
    key: 'descripcion',
    header: 'Descripción',
    width: 220,
    render: r => (
      <span style={{ color: colores.textoClaro, fontWeight: 600 }}>{r.descripcion}</span>
    ),
  },
  { key: 'condicion', header: 'Condición disparadora', width: 260 },
  { key: 'accion',    header: 'Acción automática',     width: 280 },
  {
    key: 'prioridad',
    header: 'Prioridad',
    render: r => <Badge variant={prioridadVariant[r.prioridad]}>{r.prioridad}</Badge>,
  },
  {
    key: 'estado',
    header: 'Estado',
    render: r => <Badge variant={estadoVariant[r.estado]}>{r.estado}</Badge>,
  },
];

export const ReglasOperativas: React.FC = () => {
  const activas = reglasOperativas.filter(r => r.estado === 'activa').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Page header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1
            className="page-title"
            style={{ fontSize: 28, fontWeight: 700, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}
          >
            Reglas Operativas
          </h1>
          <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>
            Motor de reglas condición → acción que orquesta el ERP. Cada disparo se registra en Alertas del Sistema.
          </p>
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
          Nueva regla
        </button>
      </div>

      {/* ── Banner explicativo ── */}
      <div
        style={{
          padding: '16px 20px',
          borderRadius: 12,
          background: colores.primarioClaro,
          border: `1px solid ${colores.bordeHover}33`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: colores.gradienteAcento,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colores.textoEnOscuro,
            flexShrink: 0,
          }}
        >
          <Scale size={18} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: colores.primario, margin: 0 }}>
            Motor de Reglas Operativas — {activas} activas
          </p>
          <p style={{ fontSize: 12, color: colores.textoMedio, margin: 0, lineHeight: 1.5 }}>
            Las reglas se evalúan en tiempo real sobre los módulos de Campo, Empaque, Inventario, Laboratorio,
            Certificaciones y Plagas. Cada acción se ejecuta automáticamente y queda registrada para auditoría.
          </p>
        </div>
      </div>

      {/* ── Tabla de reglas ── */}
      <Card padding={0}>
        <div style={{ padding: '20px 24px 12px' }}>
          <SectionHeader
            title="Reglas operativas activas"
            subtitle="Condición disparadora → acción automática · ejecución en tiempo real"
            action={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: colores.secundario, fontWeight: 500 }}>
                <Zap size={14} /> Motor en ejecución
              </span>
            }
          />
        </div>

        <DataTable<ReglaOperativa>
          columns={columns}
          rows={reglasOperativas}
          rowKey={r => r.id}
          minWidth={980}
        />

        <div
          style={{
            padding: '12px 24px',
            borderTop: `1px solid ${colores.borde}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: colores.textoOscuro,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Bell size={13} /> Cada disparo se publica en Alertas del Sistema
          </span>
          <span>{reglasOperativas.length} reglas registradas</span>
        </div>
      </Card>
    </div>
  );
};

export default ReglasOperativas;
