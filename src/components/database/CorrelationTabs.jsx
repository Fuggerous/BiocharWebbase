// @ts-nocheck
import { useState, useMemo } from 'react';
import { BIOMASS_COLORS } from '../../lib/database44';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis,
  BarChart, Bar, Cell, LabelList,
} from 'recharts';
import CorrelationHeatmap from './CorrelationHeatmap';
import ScatterPlot3D from './ScatterPlot3D';

const TABS = ['Isotherm Plots', 'Multidimensional', 'Feature Effects', 'Correlation Heatmap'];

// ── Tab A: Isotherm Plot ──────────────────────────────────────────────────────
function IsothermTab({ records }) {
  const availableTemps = useMemo(() =>
    [...new Set(records.filter(r => r.isIsotherm && r.adsorpTemp != null).map(r => r.adsorpTemp))].sort((a, b) => a - b),
    [records]
  );
  const [adsorpTemp, setAdsorpTemp] = useState(() => availableTemps[0] ?? 25);

  // Reset selected temp when available list changes and current isn't in it
  const safeTemp = availableTemps.includes(adsorpTemp) ? adsorpTemp : (availableTemps[0] ?? adsorpTemp);

  const seriesMap = useMemo(() => {
    const filtered = records.filter(r => r.isIsotherm && r.adsorpTemp === safeTemp && r.pressure != null && r.co2Uptake != null);
    const groups = {};
    filtered.forEach(r => {
      const key = r.isothermId;
      if (!groups[key]) {
        const label = `${r.biomass.split(' ')[0]} ${r.activator === 'Non' ? '' : r.activator} ${r.pyroTemp}°C #${r.isothermId}`.trim();
        groups[key] = { label, points: [] };
      }
      groups[key].points.push({ pressure: r.pressure, co2Uptake: r.co2Uptake });
    });
    Object.values(groups).forEach(g => g.points.sort((a, b) => a.pressure - b.pressure));
    const out = {};
    Object.values(groups).forEach(g => { out[g.label] = g.points; });
    return out;
  }, [records, safeTemp]);

  const SERIES_COLORS = ['#22c55e','#3b82f6','#a855f7','#f59e0b','#ef4444','#06b6d4','#ec4899','#84cc16'];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">Adsorption Temperature:</span>
        <div className="flex gap-2 flex-wrap">
          {availableTemps.map(t => (
            <button key={t} onClick={() => setAdsorpTemp(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                safeTemp === t ? 'gradient-green text-white' : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}>
              {t}°C
            </button>
          ))}
          {availableTemps.length === 0 && (
            <span className="text-xs text-muted-foreground italic">No isotherm records in current filter</span>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        CO₂ Uptake (mmol/g) vs. Adsorption Pressure (atm) — each line is a unique experimental entry at {safeTemp}°C
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="pressure" type="number" domain={[0, 'auto']} tickCount={6}
            label={{ value: 'Pressure (atm)', position: 'insideBottom', offset: -4, fontSize: 11 }}
            tick={{ fontSize: 11 }} />
          <YAxis label={{ value: 'CO₂ Uptake (mmol/g)', angle: -90, position: 'Left', fontSize: 11 }}
            tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v, n) => [`${Number(v).toFixed(3)} mmol/g`, n]} />
          <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
          {Object.entries(seriesMap).map(([key, data], i) => (
            <Line key={key} name={key} data={data} dataKey="co2Uptake" type="monotone"
              stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
              strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Tab B: Multidimensional (2D bubble or 3D scatter) ─────────────────────────
const AXIS_OPTIONS = [
  { key: 'pyroTemp',    label: 'Pyrolysis Temp (°C)' },
  { key: 'surfaceArea', label: 'Surface Area (m²/g)'  },
  { key: 'poreVolume',  label: 'Pore Volume (m³/kg)'  },
  { key: 'co2Uptake',   label: 'CO₂ Uptake (mmol/g)' },
  { key: 'adsorpTemp',  label: 'Adsorption Temp (°C)' },
  { key: 'pressure',    label: 'Pressure (atm)'       },
  { key: 'residenceTime',label:'Residence Time (min)' },
];

function MultiDimTab({ records }) {
  const [xAxis, setXAxis] = useState('surfaceArea');
  const [yAxis, setYAxis] = useState('co2Uptake');
  const [zAxis, setZAxis] = useState('pyroTemp');
  const [view,  setView]  = useState('2d');   // '2d' | '3d'

  const biomassInRecords = useMemo(() =>
    [...new Set(records.map(r => r.biomass))], [records]);

  // 2D: series grouped by biomass
  const seriesByBiomass = useMemo(() => {
    const out = {};
    biomassInRecords.forEach(b => {
      out[b] = records
        .filter(r => r.biomass === b && r[xAxis] != null && r[yAxis] != null)
        .map(r => ({ x: r[xAxis], y: r[yAxis], z: r[zAxis] ?? 1 }));
    });
    return out;
  }, [records, xAxis, yAxis, zAxis, biomassInRecords]);

  // 3D: flat point array
  const points3d = useMemo(() =>
    records
      .filter(r => r[xAxis] != null && r[yAxis] != null && r[zAxis] != null
               && Number.isFinite(r[xAxis]) && Number.isFinite(r[yAxis]) && Number.isFinite(r[zAxis]))
      .map(r => ({
        x: r[xAxis], y: r[yAxis], z: r[zAxis],
        biomass: r.biomass,
        color:   BIOMASS_COLORS[r.biomass] ?? '#94a3b8',
      })),
    [records, xAxis, yAxis, zAxis]
  );

  const xLabel = AXIS_OPTIONS.find(o => o.key === xAxis)?.label ?? xAxis;
  const yLabel = AXIS_OPTIONS.find(o => o.key === yAxis)?.label ?? yAxis;
  const zLabel = AXIS_OPTIONS.find(o => o.key === zAxis)?.label ?? zAxis;

  return (
    <div className="space-y-4">
      {/* ── Controls row ── */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Axis selectors */}
        {(view === '3d'
          ? [
              { label: 'X-Axis (Red)',   val: xAxis, set: setXAxis },
              { label: 'Y-Axis (Green)', val: yAxis, set: setYAxis },
              { label: 'Z-Axis (Blue)',  val: zAxis, set: setZAxis },
            ]
          : [
              { label: 'X-Axis',          val: xAxis, set: setXAxis },
              { label: 'Y-Axis',          val: yAxis, set: setYAxis },
              { label: 'Bubble Size (Z)', val: zAxis, set: setZAxis },
            ]
        ).map(({ label, val, set }) => (
          <div key={label} className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
            <select value={val} onChange={e => set(e.target.value)}
              className="px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30">
              {AXIS_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
          </div>
        ))}

        {/* View toggle — pushed to end */}
        <div className="ml-auto flex items-center gap-1 p-1 bg-muted rounded-xl border border-border">
          {[
            { key: '2d', label: '2D Bubble' },
            { key: '3d', label: '3D Scatter' },
          ].map(v => (
            <button key={v.key} onClick={() => setView(v.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                view === v.key
                  ? 'bg-card shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2D Bubble chart ── */}
      {view === '2d' && (
        <>
          <p className="text-xs text-muted-foreground">
            Color = Biomass · Bubble size ∝ {zLabel} · {records.length} records
          </p>
          <ResponsiveContainer width="100%" height={340}>
            <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="x" type="number" name={xLabel} tick={{ fontSize: 11 }}
                label={{ value: xLabel, position: 'insideBottom', offset: -10, fontSize: 11 }} />
              <YAxis dataKey="y" type="number" name={yLabel} tick={{ fontSize: 11 }}
                label={{ value: yLabel, angle: -90, position: 'insideLeft', fontSize: 11 }} />
              <ZAxis dataKey="z" range={[40, 400]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }}
                formatter={(v, n) => [typeof v === 'number' ? v.toFixed(3) : v, n]} />
              <Legend wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
              {biomassInRecords.map(b => (
                <Scatter key={b} name={b.replace(' ground-based','').replace(' powders','')}
                  data={seriesByBiomass[b]}
                  fill={BIOMASS_COLORS[b] ?? '#94a3b8'} fillOpacity={0.75} />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </>
      )}

      {/* ── 3D WebGL scatter ── */}
      {view === '3d' && (
        <>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{points3d.length}</span> records · Color = Biomass · Drag to rotate · Scroll to zoom
          </p>
          <ScatterPlot3D
            key={`3d-${xAxis}-${yAxis}-${zAxis}`}
            points={points3d}
            xLabel={xLabel} yLabel={yLabel} zLabel={zLabel}
            height={440}
          />
          {/* Biomass legend */}
          <div className="flex flex-wrap gap-3">
            {biomassInRecords.map(b => (
              <div key={b} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: BIOMASS_COLORS[b] ?? '#94a3b8' }} />
                {b.replace(' ground-based','').replace(' powders','')}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Tab C: Feature Effects ────────────────────────────────────────────────────
function FeatureEffectsTab({ records }) {
  const [feature, setFeature] = useState('activator');

  const chartData = useMemo(() => {
    const groupKey = feature === 'activator' ? 'activator' : feature === 'biomass' ? 'biomass' : 'activationType';
    const groups = {};
    records.forEach(r => {
      if (!Number.isFinite(r.co2Uptake)) return;
      const k = r[groupKey] === 'Non' ? 'None' : r[groupKey];
      if (!groups[k]) groups[k] = [];
      groups[k].push(r.co2Uptake);
    });
    return Object.entries(groups).map(([name, vals]) => {
      const sorted = [...vals].sort((a, b) => a - b);
      const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
      return {
        name: name.replace(' ground-based', '').replace(' sawdust powders', ''),
        mean: +mean.toFixed(3),
        min: +sorted[0].toFixed(3),
        max: +sorted[sorted.length - 1].toFixed(3),
        q1: +sorted[Math.floor(sorted.length * 0.25)].toFixed(3),
        q3: +sorted[Math.floor(sorted.length * 0.75)].toFixed(3),
        count: vals.length,
      };
    }).sort((a, b) => b.mean - a.mean);
  }, [records, feature]);

  const COLORS = ['#22c55e','#3b82f6','#a855f7','#f59e0b','#ef4444','#06b6d4','#84cc16'];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">Group by:</span>
        {[{ key: 'activator', label: 'Activator' }, { key: 'activationType', label: 'Activation Type' }, { key: 'biomass', label: 'Biomass Species' }].map(opt => (
          <button key={opt.key} onClick={() => setFeature(opt.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              feature === opt.key ? 'bg-blue-500 text-white' : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}>
            {opt.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Distribution of CO₂ Uptake (mmol/g) by {feature} — {records.filter(r => r.co2Uptake != null).length} records with measured CO₂ uptake
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 16, right: 20, left: 44, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }}
            label={{ value: 'CO₂ Uptake (mmol/g)', angle: -90, position: 'Left', offset: 0, fontSize: 11 }} />
          <Tooltip
            content={({ active, payload }) => active && payload?.length ? (
              <div className="glass-card rounded-xl p-3 border border-border text-xs space-y-0.5 shadow-lg">
                <p className="font-semibold text-foreground mb-1">{payload[0]?.payload?.name}</p>
                <p>Mean: <span className="font-bold text-green-600">{payload[0]?.payload?.mean} mmol/g</span></p>
                <p>Max: <span className="text-blue-500">{payload[0]?.payload?.max} mmol/g</span></p>
                <p>Min: <span className="text-amber-500">{payload[0]?.payload?.min} mmol/g</span></p>
                <p className="text-muted-foreground">n = {payload[0]?.payload?.count} records</p>
              </div>
            ) : null}
          />
          <Bar dataKey="mean" name="Mean CO₂ Uptake" radius={[6, 6, 0, 0]}>
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            <LabelList dataKey="mean" position="top" style={{ fontSize: 10, fontWeight: 700 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              {['Category', 'n', 'Mean (mmol/g)', 'Min', 'Q1', 'Q3', 'Max'].map(h => (
                <th key={h} className="text-left py-2 px-2 font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chartData.map((row, i) => (
              <tr key={row.name} className={`border-b border-border/50 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                <td className="py-2 px-2 font-medium">{row.name}</td>
                <td className="py-2 px-2 text-muted-foreground">{row.count}</td>
                <td className="py-2 px-2 font-bold text-green-600">{row.mean}</td>
                <td className="py-2 px-2 text-amber-500">{row.min}</td>
                <td className="py-2 px-2">{row.q1}</td>
                <td className="py-2 px-2">{row.q3}</td>
                <td className="py-2 px-2 text-blue-500">{row.max}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Exported Component ───────────────────────────────────────────────────
export default function CorrelationTabs({ records = [] }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="glass-card rounded-2xl p-5 border border-border">
      <div className="mb-5">
        <h3 className="font-space font-bold text-base text-foreground">Correlation Analysis</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Interactive multidimensional exploration — {records.length} records in current filter
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6 flex-wrap">
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === i ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && <IsothermTab records={records} />}
      {activeTab === 1 && <MultiDimTab records={records} />}
      {activeTab === 2 && <FeatureEffectsTab records={records} />}
      {activeTab === 3 && <CorrelationHeatmap records={records} />}
    </div>
  );
}
