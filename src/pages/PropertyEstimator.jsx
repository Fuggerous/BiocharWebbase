import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Flame, Layers, ChevronDown, Thermometer, Clock, TrendingUp, FlaskConical, Database, ShieldCheck, ArrowRight } from 'lucide-react';
import { estimateProperties } from '../lib/propertyEstimatorLogic';
import { BIOMASS_LIST, ACTIVATOR_LIST } from '../lib/database44';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ELEM_COLORS = { C: '#22c55e', H: '#3b82f6', O: '#f59e0b', N: '#a855f7', S: '#ef4444' };

const confidenceColors = {
  High: 'bg-green-100 text-green-700 border-green-200',
  Moderate: 'bg-blue-100 text-blue-700 border-blue-200',
  Indicative: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function PropertyEstimator() {
  const [params, setParams] = useState({ biomass: 'Corn straw', pyroTemp: 600, residenceTime: 60, activator: 'KOH' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setParams(p => ({ ...p, [k]: v }));

  const handleRun = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const res = estimateProperties(params);
    setResult(res);
    setLoading(false);
  };

  const elemData = result
    ? Object.entries(result.elemental).map(([k, v]) => ({ name: k, value: v, fill: ELEM_COLORS[k] }))
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Phase 1 → Phase 2 · Forward Pathway</span>
            </div>
            <h1 className="font-space font-bold text-4xl lg:text-5xl text-white mb-3">
              Biochar Property<br />
              <span className="text-amber-400">Estimator</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Input pyrolysis conditions → get estimated BET Surface Area, Pore Volume, and CHNS-O elemental composition from matching database records.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass-card rounded-3xl p-8 border border-border">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 mb-6">
                <Database className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700">
                  <span className="font-semibold">Phase 1 Inputs:</span> Pyrolysis conditions matched against 44Database records
                </p>
              </div>

              <div className="space-y-6">
                {/* Biomass */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-amber-500" /> Biomass Species
                  </label>
                  <div className="relative">
                    <select value={params.biomass} onChange={e => set('biomass', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/30">
                      {BIOMASS_LIST.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Pyro Temp */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Thermometer className="w-4 h-4 text-muted-foreground" /> Pyrolysis Temperature
                    </label>
                    <div className="flex items-center gap-1">
                      <input type="number" value={params.pyroTemp} min={300} max={900} step={50}
                        onChange={e => set('pyroTemp', Number(e.target.value))}
                        className="w-20 text-right px-2 py-1 rounded-lg bg-muted border border-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
                      <span className="text-xs text-muted-foreground">°C</span>
                    </div>
                  </div>
                  <input type="range" min={300} max={900} step={50} value={params.pyroTemp}
                    onChange={e => set('pyroTemp', Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, #f59e0b ${((params.pyroTemp - 300) / 600) * 100}%, #e2e8f0 ${((params.pyroTemp - 300) / 600) * 100}%)` }} />
                  <div className="flex justify-between text-[10px] text-muted-foreground"><span>300°C</span><span>900°C</span></div>
                </div>

                {/* Residence Time */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="w-4 h-4 text-muted-foreground" /> Residence Time
                    </label>
                    <div className="flex items-center gap-1">
                      <input type="number" value={params.residenceTime} min={10} max={300} step={10}
                        onChange={e => set('residenceTime', Number(e.target.value))}
                        className="w-20 text-right px-2 py-1 rounded-lg bg-muted border border-border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/30" />
                      <span className="text-xs text-muted-foreground">min</span>
                    </div>
                  </div>
                  <input type="range" min={10} max={300} step={10} value={params.residenceTime}
                    onChange={e => set('residenceTime', Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, #f59e0b ${((params.residenceTime - 10) / 290) * 100}%, #e2e8f0 ${((params.residenceTime - 10) / 290) * 100}%)` }} />
                  <div className="flex justify-between text-[10px] text-muted-foreground"><span>10 min</span><span>300 min</span></div>
                </div>

                {/* Activator */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-500" /> Activation Method
                  </label>
                  <div className="relative">
                    <select value={params.activator} onChange={e => set('activator', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/30">
                      {ACTIVATOR_LIST.map(a => <option key={a} value={a}>{a === 'Non' ? 'None (No Activation)' : a}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <button
                  onClick={handleRun}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl gradient-green text-white font-space font-bold text-base glow-green hover:scale-[1.02] transition-all disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-3"
                  style={{ background: loading ? undefined : 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                >
                  {loading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Matching Records...</>
                  ) : (
                    <><Layers className="w-5 h-5" /> Estimate Properties</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            {!result ? (
              <div className="glass-card rounded-3xl p-8 border border-dashed border-border flex flex-col items-center justify-center text-center h-full min-h-64">
                <Layers className="w-12 h-12 text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground font-medium">Configure parameters and run estimation</p>
                <p className="text-sm text-muted-foreground/60 mt-1">Phase 2 structural properties will appear here</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Confidence header */}
                <div className="glass-card rounded-2xl p-5 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-space font-semibold text-base">Phase 2 Property Estimate</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${confidenceColors[result.confidence]}`}>
                      <ShieldCheck className="inline w-3 h-3 mr-1" />
                      {result.confidence} · {result.dataPointsUsed} records
                    </span>
                  </div>

                  {/* BET Surface Area */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground font-medium">BET Surface Area</span>
                      <span className="font-bold text-amber-500">{result.surfaceArea.mean.toLocaleString()} m²/g (mean)</span>
                    </div>
                    <div className="h-6 bg-muted rounded-full overflow-hidden relative">
                      <div className="h-full rounded-full bg-gradient-to-r from-amber-400/50 to-amber-500 flex items-center justify-end pr-2"
                        style={{ width: `${Math.min(100, (result.surfaceArea.mean / 3200) * 100)}%` }}>
                        <span className="text-[9px] font-bold text-white">{result.surfaceArea.mean.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>Min: {result.surfaceArea.min.toLocaleString()} m²/g</span>
                      <span>Max: {result.surfaceArea.max.toLocaleString()} m²/g</span>
                    </div>
                  </div>

                  {/* Pore Volume */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground font-medium">Pore Volume</span>
                      <span className="font-bold text-purple-500">{result.poreVolume.mean} cm³/g (mean)</span>
                    </div>
                    <div className="h-6 bg-muted rounded-full overflow-hidden relative">
                      <div className="h-full rounded-full bg-gradient-to-r from-purple-400/50 to-purple-500 flex items-center justify-end pr-2"
                        style={{ width: `${Math.min(100, (result.poreVolume.mean / 1.6) * 100)}%` }}>
                        <span className="text-[9px] font-bold text-white">{result.poreVolume.mean}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>Min: {result.poreVolume.min} cm³/g</span>
                      <span>Max: {result.poreVolume.max} cm³/g</span>
                    </div>
                  </div>
                </div>

                {/* CHNS-O Elemental Composition */}
                <div className="glass-card rounded-2xl p-5 border border-border">
                  <h3 className="font-space font-semibold text-sm mb-3">Elemental Composition (CHNS-O)</h3>
                  <div className="flex gap-2 mb-3">
                    {elemData.map(e => (
                      <div key={e.name} className="flex-1 text-center p-2 rounded-xl border border-border bg-muted/30">
                        <p className="font-space font-bold text-lg" style={{ color: e.fill }}>{e.value}</p>
                        <p className="text-[9px] text-muted-foreground font-bold">%{e.name}</p>
                      </div>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={80}>
                    <BarChart data={elemData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 9 }} unit="%" domain={[0, 100]} />
                      <Tooltip formatter={v => [`${v}%`]} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {elemData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Next phase CTA */}
                <a href="/predictor"
                  className="flex items-center justify-between w-full px-5 py-4 rounded-2xl gradient-green text-white font-semibold glow-green hover:scale-[1.02] transition-transform group">
                  <div>
                    <p className="font-space font-bold text-sm">Proceed to Phase 3: CO₂ Estimator</p>
                    <p className="text-green-100/70 text-xs mt-0.5">Use these structural properties to predict CO₂ uptake</p>
                  </div>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}