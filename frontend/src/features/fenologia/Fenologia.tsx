import React from 'react';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Leaf, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { CustomTooltip } from '../../components/charts/CustomTooltip';
import { etapasFenologicas, climaHistorico, alertasFenologia } from './data/fenologia.dummy';
import type { AlertaAgro, EtapaFenologicaItem } from '../../types/agro.types';

const EtapaCard: React.FC<{ etapa: EtapaFenologicaItem }> = ({ etapa }) => (
  <div
    style={{
      padding: '14px 16px',
      borderRadius: 10,
      border: etapa.activa
        ? `2px solid ${etapa.color}`
        : '1px solid #E5E7EB',
      backgroundColor: etapa.activa ? `${etapa.color}10` : etapa.completada ? '#F9FAFB' : '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      minWidth: 0,
      position: 'relative',
    }}
  >
    {etapa.activa && (
      <div style={{
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: etapa.color,
        boxShadow: `0 0 6px ${etapa.color}80`,
      }} />
    )}
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {etapa.completada ? (
        <CheckCircle size={13} color={etapa.color} />
      ) : etapa.activa ? (
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: etapa.color, marginRight: 2 }} />
      ) : (
        <Clock size={13} color="#9CA3AF" />
      )}
      <span style={{
        fontSize: 12,
        fontWeight: etapa.activa ? 700 : 500,
        color: etapa.activa ? etapa.color : etapa.completada ? '#374151' : '#9CA3AF',
      }}>
        {etapa.label}
      </span>
    </div>
    <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 400 }}>{etapa.meses}</span>
    {etapa.activa && (
      <span style={{ fontSize: 10, fontWeight: 600, color: etapa.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        En curso
      </span>
    )}
  </div>
);

const prioridadBadge: Record<string, 'danger' | 'warning' | 'neutral'> = {
  alta: 'danger', media: 'warning', baja: 'neutral',
};

const AlertaItem: React.FC<{ alerta: AlertaAgro }> = ({ alerta }) => (
  <div style={{
    padding: '12px 14px',
    border: '1px solid #F3F4F6',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{alerta.titulo}</span>
      <Badge variant={prioridadBadge[alerta.prioridad]}>{alerta.prioridad}</Badge>
    </div>
    <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{alerta.mensaje}</p>
    {alerta.contingencia && (
      <p style={{ fontSize: 11, color: '#2D6A4F', margin: 0, fontWeight: 500 }}>Plan: {alerta.contingencia}</p>
    )}
    <span style={{ fontSize: 10, color: '#9CA3AF' }}>{alerta.timestamp}</span>
  </div>
);

export const Fenologia: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>
        Fenologia
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0 0' }}>
        Desarrollo de la planta: etapa actual y crecimiento por día/semana. El manejo de insectos, virus y hongos vive en Control Biológico. — Referente: Julieta
      </p>
    </div>

    {/* Etapas Timeline */}
    <Card>
      <SectionHeader
        title="Etapas Fenologicas — Temporada 2026"
        subtitle="Arándanos variedad Biloxi | Ciclo anual · Etapas de desarrollo y crecimiento diario/semanal"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Leaf size={14} color="#2D6A4F" />
            <span style={{ fontSize: 12, color: '#2D6A4F', fontWeight: 500 }}>Cuajado en curso</span>
          </div>
        }
      />
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))' }}>
        {etapasFenologicas.map(e => <EtapaCard key={e.id} etapa={e} />)}
      </div>
    </Card>

    {/* Clima + VPD | Alertas */}
    <div className="rg-2-1">
      <Card>
        <SectionHeader
          title="Temperatura, Humedad y VPD — Historico"
          subtitle="Ultimos 11 registros de campo | Mayo 2026"
        />
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={climaHistorico} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="dia" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="temp" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} domain={[0, 40]} unit="°C" />
            <YAxis yAxisId="hum"  orientation="right" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} unit="%" domain={[40, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            <Line yAxisId="temp" type="monotone" dataKey="tempMax"  name="Temp Max"  stroke="#DC2626" strokeWidth={2} dot={false} />
            <Line yAxisId="temp" type="monotone" dataKey="tempMin"  name="Temp Min"  stroke="#0284C7" strokeWidth={2} dot={false} strokeDasharray="4 2" />
            <Line yAxisId="hum"  type="monotone" dataKey="humedad"  name="Humedad %"  stroke="#52B788" strokeWidth={2} dot={false} />
            <Line yAxisId="temp" type="monotone" dataKey="vpd"      name="VPD (kPa)" stroke="#5C3D8F" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionHeader title="Alertas — Fenologia y Control Biologico" subtitle={`${alertasFenologia.length} registradas en mayo · Protocolos preventivos/correctivos`} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {alertasFenologia.map(a => <AlertaItem key={a.id} alerta={a} />)}
        </div>
      </Card>
    </div>
  </div>
);
