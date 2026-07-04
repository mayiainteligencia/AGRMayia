import type { ReactNode } from 'react';

// Features reales (las únicas que se conservan del set original)
import { Packing } from '../features/packing/Packing';
import { AnalisisVisual } from '../features/analisisVisual/AnalisisVisual';

// Features nuevas
import { PanelPrincipal } from '../features/panelPrincipal/PanelPrincipal';
import { ReglasOperativas } from '../features/reglasOperativas/ReglasOperativas';
import { Inventario } from '../features/inventario/Inventario';
import { AnaliticaReportes } from '../features/analiticaReportes/AnaliticaReportes';
import { PanelLaboratorio } from '../features/panelLaboratorio/PanelLaboratorio';
import { AnalisisAlimentos } from '../features/analisisAlimentos/AnalisisAlimentos';
import { RegistroEntradaTurno } from '../features/registroEntradaTurno/RegistroEntradaTurno';
import { PanelMeteorologico } from '../features/panelMeteorologico/PanelMeteorologico';
import { TermometroBarometro } from '../features/termometroBarometro/TermometroBarometro';
import { HistorialClimatico } from '../features/historialClimatico/HistorialClimatico';
import { CalendarioSiembra } from '../features/calendarioSiembra/CalendarioSiembra';
import { MotorProbabilidad } from '../features/motorProbabilidad/MotorProbabilidad';
import { PlanificacionIntegral } from '../features/planificacionIntegral/PlanificacionIntegral';
import { SoilBioVision } from '../features/soilBioVision/SoilBioVision';
import { MedicionAgua } from '../features/medicionAgua/MedicionAgua';
import { InstrumentosAmbientales } from '../features/instrumentosAmbientales/InstrumentosAmbientales';
import { BioAcousticSentinel } from '../features/bioAcousticSentinel/BioAcousticSentinel';

// Centro de comando — secciones nuevas
import { Clientes } from '../features/clientes/Clientes';
import { Cedis } from '../features/cedis/Cedis';
import { AgricultoresMenores } from '../features/agricultoresMenores/AgricultoresMenores';
import { Ciberseguridad } from '../features/ciberseguridad/Ciberseguridad';
import { Noc } from '../features/noc/Noc';
import { MonitoreoAplicacion } from '../features/monitoreoApp/MonitoreoAplicacion';
import { RoboticsIot } from '../features/roboticsIot/RoboticsIot';
import { InteligenciaEtapa2 } from '../features/inteligenciaEtapa2/InteligenciaEtapa2';
import { ControlDecisiones } from '../features/controlDecisiones/ControlDecisiones';
import { ComandoCentral } from '../features/comandoCentral/ComandoCentral';

/**
 * Mapa de overrides: id → componente real.
 * Lo NO listado aquí cae al Placeholder (sección en construcción).
 * Es la única fuente de verdad de "qué secciones tienen contenido".
 */
export const PAGE_OVERRIDES: Record<string, ReactNode> = {
  'panel-principal':    <PanelPrincipal />,
  'cooler-empaque':     <Packing />,
  'analisis-visual':    <AnalisisVisual />,
  'reglas-operativas':  <ReglasOperativas />,
  'inventario':         <Inventario />,
  'analitica-reportes': <AnaliticaReportes />,
  'panel-laboratorio':       <PanelLaboratorio />,
  'analisis-alimentos':      <AnalisisAlimentos />,
  'registro-entrada-turno':  <RegistroEntradaTurno />,
  'panel-meteorologico':     <PanelMeteorologico />,
  'termometro-barometro':    <TermometroBarometro />,
  'historial-climatico':     <HistorialClimatico />,
  'calendario-siembra':      <CalendarioSiembra />,
  'motor-probabilidad':      <MotorProbabilidad />,
  'planificacion-cosecha':   <PlanificacionIntegral />,
  'soil-bio-vision':         <SoilBioVision />,
  'medicion-agua':           <MedicionAgua />,
  'instrumentos-ambientales': <InstrumentosAmbientales />,
  'bio-acoustic-sentinel':   <BioAcousticSentinel />,

  'clientes':               <Clientes />,
  'cedis':                  <Cedis />,
  'agricultores-menores':   <AgricultoresMenores />,
  'ciberseguridad':         <Ciberseguridad />,
  'noc':                    <Noc />,
  'monitoreo-aplicacion':   <MonitoreoAplicacion />,
  'robotics-iot':           <RoboticsIot />,
  'inteligencia-etapa-2':   <InteligenciaEtapa2 />,
  'control-decisiones':     <ControlDecisiones />,
  'comando-central':        <ComandoCentral />,
};

/** Set de ids que sí tienen contenido implementado. */
export const IMPLEMENTED_IDS = new Set(Object.keys(PAGE_OVERRIDES));
