import React, { useState } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { HeatmapTable } from '../../components/ui/HeatmapTable';
import { brandingConfig } from '../../config/branding';
import { MESES, CULTIVOS_BASE, zonasClimaticas, zonasMatriz } from './data/calendarioSiembra.dummy';

const { colores } = brandingConfig;

/* ─── Buckets de idoneidad ───────────────────────────────── */
const bucket = (v: number) => {
  if (v >= 80) return 'optimo'  as const;
  if (v >= 60) return 'bueno'   as const;
  if (v >= 40) return 'marginal' as const;
  return 'no-recomendado'         as const;
};

const BUCKET_BG: Record<ReturnType<typeof bucket>, string> = {
  optimo:          colores.primario,
  bueno:           colores.acento,
  marginal:        colores.advertencia + 'AA',
  'no-recomendado': colores.fondoTerciario,
};

const BUCKET_FG: Record<ReturnType<typeof bucket>, string> = {
  optimo:          colores.textoEnOscuro,
  bueno:           colores.textoEnOscuro,
  marginal:        colores.textoClaro,
  'no-recomendado': colores.textoOscuro,
};

const BUCKET_GLYPH: Record<ReturnType<typeof bucket>, string> = {
  optimo:          '★',
  bueno:           '✓',
  marginal:        '~',
  'no-recomendado': '·',
};

const LEYENDA: { b: ReturnType<typeof bucket>; label: string }[] = [
  { b: 'optimo',          label: 'Óptimo' },
  { b: 'bueno',           label: 'Bueno' },
  { b: 'marginal',        label: 'Marginal' },
  { b: 'no-recomendado', label: 'No recomendado' },
];

/* ─── Componente ──────────────────────────────────────────── */
export const CalendarioSiembra: React.FC = () => {
  const [zonaId, setZonaId] = useState<string>('mx-sierra');
  const zona = zonasClimaticas.find(z => z.id === zonaId) ?? zonasClimaticas[0];
  const matriz = zonasMatriz[zonaId];
  const mesActualIdx = new Date().getMonth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1
          className="page-title"
          style={{ fontSize: 28, fontWeight: 700, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}
        >
          Calendario de Siembra
        </h1>
        <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>
          Idoneidad mensual de siembra por cultivo y zona climática
        </p>
      </div>

      {/* Banner */}
      <div
        style={{
          padding: '14px 18px',
          borderRadius: 12,
          background: colores.primarioClaro,
          border: `1px solid ${colores.bordeHover}33`,
          display: 'flex', alignItems: 'center', gap: 14,
        }}
      >
        <div
          style={{
            width: 40, height: 40, borderRadius: 10,
            background: colores.gradienteAcento, color: colores.textoEnOscuro,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <CalendarDays size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: colores.primario, margin: 0 }}>
            9 zonas climáticas · 10 cultivos por zona · Idoneidad mensual 0–100 %
          </p>
          <p style={{ fontSize: 12, color: colores.textoMedio, margin: '2px 0 0', lineHeight: 1.5 }}>
            Selecciona la zona para ver la ventana de siembra recomendada de cada cultivo.
          </p>
        </div>
      </div>

      {/* Selector + leyenda */}
      <Card>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 280 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: colores.textoOscuro, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Zona climática
            </span>
            <div style={{ position: 'relative' }}>
              <select
                value={zonaId}
                onChange={e => setZonaId(e.target.value)}
                style={{
                  width: '100%', padding: '10px 36px 10px 12px',
                  borderRadius: 10, border: `1px solid ${colores.borde}`,
                  background: colores.fondoSecundario, fontSize: 13, color: colores.textoClaro,
                  appearance: 'none', cursor: 'pointer',
                }}
              >
                {zonasClimaticas.map(z => (
                  <option key={z.id} value={z.id}>{z.nombre}</option>
                ))}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: colores.textoOscuro, pointerEvents: 'none' }} />
            </div>
            {zona.descripcion && (
              <span style={{ fontSize: 11, color: colores.textoOscuro }}>{zona.descripcion}</span>
            )}
          </label>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {LEYENDA.map(l => (
              <div key={l.b} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: BUCKET_BG[l.b], color: BUCKET_FG[l.b],
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700,
                  }}
                >
                  {BUCKET_GLYPH[l.b]}
                </span>
                <span style={{ fontSize: 12, color: colores.textoMedio, fontWeight: 500 }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Mapa de calor */}
      <Card>
        <SectionHeader
          title={`Idoneidad mensual — ${zona.nombre}`}
          subtitle={`Mes actual: ${MESES[mesActualIdx]} · resaltado`}
        />
        <HeatmapTable
          rows={CULTIVOS_BASE}
          cols={MESES}
          values={matriz}
          rowHeader="Cultivo"
          highlightCol={mesActualIdx}
          cellColor={v => BUCKET_BG[bucket(v)]}
          cellTextColor={v => BUCKET_FG[bucket(v)]}
          cellRender={v => (
            <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 0, lineHeight: 1.1 }}>
              <span style={{ fontSize: 13 }}>{BUCKET_GLYPH[bucket(v)]}</span>
              <span style={{ fontSize: 9, opacity: 0.7, fontWeight: 500 }}>{v}</span>
            </span>
          )}
        />
      </Card>
    </div>
  );
};

export default CalendarioSiembra;
