# AgroMayia — Dashboard (Frontend)

Dashboard de inteligencia agrícola para monitoreo de cultivo de **arándanos** (variedad Biloxi, temporada 2026). Modelo extrapolable a otros cultivos. Asistente IA integrado: **MAYIA** (Gemini 2.5 Flash).

## Stack

React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · Recharts (gráficos) · lucide-react (íconos).

```bash
npm install
npm run dev      # servidor de desarrollo (Vite)
npm run build    # tsc + build de producción
npm run lint     # ESLint
```

## Estructura

```
src/
├── App.tsx                 # Shell: navegación por estado entre secciones
├── config/branding.ts      # Colores, logos, métricas y config de IA
├── types/agro.types.ts     # Tipos compartidos del dominio agrícola
├── components/             # UI reutilizable (Card, StatCard, Badge, Sidebar, Header, charts)
└── features/               # Una carpeta por sección, cada una con su data/*.dummy.ts
```

> Los datos hoy son **mock** (`*.dummy.ts`). La única integración real con backend es el chat de MAYIA (`fetch('/api/chat/message')` en `Herocard.tsx`).

## Secciones del sistema

La navegación se controla desde el `Sidebar`. Hay 7 secciones:

### 1. Resumen — *Panel principal*
Vista de inicio con el estado global del cultivo.
- **KPIs principales** (StatCards): indicadores clave de la temporada.
- **VPD 24 h**: gráfico de área del Déficit de Presión de Vapor con rango óptimo (0.8–1.5 kPa).
- **Alertas activas**: lista de alertas sin resolver con prioridad y plan de contingencia.
- **HeroCard de MAYIA**: asistente IA conversacional (chat real con el backend).
- **Producción semanal vs benchmark**: barras de kg/planta de las últimas 8 semanas.

### 2. Fenología — *Desarrollo vegetativo*
Etapa actual de la planta y crecimiento. (El manejo de plagas/virus/hongos vive en Control Biológico.)
- **Timeline de etapas fenológicas**: dormancia → brotación → floración → cuajado → maduración → cosecha, con la etapa en curso resaltada.
- **Clima histórico**: líneas de temperatura máx/mín, humedad y VPD.
- **Alertas de fenología y control biológico**: protocolos preventivos/correctivos.

### 3. Riego y Nutrición — *Gestión hídrica*
Monitoreo del esquema de nutrición (EC/PPM y pH) en agua, sustrato y drenaje.
- **KPIs de riego/nutrición**.
- **pH — Riego vs Sustrato vs Drenaje**: tres puntos clave con rango óptimo marcado.
- **EC — Entrada vs Drenaje** (mS/cm).
- **Tabla: valores ideales por etapa fenológica** (EC y pH objetivo).
- **Tabla: sinergias y antagonismos** — ventana de absorción de nutrientes por pH.
- **Tabla: LMR** — Límites Máximos de Residuos por mercado de exportación.

### 4. Biometría — *Medición de planta*
Crecimiento de tallo, muestreo en patrón Z y análisis de laboratorio. (Maquia captura hasta 4 fotos por baya.)
- **KPIs biométricos**.
- **Crecimiento de tallo semanal**: promedio, rango min-max y benchmark.
- **Distribución de medidas**: frecuencia real vs distribución normal esperada.
- **Tabla de muestreo (patrón Z)**: planta, sector, crecimiento, altura y estado.

### 5. Packing — *Empaque y calidad*
Empaque, control de calidad y cadena de frío.
- **KPIs de packing**.
- **Control de calidad por batch**: barras apiladas de causas de rechazo (acidez, tamaño, larva, rasgado).
- **Cadena de frío**: temperatura continua con meta de 0 °C.
- **Historial de lotes**: clamshell, kilos, cajas, temperatura, tasa de rechazo y estado.

### 6. Proyección — *Estimación de cosecha*
Comercialización, curva de producción y estimación de ingreso.
- **KPIs de proyección**.
- **Curva fenológica vs campana de Gauss**: producción real vs curva de referencia.
- **Producción proyectada por mes**: proyectado vs real acumulado.
- **Órdenes de compra**: comercializador, kg, precio/kg, clamshell y estado.

### 7. Análisis Visual — *Diagnóstico IA*
Diagnóstico visual de la planta sobre una imagen interactiva.
- **Imagen con puntos de diagnóstico** superpuestos (overlays por zona).
- Cada punto muestra al hover/tap una **mini-card** con estado (saludable/alerta), miniatura, descripción y patógeno detectado.
- Identifica racimos sanos y focos con riesgo fitosanitario.

## Componentes compartidos

- **`ui/`** — `Card`, `StatCard`, `SectionHeader`, `Badge`.
- **`layout/Sidebar`** — navegación lateral con las 7 secciones.
- **`Header`** — título de sección y notificaciones.
- **`charts/CustomTooltip`** — tooltip unificado para todos los gráficos de Recharts.
- **`modules/dashboardModules/Herocard`** — tarjeta de chat con MAYIA (única conexión real al backend).
