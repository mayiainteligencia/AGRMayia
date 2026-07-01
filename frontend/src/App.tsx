import { useMemo, useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/Header';
import { Placeholder } from './components/ui/Placeholder';
import { NAV_ITEMS_BY_ID, NAV_ITEMS_FLAT } from './config/navigation';
import { PAGE_OVERRIDES } from './config/pages';

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
