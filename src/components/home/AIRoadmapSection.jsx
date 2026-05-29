// @ts-nocheck
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, FlaskConical, GitBranch, Cpu, Lock, CheckCircle2, Clock, ArrowRight, Sparkles, Database, TrendingUp } from 'lucide-react';
import ML_META from '../../lib/ml_predictions.json';
import { TOTAL_DATA_POINTS, TOTAL_EXPERIMENTS } from '../../lib/biocharKnowledgeBase';

const R2_PROP = ML_META.metrics.model_01_avg_r2;
const R2_CO2  = ML_META.metrics.model_02_r2;

const PHASES = [
  {
    id: 1,
    status: 'done',
    icon: FlaskConical,
    color: '#22c55e',
    title: 'Statistical Estimator',
    subtitle: `Live · V.1.0 · ${TOTAL_DATA_POINTS.toLocaleString()} records`,
    desc: `Progressive database lookup across ${TOTAL_EXPERIMENTS} unique isotherm experiments. Matches user conditions to real experimental records — returns min, mean, max with confidence level and prediction intervals.`,
    tags: ['DB Lookup', 'Prediction Intervals', 'Match Confidence'],
  },
  {
    id: 2,
    status: 'done',
    icon: Brain,
    color: '#3b82f6',
    title: 'Sklearn ML Pipeline',
    subtitle: 'Live · V.1.0 · Trained on real data',
    desc: `Two-stage sklearn pipeline trained on ${TOTAL_EXPERIMENTS} experiments: KNN Property Estimator predicts BET surface area and pore volume (R²=${R2_PROP}), then SVR CO₂ Estimator predicts peak adsorption capacity (R²=${R2_CO2}). Pre-computed for 1,728 synthesis conditions.`,
    tags: [`KNN R²=${R2_PROP}`, `SVR R²=${R2_CO2}`, '1,728 Lookups', 'No API needed'],
  },
  {
    id: 3,
    status: 'active',
    icon: GitBranch,
    color: '#a855f7',
    title: 'Ensemble & Stacking Models',
    subtitle: 'In Development · V.1.0',
    desc: 'Stacking ensemble combining Ridge, KNN, Random Forest, XGBoost, and SVR with a meta-learner. All 8 algorithms trained and cross-validated. Stacking tested on full dataset — deployment in progress.',
    tags: ['Stacking Ensemble', 'XGBoost', 'Random Forest', '8 Algorithms'],
  },
  {
    id: 4,
    status: 'planned',
    icon: Cpu,
    color: '#f59e0b',
    title: 'Physics-Informed Neural Network',
    subtitle: 'Research Phase · V.1.0',
    desc: 'PI-DNN with Langmuir / Freundlich / Sips isotherm physics constraints. Extended multi-source dataset. Target R² > 0.90 on peak CO₂ capacity across all biomass species.',
    tags: ['PI-DNN', 'Isotherm Physics', 'Multi-source Data'],
  },
];

