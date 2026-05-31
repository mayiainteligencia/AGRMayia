export interface EficienciaRiego {
  metodo: string;
  eficienciaPct: number;
  recomendacion: string;
}

export const eficienciasRiego: EficienciaRiego[] = [
  { metodo: 'Goteo',      eficienciaPct: 92, recomendacion: 'Preferido para arándano · alto control de fertirriego' },
  { metodo: 'Aspersión',  eficienciaPct: 75, recomendacion: 'Útil para germinación · cuidar evaporación' },
  { metodo: 'Surcos',     eficienciaPct: 55, recomendacion: 'Solo en cultivos extensivos · alto consumo' },
  { metodo: 'Inundación', eficienciaPct: 40, recomendacion: 'Evitar en cultivos delicados · pérdidas por percolación' },
];
