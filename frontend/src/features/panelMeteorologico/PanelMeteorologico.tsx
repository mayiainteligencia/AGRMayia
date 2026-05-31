import React from 'react';
import {
  Thermometer, Gauge, Wind, Droplets, CloudRain, Mountain,
  Sun, Cloud, CloudLightning, CloudDrizzle, CloudSun,
  AlertTriangle, ChevronRight,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { brandingConfig } from '../../config/branding';
import { meteoKPIs, pronostico7d, alertasAgronomicas, type DiaPronostico } from './data/panelMeteorologico.dummy';

const { colores } = brandingConfig;

const ICONS = [
  <Thermometer size={18} />,
  <Gauge size={18} />,
  <Wind size={18} />,
  <Droplets size={18} />,
  <CloudRain size={18} />,
  <Mountain size={18} />,
];

const ICONO_CONDICION: Record<DiaPronostico['condicion'], React.ReactNode> = {
  soleado:  <Sun size={22} color={colores.advertencia} />,
  parcial:  <CloudSun size={22} color={colores.info} />,
  nublado:  <Cloud size={22} color={colores.textoOscuro} />,
  lluvia:   <CloudDrizzle size={22} color={colores.info} />,
  tormenta: <CloudLightning size={22} color={colores.acentoBerry} />,
};

const LABEL_CONDICION: Record<DiaPronostico['condicion'], string> = {
  soleado: 'Soleado', parcial: 'Parcial', nublado: 'Nublado', lluvia: 'Lluvia', tormenta: 'Tormenta',
};

const prioridadBadge: Record<'alta' | 'media' | 'baja', 'danger' | 'warning' | 'neutral'> = {
  alta: 'danger', media: 'warning', baja: 'neutral',
};

export const PanelMeteorologico: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h1
        className="page-title"
        style={{ fontSize: 28, fontWeight: 700, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}
      >
        Panel Meteorológico
      </h1>
      <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>
        Estación local · pronóstico 7 días generado por BRAIN™ #W · alertas agronómicas en tiempo real
      </p>
    </div>

    {/* ── 6 StatCards ── */}
    <div className="rg-3">
      {meteoKPIs.map((kpi, i) => (
        <StatCard key={kpi.id} {...kpi} icon={ICONS[i]} />
      ))}
    </div>

    {/* ── Condición actual y pronóstico ── */}
    <Card>
      <SectionHeader
        title="Condición actual y pronóstico"
        subtitle="Resumen agronómico en función de la lectura más reciente"
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ fontSize: 12, color: colores.textoOscuro, margin: 0, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Condición actual
          </p>
          <p style={{ fontSize: 16, color: colores.textoClaro, margin: 0, fontWeight: 600 }}>
            Parcialmente nublado · viento NNO 52 km/h
          </p>
          <p style={{ fontSize: 12, color: colores.textoMedio, margin: 0, lineHeight: 1.5 }}>
            Sensación térmica 9.8°C · presión estable · sin precipitación en los últimos 30 min.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ fontSize: 12, color: colores.textoOscuro, margin: 0, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Riesgo agronómico
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Badge variant="warning">Medio</Badge>
            <span style={{ fontSize: 13, color: colores.textoMedio }}>viento + caída térmica</span>
          </div>
          <p style={{ fontSize: 12, color: colores.textoMedio, margin: 0, lineHeight: 1.5 }}>
            Asegurar mallas; preparar antihelada para el sábado.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Índice UV',  value: '4', unit: 'medio' },
            { label: 'Visibilidad', value: '12', unit: 'km' },
            { label: 'Ráfagas',    value: '65', unit: 'km/h' },
          ].map(m => (
            <div key={m.label} style={{ padding: '10px 12px', borderRadius: 10, background: colores.fondoTerciario }}>
              <p style={{ fontSize: 10, color: colores.textoOscuro, margin: 0, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {m.label}
              </p>
              <p style={{ fontSize: 18, color: colores.textoClaro, margin: '2px 0 0', fontWeight: 700 }}>
                {m.value} <span style={{ fontSize: 11, fontWeight: 400, color: colores.textoOscuro }}>{m.unit}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>

    {/* ── Pronóstico 7 días ── */}
    <Card>
      <SectionHeader
        title="Pronóstico 7 días"
        subtitle="Generado por BRAIN™ #W con modelo regional"
        action={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: colores.acentoBerry }}>
            <Cloud size={14} /> BRAIN™ #W
          </span>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(80px, 1fr))', gap: 8 }}>
        {pronostico7d.map((d, i) => (
          <div
            key={d.dia}
            style={{
              padding: '12px 8px',
              borderRadius: 10,
              border: `1px solid ${i === 0 ? colores.bordeHover : colores.borde}`,
              background: i === 0 ? colores.primarioClaro : colores.fondoSecundario,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? colores.primario : colores.textoOscuro, textTransform: 'uppercase' }}>
              {d.dia}
            </span>
            <span style={{ fontSize: 10, color: colores.textoOscuro }}>{d.fecha}</span>
            {ICONO_CONDICION[d.condicion]}
            <span style={{ fontSize: 10, color: colores.textoOscuro }}>{LABEL_CONDICION[d.condicion]}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: colores.textoClaro }}>
              {d.tempMax}° <span style={{ color: colores.textoOscuro, fontWeight: 400 }}>/ {d.tempMin}°</span>
            </span>
            <span style={{ fontSize: 11, color: colores.info, fontWeight: 600 }}>
              💧 {d.lluviaPct}%
            </span>
          </div>
        ))}
      </div>
    </Card>

    {/* ── Alertas agronómicas BRAIN™ #W ── */}
    <Card>
      <SectionHeader
        title="Alertas agronómicas activas"
        subtitle="Disparadas por BRAIN™ #W · cada una con acción concreta"
        action={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: colores.peligro }}>
            <AlertTriangle size={14} /> {alertasAgronomicas.length} activas
          </span>
        }
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {alertasAgronomicas.map(a => (
          <div
            key={a.id}
            style={{
              padding: '14px 16px',
              borderRadius: 10,
              border: `1px solid ${colores.borde}`,
              background: colores.fondoSecundario,
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 38, height: 38, borderRadius: 10,
                background: a.prioridad === 'alta' ? `${colores.peligro}1A` : `${colores.advertencia}1A`,
                color: a.prioridad === 'alta' ? colores.peligro : colores.advertencia,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: colores.textoClaro, margin: 0 }}>{a.titulo}</p>
                <Badge variant={prioridadBadge[a.prioridad]}>{a.prioridad}</Badge>
              </div>
              <p style={{ fontSize: 12, color: colores.textoMedio, margin: '4px 0 0', lineHeight: 1.5 }}>
                {a.mensaje}
              </p>
              {a.contingencia && (
                <p style={{ fontSize: 12, color: colores.secundario, margin: '6px 0 0', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <ChevronRight size={13} /> Acción: {a.contingencia}
                </p>
              )}
              <p style={{ fontSize: 10, color: colores.textoOscuro, margin: '4px 0 0' }}>{a.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

export default PanelMeteorologico;
