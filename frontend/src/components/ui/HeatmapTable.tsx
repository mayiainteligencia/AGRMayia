import React from 'react';
import { brandingConfig } from '../../config/branding';

const { colores } = brandingConfig;

export interface HeatmapTableProps {
  /** Etiquetas del eje Y (filas). */
  rows: string[];
  /** Etiquetas del eje X (columnas). */
  cols: string[];
  /** Matriz [fila][col] con el valor (0–100 o el código que use la feature). */
  values: number[][];
  /** Render custom del contenido de la celda. */
  cellRender?: (value: number, row: string, col: string) => React.ReactNode;
  /** Color de fondo por celda. Default: escala verde por intensidad 0–100. */
  cellColor?: (value: number) => string;
  /** Color del texto de la celda. Default: blanco si fondo oscuro, claro si pálido. */
  cellTextColor?: (value: number) => string;
  /** Índice (0-based) de la columna a resaltar (p.ej. mes actual). */
  highlightCol?: number;
  /** Etiqueta del encabezado de la primera columna (filas). */
  rowHeader?: string;
  /** `min-width` del <table> para forzar scroll horizontal. */
  minWidth?: number;
}

/** Escala default verde (transparente → primario). */
const defaultColor = (v: number) => {
  const a = Math.max(0, Math.min(100, v)) / 100;
  return `rgba(45, 106, 79, ${0.08 + a * 0.85})`;
};

const defaultTextColor = (v: number) =>
  v >= 55 ? colores.textoEnOscuro : colores.textoMedio;

export const HeatmapTable: React.FC<HeatmapTableProps> = ({
  rows,
  cols,
  values,
  cellRender,
  cellColor = defaultColor,
  cellTextColor = defaultTextColor,
  highlightCol,
  rowHeader = '',
  minWidth = 720,
}) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 4, minWidth }}>
      <thead>
        <tr>
          <th
            style={{
              padding: '8px 10px',
              fontSize: 11,
              fontWeight: 700,
              color: colores.textoOscuro,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              textAlign: 'left',
              minWidth: 140,
            }}
          >
            {rowHeader}
          </th>
          {cols.map((c, i) => (
            <th
              key={c}
              style={{
                padding: '6px 8px',
                fontSize: 11,
                fontWeight: 700,
                color: highlightCol === i ? colores.primario : colores.textoOscuro,
                textAlign: 'center',
                background: highlightCol === i ? colores.primarioClaro : 'transparent',
                borderRadius: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rIdx) => (
          <tr key={row}>
            <td
              style={{
                padding: '8px 10px',
                fontSize: 12,
                fontWeight: 600,
                color: colores.textoClaro,
                whiteSpace: 'nowrap',
              }}
            >
              {row}
            </td>
            {cols.map((col, cIdx) => {
              const v = values[rIdx]?.[cIdx] ?? 0;
              const isHl = highlightCol === cIdx;
              return (
                <td
                  key={col}
                  style={{
                    padding: '8px 4px',
                    background: cellColor(v),
                    color: cellTextColor(v),
                    textAlign: 'center',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    boxShadow: isHl ? `inset 0 0 0 2px ${colores.bordeHover}` : undefined,
                    transition: 'background 0.2s',
                    minWidth: 44,
                  }}
                >
                  {cellRender ? cellRender(v, row, col) : v || ''}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
