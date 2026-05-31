import React from 'react';
import { brandingConfig } from '../../config/branding';

const { colores } = brandingConfig;

export type GanttCellState = 'crecimiento' | 'cosecha' | null;

export interface GanttRow {
  label: string;
  /** Una entrada por mes (longitud = `months.length`). */
  cells: GanttCellState[];
}

export interface GanttChartProps {
  rows: GanttRow[];
  /** Etiquetas de columna (meses). Default: ene–dic en español. */
  months?: string[];
  /** Índice de columna a resaltar (mes actual). */
  highlightCol?: number;
  /** Ancho mínimo para forzar scroll horizontal en pantallas chicas. */
  minWidth?: number;
}

const DEFAULT_MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const STATE_BG: Record<NonNullable<GanttCellState>, string> = {
  crecimiento: colores.acento,
  cosecha:     colores.advertencia,
};

const STATE_GLYPH: Record<NonNullable<GanttCellState>, string> = {
  crecimiento: '•',
  cosecha:     '🌾',
};

const STATE_LABEL: Record<NonNullable<GanttCellState>, string> = {
  crecimiento: 'Crecimiento',
  cosecha:     'Cosecha',
};

export const GanttChart: React.FC<GanttChartProps> = ({
  rows,
  months = DEFAULT_MONTHS,
  highlightCol,
  minWidth = 760,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {/* Leyenda */}
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
      {(Object.keys(STATE_BG) as (keyof typeof STATE_BG)[]).map(k => (
        <div key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 18, height: 18, borderRadius: 4,
              background: STATE_BG[k], color: colores.textoEnOscuro,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700,
            }}
          >
            {STATE_GLYPH[k]}
          </span>
          <span style={{ fontSize: 12, color: colores.textoMedio, fontWeight: 500 }}>{STATE_LABEL[k]}</span>
        </div>
      ))}
    </div>

    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 3, minWidth }}>
        <thead>
          <tr>
            <th
              style={{
                padding: '8px 10px',
                fontSize: 11,
                fontWeight: 700,
                color: colores.textoOscuro,
                textAlign: 'left',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                minWidth: 160,
              }}
            >
              Cultivo
            </th>
            {months.map((m, i) => (
              <th
                key={m}
                style={{
                  padding: '6px 4px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: highlightCol === i ? colores.primario : colores.textoOscuro,
                  textAlign: 'center',
                  background: highlightCol === i ? colores.primarioClaro : 'transparent',
                  borderRadius: 6,
                }}
              >
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.label}>
              <td
                style={{
                  padding: '8px 10px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: colores.textoClaro,
                  whiteSpace: 'nowrap',
                }}
              >
                {row.label}
              </td>
              {row.cells.map((c, cIdx) => {
                const isHl = highlightCol === cIdx;
                return (
                  <td
                    key={cIdx}
                    style={{
                      padding: '4px 2px',
                      textAlign: 'center',
                      background: c ? STATE_BG[c] : colores.fondoTerciario,
                      color: c ? colores.textoEnOscuro : 'transparent',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      height: 30,
                      boxShadow: isHl ? `inset 0 0 0 2px ${colores.bordeHover}` : undefined,
                    }}
                  >
                    {c ? STATE_GLYPH[c] : '·'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
