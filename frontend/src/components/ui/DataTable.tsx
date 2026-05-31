import React from 'react';
import { brandingConfig } from '../../config/branding';

const { colores } = brandingConfig;

/* ─── Tipos públicos ─────────────────────────────────────── */

export interface DataTableColumn<T> {
  /** Identificador único de columna. Si no hay `render`, se usa también como acceso a la fila (`row[key]`). */
  key: string;
  /** Encabezado mostrado. */
  header: string;
  /** Render custom de la celda. Recibe la fila y su índice. Si no se provee, renderiza `row[key]` como texto. */
  render?: (row: T, index: number) => React.ReactNode;
  /** Alineación horizontal del contenido (header y celdas). */
  align?: 'left' | 'right' | 'center';
  /** Ancho fijo o min-width sugerido por columna. */
  width?: string | number;
  /** Forzar no-wrap (útil para IDs, fechas, montos). */
  nowrap?: boolean;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Clave estable por fila (id, sku, etc.). */
  rowKey: (row: T) => string | number;
  /** Contenido a mostrar cuando `rows` está vacío. */
  empty?: React.ReactNode;
  /** Si `true`, muestra filas esqueleto en lugar de los datos. */
  loading?: boolean;
  /** Cuántas filas esqueleto mostrar (default 4). */
  loadingRows?: number;
  /** `min-width` del <table> para forzar scroll horizontal en pantallas estrechas. */
  minWidth?: number;
  /** Si `false`, todas las filas usan el mismo fondo. Default `true`. */
  striped?: boolean;
}

/* ─── Estilos compartidos (única fuente de verdad) ───────── */

const thBaseStyle: React.CSSProperties = {
  padding: '10px 14px',
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 600,
  color: colores.textoOscuro,
  borderBottom: `1px solid ${colores.borde}`,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  background: colores.fondoTerciario,
};

const tdBaseStyle: React.CSSProperties = {
  padding: '11px 14px',
  fontSize: 13,
  color: colores.textoMedio,
  verticalAlign: 'middle',
  lineHeight: 1.45,
};

/* ─── Default empty / loading ────────────────────────────── */

const DefaultEmpty: React.FC = () => (
  <div
    style={{
      padding: '40px 20px',
      textAlign: 'center',
      color: colores.textoOscuro,
      fontSize: 13,
    }}
  >
    Sin registros para mostrar
  </div>
);

const SkeletonBar: React.FC<{ width?: string | number }> = ({ width = '70%' }) => (
  <span
    style={{
      display: 'inline-block',
      width,
      height: 10,
      borderRadius: 4,
      background: `linear-gradient(90deg, ${colores.fondoTerciario} 0%, ${colores.borde} 50%, ${colores.fondoTerciario} 100%)`,
      backgroundSize: '200% 100%',
      animation: 'dt-shimmer 1.4s ease-in-out infinite',
    }}
  />
);

/* ─── Componente ─────────────────────────────────────────── */

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty,
  loading = false,
  loadingRows = 4,
  minWidth,
  striped = true,
}: DataTableProps<T>) {
  const isEmpty = !loading && rows.length === 0;

  return (
    <>
      <style>{`
        @keyframes dt-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div style={{ overflowX: 'auto' }}>
        {isEmpty ? (
          empty ?? <DefaultEmpty />
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth,
            }}
          >
            <thead>
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    style={{
                      ...thBaseStyle,
                      textAlign: col.align ?? 'left',
                      width: col.width,
                    }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: loadingRows }).map((_, rIdx) => (
                    <tr
                      key={`sk-${rIdx}`}
                      style={{
                        backgroundColor:
                          striped && rIdx % 2 === 1 ? '#FAFBFB' : colores.fondoSecundario,
                      }}
                    >
                      {columns.map(col => (
                        <td
                          key={col.key}
                          style={{
                            ...tdBaseStyle,
                            textAlign: col.align ?? 'left',
                            borderBottom: `1px solid ${colores.borde}`,
                          }}
                        >
                          <SkeletonBar width={col.align === 'right' ? '40%' : '70%'} />
                        </td>
                      ))}
                    </tr>
                  ))
                : rows.map((row, rIdx) => (
                    <tr
                      key={rowKey(row)}
                      style={{
                        backgroundColor:
                          striped && rIdx % 2 === 1 ? '#FAFBFB' : colores.fondoSecundario,
                      }}
                    >
                      {columns.map(col => {
                        const value = col.render
                          ? col.render(row, rIdx)
                          : ((row as Record<string, unknown>)[col.key] as React.ReactNode);

                        return (
                          <td
                            key={col.key}
                            style={{
                              ...tdBaseStyle,
                              textAlign: col.align ?? 'left',
                              whiteSpace: col.nowrap ? 'nowrap' : undefined,
                              borderBottom: `1px solid ${colores.borde}`,
                            }}
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
