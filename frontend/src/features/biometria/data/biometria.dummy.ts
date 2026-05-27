import type { KPI, PuntoMuestreo } from '../../../types/agro.types';

export const biometriaKPIs: KPI[] = [
  { id: 1, label: 'Crecimiento Prom. Tallo', value: '8.3', unit: 'mm/sem', delta: '+0.6 mm', trend: 'up',   accentColor: '#2D6A4F' },
  { id: 2, label: 'Plantas Muestreadas',     value: '72',  unit: '/ 120',  delta: '60%',     trend: 'neutral', accentColor: '#52B788' },
  { id: 3, label: 'Prox. Analisis (foliar/agua/sustrato)', value: '8', unit: 'dias', accentColor: '#D97706' },
];

export const crecimientoTallo = [
  { semana: 'S1',  promedio: 5.2, minimo: 3.8, maximo: 7.1, benchmark: 6.0 },
  { semana: 'S2',  promedio: 6.1, minimo: 4.5, maximo: 8.0, benchmark: 6.5 },
  { semana: 'S3',  promedio: 6.8, minimo: 5.0, maximo: 8.9, benchmark: 7.0 },
  { semana: 'S4',  promedio: 7.4, minimo: 5.8, maximo: 9.2, benchmark: 7.5 },
  { semana: 'S5',  promedio: 7.9, minimo: 6.1, maximo: 9.8, benchmark: 7.8 },
  { semana: 'S6',  promedio: 7.5, minimo: 5.6, maximo: 9.1, benchmark: 7.8 },
  { semana: 'S7',  promedio: 8.0, minimo: 6.2, maximo: 9.9, benchmark: 8.0 },
  { semana: 'S8',  promedio: 8.3, minimo: 6.5, maximo: 10.2, benchmark: 8.2 },
  { semana: 'S9',  promedio: 8.1, minimo: 6.3, maximo: 9.8, benchmark: 8.2 },
  { semana: 'S10', promedio: 8.5, minimo: 6.8, maximo: 10.4, benchmark: 8.5 },
];

export const distribucionMedidas = [
  { rango: '< 5 mm',    plantas: 4,  esperado: 2  },
  { rango: '5–6 mm',    plantas: 9,  esperado: 8  },
  { rango: '6–7 mm',    plantas: 14, esperado: 13 },
  { rango: '7–8 mm',    plantas: 18, esperado: 17 },
  { rango: '8–9 mm',    plantas: 12, esperado: 16 },
  { rango: '9–10 mm',   plantas: 8,  esperado: 10 },
  { rango: '10–11 mm',  plantas: 5,  esperado: 5  },
  { rango: '> 11 mm',   plantas: 2,  esperado: 1  },
];

export const muestreos: PuntoMuestreo[] = [
  { id: 1,  planta: 'P-014', sector: 'A-1', crecimientoSemanal: 8.8,  alturaCm: 94,  estado: 'normal' },
  { id: 2,  planta: 'P-028', sector: 'A-2', crecimientoSemanal: 6.1,  alturaCm: 88,  estado: 'bajo'   },
  { id: 3,  planta: 'P-041', sector: 'A-3', crecimientoSemanal: 9.2,  alturaCm: 102, estado: 'normal' },
  { id: 4,  planta: 'P-055', sector: 'B-1', crecimientoSemanal: 10.5, alturaCm: 107, estado: 'alto'   },
  { id: 5,  planta: 'P-069', sector: 'B-2', crecimientoSemanal: 8.0,  alturaCm: 96,  estado: 'normal' },
  { id: 6,  planta: 'P-082', sector: 'B-3', crecimientoSemanal: 7.4,  alturaCm: 91,  estado: 'normal' },
  { id: 7,  planta: 'P-096', sector: 'C-1', crecimientoSemanal: 5.8,  alturaCm: 85,  estado: 'bajo'   },
  { id: 8,  planta: 'P-110', sector: 'C-2', crecimientoSemanal: 8.6,  alturaCm: 99,  estado: 'normal' },
];
