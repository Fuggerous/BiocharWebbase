import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Flame, Layers, ChevronDown, Thermometer, Clock, TrendingUp, FlaskConical, Database, ShieldCheck, ArrowRight, Brain } from 'lucide-react';
import { estimateProperties } from '../lib/properyEstimatorLogic';
import { buildPropertyShapAnalysis } from '../lib/properyEstimatorLogic';
import PropReportExporter from '../components/property/PropReportExporter';
import { BIOMASS_LIST, ACTIVATOR_LIST } from '../lib/database44';
import { mlPipelineLookup, elasticnetSaLookup, mlpSaLookup } from '../lib/mlPredictor';
import { PROP_MODELS, SA_COMPARISON, PV_NOTE } from '../lib/modelRegistry';
import ModelSelector from '../components/shared/ModelSelector';
import ModelAccuracyChart from '../components/shared/ModelAccuracyChart';
import PropertyShapAnalysis from '../components/property/PropertyShapAnalysis';
import PropDataDensityGauge from '../components/property/PropDataDensityGauge';
import PredictionDisclaimer from '../components/shared/PredictionDisclaimer';
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
  const [selectedModel, setSelectedModel] = useState('knn');

  const set = (k, v) => setParams(p => ({ ...p, [k]: v }));

  const [mlResult, setMlResult] = useState(null);
  const [extraResult, setExtraResult] = useState(null); // elasticnet or mlp
  const [shapAnalysis, setShapAnalysis] = useState(null);

  const handleRun = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 900));
      const res = estimateProperties(params);
      setResult(res);
      const knnPred = mlPipelineLookup({
        biomass:       params.biomass,
        temperature:   params.pyroTemp,
        activator:     params.activator,
        residenceTime: params.residenceTime,
        heatingRate:   10,
      });
      setMlResult(knnPred);

      // Run selected extra model if applicable
      const lookupArgs = { biomass: params.biomass, temperature: params.pyroTemp,
        activator: params.activator, residenceTime: params.residenceTime, heatingRate: 10 };
      if (selectedModel === 'elasticnet') {
        setExtraResult(elasticnetSaLookup(lookupArgs));
      } else if (selectedModel === 'mlp') {
        setExtraResult(mlpSaLookup(lookupArgs));
      } else {
        setExtraResult(null);
      }

      // Build SHAP analysis safely
      try {
        const shap = buildPropertyShapAnalysis({ modelId: selectedModel, params });
        setShapAnalysis(shap);
      } catch (shapErr) {
        console.error('SHAP analysis failed', shapErr);
        setShapAnalysis(null);
      }
    } catch (err) {
      console.error('Property estimation failed', err);
      const stackShort = err?.stack ? err.stack.split('\n').slice(0,4).join('\n') : undefined;
      setResult({ error: err?.message || String(err), stack: stackShort });
      setMlResult(null);
      setExtraResult(null);
      setShapAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const elemData = result
    ? Object.entries(result.elemental).map(([k, v]) => ({ name: k, value: v, fill: ELEM_COLORS[k] }))
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-950 dark:via-amber-950 dark:to-slate-950 pt-24 pb-12 relative overflow-hidden border-b border-amber-100 dark:border-amber-900/30">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/30 dark:bg-amber-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-orange-200/20 dark:bg-orange-900/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-300 mb-4">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-amber-700 text-sm font-medium">BioChar Property Estimator · 44-Record Database · Pyrolysis Analysis</span>
            </div>
            <h1 className="font-space font-bold text-4xl lg:text-5xl text-foreground mb-3">
              Biochar Property<br />
              <span className="text-amber-600">Estimator</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Estimate key biochar properties from pyrolysis parameters using statistical matching against peer-reviewed experimental records.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {[
                { icon: FlaskConical, label: 'Parameter-Driven', desc: 'Biomass type · Pyrolysis temp · Residence time · Activator' },
                { icon: Database, label: 'Database-Backed', desc: '44 curated biochar records · 8 biomass species · validated data' },
                { icon: Brain, label: 'Multi-Model Output', desc: 'Elemental composition · Surface area · Pore volume · Yield' },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center">
                    <f.icon className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground text-xs">{f.label}</p>
                    <p className="text-muted-foreground text-[10px]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-6">
          <PredictionDisclaimer accentColor="amber" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass-card rounded-3xl p-8 border border-border">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 mb-6">
                <Database className="w-4 h-4 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700">
                  <span className="font-semibold">Inputs:</span> Pyrolysis conditions matched against Database records
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

                {/* Model selector */}
                <div className="space-y-2 pt-1">
                  <label className="text-sm font-medium flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-indigo-500" /> ML Model
                    <span className="text-xs font-normal text-muted-foreground ml-1">— DB Lookup always shown</span>
                  </label>
                  <ModelSelector
                    models={PROP_MODELS}
                    selected={selectedModel}
                    onChange={setSelectedModel}
                    context="prop"
                  />
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
                <p className="text-sm text-muted-foreground/60 mt-1">Structural property estimates will appear here</p>
              </div>
            ) : result.error ? (
              <div className="glass-card rounded-2xl p-6 border border-rose-200 bg-rose-50">
                <h3 className="font-space font-semibold text-base text-rose-700">Estimation Error</h3>
                <p className="text-sm text-rose-700 mt-2">{result.error}</p>
                {result.stack && (
                  <pre className="text-[11px] mt-2 p-3 bg-white/50 rounded text-rose-800 overflow-auto">{result.stack}</pre>
                )}
                <p className="text-xs text-muted-foreground mt-2">See browser console for full stack trace.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Confidence header */}
                <div className="glass-card rounded-2xl p-5 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-space font-semibold text-base">Property Estimate</h3>
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
                      {result.poreVolume
                        ? <span className="font-bold text-purple-500">{result.poreVolume.mean} cm³/g (mean)</span>
                        : <span className="font-semibold text-amber-500 flex items-center gap-1">⚠ N/A</span>
                      }
                    </div>
                    {result.poreVolume ? (
                      <>
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
                      </>
                    ) : (
                      <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 mt-1">
                        <span className="text-amber-500 text-xs mt-0.5">⚠</span>
                        <p className="text-[11px] text-amber-700 leading-snug">
                          <strong>No pore volume data</strong> in the {result.dataPointsUsed} matched record{result.dataPointsUsed !== 1 ? 's' : ''}.
                          Pore volume was not measured or reported for this synthesis condition.
                          Use the KNN ML estimate below as a reference.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ML Model comparison */}
                {mlResult && (
                  <div className={`glass-card rounded-2xl p-5 border ${selectedModel === 'knn' ? 'border-purple-500/60 ring-1 ring-purple-500/30' : 'border-purple-500/25'}`}>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Brain className="w-4 h-4 text-purple-500" />
                      <h3 className="font-space font-semibold text-sm">KNN Property Estimator</h3>
                      <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 font-semibold border border-purple-500/20">
                        R²={mlResult.r2_prop}
                      </span>
                      {selectedModel === 'knn' && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500 text-white font-bold">★ Selected</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'BET Surface Area', db: result.surfaceArea.mean, ml: mlResult.sa, unit: 'm²/g', color: '#f59e0b', dbNull: false },
                        { label: 'Pore Volume', db: result.poreVolume?.mean ?? null, ml: +(mlResult.pv * 1e6).toFixed(3), unit: 'cm³/kg×10⁶', color: '#a855f7', dbNull: !result.poreVolume },
                      ].map(item => (
                        <div key={item.label} className="p-3 rounded-xl bg-muted/40 border border-border space-y-1">
                          <p className="text-[10px] font-semibold text-muted-foreground">{item.label}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">DB lookup</span>
                            {item.dbNull
                              ? <span className="font-semibold text-amber-500 text-[10px]">N/A</span>
                              : <span className="font-bold text-amber-600">{item.db.toLocaleString()}</span>
                            }
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">KNN model</span>
                            <span className={`font-bold ${selectedModel === 'knn' ? 'underline underline-offset-2' : ''}`} style={{ color: item.color }}>{item.ml.toLocaleString()}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {item.dbNull ? 'DB has no data — use KNN estimate' : `Δ = ${Math.abs(item.db - item.ml).toFixed(1)} ${item.unit}`}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      Agreement with DB lookup = higher reliability. Underlined value = your selected model's output.
                    </p>
                  </div>
                )}

                {/* ElasticNet / MLP result (shown when selected + export script run) */}
                {(selectedModel === 'elasticnet' || selectedModel === 'mlp') && (
                  <div className={`glass-card rounded-2xl p-4 border ${
                    selectedModel === 'elasticnet' ? 'border-cyan-500/40' : 'border-green-500/40'
                  }`}>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Brain className="w-4 h-4" style={{ color: selectedModel === 'elasticnet' ? '#06b6d4' : '#22c55e' }} />
                      <span className="font-space font-semibold text-sm">
                        {selectedModel === 'elasticnet' ? 'ElasticNet' : 'MLP'} BET Estimate
                      </span>
                      <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold border"
                        style={{ color: selectedModel === 'elasticnet' ? '#0e7490' : '#15803d',
                                 background: selectedModel === 'elasticnet' ? '#06b6d408' : '#22c55e08',
                                 borderColor: selectedModel === 'elasticnet' ? '#06b6d430' : '#22c55e30' }}>
                        ★ Your Selected ML Model
                      </span>
                    </div>
                    {extraResult ? (
                      <div className="p-3 rounded-xl bg-muted/40 border border-border">
                        <p className="text-xs font-semibold text-muted-foreground mb-1">BET Surface Area</p>
                        <p className="text-lg font-space font-bold"
                          style={{ color: selectedModel === 'elasticnet' ? '#06b6d4' : '#22c55e' }}>
                          {extraResult.sa?.toLocaleString() ?? '—'} <span className="text-sm font-normal text-muted-foreground">m²/g</span>
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                        <p className="text-[11px] text-amber-700">
                          <strong>Export required.</strong> Run{' '}
                          <code className="bg-amber-100 px-1 rounded font-mono">python ML/ml_export_additional_models.py</code>{' '}
                          to generate prediction data for this model.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Data Density & Confidence gauge */}
                <PropDataDensityGauge result={result} params={params} />

                {shapAnalysis && (
                  <PropertyShapAnalysis analysis={shapAnalysis} />
                )}


                {/* Model Accuracy Chart — full training comparison */}
                <ModelAccuracyChart
                  data={SA_COMPARISON}
                  title="BET Surface Area — Model Training Comparison"
                  subtitle="All trained models · KNN deployed on platform · others trained in Python"
                  note={PV_NOTE}
                  xLabel="R² Score (cross-validated test set)"
                />

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

                {/* Export report */}
                <PropReportExporter result={result} params={params} mlResult={mlResult} shapAnalysis={shapAnalysis} />

                {/* Next phase CTA */}
                <a href="/predictor"
                  className="flex items-center justify-between w-full px-5 py-4 rounded-2xl gradient-green text-white font-semibold glow-green hover:scale-[1.02] transition-transform group">
                  <div>
                    <p className="font-space font-bold text-sm">Go to CO₂ Estimator</p>
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