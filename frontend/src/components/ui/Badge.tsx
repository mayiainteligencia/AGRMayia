import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; color: string }> = {
  success: { bg: '#ECFDF5', color: '#065F46' },
  warning: { bg: '#FFFBEB', color: '#92400E' },
  danger:  { bg: '#FEF2F2', color: '#991B1B' },
  info:    { bg: '#EFF6FF', color: '#1E40AF' },
  neutral: { bg: '#F3F4F6', color: '#374151' },
};

export const Badge: React.FC<BadgeProps> = ({ variant, children }) => {
  const { bg, color } = VARIANT_STYLES[variant];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 20,
        fontSize: 10,
        fontWeight: 700,
        backgroundColor: bg,
        color,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  );
};
