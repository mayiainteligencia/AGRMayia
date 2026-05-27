import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { DollarSign, BarChart2, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { CustomTooltip } from '../../components/charts/CustomTooltip';
import { proyeccionKPIs, curvaFenologica, kgPorMes, ordenesProyeccion } from './data/proyeccion.dummy';
import type { OrdenCompra } from '../../types/agro.types';

const ICONS = [<DollarSign size={18} />, <BarChart2 size={18} />, <Calendar size={18} />];

const ordenEstado: Record<OrdenCompra['estado'], 'warning' | 'success' | 'info' | 'neutral'> = {
  pendiente:   'warning',
  confirmada:  'success',
  'en-proceso': 'info',
  enviada:     'neutral',
};

export const Proyeccion: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>
        Proyeccion
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0 0' }}>
        Comercializacion, curva fenologica y estimacion de ingreso
      </p>
    </div>

    {/* KPI Row */}
    <div className="rg-3">
      {proyeccionKPIs.map((kpi, i) => (
        <StatCard key={kpi.id} {...kpi} icon={ICONS[i]} />
      ))}
    </div>

    {/* Curva fenologica vs Gauss - full width */}
    <Card>
      <SectionHeader
        title="Curva Fenologica vs Campana de Gauss"
        subtitle="Produccion mensual real (kg/planta) vs curva de referencia esperada"
      />
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={curvaFenologica} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gaussGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#B7E4C7" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#B7E4C7" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="realGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#2D6A4F" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} unit=" kg" domain={[0, 5]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
          <Area type="monotone" dataKey="gauss" name="Gauss (referencia)" stroke="#52B788" strokeWidth={2} fill="url(#gaussGrad)" strokeDasharray="5 3" dot={false} />
          <Area type="monotone" dataKey="real"  name="Real 2026"          stroke="#2D6A4F" strokeWidth={2.5} fill="url(#realGrad)" dot={false} activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>

    {/* kg por mes + ordenes */}
    <div className="rg-2">
      <Card>
        <SectionHeader
          title="Produccion Proyectada por Mes"
          subtitle="kg totales | Proyectado vs real acumulado"
        />
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={kgPorMes} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} unit=" kg" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            <Bar dataKey="proyectado" name="Proyectado" fill="#B7E4C7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="real"       name="Real"       fill="#2D6A4F" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionHeader title="Ordenes de Compra" subtitle="Proximas y confirmadas" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ordenesProyeccion.map(oc => (
            <div key={oc.id} style={{
              padding: '12px 14px',
              border: '1px solid #E5E7EB',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{oc.id}</span>
                <Badge variant={ordenEstado[oc.estado]}>{oc.estado}</Badge>
              </div>
              <span style={{ fontSize: 12, color: '#374151' }}>{oc.comercializador}</span>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ fontSize: 12, color: '#6B7280' }}>{oc.kgSolicitados.toLocaleString()} kg</span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>${oc.precioKg}/kg</span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>{oc.clamshell}</span>
              </div>
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>Fecha: {oc.fechaOrden}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </div>
);
