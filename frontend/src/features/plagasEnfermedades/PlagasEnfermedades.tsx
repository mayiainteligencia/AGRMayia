import React, { useState } from 'react';
import {
  Bug, Camera, AlertTriangle, Check,
  ChevronRight, MapPin, Calendar,
  Eye,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════ */

type Severity = 'critica' | 'moderada' | 'baja' | 'resuelta';

interface Incidence {
  id: string;
  plaga: string;
  tipo: 'plaga' | 'enfermedad' | 'hongo';
  lote: string;
  severity: Severity;
  detectedDate: string;
  responsable: string;
  protocolo: string;
  descripcion: string;
  evidencia: boolean;
}

const SEVERITY_CFG: Record<Severity, { label: string; color: string; bg: string }> = {
  critica:  { label: 'Crítica',  color: '#EF4444', bg: 'rgba(239,68,68,0.10)' },
  moderada: { label: 'Moderada', color: '#F59E0B', bg: 'rgba(245,158,11,0.10)' },
  baja:     { label: 'Baja',     color: '#3B82F6', bg: 'rgba(59,130,246,0.10)' },
  resuelta: { label: 'Resuelta', color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
};

const INCIDENCES: Incidence[] = [
  { id:'INC-001', plaga:'Botrytis cinerea (Moho gris)',     tipo:'hongo',      lote:'A-12', severity:'critica',  detectedDate:'20 Jul 2026', responsable:'Ing. Torres',  protocolo:'P-BOT-01', descripcion:'Moho gris en racimos maduros, eliminar tejido y aplicar fungicida sistémico.', evidencia:true },
  { id:'INC-002', plaga:'Mosca blanca (Bemisia tabaci)',    tipo:'plaga',      lote:'B-03', severity:'moderada', detectedDate:'19 Jul 2026', responsable:'Ing. Ramírez', protocolo:'P-MOS-02', descripcion:'Población creciente en envés foliar, aplicar bioinsecticida.', evidencia:true },
  { id:'INC-003', plaga:'Phytophthora cinnamomi',           tipo:'hongo',      lote:'C-01', severity:'critica',  detectedDate:'18 Jul 2026', responsable:'Ing. Silva',   protocolo:'P-PHY-01', descripcion:'Oscurecimiento en corona y base de tallo. Reducir riego y revisar drenaje urgente.', evidencia:true },
  { id:'INC-004', plaga:'Erysiphe vaccinii (Oídio)',        tipo:'enfermedad', lote:'A-14', severity:'moderada', detectedDate:'17 Jul 2026', responsable:'Ing. Torres',  protocolo:'P-OID-01', descripcion:'Polvo blanco en nervios de hojas jóvenes. Monitorear cada 48h.', evidencia:false },
  { id:'INC-005', plaga:'Trips (Frankliniella occidentalis)',tipo:'plaga',      lote:'B-05', severity:'baja',     detectedDate:'16 Jul 2026', responsable:'Ing. Ramírez', protocolo:'P-TRI-03', descripcion:'Trampas azules con capturas bajas. Mantener monitoreo.', evidencia:true },
  { id:'INC-006', plaga:'Araña roja (Tetranychus urticae)', tipo:'plaga',      lote:'D-02', severity:'resuelta', detectedDate:'14 Jul 2026', responsable:'Ing. Silva',   protocolo:'P-ARA-01', descripcion:'Controlada con Phytoseiulus persimilis. Monitoreo quincenal.', evidencia:true },
  { id:'INC-007', plaga:'Alternaria spp.',                  tipo:'hongo',      lote:'A-12', severity:'baja',     detectedDate:'13 Jul 2026', responsable:'Ing. Torres',  protocolo:'P-ALT-02', descripcion:'Lesiones necróticas leves en bordes foliares periféricos.', evidencia:false },
];

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */

export const PlagasEnfermedades: React.FC = () => {
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'todas'>('todas');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = filterSeverity === 'todas'
    ? INCIDENCES
    : INCIDENCES.filter(i => i.severity === filterSeverity);

  const stats = {
    criticas:  INCIDENCES.filter(i => i.severity === 'critica').length,
    moderadas: INCIDENCES.filter(i => i.severity === 'moderada').length,
    bajas:     INCIDENCES.filter(i => i.severity === 'baja').length,
    resueltas: INCIDENCES.filter(i => i.severity === 'resuelta').length,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes pe-fadein { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none} }
        .pe-filter{padding:7px 14px;border-radius:20px;border:1px solid #E5E7EB;background:#fff;font-size:12px;font-weight:500;cursor:pointer;transition:all .18s;font-family:inherit;color:#6B7280;}
        .pe-filter:hover{border-color:rgba(82,183,136,.4);color:#2D6A4F;}
        .pe-filter.active{background:linear-gradient(135deg,#1A3C2E,#2D6A4F);border-color:transparent;color:#fff;font-weight:600;}
        .pe-card{background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:20px 22px;transition:all .2s;cursor:pointer;}
        .pe-card:hover{border-color:rgba(82,183,136,.3);box-shadow:0 6px 20px rgba(0,0,0,.06);transform:translateY(-2px);}
        @media(max-width:767px){.pe-stats{flex-direction:column!important;}.pe-grid{grid-template-columns:1fr!important;}}
        @media(min-width:768px)and(max-width:1279px){.pe-grid{grid-template-columns:repeat(2,1fr)!important;}}
      `}</style>

      {/* Hero */}
      <div style={{
        background:'linear-gradient(135deg,#7C2D12 0%,#9A3412 40%,#EA580C 100%)',
        borderRadius:20,padding:'28px 28px',marginBottom:24,
        position:'relative',overflow:'hidden',
      }}>
        <div style={{position:'absolute',top:-40,right:-20,width:160,height:160,borderRadius:'50%',background:'rgba(234,88,12,0.1)',border:'1px solid rgba(234,88,12,0.15)'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'rgba(234,88,12,0.2)',border:'1px solid rgba(234,88,12,0.3)',borderRadius:20,padding:'4px 12px',marginBottom:12}}>
            <Bug size={12} color="#FDBA74"/>
            <span style={{fontSize:10.5,fontWeight:700,color:'#FDBA74',letterSpacing:'0.08em',textTransform:'uppercase' as const}}>Control Biológico · Sanidad Vegetal</span>
          </div>
          <h1 style={{fontSize:28,fontWeight:700,color:'#fff',margin:'0 0 6px',letterSpacing:'-0.4px'}}>Plagas y Enfermedades</h1>
          <p style={{fontSize:13.5,color:'rgba(255,255,255,0.55)',margin:0,maxWidth:460,lineHeight:1.5}}>
            Monitoreo preventivo y correctivo. Detección, severidad, protocolos y trazabilidad técnica.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="pe-stats" style={{display:'flex',gap:14,marginBottom:24}}>
        {[
          {label:'Críticas',value:stats.criticas,color:'#EF4444',icon:AlertTriangle},
          {label:'Moderadas',value:stats.moderadas,color:'#F59E0B',icon:Eye},
          {label:'Bajas',value:stats.bajas,color:'#3B82F6',icon:Bug},
          {label:'Resueltas',value:stats.resueltas,color:'#10B981',icon:Check},
        ].map(s=>{
          const I=s.icon;
          return(
            <div key={s.label} style={{flex:1,background:'#fff',border:'1px solid #E5E7EB',borderRadius:14,padding:'16px 18px',display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:40,height:40,borderRadius:10,background:`${s.color}10`,border:`1px solid ${s.color}20`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <I size={18} color={s.color}/>
              </div>
              <div>
                <div style={{fontSize:22,fontWeight:700,color:'#111827',lineHeight:1}}>{s.value}</div>
                <div style={{fontSize:11,color:'#6B7280',marginTop:2}}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap' as const}}>
        {(['todas','critica','moderada','baja','resuelta'] as const).map(f=>(
          <button key={f} className={`pe-filter ${filterSeverity===f?'active':''}`} onClick={()=>setFilterSeverity(f)}>
            {f==='todas'?`Todas (${INCIDENCES.length})`:
             `${SEVERITY_CFG[f].label} (${INCIDENCES.filter(i=>i.severity===f).length})`}
          </button>
        ))}
      </div>

      {/* Incidences grid */}
      <div className="pe-grid" style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14}}>
        {filtered.map((inc,idx)=>{
          const sev=SEVERITY_CFG[inc.severity];
          return(
            <div key={inc.id} className="pe-card" style={{animation:`pe-fadein .3s ease ${idx*.05}s backwards`,borderLeft:`3px solid ${sev.color}`}}
              onMouseEnter={()=>setHoveredId(inc.id)} onMouseLeave={()=>setHoveredId(null)}>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10}}>
                <div>
                  <span style={{fontSize:10,fontWeight:700,color:'#9CA3AF',letterSpacing:'.08em'}}>{inc.id}</span>
                  <h3 style={{fontSize:14.5,fontWeight:700,color:'#111827',margin:'4px 0 0',lineHeight:1.3}}>{inc.plaga}</h3>
                </div>
                <span style={{padding:'3px 10px',borderRadius:20,background:sev.bg,color:sev.color,fontSize:10,fontWeight:700,letterSpacing:'.06em',whiteSpace:'nowrap' as const}}>
                  {sev.label}
                </span>
              </div>

              <p style={{fontSize:12,color:'#6B7280',lineHeight:1.5,margin:'0 0 12px'}}>{inc.descripcion}</p>

              <div style={{display:'flex',flexWrap:'wrap' as const,gap:10,marginBottom:12,fontSize:11,color:'#9CA3AF'}}>
                <span style={{display:'flex',alignItems:'center',gap:4}}><MapPin size={11}/>{inc.lote}</span>
                <span style={{display:'flex',alignItems:'center',gap:4}}><Calendar size={11}/>{inc.detectedDate}</span>
                <span style={{display:'flex',alignItems:'center',gap:4}}>
                  <span style={{width:14,height:14,borderRadius:4,background:inc.tipo==='plaga'?'rgba(239,68,68,0.1)':inc.tipo==='hongo'?'rgba(168,85,247,0.1)':'rgba(59,130,246,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:8}}>
                    {inc.tipo==='plaga'?'🐛':inc.tipo==='hongo'?'🍄':'🦠'}
                  </span>
                  {inc.tipo}
                </span>
              </div>

              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:10,borderTop:'1px solid #F3F4F6'}}>
                <div style={{display:'flex',alignItems:'center',gap:8,fontSize:11.5}}>
                  <span style={{fontWeight:600,color:'#374151'}}>{inc.responsable}</span>
                  <span style={{color:'#9CA3AF'}}>·</span>
                  <span style={{color:'#52B788',fontWeight:600,fontSize:10.5}}>{inc.protocolo}</span>
                </div>
                <div style={{display:'flex',gap:6}}>
                  {inc.evidencia&&(
                    <span style={{width:26,height:26,borderRadius:6,background:'rgba(59,130,246,0.08)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <Camera size={12} color="#3B82F6"/>
                    </span>
                  )}
                  <span style={{width:26,height:26,borderRadius:6,background:hoveredId===inc.id?'#1A3C2E':'#F3F4F6',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s'}}>
                    <ChevronRight size={12} color={hoveredId===inc.id?'#fff':'#9CA3AF'}/>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
