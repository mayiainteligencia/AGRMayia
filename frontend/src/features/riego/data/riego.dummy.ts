import type { KPI } from '../../../types/agro.types';

export const riegoKPIs: KPI[] = [
  { id: 1, label: 'EC Riego (entrada)',  value: '1.8', unit: 'mS/cm', delta: '~1150 PPM',     trend: 'neutral', accentColor: '#0284C7' },
  { id: 2, label: 'pH Agua de Riego',    value: '5.8', unit: '',      delta: 'Rango 5.5–6.0', trend: 'neutral', accentColor: '#2D6A4F' },
  { id: 3, label: 'pH Sustrato',         value: '5.4', unit: '',      delta: 'Rango 4.5–5.5', trend: 'down',    accentColor: '#52B788' },
  { id: 4, label: 'pH Drenaje',          value: '6.1', unit: '',      delta: 'Vigilar',       trend: 'up',      accentColor: '#D97706' },
];

// Curva de pH a lo largo del riego (entrada vs sustrato vs drenaje)
export const phHistorico = [
  { dia: '01/05', riego: 5.8, sustrato: 5.3, drenaje: 6.0 },
  { dia: '05/05', riego: 5.9, sustrato: 5.4, drenaje: 6.0 },
  { dia: '09/05', riego: 5.8, sustrato: 5.5, drenaje: 6.1 },
  { dia: '13/05', riego: 5.7, sustrato: 5.4, drenaje: 6.2 },
  { dia: '17/05', riego: 5.8, sustrato: 5.5, drenaje: 6.1 },
  { dia: '21/05', riego: 5.8, sustrato: 5.4, drenaje: 6.1 },
];

export const ecHistorico = [
  { dia: '01/05', entrada: 1.7, drenaje: 2.0 },
  { dia: '05/05', entrada: 1.8, drenaje: 2.1 },
  { dia: '09/05', entrada: 1.8, drenaje: 2.0 },
  { dia: '13/05', entrada: 1.9, drenaje: 2.2 },
  { dia: '17/05', entrada: 1.8, drenaje: 2.1 },
  { dia: '21/05', entrada: 1.8, drenaje: 2.0 },
];

// Valores ideales por etapa fenologica
export const valoresPorEtapa = [
  { etapa: 'Dormancia',  ecMin: 0.8, ecMax: 1.2, phRiego: '5.8–6.2', notas: 'Bajo aporte. Foco: reservas.' },
  { etapa: 'Brotacion',  ecMin: 1.2, ecMax: 1.6, phRiego: '5.5–6.0', notas: 'N amoniacal dominante.' },
  { etapa: 'Floracion',  ecMin: 1.4, ecMax: 1.8, phRiego: '5.5–5.8', notas: 'B y Ca clave para cuajado.' },
  { etapa: 'Cuajado',    ecMin: 1.6, ecMax: 2.0, phRiego: '5.5–5.8', notas: 'K y Ca; vigilar antagonismos.' },
  { etapa: 'Maduracion', ecMin: 1.8, ecMax: 2.2, phRiego: '5.5–5.8', notas: 'K alto para brix; bajar N.' },
  { etapa: 'Cosecha',    ecMin: 1.4, ecMax: 1.8, phRiego: '5.5–6.0', notas: 'Mantener brix y calibre.' },
];

// Sinergias / antagonismos por elemento
export const interaccionesNutrientes = [
  { elemento: 'Nitrogeno (N)',  sinergia: 'Mg, Mo',   antagonismo: 'K, Ca',     ventanaPh: '5.5–6.5', nota: 'En blueberry preferir forma amoniacal (NH4+).' },
  { elemento: 'Fosforo (P)',    sinergia: 'Mg, N',    antagonismo: 'Zn, Fe, Cu', ventanaPh: '5.5–6.5', nota: 'Bloqueo a pH alto.' },
  { elemento: 'Potasio (K)',    sinergia: 'Fe, Mn',   antagonismo: 'Ca, Mg, N', ventanaPh: '5.5–6.0', nota: 'Sube en maduracion para brix.' },
  { elemento: 'Calcio (Ca)',    sinergia: 'B',        antagonismo: 'K, Mg, NH4', ventanaPh: '6.0–6.5', nota: 'Critico en cuajado; firmeza del fruto.' },
  { elemento: 'Magnesio (Mg)',  sinergia: 'N, P',     antagonismo: 'K, Ca',     ventanaPh: '6.0–6.5', nota: 'Clorofila.' },
  { elemento: 'Hierro (Fe)',    sinergia: 'K',        antagonismo: 'P, Cu, Mn', ventanaPh: '5.0–6.0', nota: 'Se inmoviliza con pH alto.' },
  { elemento: 'Boro (B)',       sinergia: 'Ca',       antagonismo: '—',         ventanaPh: '5.0–7.0', nota: 'Floracion y cuajado.' },
];

// LMR de exportacion (valores ilustrativos)
export const lmrExportacion = [
  { mercado: 'EE. UU.', residuo: 'Bifentrin',    lmr: '0.50 mg/kg', estado: 'OK',  ultimoLote: 'B-04' },
  { mercado: 'EE. UU.', residuo: 'Azoxistrobin', lmr: '2.00 mg/kg', estado: 'OK',  ultimoLote: 'B-03' },
  { mercado: 'UE',      residuo: 'Bifentrin',    lmr: '0.30 mg/kg', estado: 'Vigilar', ultimoLote: 'B-04' },
  { mercado: 'UE',      residuo: 'Imidacloprid', lmr: '0.05 mg/kg', estado: 'OK',  ultimoLote: 'B-02' },
  { mercado: 'Canada',  residuo: 'Boscalid',     lmr: '5.00 mg/kg', estado: 'OK',  ultimoLote: 'B-03' },
];
