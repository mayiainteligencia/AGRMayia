import type { KPI, AnalisisLab } from '../../../types/agro.types';

export interface PersonalLab {
  id: string;
  nombre: string;
  especialidad: string;
  analisisActivos: number;
  estado: 'disponible' | 'ocupado' | 'capacitacion';
}

export const labKPIs: KPI[] = [
  { id: 1, label: 'Pendientes',    value: '1',  unit: 'análisis', delta: 'Sin retrasos',   trend: 'neutral', accentColor: '#D97706' },
  { id: 2, label: 'Completados',   value: '10', unit: 'análisis', delta: '+3 vs semana',   trend: 'up',      accentColor: '#059669' },
  { id: 3, label: 'No Conformes',  value: '1',  unit: 'análisis', delta: 'OP-004 disparada', trend: 'down',  accentColor: '#DC2626' },
  { id: 4, label: 'Informes',      value: '4',  unit: 'emitidos', delta: 'Semana actual',  trend: 'neutral', accentColor: '#5C3D8F' },
];

export const personalLab: PersonalLab[] = [
  { id: 'PL-1', nombre: 'Susana Vargas',  especialidad: 'Inocuidad (Alimentos)',  analisisActivos: 3, estado: 'ocupado' },
  { id: 'PL-2', nombre: 'Pablo Ibarra',   especialidad: 'Ingeniería (Riego)',     analisisActivos: 1, estado: 'disponible' },
  { id: 'PL-3', nombre: 'Evelyn Cruz',    especialidad: 'Microbiología',          analisisActivos: 2, estado: 'ocupado' },
  { id: 'PL-4', nombre: 'Sergio M.',      especialidad: 'Suelo y Agua',           analisisActivos: 0, estado: 'capacitacion' },
];

export const analisisRecientes: AnalisisLab[] = [
  { id: 'LB-2026-0042', muestra: 'Lote AR-Biloxi-118',   lote: 'AR-118', tipo: 'Alimentos',     parametros: 'pH, Brix, sólidos', resultado: 'pH 3.2 · Brix 12', norma: 'NOM-251',   responsable: 'Susana Vargas',  fecha: '2026-05-28', estado: 'conforme',    brain: 'F' },
  { id: 'LB-2026-0043', muestra: 'Lote AR-ONeal-204',    lote: 'AR-204', tipo: 'Alimentos',     parametros: 'pH, Brix',          resultado: 'pH 2.7 · Brix 11', norma: 'NOM-251',   responsable: 'Susana Vargas',  fecha: '2026-05-28', estado: 'no-conforme', brain: 'F' },
  { id: 'LB-2026-0044', muestra: 'Suelo Rancho La Joya', tipo: 'Suelo',  parametros: 'N, P, K, MO',         resultado: 'NPK balanceado',    norma: 'NOM-021', responsable: 'Sergio M.',      fecha: '2026-05-27', estado: 'conforme' },
  { id: 'LB-2026-0045', muestra: 'Diseño riego Campeche', tipo: 'Ingeniería', parametros: 'Caudal · presión', resultado: '4.2 bar · 2.1 L/h', norma: 'GP-Drip', responsable: 'Pablo Ibarra',  fecha: '2026-05-26', estado: 'conforme',    brain: 'E' },
  { id: 'LB-2026-0046', muestra: 'Hisopo línea empaque', tipo: 'Microbiología', parametros: 'Listeria · E. coli', resultado: 'Negativo',     norma: 'FDA 21 CFR', responsable: 'Evelyn Cruz', fecha: '2026-05-25', estado: 'conforme',    brain: 'F' },
  { id: 'LB-2026-0047', muestra: 'Agua reservorio R1',   tipo: 'Suelo',  parametros: 'CE · pH · sales',     resultado: 'CE 0.8 mS · pH 6.8', norma: 'NOM-127', responsable: 'Sergio M.',      fecha: '2026-05-24', estado: 'pendiente' },
];
