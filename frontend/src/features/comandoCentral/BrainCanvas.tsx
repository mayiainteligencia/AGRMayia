import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

/**
 * Núcleo MAYIA estilo J.A.R.V.I.S. / reactor arc (Iron Man).
 *
 * Presupuesto de rendimiento:
 *  - Los anillos con marcas (ticks) se pre-renderizan UNA vez en sprites y solo se rotan con drawImage.
 *  - Sin `shadowBlur` en el loop (es lo más caro en canvas 2D); el brillo sale de gradientes + 'lighter'.
 *  - Esfera de partículas dibujada por lotes (4 niveles de profundidad = 4 fills, no ~300).
 *  - Posiciones de los clusters (DOM) se miden cada ~300 ms, no cada frame.
 *  - Tope de ~45 fps, DPR máx 1.75, pausa si la pestaña está oculta o el canvas fuera de pantalla.
 *  - Respeta prefers-reduced-motion.
 */
export interface BrainHandle { boost: () => void; }

const GREEN = '45,106,79';
const MINT = '82,183,136';
const CYAN = '14,140,170';
const BERRY = '92,61,143';

const N_POINTS = 210;
const FRAME_MS = 1000 / 45;

type Sprite = HTMLCanvasElement;

function makeSprite(size: number, dpr: number, paint: (c: CanvasRenderingContext2D, s: number) => void): Sprite {
  const cv = document.createElement('canvas');
  cv.width = Math.ceil(size * dpr);
  cv.height = Math.ceil(size * dpr);
  const c = cv.getContext('2d')!;
  c.scale(dpr, dpr);
  c.translate(size / 2, size / 2);
  paint(c, size);
  return cv;
}

/** Anillo exterior con 60 marcas limpias y estilizadas (evita saturación). */
function paintTicks(R: number) {
  return (c: CanvasRenderingContext2D) => {
    const r0 = R * 1.20;
    c.lineCap = 'round';
    const total = 60;
    for (let i = 0; i < total; i++) {
      const a = (i / total) * Math.PI * 2;
      const long = i % 5 === 0;
      const len = long ? R * 0.040 : R * 0.020;
      c.strokeStyle = long ? `rgba(${CYAN},0.40)` : `rgba(${GREEN},0.16)`;
      c.lineWidth = long ? 1.1 : 0.7;
      c.beginPath();
      c.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
      c.lineTo(Math.cos(a) * (r0 + len), Math.sin(a) * (r0 + len));
      c.stroke();
    }
    c.strokeStyle = `rgba(${GREEN},0.16)`;
    c.lineWidth = 0.8;
    c.beginPath(); c.arc(0, 0, r0 - 2, 0, Math.PI * 2); c.stroke();
  };
}

/** Anillo de segmentos sutiles tipo "HUD" de precisión. */
function paintSegments(R: number) {
  return (c: CanvasRenderingContext2D) => {
    c.lineCap = 'round';
    const r = R * 1.08;
    const segs = [
      [0.05, 0.38, 2, CYAN, 0.40],
      [0.48, 0.62, 2, GREEN, 0.35],
      [0.70, 0.96, 2, CYAN, 0.40],
    ] as const;
    for (const [s, e, w, col, al] of segs) {
      c.strokeStyle = `rgba(${col},${al})`;
      c.lineWidth = w;
      c.beginPath(); c.arc(0, 0, r, s * Math.PI * 2, e * Math.PI * 2); c.stroke();
    }
    c.strokeStyle = `rgba(${MINT},0.16)`;
    c.lineWidth = 0.8;
    c.setLineDash([2, 5]);
    c.beginPath(); c.arc(0, 0, r - 6, 0, Math.PI * 2); c.stroke();
    c.setLineDash([]);
  };
}

