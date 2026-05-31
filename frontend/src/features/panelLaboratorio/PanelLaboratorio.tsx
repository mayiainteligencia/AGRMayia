import React from 'react';
import { Clock, CheckCircle, AlertOctagon, FileText } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { brandingConfig } from '../../config/branding';
import { labKPIs, personalLab, analisisRecientes, type PersonalLab } from './data/panelLaboratorio.dummy';
import type { AnalisisLab } from '../../types/agro.types';

const { colores } = brandingConfig;

const ICONS = [
  <Clock size={18} />,
  <CheckCircle size={18} />,
  <AlertOctagon size={18} />,
  <FileText size={18} />,
];

const estadoPersonal: Record<PersonalLab['estado'], { variant: 'success' | 'info' | 'warning'; label: string }> = {
  disponible:    { variant: 'success', label: 'Disponible' },
  ocupado:       { variant: 'info',    label: 'Ocupado' },
  capacitacion:  { variant: 'warning', label: 'Capacitación' },
};

const estadoAnalisis: Record<AnalisisLab['estado'], 'success' | 'danger' | 'warning'> = {
  conforme:     'success',
  'no-conforme': 'danger',
  pendiente:    'warning',
};

const brainChip = (b: AnalisisLab['brain']) => {
  if (!b) return null;
  return (
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
      BRAIN™ #{b}
    </span>
  );
};

const personalColumns: DataTableColumn<PersonalLab>[] = [
  {
    key: 'nombre',
    header: 'Nombre',
    render: p => <span style={{ color: colores.textoClaro, fontWeight: 600 }}>{p.nombre}</span>,
  },
  { key: 'especialidad', header: 'Especialidad' },
  {
    key: 'analisisActivos',
    header: 'Análisis Activos',
    align: 'right',
    render: p => <span style={{ fontWeight: 600 }}>{p.analisisActivos}</span>,
  },
  {
    key: 'estado',
    header: 'Estado',
    render: p => <Badge variant={estadoPersonal[p.estado].variant}>{estadoPersonal[p.estado].label}</Badge>,
  },
];

const analisisColumns: DataTableColumn<AnalisisLab>[] = [
  {
    key: 'id',
    header: 'ID',
    nowrap: true,
    render: a => <span style={{ color: colores.primario, fontWeight: 700 }}>{a.id}</span>,
  },
  { key: 'tipo', header: 'Tipo', nowrap: true },
  {
    key: 'muestra',
    header: 'Muestra',
    render: a => <span style={{ color: colores.textoClaro, fontWeight: 600 }}>{a.muestra}</span>,
  },
  { key: 'responsable', header: 'Responsable' },
  {
    key: 'estado',
    header: 'Estado',
    render: a => (
      <>
        <Badge variant={estadoAnalisis[a.estado]}>{a.estado}</Badge>
        {brainChip(a.brain)}
      </>
    ),
  },
];

export const PanelLaboratorio: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h1
        className="page-title"
        style={{ fontSize: 28, fontWeight: 700, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}
      >
        Panel Laboratorio
      </h1>
      <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>
        Análisis activos · personal · estado de conformidad · módulos BRAIN™ #F / #E
      </p>
    </div>

    <div className="rg-4">
      {labKPIs.map((kpi, i) => (
        <StatCard key={kpi.id} {...kpi} icon={ICONS[i]} />
      ))}
    </div>

    <Card padding={0}>
      <div style={{ padding: '20px 24px 12px' }}>
        <SectionHeader
          title="Personal de Laboratorio"
          subtitle="Carga actual y disponibilidad por especialidad"
        />
      </div>
      <DataTable<PersonalLab>
        columns={personalColumns}
        rows={personalLab}
        rowKey={p => p.id}
      />
    </Card>

    <Card padding={0}>
      <div style={{ padding: '20px 24px 12px' }}>
        <SectionHeader
          title="Análisis recientes"
          subtitle="Últimos análisis procesados por el laboratorio y los motores BRAIN™"
        />
      </div>
      <DataTable<AnalisisLab>
        columns={analisisColumns}
        rows={analisisRecientes}
        rowKey={a => a.id}
        minWidth={900}
      />
    </Card>
  </div>
);

export default PanelLaboratorio;
