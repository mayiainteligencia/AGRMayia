Análisis del Proyecto Frontend AgroMayia
Este documento presenta una radiografía detallada del frontend del sistema AgroMayia, una plataforma de inteligencia agrícola diseñada para optimizar la toma de decisiones en el campo (especialmente adaptada para el cultivo de arándanos Biloxi en la temporada 2026).

# 🏗️ Arquitectura, Organización y Flujo de Datos

## Stack
**Monorepo** con dos aplicaciones independientes:

| App | Tecnologías | Rol |
|-----|-------------|-----|
| `frontend/` | React 19 · TypeScript · Vite · Tailwind v4 · Recharts · lucide-react | Dashboard / centro de mando |
| `backend/`  | Node · Express · MySQL (`mysql2`) · Google Gemini (`@google/generative-ai`) | API del asistente IA MAYIA |

## Organización del repositorio
```
agroMayia/
├── frontend/            App de React (todo lo visual)
│   ├── public/assets/   Imágenes, logos y videos (cámaras IoT en extrasAgro/Iot)
│   └── src/
│       ├── config/      branding · navigation · pages · navContext
│       ├── components/  ui · command · layout · charts · modules
│       ├── features/    una carpeta por sección (opcional data/*.dummy.ts)
│       ├── types/       agro.types.ts
│       └── lib/         utils
└── backend/             API Express
    ├── routes/          chatRoutes · departamentosRoutes · mayiaRoutes
    ├── controllers/     chatController · departamentosController · mayiaController
    ├── services/        geminiService · dbService
    ├── config/          database (pool MySQL) · gemini · empresaConfig
    └── database/        migrate.js · data/demo-data.sql
```

## Cómo se conecta una sección (wiring)
La navegación es **data-driven**; agregar una sección son 3 pasos:

1. **`config/navigation.ts`** — se declara el ítem dentro de un `NAV_GROUP` (`id`, `label`, `icon`, `description`). Esto lo dibuja el `Sidebar`.
2. **`config/pages.tsx`** — se mapea `id → componente` en `PAGE_OVERRIDES`. Lo que **no** está en el mapa cae a `Placeholder` (sección "en desarrollo"). `IMPLEMENTED_IDS` (las llaves de ese mapa) es lo que enciende el **LED verde/rojo** del sidebar.
3. **`features/<seccion>/<Seccion>.tsx`** — el componente de la vista.

`App.tsx` guarda `activeSection` en estado y resuelve el componente. La navegación entre secciones desde cualquier parte se hace con **`useNav()`** (contexto `config/navContext.ts`) — lo usan el botón del Header, los toasts, las tarjetas de Comando Central y los módulos de Control de Decisiones.

## ¿De dónde salen los datos? (importante)
Hoy los datos viven en **tres capas**:

1. **Mock estático (la mayoría)** — cada feature trae su propia data:
   - Secciones antiguas: `features/<x>/data/<x>.dummy.ts`.
   - Secciones nuevas (cedis, clientes, ciberseguridad, noc, etc.): data **inline** dentro del propio `.tsx`.
   - Nada de esto toca el backend; es contenido de demostración.

2. **Simulación "viva" en el frontend** (sensación de tiempo real, sin servidor):
   - `components/command/LiveToasts.tsx` → notificaciones emergentes globales cada 30 s (montado en `App.tsx`).
   - `useLiveFeed` (en `CommandKit.tsx`) → feeds que se autoactualizan cada 4 s.
   - `AgentStrip`, el `tick` de **Control de Decisiones** y el canvas + insights de **Comando Central**.
   - Todo esto se genera con timers/`Math.random` en el cliente y está listo para reemplazarse por datos reales.

3. **Backend real (solo el chat de MAYIA)** — es la única integración viva hoy:
   ```
   HeroCard (voz/texto)
     → POST /api/chat/message   { mensaje, departamento }
       → chatController.enviarMensaje
         → dbService.buscarContextoEnDB   (consulta MySQL → contexto)
         → geminiService.generarRespuestaIA (prompt + Gemini 2.5 Flash)
       ← { respuesta, contexto, timestamp }
     ← se pinta en el modal del HeroCard
   ```
   El backend también expone `/api/departamentos` y un `/health`. La conexión a MySQL se inicializa en `config/database.js` y Gemini en `config/gemini.js` al arrancar (`index.js`).

