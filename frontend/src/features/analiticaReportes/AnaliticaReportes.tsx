import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Wheat, Clock, DollarSign, Users } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { CustomTooltip } from '../../components/charts/CustomTooltip';
import { brandingConfig } from '../../config/branding';
import {
  analiticaKPIs,
  tendenciaGastosMensual,
  gastosCategoriaDona,
  kgPorCampo,
  estadoEnviosDona,
} from './data/analitica.dummy';

const { colores } = brandingConfig;

const ICONS = [
  <Wheat size={18} />,
  <Clock size={18} />,
  <DollarSign size={18} />,
  <Users size={18} />,
];

/* Paleta para donas — derivada de branding */
const DONA_GASTOS = [colores.primario, colores.secundario, colores.acento, colores.acentoBerry, colores.info, colores.advertencia];
const DONA_ENVIOS = [colores.exito, colores.info, colores.advertencia, colores.peligro];

export const AnaliticaReportes: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div>
      <h1
        className="page-title"
        style={{ fontSize: 28, fontWeight: 700, color: colores.textoClaro, margin: 0, letterSpacing: '-0.5px' }}
      >
        Analítica y Reportes
      </h1>
      <p style={{ fontSize: 14, color: colores.textoOscuro, margin: '4px 0 0 0' }}>
        Tendencias operativas y financieras de la temporada
      </p>
    </div>

    {/* ── KPIs ── */}
    <div className="rg-4">
      {analiticaKPIs.map((kpi, i) => (
        <StatCard key={kpi.id} {...kpi} icon={ICONS[i]} />
      ))}
    </div>

    {/* ── Tendencia gastos · Dona gastos por categoría ── */}
    <div className="rg-2">
      <Card>
        <SectionHeader
          title="Tendencia gastos mensual"
          subtitle="MXN · últimos 6 meses (dic–may)"
        />
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={tendenciaGastosMensual} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="anGastoGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor={colores.secundario} stopOpacity={0.95} />
                <stop offset="100%" stopColor={colores.acento}    stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="mxn" name="Gasto" fill="url(#anGastoGrad)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionHeader
          title="Gastos por categoría"
          subtitle="Distribución del gasto total"
        />
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={gastosCategoriaDona.map(g => ({ ...g }))}
              dataKey="montoMxn"
              nameKey="categoria"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
            >
              {gastosCategoriaDona.map((_, i) => (
                <Cell key={i} fill={DONA_GASTOS[i % DONA_GASTOS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>

    {/* ── Kg por campo · Estado envíos ── */}
    <div className="rg-2">
      <Card>
        <SectionHeader
          title="Kg cosechados por campo"
          subtitle="Producción acumulada de la temporada"
        />
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={kgPorCampo} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}K`} />
            <YAxis dataKey="campo" type="category" tick={{ fontSize: 11, fill: colores.textoMedio }} axisLine={false} tickLine={false} width={140} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="kg" name="Kg" fill={colores.primario} radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <SectionHeader
          title="Estado de envíos"
          subtitle="Distribución por estado"
        />
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={estadoEnviosDona}
              dataKey="cantidad"
              nameKey="estado"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
            >
              {estadoEnviosDona.map((_, i) => (
                <Cell key={i} fill={DONA_ENVIOS[i % DONA_ENVIOS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  </div>
);

export default AnaliticaReportes;
