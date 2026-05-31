import React, { useMemo, useState } from 'react';
import { Layers, Timer, FlaskConical } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { brandingConfig } from '../../config/branding';
import { TEXTURAS_USDA, clasificarUSDA, PRESCRIPCION_BASE } from './data/soilBioVision.dummy';
import type { ResultadoJarTest } from '../../types/agro.types';

const { colores } = brandingConfig;

/* ─── Input numérico con label ───────────────────────────── */
const NumInput: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}> = ({ label, value, onChange, color }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <span style={{ fontSize: 11, fontWeight: 600, color: colores.textoOscuro, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
      {label}
    </span>
    <div style={{ position: 'relative' }}>
      <input
        type="number"
        min={0} step={0.5} value={value}
        onChange={e => onChange(Math.max(0, Number(e.target.value)))}
        style={{
          width: '100%', padding: '10px 44px 10px 12px',
          borderRadius: 10, border: `1px solid ${colores.borde}`,
          background: colores.fondoSecundario, fontSize: 14, color: colores.textoClaro, fontWeight: 600,
        }}
      />
      <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: colores.textoOscuro, fontWeight: 600 }}>
        mm
      </span>
    </div>
  </label>
);

export const SoilBioVision: React.FC = () => {
  const [arena, setArena]   = useState(40);
  const [limo, setLimo]     = useState(30);
  const [arcilla, setArcilla] = useState(20);
  const [mo, setMo]         = useState(8);

  const resultado: ResultadoJarTest = useMemo(() => {
    const mineralTotal = arena + limo + arcilla || 1;
    const arenaPct   = (arena   / mineralTotal) * 100;
    const limoPct    = (limo    / mineralTotal) * 100;
    const arcillaPct = (arcilla / mineralTotal) * 100;
    const tex = clasificarUSDA(arenaPct, limoPct, arcillaPct);
    return {
      arenaMm: arena, limoMm: limo, arcillaMm: arcilla, materiaOrganicaMm: mo,
      clasificacion: tex.nombre,
      diagnostico: tex.diagnostico,
      prescripcion: PRESCRIPCION_BASE[tex.nombre] ?? '',
    };
  }, [arena, limo, arcilla, mo]);

  const totalMm = arena + limo + arcilla + mo || 1;
  const arenaH = (arena / totalMm) * 100;
  const limoH  = (limo  / totalMm) * 100;
  const arcillaH = (arcilla / totalMm) * 100;
  const moH   = (mo    / totalMm) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1
          className="page-title"
          style={{ fontSize: 28, fontWeight: 700, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}
        >
          Soil-Bio-Vision™
        </h1>
        <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>
          Jar test 24 h · clasificación por triángulo de texturas USDA
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
          <Layers size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: colores.primario, margin: 0 }}>
            Jar test 24 h · Triángulo de Texturas USDA
          </p>
          <p style={{ fontSize: 12, color: colores.textoMedio, margin: '2px 0 0', lineHeight: 1.5 }}>
            Mide en mm cada capa luego de 24 h de sedimentación; calculamos la clasificación y la prescripción.
          </p>
        </div>
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 14px', borderRadius: 10,
            background: colores.fondoSecundario, border: `1px solid ${colores.borde}`,
          }}
        >
          <Timer size={14} color={colores.secundario} />
          <span style={{ fontSize: 13, fontWeight: 700, color: colores.primario, fontFamily: 'ui-monospace, monospace' }}>
            24:00:00
          </span>
        </div>
      </div>

      {/* Inputs + Tarro + Resultados */}
      <div className="rg-3">
        <Card>
          <SectionHeader title="1 · Inputs del jar test" subtitle="Altura de cada capa (mm)" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <NumInput label="Arena"            value={arena}   onChange={setArena}   color={colores.advertencia} />
            <NumInput label="Limo"             value={limo}    onChange={setLimo}    color={colores.info} />
            <NumInput label="Arcilla"          value={arcilla} onChange={setArcilla} color={colores.peligro} />
            <NumInput label="Materia orgánica" value={mo}      onChange={setMo}      color={colores.acentoBerry} />
          </div>
        </Card>

        <Card>
          <SectionHeader title="2 · Tarro" subtitle="Visualización de capas" />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: 130, height: 280, borderRadius: '14px 14px 18px 18px',
                border: `3px solid ${colores.textoOscuro}55`,
                overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                background: colores.fondoTerciario,
                position: 'relative',
                boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ flexBasis: `${moH}%`,    background: `${colores.acentoBerry}AA` }} title={`MO ${mo} mm`} />
              <div style={{ flexBasis: `${arcillaH}%`, background: `${colores.peligro}CC` }}    title={`Arcilla ${arcilla} mm`} />
              <div style={{ flexBasis: `${limoH}%`,  background: `${colores.info}CC` }}       title={`Limo ${limo} mm`} />
              <div style={{ flexBasis: `${arenaH}%`, background: `${colores.advertencia}DD` }} title={`Arena ${arena} mm`} />
              <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', width: 60, height: 14, background: colores.fondoTerciario, borderRadius: '6px 6px 0 0', border: `2px solid ${colores.textoOscuro}55`, borderBottom: 'none' }} />
            </div>
          </div>
          <p style={{ fontSize: 11, color: colores.textoOscuro, textAlign: 'center', margin: '10px 0 0', fontFamily: 'ui-monospace, monospace' }}>
            Total: {arena + limo + arcilla + mo} mm
          </p>
        </Card>

        <Card>
          <SectionHeader title="3 · Resultados y diagnóstico" subtitle="Clasificación USDA" action={<FlaskConical size={14} color={colores.secundario} />} />
          <div
            style={{
              padding: '14px 16px', borderRadius: 10,
              background: colores.primarioClaro,
              border: `1px solid ${colores.bordeHover}55`,
              display: 'flex', flexDirection: 'column', gap: 6,
            }}
          >
            <p style={{ fontSize: 10, color: colores.textoOscuro, margin: 0, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Clasificación
            </p>
            <p style={{ fontSize: 22, color: colores.primario, margin: 0, fontWeight: 700, letterSpacing: '-0.5px' }}>
              {resultado.clasificacion}
            </p>
            <p style={{ fontSize: 12, color: colores.textoMedio, margin: '4px 0 0', lineHeight: 1.5 }}>
              {resultado.diagnostico}
            </p>
            <p style={{ fontSize: 12, color: colores.secundario, margin: '6px 0 0', fontWeight: 600, lineHeight: 1.5 }}>
              Prescripción: {resultado.prescripcion}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 12 }}>
            {[
              { l: 'Arena',   v: ((arena   / (arena + limo + arcilla || 1)) * 100).toFixed(0) + '%', c: colores.advertencia },
              { l: 'Limo',    v: ((limo    / (arena + limo + arcilla || 1)) * 100).toFixed(0) + '%', c: colores.info },
              { l: 'Arcilla', v: ((arcilla / (arena + limo + arcilla || 1)) * 100).toFixed(0) + '%', c: colores.peligro },
            ].map(s => (
              <div key={s.l} style={{ padding: '8px 6px', borderRadius: 8, background: colores.fondoTerciario, textAlign: 'center' }}>
                <p style={{ fontSize: 10, color: colores.textoOscuro, margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>{s.l}</p>
                <p style={{ fontSize: 14, color: s.c, margin: 0, fontWeight: 700 }}>{s.v}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Triángulo USDA */}
      <Card>
        <SectionHeader title="Triángulo de Texturas USDA" subtitle="Clases y rangos de referencia" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
          {TEXTURAS_USDA.map(t => {
            const activo = t.nombre === resultado.clasificacion;
            return (
              <div
                key={t.nombre}
                style={{
                  padding: '12px 14px', borderRadius: 10,
                  border: `1px solid ${activo ? colores.bordeHover : colores.borde}`,
                  background: activo ? colores.primarioClaro : colores.fondoSecundario,
                }}
              >
                <p style={{ fontSize: 13, fontWeight: 700, color: activo ? colores.primario : colores.textoClaro, margin: 0 }}>
                  {t.nombre} {activo && '★'}
                </p>
                <p style={{ fontSize: 11, color: colores.textoOscuro, margin: '4px 0 0', fontFamily: 'ui-monospace, monospace' }}>
                  {t.rango}
                </p>
                <p style={{ fontSize: 12, color: colores.textoMedio, margin: '6px 0 0', lineHeight: 1.5 }}>
                  {t.diagnostico}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default SoilBioVision;
