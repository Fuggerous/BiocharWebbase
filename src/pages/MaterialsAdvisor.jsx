import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { reverseQuery, getCoverageMatrix } from '../components/advisor/AdvisorEngine';
import { BIOMASS_LIST, BIOMASS_COLORS, BIOMASS_SPECIES_MAP } from '../lib/database44';
import { DB_OVERALL_MIN, DB_OVERALL_MAX } from '../lib/biocharKnowledgeBase';
import { mlPipelineLookup } from '../lib/mlPredictor';
import { Brain } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Cell, LabelList,
} from 'recharts';
import { Lightbulb, FlaskConical, Info, RotateCcw, Target, TrendingUp, Award, Sliders } from 'lucide-react';
import FeasibilityGauge from '../components/advisor/FeasibilityGauge';

const ACTIVATION_COLORS = {
  KOH:      '#22c55e',
  K2CO3:    '#3b82f6',
  'KOH-CO2':'#a855f7',
  CO2:      '#f59e0b',
  LiCl:     '#06b6d4',
  None:     '#94a3b8',
};

const ACTIVATION_TYPE_STYLE = {
  Chemical: 'bg-green-500/10 text-green-600 border-green-500/20',
  Combined: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  Physical: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  None:     'bg-muted text-muted-foreground border-border',
};

