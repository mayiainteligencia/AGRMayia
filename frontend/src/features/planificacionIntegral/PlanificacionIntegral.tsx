import React, { useMemo, useState } from 'react';
import { Sprout, ChevronDown, PlayCircle, Wheat } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { DataTable, type DataTableColumn } from '../../components/ui/DataTable';
import { GanttChart } from '../../components/ui/GanttChart';
import { brandingConfig } from '../../config/branding';
import { MESES } from '../calendarioSiembra/data/calendarioSiembra.dummy';
import { CULTIVOS_PLAN, construirGantt } from './data/planificacionIntegral.dummy';
import type { PlanCosechaItem } from '../../types/agro.types';

const { colores } = brandingConfig;

const fmtMxn = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
const fmtNum = (n: number) =>
  new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(n);

const AUTOCONSUMO = 0.6;
const EXCEDENTE  = 0.4;

const planColumns: DataTableColumn<PlanCosechaItem>[] = [
  { key: 'cultivo',        header: 'Cultivo',        render: c => <span style={{ color: colores.textoClaro, fontWeight: 600 }}>{c.cultivo}</span> },
  { key: 'kgPorHa',        header: 'Kg / Ha',        align: 'right', render: c => fmtNum(c.kgPorHa) },
  { key: 'produccionTotal', header: 'Producción Total', align: 'right', render: c => <span style={{ fontWeight: 600 }}>{fmtNum(c.produccionTotal)} kg</span> },
  { key: 'autoconsumo',    header: 'Autoconsumo 60%', align: 'right', render: c => <span style={{ color: colores.textoOscuro }}>{fmtNum(c.autoconsumo)} kg</span> },
  { key: 'excedente',      header: 'Excedente 40%',  align: 'right', render: c => <span style={{ color: colores.secundario, fontWeight: 600 }}>{fmtNum(c.excedente)} kg</span> },
  { key: 'valorEstMxn',    header: 'Valor Est.',     align: 'right', render: c => <span style={{ color: colores.primario, fontWeight: 700 }}>{fmtMxn(c.valorEstMxn)}</span> },
];