const statusConfig = {
  done:    { label: 'Live',           icon: CheckCircle2, color: 'text-green-500',  bg: 'bg-green-500/10 border-green-500/25' },
  active:  { label: 'In Development', icon: Clock,        color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/25' },
  planned: { label: 'Planned',        icon: Lock,         color: 'text-slate-400',  bg: 'bg-slate-500/10 border-slate-500/20' },
};

// Pipeline steps with real metrics
const PIPELINE_STEPS = [
  {
    step: '01',
    label: 'Synthesis Inputs',
    items: ['Biomass species', 'Pyrolysis temperature', 'Activation method', 'Residence time'],
    color: '#22c55e',
    icon: FlaskConical,
  },
  {
    step: '02',
    label: 'Property Estimator (KNN)',
    items: [`BET Surface Area (R²=${R2_PROP})`, `Pore Volume (R²=${R2_PROP})`, '8 biomass types', '6 activators'],
    color: '#3b82f6',
    icon: Database,
  },
  {
    step: '03',
    label: 'CO₂ Estimator (SVR)',
    items: [`Peak CO₂ capacity (R²=${R2_CO2})`, '±1.16 mmol/g uncertainty', 'Pre-computed 1,728 pts', 'Instant lookup'],
    color: '#a855f7',
    icon: TrendingUp,
  },
];

export default function AIRoadmapSection() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-dots-pattern opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">AI Predictor Roadmap · BioPredict V.1.0</span>
          </div>
          <h2 className="font-space font-bold text-3xl lg:text-4xl text-foreground mb-3">
            Statistics + <span className="text-gradient-blue">Machine Learning</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            BiocharInformaticsThailand now runs two live prediction engines side-by-side —
            a statistical DB lookup and a trained sklearn ML pipeline — with ensemble and PI-DNN on the roadmap.
          </p>
        </motion.div>

        {/* Phase cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {PHASES.map((phase, i) => {
            const cfg = statusConfig[phase.status];
            const StatusIcon = cfg.icon;
            const PhaseIcon = phase.icon;
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`glass-card rounded-2xl p-6 border transition-all ${
                  phase.status === 'active'
                    ? 'border-purple-500/30 shadow-purple-500/10 shadow-lg'
                    : phase.status === 'done'
                    ? 'border-green-500/20'
                    : 'border-border opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0"
                      style={{ background: `${phase.color}15`, borderColor: `${phase.color}30` }}>
                      <PhaseIcon className="w-5 h-5" style={{ color: phase.color }} />
                    </div>
                    <div>
                      <h3 className="font-space font-bold text-sm text-foreground">{phase.title}</h3>
                      <p className="text-xs" style={{ color: phase.color }}>{phase.subtitle}</p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{phase.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {phase.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: `${phase.color}15`, color: phase.color, border: `1px solid ${phase.color}30` }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live ML Pipeline diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl border border-blue-500/25 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center">
              <Brain className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="font-space font-semibold text-sm">Live ML Pipeline · KNN → SVR</p>
              <p className="text-xs text-muted-foreground">Trained on {TOTAL_EXPERIMENTS} peer-reviewed experiments · No external API · Runs entirely in browser</p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/25 text-[10px] font-bold text-green-600">
              <CheckCircle2 className="w-3 h-3" /> Live
            </span>
          </div>

          {/* Pipeline flow */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            {PIPELINE_STEPS.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div key={step.step} className="flex sm:flex-col items-center gap-3 flex-1">
                  <div className="flex-1 p-4 rounded-xl border"
                    style={{ background: `${step.color}08`, borderColor: `${step.color}25` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: `${step.color}20`, color: step.color }}>
                        {step.step}
                      </span>
                      <StepIcon className="w-3.5 h-3.5" style={{ color: step.color }} />
                      <span className="text-xs font-semibold text-foreground">{step.label}</span>
                    </div>
                    <ul className="space-y-0.5">
                      {step.items.map(item => (
                        <li key={item} className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: step.color }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 sm:rotate-90 rotate-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {[
              { label: 'Property Est. R²', value: String(R2_PROP), color: '#3b82f6' },
              { label: 'CO₂ Est. R²',     value: String(R2_CO2),  color: '#a855f7' },
              { label: 'Conditions',       value: '1,728',          color: '#22c55e' },
              { label: 'Training records', value: String(TOTAL_EXPERIMENTS), color: '#f59e0b' },
            ].map(m => (
              <div key={m.label} className="p-3 rounded-xl bg-muted/50 border border-border text-center">
                <p className="font-space font-bold text-base" style={{ color: m.color }}>{m.value}</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-muted-foreground mt-3 text-center">
            All predictions are pre-computed and bundled with the app — zero latency, works offline, no external AI service required.
          </p>
        </motion.div>

        <div className="text-center">
          <Link
            to="/predictor"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-blue text-white font-semibold text-sm glow-blue hover:scale-105 transition-transform"
          >
            Try the Estimator <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
