import type { AnalisisLab, ParametroMonitoreado } from '../../../types/agro.types';

export const analisisAlimentos: AnalisisLab[] = [
  { id: 'AF-2026-0118', muestra: 'Arándano fresco',  lote: 'AR-Biloxi-118', tipo: 'Alimentos', parametros: 'pH · Brix · sólidos solubles',  resultado: 'pH 3.2 · Brix 12.4',  norma: 'NOM-251',      responsable: 'Susana Vargas', fecha: '2026-05-28', estado: 'conforme',    brain: 'F' },
  { id: 'AF-2026-0119', muestra: 'Arándano fresco',  lote: 'AR-ONeal-204',  tipo: 'Alimentos', parametros: 'pH · Brix',                     resultado: 'pH 2.7 · Brix 11.0',  norma: 'NOM-251',      responsable: 'Susana Vargas', fecha: '2026-05-28', estado: 'no-conforme', brain: 'F' },
  { id: 'AF-2026-0120', muestra: 'Arándano congelado', lote: 'AR-Biloxi-117', tipo: 'Alimentos', parametros: 'Microbiológicos · pesticidas', resultado: 'Sin detecciones',     norma: 'FDA 21 CFR',   responsable: 'Evelyn Cruz',   fecha: '2026-05-27', estado: 'conforme',    brain: 'F' },
  { id: 'AF-2026-0121', muestra: 'Agua de empaque',  tipo: 'Alimentos',     parametros: 'Cloro residual · coliformes',                        resultado: 'Cl 0.5 ppm · negativo', norma: 'NOM-127',    responsable: 'Susana Vargas', fecha: '2026-05-26', estado: 'conforme',    brain: 'F' },
  { id: 'AF-2026-0122', muestra: 'Empaque clamshell 6oz', tipo: 'Alimentos', parametros: 'Migración · contacto alimentos',                    resultado: 'Dentro de norma',     norma: 'COFEPRIS',     responsable: 'Susana Vargas', fecha: '2026-05-25', estado: 'pendiente',   brain: 'F' },
];

export const parametrosMonitoreados: ParametroMonitoreado[] = [
  { parametro: 'pH',                  metodo: 'Potenciométrico',    lmp: '2.8 – 3.5',   norma: 'NOM-251',     frecuencia: 'Por lote',   ultimoResultado: '3.2',          estado: 'conforme' },
  { parametro: 'Brix (sólidos)',      metodo: 'Refractometría',     lmp: '≥ 10 °Bx',    norma: 'NOM-251',     frecuencia: 'Por lote',   ultimoResultado: '12.4 °Bx',     estado: 'conforme' },
  { parametro: 'Listeria monocytogenes', metodo: 'ISO 11290-1',     lmp: 'Ausencia/25g', norma: 'FDA 21 CFR', frecuencia: 'Semanal',    ultimoResultado: 'Negativo',     estado: 'conforme' },
  { parametro: 'Salmonella spp.',     metodo: 'ISO 6579',           lmp: 'Ausencia/25g', norma: 'FDA 21 CFR', frecuencia: 'Semanal',    ultimoResultado: 'Negativo',     estado: 'conforme' },
  { parametro: 'E. coli',             metodo: 'NMP',                lmp: '< 10 NMP/g',   norma: 'NOM-251',    frecuencia: 'Quincenal',  ultimoResultado: '< 3 NMP/g',    estado: 'conforme' },
  { parametro: 'Residuos pesticidas', metodo: 'GC-MS / LC-MS',      lmp: 'LMR vigente',  norma: 'COFEPRIS',   frecuencia: 'Mensual',    ultimoResultado: 'Sin detección', estado: 'conforme' },
  { parametro: 'Cloro residual agua', metodo: 'Colorimétrico DPD',  lmp: '0.2 – 1.5 ppm', norma: 'NOM-127',   frecuencia: 'Diaria',     ultimoResultado: '0.5 ppm',      estado: 'conforme' },
  { parametro: 'Temperatura cooler',  metodo: 'Sonda calibrada',    lmp: '-0.5 a +0.5 °C', norma: 'GlobalGAP', frecuencia: 'Continua',  ultimoResultado: '0.1 °C',       estado: 'conforme' },
];
