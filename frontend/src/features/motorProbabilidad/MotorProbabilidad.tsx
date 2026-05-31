import React, { useMemo, useState } from 'react';
import { Percent, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { HeatmapTable } from '../../components/ui/HeatmapTable';
import { Badge } from '../../components/ui/Badge';
import { brandingConfig } from '../../config/branding';
import {
  MESES,
  CULTIVOS_BASE,
  zonasClimaticas,
  zonasMatriz,
} from '../calendarioSiembra/data/calendarioSiembra.dummy';

const { colores } = brandingConfig;

/* Escala color por % (rojo→ámbar→verde) */
const cellColor = (v: number) => {
  if (v >= 80) return colores.primario;
  if (v >= 60) return colores.acento;
  if (v >= 40) return colores.advertencia + 'CC';
  if (v >= 20) return colores.peligro + '99';
  return colores.fondoTerciario;
};

const cellTextColor = (v: number) => (v >= 40 ? colores.textoEnOscuro : colores.textoMedio);

const Selector: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 220 }}>
    <span style={{ fontSize: 11, fontWeight: 600, color: colores.textoOscuro, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {label}
    </span>
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '10px 36px 10px 12px',
          borderRadius: 10, border: `1px solid ${colores.borde}`,
          background: colores.fondoSecundario, fontSize: 13, color: colores.textoClaro,
          appearance: 'none', cursor: 'pointer',
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: colores.textoOscuro, pointerEvents: 'none' }} />
    </div>
  </label>
);

export const MotorProbabilidad: React.FC = () => {
  const [cultivo, setCultivo] = useState(CULTIVOS_BASE[0]);
  const [zonaId, setZonaId] = useState(zonasClimaticas[0].id);

  const fila = useMemo(() => {
    const idx = CULTIVOS_BASE.indexOf(cultivo);
    return zonasMatriz[zonaId][idx] ?? Array(12).fill(0);
  }, [cultivo, zonaId]);

  const { mejor, evitar } = useMemo(() => {
    const indexed = fila.map((v, i) => ({ v, mes: MESES[i], i }));
    const sortedDesc = [...indexed].sort((a, b) => b.v - a.v);
    return {
      mejor:  sortedDesc.slice(0, 3),
      evitar: sortedDesc.slice(-3).reverse(),
    };
  }, [fila]);

  const mesActualIdx = new Date().getMonth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1
          className="page-title"
          style={{ fontSize: 28, fontWeight: 700, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}
        >
          Motor de Probabilidad™
        </h1>
        <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>
          Probabilidad de siembra mes a mes, derivada del Calendario de Siembra para la zona seleccionada
        </p>
      </div>

      {/* Selectores */}
      <Card>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Selector
            label="Cultivo"
            value={cultivo}
            onChange={setCultivo}
            options={CULTIVOS_BASE.map(c => ({ value: c, label: c }))}
          />
          <Selector
            label="Zona climática"
            value={zonaId}
            onChange={setZonaId}
            options={zonasClimaticas.map(z => ({ value: z.id, label: z.nombre }))}
          />
        </div>
      </Card>

      {/* Fila probabilística */}
      <Card>
        <SectionHeader
          title={`Probabilidad de siembra — ${cultivo}`}
          subtitle={`Color por % · mes actual (${MESES[mesActualIdx]}) resaltado`}
          action={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: colores.secundario }}>
              <Percent size={14} /> Codificado por color
            </span>
          }
        />
        <HeatmapTable
          rows={[cultivo]}
          cols={MESES}
          values={[fila]}
          rowHeader=""
          highlightCol={mesActualIdx}
          cellColor={cellColor}
          cellTextColor={cellTextColor}
          cellRender={v => (
            <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{v}%</span>
            </span>
          )}
          minWidth={620}
        />
      </Card>

      {/* Mejor ventana · Períodos a evitar */}
      <div className="rg-2">
        <Card>
          <SectionHeader
            title="Mejor ventana"
            subtitle="Top 3 meses para sembrar"
            action={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: colores.exito }}>
                <TrendingUp size={14} /> Recomendado
              </span>
            }
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mejor.map((m, i) => (
              <div
                key={m.mes}
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: `1px solid ${i === 0 ? colores.bordeHover : colores.borde}`,
                  background: i === 0 ? colores.primarioClaro : colores.fondoSecundario,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: colores.gradienteAcento, color: colores.textoEnOscuro,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: colores.textoClaro, margin: 0 }}>{m.mes}</p>
                    <p style={{ fontSize: 11, color: colores.textoOscuro, margin: 0 }}>
                      {i === 0 ? 'Siembra recomendada' : 'Ventana alternativa'}
                    </p>
                  </div>
                </div>
                <Badge variant="success">{m.v}%</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeader
            title="Períodos a evitar"
            subtitle="Peores 3 meses para sembrar"
            action={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: colores.peligro }}>
                <TrendingDown size={14} /> Evitar
              </span>
            }
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {evitar.map((m, i) => (
              <div
                key={m.mes}
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: `1px solid ${colores.borde}`,
                  background: colores.fondoSecundario,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: `${colores.peligro}1A`, color: colores.peligro,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: colores.textoClaro, margin: 0 }}>{m.mes}</p>
                    <p style={{ fontSize: 11, color: colores.textoOscuro, margin: 0 }}>
                      Evitar siembra
                    </p>
                  </div>
                </div>
                <Badge variant="danger">{m.v}%</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MotorProbabilidad;
