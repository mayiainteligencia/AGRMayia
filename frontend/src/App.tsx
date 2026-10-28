import { useMemo, useState } from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/Header';
import { Placeholder } from './components/ui/Placeholder';
import { NAV_ITEMS_BY_ID, NAV_ITEMS_FLAT } from './config/navigation';
import { PAGE_OVERRIDES } from './config/pages';
import { LiveToasts } from './components/command/LiveToasts';
import { NavContext } from './config/navContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BrandProvider } from './context/BrandContext';
import { LoginPage } from './features/auth/LoginPage';

const DEFAULT_SECTION = 'comando-central';

function DashboardApp() {
  const [activeSection, setActiveSection] = useState<string>(DEFAULT_SECTION);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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

  const toggleCollapsed = () => setCollapsed(c => !c);

  return (
    <NavContext.Provider value={handleSectionChange}>
      <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#F7F9F8' }}>
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        <div className={`sb-wrap${collapsed ? ' is-collapsed' : ''}`}>
          <Sidebar
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            isOpen={sidebarOpen}
            onCollapse={() => setCollapsed(true)}
          />
        </div>

        <button
          className={`sb-toggle${collapsed ? ' is-collapsed' : ''}`}
          onClick={toggleCollapsed}
          title={collapsed ? 'Expandir menú lateral' : 'Colapsar menú a la izquierda'}
          aria-label={collapsed ? 'Expandir menú lateral' : 'Colapsar menú a la izquierda'}
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <Header
            title={activeItem.label}
            onMenuToggle={() => setSidebarOpen(o => !o)}
            isSidebarCollapsed={collapsed}
            onToggleCollapse={toggleCollapsed}
          />

          <main className="main-content" style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
            {page}
          </main>
        </div>

        <LiveToasts onNavigate={handleSectionChange} />
      </div>
    </NavContext.Provider>
  );
}

function MainRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100vw', height: '100vh', backgroundColor: '#F8F9F5',
      }}>
        <div style={{
          width: 38, height: 38, border: '3px solid rgba(45,106,79,0.2)',
          borderTopColor: '#2D6A4F', borderRadius: '50%',
          animation: 'sb-spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  // Protección de acceso: si no está logeado, no se puede entrar y se muestra LoginPage
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <DashboardApp />;
}

export function App() {
  return (
    <AuthProvider>
      <BrandProvider>
        <MainRouter />
      </BrandProvider>
    </AuthProvider>
  );
}

export default App;
