import React, { useMemo, useState } from 'react';
import {
  Shield, ScanFace, KeyRound, Download, ChevronDown,
  CheckCircle, Delete, User2,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { brandingConfig } from '../../config/branding';
import {
  camposDisponibles,
  colaboradoresActivos,
  registrosHoy,
} from './data/registroEntradaTurno.dummy';
import type { RegistroTurno } from '../../types/agro.types';

const { colores } = brandingConfig;

type Paso = 1 | 2 | 3;

const turnoLabel: Record<RegistroTurno['turno'], string> = {
  matutino:   'Matutino',
  vespertino: 'Vespertino',
  nocturno:   'Nocturno',
};

const estadoVariant: Record<RegistroTurno['estado'], 'success' | 'warning' | 'danger'> = {
  completado: 'success',
  pendiente:  'warning',
  rechazado:  'danger',
};

const columns: DataTableColumn<RegistroTurno>[] = [
  { key: 'colaborador', header: 'Colaborador', render: r => <span style={{ color: colores.textoClaro, fontWeight: 600 }}>{r.colaborador}</span> },
  { key: 'puesto', header: 'Puesto' },
  { key: 'campo', header: 'Campo' },
  { key: 'horaEntrada', header: 'Hora Entrada', nowrap: true, render: r => <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>{r.horaEntrada}</span> },
  {
    key: 'verificacionFacial',
    header: 'Verif. Facial',
    align: 'center',
    render: r =>
      r.verificacionFacial
        ? <CheckCircle size={16} color={colores.exito} />
        : <span style={{ color: colores.peligro, fontWeight: 700 }}>✕</span>,
  },
  {
    key: 'pinVerificado',
    header: 'PIN Verificado',
    align: 'center',
    render: r =>
      r.pinVerificado
        ? <CheckCircle size={16} color={colores.exito} />
        : <span style={{ color: colores.advertencia, fontWeight: 700 }}>—</span>,
  },
  { key: 'turno', header: 'Turno', render: r => turnoLabel[r.turno] },
  { key: 'estado', header: 'Estado', render: r => <Badge variant={estadoVariant[r.estado]}>{r.estado}</Badge> },
];

/* ─── Step indicator ─────────────────────────────────────── */
const StepIndicator: React.FC<{ activo: Paso }> = ({ activo }) => {
  const pasos: { n: Paso; label: string }[] = [
    { n: 1, label: 'Colaborador' },
    { n: 2, label: 'Reconocimiento facial' },
    { n: 3, label: 'PIN' },
  ];
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      {pasos.map((p, i) => {
        const done = activo > p.n;
        const here = activo === p.n;
        return (
          <React.Fragment key={p.n}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 999,
                background: here ? colores.primarioClaro : done ? colores.fondoTerciario : colores.fondoSecundario,
                border: `1px solid ${here ? colores.bordeHover : colores.borde}`,
              }}
            >
              <span
                style={{
                  width: 20, height: 20, borderRadius: '50%',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? colores.exito : here ? colores.primario : colores.borde,
                  color: colores.textoEnOscuro, fontSize: 11, fontWeight: 700,
                }}
              >
                {done ? '✓' : p.n}
              </span>
              <span style={{ fontSize: 12, color: done ? colores.exito : here ? colores.primario : colores.textoOscuro, fontWeight: 600 }}>
                {p.label}
              </span>
            </div>
            {i < pasos.length - 1 && (
              <div style={{ width: 18, height: 1, background: colores.borde }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ─── Página ──────────────────────────────────────────────── */
export const RegistroEntradaTurno: React.FC = () => {
  const [campo, setCampo] = useState<string>('');
  const [colaboradorId, setColaboradorId] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [facialOk, setFacialOk] = useState<boolean>(false);

  const paso: Paso = !colaboradorId ? 1 : !facialOk ? 2 : 3;

  const colaboradoresFiltrados = useMemo(
    () => colaboradoresActivos.filter(c => !campo || c.campo === campo),
    [campo],
  );

  const colaboradorSel = colaboradoresActivos.find(c => c.id === colaboradorId);

  const handlePinDigit = (d: string) => {
    if (d === 'del') setPin(p => p.slice(0, -1));
    else if (pin.length < 6) setPin(p => p + d);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1
          className="page-title"
          style={{ fontSize: 28, fontWeight: 700, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}
        >
          Registro de Entrada — Turno
        </h1>
        <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>
          Verificación de identidad en 3 pasos para inicio de turno
        </p>
      </div>

      {/* Suite de Seguridad badge */}
      <div
        style={{
          padding: '12px 18px',
          borderRadius: 12,
          background: `linear-gradient(135deg, ${colores.primarioOscuro} 0%, ${colores.primario} 100%)`,
          color: colores.textoEnOscuro,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Shield size={18} />
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' }}>
          Suite de Seguridad™ — Capa 02 · Verificación biométrica + PIN
        </span>
        <StepIndicator activo={paso} />
      </div>

      {/* Flujo 3 pasos */}
      <div className="rg-3">
        {/* Paso 1: Colaborador */}
        <Card>
          <SectionHeader title="1 · Seleccionar colaborador" subtitle="Filtra por campo y elige al colaborador" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: colores.textoOscuro, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Campo
              </span>
              <div style={{ position: 'relative' }}>
                <select
                  value={campo}
                  onChange={e => { setCampo(e.target.value); setColaboradorId(''); setFacialOk(false); setPin(''); }}
                  style={{
                    width: '100%', padding: '10px 36px 10px 12px',
                    borderRadius: 10, border: `1px solid ${colores.borde}`,
                    background: colores.fondoSecundario, fontSize: 13, color: colores.textoClaro,
                    appearance: 'none', cursor: 'pointer',
                  }}
                >
                  <option value="">Todos los campos</option>
                  {camposDisponibles.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: colores.textoOscuro, pointerEvents: 'none' }} />
              </div>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: colores.textoOscuro, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Colaborador
              </span>
              <div style={{ position: 'relative' }}>
                <select
                  value={colaboradorId}
                  onChange={e => { setColaboradorId(e.target.value); setFacialOk(false); setPin(''); }}
                  style={{
                    width: '100%', padding: '10px 36px 10px 12px',
                    borderRadius: 10, border: `1px solid ${colores.borde}`,
                    background: colores.fondoSecundario, fontSize: 13, color: colores.textoClaro,
                    appearance: 'none', cursor: 'pointer',
                  }}
                >
                  <option value="">Selecciona…</option>
                  {colaboradoresFiltrados.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} — {c.puesto}</option>
                  ))}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: colores.textoOscuro, pointerEvents: 'none' }} />
              </div>
            </label>

            {colaboradorSel && (
              <div style={{ padding: '10px 12px', borderRadius: 8, background: colores.primarioClaro, display: 'flex', alignItems: 'center', gap: 10 }}>
                <User2 size={16} color={colores.primario} />
                <div style={{ fontSize: 12 }}>
                  <div style={{ fontWeight: 700, color: colores.primario }}>{colaboradorSel.nombre}</div>
                  <div style={{ color: colores.textoMedio }}>{colaboradorSel.puesto} · {colaboradorSel.campo}</div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Paso 2: Facial */}
        <Card>
          <SectionHeader title="2 · Reconocimiento facial" subtitle="Posiciona el rostro frente a la cámara" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <div
              style={{
                width: '100%',
                aspectRatio: '4 / 3',
                borderRadius: 12,
                border: `2px dashed ${facialOk ? colores.exito : colores.borde}`,
                background: facialOk ? `${colores.exito}11` : '#0E2318',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: facialOk ? colores.exito : 'rgba(255,255,255,0.4)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <ScanFace size={64} strokeWidth={1.2} />
              {!colaboradorSel && (
                <div style={{ position: 'absolute', bottom: 12, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                  Selecciona un colaborador para continuar
                </div>
              )}
              {facialOk && (
                <div style={{ position: 'absolute', top: 10, right: 10, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700 }}>
                  <CheckCircle size={14} /> Coincidencia
                </div>
              )}
            </div>
            <button
              type="button"
              disabled={!colaboradorSel || facialOk}
              onClick={() => setFacialOk(true)}
              style={{
                padding: '10px 16px', borderRadius: 10, border: 'none', cursor: colaboradorSel && !facialOk ? 'pointer' : 'not-allowed',
                background: facialOk ? colores.exito : colaboradorSel ? colores.gradientePrimario : colores.borde,
                color: colores.textoEnOscuro, fontSize: 13, fontWeight: 600,
                width: '100%',
                opacity: colaboradorSel ? 1 : 0.6,
              }}
            >
              {facialOk ? 'Verificación facial OK' : 'Iniciar reconocimiento'}
            </button>
          </div>
        </Card>

        {/* Paso 3: PIN */}
        <Card>
          <SectionHeader title="3 · PIN de 6 dígitos" subtitle="Confirma con tu PIN personal" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 32, height: 40, borderRadius: 8,
                    border: `1px solid ${colores.borde}`,
                    background: colores.fondoSecundario,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, fontWeight: 700, color: colores.primario,
                  }}
                >
                  {pin[i] ? '•' : ''}
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {['1','2','3','4','5','6','7','8','9','','0','del'].map((d, i) => {
                if (d === '') return <div key={i} />;
                const isDel = d === 'del';
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!facialOk}
                    onClick={() => handlePinDigit(d)}
                    style={{
                      padding: '10px 0', borderRadius: 8,
                      border: `1px solid ${colores.borde}`,
                      background: colores.fondoSecundario,
                      fontSize: 15, fontWeight: 600,
                      color: isDel ? colores.peligro : colores.textoClaro,
                      cursor: facialOk ? 'pointer' : 'not-allowed',
                      opacity: facialOk ? 1 : 0.5,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    }}
                  >
                    {isDel ? <Delete size={16} /> : d}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={!facialOk || pin.length !== 6}
              style={{
                padding: '10px 16px', borderRadius: 10, border: 'none',
                background: pin.length === 6 ? colores.gradientePrimario : colores.borde,
                color: colores.textoEnOscuro, fontSize: 13, fontWeight: 600,
                cursor: pin.length === 6 ? 'pointer' : 'not-allowed',
              }}
            >
              <KeyRound size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Validar y registrar entrada
            </button>
          </div>
        </Card>
      </div>

      {/* Tabla registros hoy */}
      <Card padding={0}>
        <div style={{ padding: '20px 24px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <SectionHeader
            title="Registros de entrada de turno — hoy"
            subtitle={`${registrosHoy.length} eventos · facial + PIN verificados`}
          />
          <button
            type="button"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 10,
              border: `1px solid ${colores.borde}`,
              background: colores.fondoSecundario, cursor: 'pointer',
              color: colores.textoMedio, fontSize: 12, fontWeight: 600,
            }}
          >
            <Download size={14} /> Exportar log
          </button>
        </div>
        <DataTable<RegistroTurno>
          columns={columns}
          rows={registrosHoy}
          rowKey={r => r.id}
          minWidth={1000}
        />
      </Card>
    </div>
  );
};

export default RegistroEntradaTurno;
