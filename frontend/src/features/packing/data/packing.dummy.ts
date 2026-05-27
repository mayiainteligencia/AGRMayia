import type { LotePacking, OrdenCompra, KPI } from '../../../types/agro.types';

export const packingKPIs: KPI[] = [
  { id: 1, label: 'Brix Promedio',         value: '14.2', unit: '°Bx',     delta: 'Min 12 · Ideal 14+', trend: 'up',      accentColor: '#5C3D8F' },
  { id: 2, label: 'Blush (capa serosa)',   value: '92',   unit: '% bayas', delta: 'OK',                 trend: 'neutral', accentColor: '#52B788' },
  { id: 3, label: 'Temp. Cadena Fria',     value: '-0.2', unit: '°C',      delta: 'OK',                 trend: 'neutral', accentColor: '#0284C7' },
  { id: 4, label: 'Tasa de Rechazo',       value: '2.3',  unit: '%',       delta: '-0.5%',              trend: 'down',    accentColor: '#D97706' },
];

export const calidadBatch = [
  { batch: 'B-01', ok: 210, acidez: 8,  tamano: 5,  larva: 1, rasgado: 3 },
  { batch: 'B-02', ok: 195, acidez: 12, tamano: 8,  larva: 0, rasgado: 5 },
  { batch: 'B-03', ok: 220, acidez: 6,  tamano: 4,  larva: 2, rasgado: 2 },
  { batch: 'B-04', ok: 180, acidez: 15, tamano: 10, larva: 1, rasgado: 7 },
  { batch: 'B-05', ok: 240, acidez: 5,  tamano: 3,  larva: 0, rasgado: 2 },
  { batch: 'B-06', ok: 205, acidez: 9,  tamano: 6,  larva: 1, rasgado: 4 },
];

export const cadenaFrio = [
  { hora: '00:00', temp: 0.1  },
  { hora: '02:00', temp: 0.0  },
  { hora: '04:00', temp: -0.1 },
  { hora: '06:00', temp: -0.2 },
  { hora: '08:00', temp: -0.1 },
  { hora: '10:00', temp: 0.2  },
  { hora: '12:00', temp: 0.4  },
  { hora: '14:00', temp: 0.1  },
  { hora: '16:00', temp: -0.2 },
  { hora: '18:00', temp: -0.3 },
  { hora: '20:00', temp: -0.2 },
  { hora: '22:00', temp: -0.1 },
];

export const lotes: LotePacking[] = [
  { id: 'B-01', fecha: '2026-05-21', clamshell: '12oz', kilos: 284, cajas: 210, temperaturaActual: -0.2, tasaRechazo: 2.1, estado: 'en-frio' },
  { id: 'B-02', fecha: '2026-05-20', clamshell: '6oz',  kilos: 196, cajas: 162, temperaturaActual: -0.1, tasaRechazo: 2.8, estado: 'enviado' },
  { id: 'B-03', fecha: '2026-05-19', clamshell: '12oz', kilos: 312, cajas: 230, temperaturaActual: -0.3, tasaRechazo: 1.7, estado: 'enviado' },
  { id: 'B-04', fecha: '2026-05-18', clamshell: '6oz',  kilos: 168, cajas: 139, temperaturaActual: -0.2, tasaRechazo: 4.1, estado: 'enviado' },
  { id: 'B-05', fecha: '2026-05-22', clamshell: '12oz', kilos: 180, cajas: 145, temperaturaActual: -0.1, tasaRechazo: 1.4, estado: 'en-proceso' },
];

export const ordenesCompra: OrdenCompra[] = [
  { id: 'OC-2026-018', comercializador: 'Fresh Export SA',  fechaOrden: '2026-05-20', kgSolicitados: 1200, precioKg: 7.20, clamshell: '12oz', estado: 'en-proceso' },
  { id: 'OC-2026-017', comercializador: 'Berry World LLC',  fechaOrden: '2026-05-14', kgSolicitados: 900,  precioKg: 7.35, clamshell: '6oz',  estado: 'enviada' },
  { id: 'OC-2026-016', comercializador: 'AgroPrime Export', fechaOrden: '2026-05-07', kgSolicitados: 1500, precioKg: 7.10, clamshell: '12oz', estado: 'enviada' },
];