function RankBadge({ rank }) {
  const styles = ['gradient-green', 'gradient-blue', 'bg-purple-500'];
  return (
    <div className={`w-7 h-7 rounded-full ${styles[rank] || 'bg-muted'} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
      {rank + 1}
    </div>
  );
}

function ResultCard({ result, rank, target }) {
  const delta = (result.meanCO2 - target).toFixed(3);
  const sign = delta >= 0 ? '+' : '';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.08 }}
      className={`glass-card rounded-2xl p-5 border ${rank === 0 ? 'border-green-400/40 ring-1 ring-green-400/20' : 'border-border'}`}
    >
      <div className="flex items-start gap-3 mb-4">
        <RankBadge rank={rank} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-space font-bold text-base">
              {result.activator === 'None' ? 'No Activation' : result.activator} · {result.pyroTemp}°C
            </span>
            {rank === 0 && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                <Award className="w-3 h-3" /> Best Match
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-1.5">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${ACTIVATION_TYPE_STYLE[result.activationType] || ACTIVATION_TYPE_STYLE['None']}`}>
              {result.activationType}
            </span>
            {result.biomasses.map(b => (
              <span key={b} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: BIOMASS_COLORS[b] }} />
                {b.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>
        {/* CO2 target delta */}
        <div className="text-right flex-shrink-0">
          <p className="font-space font-bold text-2xl text-green-500">{result.meanCO2}</p>
          <p className="text-xs text-muted-foreground">mmol/g mean</p>
          <p className={`text-xs font-semibold mt-0.5 ${Math.abs(delta) < 0.2 ? 'text-green-500' : 'text-amber-500'}`}>
            {sign}{delta} vs target
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'Min CO₂', value: `${result.minCO2} mmol/g`, color: 'text-amber-500' },
          { label: 'Max CO₂', value: `${result.maxCO2} mmol/g`, color: 'text-blue-500' },
          { label: 'BET Area', value: `${result.avgSurface.toLocaleString()} m²/g`, color: 'text-purple-500' },
        ].map(s => (
          <div key={s.label} className="bg-muted/50 rounded-xl p-2.5">
            <p className={`font-space font-bold text-sm ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Data support */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Info className="w-3.5 h-3.5" />
        Supported by <span className="font-semibold text-foreground">{result.count}</span> matching isotherm record{result.count !== 1 ? 's' : ''} in 44Database
      </div>
    </motion.div>
  );
}

export default function MaterialsAdvisor() {
  const [targetCO2, setTargetCO2] = useState(4.5);
  const [biomass, setBiomass] = useState('All');
  const [tolerance, setTolerance] = useState(0.75);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [secondaryObjective, setSecondaryObjective] = useState('none');
  const [tertiaryObjective, setTertiaryObjective] = useState('none');

  const coverageData = getCoverageMatrix();

  const [mlValidations, setMlValidations] = useState({});

  const handleAnalyze = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const res = reverseQuery({ targetCO2, biomass, tolerance, secondaryObjective, tertiaryObjective });
    setResult(res);
    // Run ML pipeline for top-6 results
    const validations = {};
    (res.results || []).slice(0, 6).forEach((r, i) => {
      const ml = mlPipelineLookup({
        biomass:       r.biomasses?.[0] ?? (biomass !== 'All' ? biomass : 'Corn straw'),
        temperature:   r.pyroTemp,
        activator:     r.activator === 'None' ? 'Non' : r.activator,
        residenceTime: r.avgResidenceTime ?? 60,
        heatingRate:   10,
      });
      if (ml) validations[i] = ml;
    });
    setMlValidations(validations);
    setLoading(false);
  };

  const reset = () => { setResult(null); setMlValidations({}); };

  // Radar data from top result
  const radarData = result?.results?.[0] ? [
    { subject: 'CO₂ Match', A: Math.max(0, 100 - result.results[0].closeness * 30) },
    { subject: 'Surface Area', A: Math.min(100, result.results[0].avgSurface / 30) },
    { subject: 'Data Support', A: Math.min(100, result.results[0].count * 15) },
    { subject: 'Temp Efficiency', A: Math.max(0, 100 - (result.results[0].pyroTemp - 400) / 5) },
    { subject: 'Activation Score', A: result.results[0].activator !== 'None' ? 75 : 40 },
  ] : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 pt-24 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-5">
              <Lightbulb className="w-4 h-4 text-indigo-400" />
              <span className="text-indigo-300 text-sm font-medium">Reverse-Lookup · Data-Driven</span>
            </div>
            <h1 className="font-space font-bold text-4xl lg:text-5xl text-white mb-3">
              Materials <span className="text-green-400">Advisor</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Tell us your target CO₂ uptake capacity. We'll reverse-search the 44Database to recommend the optimal activator and pyrolysis temperature for your biochar production.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

        {/* Input Panel */}
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="glass-card rounded-3xl p-8 border border-border max-w-2xl mx-auto">
                <h2 className="font-space font-bold text-xl mb-1 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-500" /> Define Your Target
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Set your desired CO₂ uptake and we'll find the production parameters that achieve it in the research database.
                </p>

                {/* Target CO2 Slider */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold">Target CO₂ Uptake</label>
                    <div className="flex items-center gap-1">
                      <input type="number" value={targetCO2} min={0.1} max={7.5} step={0.1}
                        onChange={e => setTargetCO2(Math.min(7.5, Math.max(0.1, Number(e.target.value))))}
                        className="w-20 text-right px-2 py-1 rounded-lg bg-muted border border-border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                      <span className="text-xs text-muted-foreground">mmol/g</span>
                    </div>
                  </div>
                  <input type="range" min={0.1} max={7.5} step={0.1} value={targetCO2}
                    onChange={e => setTargetCO2(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, #6366f1 ${((targetCO2 - 0.1) / 7.4) * 100}%, #e2e8f0 ${((targetCO2 - 0.1) / 7.4) * 100}%)` }}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>0.1 mmol/g (min in DB)</span>
                    <span>7.5 mmol/g (max in DB)</span>
                  </div>
                  {/* Target indicator */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                    <TrendingUp className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <p className="text-xs text-indigo-300">
                      Target: <span className="font-bold text-indigo-200">{targetCO2} mmol/g</span> ·{' '}
                      {targetCO2 >= 6 ? 'High performance (top 10% of database)' :
                       targetCO2 >= 4 ? 'Above average (strong activation needed)' :
                       targetCO2 >= 2.5 ? 'Moderate (achievable with various methods)' :
                       'Low uptake (baseline / unactivated range)'}
                    </p>
                  </div>
                </div>

                {/* Tolerance */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold">Acceptable Tolerance <span className="text-xs text-muted-foreground font-normal">(±mmol/g)</span></label>
                    <span className="text-sm font-bold text-indigo-500">±{tolerance}</span>
                  </div>
                  <input type="range" min={0.2} max={2.0} step={0.05} value={tolerance}
                    onChange={e => setTolerance(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, #22c55e ${((tolerance - 0.2) / 1.8) * 100}%, #e2e8f0 ${((tolerance - 0.2) / 1.8) * 100}%)` }}
                  />
                  <p className="text-xs text-muted-foreground">Narrow = precise match · Wide = more options</p>
                </div>

                {/* Multi-Objective Constraints */}
                {[
                  { label: 'Secondary Objective', value: secondaryObjective, set: setSecondaryObjective, exclude: 'none' },
                  { label: 'Tertiary Objective', value: tertiaryObjective, set: setTertiaryObjective, exclude: secondaryObjective },
                ].map(({ label, value, set, exclude }) => (
                  <div key={label} className="space-y-2 mb-6">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-purple-500" /> {label} <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { value: 'none',          label: 'None', color: 'border-border bg-muted text-muted-foreground' },
                        { value: 'energy',        label: '⚡ Minimize Pyrolysis Temperature (Energy Saving)', color: 'border-amber-400/40 bg-amber-500/5 text-amber-700' },
                        { value: 'cost',          label: '💰 Minimize Chemical Activator (Cost Saving)', color: 'border-blue-400/40 bg-blue-500/5 text-blue-700' },
                        { value: 'residenceTime', label: '⏱ Minimize Residence Time (Process Speed)', color: 'border-cyan-400/40 bg-cyan-500/5 text-cyan-700' },
                        { value: 'poreVolume',    label: '🔬 Maximize Pore Volume (Adsorption Capacity)', color: 'border-purple-400/40 bg-purple-500/5 text-purple-700' },
                      ].filter(opt => opt.value === 'none' || opt.value !== exclude).map(opt => (
                        <button key={opt.value} onClick={() => set(opt.value)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold border text-left transition-all ${
                            value === opt.value
                              ? opt.color + ' ring-1 ring-current'
                              : 'border-border bg-muted/50 text-muted-foreground hover:text-foreground'
                          }`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Biomass preference */}
                <div className="space-y-2 mb-8">
                  <label className="text-sm font-semibold">Biomass Preference (optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {['All', ...Object.keys(BIOMASS_SPECIES_MAP)].map(s => (
                      <button key={s} onClick={() => setBiomass(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          biomass === s
                            ? 'border-indigo-400 bg-indigo-500/10 text-indigo-300'
                            : 'border-border bg-muted text-muted-foreground hover:text-foreground'
                        }`}>
                        {s === 'All' ? 'Any Species' : s}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleAnalyze} disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-space font-bold text-lg hover:scale-[1.02] transition-all disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-3">
                  {loading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing Database...</>
                  ) : (
                    <><Lightbulb className="w-5 h-5" /> Find Optimal Parameters</>
                  )}
                </button>
              </div>

              {/* Coverage heatmap preview */}
              <div className="glass-card rounded-2xl p-5 border border-border mt-6">
                <h3 className="font-space font-semibold text-sm mb-1">Mean CO₂ Uptake by Activator × Pyrolysis Temperature</h3>
                <p className="text-xs text-muted-foreground mb-4">Real database averages — helps visualize what's achievable before running the advisor</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 font-semibold text-muted-foreground uppercase tracking-wider">Activator</th>
                        {[400, 550, 600, 700, 800].map(t => (
                          <th key={t} className="text-center py-2 px-3 font-semibold text-muted-foreground uppercase tracking-wider">{t}°C</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {coverageData.map((row, i) => (
                        <tr key={row.activator} className={`border-b border-border/50 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                          <td className="py-2 px-3 font-semibold">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ background: ACTIVATION_COLORS[row.activator] }} />
                              {row.activator}
                            </span>
                          </td>
                          {[400, 550, 600, 700, 800].map(t => {
                            const val = row[`t${t}`];
                            const intensity = val ? Math.min(1, val / 7.5) : 0;
                            return (
                              <td key={t} className="py-2 px-3 text-center">
                                {val != null ? (
                                  <span className="px-2 py-1 rounded-lg font-bold text-xs"
                                    style={{
                                      background: `rgba(34,197,94,${intensity * 0.35 + 0.05})`,
                                      color: intensity > 0.5 ? '#16a34a' : '#6b7280'
                                    }}>
                                    {val}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground/30">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              {/* Results Header */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-space font-bold text-2xl">
                    {result.mode === 'match' ? `${result.results.length} Parameter Sets Found` : 'Nearest Matches Found'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    For target: <span className="font-bold text-foreground">{targetCO2} mmol/g</span>
                    {result.mode === 'match' ? ` · within ±${tolerance} mmol/g` : ' (no exact match — showing closest)'}
                    {biomass !== 'All' ? ` · ${biomass}` : ''}
                  </p>
                </div>
                <button onClick={reset}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted text-sm font-medium transition-colors">
                  <RotateCcw className="w-4 h-4" /> New Query
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: ranked cards */}
                <div className="lg:col-span-2 space-y-4">
                  {result.results.map((r, i) => {
                    const ml = mlValidations[i];
                    return (
                      <div key={i} className="space-y-2">
                        <ResultCard result={r} rank={i} target={targetCO2} />
                        {ml && (
                          <div className="ml-2 px-4 py-2.5 rounded-xl border border-purple-500/20 bg-purple-500/5 flex items-center gap-4 flex-wrap text-xs">
                            <div className="flex items-center gap-1.5">
                              <Brain className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                              <span className="font-semibold text-purple-700">ML Validation</span>
                            </div>
                            <div className="flex gap-4 flex-wrap">
                              <span>
                                <span className="text-muted-foreground">CO₂ predicted: </span>
                                <span className={`font-bold ${Math.abs(ml.co2 - r.meanCO2) < 0.5 ? 'text-green-600' : 'text-amber-600'}`}>
                                  {ml.co2} mmol/g
                                </span>
                              </span>
                              <span>
                                <span className="text-muted-foreground">BET: </span>
                                <span className="font-semibold text-purple-600">{ml.sa.toLocaleString()} m²/g</span>
                              </span>
                              <span>
                                <span className="text-muted-foreground">Agreement: </span>
                                <span className={`font-bold ${Math.abs(ml.co2 - r.meanCO2) < 0.3 ? 'text-green-600' : Math.abs(ml.co2 - r.meanCO2) < 0.7 ? 'text-amber-600' : 'text-red-500'}`}>
                                  {Math.abs(ml.co2 - r.meanCO2) < 0.3 ? '✓ High' : Math.abs(ml.co2 - r.meanCO2) < 0.7 ? '~ Moderate' : '✗ Low'}
                                </span>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Right: Radar + Feasibility + bar */}
                <div className="space-y-4">
                  {/* Feasibility Gauge for top result */}
                  {result.results[0] && (
                    <FeasibilityGauge
                      activator={result.results[0].activator}
                      pyroTemp={result.results[0].pyroTemp}
                      blends={result.results[0].blends}
                      avgResidenceTime={result.results[0].avgResidenceTime}
                    />
                  )}

                  {/* Radar for top result */}
                  <div className="glass-card rounded-2xl p-5 border border-border">
                    <h3 className="font-space font-semibold text-sm mb-1">Top Match · Quality Score</h3>
                    <p className="text-xs text-muted-foreground mb-3">Multi-dimensional suitability analysis</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="rgba(0,0,0,0.08)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9 }} />
                        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.25} strokeWidth={2} />
                        <Tooltip formatter={v => [`${Math.round(v)}%`, 'Score']} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Activator bar comparison */}
                  <div className="glass-card rounded-2xl p-5 border border-border">
                    <h3 className="font-space font-semibold text-sm mb-1">Mean CO₂ by Result</h3>
                    <p className="text-xs text-muted-foreground mb-3">Ranked matches vs your target</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={result.results.map((r, i) => ({ name: `#${i + 1} ${r.activator}`, co2: r.meanCO2, temp: r.pyroTemp }))}
                        margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                        <XAxis dataKey="name" tick={{ fontSize: 8 }} />
                        <YAxis tick={{ fontSize: 10 }} unit=" mmol/g" />
                        <Tooltip formatter={(v, n) => [`${v} mmol/g`, n]} />
                        {/* Target reference line rendered as bar annotation */}
                        <Bar dataKey="co2" name="Mean CO₂" radius={[4, 4, 0, 0]}>
                          {result.results.map((r, i) => (
                            <Cell key={i} fill={ACTIVATION_COLORS[r.activator] || '#94a3b8'} />
                          ))}
                          <LabelList dataKey="co2" position="top" style={{ fontSize: 9, fontWeight: 700 }} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    {/* Target line label */}
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="w-6 h-0.5 bg-red-400 inline-block rounded" /> Target: {targetCO2} mmol/g
                    </div>
                  </div>
                </div>
              </div>

              {/* Scientific interpretation */}
              <div className="glass-card rounded-2xl p-6 border border-border">
                <h3 className="font-space font-semibold text-base mb-4 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-green-500" /> Scientific Interpretation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/15">
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-1">Recommended Activator</p>
                    <p className="font-space font-bold text-lg">{result.results[0]?.activator}</p>
                    <p className="text-xs text-muted-foreground mt-1">{result.results[0]?.activationType} activation · highest match score in database</p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">Optimal Pyrolysis Temp</p>
                    <p className="font-space font-bold text-lg">{result.results[0]?.pyroTemp}°C</p>
                    <p className="text-xs text-muted-foreground mt-1">Avg BET surface area: {result.results[0]?.avgSurface?.toLocaleString()} m²/g at this condition</p>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                    <p className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">Expected Outcome</p>
                    <p className="font-space font-bold text-lg">{result.results[0]?.minCO2}–{result.results[0]?.maxCO2} <span className="text-sm font-normal">mmol/g</span></p>
                    <p className="text-xs text-muted-foreground mt-1">Range from {result.results[0]?.count} peer-reviewed records</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}