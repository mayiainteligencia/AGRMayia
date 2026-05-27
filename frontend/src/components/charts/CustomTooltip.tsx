import React from 'react';

interface TooltipPayload {
  name: string;
  value: number | string;
  color: string;
  unit?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        padding: '10px 14px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        fontSize: 12,
        minWidth: 130,
      }}
    >
      {label && (
        <p
          style={{
            color: '#374151',
            fontWeight: 600,
            margin: '0 0 8px 0',
            paddingBottom: 6,
            borderBottom: '1px solid #F3F4F6',
            fontSize: 12,
          }}
        >
          {label}
        </p>
      )}
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: i > 0 ? 4 : 0,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: p.color,
              flexShrink: 0,
            }}
          />
          <span style={{ color: '#6B7280' }}>{p.name}:</span>
          <strong style={{ color: '#111827' }}>
            {p.value}
            {p.unit || ''}
          </strong>
        </div>
      ))}
    </div>
  );
};
