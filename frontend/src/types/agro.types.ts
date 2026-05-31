export type Prioridad = 'alta' | 'media' | 'baja';
export type EtapaFenologica = 'dormancia' | 'brotacion' | 'floracion' | 'cuajado' | 'maduracion' | 'cosecha';
export type TipoAlerta = 'clima' | 'control-biologico' | 'riego' | 'nutricion' | 'calidad';
export type TendenciaKPI = 'up' | 'down' | 'neutral';

export interface AlertaAgro {
  id: number;
  tipo: TipoAlerta;
  titulo: string;
  mensaje: string;
  timestamp: string;
  prioridad: Prioridad;
  contingencia?: string;
}

export interface KPI {
  id: number;
  label: string;
  value: string;
  unit: string;
  delta?: string;
  trend?: TendenciaKPI;
  accentColor?: string;
}

export interface MedicionVPD {
  hora: string;
  vpd: number;
  temperatura: number;
  humedad: number;
}

export interface MedicionTallo {
  semana: string;
  promedio: number;
  minimo: number;
  maximo: number;
  benchmark: number;
}

export interface LotePacking {
  id: string;
  fecha: string;
  clamshell: '6oz' | '12oz';
  kilos: number;
  cajas: number;
  temperaturaActual: number;
  tasaRechazo: number;
  estado: 'en-proceso' | 'empacado' | 'en-frio' | 'enviado';
}

export interface OrdenCompra {
  id: string;
  comercializador: string;
  fechaOrden: string;
  kgSolicitados: number;
  precioKg: number;
  clamshell: string;
  estado: 'pendiente' | 'confirmada' | 'en-proceso' | 'enviada';
}

export interface PuntoMuestreo {
  id: number;
  planta: string;
  sector: string;
  crecimientoSemanal: number;
  alturaCm: number;
  estado: 'normal' | 'bajo' | 'alto';
}

export interface EtapaFenologicaItem {
  id: EtapaFenologica;
  label: string;
  meses: string;
  activa: boolean;
  completada: boolean;
  color: string;
}

/* ──────────────────────────────────────────────────────────
 * Tipos de dominio para las nuevas secciones del ERP
 * ────────────────────────────────────────────────────────── */

export type EstadoGenerico = 'ok' | 'alerta' | 'critico' | 'pendiente';
export type EstadoConformidad = 'conforme' | 'no-conforme' | 'pendiente';
export type PrioridadNivel = 'alta' | 'media' | 'baja';

/* Reglas operativas (Seguridad y Cumplimiento) */
export interface ReglaOperativa {
  id: string;                // OP-001, OP-002…
  modulo: string;            // 'Campo', 'Empaque', 'Inventario'…
  descripcion: string;
  condicion: string;         // condición disparadora
  accion: string;            // acción automática
  prioridad: PrioridadNivel;
  estado: 'activa' | 'inactiva';
}

/* Laboratorio */
export interface AnalisisLab {
  id: string;
  muestra: string;
  lote?: string;
  tipo: string;              // 'Alimentos', 'Suelo', 'Microbiología'…
  parametros: string;
  resultado: string;
  norma: string;             // 'NOM-251', 'FDA 21 CFR'…
  responsable: string;
  fecha: string;
  estado: EstadoConformidad;
  brain?: 'F' | 'W' | 'E';   // qué BRAIN procesó
}

export interface ParametroMonitoreado {
  parametro: string;         // pH, Brix, etc.
  metodo: string;
  lmp: string;               // límite máximo permisible
  norma: string;
  frecuencia: string;
  ultimoResultado: string;
  estado: EstadoConformidad;
}

/* Inventario y proveedores */
export interface ArticuloInventario {
  id: string;
  nombre: string;
  sku: string;
  cantidad: number;
  unidad: string;            // 'kg', 'L', 'caja'…
  costoUnitario: number;     // MXN
  ubicacion: string;
  minimo: number;            // umbral de reposición
  categoria: string;
  proveedor: string;
  estado: 'ok' | 'alerta';
}

export interface Proveedor {
  id: string;
  nombre: string;
  categoria: string;         // 'Insumos', 'Empaque', 'Logística'…
  contacto: string;
  telefono?: string;
  email?: string;
  condiciones?: string;
}

/* OrdenCompra (insumos a proveedor) — distinta de la OC comercial existente arriba */
export interface OrdenCompraInsumo {
  id: string;                // OC-...
  proveedor: string;
  items: number;
  totalMxn: number;
  estado: 'pendiente' | 'confirmada' | 'recibida' | 'cancelada';
  autoSugerida?: boolean;    // disparada por OP-003
  fecha: string;
}

