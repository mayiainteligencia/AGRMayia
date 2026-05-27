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
