import type { PatronAcustico } from '../../../types/agro.types';

export const patronesAcusticos: PatronAcustico[] = [
  { id: 'BA-001', patron: 'Rasping',                   freqMinHz:  200, freqMaxHz:  480, indicador: 'Trips / Ácaros',     accion: 'Inspección visual al haz foliar · trampas adhesivas' },
  { id: 'BA-002', patron: 'Pulsos regulares',          freqMinHz:  800, freqMaxHz: 1200, indicador: 'Chicharritas',       accion: 'Trampas amarillas · aplicación de neem' },
  { id: 'BA-003', patron: 'Ruido continuo',            freqMinHz: 1500, freqMaxHz: 3000, indicador: 'Chapulín / Grillo',  accion: 'Barreras físicas · Beauveria bassiana' },
  { id: 'BA-004', patron: 'Impactos intermitentes',    freqMinHz:  100, freqMaxHz:  300, indicador: 'Gusano cogollero',   accion: 'Revisión nocturna · Bt Kurstaki' },
  { id: 'BA-005', patron: 'Señal débil uniforme',      freqMinHz:   50, freqMaxHz:  150, indicador: 'Condición normal',   accion: 'Sin acción · cultivo sano' },
];

export interface DeteccionAcustica {
  id: string;
  timestamp: string;
  patronId: string;
  patron: string;
  freqHz: number;
  intensidad: number;        // 0–100
}

export const logDetecciones: DeteccionAcustica[] = [
  { id: 'D-1', timestamp: '06:01:24', patronId: 'BA-005', patron: 'Señal débil uniforme',   freqHz:   88, intensidad: 18 },
  { id: 'D-2', timestamp: '06:01:35', patronId: 'BA-005', patron: 'Señal débil uniforme',   freqHz:  102, intensidad: 22 },
  { id: 'D-3', timestamp: '06:01:46', patronId: 'BA-001', patron: 'Rasping',                freqHz:  340, intensidad: 62 },
  { id: 'D-4', timestamp: '06:01:58', patronId: 'BA-002', patron: 'Pulsos regulares',       freqHz: 1024, intensidad: 71 },
  { id: 'D-5', timestamp: '06:02:09', patronId: 'BA-005', patron: 'Señal débil uniforme',   freqHz:   95, intensidad: 20 },
  { id: 'D-6', timestamp: '06:02:20', patronId: 'BA-005', patron: 'Señal débil uniforme',   freqHz:   78, intensidad: 16 },
];
