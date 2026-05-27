import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/Header';
import { Resumen } from './features/resumen/Resumen';
import { Packing } from './features/packing/Packing';
import { Proyeccion } from './features/proyeccion/Proyeccion';
import { Fenologia } from './features/fenologia/Fenologia';
import { Biometria } from './features/biometria/Biometria';
import { Riego } from './features/riego/Riego';
import { AnalisisVisual } from './features/analisisVisual/AnalisisVisual';

type Section = 'resumen' | 'packing' | 'proyeccion' | 'fenologia' | 'biometria' | 'riego' | 'analisisVisual';

const PAGES: Record<Section, React.ReactNode> = {
  resumen:        <Resumen />,
  fenologia:      <Fenologia />,
  riego:          <Riego />,
  biometria:      <Biometria />,
  packing:        <Packing />,
  proyeccion:     <Proyeccion />,
  analisisVisual: <AnalisisVisual />,
};

function App() {
  const [activeSection, setActiveSection] = useState<Section>('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSectionChange = (s: string) => {
    setActiveSection(s as Section);
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
        <Header title={activeSection} onMenuToggle={() => setSidebarOpen(o => !o)} />

        <main className="main-content" style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          {PAGES[activeSection]}
        </main>
      </div>
    </div>
  );
}

export default App;
