import React from 'react';
import {
  Thermometer, Gauge, Mountain, Wind, BatteryFull, BatteryMedium, BatteryLow,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { brandingConfig } from '../../config/branding';
import { calibracionSensores, type CalibracionSensor } from './data/termometroBarometro.dummy';

const { colores } = brandingConfig;

/* ─── Mini instrumentos (cards) ──────────────────────────── */
const Instrumento: React.FC<{
  icon: React.ReactNode;
  titulo: string;
  valorPrincipal: string;
  unidad: string;
  color: string;
  secundarios: { label: string; value: string }[];
}> = ({ icon, titulo, valorPrincipal, unidad, color, secundarios }) => (
  <Card>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <div
        style={{
          width: 38, height: 38, borderRadius: 10,
          background: `${color}1A`, color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: colores.textoClaro }}>{titulo}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 14 }}>
      <span style={{ fontSize: 36, fontWeight: 700, color: colores.textoClaro, letterSpacing: '-1px', lineHeight: 1 }}>
        {valorPrincipal}
      </span>
      <span style={{ fontSize: 14, color: colores.textoOscuro, fontWeight: 500 }}>{unidad}</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10 }}>
      {secundarios.map(s => (
        <div key={s.label} style={{ padding: '8px 10px', borderRadius: 8, background: colores.fondoTerciario }}>
          <p style={{ fontSize: 10, color: colores.textoOscuro, margin: 0, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {s.label}
          </p>
          <p style={{ fontSize: 13, color: colores.textoClaro, margin: '2px 0 0', fontWeight: 700 }}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  </Card>
);

/* ─── Tabla de sensores ──────────────────────────────────── */
const estadoVariant: Record<CalibracionSensor['estado'], 'success' | 'warning' | 'danger'> = {
  ok:               'success',
  'por-vencer':     'warning',
  'fuera-de-rango': 'danger',
};

const Bateria: React.FC<{ pct: number }> = ({ pct }) => {
  const Icon = pct >= 70 ? BatteryFull : pct >= 35 ? BatteryMedium : BatteryLow;
  const color = pct >= 70 ? colores.exito : pct >= 35 ? colores.advertencia : colores.peligro;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color }}>
      <Icon size={16} />
      <span style={{ fontSize: 12, fontWeight: 700 }}>{pct}%</span>
    </span>
  );
};

const sensoresColumns: DataTableColumn<CalibracionSensor>[] = [
  { key: 'sensor', header: 'Sensor', render: s => <span style={{ color: colores.textoClaro, fontWeight: 600 }}>{s.sensor}</span> },
  { key: 'modelo', header: 'Modelo' },
  { key: 'ultimaCalibracion', header: 'Última calibración', nowrap: true },
  { key: 'proximaCalibracion', header: 'Próxima calibración', nowrap: true },
  { key: 'precision', header: 'Precisión', nowrap: true, render: s => <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{s.precision}</span> },
  { key: 'estado', header: 'Estado', render: s => <Badge variant={estadoVariant[s.estado]}>{s.estado.replace('-', ' ')}</Badge> },
  { key: 'bateria', header: 'Batería', render: s => <Bateria pct={s.bateriaPct} /> },
];

export const TermometroBarometro: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h1
        className="page-title"
        style={{ fontSize: 28, fontWeight: 700, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}
      >
        Termómetro / Barómetro
      </h1>
      <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>
        Lectura por instrumento · multi-sitio · estado de calibración y batería
      </p>
    </div>

    <div className="rg-2">
      <Instrumento
        icon={<Thermometer size={18} />} color={colores.peligro}
        titulo="Termómetro" valorPrincipal="12.0" unidad="°C"
        secundarios={[
          { label: 'Mín 24h',     value: '7.4 °C' },
          { label: 'Máx 24h',     value: '18.6 °C' },
          { label: 'Suelo 10 cm', value: '10.2 °C' },
          { label: 'Punto rocío', value: '3.9 °C' },
        ]}
      />
      <Instrumento
        icon={<Gauge size={18} />} color={colores.acentoBerry}
        titulo="Barómetro" valorPrincipal="1017.8" unidad="hPa"
        secundarios={[
          { label: 'Tendencia',  value: 'Estable' },
          { label: 'Δ 3h',       value: '+1.2 hPa' },
          { label: 'Frente',     value: 'Frío (sáb)' },
          { label: 'Nivel mar',  value: '+0.4 hPa' },
        ]}
      />
      <Instrumento
        icon={<Mountain size={18} />} color={colores.secundario}
        titulo="Altímetro" valorPrincipal="2148" unidad="m"
        secundarios={[
          { label: 'La Joya',      value: '2150 m' },
          { label: 'Invernadero',  value: '2148 m' },
          { label: 'Campeche N.',  value: '12 m' },
          { label: 'Precisión',    value: '±1 m' },
        ]}
      />
      <Instrumento
        icon={<Wind size={18} />} color={colores.advertencia}
        titulo="Anemómetro" valorPrincipal="53" unidad="km/h"
        secundarios={[
          { label: 'Dirección',     value: 'NNO' },
          { label: 'Ráfaga',        value: '65 km/h' },
          { label: 'Promedio 10m',  value: '48 km/h' },
          { label: 'Riesgo cultivo', value: 'Medio' },
        ]}
      />
    </div>

    {/* Tabla de calibración */}
    <Card padding={0}>
      <div style={{ padding: '20px 24px 12px' }}>
        <SectionHeader
          title="Estado de calibración de sensores"
          subtitle="Programa de mantenimiento · estado y carga de batería en sitio"
        />
      </div>
      <DataTable<CalibracionSensor>
        columns={sensoresColumns}
        rows={calibracionSensores}
        rowKey={s => s.id}
        minWidth={920}
      />
    </Card>
  </div>
);

export default TermometroBarometro;
