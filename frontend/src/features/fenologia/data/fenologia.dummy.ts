import type { AlertaAgro, EtapaFenologicaItem } from '../../../types/agro.types';

export const etapasFenologicas: EtapaFenologicaItem[] = [
  { id: 'dormancia',  label: 'Dormancia',   meses: 'Dic – Feb', activa: false, completada: true,  color: '#9CA3AF' },
  { id: 'brotacion',  label: 'Brotacion',   meses: 'Mar',        activa: false, completada: true,  color: '#52B788' },
  { id: 'floracion',  label: 'Floracion',   meses: 'Abr',        activa: false, completada: true,  color: '#86EFAC' },
  { id: 'cuajado',    label: 'Cuajado',     meses: 'May',        activa: true,  completada: false, color: '#2D6A4F' },
  { id: 'maduracion', label: 'Maduracion',  meses: 'Jun – Jul',  activa: false, completada: false, color: '#5C3D8F' },
  { id: 'cosecha',    label: 'Cosecha',     meses: 'Ago – Sep',  activa: false, completada: false, color: '#1A3C2E' },
];

export const climaHistorico = [
  { dia: '01/05', tempMax: 26, tempMin: 13, humedad: 72, vpd: 1.2 },
  { dia: '03/05', tempMax: 28, tempMin: 14, humedad: 68, vpd: 1.5 },
  { dia: '05/05', tempMax: 31, tempMin: 15, humedad: 60, vpd: 2.0 },
  { dia: '07/05', tempMax: 27, tempMin: 13, humedad: 74, vpd: 1.1 },
  { dia: '09/05', tempMax: 25, tempMin: 12, humedad: 78, vpd: 0.9 },
  { dia: '11/05', tempMax: 29, tempMin: 14, humedad: 65, vpd: 1.6 },
  { dia: '13/05', tempMax: 32, tempMin: 16, humedad: 57, vpd: 2.2 },
  { dia: '15/05', tempMax: 30, tempMin: 15, humedad: 62, vpd: 1.8 },
  { dia: '17/05', tempMax: 27, tempMin: 13, humedad: 71, vpd: 1.2 },
  { dia: '19/05', tempMax: 26, tempMin: 12, humedad: 75, vpd: 1.0 },
  { dia: '21/05', tempMax: 29, tempMin: 14, humedad: 67, vpd: 1.5 },
];

export const alertasFenologia: AlertaAgro[] = [
  {
    id: 10,
    tipo: 'clima',
    titulo: 'Temperatura Maxima Critica',
    mensaje: 'Se registraron 32°C el 13/05. Posible quemadura de fruto en cuajado temprano.',
    timestamp: '13/05/2026',
    prioridad: 'alta',
    contingencia: 'Aplicar malla sombra o incrementar riego en horas pico',
  },
  {
    id: 11,
    tipo: 'control-biologico',
    titulo: 'Botrytis — Riesgo Medio (hongo)',
    mensaje: 'Humedad alta (>75 %) en los ultimos 3 dias favorece Botrytis cinerea.',
    timestamp: '09/05/2026',
    prioridad: 'media',
    contingencia: 'Protocolo preventivo: ventilacion y revision de hojas. Correctivo con Julieta si avanza.',
  },
  {
    id: 12,
    tipo: 'riego',
    titulo: 'VPD Bajo — Hibernacion',
    mensaje: 'VPD < 0.5 kPa durante la noche del 19/05. Metabolismo vegetal reducido.',
    timestamp: '19/05/2026',
    prioridad: 'baja',
    contingencia: 'Monitorear la apertura estomatica al dia siguiente',
  },
];
