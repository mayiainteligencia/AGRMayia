export const brandingConfig = {
  empresa: {
    nombre: "AgroMayia",
    eslogan: "Inteligencia para el campo",
    logo: "/assets/logosNativos/agroMayia.png",
  },

  colores: {
    primario:       "#1A3C2E",
    primarioOscuro: "#122B21",
    primarioClaro:  "#E8F4EE",
    secundario:     "#2D6A4F",
    acento:         "#52B788",
    acentoBerry:    "#5C3D8F",

    peligro:     "#DC2626",
    advertencia: "#D97706",
    exito:       "#059669",
    info:        "#0284C7",

    fondoPrincipal:  "#F7F9F8",
    fondoSecundario: "#FFFFFF",
    fondoTerciario:  "#EEF4F1",
    fondoClaro:      "#FFFFFF",

    textoClaro:    "#111827",
    textoMedio:    "#374151",
    textoOscuro:   "#6B7280",
    textoEnOscuro: "#FFFFFF",

    borde:      "#E5E7EB",
    bordeHover: "#52B788",

    gradientePrimario: "linear-gradient(135deg, #1A3C2E 0%, #2D6A4F 100%)",
    gradienteAcento:   "linear-gradient(135deg, #52B788 0%, #2D6A4F 100%)",
    gradienteBerry:    "linear-gradient(135deg, #5C3D8F 0%, #7B5EA7 100%)",

    sombra:       "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
    sombraMedia:  "0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.03)",
    sombraGrande: "0 10px 25px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04)",
  },

  metricas: {
    plantasPorHectarea: 9090,
    produccionAno1:     { min: 800, max: 1200 },
    produccionOptima:   5000,
    alturaMeta:         110,
  },

  ia: {
    nombre:   "MAYIA",
    modelo:   "Gemini 2.5 Flash",
    habilitado: true,
  },
};

export type BrandingConfig = typeof brandingConfig;