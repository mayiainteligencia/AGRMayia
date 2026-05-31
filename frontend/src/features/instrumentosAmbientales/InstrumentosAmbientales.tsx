import React, { useMemo, useState } from 'react';
import {
  Thermometer, Gauge, Droplets, Sun, Sprout, CloudDrizzle, Sparkles,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { brandingConfig } from '../../config/branding';

const { colores } = brandingConfig;

/* ─── SliderInput local con interpretación ───────────────── */
interface Interpretacion {
  variant: 'success' | 'info' | 'warning' | 'danger';
  label: string;
  detalle: string;
}

const SliderInput: React.FC<{
  icon: React.ReactNode;
  color: string;
  titulo: string;
  unidad: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange?: (v: number) => void;
  interpretar: (v: number) => Interpretacion;
}> = ({ icon, color, titulo, unidad, min, max, step = 0.1, value, onChange, interpretar }) => {
  const i = interpretar(value);
  const readonly = !onChange;
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 34, height: 34, borderRadius: 9,
            background: `${color}1A`, color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: colores.textoClaro, margin: 0 }}>{titulo}</p>
          <p style={{ fontSize: 10, color: colores.textoOscuro, margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
            {readonly ? 'Calculado' : 'Captura manual'}
          </p>
        </div>
        <Badge variant={i.variant}>{i.label}</Badge>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: 30, fontWeight: 700, color: colores.textoClaro, letterSpacing: '-0.5px', lineHeight: 1 }}>
          {value.toFixed(unidad === '°' || unidad.includes('°') ? 1 : unidad === '' ? 0 : 1)}
        </span>
        <span style={{ fontSize: 13, color: colores.textoOscuro, fontWeight: 500 }}>{unidad}</span>
      </div>

      {!readonly && (
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange?.(Number(e.target.value))}
          style={{ width: '100%', accentColor: color, marginBottom: 4 }}
        />
      )}
      {readonly && (
        <div style={{ height: 6, borderRadius: 4, background: colores.fondoTerciario, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, pct))}%`, background: color }} />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: colores.textoOscuro, marginBottom: 8 }}>
        <span>{min}{unidad}</span>
        <span>{max}{unidad}</span>
      </div>

      <p style={{ fontSize: 12, color: colores.textoMedio, margin: 0, lineHeight: 1.5 }}>
        {i.detalle}
      </p>
    </Card>
  );
};

/* ─── Interpretaciones ───────────────────────────────────── */
const interpTemp = (v: number): Interpretacion => {
  if (v < 5)   return { variant: 'info',    label: 'Frío',          detalle: 'Riesgo de helada · proteger cultivos sensibles.' };
  if (v < 18)  return { variant: 'success', label: 'Templado',      detalle: 'Rango ideal para arándano y la mayoría de hortalizas.' };
  if (v < 28)  return { variant: 'success', label: 'Óptimo',        detalle: 'Crecimiento activo · vigilar humedad y riego.' };
  if (v < 35)  return { variant: 'warning', label: 'Cálido',        detalle: 'Estrés térmico ligero · aumentar frecuencia de riego.' };
  return         { variant: 'danger',  label: 'Calor extremo', detalle: 'Riesgo alto · activar sombreo y riego nocturno.' };
};

const interpPresion = (v: number): Interpretacion => {
  if (v < 1005) return { variant: 'warning', label: 'Baja',     detalle: 'Probable cambio de tiempo · vigilar pronóstico de lluvia.' };
  if (v < 1020) return { variant: 'success', label: 'Estable',  detalle: 'Condiciones estables, sin cambios bruscos esperados.' };
  return          { variant: 'info',    label: 'Alta',     detalle: 'Tiempo seco y estable · favorable para labores de campo.' };
};

const interpHumedad = (v: number): Interpretacion => {
  if (v < 40)  return { variant: 'warning', label: 'Seco',     detalle: 'Riesgo de estrés hídrico · aumentar riego o nebulizar.' };
  if (v < 70)  return { variant: 'success', label: 'Cómodo',   detalle: 'Rango óptimo de transpiración para la planta.' };
  return         { variant: 'info',    label: 'Húmedo',   detalle: 'Alta humedad · vigilar Botrytis (OP-006) y ventilar.' };
};

const interpUV = (v: number): Interpretacion => {
  if (v < 3)  return { variant: 'success', label: 'Bajo',     detalle: 'Riesgo solar mínimo · sin protección extra.' };
  if (v < 6)  return { variant: 'info',    label: 'Moderado', detalle: 'Riesgo medio · protección recomendada para personal.' };
  if (v < 8)  return { variant: 'warning', label: 'Alto',     detalle: 'Riesgo alto · sombrero, lentes y SPF obligatorio.' };
  return        { variant: 'danger',  label: 'Extremo',  detalle: 'Riesgo extremo · evitar exposición prolongada.' };
};

const interpSuelo = (v: number): Interpretacion => {
  if (v < 8)  return { variant: 'info',    label: 'Frío',    detalle: 'Germinación lenta · esperar a 10–12 °C para sembrar.' };
  if (v < 22) return { variant: 'success', label: 'Óptimo',  detalle: 'Actividad biológica plena · raíces en pleno crecimiento.' };
  return        { variant: 'warning', label: 'Cálido',  detalle: 'Acelera evaporación · aumentar mulch y riego.' };
};

const interpRocio = (v: number, temp: number): Interpretacion => {
  const spread = temp - v;
  if (spread < 2) return { variant: 'warning', label: 'Saturación', detalle: 'Riesgo de condensación · ventilar para evitar hongos.' };
  if (spread < 6) return { variant: 'info',    label: 'Húmedo',     detalle: 'Aire próximo a saturación · monitorear Botrytis.' };
  return            { variant: 'success', label: 'Cómodo',     detalle: 'Aire bien por encima del punto de rocío.' };
};

/* Punto de rocío (Magnus): Td = (b·α) / (a − α), α = ln(RH/100) + (a·T)/(b+T) */
const calcPuntoRocio = (tempC: number, humedad: number) => {
  const a = 17.625, b = 243.04;
  const rh = Math.max(humedad, 0.01);
  const alpha = Math.log(rh / 100) + (a * tempC) / (b + tempC);
  return (b * alpha) / (a - alpha);
};

/* ─── Página ──────────────────────────────────────────────── */
export const InstrumentosAmbientales: React.FC = () => {
  const [temp, setTemp]       = useState(22.5);
  const [presion, setPresion] = useState(1018);
  const [humedad, setHumedad] = useState(58);
  const [uv, setUv]           = useState(5);
  const [tSuelo, setTSuelo]   = useState(18);

  const puntoRocio = useMemo(() => calcPuntoRocio(temp, humedad), [temp, humedad]);

  /* VPD bonus */
  const vpd = useMemo(() => {
    const esat = 0.6108 * Math.exp((17.27 * temp) / (temp + 237.3));
    return esat * (1 - humedad / 100);
  }, [temp, humedad]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1
            className="page-title"
            style={{ fontSize: 28, fontWeight: 700, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}
          >
            Instrumentos Ambientales
          </h1>
          <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>
            Captura manual con interpretación IA en tiempo real · incluye cálculo de VPD
          </p>
        </div>
        <div
          style={{
            padding: '8px 14px', borderRadius: 10,
            background: colores.primarioClaro, border: `1px solid ${colores.bordeHover}55`,
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}
        >
          <Sparkles size={14} color={colores.primario} />
          <span style={{ fontSize: 12, fontWeight: 700, color: colores.primario }}>
            VPD = {vpd.toFixed(2)} kPa
          </span>
        </div>
      </div>

      <div className="rg-3">
        <SliderInput
          icon={<Thermometer size={18} />} color={colores.peligro}
          titulo="Temperatura" unidad="°C" min={-10} max={45}
          value={temp} onChange={setTemp}
          interpretar={interpTemp}
        />
        <SliderInput
          icon={<Gauge size={18} />} color={colores.acentoBerry}
          titulo="Presión barométrica" unidad=" hPa" min={980} max={1040} step={0.5}
          value={presion} onChange={setPresion}
          interpretar={interpPresion}
        />
        <SliderInput
          icon={<Droplets size={18} />} color={colores.info}
          titulo="Humedad relativa" unidad="%" min={0} max={100} step={1}
          value={humedad} onChange={setHumedad}
          interpretar={interpHumedad}
        />
        <SliderInput
          icon={<Sun size={18} />} color={colores.advertencia}
          titulo="Índice UV" unidad="" min={0} max={12} step={1}
          value={uv} onChange={setUv}
          interpretar={interpUV}
        />
        <SliderInput
          icon={<Sprout size={18} />} color={colores.secundario}
          titulo="Temperatura del suelo" unidad="°C" min={0} max={35}
          value={tSuelo} onChange={setTSuelo}
          interpretar={interpSuelo}
        />
        <SliderInput
          icon={<CloudDrizzle size={18} />} color={colores.primario}
          titulo="Punto de rocío" unidad="°C" min={-5} max={25}
          value={puntoRocio}
          interpretar={v => interpRocio(v, temp)}
        />
      </div>

      <Card>
        <SectionHeader
          title="Interpretación combinada"
          subtitle="Resumen agronómico derivado de la captura"
        />
        <p style={{ fontSize: 13, color: colores.textoMedio, margin: 0, lineHeight: 1.6 }}>
          A {temp.toFixed(1)} °C con {humedad}% HR el punto de rocío es {puntoRocio.toFixed(1)} °C y el VPD calculado es {vpd.toFixed(2)} kPa
          ({vpd >= 0.8 && vpd <= 1.5 ? 'rango óptimo de transpiración' : vpd < 0.8 ? 'aire muy saturado: riesgo de hongos' : 'estrés hídrico: aumentar riego'}).
          La temperatura del suelo a {tSuelo} °C {tSuelo >= 10 && tSuelo <= 22 ? 'permite' : 'no es la ideal para'} actividad biológica plena.
          Índice UV {uv} y presión {presion} hPa indican {uv >= 6 ? 'protección obligatoria para personal' : 'condiciones cómodas para labores'} {presion < 1010 ? '· posible cambio de tiempo.' : '· tiempo estable.'}
        </p>
      </Card>
    </div>
  );
};

export default InstrumentosAmbientales;
