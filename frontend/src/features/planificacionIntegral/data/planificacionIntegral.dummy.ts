import type { GanttCellState } from '../../../components/ui/GanttChart';

export interface CultivoPlan {
  cultivo: string;
  kgPorHa: number;
  precioMxnKg: number;
  /** Meses (0-based) en crecimiento. */
  crecimiento: number[];
  /** Meses (0-based) de cosecha. */
  cosecha: number[];
}

export const CULTIVOS_PLAN: CultivoPlan[] = [
  { cultivo: 'Arándano',  kgPorHa: 12_000, precioMxnKg: 145, crecimiento: [2, 3, 4, 5, 6],         cosecha: [7, 8, 9] },
  { cultivo: 'Maíz',      kgPorHa:  6_500, precioMxnKg:   7, crecimiento: [3, 4, 5, 6, 7],         cosecha: [8, 9] },
  { cultivo: 'Frijol',    kgPorHa:  1_800, precioMxnKg:  38, crecimiento: [4, 5, 6, 7],            cosecha: [8] },
  { cultivo: 'Papa',      kgPorHa: 22_000, precioMxnKg:  16, crecimiento: [0, 1, 2, 3, 11],        cosecha: [4, 5] },
  { cultivo: 'Trigo',     kgPorHa:  3_400, precioMxnKg:  10, crecimiento: [10, 11, 0, 1, 2, 3],    cosecha: [4, 5] },
  { cultivo: 'Calabaza',  kgPorHa:  9_500, precioMxnKg:  12, crecimiento: [3, 4, 5, 6],            cosecha: [7, 8] },
  { cultivo: 'Cebolla',   kgPorHa: 18_000, precioMxnKg:  14, crecimiento: [0, 1, 2, 3],            cosecha: [4, 5] },
  { cultivo: 'Chile',     kgPorHa: 11_000, precioMxnKg:  32, crecimiento: [3, 4, 5, 6],            cosecha: [7, 8, 9] },
];

export const construirGantt = (cultivos: string[]): { label: string; cells: GanttCellState[] }[] =>
  cultivos.map(name => {
    const cfg = CULTIVOS_PLAN.find(c => c.cultivo === name);
    const cells: GanttCellState[] = Array(12).fill(null);
    if (cfg) {
      cfg.crecimiento.forEach(m => { cells[m] = 'crecimiento'; });
      cfg.cosecha.forEach(m => { cells[m] = 'cosecha'; });
    }
    return { label: name, cells };
  });
