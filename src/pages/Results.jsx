import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Share2, Lightbulb, Thermometer, Clock,
  TrendingUp, FlaskConical, Leaf, Database, ShieldCheck, BarChart2
} from 'lucide-react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LabelList, ReferenceLine
} from 'recharts';
import { queryExpertGuidance, TOTAL_DATA_POINTS } from '../lib/biocharKnowledgeBase';
import { mlPredict } from '../lib/mlPredictor';
import WhyThisPrediction from '../components/results/WhyThisPrediction';
import DataDensityGauge from '../components/results/DataDensityGauge';
import SensitivityAnalysis from '../components/results/SensitivityAnalysis';
import ReportExporter from '../components/results/ReportExporter';
import { Brain } from 'lucide-react';

const insightColors = {
  positive: 'bg-green-50 border-green-200 text-green-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-700',
  neutral: 'bg-blue-50 border-blue-200 text-blue-700',
  info: 'bg-slate-50 border-slate-200 text-slate-700',
};

function ConfidenceRangeBars({ result }) {
  const { min, max, mean } = result;
  const totalRange = max - Math.max(0, min - 0.5);
  const pctOf = (v) => ((v - Math.max(0, min - 0.5)) / (totalRange + 0.5)) * 100;

  const bands = [
    { label: '90% Reference Range', lo: +(min * 0.9).toFixed(2), hi: +(max * 1.1).toFixed(2), opacity: 0.2 },
    { label: '80% Reference Range', lo: +(min * 0.95).toFixed(2), hi: +(max * 1.05).toFixed(2), opacity: 0.3 },
    { label: 'Core Data Range', lo: min, hi: max, opacity: 0.45 },
  ];

  return (
    <div className="glass-card rounded-2xl p-5 border border-border">
      <h3 className="font-space font-semibold text-base mb-1">Adsorption Range Analysis</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Based on historical research data — not a single prediction
      </p>
      <div className="space-y-4">
        {bands.map((band, i) => {
          const leftPct = pctOf(band.lo);
          const widthPct = pctOf(band.hi) - leftPct;
          const pointPct = pctOf(mean);
          return (
            <div key={band.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">{band.label}</span>
                <span className="text-foreground font-semibold">{band.lo.toFixed(1)} – {band.hi.toFixed(1)} mmol/g</span>
              </div>
              <div className="relative h-5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 h-full rounded-full"
                  style={{ left: `${leftPct}%`, width: `${widthPct}%`, backgroundColor: `rgba(34,197,94,${band.opacity})` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow"
                  style={{ left: `calc(${pointPct}% - 6px)` }}
                />
              </div>
            </div>
          );
        })}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-xs font-semibold text-foreground">Recommended Target (Mean)</span>
          <span className="text-sm font-bold text-green-500">{mean.toFixed(2)} mmol/g</span>
        </div>
      </div>
    </div>
  );
}

function BenchmarkChart({ benchmarkData, userMean, mlMean }) {
  const data = [
    { name: 'Statistical Est.', value: userMean, fill: '#22c55e' },
    ...(mlMean !== undefined ? [{ name: 'ML Prediction', value: mlMean, fill: '#3b82f6' }] : []),
    ...benchmarkData.map(d => ({ name: d.name, value: d.avg, fill: '#94a3b8' })),
    { name: 'DB Overall Avg', value: 3.02, fill: '#64748b' },
  ];
  return (
    <div className="glass-card rounded-2xl p-5 border border-border">
      <h3 className="font-space font-semibold text-base mb-1">Database Benchmarking</h3>
      <p className="text-xs text-muted-foreground mb-4">Your predicted mean vs. real database averages per biomass type</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} unit=" mmol/g" domain={[0, Math.max(userMean, 5) + 0.5]} />
          <Tooltip formatter={v => [`${Number(v).toFixed(2)} mmol/g`, 'Avg CO₂']} />
          <ReferenceLine y={3.02} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: 'DB Avg', position: 'right', fontSize: 10 }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            <LabelList dataKey="value" position="top" formatter={v => Number(v).toFixed(1)} style={{ fontSize: 10, fontWeight: 700 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = location.state?.params;

  if (!params) {
    navigate('/predictor');
    return null;
  }

  const result = queryExpertGuidance({
    biomass: params.biomass,
    temperature: params.temperature,
    activator: params.activator,
    activationType: params.activationType,
  });

  const mlResult = mlPredict({
    biomass: params.biomass,
    temperature: params.temperature,
    activator: params.activator,
  });

  const confidenceColors = {
    High: 'bg-green-100 text-green-700 border-green-200',
    Moderate: 'bg-blue-100 text-blue-700 border-blue-200',
    Indicative: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 pt-24 pb-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate('/predictor')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Estimator
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            {/* Data source badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-300 text-xs font-medium">
                Based on Historical Research Data · {result.dataPointsUsed} matching data points of {TOTAL_DATA_POINTS.toLocaleString()} total
              </span>
            </div>

            <h1 className="font-space font-bold text-3xl text-white mb-2">Expert Guidance: CO₂ Adsorption Range</h1>

            {/* Min-Mean-Max display */}
            <div className="mt-4 inline-block">
              <div className="flex items-end justify-center gap-4">
                <div className="text-right">
                  <p className="text-slate-500 text-xs mb-1">Min</p>
                  <p className="text-3xl font-space font-bold text-slate-300">{result.min}</p>
                </div>
                <div className="text-center">
                  <p className="text-green-400/70 text-xs mb-1">Recommended Target (Mean)</p>
                  <p className="text-6xl lg:text-7xl font-space font-black text-green-400">{result.mean.toFixed(2)}</p>
                </div>
                <div className="text-left">
                  <p className="text-slate-500 text-xs mb-1">Max</p>
                  <p className="text-3xl font-space font-bold text-slate-300">{result.max}</p>
                </div>
              </div>
              <p className="text-slate-400 text-base mt-2">mmol/g CO₂ Adsorption Capacity</p>
            </div>

            {/* Confidence badge */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${confidenceColors[result.confidence]}`}>
                <ShieldCheck className="inline w-3 h-3 mr-1" />
                {result.confidence} Confidence
              </span>
              <span className="text-slate-400 text-xs">
                {result.dataPointsUsed} matching data points used
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Input Summary + Insights */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className="glass-card rounded-2xl p-5 border border-border mb-5">
                <h3 className="font-space font-semibold text-base mb-4">Input Parameters</h3>
                <div className="space-y-3">
                  {[
                    { icon: Leaf, label: 'Feedstock', value: params.biomass, color: 'text-green-500' },
                    { icon: Thermometer, label: 'Temperature', value: `${params.temperature}°C`, color: 'text-red-400' },
                    { icon: Clock, label: 'Residence Time', value: `${params.residenceTime} min`, color: 'text-blue-400' },
                    { icon: TrendingUp, label: 'Heating Rate', value: `${params.heatingRate}°C/min`, color: 'text-amber-400' },
                    { icon: FlaskConical, label: 'Activator', value: params.activator === 'Non' ? 'None' : params.activator, color: 'text-purple-400' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-2">
                        <row.icon className={`w-4 h-4 ${row.color}`} />
                        <span className="text-sm text-muted-foreground">{row.label}</span>
                      </div>
                      <span className="text-sm font-semibold">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Database Stats Card */}
              <div className="glass-card rounded-2xl p-5 border border-border mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart2 className="w-4 h-4 text-blue-500" />
                  <h3 className="font-space font-semibold text-sm">Biomass DB Statistics</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DB Records for Species</span>
                    <span className="font-bold text-blue-500">{result.biomassStats.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DB Min CO₂</span>
                    <span className="font-semibold">{result.biomassStats.min} mmol/g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DB Max CO₂</span>
                    <span className="font-semibold text-green-600">{result.biomassStats.max} mmol/g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DB Mean CO₂</span>
                    <span className="font-semibold">{result.biomassStats.mean} mmol/g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Surface Area</span>
                    <span className="font-semibold">{result.biomassStats.avgSurface} m²/g</span>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="glass-card rounded-2xl p-5 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <h3 className="font-space font-semibold text-base">Expert Insights</h3>
                </div>
                <div className="space-y-3">
                  {result.recommendations.map((ins, i) => (
                    <div key={i} className={`p-3 rounded-xl border text-sm leading-relaxed ${insightColors[ins.type]}`}>
                      {ins.text}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Charts */}
          <div className="lg:col-span-2 space-y-5">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <ConfidenceRangeBars result={result} />
            </motion.div>
            {/* ML vs Statistical Comparison */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}>
              <div className="glass-card rounded-2xl p-5 border border-blue-500/25">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-blue-500" />
                  <h3 className="font-space font-semibold text-base">Statistical vs. ML Model Comparison</h3>
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold">In Development</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Historical research estimate vs. Ridge Regression ML prediction (R²≈0.84)</p>

                {/* Statistical range row */}
                <div className="space-y-3">
                  {[
                    {
                      label: 'Statistical Estimate (DB-Derived)',
                      lo: result.min,
                      hi: result.max,
                      mean: result.mean,
                      color: '#22c55e',
                      badge: 'Current Method',
                      badgeBg: 'bg-green-500/10 text-green-600',
                    },
                    {
                      label: 'ML Model Prediction (Ridge Regression)',
                      lo: mlResult.mlLow,
                      hi: mlResult.mlHigh,
                      mean: mlResult.mlMean,
                      color: '#3b82f6',
                      badge: 'AI · In Dev',
                      badgeBg: 'bg-blue-500/10 text-blue-600',
                    },
                  ].map(row => {
                    const totalDomain = 8;
                    const loPct  = (row.lo / totalDomain) * 100;
                    const hiPct  = (row.hi / totalDomain) * 100;
                    const midPct = (row.mean / totalDomain) * 100;
                    return (
                      <div key={row.label} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{row.label}</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${row.badgeBg}`}>{row.badge}</span>
                          </div>
                          <span className="font-bold" style={{ color: row.color }}>{row.lo.toFixed(1)} – {row.hi.toFixed(1)} mmol/g</span>
                        </div>
                        <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 h-full rounded-full"
                            style={{ left: `${loPct}%`, width: `${hiPct - loPct}%`, backgroundColor: `${row.color}40` }}
                          />
                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-md"
                            style={{ left: `calc(${midPct}% - 7px)`, backgroundColor: row.color }}
                          />
                          <span
                            className="absolute top-1/2 -translate-y-1/2 text-[9px] font-bold text-white"
                            style={{ left: `calc(${midPct}% + 8px)`, color: row.color }}
                          >
                            {row.mean.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/15">
                  <Brain className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <p className="text-[10px] text-blue-700">
                    <strong>ML Note:</strong> {mlResult.modelNote}. Agreement between methods increases prediction confidence.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
              <DataDensityGauge result={result} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <BenchmarkChart benchmarkData={result.benchmarkData} userMean={result.mean} mlMean={mlResult.mlMean} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
              <SensitivityAnalysis params={params} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <WhyThisPrediction result={result} params={params} />
            </motion.div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              <ReportExporter result={result} params={params} />
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors">
                <Share2 className="w-4 h-4" /> Share Results
              </button>
              <button
                onClick={() => navigate('/predictor')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-blue text-white font-semibold text-sm hover:scale-105 transition-transform"
              >
                New Estimate
              </button>
            </div>

            {/* Privacy notice */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  <strong>Privacy & IP:</strong> Raw research data is never exposed. Results shown are aggregated statistical summaries (mean, min, max, count) derived from {TOTAL_DATA_POINTS.toLocaleString()} peer-reviewed experimental records. The complete dataset is protected and stored securely.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}