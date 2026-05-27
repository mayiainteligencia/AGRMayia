import React from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import { Package, Thermometer, CheckCircle, Droplet } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { CustomTooltip } from '../../components/charts/CustomTooltip';
import { packingKPIs, calidadBatch, cadenaFrio, lotes } from './data/packing.dummy';
import type { LotePacking } from '../../types/agro.types';

const estadoBadge: Record<LotePacking['estado'], 'info' | 'success' | 'warning' | 'neutral'> = {
  'en-proceso': 'info',
  'empacado':   'warning',
  'en-frio':    'info',
  'enviado':    'success',
};

const ICONS = [<Droplet size={18} />, <Package size={18} />, <Thermometer size={18} />, <CheckCircle size={18} />];

export const Packing: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>
        Packing
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0 0' }}>
        Empaque, control de calidad y cadena de frio
      </p>
    </div>

    {/* KPI Row */}
    <div className="rg-4">
      {packingKPIs.map((kpi, i) => (
        <StatCard key={kpi.id} {...kpi} icon={ICONS[i]} />
      ))}
    </div>

    {/* Charts Row */}
    <div className="rg-2">
      {/* Calidad por batch */}
      <Card>
        <SectionHeader
          title="Control de Calidad por Batch"
          subtitle="Distribucion de causas de rechazo (unidades)"
        />
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={calidadBatch} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="batch" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            <Bar dataKey="ok"      name="Aprobado" stackId="a" fill="#2D6A4F" radius={[0, 0, 0, 0]} />
            <Bar dataKey="acidez"  name="Acidez"   stackId="a" fill="#D97706" />
            <Bar dataKey="tamano"  name="Tamano"   stackId="a" fill="#F59E0B" />
            <Bar dataKey="larva"   name="Larva"    stackId="a" fill="#DC2626" />
            <Bar dataKey="rasgado" name="Rasgado"  stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Cadena fria */}
      <Card>
        <SectionHeader
          title="Temperatura — Cadena de Frio"
          subtitle="Monitoreo continuo | Meta: 0 °C"
        />
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={cadenaFrio} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="coldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#0284C7" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0284C7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="hora" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={[-1, 1]} unit="°C" />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#0284C7" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: 'Meta 0°C', fill: '#0284C7', fontSize: 10, position: 'insideTopRight' }} />
            <Line type="monotone" dataKey="temp" name="Temperatura" stroke="#0284C7" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>

    {/* Lotes Table */}
    <Card>
      <SectionHeader title="Historial de Lotes" subtitle="Ultimos 5 lotes empacados" />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['ID Lote', 'Fecha', 'Clamshell', 'Kilos', 'Cajas', 'Temp. Actual', 'Rechazo', 'Estado'].map(h => (
                <th key={h} style={{
                  padding: '10px 12px',
                  textAlign: 'left',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#6B7280',
                  borderBottom: '1px solid #E5E7EB',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lotes.map((lote, i) => (
              <tr key={lote.id} style={{ backgroundColor: i % 2 === 0 ? '#FAFAFA' : '#FFFFFF' }}>
                <td style={{ padding: '11px 12px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{lote.id}</td>
                <td style={{ padding: '11px 12px', fontSize: 13, color: '#374151' }}>{lote.fecha}</td>
                <td style={{ padding: '11px 12px', fontSize: 13, color: '#374151' }}>{lote.clamshell}</td>
                <td style={{ padding: '11px 12px', fontSize: 13, color: '#374151' }}>{lote.kilos} kg</td>
                <td style={{ padding: '11px 12px', fontSize: 13, color: '#374151' }}>{lote.cajas}</td>
                <td style={{ padding: '11px 12px', fontSize: 13, color: '#0284C7', fontWeight: 600 }}>{lote.temperaturaActual} °C</td>
                <td style={{ padding: '11px 12px', fontSize: 13, color: lote.tasaRechazo > 3 ? '#DC2626' : '#374151' }}>{lote.tasaRechazo}%</td>
                <td style={{ padding: '11px 12px' }}>
                  <Badge variant={estadoBadge[lote.estado]}>{lote.estado}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);