> Nota: la capa de IA/BD del backend (`geminiService`, `dbService`) todavía arrastra contenido de un proyecto previo y está **pendiente de alinearse al dominio agrícola**; el frontend ya está listo para consumir endpoints agro cuando existan.

## Flujo de datos (vista general)
```
[ features / command kit ]  ──mock / timers──►  UI (Recharts, canvas, HUD)
        │
        └── HeroCard ──HTTP──► Express ──► MySQL (contexto)
                                     └──► Gemini (respuesta) ──► UI
```

## Bloques reutilizables del "centro de mando"
- **`components/command/CommandKit.tsx`** — `AgentStrip`, `LiveFeed`/`useLiveFeed`, `AlertStack`, `Sugerencia` (con confirmación), `FinancialLevers`, `VideoGrid`, `PageTitle`, `LiveDot`.
- **`components/command/LiveToasts.tsx`** — toasts globales con acciones (ir a sección / aceptar-declinar).
- **`config/navContext.ts`** — `useNav()` para navegar sin prop-drilling.

## Variables de entorno (backend)
`backend/.env` (ver `.env.example`): `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `GEMINI_API_KEY`, `PORT`.

## Cómo correr
```bash
# Frontend
cd frontend && npm install && npm run dev      # http://localhost:5173
npm run build                                  # tsc -b + vite build

