import type { KPI, GastoCategoria } from '../../../types/agro.types';

export const analiticaKPIs: KPI[] = [
  { id: 1, label: 'KG Totales',         value: '38,500',  unit: 'kg',      delta: '+4.2%', trend: 'up',      accentColor: '#2D6A4F' },
  { id: 2, label: 'Días Prom Cosecha',  value: '292',     unit: 'días',    delta: '-3 d',  trend: 'down',    accentColor: '#52B788' },
  { id: 3, label: 'Gasto Total MXN',    value: '$809,750', unit: '',       delta: '+1.8%', trend: 'up',      accentColor: '#5C3D8F' },
  { id: 4, label: 'Personal Activo',    value: '8',       unit: 'colab.', delta: 'Estable', trend: 'neutral', accentColor: '#0284C7' },
];

export const tendenciaGastosMensual: { mes: string; mxn: number }[] = [
  { mes: 'Dic', mxn: 118_400 },
  { mes: 'Ene', mxn: 132_900 },
  { mes: 'Feb', mxn: 124_600 },
  { mes: 'Mar', mxn: 141_200 },
  { mes: 'Abr', mxn: 138_750 },
  { mes: 'May', mxn: 153_900 },
];

export const gastosCategoriaDona: GastoCategoria[] = [
  { categoria: 'Insumos',         montoMxn: 319_000 },
  { categoria: 'Nómina',          montoMxn: 242_000 },
  { categoria: 'Empaque',         montoMxn: 114_000 },
  { categoria: 'Logística',       montoMxn:  68_000 },
  { categoria: 'Certificaciones', montoMxn:  39_000 },
  { categoria: 'Servicios',       montoMxn:  29_000 },
];

export const kgPorCampo: { campo: string; kg: number }[] = [
  { campo: 'Rancho La Joya',       kg: 18_200 },
  { campo: 'Invernadero Principal', kg: 11_900 },
  { campo: 'Campeche Norte',       kg:  8_400 },
];

export const estadoEnviosDona: { estado: string; cantidad: number }[] = [
  { estado: 'Entregado',   cantidad: 14 },
  { estado: 'En tránsito', cantidad:  3 },
  { estado: 'Pendiente',   cantidad:  2 },
  { estado: 'Cancelado',   cantidad:  1 },
];
