import React, { useMemo, useState } from 'react';
import { Droplets, CloudRain, Sun, Gauge } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { brandingConfig } from '../../config/branding';
import { eficienciasRiego, type EficienciaRiego } from './data/medicionAgua.dummy';

const { colores } = brandingConfig;

/* ─── CalculatorCard local ───────────────────────────────── */
interface CalcInput {
  id: string;
  label: string;
  unit: string;
  value: number;
  step?: number;
  onChange: (v: number) => void;
}
interface CalcOutput {
  label: string;
  value: string;
  highlight?: boolean;
}
const CalculatorCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  color: string;
  inputs: CalcInput[];
  outputs: CalcOutput[];
  hint?: string;
}> = ({ icon, title, subtitle, color, inputs, outputs, hint }) => (
  <Card>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div
        style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${color}1A`, color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: colores.textoClaro, margin: 0 }}>{title}</p>
        {subtitle && <p style={{ fontSize: 11, color: colores.textoOscuro, margin: 0 }}>{subtitle}</p>}
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
      {inputs.map(inp => (
        <label key={inp.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: colores.textoOscuro, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {inp.label}
          </span>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              min={0} step={inp.step ?? 0.1}
              value={inp.value}
              onChange={e => inp.onChange(Math.max(0, Number(e.target.value)))}
              style={{
                width: '100%', padding: '9px 48px 9px 12px',
                borderRadius: 10, border: `1px solid ${colores.borde}`,
                background: colores.fondoSecundario, fontSize: 13, color: colores.textoClaro, fontWeight: 600,
              }}
            />
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: colores.textoOscuro, fontWeight: 600 }}>
              {inp.unit}
            </span>
          </div>
        </label>
      ))}
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {outputs.map(out => (
        <div
          key={out.label}
          style={{
            padding: '10px 12px', borderRadius: 8,
            background: out.highlight ? colores.primarioClaro : colores.fondoTerciario,
            border: `1px solid ${out.highlight ? colores.bordeHover : colores.borde}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          }}
        >
          <span style={{ fontSize: 11, color: colores.textoOscuro, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {out.label}
          </span>
          <span style={{ fontSize: out.highlight ? 17 : 14, fontWeight: 700, color: out.highlight ? colores.primario : colores.textoClaro }}>
            {out.value}
          </span>
        </div>
      ))}
    </div>

    {hint && (
      <p style={{ fontSize: 11, color: colores.textoOscuro, margin: '10px 0 0', lineHeight: 1.5, fontStyle: 'italic' }}>
        {hint}
      </p>
    )}
  </Card>
);

const fmt = (n: number, dec = 1) =>
  new Intl.NumberFormat('es-MX', { maximumFractionDigits: dec, minimumFractionDigits: dec }).format(n);

const eficienciaVariant = (pct: number): 'success' | 'info' | 'warning' | 'danger' => {
  if (pct >= 85) return 'success';
  if (pct >= 70) return 'info';
  if (pct >= 50) return 'warning';
  return 'danger';
};

const eficienciaColumns: DataTableColumn<EficienciaRiego>[] = [
  { key: 'metodo', header: 'Método', render: e => <span style={{ color: colores.textoClaro, fontWeight: 600 }}>{e.metodo}</span> },
  {
    key: 'eficienciaPct',
    header: 'Eficiencia',
    align: 'right',
    nowrap: true,
    render: e => <Badge variant={eficienciaVariant(e.eficienciaPct)}>{e.eficienciaPct} %</Badge>,
  },
  { key: 'recomendacion', header: 'Recomendación', render: e => <span style={{ color: colores.textoMedio }}>{e.recomendacion}</span> },
];

