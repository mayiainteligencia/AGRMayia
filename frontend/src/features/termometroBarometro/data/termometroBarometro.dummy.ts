export interface CalibracionSensor {
  id: string;
  sensor: string;
  modelo: string;
  ultimaCalibracion: string;
  proximaCalibracion: string;
  precision: string;
  estado: 'ok' | 'por-vencer' | 'fuera-de-rango';
  bateriaPct: number;
}

export const calibracionSensores: CalibracionSensor[] = [
  { id: 'S-T01', sensor: 'Termómetro estación',  modelo: 'Davis Vantage Pro2',    ultimaCalibracion: '2026-03-12', proximaCalibracion: '2026-09-12', precision: '±0.1 °C',  estado: 'ok',          bateriaPct: 84 },
  { id: 'S-B01', sensor: 'Barómetro',            modelo: 'Davis Vantage Pro2',    ultimaCalibracion: '2026-03-12', proximaCalibracion: '2026-09-12', precision: '±0.5 hPa', estado: 'ok',          bateriaPct: 84 },
  { id: 'S-A01', sensor: 'Altímetro',            modelo: 'BME280 Multi-sitio',    ultimaCalibracion: '2026-01-04', proximaCalibracion: '2026-07-04', precision: '±1 m',     estado: 'por-vencer',  bateriaPct: 36 },
  { id: 'S-W01', sensor: 'Anemómetro',           modelo: 'Davis Cup Anemometer',  ultimaCalibracion: '2025-12-18', proximaCalibracion: '2026-06-18', precision: '±2 km/h',  estado: 'por-vencer',  bateriaPct: 52 },
  { id: 'S-T02', sensor: 'Termómetro suelo 10cm', modelo: 'Sonda PT-1000',         ultimaCalibracion: '2026-02-22', proximaCalibracion: '2026-08-22', precision: '±0.2 °C', estado: 'ok',          bateriaPct: 71 },
  { id: 'S-T03', sensor: 'Punto de rocío',       modelo: 'Calculado en software', ultimaCalibracion: '—',           proximaCalibracion: '—',          precision: '±0.3 °C',  estado: 'ok',          bateriaPct: 100 },
];