export const PlanificacionIntegral: React.FC = () => {
  const [mesSiembra, setMesSiembra] = useState<number>(4); // mayo
  const [superficie, setSuperficie] = useState<number>(5);
  const [seleccion, setSeleccion]   = useState<string[]>(['Arándano', 'Maíz', 'Cebolla']);
  const [generado, setGenerado]     = useState<boolean>(true);

  const toggle = (c: string) => {
    setSeleccion(s => s.includes(c) ? s.filter(x => x !== c) : [...s, c]);
    setGenerado(false);
  };

  const plan: PlanCosechaItem[] = useMemo(() => {
    if (!generado) return [];
    return seleccion.map(name => {
      const cfg = CULTIVOS_PLAN.find(c => c.cultivo === name);
      const kgPorHa = cfg?.kgPorHa ?? 0;
      const precio  = cfg?.precioMxnKg ?? 0;
      const produccionTotal = kgPorHa * superficie;
      const excedente = Math.round(produccionTotal * EXCEDENTE);
      return {
        cultivo: name,
        kgPorHa,
        produccionTotal,
        autoconsumo: Math.round(produccionTotal * AUTOCONSUMO),
        excedente,
        valorEstMxn: Math.round(excedente * precio),
      };
    });
  }, [seleccion, superficie, generado]);

  const totales = useMemo(() => ({
    excedente: plan.reduce((s, p) => s + p.excedente, 0),
    valor:     plan.reduce((s, p) => s + p.valorEstMxn, 0),
  }), [plan]);

  const ganttRows = useMemo(() => construirGantt(seleccion), [seleccion]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1
          className="page-title"
          style={{ fontSize: 28, fontWeight: 700, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}
        >
          Planificación Integral de Cosecha
        </h1>
        <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>
          Configura mes de siembra, superficie y cultivos · Gantt + proyección de excedente y valor comercial
        </p>
      </div>

      {/* Configurador */}
      <Card>
        <SectionHeader title="Configurador" subtitle="Define los parámetros del plan" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: colores.textoOscuro, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Mes de siembra
            </span>
            <div style={{ position: 'relative' }}>
              <select
                value={mesSiembra}
                onChange={e => { setMesSiembra(Number(e.target.value)); setGenerado(false); }}
                style={{
                  width: '100%', padding: '10px 36px 10px 12px',
                  borderRadius: 10, border: `1px solid ${colores.borde}`,
                  background: colores.fondoSecundario, fontSize: 13, color: colores.textoClaro,
                  appearance: 'none', cursor: 'pointer',
                }}
              >
                {MESES.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: colores.textoOscuro, pointerEvents: 'none' }} />
            </div>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: colores.textoOscuro, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Superficie (HA)
            </span>
            <input
              type="number"
              min={0.5} step={0.5} value={superficie}
              onChange={e => { setSuperficie(Math.max(0, Number(e.target.value))); setGenerado(false); }}
              style={{
                padding: '10px 12px',
                borderRadius: 10, border: `1px solid ${colores.borde}`,
                background: colores.fondoSecundario, fontSize: 13, color: colores.textoClaro,
              }}
            />
          </label>

          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: colores.textoOscuro, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Cultivos (multi-selección)
            </span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CULTIVOS_PLAN.map(c => {
                const on = seleccion.includes(c.cultivo);
                return (
                  <button
                    key={c.cultivo}
                    type="button"
                    onClick={() => toggle(c.cultivo)}
                    style={{
                      padding: '8px 14px', borderRadius: 999,
                      border: `1px solid ${on ? colores.bordeHover : colores.borde}`,
                      background: on ? colores.primarioClaro : colores.fondoSecundario,
                      color: on ? colores.primario : colores.textoMedio,
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    <Sprout size={12} /> {c.cultivo}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setGenerado(true)}
          disabled={seleccion.length === 0}
          style={{
            marginTop: 18,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 10, border: 'none',
            background: seleccion.length ? colores.gradientePrimario : colores.borde,
            color: colores.textoEnOscuro, fontSize: 13, fontWeight: 600,
            cursor: seleccion.length ? 'pointer' : 'not-allowed',
            boxShadow: colores.sombraMedia,
          }}
        >
          <PlayCircle size={16} />
          Generar plan
        </button>
      </Card>

      {/* Gantt */}
      <Card>
        <SectionHeader
          title="Diagrama de Gantt — Cultivos seleccionados"
          subtitle={`Crecimiento y cosecha por mes · mes de siembra base: ${MESES[mesSiembra]}`}
        />
        {seleccion.length === 0 ? (
          <p style={{ fontSize: 13, color: colores.textoOscuro, textAlign: 'center', padding: 28 }}>
            Selecciona al menos un cultivo
          </p>
        ) : (
          <GanttChart rows={ganttRows} months={MESES} highlightCol={mesSiembra} />
        )}
      </Card>

      {/* Proyección */}
      <Card padding={0}>
        <div style={{ padding: '20px 24px 12px' }}>
          <SectionHeader
            title="Proyección de producción y excedente"
            subtitle={`Superficie: ${superficie} ha · 60 % autoconsumo / 40 % excedente`}
            action={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: colores.secundario }}>
                <Wheat size={14} /> {plan.length} cultivo(s)
              </span>
            }
          />
        </div>
        <DataTable<PlanCosechaItem>
          columns={planColumns}
          rows={plan}
          rowKey={p => p.cultivo}
          empty={<div style={{ padding: 30, textAlign: 'center', color: colores.textoOscuro, fontSize: 13 }}>Genera un plan para ver la proyección</div>}
          minWidth={900}
        />
        {plan.length > 0 && (
          <div
            style={{
              padding: '14px 24px',
              borderTop: `1px solid ${colores.borde}`,
              display: 'flex', justifyContent: 'flex-end', gap: 24, alignItems: 'center', flexWrap: 'wrap',
              background: colores.fondoTerciario,
            }}
          >
            <div>
              <p style={{ fontSize: 10, color: colores.textoOscuro, margin: 0, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Excedente total
              </p>
              <p style={{ fontSize: 17, color: colores.secundario, margin: 0, fontWeight: 700 }}>
                {fmtNum(totales.excedente)} kg
              </p>
            </div>
            <div>
              <p style={{ fontSize: 10, color: colores.textoOscuro, margin: 0, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Valor comercial estimado
              </p>
              <p style={{ fontSize: 20, color: colores.primario, margin: 0, fontWeight: 700, letterSpacing: '-0.5px' }}>
                {fmtMxn(totales.valor)}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PlanificacionIntegral;
