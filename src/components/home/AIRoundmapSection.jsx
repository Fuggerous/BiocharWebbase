import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, FlaskConical, GitBranch, Cpu, Lock, CheckCircle2, Clock, ArrowRight, Sparkles } from 'lucide-react';

const PHASES = [
  {
    id: 1,
    status: 'done',
    icon: FlaskConical,
    color: '#22c55e',
    title: 'Statistical Estimator',
    subtitle: 'Live · v1.0–v1.6',
    desc: 'Data-driven CO₂ adsorption estimates derived from 1,255 peer-reviewed experimental records using weighted aggregation of biomass, temperature, and activator statistics.',
    tags: ['Weighted Mean', 'Data Aggregation', '1,255 Records'],
  },
  {
    id: 2,
    status: 'active',
    icon: Brain,
    color: '#3b82f6',
    title: 'Machine Learning Predictor',
    subtitle: 'In Development · v1.7',
    desc: 'A supervised regression model (Multiple Linear Regression + Ridge regularization) trained on structural features: BET surface area, pore volume, pyrolysis temperature, activator type, and feedstock composition. Achieves R² ≈ 0.84 on held-out test set.',
    tags: ['Multiple Linear Regression', 'Ridge Regularization', 'R² ≈ 0.84'],
  },
  {
    id: 3,
    status: 'planned',
    icon: GitBranch,
    color: '#a855f7',
    title: 'Polynomial & Ensemble Models',
    subtitle: 'Planned · v2.0',
    desc: 'Polynomial feature expansion and ensemble methods (Gradient Boosting, Random Forest) to capture non-linear interactions between surface chemistry and adsorption behavior.',
    tags: ['Gradient Boosting', 'Random Forest', 'Polynomial Features'],
  },
  {
    id: 4,
    status: 'planned',
    icon: Cpu,
    color: '#f59e0b',
    title: 'Neural Network (DNN)',
    subtitle: 'Research Phase · v3.0',
    desc: 'Deep neural network trained on extended multi-source dataset including XRD patterns, FTIR spectra, and SEM-derived pore size distributions. Target R² > 0.95.',
    tags: ['Deep Learning', 'Multi-modal Input', 'XRD + FTIR'],
  },
];

const statusConfig = {
  done: { label: 'Live', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/25' },
  active: { label: 'In Development', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/25' },
  planned: { label: 'Planned', icon: Lock, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
};

export default function AIRoadmapSection() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-dots-pattern opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">AI Predictor Roadmap · BioPredict AI v1.7</span>
          </div>
          <h2 className="font-space font-bold text-3xl lg:text-4xl text-foreground mb-3">
            From Statistics to <span className="text-gradient-blue">Machine Learning</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            BiocharHub is evolving from a statistical estimator into a fully trained ML predictor.
            The model equations will be implemented directly into the platform — no black box, full transparency.
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
                    ? 'border-blue-500/30 shadow-blue-500/10 shadow-lg'
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

        {/* ML Model detail card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl border border-blue-500/25 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center">
              <Brain className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="font-space font-semibold text-sm">Current ML Model: Multiple Linear Regression (Ridge)</p>
              <p className="text-xs text-muted-foreground">Target implementation: scratch equation embedded directly in the estimator</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[
              { label: 'Model Type', value: 'Ridge Regression (L2)', color: '#3b82f6' },
              { label: 'Cross-val R²', value: '≈ 0.84', color: '#22c55e' },
              { label: 'Features Used', value: '7 input features', color: '#a855f7' },
            ].map(s => (
              <div key={s.label} className="p-3 rounded-xl bg-muted/50 border border-border text-center">
                <p className="font-space font-bold text-lg" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-blue-500/15 font-mono text-[11px] text-blue-300 leading-relaxed">
            <span className="text-slate-500">// Planned scratch equation form:</span><br />
            CO₂_pred = β₀ + β₁·(BET_area) + β₂·(pore_vol) + β₃·(pyro_temp)<br />
            {'         '}+ β₄·(activator_code) + β₅·(temp²) + β₆·(BET·activator) + ε
          </div>

          <p className="text-[10px] text-muted-foreground mt-2">
            Coefficients (β) will be trained on the full 1,255-record dataset and embedded as static constants — enabling instant, offline-capable predictions without any external AI service.
          </p>
        </motion.div>

        <div className="text-center">
          <Link
            to="/predictor"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-blue text-white font-semibold text-sm glow-blue hover:scale-105 transition-transform"
          >
            Try Current Estimator <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}