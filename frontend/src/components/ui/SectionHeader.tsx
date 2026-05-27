import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  style,
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 20,
      ...style,
    }}
  >
    <div>
      <h2
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: '#111827',
          margin: 0,
          letterSpacing: '-0.2px',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 12, color: '#9CA3AF', margin: '3px 0 0 0', fontWeight: 400 }}>
          {subtitle}
        </p>
      )}
    </div>
    {action && <div>{action}</div>}
  </div>
);
