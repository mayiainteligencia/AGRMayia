import type { ArticuloInventario } from '../../../types/agro.types';

const raw: Omit<ArticuloInventario, 'estado'>[] = [
  { id: 'INV-001', nombre: 'Sulfato de potasio',     sku: 'K2SO4-25',  cantidad: 1_200, unidad: 'kg',   costoUnitario:  42,  ubicacion: 'Almacén A',   minimo: 600, categoria: 'Fertilizante',  proveedor: 'Compo Expert México' },
  { id: 'INV-002', nombre: 'Nitrato de calcio',      sku: 'CaNO3-25',  cantidad:   450, unidad: 'kg',   costoUnitario:  38,  ubicacion: 'Almacén A',   minimo: 500, categoria: 'Fertilizante',  proveedor: 'Compo Expert México' },
  { id: 'INV-003', nombre: 'Ácido fosfórico 85%',    sku: 'H3PO4-200', cantidad:    18, unidad: 'L',    costoUnitario: 320,  ubicacion: 'Almacén A',   minimo:  10, categoria: 'Fertilizante',  proveedor: 'BASF México' },
  { id: 'INV-004', nombre: 'Cinta de goteo 16 mm',   sku: 'DRP-16',    cantidad: 4_800, unidad: 'm',    costoUnitario:   6,  ubicacion: 'Bodega Riego', minimo: 2000, categoria: 'Riego',         proveedor: 'Netafim México' },
  { id: 'INV-005', nombre: 'Clamshell 6 oz',         sku: 'CL-6OZ',    cantidad: 25_000, unidad: 'pz',  costoUnitario: 2.4,  ubicacion: 'Empaque',     minimo: 8000, categoria: 'Empaque',       proveedor: 'Berry Plastics' },
  { id: 'INV-006', nombre: 'Caja exportación 4.4 kg', sku: 'BOX-44',   cantidad:   620, unidad: 'pz',   costoUnitario:  18,  ubicacion: 'Empaque',     minimo: 800, categoria: 'Empaque',       proveedor: 'Smurfit Kappa' },
  { id: 'INV-007', nombre: 'Beauveria bassiana',     sku: 'BB-1L',     cantidad:    28, unidad: 'L',    costoUnitario: 480,  ubicacion: 'Bio-control', minimo:  12, categoria: 'Control biológico', proveedor: 'Grupo Rex' },
  { id: 'INV-008', nombre: 'Diésel',                 sku: 'DSL-200',   cantidad:   780, unidad: 'L',    costoUnitario:  24,  ubicacion: 'Combustibles', minimo: 400, categoria: 'Combustible',  proveedor: 'PEMEX' },
];

export const articulos: ArticuloInventario[] = raw.map(a => ({
  ...a,
  estado: a.cantidad <= a.minimo ? 'alerta' : 'ok',
}));

export const valorTotalInventario = articulos.reduce((s, a) => s + a.cantidad * a.costoUnitario, 0);
