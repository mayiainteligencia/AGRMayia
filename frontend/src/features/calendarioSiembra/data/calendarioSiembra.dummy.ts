import type { ZonaClimatica } from '../../../types/agro.types';

export const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export const CULTIVOS_BASE = [
  'Maíz', 'Frijol', 'Papa', 'Trigo', 'Haba', 'Chícharo', 'Avena', 'Calabaza', 'Cebolla', 'Chile',
];

/* Cada celda 0–100 = % de idoneidad mensual. */
const MX_SIERRA: number[][] = [
  /* Maíz   */ [10, 15, 30, 65, 90, 95, 80, 60, 40, 25, 15, 10],
  /* Frijol */ [10, 15, 35, 70, 85, 90, 80, 55, 35, 20, 15, 10],
  /* Papa   */ [60, 70, 80, 85, 70, 50, 35, 30, 35, 60, 75, 70],
  /* Trigo  */ [70, 80, 85, 70, 45, 25, 15, 15, 30, 60, 80, 80],
  /* Haba   */ [55, 70, 80, 75, 55, 30, 20, 20, 35, 65, 80, 70],
  /* Chícharo */ [60, 75, 85, 70, 45, 25, 15, 20, 40, 70, 80, 75],
  /* Avena  */ [75, 80, 70, 50, 35, 20, 15, 20, 40, 70, 85, 85],
  /* Calabaza */ [15, 20, 45, 75, 90, 85, 70, 55, 40, 25, 15, 10],
  /* Cebolla */ [55, 65, 80, 85, 70, 45, 30, 30, 40, 60, 75, 65],
  /* Chile  */ [15, 25, 50, 75, 85, 80, 65, 50, 35, 25, 15, 10],
];

const MX_GOLFO: number[][] = [
  /* Maíz   */ [40, 50, 70, 85, 90, 85, 70, 60, 50, 45, 40, 35],
  /* Frijol */ [45, 55, 70, 80, 85, 75, 60, 55, 50, 45, 45, 40],
  /* Papa   */ [30, 25, 25, 20, 15, 10, 10, 15, 25, 40, 50, 45],
  /* Trigo  */ [25, 20, 15, 15, 10, 10, 10, 10, 15, 25, 35, 35],
  /* Haba   */ [25, 30, 25, 20, 15, 10, 10, 10, 15, 25, 35, 30],
  /* Chícharo */ [25, 25, 20, 15, 10, 10, 10, 10, 15, 25, 35, 30],
  /* Avena  */ [35, 35, 30, 20, 15, 10, 10, 10, 15, 25, 40, 40],
  /* Calabaza */ [45, 55, 75, 85, 90, 85, 70, 60, 50, 45, 40, 40],
  /* Cebolla */ [40, 45, 60, 70, 65, 50, 40, 40, 50, 60, 55, 45],
  /* Chile  */ [45, 55, 70, 85, 90, 80, 65, 55, 50, 50, 50, 45],
];

export const zonasClimaticas: ZonaClimatica[] = [
  {
    id: 'mx-sierra',
    nombre: 'México Sierra (Puebla, Oaxaca, Michoacán)',
    descripcion: 'Altitud 1,800–2,500 m · clima templado subhúmedo',
    cultivos: CULTIVOS_BASE.map((c, i) => ({ cultivo: c, meses: MX_SIERRA[i].map(v => v as never) })),
  },
  {
    id: 'mx-golfo',
    nombre: 'México Golfo (Veracruz, Tabasco)',
    descripcion: 'Costa baja · clima cálido húmedo',
    cultivos: CULTIVOS_BASE.map((c, i) => ({ cultivo: c, meses: MX_GOLFO[i].map(v => v as never) })),
  },
];

/** Matriz cruda (cultivos × meses) por id de zona — útil para HeatmapTable. */
export const zonasMatriz: Record<string, number[][]> = {
  'mx-sierra': MX_SIERRA,
  'mx-golfo':  MX_GOLFO,
};