/* Pedidos de cliente */
export interface Pedido {
  id: string;
  cliente: string;
  kilos: number;
  precioKg?: number;         // MXN o USD según el cliente
  moneda?: 'MXN' | 'USD';
  estado: 'pendiente' | 'confirmado' | 'en-proceso' | 'enviado' | 'entregado';
  fecha: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  pais: string;
  contacto: string;
  telefono?: string;
  email?: string;
  historialKg?: number;
}

/* Recursos humanos */
export interface Colaborador {
  id: string;
  nombre: string;
  puesto: string;
  campo?: string;
  estado: 'activo' | 'baja' | 'vacaciones';
  tarifaKg?: number;         // destajo MXN/kg (cosechadores)
  qrId?: string;             // identificador del QR personal
}

export interface RegistroTurno {
  id: string;
  colaboradorId: string;
  colaborador: string;
  puesto: string;
  campo: string;
  horaEntrada: string;
  verificacionFacial: boolean;
  pinVerificado: boolean;
  turno: 'matutino' | 'vespertino' | 'nocturno';
  estado: 'completado' | 'pendiente' | 'rechazado';
}

/* Meteorología */
export interface LecturaClimatica {
  fecha: string;
  tempProm: number;
  tempMin: number;
  tempMax: number;
  presion: number;           // hPa
  humedad: number;           // %
  viento: number;            // km/h
  vientoDir?: string;        // 'NNO', 'S'…
  lluvia: number;            // mm
  condicion: string;         // 'Despejado', 'Lluvia ligera'…
  riesgo: 'bajo' | 'medio' | 'alto';
}

/* Calendario de siembra y motor de probabilidad */
export type IdoneidadMes = 'optimo' | 'bueno' | 'marginal' | 'no-recomendado';

export interface CultivoCalendario {
  cultivo: string;
  /** 12 entradas, ene → dic */
  meses: IdoneidadMes[];
}

export interface ZonaClimatica {
  id: string;
  nombre: string;            // 'México Sierra (Puebla, Oaxaca…)'
  descripcion?: string;
  cultivos: CultivoCalendario[];
}

export interface ProbabilidadSiembra {
  cultivo: string;
  zonaId: string;
  /** Probabilidad 0–100 por mes (12 valores). */
  probabilidades: number[];
  mejoresMeses: number[];    // índices 0–11
  evitarMeses: number[];     // índices 0–11
}

/* Planificación integral de cosecha */
export interface PlanCosechaItem {
  cultivo: string;
  kgPorHa: number;
  produccionTotal: number;   // kg
  autoconsumo: number;       // kg (60%)
  excedente: number;         // kg (40%)
  valorEstMxn: number;
}

export interface PlanCosecha {
  mesSiembra: number;        // 1–12
  superficieHa: number;
  cultivos: string[];
  items: PlanCosechaItem[];
  /** Por cultivo: meses (0-11) de crecimiento y cosecha. */
  gantt: { cultivo: string; crecimiento: number[]; cosecha: number[] }[];
}

/* Agronomía avanzada */
export interface ResultadoJarTest {
  arenaMm: number;
  limoMm: number;
  arcillaMm: number;
  materiaOrganicaMm: number;
  clasificacion: string;     // 'Franco', 'Arcilloso'…
  diagnostico: string;
  prescripcion: string;
}

export interface CalculoAgua {
  metodo: 'aforo' | 'lluvia' | 'eto-hargreaves';
  inputs: Record<string, number>;
  resultados: Record<string, number>;
  unidades: Record<string, string>;
}

/* Sensores de campo */
export interface PatronAcustico {
  id: string;
  patron: string;            // 'Rasping', 'Pulsos regulares'…
  freqMinHz: number;
  freqMaxHz: number;
  indicador: string;         // posible plaga
  accion: string;            // acción recomendada
}

/* Certificaciones y producción */
export interface Certificacion {
  id: string;
  nombre: string;            // 'PRIMUS GFS', 'GlobalGAP'…
  numero?: string;
  estado: 'vigente' | 'por-vencer' | 'vencida';
  emision: string;
  vencimiento: string;
}

export interface CicloCosecha {
  id: string;
  cultivo: string;
  campo: string;
  sembrado: string;
  etapa: EtapaFenologica;
  diasActivo: number;
}

/* Finanzas */
export interface GastoCategoria {
  categoria: string;         // 'Insumos', 'Nómina'…
  montoMxn: number;
}
