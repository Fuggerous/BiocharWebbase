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
import { queryExpertGuidance, TOTAL_DATA_POINTS, DB_OVERALL_AVG } from '../lib/biocharKnowledgeBase';
import { mlPredict, mlPipelineLookup, mlBlendPredict } from '../lib/mlPredictor';
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

const MATCH_LEVEL_LABELS = {
  exact:   { label: 'Exact Match',          color: 'text-green-600 bg-green-50 border-green-200' },
  bioTemp: { label: 'Biomass + Temp Match', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  biomass: { label: 'Biomass-Only Match',   color: 'text-amber-600 bg-amber-50 border-amber-200' },
  global:  { label: 'Global Fallback',      color: 'text-slate-600 bg-slate-50 border-slate-200' },
};

function ConfidenceRangeBars({ result }) {
  const { min, max, mean, std, n, predSigma, pi95lo, pi95hi, pi80lo, pi80hi, p25, p75, matchLevel, confidence } = result;

  // Scale: the axis spans from 0 to (max * 1.2) or pi95hi, whichever is larger
  const axisMax = Math.max(max, pi95hi) * 1.05;
  const pct = (v) => Math.max(0, Math.min(100, (v / axisMax) * 100));

  const bands = [
    {
      label: '95% Prediction Interval',
      lo: pi95lo, hi: pi95hi,
      color: 'rgba(34,197,94,0.12)',
      note: 'z = 1.96 · σ·√(1+1/n) — probability a new single experiment falls in this range',
    },
    {
      label: '80% Prediction Interval',
      lo: pi80lo, hi: pi80hi,
      color: 'rgba(34,197,94,0.25)',
      note: 'z = 1.28 · tighter band, higher chance of exceeding',
    },
    {
      label: 'Observed Data Range (IQR)',
      lo: p25, hi: p75,
      color: 'rgba(34,197,94,0.45)',
      note: `25th–75th percentile of ${n} matched records`,
    },
  ];

  const ml = MATCH_LEVEL_LABELS[matchLevel] || MATCH_LEVEL_LABELS.global;

  return (
    <div className="glass-card rounded-2xl p-5 border border-border space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-space font-semibold text-base">Statistical Prediction Intervals</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Based on n={n} matched records · σ={std} mmol/g · SE={result.se} mmol/g
          </p>
        </div>
        <span className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold ${ml.color}`}>
          {ml.label}
        </span>
      </div>

      {bands.map((band) => {
        const loPct  = pct(band.lo);
        const hiPct  = pct(band.hi);
        const midPct = pct(mean);
        return (
          <div key={band.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">{band.label}</span>
              <span className="font-bold text-green-600">{band.lo.toFixed(2)} – {band.hi.toFixed(2)} mmol/g</span>
            </div>
            <div className="relative h-5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="absolute top-0 h-full rounded-full"
                style={{ left: `${loPct}%`, width: `${hiPct - loPct}%`, background: band.color }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"
                style={{ left: `calc(${midPct}% - 6px)` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">{band.note}</p>
          </div>
        );
      })}

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div>
          <span className="text-xs font-semibold text-foreground">Mean Estimate</span>
          <span className="text-[10px] text-muted-foreground ml-2">95% CI for mean: [{(mean - 1.96 * result.se).toFixed(2)}, {(mean + 1.96 * result.se).toFixed(2)}]</span>
        </div>
        <span className="text-sm font-bold text-green-500">{mean.toFixed(2)} mmol/g</span>
      </div>
    </div>
  );
}

// ── Journal-referenced scientific interpretation ─────────────────────────────
function ScientificInterpretation({ result, params }) {
  const { mean, std, n, confidence, matchLevel, activatorStats, temperatureBracket, biomassStats } = result;
  const { activator, temperature, biomass } = params;

  const insights = [];

  // Activation method interpretation (refs: Cha et al. 2016; Zhang et al. 2022)
  if (activator === 'KOH') {
    insights.push({
      type: 'positive',
      title: 'KOH Chemical Activation',
      text: `KOH activation is reported as the most effective method for micropore generation in biochar, consistently yielding CO₂ uptake of 3–7 mmol/g at 25°C. KOH etches carbon layers, creating abundant micropores (<2 nm) ideal for CO₂ physisorption. DB mean for KOH: ${activatorStats?.mean?.toFixed(2)} mmol/g (n=${activatorStats?.count}).`,
      ref: 'Zhang et al. (2022) Chem. Eng. J.; Cha et al. (2016) Bioresour. Technol.',
    });
  } else if (activator === 'KOH-CO2') {
    insights.push({
      type: 'positive',
      title: 'Combined KOH + CO₂ Activation',
      text: `Combined activation merges chemical (KOH) and physical (CO₂) mechanisms. Literature reports synergistic pore widening that can exceed single-method activation by 15–30%. DB mean: ${activatorStats?.mean?.toFixed(2)} mmol/g.`,
      ref: 'Shen et al. (2021) Energy Fuels; Shafeeyan et al. (2010) J. Anal. Appl. Pyrolysis.',
    });
  } else if (activator === 'K2CO3') {
    insights.push({
      type: 'positive',
      title: 'K₂CO₃ Chemical Activation',
      text: `K₂CO₃ produces a well-developed micropore network through carbonate decomposition at high temperature. Gentler than KOH, producing narrower pore-size distribution. DB mean: ${activatorStats?.mean?.toFixed(2)} mmol/g.`,
      ref: 'Manyà et al. (2018) J. CO₂ Util.; Sevilla & Fuertes (2011) Energy Environ. Sci.',
    });
  } else if (activator === 'CO2') {
    insights.push({
      type: 'neutral',
      title: 'Physical CO₂ Activation',
      text: `CO₂ gasification selectively burns the most reactive carbon sites, creating a pore structure without chemical contamination. Yields moderate surface areas (500–1500 m²/g) with CO₂ uptake typically 1.5–4 mmol/g. DB mean: ${activatorStats?.mean?.toFixed(2)} mmol/g.`,
      ref: 'Duan et al. (2018) Bioresour. Technol.; Wiedner et al. (2013) Chemosphere.',
    });
  } else if (activator === 'LiCl') {
    insights.push({
      type: 'warning',
      title: 'LiCl Chemical Activation',
      text: `LiCl activation is less common in CO₂ adsorption literature. It can introduce heteroatom doping but typically yields lower surface areas than KOH. DB mean: ${activatorStats?.mean?.toFixed(2)} mmol/g.`,
      ref: 'Limited literature — treat as exploratory.',
    });
  } else {
    insights.push({
      type: 'neutral',
      title: 'No Activation (Raw Biochar)',
      text: `Unactivated biochars rely solely on pyrolysis-induced porosity. CO₂ uptake is generally lower (0.5–2.5 mmol/g) due to limited micropore development. Activation can increase capacity by 2–5×. DB mean without activation: ${activatorStats?.mean?.toFixed(2)} mmol/g.`,
      ref: 'Huggins et al. (2016) Bioresour. Technol.; Tan et al. (2015) Chem. Eng. J.',
    });
  }

  // Temperature interpretation (refs: Cha et al. 2016; Weber & Quicker 2018)
  if (temperature >= 750) {
    insights.push({
      type: 'positive',
      title: `High Pyrolysis Temperature (${temperature}°C)`,
      text: `Temperatures ≥750°C promote complete aromatization and graphitization of the carbon matrix, maximizing micropore volume. DB records in this bracket average ${temperatureBracket?.mean?.toFixed(2) ?? '—'} mmol/g (n=${temperatureBracket?.count ?? '—'}).`,
      ref: 'Weber & Quicker (2018) Fuel; Cha et al. (2016) Bioresour. Technol.',
    });
  } else if (temperature >= 550) {
    insights.push({
      type: 'neutral',
      title: `Moderate Pyrolysis Temperature (${temperature}°C)`,
      text: `Mid-range temperatures (550–750°C) produce a mix of amorphous and aromatic carbon. Surface area and CO₂ affinity increase monotonically through this range. DB bracket mean: ${temperatureBracket?.mean?.toFixed(2) ?? '—'} mmol/g.`,
      ref: 'Zhao et al. (2019) Bioresour. Technol.',
    });
  } else {
    insights.push({
      type: 'warning',
      title: `Low Pyrolysis Temperature (${temperature}°C)`,
      text: `Temperatures <550°C result in incomplete carbonization. Residual volatile matter partially blocks pores. Literature recommends ≥600°C to achieve useful CO₂ adsorption capacity. DB bracket mean: ${temperatureBracket?.mean?.toFixed(2) ?? '—'} mmol/g.`,
      ref: 'Cha et al. (2016) Bioresour. Technol.; Wiedner et al. (2013) Chemosphere.',
    });
  }

  // Statistical quality note
  insights.push({
    type: matchLevel === 'exact' ? 'positive' : matchLevel === 'global' ? 'warning' : 'neutral',
    title: 'Estimate Reliability',
    text: matchLevel === 'exact'
      ? `Exact-condition match found (same biomass, temperature bracket, activator). Mean±σ = ${mean.toFixed(2)}±${std} mmol/g from n=${n} records. This is the most reliable estimate type.`
      : matchLevel === 'bioTemp'
      ? `Activator not matched exactly — result pools all activators for ${biomass} at ${temperature}°C. Mean±σ = ${mean.toFixed(2)}±${std} mmol/g. Confidence is moderate.`
      : matchLevel === 'biomass'
      ? `No temperature match found — result pools all ${biomass} records regardless of temperature. Mean±σ = ${mean.toFixed(2)}±${std} mmol/g. Use for order-of-magnitude reference only.`
      : `No biomass match in database — result is global fallback. Prediction is weakly constrained. Consider the sensitivity analysis for trend direction.`,
    ref: `44Database · ${n} records used · σ = ${std} mmol/g`,
  });

  const typeStyle = {
    positive: 'border-l-4 border-green-400 bg-green-50',
    warning:  'border-l-4 border-amber-400 bg-amber-50',
    neutral:  'border-l-4 border-blue-400 bg-blue-50',
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
        </div>
        <div>
          <h3 className="font-space font-semibold text-base">Scientific Interpretation</h3>
          <p className="text-xs text-muted-foreground">Evidence-based context from peer-reviewed literature</p>
        </div>
      </div>
      <div className="space-y-3">
        {insights.map((ins, i) => (
          <div key={i} className={`p-3 rounded-xl ${typeStyle[ins.type]}`}>
            <p className="text-xs font-bold text-foreground mb-1">{ins.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{ins.text}</p>
            <p className="text-[10px] text-slate-400 mt-1.5 italic">Ref: {ins.ref}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BenchmarkChart({ benchmarkData, userMean, mlMean }) {
  const data = [
    { name: 'Statistical Est.', value: userMean, fill: '#22c55e' },
    ...(mlMean !== undefined ? [{ name: 'ML Prediction', value: mlMean, fill: '#3b82f6' }] : []),
    ...benchmarkData.map(d => ({ name: d.name, value: d.avg, fill: '#94a3b8' })),
    { name: 'DB Overall Avg', value: +DB_OVERALL_AVG.toFixed(3), fill: '#64748b' },
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
          <ReferenceLine y={DB_OVERALL_AVG} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: `DB Avg ${DB_OVERALL_AVG.toFixed(2)}`, position: 'right', fontSize: 10 }} />
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
    biomass:       params.biomass,
    temperature:   params.temperature,
    activator:     params.activator,
    residenceTime: params.residenceTime,
  });

  const mlResult = mlPredict({
    biomass:       params.biomass,
    temperature:   params.temperature,
    activator:     params.activator,
    residenceTime: params.residenceTime,
    heatingRate:   params.heatingRate,
  });

  const mlPipeline = mlPipelineLookup({
    biomass:       params.biomass,
    temperature:   params.temperature,
    activator:     params.activator,
    residenceTime: params.residenceTime,
    heatingRate:   params.heatingRate,
  });

  // Blend: support two modes
  // 1) legacy mix-enabled UI -> array of ratios via mlBlendPredict
  // 2) categorical `blend` feature (string or params.blend.category) -> lookup via mlBlendLookup
  let blendPreds = null;
  let blendCategoryPred = null;
  const blendCategory = typeof params.blend === 'string' ? params.blend : params.blend?.category || null;
  if (params.blend?.enabled && params.blend?.secondary) {
    blendPreds = mlBlendPredict({
      biomass: params.biomass,
      secondary: params.blend.secondary,
      temperature: params.temperature,
      activator: params.activator,
      residenceTime: params.residenceTime,
      heatingRate: params.heatingRate,
      ratios: [0,25,50,75,100],
    });
  } else if (blendCategory) {
    blendCategoryPred = mlBlendLookup({
      biomass: params.biomass,
      temperature: params.temperature,
      activator: params.activator,
      residenceTime: params.residenceTime,
      heatingRate: params.heatingRate,
      blend: blendCategory,
    });
  }

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

          {/* Blend comparison will be shown below (moved) */}

          {/* Right: Charts */}
          <div className="lg:col-span-2 space-y-5">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <ConfidenceRangeBars result={result} />
            </motion.div>
            {/* ML vs Statistical Comparison */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.21 }}>
              <ScientificInterpretation result={result} params={params} />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}>
              <div className="glass-card rounded-2xl p-5 border border-blue-500/25">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-blue-500" />
                  <h3 className="font-space font-semibold text-base">3-Method Prediction Comparison</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Statistical DB lookup · Ridge approximation · Sklearn pipeline (KNN→SVR)
                </p>

                <div className="space-y-3">
                  {[
                    {
                      label: 'Statistical (DB-Derived)',
                      lo: result.min, hi: result.max, mean: result.mean,
                      color: '#22c55e',
                      badge: 'Primary', badgeBg: 'bg-green-500/10 text-green-600',
                      note: `n=${result.dataPointsUsed} matched records · ${result.confidence} confidence`,
                    },
                    {
                      label: 'Ridge Approximation',
                      lo: mlResult.mlLow, hi: mlResult.mlHigh, mean: mlResult.mlMean,
                      color: '#3b82f6',
                      badge: `LOO-CV R²=${mlResult.r2}`, badgeBg: 'bg-blue-500/10 text-blue-600',
                      note: mlResult.modelNote,
                    },
                    ...(mlPipeline ? [{
                      label: 'Sklearn Pipeline (KNN→SVR)',
                      lo: mlPipeline.co2Low, hi: mlPipeline.co2High, mean: mlPipeline.co2,
                      color: '#a855f7',
                      badge: `R²_prop=${mlPipeline.r2_prop}`, badgeBg: 'bg-purple-500/10 text-purple-600',
                      note: mlPipeline.modelNote,
                      extra: `Predicted BET: ${mlPipeline.sa.toLocaleString()} m²/g · PV: ${(mlPipeline.pv * 1e6).toFixed(0)} cm³/kg`,
                    }] : []),
                  ].map(row => {
                    const domain = Math.max(8, row.hi * 1.2);
                    const loPct  = (row.lo   / domain) * 100;
                    const hiPct  = (row.hi   / domain) * 100;
                    const midPct = (row.mean / domain) * 100;
                    return (
                      <div key={row.label} className="space-y-1">
                        <div className="flex items-center justify-between text-xs flex-wrap gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-foreground">{row.label}</span>
                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${row.badgeBg}`}>{row.badge}</span>
                          </div>
                          <span className="font-bold" style={{ color: row.color }}>{row.lo.toFixed(1)} – {row.hi.toFixed(1)} mmol/g</span>
                        </div>
                        <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden">
                          <div className="absolute top-0 h-full rounded-full"
                            style={{ left: `${loPct}%`, width: `${hiPct - loPct}%`, backgroundColor: `${row.color}35` }} />
                          <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-md"
                            style={{ left: `calc(${midPct}% - 7px)`, backgroundColor: row.color }} />
                          <span className="absolute top-1/2 -translate-y-1/2 text-[9px] font-bold"
                            style={{ left: `calc(${midPct}% + 10px)`, color: row.color }}>
                            {row.mean.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{row.note}</p>
                        {row.extra && <p className="text-[10px] text-purple-600">{row.extra}</p>}
                      </div>
                    );
                  })}
                </div>

                {!mlPipeline && (
                  <p className="text-[10px] text-amber-600 mt-2">
                    Sklearn pipeline: biomass or activator not in lookup table.
                  </p>
                )}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-500">
                    Agreement between all 3 methods = higher confidence. Divergence suggests
                    limited data for this specific condition.
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

      {/* Blend comparison section (moved below main content) */}
      {(blendPreds || blendCategoryPred) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="glass-card rounded-2xl p-5 border border-border">
            <h3 className="font-space font-semibold text-base mb-3">Blend Comparison</h3>
            {blendPreds && (
              <>
                <p className="text-xs text-muted-foreground mb-3">Weighted average predictions for blend ratios between <span className="font-semibold">{params.biomass}</span> and <span className="font-semibold">{params.blend.secondary}</span>.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 text-xs font-semibold text-muted-foreground">Metric</th>
                        {blendPreds.map(b => (
                          <th key={b.ratio} className="text-left py-2 px-2 text-xs font-semibold text-muted-foreground">{b.ratio}%</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-2 font-semibold">Statistical Mean (mmol/g)</td>
                        {blendPreds.map(b => (
                          <td key={b.ratio} className="py-2 px-2">{b.statMean.toFixed(2)}</td>
                        ))}
                      </tr>
                      <tr className="border-t border-border">
                        <td className="py-2 px-2 font-semibold">ML Mean (mmol/g)</td>
                        {blendPreds.map(b => (
                          <td key={b.ratio} className="py-2 px-2">{b.mlMean.toFixed(2)}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {blendCategoryPred && (
              <>
                <p className="text-xs text-muted-foreground mb-3">Predictions for blend category <span className="font-semibold">{typeof params.blend === 'string' ? params.blend : params.blend.category}</span>.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-xs text-muted-foreground">Statistical (DB) Mean</p>
                    <p className="text-2xl font-bold mt-2">{result.mean.toFixed(2)} mmol/g</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Based on matched DB records for selected biomass/params</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-xs text-muted-foreground">ML (Blend-aware) Prediction</p>
                    <p className="text-2xl font-bold mt-2">{blendCategoryPred.co2.toFixed(2)} mmol/g</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{blendCategoryPred.modelNote}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}