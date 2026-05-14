import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, Plus, X, BarChart3, ScatterChart, Trash2 } from 'lucide-react';
import {
  ScatterChart as RScatter, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine,
} from 'recharts';
import { DB44_RECORDS, BIOMASS_COLORS } from '../../lib/database44';

const PALETTE = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

const UNIQUE_CONFIGS = (() => {
  const seen = new Set();
  return DB44_RECORDS.filter(r => {
    const key = `${r.biomass}|${r.activator}|${r.pyroTemp}|${r.activationType}`;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
})();

function ConfigLabel(r) {
  return `${r.biomass.split(' ')[0]} / ${r.activator} / ${r.pyroTemp}°C`;
}

function ConfigSelector({ onAdd, added }) {
  const [search, setSearch] = useState('');
  const filtered = UNIQUE_CONFIGS.filter(r => {
    const label = ConfigLabel(r).toLowerCase();
    return label.includes(search.toLowerCase()) && !added.some(a => a.id === r.id);
  }).slice(0, 8);

  return (
    <div className="space-y-2">
      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search config (biomass, activator, temp)…"
        className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-xs focus:outline-none focus:ring-2 focus:ring-green-500/30" />
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {filtered.map(r => (
          <button key={r.id} onClick={() => onAdd(r)}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-green-500/10 text-xs text-left transition-colors group border border-transparent hover:border-green-500/20">
            <div>
              <span className="font-medium text-foreground">{ConfigLabel(r)}</span>
              <span className="ml-2 text-muted-foreground">· {r.activationType}</span>
            </div>
            <Plus className="w-3.5 h-3.5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
        {filtered.length === 0 && <p className="text-center text-xs text-muted-foreground py-3">No configs found</p>}
      </div>
    </div>
  );
}

const CustomScatterTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="glass-card rounded-xl p-3 border border-border text-xs shadow-lg">
      <p className="font-bold text-foreground mb-1">{d.label}</p>
      <p className="text-muted-foreground">BET: <span className="font-semibold text-foreground">{d.x.toLocaleString()} m²/g</span></p>
      <p className="text-muted-foreground">CO₂: <span className="font-semibold text-foreground">{d.y} mmol/g</span></p>
      <p className="text-muted-foreground">Pore Vol: <span className="font-semibold text-foreground">{(d.pv * 1e6).toFixed(1)} ×10⁻⁶</span></p>
    </div>
  );
};

export default function ComparisonTool() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [chartMode, setChartMode] = useState('bar'); // 'bar' | 'scatter'

  const addConfig = (r) => {
    if (selected.length >= 8) return;
    setSelected(prev => [...prev, { ...r, _color: PALETTE[prev.length] }]);
  };
  const removeConfig = (id) => setSelected(prev => prev.filter(c => c.id !== id));
  const clearAll = () => setSelected([]);

  // Aggregate by config: avg co2 across all pressure/temp conditions
  const barData = useMemo(() => selected.map(cfg => {
    const records = DB44_RECORDS.filter(r =>
      r.biomass === cfg.biomass && r.activator === cfg.activator && r.pyroTemp === cfg.pyroTemp
    );
    const avgCO2 = records.reduce((s, r) => s + r.co2Uptake, 0) / records.length;
    const maxCO2 = Math.max(...records.map(r => r.co2Uptake));
    return { label: ConfigLabel(cfg), avgCO2: +avgCO2.toFixed(3), maxCO2: +maxCO2.toFixed(3), color: cfg._color, surfaceArea: cfg.surfaceArea };
  }), [selected]);

  const scatterData = useMemo(() => selected.map(cfg => {
    const records = DB44_RECORDS.filter(r =>
      r.biomass === cfg.biomass && r.activator === cfg.activator && r.pyroTemp === cfg.pyroTemp
    );
    return {
      name: ConfigLabel(cfg),
      color: cfg._color,
      points: records.map(r => ({ x: r.surfaceArea, y: r.co2Uptake, pv: r.poreVolume, label: ConfigLabel(cfg) })),
    };
  }), [selected]);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 text-sm font-semibold hover:bg-blue-500/20 transition-colors"
      >
        <GitCompare className="w-4 h-4" />
        Compare Configs
        {selected.length > 0 && (
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold">{selected.length}</span>
        )}
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="relative w-full max-w-5xl glass-card rounded-3xl border border-border shadow-2xl z-10"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <GitCompare className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="font-space font-bold text-lg">Biochar Configuration Comparison</h2>
                    <p className="text-xs text-muted-foreground">Select up to 8 configs to compare side-by-side</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: selector */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-space font-semibold text-sm mb-3">Add Configuration</h3>
                    <ConfigSelector onAdd={addConfig} added={selected} />
                  </div>

                  {/* Selected list */}
                  {selected.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-space font-semibold text-sm">Selected ({selected.length}/8)</h3>
                        <button onClick={clearAll} className="text-[10px] text-red-500 hover:text-red-600 flex items-center gap-1">
                          <Trash2 className="w-3 h-3" /> Clear
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        {selected.map(cfg => (
                          <div key={cfg.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50 border border-border">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cfg._color }} />
                            <span className="text-xs flex-1 truncate">{ConfigLabel(cfg)}</span>
                            <button onClick={() => removeConfig(cfg.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: charts */}
                <div className="lg:col-span-2 space-y-4">
                  {selected.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed border-border">
                      <GitCompare className="w-10 h-10 text-muted-foreground/40 mb-3" />
                      <p className="text-sm font-medium text-muted-foreground">Add configurations to compare</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Search and select from the panel on the left</p>
                    </div>
                  ) : (
                    <>
                      {/* Chart mode toggle */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setChartMode('bar')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${chartMode === 'bar' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'text-muted-foreground hover:bg-muted'}`}
                        >
                          <BarChart3 className="w-3.5 h-3.5" /> Bar Chart
                        </button>
                        <button
                          onClick={() => setChartMode('scatter')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${chartMode === 'scatter' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' : 'text-muted-foreground hover:bg-muted'}`}
                        >
                          <ScatterChart className="w-3.5 h-3.5" /> Scatter Plot
                        </button>
                      </div>

                      {chartMode === 'bar' && (
                        <div className="space-y-4">
                          <div className="rounded-xl bg-muted/30 border border-border p-4">
                            <p className="text-xs font-semibold text-muted-foreground mb-3">Average CO₂ Uptake (mmol/g) — all conditions</p>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={barData} margin={{ top: 4, right: 12, left: -10, bottom: 4 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                                <XAxis dataKey="label" tick={{ fontSize: 9 }} interval={0} angle={-20} textAnchor="end" height={50} />
                                <YAxis tick={{ fontSize: 10 }} domain={[0, 8]} />
                                <Tooltip formatter={(v) => [v + ' mmol/g', 'Avg CO₂']} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                                <Bar dataKey="avgCO2" radius={[4, 4, 0, 0]}>
                                  {barData.map((d, i) => <Cell key={i} fill={d.color} />)}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="rounded-xl bg-muted/30 border border-border p-4">
                            <p className="text-xs font-semibold text-muted-foreground mb-3">Peak CO₂ Uptake vs BET Surface Area</p>
                            <ResponsiveContainer width="100%" height={180}>
                              <BarChart data={barData} margin={{ top: 4, right: 12, left: -10, bottom: 4 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                                <XAxis dataKey="label" tick={{ fontSize: 9 }} interval={0} angle={-20} textAnchor="end" height={50} />
                                <YAxis yAxisId="left" tick={{ fontSize: 10 }} label={{ value: 'mmol/g', angle: -90, position: 'insideLeft', fontSize: 9, offset: 10 }} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} label={{ value: 'm²/g', angle: 90, position: 'insideRight', fontSize: 9, offset: 10 }} />
                                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                                <Bar yAxisId="left" dataKey="maxCO2" name="Peak CO₂ (mmol/g)" radius={[4, 4, 0, 0]} opacity={0.9}>
                                  {barData.map((d, i) => <Cell key={i} fill={d.color} />)}
                                </Bar>
                                <Bar yAxisId="right" dataKey="surfaceArea" name="BET Area (m²/g)" radius={[4, 4, 0, 0]} opacity={0.4}>
                                  {barData.map((d, i) => <Cell key={i} fill={d.color} />)}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {chartMode === 'scatter' && (
                        <div className="rounded-xl bg-muted/30 border border-border p-4">
                          <p className="text-xs font-semibold text-muted-foreground mb-3">BET Surface Area vs CO₂ Uptake (all isotherm points)</p>
                          <ResponsiveContainer width="100%" height={340}>
                            <RScatter margin={{ top: 4, right: 12, left: -10, bottom: 4 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                              <XAxis type="number" dataKey="x" name="BET Surface Area" unit=" m²/g" tick={{ fontSize: 10 }} label={{ value: 'BET Surface Area (m²/g)', position: 'insideBottom', offset: -2, fontSize: 10 }} />
                              <YAxis type="number" dataKey="y" name="CO₂ Uptake" unit=" mmol/g" tick={{ fontSize: 10 }} label={{ value: 'CO₂ Uptake (mmol/g)', angle: -90, position: 'insideLeft', fontSize: 10, offset: 10 }} domain={[0, 8]} />
                              <Tooltip content={<CustomScatterTooltip />} />
                              <Legend wrapperStyle={{ fontSize: 10 }} />
                              {scatterData.map(series => (
                                <Scatter key={series.name} name={series.name} data={series.points} fill={series.color} opacity={0.85} />
                              ))}
                            </RScatter>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {/* Summary table */}
                      <div className="rounded-xl bg-muted/30 border border-border overflow-hidden">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-border bg-muted/50">
                              {['Config', 'BET (m²/g)', 'Avg CO₂', 'Peak CO₂', 'Act. Type'].map(h => (
                                <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {barData.map((d, i) => (
                              <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                                <td className="px-3 py-2 flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                                  <span className="truncate max-w-[120px]">{d.label}</span>
                                </td>
                                <td className="px-3 py-2 font-mono">{d.surfaceArea.toLocaleString()}</td>
                                <td className="px-3 py-2 font-bold" style={{ color: d.color }}>{d.avgCO2}</td>
                                <td className="px-3 py-2 font-bold text-green-600">{d.maxCO2}</td>
                                <td className="px-3 py-2 text-muted-foreground">{selected[i]?.activationType}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}