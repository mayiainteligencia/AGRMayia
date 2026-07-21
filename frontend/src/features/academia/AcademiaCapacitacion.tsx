import React, { useState } from 'react';
import {
  GraduationCap, BookOpen, Award, Users, Play,
  Clock, ChevronRight, Check, Lock,
  Sprout, FlaskConical, BarChart3,
  Target,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════════════ */

type RoleKey = 'campo' | 'laboratorio' | 'direccion' | 'clientes';
type CourseStatus = 'completado' | 'en-progreso' | 'bloqueado';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  role: RoleKey;
  status: CourseStatus;
  progress: number;
  lessons: number;
  lessonsCompleted: number;
  certification: boolean;
}

const ROLES: Record<RoleKey, { label: string; icon: React.ElementType; color: string; desc: string }> = {
  campo:        { label: 'Personal de Campo',     icon: Sprout,       color: '#10B981', desc: 'Técnicos, supervisores y jornaleros' },
  laboratorio:  { label: 'Laboratorio',           icon: FlaskConical, color: '#3B82F6', desc: 'Analistas, ingenieros agrónomos' },
  direccion:    { label: 'Dirección y Gerencia',  icon: BarChart3,    color: '#8B5CF6', desc: 'Directores, gerentes de operaciones' },
  clientes:     { label: 'Clientes y Partners',   icon: Users,        color: '#F59E0B', desc: 'Compradores, distribuidores, cooperativas' },
};

const COURSES: Course[] = [
  // Campo
  { id: 'c1', title: 'Fundamentos del Monitoreo de Campo',    description: 'Aprende a registrar recorridos, capturar evidencia y reportar incidencias por lote.',                duration: '2h 30min', role: 'campo', status: 'completado',  progress: 100, lessons: 8,  lessonsCompleted: 8,  certification: true },
  { id: 'c2', title: 'Cosecha Inteligente con QR',            description: 'Captura de cosecha por QR, destajo, peso y calidad en tiempo real.',                                 duration: '1h 45min', role: 'campo', status: 'en-progreso', progress: 62,  lessons: 6,  lessonsCompleted: 4,  certification: true },
  { id: 'c3', title: 'Identificación de Plagas y Enfermedades', description: 'Reconocimiento visual de plagas, protocolos de acción y escalamiento.',                            duration: '3h',       role: 'campo', status: 'bloqueado',   progress: 0,   lessons: 10, lessonsCompleted: 0,  certification: true },
  { id: 'c4', title: 'Riego y Variables Críticas',             description: 'pH, EC, humedad, VPD — cómo leer instrumentos y tomar decisiones.',                                 duration: '2h',       role: 'campo', status: 'bloqueado',   progress: 0,   lessons: 7,  lessonsCompleted: 0,  certification: false },

  // Laboratorio
  { id: 'l1', title: 'Panel de Laboratorio — Guía Completa', description: 'Carga de resultados, interpretación de análisis y generación de informes.',                           duration: '3h 15min', role: 'laboratorio', status: 'completado',  progress: 100, lessons: 12, lessonsCompleted: 12, certification: true },
  { id: 'l2', title: 'Análisis de Alimentos e Inocuidad',    description: 'NOM-251, COFEPRIS, FDA — flujo de análisis desde muestra hasta certificado.',                          duration: '2h 30min', role: 'laboratorio', status: 'en-progreso', progress: 35,  lessons: 9,  lessonsCompleted: 3,  certification: true },
  { id: 'l3', title: 'Soil-Bio-Vision™ y Suelos',            description: 'Jar test, triángulo USDA, densidad aparente — módulo avanzado de suelos.',                             duration: '2h',       role: 'laboratorio', status: 'bloqueado',   progress: 0,   lessons: 8,  lessonsCompleted: 0,  certification: true },

  // Dirección
  { id: 'd1', title: 'Dashboard Ejecutivo y KPIs',           description: 'Leer el panel principal, interpretar tendencias y tomar decisiones por excepción.',                    duration: '1h 30min', role: 'direccion', status: 'completado',  progress: 100, lessons: 5,  lessonsCompleted: 5,  certification: false },
  { id: 'd2', title: 'Inteligencia Artificial para Gerentes', description: 'Cómo activar agentes IA, interpretar recomendaciones y definir autonomía.',                           duration: '2h',       role: 'direccion', status: 'en-progreso', progress: 50,  lessons: 8,  lessonsCompleted: 4,  certification: true },
  { id: 'd3', title: 'Precios Predictivos y Finanzas',        description: 'Entender márgenes, rentabilidad por lote y proyecciones de precio.',                                  duration: '1h 45min', role: 'direccion', status: 'bloqueado',   progress: 0,   lessons: 6,  lessonsCompleted: 0,  certification: true },

  // Clientes
  { id: 'cl1', title: 'Portal B2B — Onboarding',             description: 'Primeros pasos para compradores internacionales en el portal.',                                        duration: '45min',    role: 'clientes', status: 'completado',  progress: 100, lessons: 3,  lessonsCompleted: 3,  certification: false },
  { id: 'cl2', title: 'Órdenes de Compra y Trazabilidad',    description: 'Cómo generar OC, consultar trazabilidad y descargar certificados.',                                    duration: '1h 15min', role: 'clientes', status: 'en-progreso', progress: 40,  lessons: 5,  lessonsCompleted: 2,  certification: true },
];