/** Dibuja un fruto rojo 3D con volumen esférico, halo y brillo especular nítido. */
function drawSingleRedBerry(
  c: CanvasRenderingContext2D,
  bx: number,
  by: number,
  br: number,
  alpha = 1
) {
  c.save();
  c.globalAlpha = Math.max(0.15, Math.min(1, alpha));

  // Halo suave
  const hg = c.createRadialGradient(bx, by, br * 0.3, bx, by, br * 2.2);
  hg.addColorStop(0, 'rgba(230, 57, 70, 0.42)');
  hg.addColorStop(0.6, 'rgba(230, 57, 70, 0.08)');
  hg.addColorStop(1, 'rgba(230, 57, 70, 0)');
  c.fillStyle = hg;
  c.beginPath();
  c.arc(bx, by, br * 2.2, 0, Math.PI * 2);
  c.fill();

  // Esfera 3D con iluminación focal
  const bg = c.createRadialGradient(bx - br * 0.32, by - br * 0.32, br * 0.08, bx, by, br);
  bg.addColorStop(0, '#FFE0E6');
  bg.addColorStop(0.22, '#FF3366');
  bg.addColorStop(0.65, '#B80036');
  bg.addColorStop(1, '#4A0014');
  c.fillStyle = bg;
  c.beginPath();
  c.arc(bx, by, br, 0, Math.PI * 2);
  c.fill();

  // Coronita / cáliz oscuro
  c.fillStyle = '#2A000A';
  c.beginPath();
  c.arc(bx, by + br * 0.22, br * 0.20, 0, Math.PI * 2);
  c.fill();

  // Brillo especular nítido
  c.fillStyle = 'rgba(255, 255, 255, 0.95)';
  c.beginPath();
  c.arc(bx - br * 0.35, by - br * 0.35, br * 0.26, 0, Math.PI * 2);
  c.fill();

  c.restore();
}

