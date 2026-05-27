import React, { useState, useRef, useEffect } from 'react';

/* ─── Types ──────────────────────────────────────────────── */
type Status = 'healthy' | 'danger';

interface ZoneOverlay {
  x: string;
  y: string;
  width: string;
  height: string;
  borderRadius: string;
  rotate?: number;
}

interface DiagnosticPoint {
  id: string;
  dotX: string;
  dotY: string;
  zone: ZoneOverlay;
  status: Status;
  label: string;
  pathogen: string;
  shortDesc: string;
  thumbnail: string;
}

/* ─── Data ───────────────────────────────────────────────── */
const POINTS: DiagnosticPoint[] = [
  {
    id: 'dp-1',
    dotX: '26%', dotY: '20%',
    zone: { x: '10%', y: '8%', width: '26%', height: '24%', borderRadius: '54% 46% 60% 40% / 50% 55% 45% 50%', rotate: -8 },
    status: 'healthy',
    label: 'Racimo Superior Izquierdo',
    pathogen: 'Sin patógenos detectados',
    shortDesc: 'Frutos uniformes, color óptimo, listos para cosecha en 5–7 días.',
    thumbnail: '/assets/extrasAgro/diagnostics/dx_healthy.png',
  },
  {
    id: 'dp-2',
    dotX: '63%', dotY: '14%',
    zone: { x: '52%', y: '5%', width: '30%', height: '26%', borderRadius: '48% 52% 44% 56% / 55% 45% 55% 45%', rotate: 5 },
    status: 'healthy',
    label: 'Racimo Superior Derecho',
    pathogen: 'Sin patógenos detectados',
    shortDesc: 'Frutos maduros, dosel bien ventilado. Sector productivo óptimo.',
    thumbnail: '/assets/extrasAgro/diagnostics/dx_healthy.png',
  },
  {
    id: 'dp-3',
    dotX: '50%', dotY: '40%',
    zone: { x: '36%', y: '28%', width: '28%', height: '24%', borderRadius: '52% 48% 56% 44% / 48% 52% 48% 52%', rotate: 0 },
    status: 'healthy',
    label: 'Zona Central – Racimo Medial',
    pathogen: 'Sin patógenos detectados',
    shortDesc: 'Alta densidad productiva. Color y textura óptimos, sin lesiones.',
    thumbnail: '/assets/extrasAgro/diagnostics/dx_healthy.png',
  },
  {
    id: 'dp-4',
    dotX: '80%', dotY: '44%',
    zone: { x: '68%', y: '30%', width: '24%', height: '28%', borderRadius: '60% 40% 55% 45% / 45% 55% 45% 55%', rotate: 12 },
    status: 'danger',
    label: 'Brotes Tiernos – Zona Este',
    pathogen: 'Erysiphe vaccinii (Oídio)',
    shortDesc: 'Polvo blanco incipiente en nervios de hojas jóvenes. Monitorear cada 48 h.',
    thumbnail: '/assets/extrasAgro/diagnostics/dx_oidio.png',
  },
  {
    id: 'dp-5',
    dotX: '18%', dotY: '55%',
    zone: { x: '4%', y: '42%', width: '26%', height: '24%', borderRadius: '44% 56% 50% 50% / 52% 48% 52% 48%', rotate: -5 },
    status: 'danger',
    label: 'Hoja Periférica – Zona Oeste',
    pathogen: 'Pestalotiopsis / Alternaria spp.',
    shortDesc: 'Lesiones necróticas en bordes foliares. Aplicar fungicida de contacto.',
    thumbnail: '/assets/extrasAgro/diagnostics/dx_manchas.png',
  },
  {
    id: 'dp-6',
    dotX: '51%', dotY: '70%',
    zone: { x: '37%', y: '60%', width: '26%', height: '22%', borderRadius: '50% 50% 60% 40% / 40% 60% 50% 50%', rotate: 0 },
    status: 'danger',
    label: 'Corona y Cuello de la Planta',
    pathogen: 'Phytophthora cinnamomi',
    shortDesc: 'Oscurecimiento en base de tallos. Revisar drenaje y reducir riego urgente.',
    thumbnail: '/assets/extrasAgro/diagnostics/dx_phytophthora.png',
  },
  {
    id: 'dp-7',
    dotX: '36%', dotY: '32%',
    zone: { x: '22%', y: '20%', width: '24%', height: '26%', borderRadius: '50% 50% 45% 55% / 55% 45% 50% 50%', rotate: -10 },
    status: 'danger',
    label: 'Ramilla Lateral – Botrytis',
    pathogen: 'Botrytis cinerea (Moho gris)',
    shortDesc: 'Marchitez y moho gris polvoriento. Eliminar ramillas y aplicar fungicida.',
    thumbnail: '/assets/extrasAgro/diagnostics/dx_botrytis.png',
  },
];