# Backend
cd backend && npm install && npm run dev       # http://localhost:3001 (nodemon)
npm run migrate                                # carga database/data/demo-data.sql
```

---

📂 Estructura General del Código
El proyecto está construido sobre React (v19), TypeScript y Vite, utilizando Tailwind CSS (v4) junto con componentes estilizados de forma modular.

A continuación se detalla la estructura principal del directorio src/:


src/
├── App.css
├── App.tsx                   # Punto de entrada principal, control de navegación y estado del sidebar móvil
├── assets/                   # Recursos estáticos (logos, imágenes, etc.)
├── main.tsx                  # Inicialización de React y renderizado en DOM
├── index.css                 # Importación de DM Sans, Tailwind, estilos globales y utilidades responsive
├── config/
│   └── branding.ts           # Configuración de colores, metas métricas e IA (MAYIA)
├── types/
│   └── agro.types.ts         # Tipado estricto de TypeScript para la plataforma
├── utils/                    # Funciones de utilidad comunes
├── lib/                      # Configuraciones de clientes o librerías de terceros
├── components/
│   ├── Header.tsx            # Cabecera interactiva con hamburger móvil, notificaciones y perfil
│   ├── charts/
│   │   └── CustomTooltip.tsx # Tooltips personalizados para gráficos de Recharts
│   ├── layout/
│   │   └── Sidebar.tsx       # Barra lateral con drawer deslizante en móvil y micro-animaciones
│   ├── modules/
│   │   └── dashboardModules/
│   │       ├── Herocard.tsx  # Tarjeta principal de IA (MAYIA) con chat interactivo
│   │       └── WelcomeHeader.tsx
│   └── ui/                   # Componentes atómicos de interfaz
│       ├── Badge.tsx
│       ├── Card.tsx
│       ├── SectionHeader.tsx
│       └── StatCard.tsx
└── features/                 # Módulos funcionales basados en dominio
    ├── resumen/              # Vista general (VPD, KPIs, alertas, producción)
    ├── packing/              # Empaque, control de calidad, cadena de frío e historial
    ├── proyeccion/           # Comercialización, curva Gauss de referencia, órdenes
    ├── fenologia/            # Línea de tiempo de etapas Biloxi, clima e historial
    └── biometria/            # Crecimiento de tallo, distribución Gauss y muestreo en Z

🛠️ Tecnologías y Dependencias
El archivo package.json revela un stack moderno de alto rendimiento y tipado estricto:

Dependencias Principales
React y React DOM (^19.2.0): La versión más reciente de la biblioteca para interfaces dinámicas.
Recharts (^3.6.0): Para la representación gráfica avanzada de métricas climáticas, de producción y de biometría.
Lucide React (^0.562.0): Set de iconos vectoriales consistentes y modernos.
Tailwind Merge (^3.4.0) y Clsx (^2.1.1): Utilidades para la combinación eficiente de clases condicionales.
Dependencias de Desarrollo
TypeScript (~5.9.3): Para el tipado estático y robustez del desarrollo.
Vite (^7.2.4): Empaquetador ultra-rápido de última generación.
Tailwind CSS (^4.1.18): Configuración nativa v4 para un diseño visual altamente personalizable y de rápido rendimiento.
PostCSS y Autoprefixer: Procesadores CSS para compatibilidad en todos los navegadores.

🎨 Sistema de Diseño y Branding
La identidad visual está centralizada en branding.ts, permitiendo una parametrización completa del estilo y umbrales de negocio.

Paleta de Colores Curada
Primario (Fondo de Sidebar / Marca): #1A3C2E (Verde Bosque Profundo)
Secundario (Elementos de Éxito / Contraste): #2D6A4F (Verde Esmeralda Oscuro)
Acento (Llamados a la Acción / Hover): #52B788 (Verde Menta Brillante)
Acento Secundario (Datos e IA): #5C3D8F (Púrpura Berry)
Estados de Negocio:
🔴 Peligro: #DC2626
🟡 Advertencia: #D97706
🟢 Éxito: #059669
🔵 Información: #0284C7

Parámetros de Operación
Densidad de Plantación: 9,090 plantas por hectárea.
Altura Meta del Cultivo: 110 cm.
Producción Óptima: 5,000 kg/planta.
Asistente IA: MAYIA (configurada bajo el modelo Gemini 2.5 Flash).

📱 Diseño Responsive
El sistema es completamente adaptable a cualquier dispositivo:

Breakpoints
Mobile (≤ 767px): Sidebar oculto como drawer deslizante, grids de 1 columna, header compacto de 56px con botón hamburger, logo central del header oculto, dropdown de notificaciones fixed al viewport.
Tablet (768–1023px): Grids de 2 columnas para KPIs y gráficos pareados, sidebar visible, logo del header reducido.
Desktop (≥ 1024px): Layout completo con sidebar fijo de 240px y grids de hasta 4 columnas.

Clases de Grid Responsive (index.css)
.rg-4   → repeat(4, 1fr) en desktop | 2 cols en tablet | 1 col en móvil
.rg-3   → repeat(3, 1fr) en desktop | 2 cols en tablet | 1 col en móvil
.rg-2   → 1fr 1fr en desktop/tablet | 1 col en móvil
.rg-2-1 → 2fr 1fr en desktop/tablet | 1 col en móvil
.rg-1-2 → 1fr 2fr en desktop/tablet | 1 col en móvil
.rg-3-2 → 3fr 2fr en desktop/tablet | 1 col en móvil

Sidebar Móvil
En pantallas ≤ 767px el sidebar se convierte en un drawer fixed (position: fixed, z-index: 50) que desliza desde la izquierda con transición de 0.25s. El overlay semitransparente (rgba 0,0,0,0.45) cierra el drawer al tocarlo. El estado sidebarOpen vive en App.tsx y se propaga al Header (botón hamburger) y al Sidebar (isOpen).

Logos Nativos en Resumen
La sección de bienvenida muestra los logos de MAYIA y FLAI apilados verticalmente sobre un fondo negro suave (rgba 0,0,0,0.45) con bordes redondeados. En móvil se reorganizan en fila horizontal de tamaño reducido.

🧩 Módulos Funcionales (Features)
Cada módulo implementa un tablero especializado con datos en tiempo real y componentes interactivos:

1. Resumen (Dashboard Principal)
Monitoreo de VPD (Déficit de Presión de Vapor): Gráfico de área que señala el rango fisiológico óptimo (0.8 - 1.5 kPa) para prevenir estrés hídrico.
Alertas Activas: Panel lateral con prioridades (alta/media/baja) y planes de contingencia sugeridos.
Producción vs Benchmark: Gráfico de barras comparativo de rendimiento semanal real vs. el estándar esperado.
MAYIA: Asistente integrado para interactuar directamente sobre las alertas y la toma de decisiones críticas en el rancho.

2. Packing (Empaque y Cadena de Frío)
Distribución de Causas de Rechazo: Gráfico de barras apiladas que detecta si el producto descartado se debe a acidez, tamaño, larvas, o daño físico (rasgado).
Cadena de Frío: Gráfico de línea con monitoreo de temperatura en tiempo real, vigilando la meta de 0 °C.
Historial de Lotes: Tabla interactiva con identificación de clamshells (6oz / 12oz), kilos totales, cajas, temperatura y estado actual del despacho.

3. Proyección (Comercialización y Planificación)
Curva Fenológica vs Campana de Gauss: Comparativo visual entre la curva matemática de Gauss esperada para la temporada y los kilogramos reales producidos por planta.
Ingresos Proyectados: Seguimiento financiero de pedidos.
Órdenes de Compra: Gestión de contratos con comercializadores, detallando estado, kilos solicitados y precio pactado por kilogramo.

4. Fenología (Ciclo de Vida de la Variedad Biloxi)
Timeline del Cultivo: Rastreo visual de las fases de desarrollo (dormancia, brotación, floración, cuajado, maduración, cosecha).
Historial Climático Cruzado: Gráfico multieje que superpone la temperatura máxima y mínima, porcentaje de humedad relativa y VPD diario.

5. Biometría (Mediciones de Campo)
Crecimiento de Tallo: Líneas de tendencia semanal mostrando el promedio, mínimos y máximos muestreados frente al estándar de crecimiento recomendado.
Curva de Distribución de Medidas: Histograma dinámico de frecuencias reales contra una curva de distribución normal ideal.
Muestreo en Patrón "Z": Registro riguroso de plantas seleccionadas en diagonal dentro del bloque de cultivo para evitar sesgos de borde.

💎 Características Premium y UX
Tipografía Moderna: Implementación de la fuente DM Sans de Google Fonts para mayor legibilidad y elegancia.
Diseño Responsive Completo: Adaptación fluida a móvil, tablet y desktop con drawer sidebar, grids adaptativos y header compacto.
Interactividad Pulida: Transiciones dinámicas en botones y tarjetas en hover, dropdowns accesibles con cierre inteligente al clickear fuera, y micro-animaciones en la barra lateral.
Tipado Estricto: Definiciones completas de tipos e interfaces en agro.types.ts garantizan la prevención de errores en tiempo de desarrollo.

🛰️ Centro de Comando "Vivo" (Command Center)
El dashboard se transformó en un centro de mando tipo Jarvis: agentes IA visibles en cada sección, notificaciones en tiempo real simuladas, sugerencias accionables y diseño premium verde.

Kit reutilizable (src/components/command/CommandKit.tsx)
Un solo módulo provee todos los bloques para mantener el mismo contexto visual en cada sección:
- AgentStrip: barra del agente IA de la sección (nombre BRAIN™, rol, estado y tarea que rota) con efecto scanline verde.
- useLiveFeed + LiveFeed: feed de eventos que se auto-actualiza cada 4s (telemetría "en vivo").
- AlertStack: panel de alertas con severidad (ok / info / warn / crit).
- Sugerencia: cada acción sugerida es un botón; al pulsarlo pide confirmación "¿Estás seguro?" (Sí, aplicar / Cancelar) y muestra "Sugerencia aplicada".
- FinancialLevers: panel de palancas financieras con recomendaciones de MAYIA.
- VideoGrid: grilla de cámaras/drones; los slots con URL fija se reproducen solos (muted, loop, sin controles, no se pausan ni se quitan) con badge "EN VIVO"; los slots vacíos aceptan pegar una URL.
- PageTitle, LiveDot: título de página y punto pulsante reutilizables.

Notificaciones emergentes globales (src/components/command/LiveToasts.tsx)
Montado en App.tsx, visible en cualquier sección (abajo-derecha). Emite un toast a los 3s y luego cada 30s con mensajes de operación (registro de entrada, salida de paquete, venta, cosecha, pago, pedido, empaque). Barra de progreso y auto-cierre a los 7s. Acciones:
- "Ver …→": navega a la sección relacionada (venta→Clientes, salida→Cedís, pago→Agricultores Menores, entrada→Registro de Turno, empaque→Cooler y Empaque, cosecha→Analítica).
- Aceptar / Declinar: en los toasts de nuevo pedido, con confirmación en línea.
También se reemplazaron las notificaciones del Header por temática de cosecha (cadena de frío, plaga, despacho, pedido, cosecha).

Layout de secciones financieras
Las secciones con dinero (Clientes, Cedís, Agricultores Menores) respetan el orden: cuadros KPI arriba → alertas → palancas financieras. Las palancas cubren:
- Deuda / Capital (apalancamiento financiero): usar deuda externa para elevar el ROE mientras su costo sea menor al rendimiento.
- Costo de capital (WACC): optimizar la mezcla deuda/capital para minimizar el WACC.
- Apalancamiento operativo: relación costo fijo/variable que amplifica el efecto de las ventas sobre la utilidad.
- ROA / ROE: la deuda crea valor cuando ROE > ROA (costo de la deuda < rendimiento generado).

🧭 Nuevas secciones del Sidebar
Grupo Cadena de Valor:
- Cedís: centros de distribución, cadena de frío y costo logístico (con palancas financieras).
- Agricultores Menores: red de productores, acopio, anticipos y dispersión de pagos (con palancas financieras).

Grupo Distribución (existente):
- Clientes: directorio de compradores, cartera y cobranza (con palancas financieras).

Grupo Centro de Operaciones TI:
- Ciberseguridad: postura de seguridad, amenazas e incidentes (SOC).
- NOC: centro de operaciones de red — nodos, enlaces y sensores de campo.
- Monitoreo de Aplicación: disponibilidad, latencia y errores (APM).

Grupo Robótica e IoT:
- Robótica e IoT: flota de robots y drones con 6 cámaras en vivo (videos en public/assets/extrasAgro/Iot) y alertas sobrepuestas.

Grupo The Brain™ (existente):
- Inteligencia · Etapa 2: próxima generación de agentes (autonomía, orquestación y gemelo digital) con roadmap por fases.

Nota: los datos de estas secciones son de demostración (mock en el propio componente); el feed y los toasts se simulan en el frontend y están listos para conectarse al backend.

---

# 🗂️ Catálogo de Secciones

Referencia de cada sección del sidebar. En la barra lateral cada ítem muestra un LED:
🟢 **verde = habilitada** (tiene vista real) · 🔴 **rojo = en desarrollo** (cae a Placeholder).

## ✅ Secciones habilitadas (LED verde)

### Principal
- **Panel Principal** — Vista global de la operación: KPIs del rancho, resumen del estado general y accesos rápidos.
- **Control Inteligente de Decisiones** — Centro de mando tipo Jarvis. Por cada sección un módulo con información, alertas emergentes que rotan y una palanca financiera del tema; agente IA visible, sugerencias con confirmación y barra de automatización activable. Header con reloj vivo, KPIs y ticker EN VIVO.
- **Comando Central** — Núcleo IA en 3D (canvas) que gira y pulsa, con flujo de datos entre las tarjetas laterales y el átomo. Al tocar el núcleo da lecturas/sugerencias de MAYIA y navega a la sección relacionada. Tarjetas laterales por sección (glass 3D) que se ocultan/llaman.

### Cadena de Valor
- **Cedís** — Centros de distribución: ocupación, cadena de frío, costo logístico y merma en tránsito. Contiene KPIs, alertas y palancas financieras (WACC, apalancamiento operativo) con recomendaciones de decisión.
- **Agricultores Menores** — Red de productores: acopio, calidad por zona, anticipos y dispersión de pagos. Tabla de liquidación, alertas y palancas financieras (deuda/capital, ROE vs ROA).

### Distribución
- **Cooler y Empaque** — Empaque, control de calidad y cadena de frío: distribución de causas de rechazo, monitoreo de temperatura e historial de lotes/clamshells.
- **Clientes** — Cartera de compradores: ingresos, recompra, cuentas por cobrar y estado de cobranza. Alertas de cartera y palancas financieras (ROE/ROA).

### Inventario
- **Inventario** — Artículos, stock, mínimos y órdenes de compra sugeridas; alertas de faltantes.

### Recursos Humanos
- **Registro de Entrada — Turno** — Suite de Seguridad™ Capa 02: control de acceso facial + PIN y asistencia por turno.

### Finanzas
- **Analítica y Reportes** — Tendencias operativas y financieras: gasto por categoría, kg cosechados por campo, estado de envíos y gráficas.

### Estación Meteorológica
- **Panel Meteorológico** — Condiciones actuales, pronóstico 7 días, VPD y alertas BRAIN™ #W con plan de acción.
- **Termómetro / Barómetro** — Instrumentos ambientales: termómetro, barómetro, altímetro y anemómetro.
- **Historial Climático** — Diario de clima cruzado (temp, humedad, VPD), GDD acumulados y riesgos.

### Laboratorio
- **Panel Laboratorio** — KPIs del laboratorio, tasa de aprobación de calidad y análisis recientes.
- **Análisis de Alimentos** — Inocuidad y cumplimiento normativo (COFEPRIS, NOM-251, FDA) — BRAIN™ #F.

### The Brain™
- **Inteligencia · Etapa 2** — Agentes de próxima generación (predicción de rendimiento, riego autónomo, mercado/precios, gemelo digital) con barras de despliegue y roadmap por fases.

### Centro de Operaciones TI
- **Ciberseguridad** — Postura de seguridad, amenazas bloqueadas e incidentes (SOC): eventos recientes, telemetría en vivo y acciones sugeridas.
- **NOC** — Centro de operaciones de red: nodos, enlaces y sensores de campo, con uptime, latencia y failover.
- **Monitoreo de Aplicación** — APM: disponibilidad, latencia p95, tasa de error y rendimiento por endpoint.

### Robótica e IoT
- **Robótica e IoT** — Vista de los robots y drones y su POV (6 cámaras en vivo), estado de la flota (batería, tarea), alertas sobrepuestas y recomendaciones para toma de decisiones. Los slots vacíos aceptan pegar la URL de nuevas cámaras.

### Seguridad y Cumplimiento
- **Reglas Operativas** — Reglas condición → acción que disparan alertas y sugerencias operativas.

### Agronomía Avanzada
- **Soil-Bio-Vision™** — Jar test 24h y triángulo textural USDA para análisis de suelo.
- **Medición de Agua** — Aforo, lluvia y ETo; consumo vs plan.
- **Instrumentos Ambientales** — Captura manual de instrumentos con interpretación IA.

### Planificación de Campo
- **Calendario de Siembra** — Idoneidad de cultivo × mes por zona.
- **Motor de Probabilidad™** — Probabilidad de siembra por mes y retorno esperado.
- **Planificación Integral de Cosecha** — Gantt de cosecha, proyección y excedente.

### Sensores de Campo
- **Bio-Acoustic Sentinel™** — Audio del campo para detección temprana de plagas.
- **Análisis Visual** — Diagnóstico visual con IA (foto → detección).

## 🚧 Inhabilitados por ahora, ya que están en desarrollo (LED rojo)

Estas secciones ya existen en el menú pero muestran un Placeholder mientras se construyen:

- **Campo:** Cosecha y Siembra · Campos / Ranchos · Plagas y Enfermedades · Listas de Preparación
- **Distribución:** Logística y Envíos · Pedidos
- **Inventario:** Proveedores · Órdenes de Compra · Registro de Merma
- **Recursos Humanos:** Personal · Turnos y Horarios · Capacitación · Nómina · Evaluación de Staff
- **Cumplimiento:** Certificaciones · Registros de Sanidad · Alertas del Sistema
- **Finanzas:** Gastos Operativos
- **Equipo:** Directorio del Equipo · Predicción IA Cosecha
- **Estación Meteorológica:** Alertas Meteorológicas
- **Laboratorio:** Suelo y Aguas · Microbiología · Ingeniería y Agronomía · Informes y Certificados
- **The Brain™:** BRAIN™ Central (Maestro) · BRAIN™ #W Meteorología · BRAIN™ #F Alimentos · BRAIN™ #E Ingeniería
- **Informes y Exportación:** Informes Generales · Control de Exportación · Registros de Exportación · Residencia de Datos · Datos Sintéticos
- **Laboratorio Avanzado:** Ensayos de Laboratorio · Análisis Generales · VCF Uploader (Alimentos) · VCF Uploader (Suelo/Tierra) · Laboratorio API
- **Seguridad y Cumplimiento:** Suite de Seguridad™ · Seguridad · Incidentes · Protocolos · Monitoreo General · Exportación de Auditorías
- **Administración del Sistema:** Administración · Usuarios · Roles · Configuración
- **Agronomía Avanzada:** Calculadora de Fertilizantes
