import React from 'react';
import { brandingConfig } from '../../../config/branding';

export const WelcomeHeader: React.FC = () => {
  const { ia, colores } = brandingConfig;

  return (
    <div style={{ marginBottom: 28 }}>
      <h1 style={{ fontSize: 32, fontWeight: 300, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}>
        Asistente <span style={{ fontWeight: 700, color: colores.primario }}>{ia.nombre}</span>
      </h1>
      <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0', fontWeight: 400 }}>
        Consulta cualquier dato del campo con lenguaje natural
      </p>
    </div>
  );
};