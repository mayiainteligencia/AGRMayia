import React from 'react';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, Legend,
} from 'recharts';
import { Droplet, FlaskConical, Beaker, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { CustomTooltip } from '../../components/charts/CustomTooltip';
import {
  riegoKPIs,
  phHistorico,
  ecHistorico,
  valoresPorEtapa,
  interaccionesNutrientes,
  lmrExportacion,
} from './data/riego.dummy';

const ICONS = [
  <Droplet size={18} />,
  <Beaker size={18} />,
  <FlaskConical size={18} />,
  <ShieldCheck size={18} />,
];

const lmrBadge: Record<string, 'success' | 'warning' | 'danger'> = {
  'OK': 'success',
  'Vigilar': 'warning',
  'Excede': 'danger',
};

export const Riego: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>
        Riego y Nutricion
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0 0' }}>
        Monitoreo local y remoto del esquema de nutricion: EC/PPM y pH en agua de riego, sustrato y drenaje · Ventanas de absorcion y LMR para exportacion.
      </p>
    </div>

    <div className="rg-4">
      {riegoKPIs.map((kpi, i) => (
        <StatCard key={kpi.id} {...kpi} icon={ICONS[i]} />
      ))}
    </div>

    {/* pH histórico */}
    <div className="rg-2">
      <Card>
        <SectionHeader
          title="pH — Riego vs Sustrato vs Drenaje"
          subtitle="Tres puntos clave: agua de entrada, sustrato y agua escurrida"
        />
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={phHistorico} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={[4.5, 7]} />
            <ReferenceArea y1={5.5} y2={6.0} fill="#52B788" fillOpacity={0.07} label={{ value: 'pH optimo riego', fill: '#52B788', fontSize: 10, position: 'insideTopRight' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            <Line type="monotone" dataKey="riego"    name="Agua riego" stroke="#0284C7" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="sustrato" name="Sustrato"   stroke="#2D6A4F" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="drenaje"  name="Drenaje"    stroke="#D97706" strokeWidth={2.5} dot={false} strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionHeader
          title="EC — Entrada vs Drenaje"
          subtitle="mS/cm · 1 mS/cm ≈ 640–700 PPM"
        />
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={ecHistorico} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={[0.5, 3]} unit=" mS" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            <Line type="monotone" dataKey="entrada" name="EC entrada" stroke="#5C3D8F" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="drenaje" name="EC drenaje" stroke="#D97706" strokeWidth={2.5} dot={false} strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>

    {/* Valores ideales por etapa */}
    <Card>
      <SectionHeader
        title="Valores Ideales por Etapa Fenologica"
        subtitle="EC y pH objetivo segun el estado de la planta"
      />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Etapa', 'EC min', 'EC max', 'pH Riego', 'Notas'].map(h => (
                <th key={h} style={{
                  padding: '10px 14px',
                  textAlign: 'left',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#6B7280',
                  borderBottom: '1px solid #E5E7EB',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {valoresPorEtapa.map((v, i) => (
              <tr key={v.etapa} style={{ backgroundColor: i % 2 === 0 ? '#FAFAFA' : '#FFFFFF' }}>
                <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{v.etapa}</td>
                <td style={{ padding: '11px 14px', fontSize: 13, color: '#374151' }}>{v.ecMin} mS/cm</td>
                <td style={{ padding: '11px 14px', fontSize: 13, color: '#374151' }}>{v.ecMax} mS/cm</td>
                <td style={{ padding: '11px 14px', fontSize: 13, color: '#374151' }}>{v.phRiego}</td>
                <td style={{ padding: '11px 14px', fontSize: 12, color: '#6B7280' }}>{v.notas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>

    {/* Sinergias y antagonismos */}
    <Card>
      <SectionHeader
        title="Sinergias y Antagonismos — Ventana de Absorcion por pH"
        subtitle="Cada elemento tiene un rango de pH ideal en agua y sustrato"
      />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Elemento', 'Sinergia con', 'Antagonista con', 'Ventana pH', 'Nota'].map(h => (
                <th key={h} style={{
                  padding: '10px 14px',
                  textAlign: 'left',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#6B7280',
                  borderBottom: '1px solid #E5E7EB',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {interaccionesNutrientes.map((n, i) => (
              <tr key={n.elemento} style={{ backgroundColor: i % 2 === 0 ? '#FAFAFA' : '#FFFFFF' }}>
                <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{n.elemento}</td>
                <td style={{ padding: '11px 14px', fontSize: 13, color: '#059669' }}>{n.sinergia}</td>
                <td style={{ padding: '11px 14px', fontSize: 13, color: '#DC2626' }}>{n.antagonismo}</td>
                <td style={{ padding: '11px 14px', fontSize: 13, color: '#374151' }}>{n.ventanaPh}</td>
                <td style={{ padding: '11px 14px', fontSize: 12, color: '#6B7280' }}>{n.nota}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>

    {/* LMR */}
    <Card>
      <SectionHeader
        title="LMR — Limites Maximos de Residuos para Exportacion"
        subtitle="Cumplimiento de residuos por mercado destino"
      />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Mercado', 'Residuo', 'LMR', 'Estado', 'Ultimo lote'].map(h => (
                <th key={h} style={{
                  padding: '10px 14px',
                  textAlign: 'left',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#6B7280',
                  borderBottom: '1px solid #E5E7EB',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lmrExportacion.map((l, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#FAFAFA' : '#FFFFFF' }}>
                <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{l.mercado}</td>
                <td style={{ padding: '11px 14px', fontSize: 13, color: '#374151' }}>{l.residuo}</td>
                <td style={{ padding: '11px 14px', fontSize: 13, color: '#374151' }}>{l.lmr}</td>
                <td style={{ padding: '11px 14px' }}>
                  <Badge variant={lmrBadge[l.estado] ?? 'neutral'}>{l.estado}</Badge>
                </td>
                <td style={{ padding: '11px 14px', fontSize: 13, color: '#374151' }}>{l.ultimoLote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);
