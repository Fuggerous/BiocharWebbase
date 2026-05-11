import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, LabelList, LineChart, Line,
} from 'recharts';
import {
  REAL_FEEDSTOCK_DISTRIBUTION,
  REAL_AVG_BY_BIOMASS,
  REAL_SCATTER_SUMMARY,
  REAL_TEMP_DISTRIBUTION,
  TOTAL_DATA_POINTS,
} from '../../lib/biocharKnowledgeBase';
import { BIOMASS_COLORS } from '../../lib/database44';

// Derive unique type labels from actual data (REAL_SCATTER_SUMMARY applies
// .replace(' ground-based','').replace(' sawdust powders','') to biomass names)
const SCATTER_TYPES = [...new Set(REAL_SCATTER_SUMMARY.map(d => d.type))];

// Map shortened type names back to BIOMASS_COLORS using partial match
function colorForType(type) {
  const match = Object.keys(BIOMASS_COLORS).find(k =>
    k.toLowerCase().startsWith(type.toLowerCase()) ||
    type.toLowerCase().startsWith(k.split(' ')[0].toLowerCase())
  );
  return match ? BIOMASS_COLORS[match] : '#94a3b8';
}

function ScatterTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="glass-card rounded-xl p-3 border border-border text-xs shadow-lg space-y-1 bg-background">
      <p className="font-space font-bold text-sm text-foreground">Isotherm #{d.isothermId}</p>
      <div className="space-y-0.5 text-muted-foreground">
        <p><span className="font-semibold text-foreground">Biomass:</span> {d.type}</p>
        <p><span className="font-semibold text-foreground">Activator:</span> {d.activator === 'Non' ? 'None' : d.activator}</p>
        <p><span className="font-semibold text-foreground">Pyro Temp:</span> {d.pyroTemp}°C</p>
        <p><span className="font-semibold text-green-600">BET Surface Area:</span> {d.surface?.toLocaleString()} m²/g</p>
        <p><span className="font-semibold text-green-600">Peak CO₂:</span> {d.co2?.toFixed(3)} mmol/g</p>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, badge, children }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-border">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-space font-semibold text-base text-foreground">{title}</h3>
        {badge && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium shrink-0 ml-2">
            Real Data
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function DatabaseCharts() {
  return (
    <div className="space-y-6">
      {/* Row 1: Donut + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Feedstock Distribution"
          subtitle={`Share of ${TOTAL_DATA_POINTS.toLocaleString()} dataset entries by biomass type`}
          badge
        >
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={REAL_FEEDSTOCK_DISTRIBUTION}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={90}
                paddingAngle={3} dataKey="value"
              >
                {REAL_FEEDSTOCK_DISTRIBUTION.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v} data points`, '']} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Avg CO₂ Adsorption by Biomass"
          subtitle="Mean mmol/g across all experimental conditions (real database)"
          badge
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={REAL_AVG_BY_BIOMASS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="type" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} unit=" mmol/g" />
              <Tooltip formatter={(v) => [`${v} mmol/g`, 'Mean CO₂']} />
              <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                {REAL_AVG_BY_BIOMASS.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
                <LabelList dataKey="avg" position="top" style={{ fontSize: 11, fontWeight: 600 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Temperature trends */}
      <ChartCard
        title="CO₂ Uptake vs. Pyrolysis Temperature"
        subtitle="Average CO₂ adsorption (mmol/g) across temperature brackets — derived from real experimental data"
        badge
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={REAL_TEMP_DISTRIBUTION} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="temp" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="co2" tick={{ fontSize: 11 }} unit=" mmol/g" />
            <YAxis yAxisId="count" orientation="right" tick={{ fontSize: 10 }} unit=" pts" />
            <Tooltip formatter={(v, n) => [n === 'avgCO2' ? `${v} mmol/g` : `${v} records`, n === 'avgCO2' ? 'Avg CO₂' : 'Records']} />
            <Bar yAxisId="co2" dataKey="avgCO2" fill="#22c55e" radius={[6, 6, 0, 0]} name="avgCO2">
              <LabelList dataKey="avgCO2" position="top" style={{ fontSize: 10, fontWeight: 700, fill: '#16a34a' }} />
            </Bar>
            <Bar yAxisId="count" dataKey="count" fill="#3b82f633" radius={[4, 4, 0, 0]} name="count" />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Row 3: Scatter */}
      <ChartCard
        title="Surface Area vs. CO₂ Adsorption"
        subtitle="Aggregated relationship between BET surface area (m²/g) and CO₂ uptake — pattern from real database records"
        badge
      >
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis
              dataKey="surface" name="BET Surface Area" unit=" m²/g" tick={{ fontSize: 11 }}
              label={{ value: 'BET Surface Area (m²/g)', position: 'insideBottom', offset: -10, fontSize: 11 }}
            />
            <YAxis
              dataKey="co2" name="CO₂ Adsorption" unit=" mmol/g" tick={{ fontSize: 11 }}
              label={{ value: 'CO₂ Adsorption (mmol/g)', angle: -90, position: 'insideLeft', fontSize: 11 }}
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ScatterTooltip />} />
            {SCATTER_TYPES.map(type => (
              <Scatter
                key={type}
                name={type}
                data={REAL_SCATTER_SUMMARY.filter(d => d.type === type)}
                fill={colorForType(type)}
                fillOpacity={0.75}
              />
            ))}
            <Legend wrapperStyle={{ position: 'absolute', right: 10, bottom: 10, fontSize: 11 }} />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}