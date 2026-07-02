Análisis del Proyecto Frontend AgroMayia
Este documento presenta una radiografía detallada del frontend del sistema AgroMayia, una plataforma de inteligencia agrícola diseñada para optimizar la toma de decisiones en el campo (especialmente adaptada para el cultivo de arándanos Biloxi en la temporada 2026).

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
