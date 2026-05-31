import React, { useEffect, useRef, useState } from 'react';
import { Radio, Mic, MicOff, Bug, CheckCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { brandingConfig } from '../../config/branding';
import { patronesAcusticos, logDetecciones, type DeteccionAcustica } from './data/bioAcousticSentinel.dummy';
import type { PatronAcustico } from '../../types/agro.types';

const { colores } = brandingConfig;

const NUM_BARS = 32;

/* Patrón normal vs alerta */
const esNormal = (patronId: string) => patronId === 'BA-005';

const patronesColumns: DataTableColumn<PatronAcustico>[] = [
  { key: 'patron', header: 'Patrón', render: p => <span style={{ color: colores.textoClaro, fontWeight: 600 }}>{p.patron}</span> },
  {
    key: 'freq',
    header: 'Freq. característica',
    nowrap: true,
    render: p => (
      <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>
        {p.freqMinHz}–{p.freqMaxHz} Hz
      </span>
    ),
  },
  {
    key: 'indicador',
    header: 'Indicador probable',
    render: p => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {p.id === 'BA-005'
          ? <CheckCircle size={14} color={colores.exito} />
          : <Bug size={14} color={colores.advertencia} />}
        <span style={{ color: p.id === 'BA-005' ? colores.exito : colores.textoClaro, fontWeight: 600 }}>
          {p.indicador}
        </span>
      </span>
    ),
  },
  { key: 'accion', header: 'Acción', render: p => <span style={{ color: colores.textoMedio }}>{p.accion}</span> },
];

const deteccionesColumns: DataTableColumn<DeteccionAcustica>[] = [
  { key: 'timestamp', header: 'Hora', nowrap: true, render: d => <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>{d.timestamp}</span> },
  { key: 'patron', header: 'Patrón', render: d => <span style={{ color: colores.textoClaro, fontWeight: 600 }}>{d.patron}</span> },
  { key: 'freq', header: 'Freq.', align: 'right', nowrap: true, render: d => <span style={{ fontFamily: 'ui-monospace, monospace' }}>{d.freqHz} Hz</span> },
  {
    key: 'intensidad',
    header: 'Intensidad',
    align: 'right',
    render: d => <span style={{ fontWeight: 600, color: d.intensidad > 50 ? colores.advertencia : colores.textoMedio }}>{d.intensidad}%</span>,
  },
  {
    key: 'estado',
    header: 'Estado',
    render: d => <Badge variant={esNormal(d.patronId) ? 'success' : 'warning'}>{esNormal(d.patronId) ? 'Normal' : 'Alerta'}</Badge>,
  },
];

export const BioAcousticSentinel: React.FC = () => {
  const [activo, setActivo] = useState(false);
  const [bars, setBars] = useState<number[]>(() => Array(NUM_BARS).fill(8));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!activo) {
      setBars(Array(NUM_BARS).fill(8));
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    let t = 0;
    const tick = () => {
      t += 0.06;
      setBars(Array.from({ length: NUM_BARS }, (_, i) => {
        const base = Math.sin(t + i * 0.45) * 22 + 28;
        const noise = Math.random() * 20;
        return Math.max(4, Math.min(80, base + noise));
      }));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [activo]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1
          className="page-title"
          style={{ fontSize: 28, fontWeight: 700, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}
        >
          Bio-Acoustic Sentinel™
        </h1>
        <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>
          Detección de plagas por audio en el campo · análisis cíclico de patrones de frecuencia
        </p>
      </div>

      {/* Banner */}
      <div
        style={{
          padding: '14px 18px',
          borderRadius: 12,
          background: `linear-gradient(135deg, ${colores.acentoBerry}1A 0%, ${colores.acentoBerry}0D 100%)`,
          border: `1px solid ${colores.acentoBerry}33`,
          display: 'flex', alignItems: 'center', gap: 14,
        }}
      >
        <div
          style={{
            width: 40, height: 40, borderRadius: 10,
            background: colores.gradienteBerry, color: colores.textoEnOscuro,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Radio size={18} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: colores.acentoBerry, margin: 0 }}>
            Sentinel de audio para detección de plagas
          </p>
          <p style={{ fontSize: 12, color: colores.textoMedio, margin: '2px 0 0', lineHeight: 1.5 }}>
            Web Audio API · análisis de patrones cada 9–12 s · clasificación por frecuencia característica.
          </p>
        </div>
      </div>

      <div className="rg-2-1">
        {/* Micrófono + visualizador */}
        <Card>
          <SectionHeader
            title="Micrófono del campo"
            subtitle={activo ? 'Captura activa · análisis continuo' : 'Inactivo · presiona Activar para iniciar'}
            action={
              <Badge variant={activo ? 'success' : 'neutral'}>
                {activo ? 'Activo' : 'Inactivo'}
              </Badge>
            }
          />

          <div
            style={{
              height: 140, borderRadius: 12,
              background: '#0E2318',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 3,
              padding: '12px 16px', marginBottom: 16,
              border: `1px solid ${activo ? colores.bordeHover + 'AA' : 'rgba(255,255,255,0.08)'}`,
              overflow: 'hidden',
            }}
          >
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: activo
                    ? `linear-gradient(180deg, ${colores.acento} 0%, ${colores.secundario} 100%)`
                    : 'rgba(255,255,255,0.18)',
                  borderRadius: 2,
                  transition: 'height 0.08s linear',
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setActivo(a => !a)}
            style={{
              width: '100%',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '12px 18px', borderRadius: 10, border: 'none',
              background: activo ? colores.peligro : colores.gradientePrimario,
              color: colores.textoEnOscuro, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', boxShadow: colores.sombraMedia,
            }}
          >
            {activo ? <MicOff size={16} /> : <Mic size={16} />}
            {activo ? 'Detener captura' : 'Activar micrófono'}
          </button>
        </Card>

        {/* Log de detección */}
        <Card padding={0}>
          <div style={{ padding: '20px 24px 12px' }}>
            <SectionHeader
              title="Log de detección"
              subtitle="Últimos eventos clasificados por el motor"
            />
          </div>
          <DataTable<DeteccionAcustica>
            columns={deteccionesColumns}
            rows={logDetecciones}
            rowKey={d => d.id}
            minWidth={520}
          />
        </Card>
      </div>

      {/* Patrones configurados */}
      <Card padding={0}>
        <div style={{ padding: '20px 24px 12px' }}>
          <SectionHeader
            title="Patrones de alerta configurados"
            subtitle="Bancos de frecuencia con su indicador probable y acción"
          />
        </div>
        <DataTable<PatronAcustico>
          columns={patronesColumns}
          rows={patronesAcusticos}
          rowKey={p => p.id}
          minWidth={840}
        />
      </Card>
    </div>
  );
};

export default BioAcousticSentinel;
