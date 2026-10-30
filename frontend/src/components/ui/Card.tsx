import React from 'react';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  padding?: number | string;
}

export const Card: React.FC<CardProps> = ({ children, style, padding = 24 }) => (
  <div
    style={{
      backgroundColor: 'var(--surface)',
      borderRadius: 12,
      border: '1px solid var(--border)',
      padding,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      ...style,
    }}
  >
    {children}
  </div>
);
