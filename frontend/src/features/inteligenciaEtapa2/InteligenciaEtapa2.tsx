import React from 'react';
import { Sparkles, Brain, Rocket, CircleCheck, CircleDashed, Loader } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Badge } from '../../components/ui/Badge';
import { brandingConfig } from '../../config/branding';
import {
  PageTitle, AgentStrip, LiveFeed, useLiveFeed, LiveDot,
} from '../../components/command/CommandKit';

const { colores } = brandingConfig;

interface AgenteEtapa2 { nombre: string; desc: string; progreso: number; estado: 'Activo' | 'Entrenando' | 'Planeado'; }
const AGENTES: AgenteEtapa2[] = [
  { nombre: 'BRAIN™ #P — Predicción de rendimiento', desc: 'Pronóstico de cosecha por bloque con visión + clima + suelo.', progreso: 82, estado: 'Activo' },
  { nombre: 'BRAIN™ #X — Optimización de riego autónoma', desc: 'Cierra el lazo riego↔sensores sin intervención humana.', progreso: 54, estado: 'Entrenando' },
  { nombre: 'BRAIN™ #M — Mercado y precios', desc: 'Recomienda a qué cliente y precio vender cada lote.', progreso: 38, estado: 'Entrenando' },
  { nombre: 'BRAIN™ #V — Gemelo digital del rancho', desc: 'Simulación completa del campo para escenarios what-if.', progreso: 12, estado: 'Planeado' },
];

interface Fase { fase: string; titulo: string; detalle: string; estado: 'Hecho' | 'En curso' | 'Pendiente'; }
const ROADMAP: Fase[] = [
  { fase: 'F1', titulo: 'Agentes de dominio (Etapa 1)', detalle: 'BRAIN #W, #F, #E en producción.', estado: 'Hecho' },
  { fase: 'F2', titulo: 'Orquestación multi-agente', detalle: 'BRAIN Central coordina agentes entre secciones.', estado: 'En curso' },
  { fase: 'F3', titulo: 'Autonomía con humano-en-el-lazo', detalle: 'Acciones automáticas con aprobación en alertas críticas.', estado: 'En curso' },
  { fase: 'F4', titulo: 'Gemelo digital + simulación', detalle: 'Escenarios de clima, precio y cosecha en tiempo real.', estado: 'Pendiente' },
];

const AgenteCard: React.FC<{ a: AgenteEtapa2 }> = ({ a }) => {
  const c = a.estado === 'Activo' ? colores.exito : a.estado === 'Entrenando' ? colores.advertencia : colores.textoOscuro;
  return (
    <Card padding={18}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: colores.gradienteBerry, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Brain size={18} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: colores.textoClaro }}>{a.nombre}</span>
            <span style={{ marginLeft: 'auto' }}><Badge variant={a.estado === 'Activo' ? 'success' : a.estado === 'Entrenando' ? 'warning' : 'neutral'}>{a.estado}</Badge></span>
          </div>
          <p style={{ fontSize: 12, color: colores.textoOscuro, margin: '5px 0 12px', lineHeight: 1.45 }}>{a.desc}</p>
          <div style={{ height: 7, borderRadius: 4, background: colores.fondoTerciario, overflow: 'hidden' }}>
            <div style={{ width: `${a.progreso}%`, height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${colores.secundario}, ${c})`, transition: 'width 0.6s' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <LiveDot size={6} color={c} />
            <span style={{ fontSize: 11, color: colores.textoOscuro }}>{a.progreso}% de despliegue</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const InteligenciaEtapa2: React.FC = () => {
  const feed = useLiveFeed([
    { sev: 'ok',   texto: 'BRAIN #P mejoró RMSE de pronóstico en 6%' },
    { sev: 'info', texto: 'BRAIN #X ejecutó simulación de riego nocturno' },
    { sev: 'warn', texto: 'BRAIN #M requiere más datos de precios de mercado' },
    { sev: 'ok',   texto: 'Orquestador coordinó 3 agentes en una alerta' },
  ], [
    { id: 1, sev: 'info', texto: 'Etapa 2 en despliegue progresivo', hora: '14:00:00' },
  ]);

  const faseIcon = (e: Fase['estado']) => e === 'Hecho'
    ? <CircleCheck size={16} color={colores.exito} />
    : e === 'En curso'
    ? <Loader size={16} color={colores.advertencia} />
    : <CircleDashed size={16} color={colores.textoOscuro} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <PageTitle titulo="Solución de Inteligencia · Etapa 2" bajada="Próxima generación de agentes MAYIA: autonomía, orquestación y gemelo digital" />
      <AgentStrip
        agente="BRAIN™ Central" rol="Orquestador maestro" estado="Desplegando" icon={Sparkles}
        acciones={['Coordinando agentes entre secciones…', 'Entrenando modelos de Etapa 2…', 'Evaluando autonomía con humano-en-el-lazo…', 'Sincronizando gemelo digital del rancho…']}
      />

      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10, background: colores.gradientePrimario }}>
          <Rocket size={18} color="#fff" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Agentes de Etapa 2 en despliegue</span>
        </div>
        <div className="rg-2" style={{ gap: 16, padding: 18 }}>
          {AGENTES.map((a, i) => <AgenteCard key={i} a={a} />)}
        </div>
      </Card>

      <div className="rg-2-1" style={{ gap: 20 }}>
        <Card>
          <SectionHeader title="Roadmap de inteligencia" subtitle="Fases de evolución de la plataforma MAYIA" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {ROADMAP.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 4px', borderBottom: i < ROADMAP.length - 1 ? `1px solid ${colores.borde}` : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  {faseIcon(f.estado)}
                  {i < ROADMAP.length - 1 && <div style={{ width: 2, flex: 1, background: colores.borde }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: colores.secundario }}>{f.fase}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: colores.textoClaro }}>{f.titulo}</span>
                    <span style={{ marginLeft: 'auto' }}><Badge variant={f.estado === 'Hecho' ? 'success' : f.estado === 'En curso' ? 'warning' : 'neutral'}>{f.estado}</Badge></span>
                  </div>
                  <p style={{ fontSize: 12, color: colores.textoOscuro, margin: '3px 0 0', lineHeight: 1.4 }}>{f.detalle}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <LiveFeed items={feed} titulo="Actividad de agentes" />
      </div>
    </div>
  );
};

export default InteligenciaEtapa2;
