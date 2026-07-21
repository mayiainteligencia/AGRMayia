import React, { useState } from 'react';
import {
  Globe, Package, TrendingUp, FileText, Shield,
  Search, Filter, Download,
  Check, Clock, ArrowUpRight,
  Truck, Star,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */

type OrderStatus = 'confirmed' | 'in-transit' | 'pending' | 'delivered';

interface HarvestAvailability {
  variety: string;
  available: string;
  quality: string;
  price: string;
  trend: 'up' | 'down' | 'stable';
  origin: string;
  certifications: string[];
}

interface PurchaseOrder {
  id: string;
  client: string;
  product: string;
  volume: string;
  status: OrderStatus;
  date: string;
  deliveryDate: string;
  total: string;
}

interface ClientInfo {
  name: string;
  country: string;
  flag: string;
  status: 'active' | 'prospect';
  lastOrder: string;
  totalOrders: number;
  volume: string;
}

/* ═══════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════ */

const HARVEST_DATA: HarvestAvailability[] = [
  { variety: 'Blueberry Biloxi',    available: '12,500 kg', quality: 'Grado A+', price: '$8.50/kg', trend: 'up',     origin: 'Jalisco, MX',   certifications: ['PRIMUS GFS', 'GlobalGAP'] },
  { variety: 'Blueberry Legacy',    available: '8,200 kg',  quality: 'Grado A',  price: '$7.80/kg', trend: 'stable', origin: 'Jalisco, MX',   certifications: ['PRIMUS GFS'] },
  { variety: 'Raspberry Driscoll',  available: '5,400 kg',  quality: 'Grado A+', price: '$12.20/kg',trend: 'up',     origin: 'Michoacán, MX', certifications: ['GlobalGAP', 'FDA'] },
  { variety: 'Blackberry Tupi',     available: '3,100 kg',  quality: 'Grado B',  price: '$6.40/kg', trend: 'down',   origin: 'Jalisco, MX',   certifications: ['SENASICA'] },
  { variety: 'Strawberry Monterey', available: '9,800 kg',  quality: 'Grado A',  price: '$5.90/kg', trend: 'stable', origin: 'Guanajuato, MX',certifications: ['PRIMUS GFS', 'FDA'] },
];

const ORDERS: PurchaseOrder[] = [
  { id: 'PO-2026-0847', client: "Driscoll's Inc.",        product: 'Blueberry Biloxi',   volume: '4,200 kg', status: 'in-transit', date: '18 Jul 2026', deliveryDate: '22 Jul 2026', total: '$35,700' },
  { id: 'PO-2026-0843', client: 'Naturipe Farms',         product: 'Raspberry Driscoll', volume: '2,800 kg', status: 'confirmed',  date: '17 Jul 2026', deliveryDate: '24 Jul 2026', total: '$34,160' },
  { id: 'PO-2026-0839', client: 'Walmart USA',            product: 'Blueberry Legacy',   volume: '8,000 kg', status: 'pending',    date: '16 Jul 2026', deliveryDate: '28 Jul 2026', total: '$62,400' },
  { id: 'PO-2026-0835', client: 'Costco Canada',          product: 'Strawberry Monterey',volume: '5,500 kg', status: 'delivered',  date: '12 Jul 2026', deliveryDate: '16 Jul 2026', total: '$32,450' },
  { id: 'PO-2026-0831', client: 'Whole Foods Market',     product: 'Blueberry Biloxi',   volume: '1,800 kg', status: 'delivered',  date: '10 Jul 2026', deliveryDate: '14 Jul 2026', total: '$15,300' },
];

const CLIENTS: ClientInfo[] = [
  { name: "Driscoll's Inc.",    country: 'USA', flag: '🇺🇸', status: 'active',   lastOrder: '18 Jul', totalOrders: 47, volume: '142,000 kg' },
  { name: 'Naturipe Farms',     country: 'USA', flag: '🇺🇸', status: 'active',   lastOrder: '17 Jul', totalOrders: 23, volume: '68,500 kg' },
  { name: 'Walmart USA',        country: 'USA', flag: '🇺🇸', status: 'active',   lastOrder: '16 Jul', totalOrders: 35, volume: '198,000 kg' },
  { name: 'Costco Canada',      country: 'CAN', flag: '🇨🇦', status: 'active',   lastOrder: '12 Jul', totalOrders: 18, volume: '87,200 kg' },
  { name: 'Whole Foods Market', country: 'USA', flag: '🇺🇸', status: 'active',   lastOrder: '10 Jul', totalOrders: 12, volume: '34,600 kg' },
  { name: 'Kroger Co.',         country: 'USA', flag: '🇺🇸', status: 'prospect', lastOrder: '—',      totalOrders: 0,  volume: '—' },
  { name: 'Loblaw Companies',   country: 'CAN', flag: '🇨🇦', status: 'prospect', lastOrder: '—',      totalOrders: 0,  volume: '—' },
];

/* ═══════════════════════════════════════════════════
   STATUS HELPERS
   ═══════════════════════════════════════════════════ */

const ORDER_STATUS: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  confirmed:  { label: 'Confirmado',  color: '#3B82F6', bg: 'rgba(59,130,246,0.10)',  icon: Check },
  'in-transit': { label: 'En tránsito', color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', icon: Truck },
  pending:    { label: 'Pendiente',   color: '#9CA3AF', bg: 'rgba(156,163,175,0.10)', icon: Clock },
  delivered:  { label: 'Entregado',   color: '#10B981', bg: 'rgba(16,185,129,0.10)',  icon: Check },
};

const TREND_ICON: Record<string, { symbol: string; color: string }> = {
  up:     { symbol: '↑', color: '#10B981' },
  down:   { symbol: '↓', color: '#EF4444' },
  stable: { symbol: '→', color: '#6B7280' },
};

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */

export const PortalClientesB2B: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'availability' | 'orders' | 'clients'>('availability');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes pcb-fadein { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }

        .pcb-tab {
          padding: 10px 20px;
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 500;
          color: #6B7280;
          cursor: pointer;
          font-family: inherit;
          border-bottom: 2px solid transparent;
          transition: all 0.18s;
        }
        .pcb-tab:hover { color: #374151; }
        .pcb-tab.is-active {
          color: #1A3C2E;
          font-weight: 700;
          border-bottom-color: #52B788;
        }

        .pcb-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        .pcb-table th {
          text-align: left;
          font-size: 10.5px;
          font-weight: 700;
          color: #9CA3AF;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 10px 14px;
          border-bottom: 1px solid #E5E7EB;
          background: #FAFBFB;
        }
        .pcb-table td {
          padding: 14px;
          font-size: 13px;
          color: #374151;
          border-bottom: 1px solid #F3F4F6;
          vertical-align: middle;
        }
        .pcb-table tr { transition: background 0.15s; }
        .pcb-table tbody tr:hover { background: #F9FAFB; }

        .pcb-cert-tag {
          display: inline-flex;
          padding: 2px 8px;
          border-radius: 5px;
          font-size: 10px;
          font-weight: 600;
          background: rgba(82,183,136,0.08);
          color: #2D6A4F;
          border: 1px solid rgba(82,183,136,0.15);
          white-space: nowrap;
        }

        .pcb-client-card {
          background: #fff;
          border: 1px solid #E5E7EB;
          border-radius: 14px;
          padding: 20px;
          transition: all 0.2s;
          cursor: pointer;
        }
        .pcb-client-card:hover {
          border-color: rgba(82,183,136,0.35);
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
          transform: translateY(-2px);
        }

        @media (max-width: 767px) {
          .pcb-kpi-row { flex-direction: column !important; }
          .pcb-clients-grid { grid-template-columns: 1fr !important; }
          .pcb-table { font-size: 11px; }
          .pcb-table td, .pcb-table th { padding: 8px 10px; }
        }
        @media (min-width:768px) and (max-width: 1023px) {
          .pcb-clients-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4338CA 100%)',
        borderRadius: 20, padding: '32px 28px',
        marginBottom: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -50, right: -30,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(99,102,241,0.12)',
          border: '1px solid rgba(99,102,241,0.18)',
        }} />
        <div style={{
          position: 'absolute', bottom: -20, left: '40%',
          width: 100, height: 100, borderRadius: '50%',
          background: 'rgba(99,102,241,0.08)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(99,102,241,0.2)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 20, padding: '4px 12px', marginBottom: 12,
          }}>
            <Globe size={12} color="#A5B4FC" />
            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#A5B4FC', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
              Portal B2B · Clientes Internacionales
            </span>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
            International Buyers Portal
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: 0, maxWidth: 480, lineHeight: 1.5 }}>
            Real-time harvest availability, pricing, purchase orders, traceability and certifications for USA & Canada buyers.
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          KPI ROW
      ════════════════════════════════════════════ */}
      <div className="pcb-kpi-row" style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Active Clients', value: '5', icon: Globe, color: '#6366F1' },
          { label: 'Active Orders', value: '3', icon: Package, color: '#F59E0B' },
          { label: 'Revenue YTD', value: '$1.2M', icon: TrendingUp, color: '#10B981' },
          { label: 'Certifications', value: '4', icon: Shield, color: '#3B82F6' },
        ].map(kpi => {
          const KpiIcon = kpi.icon;
          return (
            <div key={kpi.label} style={{
              flex: 1,
              background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14,
              padding: '18px 20px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: `${kpi.color}10`, border: `1px solid ${kpi.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <KpiIcon size={18} color={kpi.color} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#111827', lineHeight: 1 }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: 11.5, color: '#6B7280', marginTop: 2 }}>
                  {kpi.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════
          TABS + SEARCH
      ════════════════════════════════════════════ */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #E5E7EB', marginBottom: 20,
        flexWrap: 'wrap' as const, gap: 10,
      }}>
        <div style={{ display: 'flex' }}>
          {([
            { key: 'availability', label: 'Harvest Availability', icon: Package },
            { key: 'orders', label: 'Purchase Orders', icon: FileText },
            { key: 'clients', label: 'Buyers Directory', icon: Globe },
          ] as const).map(tab => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.key}
                className={`pcb-tab ${activeTab === tab.key ? 'is-active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <TabIcon size={14} />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 10,
          background: '#F9FAFB', border: '1px solid #E5E7EB',
        }}>
          <Search size={14} color="#9CA3AF" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              border: 'none', background: 'transparent', outline: 'none',
              fontSize: 12.5, color: '#374151', fontFamily: 'inherit',
              width: 140,
            }}
          />
        </div>
      </div>

      {/* ════════════════════════════════════════════
          TAB CONTENT
      ════════════════════════════════════════════ */}

      {/* --- Availability --- */}
      {activeTab === 'availability' && (
        <div style={{
          background: '#fff', border: '1px solid #E5E7EB',
          borderRadius: 16, overflow: 'hidden',
          animation: 'pcb-fadein 0.3s ease',
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Package size={16} color="#2D6A4F" />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                Real-Time Harvest Availability
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 8,
                background: '#F3F4F6', border: '1px solid #E5E7EB',
                fontSize: 11.5, color: '#374151', cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <Filter size={12} /> Filter
              </button>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 8,
                background: '#F3F4F6', border: '1px solid #E5E7EB',
                fontSize: 11.5, color: '#374151', cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <Download size={12} /> Export
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="pcb-table">
              <thead>
                <tr>
                  <th>Variety</th>
                  <th>Available</th>
                  <th>Quality</th>
                  <th>Price</th>
                  <th>Trend</th>
                  <th>Origin</th>
                  <th>Certifications</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {HARVEST_DATA.map((h, idx) => {
                  const trend = TREND_ICON[h.trend];
                  return (
                    <tr key={idx} style={{ animation: `pcb-fadein 0.3s ease ${idx * 0.05}s backwards` }}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#111827' }}>{h.variety}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{h.available}</span>
                      </td>
                      <td>
                        <span style={{
                          padding: '3px 10px', borderRadius: 6,
                          background: h.quality.includes('A+') ? 'rgba(16,185,129,0.1)' : h.quality.includes('A') ? 'rgba(59,130,246,0.08)' : 'rgba(245,158,11,0.08)',
                          color: h.quality.includes('A+') ? '#059669' : h.quality.includes('A') ? '#2563EB' : '#D97706',
                          fontSize: 12, fontWeight: 600,
                        }}>
                          {h.quality}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{h.price}</td>
                      <td>
                        <span style={{ color: trend.color, fontWeight: 700, fontSize: 14 }}>
                          {trend.symbol}
                        </span>
                      </td>
                      <td style={{ color: '#6B7280', fontSize: 12 }}>{h.origin}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
                          {h.certifications.map(c => (
                            <span key={c} className="pcb-cert-tag">{c}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <button style={{
                          background: 'linear-gradient(135deg, #1A3C2E, #2D6A4F)',
                          border: 'none', color: '#fff',
                          padding: '6px 14px', borderRadius: 8,
                          fontSize: 11, fontWeight: 600,
                          cursor: 'pointer', fontFamily: 'inherit',
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                          Order <ArrowUpRight size={10} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- Orders --- */}
      {activeTab === 'orders' && (
        <div style={{
          background: '#fff', border: '1px solid #E5E7EB',
          borderRadius: 16, overflow: 'hidden',
          animation: 'pcb-fadein 0.3s ease',
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <FileText size={16} color="#2D6A4F" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
              Purchase Orders
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="pcb-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Client</th>
                  <th>Product</th>
                  <th>Volume</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Delivery</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((o, idx) => {
                  const st = ORDER_STATUS[o.status];
                  const StIcon = st.icon;
                  return (
                    <tr key={o.id} style={{ animation: `pcb-fadein 0.3s ease ${idx * 0.05}s backwards` }}>
                      <td>
                        <span style={{ fontWeight: 700, color: '#6366F1', fontSize: 12.5 }}>{o.id}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{o.client}</td>
                      <td>{o.product}</td>
                      <td style={{ fontWeight: 600 }}>{o.volume}</td>
                      <td>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '3px 10px', borderRadius: 8,
                          background: st.bg, fontSize: 11.5, fontWeight: 600,
                          color: st.color,
                        }}>
                          <StIcon size={11} /> {st.label}
                        </span>
                      </td>
                      <td style={{ color: '#6B7280', fontSize: 12 }}>{o.date}</td>
                      <td style={{ color: '#6B7280', fontSize: 12 }}>{o.deliveryDate}</td>
                      <td style={{ fontWeight: 700, color: '#111827' }}>{o.total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- Clients --- */}
      {activeTab === 'clients' && (
        <div style={{ animation: 'pcb-fadein 0.3s ease' }}>
          <div className="pcb-clients-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 14,
          }}>
            {CLIENTS.map((c, idx) => (
              <div
                key={c.name}
                className="pcb-client-card"
                style={{ animation: `pcb-fadein 0.3s ease ${idx * 0.06}s backwards` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 28 }}>{c.flag}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>{c.country}</div>
                    </div>
                  </div>
                  <span style={{
                    padding: '3px 10px', borderRadius: 20,
                    background: c.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(156,163,175,0.1)',
                    color: c.status === 'active' ? '#059669' : '#9CA3AF',
                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const,
                    letterSpacing: '0.06em',
                  }}>
                    {c.status === 'active' ? 'Active' : 'Prospect'}
                  </span>
                </div>

                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 8, marginBottom: 12,
                }}>
                  {[
                    { label: 'Last Order', value: c.lastOrder },
                    { label: 'Total Orders', value: String(c.totalOrders) },
                    { label: 'Volume', value: c.volume },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      background: '#F9FAFB', borderRadius: 8,
                      padding: '8px 10px', textAlign: 'center' as const,
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{stat.value}</div>
                      <div style={{ fontSize: 9.5, color: '#9CA3AF', marginTop: 2 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'flex', gap: 6,
                  paddingTop: 12,
                  borderTop: '1px solid #F3F4F6',
                }}>
                  <button style={{
                    flex: 1, padding: '8px', borderRadius: 8,
                    background: 'linear-gradient(135deg, #1A3C2E, #2D6A4F)',
                    border: 'none', color: '#fff',
                    fontSize: 11.5, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  }}>
                    <FileText size={12} /> View Details
                  </button>
                  <button style={{
                    padding: '8px 12px', borderRadius: 8,
                    background: '#F3F4F6', border: '1px solid #E5E7EB',
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center',
                  }}>
                    <Star size={14} color="#F59E0B" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