export const BrainCanvas = forwardRef<BrainHandle, { onPulse: () => void }>(({ onPulse }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spinRef = useRef(0);
  const ripples = useRef<number[]>([]);
  const tRef = useRef(0);
  const rotYRef = useRef(0);
  const spin360RemainingRef = useRef(0);

  useImperativeHandle(ref, () => ({
    boost: () => {
      spinRef.current = Math.min(spinRef.current + 1.2, 2.4);
      ripples.current.push(tRef.current);
      // Giro 360° completo en 3D en cada alerta
      spin360RemainingRef.current += Math.PI * 2;
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let w = 0, h = 0, R = 0, raf = 0;
    let visible = true;
    let last = 0;
    let sprites: { ticks: Sprite; segs: Sprite } | null = null;

    // Esfera de partículas (Fibonacci)
    const pts: { x: number; y: number; z: number }[] = [];
    const gr = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N_POINTS; i++) {
      const y = 1 - (i / (N_POINTS - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      pts.push({ x: Math.cos(gr * i) * r, y, z: Math.sin(gr * i) * r });
    }

    const buildSprites = () => {
      sprites = {
        ticks: makeSprite(R * 3.1, dpr, paintTicks(R)),
        segs: makeSprite(R * 3.1, dpr, paintSegments(R)),
      };
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth; h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(Math.min(w, h) * 0.205, 118);
      buildSprites();
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);

    const drawSprite = (s: Sprite, cx: number, cy: number, rot: number, alpha = 1) => {
      const sz = s.width / dpr;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.drawImage(s, -sz / 2, -sz / 2, sz, sz);
      ctx.restore();
    };

    const hasConic = typeof ctx.createConicGradient === 'function';

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (document.hidden || !visible || !sprites) return;
      if (now - last < FRAME_MS) return;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      const speedBase = reduced ? 0.06 : 0.36;
      spinRef.current *= Math.pow(0.94, dt * 60);
      const t = tRef.current + (speedBase + spinRef.current) * dt;
      tRef.current = t;

      // ── Giro 3D de la berry (360° en cada alerta + suave continuo) ──
      if (spin360RemainingRef.current > 0) {
        const spinSpeed = Math.max(6.2, spin360RemainingRef.current * 4.6);
        const step = Math.min(spin360RemainingRef.current, spinSpeed * dt);
        rotYRef.current += step;
        spin360RemainingRef.current -= step;
      } else {
        rotYRef.current += (reduced ? 0.08 : 0.45) * dt;
      }
      const rotY = rotYRef.current;
      const rotX = 0.38 + Math.sin(t * 1.5) * 0.08;

      const cx = w / 2, cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      // ── Halo ambiental suave ──
      ctx.globalCompositeOperation = 'source-over';
      let g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.5);
      g.addColorStop(0, `rgba(${BERRY},0.08)`);
      g.addColorStop(0.45, `rgba(${MINT},0.04)`);
      g.addColorStop(1, `rgba(${MINT},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // ── Barrido tipo radar (conic sutil) ──
      if (hasConic && !reduced) {
        const sweep = ctx.createConicGradient(t * 1.6, cx, cy);
        sweep.addColorStop(0, `rgba(${CYAN},0.0)`);
        sweep.addColorStop(0.80, `rgba(${CYAN},0.0)`);
        sweep.addColorStop(0.985, `rgba(${CYAN},0.12)`);
        sweep.addColorStop(1, `rgba(${CYAN},0.0)`);
        ctx.fillStyle = sweep;
        ctx.beginPath(); ctx.arc(cx, cy, R * 1.20, 0, Math.PI * 2); ctx.fill();
      }

      // ── Anillos HUD (sprites rotando en sentidos opuestos) ──
      drawSprite(sprites.ticks, cx, cy, t * 0.35, 0.90);
      drawSprite(sprites.segs, cx, cy, -t * 0.9);

      // ── Elipses orbitales + electrones ──
      ctx.lineWidth = 0.8;
      const orbits = [
        { a: 0.98, b: 0.36, sp: 0.7, ph: 0.0, c: CYAN },
        { a: 0.38, b: 0.98, sp: -0.5, ph: 0.5, c: GREEN },
        { a: 0.92, b: 0.68, sp: 0.4, ph: 1.2, c: MINT },
      ];
      for (const o of orbits) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * o.sp + o.ph);
        ctx.beginPath();
        ctx.ellipse(0, 0, R * o.a, R * o.b, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${o.c},0.16)`;
        ctx.stroke();
        const ex = Math.cos(t * 2 + o.ph) * R * o.a;
        const ey = Math.sin(t * 2 + o.ph) * R * o.b;
        const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 6);
        eg.addColorStop(0, 'rgba(255,255,255,1)');
        eg.addColorStop(0.35, `rgba(${o.c},0.75)`);
        eg.addColorStop(1, `rgba(${o.c},0)`);
        ctx.fillStyle = eg;
        ctx.beginPath(); ctx.arc(ex, ey, 6, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // ── Esfera de partículas (4 lotes por profundidad) ──
      const Rs = R * 0.70;
      const fov = Rs * 3.2;
      const cosY = Math.cos(t), sinY = Math.sin(t);
      const tilt = 0.5, cosT = Math.cos(tilt), sinT = Math.sin(tilt);
      const buckets: number[][] = [[], [], [], []];
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const x = p.x * cosY + p.z * sinY;
        const z = -p.x * sinY + p.z * cosY;
        const y2 = p.y * cosT - z * sinT;
        const z2 = p.y * sinT + z * cosT;
        const s = fov / (fov + z2 * Rs);
        const d = (z2 + 1) / 2;
        const b = Math.min(3, Math.floor(d * 4));
        buckets[b].push(cx + x * Rs * s, cy + y2 * Rs * s, d);
      }
      for (let b = 0; b < 4; b++) {
        const arr = buckets[b];
        if (!arr.length) continue;
        const depth = (b + 0.5) / 4;
        ctx.fillStyle = b > 1 ? `rgba(${CYAN},${0.25 + depth * 0.45})` : `rgba(${GREEN},${0.15 + depth * 0.35})`;
        ctx.beginPath();
        const rad = 0.7 + depth * 1.3;
        for (let i = 0; i < arr.length; i += 3) {
          ctx.moveTo(arr[i] + rad, arr[i + 1]);
          ctx.arc(arr[i], arr[i + 1], rad, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // ── Anillo y frutos rojos en órbita 3D (con profundidad y oclusión física) ──
      const rOrbit = R * 0.58;
      const nBerries = 12;
      const tiltOrbX = 0.52; // inclinación 3D hacia el espectador
      const tiltOrbZ = 0.26;
      const cosOX = Math.cos(tiltOrbX), sinOX = Math.sin(tiltOrbX);
      const cosOZ = Math.cos(tiltOrbZ), sinOZ = Math.sin(tiltOrbZ);

      interface Berry3D {
        x: number;
        y: number;
        z: number;
        r: number;
        alpha: number;
      }
      const berries3D: Berry3D[] = [];
      for (let i = 0; i < nBerries; i++) {
        const a = (i / nBerries) * Math.PI * 2 + t * 0.45;
        const ux = Math.cos(a) * rOrbit;
        const uy = Math.sin(a) * rOrbit;
        const x1 = ux;
        const y1 = uy * cosOX;
        const z1 = uy * sinOX;
        const px = cx + (x1 * cosOZ - y1 * sinOZ);
        const py = cy + (x1 * sinOZ + y1 * cosOZ);
        const pz = z1;
        const pScale = 1 + (pz / rOrbit) * 0.28;
        berries3D.push({
          x: px,
          y: py,
          z: pz,
          r: R * 0.054 * pScale,
          alpha: pz < 0 ? 0.65 : 1.0,
        });
      }

      // ── 1. Arco trasero de la órbita + Frutos que pasan POR DETRÁS (Z < 0) ──
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tiltOrbZ);
      ctx.strokeStyle = 'rgba(230, 57, 70, 0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, rOrbit, rOrbit * cosOX, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      for (const b of berries3D) {
        if (b.z < 0) {
          drawSingleRedBerry(ctx, b.x, b.y, b.r, b.alpha);
        }
      }

      // ── 2. NÚCLEO: ARÁNDANO 3D ESPECTACULAR CON VOLUMEN, GIRO 360° Y GRID HOLOGRÁFICO ──
      const feed = Math.pow(Math.max(0, Math.sin((tRef.current / 0.36) * ((Math.PI * 2) / 2.8) - 1.2)), 4);
      const bs = 1 + Math.sin(t * 3) * 0.035 + feed * 0.06;
      const rb = R * 0.33 * bs; // radio del arándano 3D (ampliado y protagónico)

      // Halo biológico / energético exterior
      g = ctx.createRadialGradient(cx, cy, rb * 0.6, cx, cy, rb * 2.2);
      g.addColorStop(0, `rgba(${BERRY},${0.32 + feed * 0.35})`);
      g.addColorStop(0.5, `rgba(${CYAN},${0.10 + feed * 0.12})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, rb * 2.2, 0, Math.PI * 2); ctx.fill();

      // Sombra ambiental sutil inferior para dar peso y volumen 3D
      const shadowG = ctx.createRadialGradient(cx + rb * 0.12, cy + rb * 0.22, rb * 0.2, cx, cy, rb * 1.3);
      shadowG.addColorStop(0, 'rgba(10, 5, 25, 0.45)');
      shadowG.addColorStop(0.7, 'rgba(10, 5, 25, 0.15)');
      shadowG.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = shadowG;
      ctx.beginPath(); ctx.arc(cx, cy, rb * 1.3, 0, Math.PI * 2); ctx.fill();

      // Esfera 3D base con volumen de alta definición e iluminación fija superior-izquierda
      const sg = ctx.createRadialGradient(cx - rb * 0.34, cy - rb * 0.38, rb * 0.05, cx, cy, rb);
      sg.addColorStop(0, '#C4B5FD');    // Reflejo luminoso lavanda
      sg.addColorStop(0.18, '#8B5CF6'); // Violeta brillante
      sg.addColorStop(0.48, '#4C1D95'); // Azul violáceo profundo
      sg.addColorStop(0.78, '#211044'); // Sombra esférica densa
      sg.addColorStop(1, '#0B0518');    // Terminador profundo
      ctx.fillStyle = sg;
      ctx.beginPath(); ctx.arc(cx, cy, rb, 0, Math.PI * 2); ctx.fill();

      // Reactor Arc bioluminiscente interior (corazón bio-tecnológico que pulsa)
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, rb * 0.88);
      cg.addColorStop(0, `rgba(52, 211, 153, ${0.40 + feed * 0.35})`); // Verde esmeralda agro
      cg.addColorStop(0.45, `rgba(139, 92, 246, ${0.22 + feed * 0.18})`); // Violeta
      cg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = cg;
      ctx.beginPath(); ctx.arc(cx, cy, rb, 0, Math.PI * 2); ctx.fill();

      // ── Grid holográfico 3D sobre la curvatura de la esfera (meridianos y paralelos rotando) ──
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, rb - 0.5, 0, Math.PI * 2); ctx.clip();

      // 4 meridianos que giran en 3D sobre la esfera con rotY
      const nMeridians = 4;
      for (let m = 0; m < nMeridians; m++) {
        const lAngle = (m / nMeridians) * Math.PI + rotY;
        const cosL = Math.cos(lAngle);
        if (cosL > -0.25) { // Cara visible hacia el usuario
          const wMer = Math.max(0.8, rb * Math.abs(cosL));
          ctx.strokeStyle = `rgba(110, 231, 183, ${0.12 + 0.32 * Math.max(0, cosL)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(cx, cy, wMer, rb, rotX * 0.25, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // 2 paralelos (latitud norte y sur)
      const latOff = rb * 0.42;
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.28)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.ellipse(cx, cy - latOff * Math.cos(rotX), rb * 0.90, rb * 0.24, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy + latOff * Math.cos(rotX), rb * 0.90, rb * 0.24, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      // Capa bloom cerosa (cutícula aterciopelada del arándano)
      const bg = ctx.createRadialGradient(cx + rb * 0.20, cy + rb * 0.20, rb * 0.1, cx, cy, rb);
      bg.addColorStop(0, 'rgba(180, 200, 255, 0)');
      bg.addColorStop(0.70, 'rgba(165, 185, 255, 0.16)');
      bg.addColorStop(1, 'rgba(175, 195, 255, 0.40)');
      ctx.fillStyle = bg;
      ctx.beginPath(); ctx.arc(cx, cy, rb, 0, Math.PI * 2); ctx.fill();

      // Fresnel rim lighting (luz de borde perimetral que define la silueta 3D esférica)
      const fg = ctx.createRadialGradient(cx, cy, rb * 0.72, cx, cy, rb);
      fg.addColorStop(0, 'rgba(0,0,0,0)');
      fg.addColorStop(0.70, 'rgba(167, 139, 250, 0.12)');
      fg.addColorStop(0.92, 'rgba(196, 181, 253, 0.55)');
      fg.addColorStop(1, 'rgba(255, 255, 255, 0.85)');
      ctx.fillStyle = fg;
      ctx.beginPath(); ctx.arc(cx, cy, rb, 0, Math.PI * 2); ctx.fill();

      // ── Nodos de biometría que giran sobre la superficie 3D de la esfera ──
      const cosRY = Math.cos(rotY), sinRY = Math.sin(rotY);
      const cosRX = Math.cos(rotX), sinRX = Math.sin(rotX);

      // Micro-sensores 3D girando sobre el arándano
      for (let m = 0; m < 14; m++) {
        const uLat = (m % 2 === 0 ? 0.34 : -0.26);
        const uLong = (m / 7) * Math.PI * 2;
        const rSurf = Math.sqrt(Math.max(0, 1 - uLat * uLat));
        const ux = Math.cos(uLong) * rSurf;
        const uy = uLat;
        const uz = Math.sin(uLong) * rSurf;

        // Rotar en 3D
        const x1 = ux * cosRY + uz * sinRY;
        const z1 = -ux * sinRY + uz * cosRY;
        const y2 = uy * cosRX - z1 * sinRX;
        const z2 = uy * sinRX + z1 * cosRX;

        if (z2 > 0.05) { // Solo visibles en la cara frontal
          const px = cx + x1 * rb;
          const py = cy - y2 * rb;
          const pSize = 1.0 + z2 * 1.8;
          ctx.fillStyle = `rgba(160, 240, 200, ${0.30 + z2 * 0.65})`;
          ctx.beginPath(); ctx.arc(px, py, pSize, 0, Math.PI * 2); ctx.fill();
          if (z2 > 0.65) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath(); ctx.arc(px, py, pSize * 0.45, 0, Math.PI * 2); ctx.fill();
          }
        }
      }

      // ── CORONITA DEL ARÁNDANO EN 3D (Cáliz de 5 puntas girando 360°) ──
      // Vector del polo de la coronita
      const poleX = 0;
      const poleY = 0.88;
      const poleZ = 0.47;
      const p1x = poleX * cosRY + poleZ * sinRY;
      const p1z = -poleX * sinRY + poleZ * cosRY;
      const p2y = poleY * cosRX - p1z * sinRX;
      const p2z = poleY * sinRX + p1z * cosRX;
      const pLen = Math.sqrt(p1x * p1x + p2y * p2y + p2z * p2z) || 1;
      const nx = p1x / pLen, ny = p2y / pLen, nz = p2z / pLen;

      // Si nz > -0.18, la coronita está en el lado visible del arándano
      if (nz > -0.18) {
        const kcx = cx + nx * rb * 0.94;
        const kcy = cy - ny * rb * 0.94;
        const visFactor = Math.max(0.15, (nz + 0.18) / 1.18);
        const kRadius = rb * 0.38 * visFactor;

        // Base oscura hundida del cáliz
        ctx.fillStyle = '#140A30';
        ctx.beginPath();
        ctx.ellipse(kcx, kcy, kRadius * 0.75, kRadius * 0.48 * (0.6 + 0.4 * Math.abs(nz)), rotY, 0, Math.PI * 2);
        ctx.fill();

        // 5 puntas del cáliz en 3D
        ctx.beginPath();
        const ptsCount = 5;
        for (let i = 0; i < ptsCount * 2; i++) {
          const a = rotY + (i * Math.PI) / ptsCount;
          const rCur = (i % 2 === 0 ? kRadius : kRadius * 0.45);
          const px = kcx + Math.cos(a) * rCur;
          const py = kcy + Math.sin(a) * rCur * (0.55 + 0.45 * Math.abs(nz));
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = '#231454';
        ctx.fill();
        ctx.strokeStyle = `rgba(180, 160, 255, ${0.45 * visFactor})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Núcleo biocelular en el centro del cáliz
        ctx.fillStyle = `rgba(130, 225, 180, ${0.7 * visFactor})`;
        ctx.beginPath();
        ctx.arc(kcx, kcy, kRadius * 0.18, 0, Math.PI * 2);
        ctx.fill();
      }

      // Brillo especular fijo superior-izquierdo (Gloss primario de alta definición)
      ctx.save();
      ctx.translate(cx - rb * 0.38, cy - rb * 0.44);
      ctx.rotate(-0.65);
      const hg = ctx.createRadialGradient(0, 0, 0, 0, 0, rb * 0.35);
      hg.addColorStop(0, 'rgba(255,255,255,0.96)');
      hg.addColorStop(0.35, 'rgba(235,245,255,0.50)');
      hg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = hg;
      ctx.beginPath(); ctx.ellipse(0, 0, rb * 0.35, rb * 0.18, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Brillo secundario de rebote inferior-derecho (Luz ambiental agro esmeralda)
      ctx.save();
      ctx.translate(cx + rb * 0.32, cy + rb * 0.36);
      ctx.rotate(0.55);
      const bgBounce = ctx.createRadialGradient(0, 0, 0, 0, 0, rb * 0.28);
      bgBounce.addColorStop(0, 'rgba(110, 231, 183, 0.45)');
      bgBounce.addColorStop(1, 'rgba(110, 231, 183, 0)');
      ctx.fillStyle = bgBounce;
      ctx.beginPath(); ctx.ellipse(0, 0, rb * 0.28, rb * 0.14, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Borde de luz sutil en la silueta 3D
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.arc(cx, cy, rb - 0.7, Math.PI * 0.9, Math.PI * 1.6); ctx.stroke();

      // ── 3. Arco frontal de la órbita + Frutos que pasan POR DELANTE (Z >= 0) ──
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tiltOrbZ);
      ctx.strokeStyle = 'rgba(230, 57, 70, 0.28)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(0, 0, rOrbit, rOrbit * cosOX, 0, 0, Math.PI);
      ctx.stroke();
      ctx.restore();

      for (const b of berries3D) {
        if (b.z >= 0) {
          drawSingleRedBerry(ctx, b.x, b.y, b.r, b.alpha);
        }
      }

      // ── Ondas de pulso ──
      ripples.current = ripples.current.filter(r => t - r < 1.1);
      for (const r of ripples.current) {
        const p = (t - r) / 1.1;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${CYAN},${(1 - p) * 0.6})`;
        ctx.lineWidth = 2;
        ctx.arc(cx, cy, R * (0.3 + p * 1.2), 0, Math.PI * 2);
        ctx.stroke();
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onClick={() => {
        spinRef.current = Math.min(spinRef.current + 1.2, 2.4);
        ripples.current.push(tRef.current);
        spin360RemainingRef.current += Math.PI * 2;
        onPulse();
      }}
      style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
    />
  );
});
BrainCanvas.displayName = 'BrainCanvas';
