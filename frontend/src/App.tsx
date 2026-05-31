import { useMemo, useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/Header';
import { Placeholder } from './components/ui/Placeholder';
import { NAV_ITEMS_BY_ID, NAV_ITEMS_FLAT } from './config/navigation';

// Features reales (las únicas que se conservan del set original)
import { Packing } from './features/packing/Packing';
import { AnalisisVisual } from './features/analisisVisual/AnalisisVisual';

// Features nuevas
import { PanelPrincipal } from './features/panelPrincipal/PanelPrincipal';
import { ReglasOperativas } from './features/reglasOperativas/ReglasOperativas';
import { Inventario } from './features/inventario/Inventario';
import { AnaliticaReportes } from './features/analiticaReportes/AnaliticaReportes';
import { PanelLaboratorio } from './features/panelLaboratorio/PanelLaboratorio';
import { AnalisisAlimentos } from './features/analisisAlimentos/AnalisisAlimentos';
import { RegistroEntradaTurno } from './features/registroEntradaTurno/RegistroEntradaTurno';
import { PanelMeteorologico } from './features/panelMeteorologico/PanelMeteorologico';
import { TermometroBarometro } from './features/termometroBarometro/TermometroBarometro';
import { HistorialClimatico } from './features/historialClimatico/HistorialClimatico';
import { CalendarioSiembra } from './features/calendarioSiembra/CalendarioSiembra';
import { MotorProbabilidad } from './features/motorProbabilidad/MotorProbabilidad';
import { PlanificacionIntegral } from './features/planificacionIntegral/PlanificacionIntegral';
import { SoilBioVision } from './features/soilBioVision/SoilBioVision';
import { MedicionAgua } from './features/medicionAgua/MedicionAgua';
import { InstrumentosAmbientales } from './features/instrumentosAmbientales/InstrumentosAmbientales';
import { BioAcousticSentinel } from './features/bioAcousticSentinel/BioAcousticSentinel';

/**
 * Mapa de overrides: id → componente real.
 * Lo NO listado aquí cae al Placeholder con la metadata del NavItem.
 *
 * Conforme se vayan implementando las features CONFIRMADAS / INFERIDAS,
 * se agrega su entrada aquí.
 */
const PAGE_OVERRIDES: Record<string, React.ReactNode> = {
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
};

const DEFAULT_SECTION = 'panel-principal';

function App() {
  const [activeSection, setActiveSection] = useState<string>(DEFAULT_SECTION);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeItem = NAV_ITEMS_BY_ID[activeSection] ?? NAV_ITEMS_FLAT[0];

  const page = useMemo(() => {
    const override = PAGE_OVERRIDES[activeSection];
    if (override) return override;
    return <Placeholder title={activeItem.label} description={activeItem.description} />;
  }, [activeSection, activeItem]);

  const handleSectionChange = (s: string) => {
    setActiveSection(s);
    setSidebarOpen(false);
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#F7F9F8' }}>
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        isOpen={sidebarOpen}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header title={activeItem.label} onMenuToggle={() => setSidebarOpen(o => !o)} />

        <main className="main-content" style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          {page}
        </main>
      </div>
    </div>
  );
}

export default App;
