import React from 'react';
import { Sun, Cloud, CloudDrizzle, CloudLightning, CloudSun } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { brandingConfig } from '../../config/branding';
import { historialClima } from './data/historialClimatico.dummy';
import type { LecturaClimatica } from '../../types/agro.types';

const { colores } = brandingConfig;

const condicionIcon: Record<string, React.ReactNode> = {
  soleado:  <Sun size={16} color={colores.advertencia} />,
  parcial:  <CloudSun size={16} color={colores.info} />,
  nublado:  <Cloud size={16} color={colores.textoOscuro} />,
  lluvia:   <CloudDrizzle size={16} color={colores.info} />,
  tormenta: <CloudLightning size={16} color={colores.acentoBerry} />,
};

const riesgoVariant: Record<LecturaClimatica['riesgo'], 'success' | 'warning' | 'danger'> = {
  bajo:  'success',
  medio: 'warning',
  alto:  'danger',
};

const columns: DataTableColumn<LecturaClimatica>[] = [
  { key: 'fecha',    header: 'Fecha',     nowrap: true, render: l => <span style={{ color: colores.textoClaro, fontWeight: 600 }}>{l.fecha}</span> },
  { key: 'tempProm', header: 'T. Prom °C', align: 'right', render: l => l.tempProm.toFixed(1) },
  { key: 'tempMin',  header: 'T. Mín °C',  align: 'right', render: l => <span style={{ color: colores.info }}>{l.tempMin.toFixed(1)}</span> },
  { key: 'tempMax',  header: 'T. Máx °C',  align: 'right', render: l => <span style={{ color: colores.peligro }}>{l.tempMax.toFixed(1)}</span> },
  { key: 'presion',  header: 'Presión hPa', align: 'right' },
  { key: 'humedad',  header: 'Humedad %',  align: 'right' },
  { key: 'viento',   header: 'Viento km/h', align: 'right', nowrap: true, render: l => <span>{l.viento}{l.vientoDir ? ` ${l.vientoDir}` : ''}</span> },
  { key: 'lluvia',   header: 'Lluvia mm',  align: 'right', render: l => <span style={{ fontWeight: l.lluvia > 5 ? 700 : 400, color: l.lluvia > 5 ? colores.info : colores.textoMedio }}>{l.lluvia.toFixed(1)}</span> },
  {
    key: 'condicion',
    header: 'Condición',
    render: l => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {condicionIcon[l.condicion] ?? null}
        <span style={{ textTransform: 'capitalize' }}>{l.condicion}</span>
      </span>
    ),
  },
  { key: 'riesgo', header: 'Riesgo', render: l => <Badge variant={riesgoVariant[l.riesgo]}>{l.riesgo}</Badge> },
];

export const HistorialClimatico: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h1
        className="page-title"
        style={{ fontSize: 28, fontWeight: 700, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}
      >
        Historial Climático
      </h1>
      <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>
        Bitácora diaria de la estación meteorológica con riesgo agronómico calculado
      </p>
    </div>

    <Card padding={0}>
      <div style={{ padding: '20px 24px 12px' }}>
        <SectionHeader
          title={`Últimos ${historialClima.length} días`}
          subtitle="Lecturas agregadas por jornada"
        />
      </div>
      <DataTable<LecturaClimatica>
        columns={columns}
        rows={historialClima}
        rowKey={l => l.fecha}
        minWidth={1020}
      />
    </Card>
  </div>
);

export default HistorialClimatico;
