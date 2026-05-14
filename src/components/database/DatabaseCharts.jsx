// @ts-nocheck
import { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, LabelList,
} from 'recharts';
import { BIOMASS_COLORS, BIOMASS_SPECIES_MAP, SPECIES_COLORS } from '../../lib/database44';

// Fallback color palette for biomasses without a dedicated color
const FALLBACK_PALETTE = [
  '#22c55e','#3b82f6','#a855f7','#f59e0b','#ef4444',
  '#06b6d4','#ec4899','#84cc16','#f97316','#8b5cf6',
  '#14b8a6','#e879f9','#fb923c','#a3e635','#38bdf8',
];

const BIOMASS_TO_SPECIES = Object.entries(BIOMASS_SPECIES_MAP).reduce((acc, [species, parts]) => {
  parts.forEach(part => {
    acc[part] = species;
  });
  return acc;
}, {});

function speciesForBiomass(biomass) {
  return BIOMASS_TO_SPECIES[biomass] ?? biomass;
}

function colorForSpecies(species) {
  return SPECIES_COLORS[species] ?? FALLBACK_PALETTE[0];
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-border">
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-space font-semibold text-base text-foreground">{title}</h3>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium shrink-0 ml-2">
          Live · Filtered
        </span>
      </div>
      {subtitle && <p className="text-xs text-muted-foreground mb-3">{subtitle}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

// Pre-assign each individual biomass part a unique stable color based on sorted position.
// This ensures parts within the same species still get distinct colors.
const _ALL_PARTS = [...new Set(Object.values(BIOMASS_SPECIES_MAP).flat())].sort();
const BIOMASS_PART_COLOR = Object.fromEntries(
  _ALL_PARTS.map((name, i) => [name, FALLBACK_PALETTE[i % FALLBACK_PALETTE.length]])
);

// Stable color for any biomass:
//   1. Explicit per-part BIOMASS_COLORS (e.g. "Corn straw")
//   2. Direct species lookup — catches first-word abbreviations used by the scatter chart (e.g. "Corn", "Pine")
//   3. Pre-assigned per-part palette (full names from BIOMASS_SPECIES_MAP)
//   4. Hard fallback
function stableColorForBiomass(biomass) {
  return BIOMASS_COLORS[biomass]
    ?? SPECIES_COLORS[biomass]
    ?? BIOMASS_PART_COLOR[biomass]
    ?? FALLBACK_PALETTE[0];
}

export default function DatabaseCharts({ records = [], biomassFilter = [] }) {
  // ── 1. Feedstock distribution donut ─────────────────────────────────────
  // When specific parts are selected (biomassFilter non-empty), show each part separately.
  // When nothing selected (default), group by species to keep the legend clean.
  const feedstockDist = useMemo(() => {
    const showByPart = biomassFilter.length > 0;
    const counts = {};
    records.forEach(r => {
      const key = showByPart ? r.biomass : speciesForBiomass(r.biomass);
      counts[key] = (counts[key] ?? 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value], idx) => ({
        name,
        value,
        color: showByPart ? stableColorForBiomass(name) : colorForSpecies(name),
      }))
      .sort((a, b) => b.value - a.value);
  }, [records, biomassFilter]);

  // ── 2. Avg CO₂ by biomass — horizontal bar, biomass on Y ─────────────────
  const avgCO2ByBiomass = useMemo(() => {
    const groups = {};
    records.forEach(r => {
      if (r.co2Uptake == null) return;
      if (!groups[r.biomass]) groups[r.biomass] = { sum: 0, count: 0 };
      groups[r.biomass].sum += r.co2Uptake;
      groups[r.biomass].count += 1;
    });
    return Object.entries(groups)
      .map(([biomass, { sum, count }], i) => ({
        biomass,
        avg: +(sum / count).toFixed(3),
        count,
        fill: stableColorForBiomass(biomass),
      }))
      .sort((a, b) => b.avg - a.avg);  // descending by avg CO₂
  }, [records]);

  // ── 3. CO₂ Uptake vs Pyrolysis Temperature bar ───────────────────────────
  const tempDist = useMemo(() => {
    const bins = {};
    records.forEach(r => {
      if (r.co2Uptake == null || r.pyroTemp == null) return;
      const bin = `${Math.floor(r.pyroTemp / 100) * 100}°C`;
      if (!bins[bin]) bins[bin] = { sum: 0, count: 0 };
      bins[bin].sum += r.co2Uptake;
      bins[bin].count += 1;
    });
    return Object.entries(bins)
      .map(([temp, { sum, count }]) => ({
        temp,
        avgCO2: +(sum / count).toFixed(3),
        count,
      }))
      .sort((a, b) => parseInt(a.temp) - parseInt(b.temp));
  }, [records]);

  // ── 4. Surface area vs CO₂ scatter ──────────────────────────────────────
  const scatterData = useMemo(() => {
    return records
      .filter(r => r.surfaceArea != null && r.co2Uptake != null)
      .map(r => ({
        surface: r.surfaceArea,
        co2: r.co2Uptake,
        biomass: r.biomass.split(' ')[0],
        pyroTemp: r.pyroTemp,
        activator: r.activator,
        isothermId: r.isothermId,
      }));
  }, [records]);

  const scatterBiomassTypes = useMemo(() =>
    [...new Set(scatterData.map(d => d.biomass))],
    [scatterData]
  );

  // ── Isotherm averages ──────────────────────────────────────────────────
  const isothermAverages = useMemo(() => {
    const groups = {};
    scatterData.forEach(d => {
      if (!d.isothermId) return;
      if (!groups[d.isothermId]) {
        groups[d.isothermId] = { sumCO2: 0, sumSurface: 0, count: 0, biomass: d.biomass, isothermId: d.isothermId };
      }
      groups[d.isothermId].sumCO2 += d.co2;
      groups[d.isothermId].sumSurface += d.surface;
      groups[d.isothermId].count += 1;
    });
    return Object.values(groups).map(g => ({
      co2: +(g.sumCO2 / g.count).toFixed(3),
      surface: +(g.sumSurface / g.count).toFixed(1),
      biomass: g.biomass,
      isothermId: g.isothermId,
      count: g.count,
    }));
  }, [scatterData]);

  const ScatterTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    if (!d) return null;
    return (
      <div className="glass-card rounded-xl p-3 border border-border text-xs shadow-lg space-y-1 bg-background">
        <p className="font-space font-bold text-sm text-foreground">{d.biomass}</p>
        {d.isothermId && <p><span className="font-semibold text-green-600">Isotherm #:</span> {d.isothermId}</p>}
        <p><span className="font-semibold text-green-600">BET Surface Area:</span> {d.surface?.toLocaleString()} m²/g</p>
        <p><span className="font-semibold text-green-600">Peak CO₂:</span> {d.co2?.toFixed(3)} mmol/g</p>
        {d.count && <p className="text-muted-foreground">Avg of {d.count} records</p>}
        {d.pyroTemp && <p><span className="text-muted-foreground">Pyro Temp:</span> {d.pyroTemp}°C</p>}
        {d.activator && d.activator !== 'Non' && <p><span className="text-muted-foreground">Activator:</span> {d.activator}</p>}
      </div>
    );
  };

  if (records.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-10 border border-border text-center text-muted-foreground text-sm">
        No records match the current filters — adjust filters to see charts.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Row 1: Donut + Horizontal Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Feedstock Distribution"
          subtitle={biomassFilter.length > 0
            ? `${records.length} records · showing individual parts (${biomassFilter.length} selected)`
            : `${records.length} filtered records · grouped by species`}
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={feedstockDist} cx="50%" cy="50%"
                innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                {feedstockDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v} records`, n]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Horizontal bar: biomass on Y-axis, CO₂ on X-axis */}
        <ChartCard
          title="Avg CO₂ Adsorption by Biomass"
          subtitle="Mean mmol/g — sorted descending · hover for record count"
        >
          <ResponsiveContainer width="100%" height={Math.max(240, avgCO2ByBiomass.length * 28)}>
            <BarChart data={avgCO2ByBiomass} layout="vertical"
              margin={{ top: 4, right: 56, left: 4, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10 }} tickCount={5} 
              label={{ value: 'CO₂ Adsorption (mmol/g)', position:'bottom', offset: 5, fontSize: 10, fontWeight: 600 }}/>
              <YAxis type="category" dataKey="biomass" tick={{ fontSize: 10 }} width={120} />
              <Tooltip
                formatter={(v) => [`${v} mmol/g`, 'Mean CO₂']}
                content={({ active, payload }) => active && payload?.length ? (
                  <div className="glass-card rounded-xl p-3 border border-border text-xs shadow-lg">
                    <p className="font-bold mb-1">{payload[0]?.payload?.biomass}</p>
                    <p>Mean: <span className="font-bold text-green-600">{payload[0]?.payload?.avg} mmol/g</span></p>
                    <p className="text-muted-foreground">n = {payload[0]?.payload?.count} records</p>
                  </div>
                ) : null}
              />
              <Bar dataKey="avg" radius={[0, 6, 6, 0]}>
                {avgCO2ByBiomass.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                <LabelList dataKey="avg" position="right"
                  style={{ fontSize: 10, fontWeight: 600 }}
                  formatter={v => `${v}`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Pyrolysis temp bar */}
      {tempDist.length > 0 && (
        <ChartCard
          title="CO₂ Uptake vs. Pyrolysis Temperature"
          subtitle="Average CO₂ adsorption (mmol/g) per 100°C temperature bracket"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={tempDist} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="temp" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="co2" tick={{ fontSize: 11 }} 
              label={{ value: 'CO₂ Adsorption (mmol/g)', angle: -90, position: 'Left', offset:20, fontSize: 10, fontWeight: 600 }}/>
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
      )}

      {/* Row 3: Surface area vs CO₂ scatter */}
      {scatterData.length > 0 && (
        <ChartCard
          title="Surface Area vs. CO₂ Adsorption"
          subtitle={`BET surface area (m²/g) vs CO₂ uptake — ${scatterData.length} by isotherm averages`}
        >
          <ResponsiveContainer width="100%" height={360}>
            <ScatterChart margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <YAxis type="number" dataKey="co2" name="CO₂ Adsorption"  tick={{ fontSize: 11 }}
                label={{ value: 'CO₂ Adsorption (mmol/g)', angle: -90, position: 'Left', fontSize: 10, fontWeight: 600 }} />
              <XAxis type="number" dataKey="surface" name="BET Surface Area"  tick={{ fontSize: 11 }}
                label={{ value: 'BET Surface Area (m²/g)', position: 'bottom', offset: 10, fontSize: 10, fontWeight: 600 }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ScatterTooltip />} />
              {scatterBiomassTypes.map((type) => (
                <Scatter key={type} name={type}
                  data={isothermAverages.filter(d => d.biomass === type)}
                  fill={stableColorForBiomass(type)} fillOpacity={0.85} shape="diamond" />
              ))}
              <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: 11, paddingBottom: '20px' }} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      )}
    </div>
  );
}