/* ─── Component ──────────────────────────────────────────── */
export const AnalisisVisual: React.FC = () => {
  const [visibleId, setVisibleId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect touch/mobile
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const visiblePoint = POINTS.find(p => p.id === visibleId) ?? null;

  /* ── Desktop: mouse handlers ── */
  const onMouseEnter = (e: React.MouseEvent, id: string) => {
    if (isTouch) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setVisibleId(id);
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isTouch || !visibleId) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const onMouseLeave = () => {
    if (isTouch) return;
    setVisibleId(null);
  };

  /* ── Mobile: tap to toggle mini-card ── */
  const onTap = (e: React.TouchEvent | React.MouseEvent, id: string) => {
    if (!isTouch) return;
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (visibleId === id) { setVisibleId(null); return; }
    // position card near the dot
    const pt = POINTS.find(p => p.id === id)!;
    const cW = containerRef.current?.offsetWidth ?? 375;
    const cH = containerRef.current?.offsetHeight ?? 600;
    const rawX = (parseFloat(pt.dotX) / 100) * cW;
    const rawY = (parseFloat(pt.dotY) / 100) * cH;
    setTooltipPos({ x: rawX, y: rawY });
    setVisibleId(id);
  };

  /* ── Mini-card smart position ── */
  const getMiniCardStyle = () => {
    const tipW = isMobile ? Math.min(220, (containerRef.current?.offsetWidth ?? 320) - 24) : 252;
    const tipH = 215;
    const cW   = containerRef.current?.offsetWidth  ?? 375;
    const cH   = containerRef.current?.offsetHeight ?? 600;
    const margin = isMobile ? 12 : 28;

    // prefer right of dot, flip left if no room
    let left = tooltipPos.x + margin;
    if (left + tipW > cW - 8) left = tooltipPos.x - tipW - margin;
    // clamp to container bounds
    left = Math.max(8, Math.min(left, cW - tipW - 8));

    // prefer below dot, flip up if no room
    let top = tooltipPos.y + (isMobile ? -tipH - 20 : 0);
    if (top < 8) top = tooltipPos.y + 20;
    if (top + tipH > cH - 8) top = cH - tipH - 8;
    top = Math.max(8, top);

    return { left, top, width: tipW };
  };


  return (
    <div
      ref={containerRef}
      className="av-fullbleed"
      style={{
        position: 'relative',
        margin: '-28px -32px',
        minHeight: 'calc(100vh - 64px)',
        backgroundImage: "url('/assets/extrasAgro/imagenFondo2.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        fontFamily: "'DM Sans', sans-serif",
        userSelect: 'none',
      }}
    >
      {/* ── Global keyframes ── */}
      <style>{`
        @keyframes av-ping   { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.6);opacity:0} }
        @keyframes av-fadein { from{opacity:0;transform:translateY(5px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes av-zone   { from{opacity:0;transform:scale(.9)} to{opacity:1;transform:scale(1)} }
        @keyframes av-stripe {
          0%  { background-position: 0 0; }
          100%{ background-position: 28px 28px; }
        }
        .av-dot-wrap {
          position:absolute; background:none; border:none;
          padding:0; outline:none;
          transform:translate(-50%,-50%);
          cursor:default;
        }
        @media(hover:hover){ .av-dot-wrap { cursor:crosshair; } }

        /* ── Mobile header compact ── */
        @media (max-width: 767px) {
          .av-header      { padding: 14px 16px 0 !important; gap: 8px !important; flex-direction: column !important; }
          .av-header-left { max-width: 100% !important; }
          .av-pill-badge  { margin-bottom: 6px !important; padding: 3px 10px !important; }
          .av-pill-badge span:first-child { font-size: 9.5px !important; }
          .av-main-title  { font-size: 22px !important; }
          .av-main-desc   { display: none !important; }
          .av-legend-wrap { flex-direction: row !important; align-items: center !important; gap: 6px !important; }
          .av-legend-pill { padding: 4px 9px !important; font-size: 10.5px !important; }
          .av-hint        { padding: 6px 14px !important; font-size: 10.5px !important; bottom: 12px !important; }
        }
      `}</style>

      {/* ── Dark gradient overlay ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'linear-gradient(180deg,rgba(0,0,0,.5) 0%,rgba(0,0,0,.1) 40%,rgba(0,0,0,.05) 65%,rgba(0,0,0,.38) 100%)',
      }} />

      {/* ════════════════════════════
          ZONE OVERLAYS — all white
      ════════════════════════════ */}
      {POINTS.map(pt => {
        if (visibleId !== pt.id) return null;
        return (
          <div
            key={`zone-${pt.id}`}
            style={{
              position: 'absolute',
              left:   pt.zone.x,
              top:    pt.zone.y,
              width:  pt.zone.width,
              height: pt.zone.height,
              borderRadius: pt.zone.borderRadius,
              transform: `rotate(${pt.zone.rotate ?? 0}deg)`,
              border: '1.5px solid rgba(255,255,255,0.6)',
              backgroundImage: `
                linear-gradient(45deg,
                  rgba(255,255,255,0.06) 25%, transparent 25%,
                  transparent 50%, rgba(255,255,255,0.06) 50%,
                  rgba(255,255,255,0.06) 75%, transparent 75%, transparent
                ),
                radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, transparent 70%)
              `,
              backgroundSize: '14px 14px, cover',
              animation: 'av-zone .2s cubic-bezier(.22,1,.36,1) forwards, av-stripe 1.6s linear infinite',
              boxShadow: '0 0 20px rgba(255,255,255,0.15), inset 0 0 18px rgba(255,255,255,0.05)',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* ════════════════════════════
          DOT MARKERS
      ════════════════════════════ */}
      {POINTS.map((pt, idx) => {
        const isLit = visibleId === pt.id;
        const icon  = pt.status === 'healthy' ? '✓' : '✕';
        return (
          <div
            key={pt.id}
            id={pt.id}
            className="av-dot-wrap"
            style={{ left: pt.dotX, top: pt.dotY, zIndex: 10 }}
            onMouseEnter={e => onMouseEnter(e, pt.id)}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onTouchStart={e => onTap(e, pt.id)}
            onClick={e => onTap(e, pt.id)}
            role="button"
            aria-label={pt.label}
          >
            {/* Ping pulse ring */}
            <span style={{
              position: 'absolute', inset: '-12px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              animation: `av-ping 2.4s ease-out infinite`,
              animationDelay: `${idx * 0.3}s`,
            }} />
            {/* Outer ring */}
            <span style={{
              position: 'absolute', inset: '-5px', borderRadius: '50%',
              border: `1.5px solid ${isLit ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)'}`,
              boxShadow: isLit ? '0 0 14px rgba(255,255,255,0.4)' : 'none',
              transition: 'all .2s',
            }} />
            {/* Core circle */}
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: '50%',
              background: isLit ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.45)',
              border: `2px solid ${isLit ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.6)'}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              color: '#fff',
              fontSize: 12, fontWeight: 800,
              backdropFilter: 'blur(4px)',
              transition: 'all .2s',
            }}>
              {icon}
            </span>
          </div>
        );
      })}

      {/* ════════════════════════════
          MINI-CARD  (hover / tap)
      ════════════════════════════ */}
      {visiblePoint && (() => {
        const cardStyle = getMiniCardStyle();
        const isHealthy = visiblePoint.status === 'healthy';
        return (
          <div
            key={`tip-${visiblePoint.id}`}
            onClick={() => { if (isTouch) setVisibleId(null); }}
            style={{
              position: 'absolute',
              left: cardStyle.left,
              top:  cardStyle.top,
              width: cardStyle.width,
              zIndex: 40,
              background: 'rgba(10,10,10,0.90)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 14,
              overflow: 'hidden',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)',
              pointerEvents: isTouch ? 'auto' : 'none',
              animation: 'av-fadein .18s cubic-bezier(.22,1,.36,1) forwards',
              cursor: isTouch ? 'pointer' : 'default',
            }}
          >
            {/* Top white line */}
            <div style={{
              height: 2,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
            }} />

            {/* Thumbnail */}
            <div style={{ position: 'relative', height: 110, overflow: 'hidden' }}>
              <img
                src={visiblePoint.thumbnail}
                alt={visiblePoint.label}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* Fade to card bg */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(10,10,10,0.88) 100%)',
              }} />
              {/* Status pill */}
              <span style={{
                position: 'absolute', top: 8, left: 8,
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '3px 9px', borderRadius: 20,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                fontSize: 9, fontWeight: 700, letterSpacing: 1.1,
                color: '#fff', textTransform: 'uppercase',
              }}>
                {isHealthy ? '✓' : '✕'}&nbsp;{isHealthy ? 'Saludable' : 'Alerta'}
              </span>
            </div>

            {/* Text content */}
            <div style={{ padding: '10px 14px 14px' }}>
              <p style={{
                fontSize: 12.5, fontWeight: 700, color: '#fff',
                margin: '0 0 4px', lineHeight: 1.3,
              }}>
                {visiblePoint.label}
              </p>
              <p style={{
                fontSize: 10.5, color: 'rgba(255,255,255,0.58)',
                margin: '0 0 6px', lineHeight: 1.45,
              }}>
                {visiblePoint.shortDesc}
              </p>
              {!isHealthy && (
                <p style={{
                  fontSize: 10, color: 'rgba(255,255,255,0.42)',
                  margin: 0, fontStyle: 'italic', lineHeight: 1.35,
                }}>
                  🔬 {visiblePoint.pathogen}
                </p>
              )}
            </div>
          </div>
        );
      })()}

      {/* ════════════════════════════
          HEADER
      ════════════════════════════ */}
      <div
        className="av-content av-header"
        style={{
          position: 'relative', zIndex: 5,
          padding: '28px 28px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        {/* Left: title block */}
        <div className="av-header-left">
          {/* Pill badge */}
          <div
            className="av-pill-badge"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: 20, padding: '4px 13px', marginBottom: 10,
            }}
          >
            <span style={{
              fontSize: 10.5, color: 'rgba(255,255,255,0.8)',
              fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
            }}>
              IA Visual · Variedad Biloxi
            </span>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#fff', opacity: 0.8,
              boxShadow: '0 0 5px rgba(255,255,255,0.6)',
            }} />
          </div>

          <h1
            className="av-title av-main-title"
            style={{
              fontSize: 38, fontWeight: 700, margin: 0,
              color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.1,
              textShadow: '0 2px 16px rgba(0,0,0,0.5)',
            }}
          >
            Diagnóstico Visual
          </h1>
          <p
            className="av-desc av-main-desc"
            style={{
              fontSize: 13.5, margin: '7px 0 0',
              color: 'rgba(255,255,255,0.7)', fontWeight: 300,
              maxWidth: 360, lineHeight: 1.5,
              textShadow: '0 1px 6px rgba(0,0,0,0.4)',
            }}
          >
            Pasa el cursor — o toca — cada punto para inspeccionar el estado fitosanitario.
          </p>
        </div>

        {/* Right: legend */}
        <div
          className="av-legend-wrap"
          style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}
        >
          {[
            { icon: '✓', label: 'Saludable', count: POINTS.filter(p => p.status === 'healthy').length },
            { icon: '✕', label: 'Alerta',    count: POINTS.filter(p => p.status === 'danger').length },
          ].map(item => (
            <div
              key={item.label}
              className="av-legend-pill"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '4px 11px', borderRadius: 20,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(10px)',
                fontSize: 11.5, fontWeight: 600, color: '#fff',
                letterSpacing: 0.2,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{
                width: 18, height: 18, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.14)',
                border: '1.5px solid rgba(255,255,255,0.45)',
                fontSize: 9.5, fontWeight: 800, flexShrink: 0,
              }}>
                {item.icon}
              </span>
              {item.label} ({item.count})
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom hint ── */}
      <div
        className="av-hint"
        style={{
          position: 'absolute', bottom: 18, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(0,0,0,0.35)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 30, padding: '7px 16px',
          backdropFilter: 'blur(10px)',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontSize: isMobile ? 12 : 13 }}></span>
        <span style={{ fontSize: isMobile ? 10.5 : 11.5, color: 'rgba(255,255,255,0.65)', fontWeight: 400 }}>
          {isMobile ? 'Toca un punto para el diagnóstico' : 'Pasa el cursor o toca un punto para el diagnóstico'}
        </span>
      </div>
    </div>
  );
};
