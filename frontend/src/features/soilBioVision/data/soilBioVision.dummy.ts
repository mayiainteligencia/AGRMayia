export interface TexturaUSDA {
  nombre: string;
  /** Rango aproximado [arenaMin, arenaMax, limoMin, limoMax, arcillaMin, arcillaMax] en %. */
  rango: string;
  diagnostico: string;
}

/** Las 6 clases pedidas por el spec con sus rangos representativos. */
export const TEXTURAS_USDA: TexturaUSDA[] = [
  { nombre: 'Franco',          rango: 'Arena 23–52 % · Limo 28–50 % · Arcilla 7–27 %',  diagnostico: 'Equilibrado. Excelente retención y drenaje.' },
  { nombre: 'Arcilloso',       rango: 'Arcilla ≥ 40 %',                                  diagnostico: 'Alta retención hídrica. Riesgo de encharcamiento.' },
  { nombre: 'Franco-Arenoso',  rango: 'Arena 43–85 % · Arcilla < 20 %',                  diagnostico: 'Drenaje rápido. Bajo en nutrientes; requiere fertirriego frecuente.' },
  { nombre: 'Franco-Limoso',   rango: 'Limo 50–80 % · Arcilla < 12 %',                   diagnostico: 'Buena fertilidad y retención. Manejar compactación.' },
  { nombre: 'Limoso',          rango: 'Limo ≥ 80 %',                                     diagnostico: 'Muy buena retención. Cuidado con la erosión hídrica.' },
  { nombre: 'Franco-Arcilloso', rango: 'Arena 20–45 % · Limo 15–52 % · Arcilla 27–40 %', diagnostico: 'Rico en nutrientes. Manejar aireación y materia orgánica.' },
];

/** Clasificador simplificado a partir de % de arena/limo/arcilla. */
export function clasificarUSDA(arenaPct: number, limoPct: number, arcillaPct: number): TexturaUSDA {
  if (arcillaPct >= 40)                                              return TEXTURAS_USDA[1]; // Arcilloso
  if (limoPct >= 80)                                                  return TEXTURAS_USDA[4]; // Limoso
  if (arenaPct >= 43 && arcillaPct < 20)                              return TEXTURAS_USDA[2]; // Franco-Arenoso
  if (limoPct >= 50 && arcillaPct < 12)                               return TEXTURAS_USDA[3]; // Franco-Limoso
  if (arenaPct >= 20 && arenaPct <= 45 && arcillaPct >= 27)           return TEXTURAS_USDA[5]; // Franco-Arcilloso
  return TEXTURAS_USDA[0]; // Franco
}

export const PRESCRIPCION_BASE: Record<string, string> = {
  'Franco':           'Mantener materia orgánica > 3 %. Rotación con leguminosas.',
  'Arcilloso':        'Mejorar drenaje (camas altas) · cubierta vegetal · evitar laboreo en húmedo.',
  'Franco-Arenoso':   'Aumentar materia orgánica · fertirriego más frecuente y diluido.',
  'Franco-Limoso':    'Cubierta vegetal permanente · evitar tránsito en húmedo.',
  'Limoso':           'Cubierta vegetal · curvas a nivel para evitar erosión.',
  'Franco-Arcilloso': 'Subsoleo periódico · aporte de materia orgánica · evitar encharcamiento.',
};
