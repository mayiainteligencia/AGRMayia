import React, { useState } from 'react';
import {
  MapPin, Ruler, User, Sprout, Droplets,
  ChevronRight,
  Layers,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════ */

interface Ranch {
  id: string;
  nombre: string;
  ubicacion: string;
  superficie: string;
  lotes: Lote[];
  responsable: string;
  cultivos: string[];
  altitud: string;
  tipoSuelo: string;
}

interface Lote {
  id: string;
  nombre: string;
  superficie: string;
  variedad: string;
  etapa: string;
  plantas: number;
  responsable: string;
}

const RANCHES: Ranch[] = [
  {
    id: 'R-001', nombre: 'Rancho El Roble', ubicacion: 'Zapopan, Jalisco',
    superficie: '48 ha', altitud: '1,580 msnm', tipoSuelo: 'Franco-arenoso',
    responsable: 'Ing. Alejandro Torres', cultivos: ['Blueberry Biloxi', 'Blueberry Legacy'],
    lotes: [
      { id:'A-12', nombre:'Lote A-12', superficie:'4.2 ha', variedad:'Biloxi',   etapa:'Producción plena', plantas:38178, responsable:'Ing. Torres' },
      { id:'A-14', nombre:'Lote A-14', superficie:'3.8 ha', variedad:'Biloxi',   etapa:'Producción plena', plantas:34542, responsable:'Ing. Torres' },
      { id:'A-16', nombre:'Lote A-16', superficie:'5.0 ha', variedad:'Legacy',   etapa:'Floración',        plantas:45450, responsable:'Ing. Torres' },
    ],
  },
  {
    id: 'R-002', nombre: 'Rancho Los Alamos', ubicacion: 'Tala, Jalisco',
    superficie: '32 ha', altitud: '1,320 msnm', tipoSuelo: 'Franco-arcilloso',
    responsable: 'Ing. Patricia Ramírez', cultivos: ['Blueberry Legacy', 'Raspberry Driscoll'],
    lotes: [
      { id:'B-03', nombre:'Lote B-03', superficie:'6.0 ha', variedad:'Legacy',   etapa:'Floración tardía', plantas:54540, responsable:'Ing. Ramírez' },
      { id:'B-05', nombre:'Lote B-05', superficie:'4.5 ha', variedad:'Legacy',   etapa:'Floración tardía', plantas:40905, responsable:'Ing. Ramírez' },
      { id:'B-07', nombre:'Lote B-07', superficie:'3.2 ha', variedad:'Driscoll', etapa:'Vegetativa',       plantas:29088, responsable:'Ing. Ramírez' },
    ],
  },
  {
    id: 'R-003', nombre: 'Rancho Cerro Verde', ubicacion: 'Tapalpa, Jalisco',
    superficie: '22 ha', altitud: '1,980 msnm', tipoSuelo: 'Andosol',
    responsable: 'Ing. Roberto Silva', cultivos: ['Raspberry Driscoll', 'Blackberry Tupi'],
    lotes: [
      { id:'C-01', nombre:'Lote C-01', superficie:'5.5 ha', variedad:'Driscoll', etapa:'Cuajado',   plantas:49995, responsable:'Ing. Silva' },
      { id:'D-02', nombre:'Lote D-02', superficie:'4.0 ha', variedad:'Tupi',     etapa:'Vegetativa', plantas:36360, responsable:'Ing. Silva' },
    ],
  },
];

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */

export const CamposRanchos: React.FC = () => {
  const [selectedRanch, setSelectedRanch] = useState<string | null>(null);

  const totalHa = RANCHES.reduce((sum, r) => sum + parseFloat(r.superficie), 0);
  const totalLotes = RANCHES.reduce((sum, r) => sum + r.lotes.length, 0);
  const totalPlantas = RANCHES.reduce((sum, r) => r.lotes.reduce((s, l) => s + l.plantas, sum), 0);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes cr-fadein { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none} }
        .cr-ranch{background:#fff;border:1px solid #E5E7EB;border-radius:16px;overflow:hidden;transition:all .2s;cursor:pointer;}
        .cr-ranch:hover{border-color:rgba(82,183,136,.3);box-shadow:0 6px 20px rgba(0,0,0,.06);}
        .cr-lote{background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:14px 16px;transition:all .18s;}
        .cr-lote:hover{background:#EEF4F1;border-color:rgba(82,183,136,.25);}
        @media(max-width:767px){.cr-kpis{flex-direction:column!important;}.cr-grid{grid-template-columns:1fr!important;}}
      `}</style>

      {/* Hero */}
      <div style={{
        background:'linear-gradient(135deg,#1A3C2E 0%,#2D6A4F 40%,#40916C 100%)',
        borderRadius:20,padding:'28px 28px',marginBottom:24,
        position:'relative',overflow:'hidden',
      }}>
        <div style={{position:'absolute',top:-40,right:-20,width:160,height:160,borderRadius:'50%',background:'rgba(82,183,136,0.08)',border:'1px solid rgba(82,183,136,0.12)'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:7,background:'rgba(82,183,136,0.2)',border:'1px solid rgba(82,183,136,0.3)',borderRadius:20,padding:'4px 12px',marginBottom:12}}>
            <MapPin size={12} color="#6EE7B7"/>
            <span style={{fontSize:10.5,fontWeight:700,color:'#6EE7B7',letterSpacing:'0.08em',textTransform:'uppercase' as const}}>Fichas de Rancho</span>
          </div>
          <h1 style={{fontSize:28,fontWeight:700,color:'#fff',margin:'0 0 6px',letterSpacing:'-0.4px'}}>Campos y Ranchos</h1>
          <p style={{fontSize:13.5,color:'rgba(255,255,255,0.55)',margin:0,maxWidth:460,lineHeight:1.5}}>
            Fichas de ranchos, superficies, lotes, variedades y responsables de cada unidad productiva.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="cr-kpis" style={{display:'flex',gap:14,marginBottom:24}}>
        {[
          {label:'Ranchos',value:String(RANCHES.length),icon:MapPin,color:'#52B788'},
          {label:'Superficie Total',value:`${totalHa} ha`,icon:Ruler,color:'#3B82F6'},
          {label:'Lotes Activos',value:String(totalLotes),icon:Layers,color:'#F59E0B'},
          {label:'Plantas Totales',value:totalPlantas.toLocaleString(),icon:Sprout,color:'#8B5CF6'},
        ].map(k=>{const I=k.icon;return(
          <div key={k.label} style={{flex:1,background:'#fff',border:'1px solid #E5E7EB',borderRadius:14,padding:'16px 18px',display:'flex',alignItems:'center',gap:12}}>
            <div style={{width:40,height:40,borderRadius:10,background:`${k.color}10`,border:`1px solid ${k.color}20`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <I size={18} color={k.color}/>
            </div>
            <div>
              <div style={{fontSize:20,fontWeight:700,color:'#111827',lineHeight:1}}>{k.value}</div>
              <div style={{fontSize:11,color:'#6B7280',marginTop:2}}>{k.label}</div>
            </div>
          </div>
        );})}
      </div>

      {/* Ranch Cards */}
      <div className="cr-grid" style={{display:'grid',gridTemplateColumns:'repeat(1,1fr)',gap:18}}>
        {RANCHES.map((ranch,rIdx)=>{
          const isOpen = selectedRanch === ranch.id;
          return(
            <div key={ranch.id} className="cr-ranch" style={{animation:`cr-fadein .3s ease ${rIdx*.08}s backwards`}}
              onClick={()=>setSelectedRanch(isOpen?null:ranch.id)}>
              {/* Top color bar */}
              <div style={{height:3,background:'linear-gradient(90deg,#52B788,#2D6A4F)'}}/>
              <div style={{padding:'20px 24px'}}>
                {/* Ranch header */}
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:16}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:48,height:48,borderRadius:14,background:'rgba(82,183,136,0.1)',border:'1px solid rgba(82,183,136,0.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <MapPin size={22} color="#52B788"/>
                    </div>
                    <div>
                      <h2 style={{fontSize:18,fontWeight:700,color:'#111827',margin:'0 0 2px'}}>{ranch.nombre}</h2>
                      <div style={{fontSize:12,color:'#6B7280',display:'flex',alignItems:'center',gap:6}}>
                        <MapPin size={11}/>{ranch.ubicacion}
                        <span style={{color:'#D1D5DB'}}>·</span>
                        {ranch.altitud}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#9CA3AF" style={{transition:'transform .2s',transform:isOpen?'rotate(90deg)':'none'}}/>
                </div>

                {/* Ranch meta */}
                <div style={{display:'flex',gap:16,marginBottom:isOpen?16:0,fontSize:12,color:'#6B7280',flexWrap:'wrap' as const}}>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><Ruler size={12} color="#3B82F6"/>{ranch.superficie}</span>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><Layers size={12} color="#F59E0B"/>{ranch.lotes.length} lotes</span>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><User size={12} color="#8B5CF6"/>{ranch.responsable}</span>
                  <span style={{display:'flex',alignItems:'center',gap:4}}><Droplets size={12} color="#06B6D4"/>{ranch.tipoSuelo}</span>
                  <div style={{display:'flex',gap:4,flexWrap:'wrap' as const}}>
                    {ranch.cultivos.map(c=>(
                      <span key={c} style={{padding:'2px 8px',borderRadius:6,fontSize:10.5,fontWeight:600,background:'rgba(82,183,136,0.08)',color:'#2D6A4F',border:'1px solid rgba(82,183,136,0.15)'}}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expanded: lotes */}
                {isOpen&&(
                  <div style={{borderTop:'1px solid #E5E7EB',paddingTop:16,animation:'cr-fadein .25s ease'}}>
                    <h3 style={{fontSize:12,fontWeight:700,color:'#9CA3AF',letterSpacing:'.08em',textTransform:'uppercase' as const,marginBottom:10}}>Lotes del Rancho</h3>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:10}}>
                      {ranch.lotes.map(lote=>(
                        <div key={lote.id} className="cr-lote">
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                            <div style={{fontSize:14,fontWeight:700,color:'#111827'}}>{lote.nombre}</div>
                            <span style={{fontSize:10.5,fontWeight:600,color:'#52B788',padding:'2px 8px',borderRadius:6,background:'rgba(82,183,136,0.08)'}}>
                              {lote.etapa}
                            </span>
                          </div>
                          <div style={{display:'flex',gap:12,fontSize:11.5,color:'#6B7280'}}>
                            <span>{lote.superficie}</span>
                            <span>{lote.variedad}</span>
                            <span>{lote.plantas.toLocaleString()} plantas</span>
                          </div>
                          <div style={{fontSize:11,color:'#9CA3AF',marginTop:6}}>{lote.responsable}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
