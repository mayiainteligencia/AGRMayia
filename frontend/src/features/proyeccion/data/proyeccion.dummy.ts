import type { KPI, OrdenCompra } from '../../../types/agro.types';

export const proyeccionKPIs: KPI[] = [
  { id: 1, label: 'Precio Referencia',     value: '$7.20', unit: 'USD/kg',   delta: '+0.15 USD', trend: 'up',   accentColor: '#2D6A4F' },
  { id: 2, label: 'kg Proyectados Temp.', value: '38,200', unit: 'kg',       delta: '+4.2%',     trend: 'up',   accentColor: '#52B788' },
  { id: 3, label: 'Ingreso Estimado',      value: '$275k',  unit: 'USD',      delta: '+8.6%',     trend: 'up',   accentColor: '#5C3D8F' },
];

export const curvaFenologica = [
  { mes: 'Ene', real: 0.1, gauss: 0.05 },
  { mes: 'Feb', real: 0.3, gauss: 0.15 },
  { mes: 'Mar', real: 0.8, gauss: 0.6  },
  { mes: 'Abr', real: 1.6, gauss: 1.4  },
  { mes: 'May', real: 2.8, gauss: 2.5  },
  { mes: 'Jun', real: 3.9, gauss: 4.0  },
  { mes: 'Jul', real: 4.2, gauss: 4.3  },
  { mes: 'Ago', real: 3.5, gauss: 3.8  },
  { mes: 'Sep', real: 2.1, gauss: 2.4  },
  { mes: 'Oct', real: 1.0, gauss: 1.2  },
  { mes: 'Nov', real: 0.4, gauss: 0.5  },
  { mes: 'Dic', real: 0.1, gauss: 0.1  },
];

export const kgPorMes = [
  { mes: 'Ene', proyectado: 420,   real: 380   },
  { mes: 'Feb', proyectado: 1100,  real: 1050  },
  { mes: 'Mar', proyectado: 2800,  real: 2650  },
  { mes: 'Abr', proyectado: 4500,  real: 4320  },
  { mes: 'May', proyectado: 6200,  real: 5980  },
  { mes: 'Jun', proyectado: 7400,  real: null  },
  { mes: 'Jul', proyectado: 7200,  real: null  },
  { mes: 'Ago', proyectado: 5100,  real: null  },
  { mes: 'Sep', proyectado: 2800,  real: null  },
  { mes: 'Oct', proyectado: 900,   real: null  },
  { mes: 'Nov', proyectado: 280,   real: null  },
  { mes: 'Dic', proyectado: 60,    real: null  },
];

export const ordenesProyeccion: OrdenCompra[] = [
  { id: 'OC-2026-019', comercializador: 'Fresh Export SA',  fechaOrden: '2026-05-28', kgSolicitados: 2000, precioKg: 7.20, clamshell: '12oz', estado: 'pendiente' },
  { id: 'OC-2026-020', comercializador: 'NorCal Berries',   fechaOrden: '2026-06-04', kgSolicitados: 3500, precioKg: 7.40, clamshell: '12oz', estado: 'pendiente' },
  { id: 'OC-2026-018', comercializador: 'Berry World LLC',  fechaOrden: '2026-05-20', kgSolicitados: 1200, precioKg: 7.20, clamshell: '6oz',  estado: 'confirmada' },
];
