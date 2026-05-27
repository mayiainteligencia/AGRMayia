import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { KPI } from '../../types/agro.types';

interface StatCardProps extends KPI {
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  delta,
  trend = 'neutral',
  accentColor = '#2D6A4F',
  icon,
}) => {
  const trendColor =
    trend === 'up' ? '#059669' : trend === 'down' ? '#DC2626' : '#6B7280';
  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        borderTop: `3px solid ${accentColor}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span
          style={{
            fontSize: 11,
            color: '#6B7280',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
        {icon && <div style={{ color: accentColor, opacity: 0.7 }}>{icon}</div>}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: '#111827',
            letterSpacing: '-0.5px',
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 400 }}>{unit}</span>
      </div>

      {delta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <TrendIcon size={12} color={trendColor} />
          <span style={{ fontSize: 11, color: trendColor, fontWeight: 500 }}>
            {delta} vs semana anterior
          </span>
        </div>
      )}
    </div>
  );
};
