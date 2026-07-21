import React, { useState } from 'react';
import {
  Sprout, QrCode, Scale, Calendar,
  TrendingUp, MapPin,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════ */

interface HarvestRecord {
  id: string;
  cosechador: string;
  lote: string;
  variedad: string;
  peso: string;
  calidad: string;
  hora: string;
  fecha: string;
}

interface PlantingSchedule {
  lote: string;
  variedad: string;
  fechaSiembra: string;
  etapa: string;
  progreso: number;
  responsable: string;
}

const HARVEST_RECORDS: HarvestRecord[] = [
  { id: 'QR-0847', cosechador: 'Juan Pérez',     lote: 'A-12', variedad: 'Biloxi',   peso: '24.5 kg', calidad: 'A+', hora: '07:42', fecha: '21 Jul 2026' },
  { id: 'QR-0848', cosechador: 'María González', lote: 'A-14', variedad: 'Biloxi',   peso: '18.2 kg', calidad: 'A',  hora: '08:15', fecha: '21 Jul 2026' },
  { id: 'QR-0849', cosechador: 'Carlos Ruiz',    lote: 'B-03', variedad: 'Legacy',   peso: '31.0 kg', calidad: 'A+', hora: '08:38', fecha: '21 Jul 2026' },
  { id: 'QR-0850', cosechador: 'Ana López',      lote: 'B-05', variedad: 'Legacy',   peso: '22.8 kg', calidad: 'B',  hora: '09:10', fecha: '21 Jul 2026' },
  { id: 'QR-0851', cosechador: 'Pedro Martínez', lote: 'C-01', variedad: 'Driscoll', peso: '15.6 kg', calidad: 'A',  hora: '09:25', fecha: '21 Jul 2026' },
  { id: 'QR-0852', cosechador: 'Lucía Hernández',lote: 'A-12', variedad: 'Biloxi',   peso: '28.3 kg', calidad: 'A+', hora: '09:52', fecha: '21 Jul 2026' },
];

const PLANTING: PlantingSchedule[] = [
  { lote: 'A-12', variedad: 'Biloxi',   fechaSiembra: '15 Mar 2026', etapa: 'Producción plena', progreso: 85, responsable: 'Ing. Torres' },
  { lote: 'A-14', variedad: 'Biloxi',   fechaSiembra: '22 Mar 2026', etapa: 'Producción plena', progreso: 78, responsable: 'Ing. Torres' },
  { lote: 'B-03', variedad: 'Legacy',   fechaSiembra: '10 Abr 2026', etapa: 'Floración tardía', progreso: 62, responsable: 'Ing. Ramírez' },
  { lote: 'B-05', variedad: 'Legacy',   fechaSiembra: '10 Abr 2026', etapa: 'Floración tardía', progreso: 58, responsable: 'Ing. Ramírez' },
  { lote: 'C-01', variedad: 'Driscoll', fechaSiembra: '05 May 2026', etapa: 'Cuajado',          progreso: 40, responsable: 'Ing. Silva' },
  { lote: 'D-02', variedad: 'Tupi',     fechaSiembra: '20 May 2026', etapa: 'Vegetativa',       progreso: 25, responsable: 'Ing. Silva' },
];

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */

export const CosechaSiembra: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cosecha' | 'siembra'>('cosecha');

  const totalHoy = HARVEST_RECORDS.reduce((sum, r) => sum + parseFloat(r.peso), 0);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes cs-fadein { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        .cs-tab { padding:10px 20px; border:none; background:transparent; font-size:13px; font-weight:500; color:#6B7280; cursor:pointer; font-family:inherit; border-bottom:2px solid transparent; transition:all .18s; }
        .cs-tab:hover { color:#374151; }
        .cs-tab.active { color:#1A3C2E; font-weight:700; border-bottom-color:#52B788; }
        .cs-table { width:100%; border-collapse:separate; border-spacing:0; }
        .cs-table th { text-align:left; font-size:10.5px; font-weight:700; color:#9CA3AF; letter-spacing:.08em; text-transform:uppercase; padding:10px 14px; border-bottom:1px solid #E5E7EB; background:#FAFBFB; }
        .cs-table td { padding:13px 14px; font-size:13px; color:#374151; border-bottom:1px solid #F3F4F6; }
        .cs-table tbody tr:hover { background:#F9FAFB; }
        @media(max-width:767px){ .cs-kpis{flex-direction:column!important;} }
      `}</style>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #064E3B 0%, #047857 40%, #10B981 100%)',
        borderRadius: 20, padding: '28px 28px', marginBottom: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute',top:-40,right:-20,width:160,height:160,borderRadius:'50%',background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.15)' }}/>
        <div style={{ position:'relative',zIndex:1 }}>
          <div style={{ display:'inline-flex',alignItems:'center',gap:7,background:'rgba(16,185,129,0.2)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:20,padding:'4px 12px',marginBottom:12 }}>
            <Sprout size={12} color="#6EE7B7" />
            <span style={{ fontSize:10.5,fontWeight:700,color:'#6EE7B7',letterSpacing:'0.08em',textTransform:'uppercase' as const }}>Cosecha y Siembra</span>
          </div>
          <h1 style={{ fontSize:28,fontWeight:700,color:'#fff',margin:'0 0 6px',letterSpacing:'-0.4px' }}>Registro de Cosecha y Siembra</h1>
          <p style={{ fontSize:13.5,color:'rgba(255,255,255,0.55)',margin:0,maxWidth:460,lineHeight:1.5 }}>
            Captura QR por cosechador, destajo, peso y calidad. Seguimiento fenológico por lote.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="cs-kpis" style={{ display:'flex',gap:14,marginBottom:24 }}>
        {[
          { label:'Cosecha Hoy',value:`${totalHoy.toFixed(1)} kg`,icon:Scale,color:'#10B981' },
          { label:'Registros QR Hoy',value:String(HARVEST_RECORDS.length),icon:QrCode,color:'#3B82F6' },
          { label:'Lotes Activos',value:String(PLANTING.length),icon:MapPin,color:'#F59E0B' },
          { label:'Rendimiento Prom.',value:'4.2 kg/pl',icon:TrendingUp,color:'#8B5CF6' },
        ].map(k=>{
          const I=k.icon;
          return(
            <div key={k.label} style={{ flex:1,background:'#fff',border:'1px solid #E5E7EB',borderRadius:14,padding:'16px 18px',display:'flex',alignItems:'center',gap:12 }}>
              <div style={{ width:40,height:40,borderRadius:10,background:`${k.color}10`,border:`1px solid ${k.color}20`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <I size={18} color={k.color}/>
              </div>
              <div>
                <div style={{ fontSize:20,fontWeight:700,color:'#111827',lineHeight:1 }}>{k.value}</div>
                <div style={{ fontSize:11,color:'#6B7280',marginTop:2 }}>{k.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ borderBottom:'1px solid #E5E7EB',marginBottom:18,display:'flex' }}>
        <button className={`cs-tab ${activeTab==='cosecha'?'active':''}`} onClick={()=>setActiveTab('cosecha')}>
          <span style={{display:'flex',alignItems:'center',gap:6}}><Scale size={14}/>Registros de Cosecha</span>
        </button>
        <button className={`cs-tab ${activeTab==='siembra'?'active':''}`} onClick={()=>setActiveTab('siembra')}>
          <span style={{display:'flex',alignItems:'center',gap:6}}><Sprout size={14}/>Ciclo de Siembra</span>
        </button>
      </div>

      {/* Cosecha table */}
      {activeTab==='cosecha'&&(
        <div style={{ background:'#fff',border:'1px solid #E5E7EB',borderRadius:16,overflow:'hidden',animation:'cs-fadein .3s ease' }}>
          <div style={{ overflowX:'auto' }}>
            <table className="cs-table">
              <thead><tr><th>QR ID</th><th>Cosechador</th><th>Lote</th><th>Variedad</th><th>Peso</th><th>Calidad</th><th>Hora</th></tr></thead>
              <tbody>
                {HARVEST_RECORDS.map((r,i)=>(
                  <tr key={r.id} style={{animation:`cs-fadein .3s ease ${i*.04}s backwards`}}>
                    <td><span style={{fontWeight:700,color:'#10B981',fontSize:12.5}}>{r.id}</span></td>
                    <td style={{fontWeight:600}}>{r.cosechador}</td>
                    <td>{r.lote}</td>
                    <td>{r.variedad}</td>
                    <td style={{fontWeight:600}}>{r.peso}</td>
                    <td>
                      <span style={{
                        padding:'3px 10px',borderRadius:6,fontSize:11.5,fontWeight:600,
                        background:r.calidad==='A+'?'rgba(16,185,129,0.1)':r.calidad==='A'?'rgba(59,130,246,0.08)':'rgba(245,158,11,0.08)',
                        color:r.calidad==='A+'?'#059669':r.calidad==='A'?'#2563EB':'#D97706',
                      }}>{r.calidad}</span>
                    </td>
                    <td style={{color:'#6B7280',fontSize:12}}>{r.hora}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Siembra cards */}
      {activeTab==='siembra'&&(
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:14,animation:'cs-fadein .3s ease' }}>
          {PLANTING.map((p,i)=>(
            <div key={p.lote} style={{
              background:'#fff',border:'1px solid #E5E7EB',borderRadius:14,padding:'18px 20px',
              animation:`cs-fadein .3s ease ${i*.05}s backwards`,
              transition:'all .2s',
            }}>
              <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12 }}>
                <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                  <div style={{ width:36,height:36,borderRadius:10,background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.2)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                    <MapPin size={16} color="#10B981"/>
                  </div>
                  <div>
                    <div style={{fontSize:15,fontWeight:700,color:'#111827'}}>Lote {p.lote}</div>
                    <div style={{fontSize:11,color:'#6B7280'}}>{p.variedad}</div>
                  </div>
                </div>
                <span style={{ fontSize:11,fontWeight:600,color:'#52B788',padding:'3px 10px',borderRadius:8,background:'rgba(82,183,136,0.08)' }}>
                  {p.etapa}
                </span>
              </div>
              <div style={{ display:'flex',gap:16,marginBottom:12,fontSize:11.5,color:'#6B7280' }}>
                <span style={{display:'flex',alignItems:'center',gap:4}}><Calendar size={12}/>{p.fechaSiembra}</span>
                <span>{p.responsable}</span>
              </div>
              <div>
                <div style={{ display:'flex',justifyContent:'space-between',fontSize:10.5,color:'#9CA3AF',marginBottom:4 }}>
                  <span>Progreso del ciclo</span>
                  <span style={{fontWeight:700,color:'#374151'}}>{p.progreso}%</span>
                </div>
                <div style={{ height:5,borderRadius:3,background:'#F3F4F6',overflow:'hidden' }}>
                  <div style={{ height:'100%',borderRadius:3,background:'linear-gradient(90deg,#10B981,#059669)',width:`${p.progreso}%`,transition:'width .6s' }}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