export const MedicionAgua: React.FC = () => {
  // Aforo
  const [volBalde, setVolBalde] = useState(20);
  const [tiempoSeg, setTiempoSeg] = useState(8);
  const aforoLmin = (volBalde / Math.max(tiempoSeg, 0.1)) * 60;

  // Lluvia
  const [precip, setPrecip] = useState(15);
  const [areaM2, setAreaM2] = useState(500);
  const [coef, setCoef]     = useState(0.85);
  const [consumoDia, setConsumoDia] = useState(800);
  const litrosCaptados = precip * areaM2 * coef;
  const diasEquiv = litrosCaptados / Math.max(consumoDia, 1);

  // ETo Hargreaves-Samani
  const [tMax, setTMax] = useState(24);
  const [tMin, setTMin] = useState(11);
  const [ra, setRa]     = useState(38); // MJ/m²/día (referencia)
  const [latitud, setLatitud] = useState(19);
  const tMedia = (tMax + tMin) / 2;
  // ETo (mm/día) = 0.0023 * (Tmedia + 17.8) * sqrt(Tmax - Tmin) * Ra * 0.408
  const eto = useMemo(() => {
    const delta = Math.max(tMax - tMin, 0);
    return 0.0023 * (tMedia + 17.8) * Math.sqrt(delta) * ra * 0.408;
  }, [tMax, tMin, ra, tMedia]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1
          className="page-title"
          style={{ fontSize: 28, fontWeight: 700, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}
        >
          Medición de Agua
        </h1>
        <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>
          Calculadoras de campo: aforo, captación de lluvia y evapotranspiración (Hargreaves-Samani)
        </p>
      </div>

      <div className="rg-3">
        <CalculatorCard
          icon={<Gauge size={18} />} color={colores.info}
          title="Aforo de caudal"
          subtitle="Método del balde"
          inputs={[
            { id: 'vol',  label: 'Volumen del balde', unit: 'L', value: volBalde, onChange: setVolBalde, step: 0.5 },
            { id: 'tim',  label: 'Tiempo de llenado', unit: 's', value: tiempoSeg, onChange: setTiempoSeg, step: 0.5 },
          ]}
          outputs={[
            { label: 'Caudal',         value: `${fmt(aforoLmin)} L/min`, highlight: true },
            { label: 'L/h',            value: fmt(aforoLmin * 60, 0) + ' L/h' },
            { label: 'L/jornada (8h)', value: fmt(aforoLmin * 60 * 8, 0) + ' L' },
          ]}
          hint="Promedia 3 mediciones para reducir error."
        />

        <CalculatorCard
          icon={<CloudRain size={18} />} color={colores.acentoBerry}
          title="Captación de lluvia"
          subtitle="Cosecha sobre techo o pista"
          inputs={[
            { id: 'pre', label: 'Precipitación',         unit: 'mm',  value: precip,     onChange: setPrecip,     step: 0.5 },
            { id: 'are', label: 'Área de captación',     unit: 'm²',  value: areaM2,     onChange: setAreaM2,     step: 10 },
            { id: 'coe', label: 'Coef. de escurrimiento', unit: '0–1', value: coef,       onChange: setCoef,       step: 0.05 },
            { id: 'con', label: 'Consumo diario',        unit: 'L/d', value: consumoDia, onChange: setConsumoDia, step: 50 },
          ]}
          outputs={[
            { label: 'Litros captados',  value: fmt(litrosCaptados, 0) + ' L', highlight: true },
            { label: 'Días equivalentes', value: fmt(diasEquiv, 1) + ' d' },
          ]}
          hint="Coef. típico: lámina metálica 0.9 · teja 0.8 · concreto 0.7."
        />

        <CalculatorCard
          icon={<Sun size={18} />} color={colores.advertencia}
          title="ETo Hargreaves-Samani"
          subtitle="Evapotranspiración de referencia"
          inputs={[
            { id: 'tmx', label: 'Temp. máx', unit: '°C',        value: tMax,    onChange: setTMax,    step: 0.1 },
            { id: 'tmn', label: 'Temp. mín', unit: '°C',        value: tMin,    onChange: setTMin,    step: 0.1 },
            { id: 'ra',  label: 'Rad. extraterrestre', unit: 'MJ/m²/d', value: ra, onChange: setRa, step: 1 },
            { id: 'lat', label: 'Latitud',  unit: '°',         value: latitud, onChange: setLatitud, step: 1 },
          ]}
          outputs={[
            { label: 'ETo',          value: fmt(eto, 2) + ' mm/d', highlight: true },
            { label: 'ETo semanal',  value: fmt(eto * 7, 1) + ' mm/sem' },
            { label: 'ETo mensual',  value: fmt(eto * 30, 0) + ' mm/mes' },
          ]}
          hint="Ra varía por latitud y mes; consultar tabla FAO-56."
        />
      </div>

      <Card padding={0}>
        <div style={{ padding: '20px 24px 12px' }}>
          <SectionHeader
            title="Eficiencia por método de riego"
            subtitle="% de agua que llega efectivamente a la planta"
            action={<Droplets size={14} color={colores.info} />}
          />
        </div>
        <DataTable<EficienciaRiego>
          columns={eficienciaColumns}
          rows={eficienciasRiego}
          rowKey={e => e.metodo}
          minWidth={620}
        />
      </Card>
    </div>
  );
};

export default MedicionAgua;
