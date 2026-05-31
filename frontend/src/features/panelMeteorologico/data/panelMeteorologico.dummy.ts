import type { KPI, AlertaAgro } from '../../../types/agro.types';

export const meteoKPIs: KPI[] = [
  { id: 1, label: 'Temperatura',  value: '12.2',  unit: '°C',     accentColor: '#0284C7' },
  { id: 2, label: 'Presión',      value: '1017.6', unit: 'hPa',   accentColor: '#5C3D8F' },
  { id: 3, label: 'Viento',       value: '52',    unit: 'km/h NNO', accentColor: '#D97706' },
  { id: 4, label: 'Humedad',      value: '60',    unit: '%',      accentColor: '#52B788' },
  { id: 5, label: 'Precipitación', value: '2.4',  unit: 'mm',     accentColor: '#0284C7' },
  { id: 6, label: 'Altitud',      value: '2148',  unit: 'm',      accentColor: '#2D6A4F' },
];

export interface DiaPronostico {
  dia: string;
  fecha: string;
  condicion: 'soleado' | 'parcial' | 'nublado' | 'lluvia' | 'tormenta';
  tempMin: number;
  tempMax: number;
  lluviaPct: number;
}

export const pronostico7d: DiaPronostico[] = [
  { dia: 'Hoy',  fecha: '30 may', condicion: 'parcial',   tempMin:  9, tempMax: 16, lluviaPct: 30 },
  { dia: 'Vie',  fecha: '31 may', condicion: 'lluvia',    tempMin:  8, tempMax: 14, lluviaPct: 70 },
  { dia: 'Sáb',  fecha: '01 jun', condicion: 'tormenta',  tempMin:  7, tempMax: 13, lluviaPct: 85 },
  { dia: 'Dom',  fecha: '02 jun', condicion: 'nublado',   tempMin:  9, tempMax: 15, lluviaPct: 40 },
  { dia: 'Lun',  fecha: '03 jun', condicion: 'parcial',   tempMin: 10, tempMax: 18, lluviaPct: 20 },
  { dia: 'Mar',  fecha: '04 jun', condicion: 'soleado',   tempMin: 11, tempMax: 21, lluviaPct: 10 },
  { dia: 'Mié',  fecha: '05 jun', condicion: 'soleado',   tempMin: 12, tempMax: 22, lluviaPct:  5 },
];

export const alertasAgronomicas: AlertaAgro[] = [
  { id: 1, tipo: 'clima', titulo: 'Riesgo de helada nocturna',  mensaje: 'Pronóstico mínimo 7°C el sábado. Mantener cobertura de tela térmica.', timestamp: 'hace 18 min', prioridad: 'alta',  contingencia: 'Activar protocolo antihelada · OP-001' },
  { id: 2, tipo: 'clima', titulo: 'Viento fuerte NNO',          mensaje: 'Ráfagas previstas hasta 65 km/h hoy 18:00. Riesgo de daño mecánico en racimos.', timestamp: 'hace 42 min', prioridad: 'media', contingencia: 'Asegurar mallas y postes' },
  { id: 3, tipo: 'clima', titulo: 'Lluvia acumulada >20 mm',    mensaje: 'Pronóstico 25 mm sáb–dom. Riesgo de saturación de sustrato y Botrytis.', timestamp: 'hace 1 h', prioridad: 'alta',  contingencia: 'Inspección post-lluvia · ventilar invernadero · OP-006' },
];
