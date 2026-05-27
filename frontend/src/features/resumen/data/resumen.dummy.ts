import type { AlertaAgro, KPI } from '../../../types/agro.types';

export const resumenKPIs: KPI[] = [
  { id: 1, label: 'Plantas Activas',      value: '9,090', unit: 'plantas/ha', accentColor: '#2D6A4F' },
  { id: 2, label: 'Produccion Estimada',  value: '4.2',   unit: 'kg/planta', delta: '+8%',   trend: 'up',      accentColor: '#52B788' },
  { id: 3, label: 'Alertas Activas',      value: '3',     unit: 'pendientes', delta: '-2',    trend: 'down',    accentColor: '#DC2626' },
  { id: 4, label: 'DLI Promedio Hoy',     value: '22.4',  unit: 'mol/m²/d', delta: '-1.2', trend: 'down', accentColor: '#D97706' },
];

export const vpd24h = [
  { hora: '00:00', vpd: 0.6, temperatura: 14, humedad: 82 },
  { hora: '02:00', vpd: 0.5, temperatura: 13, humedad: 85 },
  { hora: '04:00', vpd: 0.5, temperatura: 12, humedad: 87 },
  { hora: '06:00', vpd: 0.7, temperatura: 14, humedad: 80 },
  { hora: '08:00', vpd: 1.0, temperatura: 18, humedad: 72 },
  { hora: '10:00', vpd: 1.4, temperatura: 23, humedad: 65 },
  { hora: '12:00', vpd: 1.8, temperatura: 27, humedad: 58 },
  { hora: '14:00', vpd: 2.1, temperatura: 29, humedad: 54 },
  { hora: '16:00', vpd: 1.9, temperatura: 28, humedad: 56 },
  { hora: '18:00', vpd: 1.3, temperatura: 24, humedad: 64 },
  { hora: '20:00', vpd: 0.9, temperatura: 20, humedad: 73 },
  { hora: '22:00', vpd: 0.7, temperatura: 17, humedad: 78 },
];

export const produccionSemanal = [
  { semana: 'S1', real: 0.8,  benchmark: 1.0 },
  { semana: 'S2', real: 1.1,  benchmark: 1.0 },
  { semana: 'S3', real: 1.4,  benchmark: 1.2 },
  { semana: 'S4', real: 1.2,  benchmark: 1.2 },
  { semana: 'S5', real: 1.6,  benchmark: 1.5 },
  { semana: 'S6', real: 1.9,  benchmark: 1.8 },
  { semana: 'S7', real: 2.3,  benchmark: 2.0 },
  { semana: 'S8', real: 2.1,  benchmark: 2.2 },
];

export const alertasActivas: AlertaAgro[] = [
  {
    id: 1,
    tipo: 'clima',
    titulo: 'VPD Alto — Estres Hidrico',
    mensaje: 'VPD supero 2.0 kPa a las 14:00 h. Riesgo de deshidratacion foliar.',
    timestamp: 'Hace 1 h',
    prioridad: 'alta',
    contingencia: 'Activar nebulizacion o incrementar frecuencia de riego',
  },
  {
    id: 2,
    tipo: 'control-biologico',
    titulo: 'Mosca Blanca — Sector B-4 (insecto)',
    mensaje: 'Densidad media detectada en recorrido. Requiere seguimiento.',
    timestamp: 'Hace 3 h',
    prioridad: 'media',
    contingencia: 'Activar protocolo preventivo con Julieta; si supera umbral, protocolo correctivo.',
  },
  {
    id: 3,
    tipo: 'riego',
    titulo: 'Humedad Sustrato Baja',
    mensaje: 'Sustrato de coco en A-2 por debajo del umbral optimo (60 %).',
    timestamp: 'Hace 5 h',
    prioridad: 'media',
    contingencia: 'Ajustar plan de riego en proxima junta con agronomo',
  },
];
