import React from 'react';
import { Salad, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { brandingConfig } from '../../config/branding';
import { analisisAlimentos, parametrosMonitoreados } from './data/analisisAlimentos.dummy';
import type { AnalisisLab, ParametroMonitoreado } from '../../types/agro.types';

const { colores } = brandingConfig;

const conformidadVariant: Record<AnalisisLab['estado'], 'success' | 'danger' | 'warning'> = {
  conforme:     'success',
  'no-conforme': 'danger',
  pendiente:    'warning',
};

const analisisColumns: DataTableColumn<AnalisisLab>[] = [
  { key: 'id',          header: 'ID',          nowrap: true, render: a => <span style={{ color: colores.primario, fontWeight: 700 }}>{a.id}</span> },
  { key: 'muestra',     header: 'Muestra',     render: a => <span style={{ color: colores.textoClaro, fontWeight: 600 }}>{a.muestra}</span> },
  { key: 'lote',        header: 'Lote',        nowrap: true, render: a => a.lote ?? '—' },
  { key: 'tipo',        header: 'Tipo',        nowrap: true },
  { key: 'parametros',  header: 'Parámetros',  width: 220 },
  { key: 'resultado',   header: 'Resultado',   width: 200, render: a => <span style={{ fontWeight: 600 }}>{a.resultado}</span> },
  { key: 'norma',       header: 'Norma',       nowrap: true },
  { key: 'responsable', header: 'Responsable' },
  { key: 'fecha',       header: 'Fecha',       nowrap: true },
  { key: 'estado',      header: 'Estado',      render: a => <Badge variant={conformidadVariant[a.estado]}>{a.estado}</Badge> },
];

const parametrosColumns: DataTableColumn<ParametroMonitoreado>[] = [
  { key: 'parametro',       header: 'Parámetro', render: p => <span style={{ color: colores.textoClaro, fontWeight: 600 }}>{p.parametro}</span> },
  { key: 'metodo',          header: 'Método' },
  { key: 'lmp',             header: 'LMP',        nowrap: true, render: p => <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{p.lmp}</span> },
  { key: 'norma',           header: 'Norma',      nowrap: true },
  { key: 'frecuencia',      header: 'Frecuencia', nowrap: true },
  { key: 'ultimoResultado', header: 'Último Resultado', nowrap: true, render: p => <span style={{ fontWeight: 600 }}>{p.ultimoResultado}</span> },
  { key: 'estado',          header: 'Estado',     render: p => <Badge variant={conformidadVariant[p.estado]}>{p.estado}</Badge> },
];

export const AnalisisAlimentos: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h1
        className="page-title"
        style={{ fontSize: 28, fontWeight: 700, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}
      >
        Análisis de Alimentos
      </h1>
      <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>
        Inocuidad de fruto y empaque · BRAIN™ #F etiqueta normativa automáticamente
      </p>
    </div>

    {/* ── Banner BRAIN™ #F ── */}
    <div
      style={{
        padding: '14px 18px',
        borderRadius: 12,
        background: `linear-gradient(135deg, ${colores.acentoBerry}1A 0%, ${colores.acentoBerry}0D 100%)`,
        border: `1px solid ${colores.acentoBerry}33`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <div
        style={{
          width: 40, height: 40, borderRadius: 10,
          background: colores.gradienteBerry,
          color: colores.textoEnOscuro,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Salad size={18} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: colores.acentoBerry, margin: 0, letterSpacing: '0.02em' }}>
          Procesado por BRAIN™ #F
        </p>
        <p style={{ fontSize: 12, color: colores.textoMedio, margin: 0, lineHeight: 1.5 }}>
          Marco normativo: COFEPRIS · NOM-251 · FDA 21 CFR · Cada análisis se etiqueta y archiva con su norma aplicable.
        </p>
      </div>
      <div style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <ShieldCheck size={14} color={colores.exito} />
        <span style={{ fontSize: 12, fontWeight: 600, color: colores.exito }}>Cumplimiento activo</span>
      </div>
    </div>

    {/* ── Tabla análisis ── */}
    <Card padding={0}>
      <div style={{ padding: '20px 24px 12px' }}>
        <SectionHeader
          title="Análisis de alimentos — últimos registros"
          subtitle={`${analisisAlimentos.length} análisis · procesados por BRAIN™ #F`}
        />
      </div>
      <DataTable<AnalisisLab>
        columns={analisisColumns}
        rows={analisisAlimentos}
        rowKey={a => a.id}
        minWidth={1200}
      />
    </Card>

    {/* ── Parámetros monitoreados ── */}
    <Card padding={0}>
      <div style={{ padding: '20px 24px 12px' }}>
        <SectionHeader
          title="Parámetros monitoreados"
          subtitle="Métricas activas con LMP, norma y frecuencia"
        />
      </div>
      <DataTable<ParametroMonitoreado>
        columns={parametrosColumns}
        rows={parametrosMonitoreados}
        rowKey={p => p.parametro}
        minWidth={920}
      />
    </Card>
  </div>
);

export default AnalisisAlimentos;
