import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  ReferenceArea, Legend,
} from 'recharts';
import { AlertTriangle, Droplets, Sun, TrendingUp, Wind } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { CustomTooltip } from '../../components/charts/CustomTooltip';
import { HeroCard } from '../../components/modules/dashboardModules/Herocard';
import { resumenKPIs, vpd24h, produccionSemanal, alertasActivas } from './data/resumen.dummy';
import type { AlertaAgro } from '../../types/agro.types';

const ICONS = [
  <TrendingUp size={18} />,
  <Wind size={18} />,
  <AlertTriangle size={18} />,
  <Sun size={18} />,
];

const prioridadBadge: Record<string, 'danger' | 'warning' | 'neutral'> = {
  alta: 'danger',
  media: 'warning',
  baja: 'neutral',
};

const AlertaItem: React.FC<{ alerta: AlertaAgro }> = ({ alerta }) => (
  <div
    style={{
      padding: '12px 14px',
      borderRadius: 8,
      border: '1px solid #F3F4F6',
      backgroundColor: '#FAFAFA',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{alerta.titulo}</span>
      <Badge variant={prioridadBadge[alerta.prioridad]}>{alerta.prioridad}</Badge>
    </div>
    <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{alerta.mensaje}</p>
    {alerta.contingencia && (
      <p style={{ fontSize: 11, color: '#2D6A4F', margin: 0, fontWeight: 500 }}>
        Plan: {alerta.contingencia}
      </p>
    )}
    <span style={{ fontSize: 10, color: '#9CA3AF' }}>{alerta.timestamp}</span>
  </div>
);

export const Resumen: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    {/* Header */}
    <div className="welcome-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 300, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>
          Buenos dias, <span style={{ fontWeight: 700 }}>Rancho Norte.</span>
        </h1>
        <p style={{ fontSize: 18, color: '#6B7280', margin: '6px 0 0 0', fontWeight: 300 }}>
          Estado del cultivo — Arándanos / Temporada 2026 · Modelo extrapolable a otros cultivos
        </p>
      </div>
      <div className="welcome-logos" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ background: 'rgba(0,0,0,0.45)', borderRadius: 12, padding: '8px 14px' }}>
          <img src="/assets/logosNativos/mayiaLogoBlanco.png" alt="Mayia" style={{ height: 36, objectFit: 'contain', display: 'block' }} />
        </div>
        <div style={{ background: 'rgba(0,0,0,0.45)', borderRadius: 12, padding: '8px 14px' }}>
          <img src="/assets/logosNativos/flai.png" alt="FLAI" style={{ height: 36, objectFit: 'contain', display: 'block' }} />
        </div>
      </div>
    </div>

    {/* KPI Row */}
    <div className="rg-4">
      {resumenKPIs.map((kpi, i) => (
        <StatCard key={kpi.id} {...kpi} icon={ICONS[i]} />
      ))}
    </div>

    {/* VPD + Alertas */}
    <div className="rg-2-1">
      <Card>
        <SectionHeader
          title="VPD — Deficit de Presion de Vapor"
          subtitle="Ultimas 24 h  |  Rango optimo: 0.8 – 1.5 kPa"
          action={
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Droplets size={14} color="#0284C7" />
              <span style={{ fontSize: 12, color: '#0284C7', fontWeight: 500 }}>Tiempo real</span>
            </div>
          }
        />
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={vpd24h} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="vpdGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#2D6A4F" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0} />
              </linearGradient>
            </defs>
            <ReferenceArea y1={0.8} y2={1.5} fill="#52B788" fillOpacity={0.07} label={{ value: 'Rango optimo', fill: '#52B788', fontSize: 10, position: 'insideTopRight' }} />
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="hora" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={[0, 2.5]} unit=" kPa" />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0.8} stroke="#52B788" strokeDasharray="4 4" strokeOpacity={0.5} />
            <ReferenceLine y={1.5} stroke="#D97706" strokeDasharray="4 4" strokeOpacity={0.5} />
            <Area type="monotone" dataKey="vpd" name="VPD" stroke="#2D6A4F" strokeWidth={2.5} fill="url(#vpdGrad)" dot={false} activeDot={{ r: 4, fill: '#2D6A4F' }} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionHeader title="Alertas Activas" subtitle={`${alertasActivas.length} sin resolver`} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {alertasActivas.map(a => <AlertaItem key={a.id} alerta={a} />)}
        </div>
      </Card>
    </div>

    {/* MAYIA + Produccion */}
    <div className="rg-1-2">
      <HeroCard />

      <Card>
        <SectionHeader
          title="Produccion Semanal vs Benchmark"
          subtitle="kg por planta | Ultimas 8 semanas"
        />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={produccionSemanal} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="semana" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} unit=" kg" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Bar dataKey="real"      name="Real"      fill="#2D6A4F" radius={[4, 4, 0, 0]} />
            <Bar dataKey="benchmark" name="Benchmark" fill="#B7E4C7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  </div>
);
