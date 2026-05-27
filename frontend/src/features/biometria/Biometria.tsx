import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import { Activity, Ruler, FlaskConical } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { CustomTooltip } from '../../components/charts/CustomTooltip';
import { biometriaKPIs, crecimientoTallo, distribucionMedidas, muestreos } from './data/biometria.dummy';
import type { PuntoMuestreo } from '../../types/agro.types';

const ICONS = [<Ruler size={18} />, <Activity size={18} />, <FlaskConical size={18} />];

const estadoColor: Record<PuntoMuestreo['estado'], string> = {
  normal: '#059669',
  bajo:   '#D97706',
  alto:   '#5C3D8F',
};
const estadoBadge: Record<PuntoMuestreo['estado'], 'success' | 'warning' | 'info'> = {
  normal: 'success',
  bajo:   'warning',
  alto:   'info',
};

export const Biometria: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>
        Biometria
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0 0' }}>
        Crecimiento de tallo, muestreo en patron Z y analisis de laboratorio (foliar, agua de riego/almacenamiento/drenaje y sustrato)
      </p>
      <p style={{ fontSize: 12, color: '#9CA3AF', margin: '4px 0 0 0' }}>
        Maquia captura hasta 4 fotos por baya para evaluar tamano, color, blush y defectos.
      </p>
    </div>

    {/* KPI Row */}
    <div className="rg-3">
      {biometriaKPIs.map((kpi, i) => (
        <StatCard key={kpi.id} {...kpi} icon={ICONS[i]} />
      ))}
    </div>

    {/* Charts */}
    <div className="rg-3-2">
      {/* Crecimiento tallo */}
      <Card>
        <SectionHeader
          title="Crecimiento de Tallo — Semana a Semana"
          subtitle="mm/semana | Promedio, rango (min-max) y benchmark"
        />
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={crecimientoTallo} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="semana" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} unit=" mm" domain={[0, 12]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            <ReferenceLine y={8.5} stroke="#D97706" strokeDasharray="4 3" strokeOpacity={0.7} label={{ value: 'Benchmark', fill: '#D97706', fontSize: 10, position: 'insideTopRight' }} />
            <Line type="monotone" dataKey="maximo"   name="Maximo"    stroke="#B7E4C7" strokeWidth={1.5} dot={false} strokeDasharray="3 2" />
            <Line type="monotone" dataKey="promedio" name="Promedio"  stroke="#2D6A4F" strokeWidth={2.5} dot={{ r: 3, fill: '#2D6A4F' }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="minimo"   name="Minimo"    stroke="#9CA3AF" strokeWidth={1.5} dot={false} strokeDasharray="3 2" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Distribucion / Bell curve */}
      <Card>
        <SectionHeader
          title="Distribucion de Medidas"
          subtitle="Frecuencia real vs distribucion normal esperada"
        />
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={distribucionMedidas} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="rango" tick={{ fontSize: 9, fill: '#9CA3AF' }} axisLine={false} tickLine={false} angle={-30} dy={8} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} unit=" pl" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            <Bar dataKey="plantas"  name="Real"      fill="#2D6A4F" radius={[4, 4, 0, 0]} />
            <Bar dataKey="esperado" name="Esperado"  fill="#B7E4C7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>

    {/* Muestreos Table */}
    <Card>
      <SectionHeader
        title="Registro de Muestreo — Patron Z"
        subtitle="Plantas muestreadas en diagonal | Excluye bordes · Maquia: hasta 4 fotos/baya"
        action={
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>72 / 120 plantas completadas</span>
        }
      />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Planta', 'Sector', 'Crec. Semanal', 'Altura', 'Estado'].map(h => (
                <th key={h} style={{
                  padding: '10px 14px',
                  textAlign: 'left',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#6B7280',
                  borderBottom: '1px solid #E5E7EB',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {muestreos.map((m, i) => (
              <tr key={m.id} style={{ backgroundColor: i % 2 === 0 ? '#FAFAFA' : '#FFFFFF' }}>
                <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{m.planta}</td>
                <td style={{ padding: '11px 14px', fontSize: 13, color: '#374151' }}>{m.sector}</td>
                <td style={{ padding: '11px 14px', fontSize: 13, color: estadoColor[m.estado], fontWeight: 600 }}>
                  {m.crecimientoSemanal} mm/sem
                </td>
                <td style={{ padding: '11px 14px', fontSize: 13, color: '#374151' }}>{m.alturaCm} cm</td>
                <td style={{ padding: '11px 14px' }}>
                  <Badge variant={estadoBadge[m.estado]}>{m.estado}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);