const STATUS_CONFIG: Record<CourseStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  completado:   { label: 'Completado',   color: '#10B981', bg: 'rgba(16,185,129,0.10)',  icon: Check },
  'en-progreso': { label: 'En progreso', color: '#3B82F6', bg: 'rgba(59,130,246,0.10)',  icon: Play },
  bloqueado:    { label: 'Bloqueado',    color: '#9CA3AF', bg: 'rgba(156,163,175,0.10)', icon: Lock },
};

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */

export const AcademiaCapacitacion: React.FC = () => {
  const [activeRole, setActiveRole] = useState<RoleKey | 'todos'>('todos');

  const filtered = activeRole === 'todos'
    ? COURSES
    : COURSES.filter(c => c.role === activeRole);

  const totalCourses = COURSES.length;
  const completados = COURSES.filter(c => c.status === 'completado').length;
  const enProgreso = COURSES.filter(c => c.status === 'en-progreso').length;
  const totalCerts = COURSES.filter(c => c.certification).length;
  const overallProgress = Math.round(COURSES.reduce((sum, c) => sum + c.progress, 0) / totalCourses);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes ac-fadein { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        @keyframes ac-progress { from { width: 0; } }

        .ac-role-btn {
          display: flex; align-items: center; gap: 8;
          padding: 10px 16px; border-radius: 12;
          border: 1px solid #E5E7EB; background: #fff;
          cursor: pointer; transition: all 0.2s;
          font-family: inherit; font-size: 12.5px;
          color: #6B7280; font-weight: 500;
        }
        .ac-role-btn:hover { border-color: rgba(82,183,136,0.35); }
        .ac-role-btn.is-active {
          background: linear-gradient(135deg, #1A3C2E, #2D6A4F);
          border-color: transparent; color: #fff; font-weight: 600;
        }
        .ac-role-btn.is-active .ac-role-icon-wrap {
          background: rgba(255,255,255,0.15) !important;
          border-color: rgba(255,255,255,0.25) !important;
        }

        .ac-course-card {
          background: #fff; border: 1px solid #E5E7EB;
          border-radius: 14px; padding: 20px 22px;
          transition: all 0.2s; cursor: pointer;
        }
        .ac-course-card:hover {
          border-color: rgba(82,183,136,0.3);
          box-shadow: 0 6px 20px rgba(0,0,0,0.06);
          transform: translateY(-2px);
        }

        @media (max-width: 767px) {
          .ac-kpi-row  { flex-direction: column !important; }
          .ac-role-row { flex-direction: column !important; }
          .ac-courses  { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 768px) and (max-width: 1279px) {
          .ac-courses { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(135deg, #0C4A6E 0%, #075985 40%, #0284C7 100%)',
        borderRadius: 20, padding: '32px 28px', marginBottom: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -50, right: -20,
          width: 180, height: 180, borderRadius: '50%',
          background: 'rgba(14,165,233,0.12)',
          border: '1px solid rgba(14,165,233,0.18)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(14,165,233,0.3)',
            borderRadius: 20, padding: '4px 12px', marginBottom: 12,
          }}>
            <GraduationCap size={12} color="#7DD3FC" />
            <span style={{ fontSize: 10.5, fontWeight: 700, color: '#7DD3FC', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
              AgroTech Academy™
            </span>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.4px' }}>
            Capacitación y Adopción
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: 0, maxWidth: 480, lineHeight: 1.5 }}>
            La tecnología solo genera valor cuando el equipo la usa correctamente.
            Rutas de aprendizaje por rol, certificaciones internas y biblioteca agrícola.
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          KPIs
      ════════════════════════════════════════════ */}
      <div className="ac-kpi-row" style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Progreso General', value: `${overallProgress}%`, icon: Target, color: '#52B788', showBar: true },
          { label: 'Cursos Completados', value: `${completados}/${totalCourses}`, icon: Check, color: '#10B981', showBar: false },
          { label: 'En Progreso', value: String(enProgreso), icon: Play, color: '#3B82F6', showBar: false },
          { label: 'Certificaciones', value: `${totalCerts} disponibles`, icon: Award, color: '#F59E0B', showBar: false },
        ].map(kpi => {
          const KpiIcon = kpi.icon;
          return (
            <div key={kpi.label} style={{
              flex: 1, background: '#fff', border: '1px solid #E5E7EB',
              borderRadius: 14, padding: '18px 20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: kpi.showBar ? 12 : 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: `${kpi.color}10`, border: `1px solid ${kpi.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
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
              {kpi.showBar && (
                <div style={{ height: 6, borderRadius: 3, background: '#F3F4F6', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    background: `linear-gradient(90deg, ${kpi.color}, #2D6A4F)`,
                    width: `${overallProgress}%`,
                    animation: 'ac-progress 1s ease forwards',
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════
          ROLE FILTER
      ════════════════════════════════════════════ */}
      <div className="ac-role-row" style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' as const }}>
        <button
          className={`ac-role-btn ${activeRole === 'todos' ? 'is-active' : ''}`}
          onClick={() => setActiveRole('todos')}
        >
          <BookOpen size={14} />
          Todos los cursos ({totalCourses})
        </button>
        {(Object.keys(ROLES) as RoleKey[]).map(key => {
          const role = ROLES[key];
          const RoleIcon = role.icon;
          const count = COURSES.filter(c => c.role === key).length;
          return (
            <button
              key={key}
              className={`ac-role-btn ${activeRole === key ? 'is-active' : ''}`}
              onClick={() => setActiveRole(key)}
            >
              <div className="ac-role-icon-wrap" style={{
                width: 24, height: 24, borderRadius: 6,
                background: `${role.color}10`, border: `1px solid ${role.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <RoleIcon size={12} color={activeRole === key ? '#fff' : role.color} />
              </div>
              {role.label} ({count})
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════
          COURSES GRID
      ════════════════════════════════════════════ */}
      <div className="ac-courses" style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
      }}>
        {filtered.map((course, idx) => {
          const sc = STATUS_CONFIG[course.status];
          const StIcon = sc.icon;
          const role = ROLES[course.role];
          const RoleIcon = role.icon;

          return (
            <div
              key={course.id}
              className="ac-course-card"
              style={{ animation: `ac-fadein 0.3s ease ${idx * 0.05}s backwards` }}
            >
              {/* Status + Role */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '3px 10px', borderRadius: 20,
                  background: sc.bg, fontSize: 10, fontWeight: 700,
                  color: sc.color, letterSpacing: '0.06em',
                }}>
                  <StIcon size={10} strokeWidth={3} /> {sc.label}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  fontSize: 10.5, color: '#9CA3AF',
                }}>
                  <RoleIcon size={12} color={role.color} />
                  {role.label}
                </div>
              </div>

              {/* Title + Desc */}
              <h3 style={{
                fontSize: 15, fontWeight: 700, color: '#111827',
                margin: '0 0 6px', lineHeight: 1.3,
              }}>
                {course.title}
              </h3>
              <p style={{
                fontSize: 12, color: '#6B7280', lineHeight: 1.5,
                margin: '0 0 14px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical' as const,
                overflow: 'hidden',
              }}>
                {course.description}
              </p>

              {/* Meta row */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14,
                fontSize: 11.5, color: '#9CA3AF',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} /> {course.duration}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <BookOpen size={12} /> {course.lessonsCompleted}/{course.lessons} lecciones
                </span>
                {course.certification && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F59E0B' }}>
                    <Award size={12} /> Cert.
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 14 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 10.5, color: '#9CA3AF', marginBottom: 4,
                }}>
                  <span>Progreso</span>
                  <span style={{ fontWeight: 700, color: course.progress === 100 ? '#10B981' : '#374151' }}>
                    {course.progress}%
                  </span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: '#F3F4F6', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    background: course.progress === 100
                      ? '#10B981'
                      : course.progress > 0
                      ? 'linear-gradient(90deg, #3B82F6, #60A5FA)'
                      : '#E5E7EB',
                    width: `${course.progress}%`,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
              </div>

              {/* Action button */}
              <button style={{
                width: '100%', padding: '10px',
                borderRadius: 10,
                border: course.status === 'bloqueado' ? '1px solid #E5E7EB' : 'none',
                background: course.status === 'bloqueado'
                  ? '#F9FAFB'
                  : course.status === 'completado'
                  ? 'rgba(16,185,129,0.08)'
                  : 'linear-gradient(135deg, #1A3C2E, #2D6A4F)',
                color: course.status === 'bloqueado'
                  ? '#9CA3AF'
                  : course.status === 'completado'
                  ? '#059669'
                  : '#fff',
                fontSize: 12, fontWeight: 600,
                cursor: course.status === 'bloqueado' ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                {course.status === 'completado' && <><Check size={14} /> Ver certificado</>}
                {course.status === 'en-progreso' && <><Play size={14} /> Continuar</>}
                {course.status === 'bloqueado' && <><Lock size={14} /> Completa los anteriores</>}
              </button>
            </div>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════
          BIBLIOTECA CALLOUT
      ════════════════════════════════════════════ */}
      <div style={{
        background: '#F9FAFB', border: '1px solid #E5E7EB',
        borderRadius: 16, padding: '24px 28px',
        marginTop: 28,
        display: 'flex', alignItems: 'center', gap: 18,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <BookOpen size={22} color="#0EA5E9" />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
            Biblioteca de Conocimiento Agrícola
          </h3>
          <p style={{ fontSize: 12.5, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>
            Accede a manuales, guías técnicas, fichas de variedades, protocolos de riego
            y documentos de referencia para toda la operación AgroBotanicals™.
          </p>
        </div>
        <button style={{
          padding: '10px 18px', borderRadius: 10,
          background: 'linear-gradient(135deg, #0C4A6E, #0284C7)',
          border: 'none', color: '#fff',
          fontSize: 12.5, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 6,
          whiteSpace: 'nowrap' as const,
        }}>
          Explorar <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
