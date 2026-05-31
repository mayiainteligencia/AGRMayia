import React from 'react';
import { Construction } from 'lucide-react';
import { Card } from './Card';
import { SectionHeader } from './SectionHeader';
import { brandingConfig } from '../../config/branding';

interface PlaceholderProps {
  title: string;
  description?: string;
}

/**
 * Vista temporal para módulos aún no implementados.
 * Mantiene la navegación funcional mientras se construye cada feature.
 */
export const Placeholder: React.FC<PlaceholderProps> = ({ title, description }) => {
  const { colores } = brandingConfig;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: colores.textoClaro,
            margin: 0,
            letterSpacing: '-0.5px',
          }}
          className="page-title"
        >
          {title}
        </h1>
        {description && (
          <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>
            {description}
          </p>
        )}
      </div>

      <Card>
        <SectionHeader
          title="En construcción"
          subtitle="Este módulo aún no tiene contenido — se implementará con datos mock siguiendo el patrón feature-based."
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '48px 20px',
            textAlign: 'center',
            color: colores.textoOscuro,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: colores.primarioClaro,
              border: `1px solid ${colores.borde}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colores.secundario,
            }}
          >
            <Construction size={26} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 500, color: colores.textoMedio, margin: 0 }}>
            Próximamente: {title}
          </p>
        </div>
      </Card>
    </div>
  );
};
