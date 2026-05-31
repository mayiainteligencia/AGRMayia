import type {
  KPI,
  GastoCategoria,
  Certificacion,
  CicloCosecha,
  OrdenCompraInsumo,
  Pedido,
} from '../../../types/agro.types';

export const panelKPIs: KPI[] = [
  { id: 1, label: 'KG Cosechados',     value: '38,500', unit: 'kg',     delta: '+4.2%', trend: 'up',      accentColor: '#2D6A4F' },
  { id: 2, label: 'Inventario',        value: '8',      unit: 'OK',     delta: 'Todos en nivel OK', trend: 'neutral', accentColor: '#52B788' },
  { id: 3, label: 'Personal Activo',   value: '8',      unit: 'colab.', delta: 'Turno matutino',    trend: 'neutral', accentColor: '#5C3D8F' },
  { id: 4, label: 'Envíos en Tránsito', value: '1',     unit: 'envío',  delta: 'A frontera',        trend: 'neutral', accentColor: '#0284C7' },
];

export const gastosPorCategoria: GastoCategoria[] = [
  { categoria: 'Insumos',         montoMxn: 319_000 },
  { categoria: 'Nómina',          montoMxn: 242_000 },
  { categoria: 'Empaque',         montoMxn: 114_000 },
  { categoria: 'Logística',       montoMxn:  68_000 },
  { categoria: 'Certificaciones', montoMxn:  39_000 },
  { categoria: 'Servicios',       montoMxn:  29_000 },
];

export const certificacionesActivas: Certificacion[] = [
  { id: 'PG-001', nombre: 'PRIMUS GFS',     numero: 'PG-2025-1142', estado: 'vigente', emision: '2025-04-10', vencimiento: '2026-04-10' },
  { id: 'PG-002', nombre: 'PRIMUS GFS',     numero: 'PG-2025-1208', estado: 'vigente', emision: '2025-06-22', vencimiento: '2026-06-22' },
  { id: 'SR-001', nombre: 'SRRC — SENASICA', numero: 'SR-15482',    estado: 'vigente', emision: '2025-02-01', vencimiento: '2027-02-01' },
  { id: 'GG-001', nombre: 'GlobalGAP',      numero: 'GG-2025-0344', estado: 'vigente', emision: '2025-08-05', vencimiento: '2026-08-05' },
  { id: 'FD-001', nombre: 'FDA Registrada',  numero: 'FDA-19273245', estado: 'vigente', emision: '2024-11-12', vencimiento: '2026-11-12' },
];

export const ciclosCosechaActivos: CicloCosecha[] = [
  { id: 'CC-001', cultivo: 'Arándano Biloxi', campo: 'Rancho La Joya',      sembrado: '2025-09-15', etapa: 'cuajado',     diasActivo: 257 },
  { id: 'CC-002', cultivo: 'Arándano O\'Neal', campo: 'Invernadero Principal', sembrado: '2025-10-02', etapa: 'floracion',   diasActivo: 240 },
  { id: 'CC-003', cultivo: 'Arándano Biloxi', campo: 'Campeche Norte',      sembrado: '2025-08-20', etapa: 'maduracion',  diasActivo: 283 },
  { id: 'CC-004', cultivo: 'Aguacate Hass',   campo: 'Rancho La Joya',      sembrado: '2024-06-10', etapa: 'cosecha',     diasActivo: 719 },
];

export const ordenesCompraRecientes: OrdenCompraInsumo[] = [
  { id: 'OC-2026-0124', proveedor: 'Compo Expert México',  items: 6, totalMxn: 184_200, estado: 'confirmada', fecha: '2026-05-26' },
  { id: 'OC-2026-0125', proveedor: 'Netafim México',       items: 3, totalMxn:  92_800, estado: 'pendiente',  fecha: '2026-05-27', autoSugerida: true },
  { id: 'OC-2026-0126', proveedor: 'Smurfit Kappa',        items: 2, totalMxn:  48_500, estado: 'recibida',   fecha: '2026-05-22' },
  { id: 'OC-2026-0127', proveedor: 'BASF México',          items: 4, totalMxn: 121_700, estado: 'confirmada', fecha: '2026-05-28' },
  { id: 'OC-2026-0128', proveedor: 'Berry Plastics',       items: 1, totalMxn:  31_400, estado: 'pendiente',  fecha: '2026-05-29', autoSugerida: true },
];

export const pedidosRecientes: Pedido[] = [
  { id: 'PD-2026-0481', cliente: 'Driscoll\'s USA',     kilos: 2_400, precioKg: 7.20, moneda: 'USD', estado: 'enviado',    fecha: '2026-05-26' },
  { id: 'PD-2026-0482', cliente: 'Walmart MX',          kilos:   850, precioKg:  142, moneda: 'MXN', estado: 'en-proceso', fecha: '2026-05-28' },
  { id: 'PD-2026-0483', cliente: 'Costco MX',           kilos: 1_200, precioKg:  138, moneda: 'MXN', estado: 'confirmado', fecha: '2026-05-29' },
  { id: 'PD-2026-0484', cliente: 'Sun Belle Inc.',      kilos: 3_100, precioKg: 6.85, moneda: 'USD', estado: 'pendiente',  fecha: '2026-05-29' },
  { id: 'PD-2026-0485', cliente: 'La Comer / Fresko',   kilos:   600, precioKg:  155, moneda: 'MXN', estado: 'entregado',  fecha: '2026-05-24' },
];
