import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers, BarChart3, ChevronRight, ArrowRight, X, Zap, FlaskConical, Activity } from 'lucide-react';
import { useLang } from '../../lib/LanguageContext';

function PhaseModal({ phase, onClose, t }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="relative glass-dark rounded-3xl max-w-lg w-full p-8 z-10 shadow-2xl border"
        style={{ borderColor: `${phase.color}40` }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center border" style={{ background: `${phase.color}20`, borderColor: `${phase.color}40` }}>
            <phase.icon className="w-7 h-7" style={{ color: phase.color }} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: phase.color }}>{phase.phase}</p>
            <h3 className="font-space font-bold text-xl text-white leading-tight">{phase.label}</h3>
            <p className="text-slate-400 text-sm">{phase.subtitle}</p>
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-6">{phase.detail}</p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-xl p-3 border border-white/10 bg-white/5">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: phase.color }}>{t('tp.inputs')}</p>
            {phase.inputs.map(i => (
              <p key={i} className="text-slate-300 text-xs leading-relaxed">· {i}</p>
            ))}
          </div>
          <div className="rounded-xl p-3 border border-white/10 bg-white/5">
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2 text-slate-400">{t('tp.outputs')}</p>
            {phase.outputs.map(o => (
              <p key={o} className="text-slate-300 text-xs leading-relaxed">· {o}</p>
            ))}
          </div>
        </div>

        <Link
          to={phase.tool.path}
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-space font-bold text-sm text-white border"
          style={{ background: `${phase.color}25`, borderColor: `${phase.color}50` }}
        >
          <Zap className="w-4 h-4" style={{ color: phase.color }} />
          <span style={{ color: phase.color }}>{phase.tool.label}</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function TriplePhaseFlow() {
  const { t } = useLang();
  const [active, setActive] = useState(null);

  // Reordered as tools (Property Estimator, CO₂ Estimator, Materials Advisor)
  const PHASES = [
    {
      id: 1,
      phase: 'Tool 1',
      label: t('tp.tool1.label'),
      subtitle: t('tp.tool1.desc'),
      icon: FlaskConical,
      color: '#f59e0b',
      glow: 'rgba(245,158,11,0.3)',
      bg: 'from-amber-500/15 to-amber-600/5',
      border: 'border-amber-500/30',
      description: t('tp.step1.detail'),
      inputs: ['Biomass Species', 'Pyrolysis Temp (°C)'],
      outputs: ['BET, Pore Volume'],
      tool: { label: t('tp.tool1.label'), path: '/property-estimator' },
      detail: t('tp.step1.detail'),
    },
    {
      id: 2,
      phase: 'Tool 2',
      label: t('tp.tool3.label'),
      subtitle: t('tp.tool3.desc'),
      icon: BarChart3,
      color: '#22c55e',
      glow: 'rgba(34,197,94,0.3)',
      bg: 'from-green-500/15 to-green-600/5',
      border: 'border-green-500/30',
      description: t('tp.step3.detail'),
      inputs: ['Pyrolysis Params', 'Biochar Properties'],
      outputs: ['CO₂ Uptake'],
      tool: { label: t('tp.tool3.label'), path: '/predictor' },
      detail: t('tp.step3.detail'),
    },
    {
      id: 3,
      phase: 'Tool 3',
      label: t('tp.tool2.label'),
      subtitle: t('tp.tool2.desc'),
      icon: Layers,
      color: '#8b5cf6',
      glow: 'rgba(139,92,246,0.3)',
      bg: 'from-purple-500/15 to-purple-600/5',
      border: 'border-purple-500/30',
      description: t('tp.step2.detail'),
      inputs: ['Target Properties'],
      outputs: ['Recommended Conditions'],
      tool: { label: t('tp.tool2.label'), path: '/advisor' },
      detail: t('tp.step2.detail'),
    },
  ];

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-64 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">{t('tp.badge')}</span>
          </div>
          <h2 className="font-space font-bold text-3xl lg:text-4xl text-white mb-3">
            {t('tp.heading1')}<br />
            <span className="text-gradient-green">{t('tp.heading2')}</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t('tp.desc')}
          </p>
        </motion.div>

        {/* Phase cards + connectors */}
        <div className="flex flex-col lg:flex-row items-stretch gap-0">
          {PHASES.map((phase, i) => (
            <div key={phase.id} className="flex lg:flex-row flex-col items-center flex-1">
              {/* Card */}
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActive(phase)}
                className={`group relative w-full rounded-2xl border p-7 text-left cursor-pointer transition-all bg-gradient-to-br ${phase.bg} ${phase.border} hover:shadow-2xl flex-1`}
                style={{ boxShadow: `0 0 0 0 ${phase.glow}`, transition: 'box-shadow 0.3s ease' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 40px ${phase.glow}`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 0 0 transparent'}
              >
                {/* Tool badge (use tool label to avoid implying sequence) */}
                <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full text-[10px] font-bold border"
                  style={{ background: `${phase.color}20`, borderColor: `${phase.color}50`, color: phase.color }}>
                  {phase.label}
                </div>

                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border"
                  style={{ background: `${phase.color}15`, borderColor: `${phase.color}30` }}>
                  <phase.icon className="w-6 h-6" style={{ color: phase.color }} />
                </div>

                <h3 className="font-space font-bold text-white text-base leading-tight mb-1">{phase.label}</h3>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: phase.color }}>{phase.subtitle}</p>
                <p className="text-slate-400 text-xs leading-relaxed mb-5">{phase.description}</p>

                {/* IO pills */}
                <div className="space-y-1.5">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{t('tp.keyParameters')}</p>
                  {phase.inputs.slice(0, 2).map(inp => (
                    <div key={inp} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <FlaskConical className="w-2.5 h-2.5 flex-shrink-0" style={{ color: phase.color }} />
                      {inp}
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-1 text-[11px] font-bold" style={{ color: phase.color }}>
                  {t('tp.explorePhase')} <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              {/* Connector arrow */}
              {i < PHASES.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3 }}
                  className="flex-shrink-0 flex flex-col items-center justify-center px-3 py-4 lg:py-0 relative"
                >
                  {/* Pulse line */}
                  <div className="hidden lg:block w-12 h-px bg-gradient-to-r from-amber-500/40 via-purple-500/60 to-green-500/40 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full animate-ping" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-purple-300 rounded-full" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-500 lg:absolute lg:top-1/2 lg:-translate-y-1/2 hidden lg:block" style={{ left: '50%', transform: 'translateX(-50%) translateY(-50%)' }} />
                  {/* Mobile: vertical arrow */}
                  <div className="lg:hidden flex flex-col items-center gap-1">
                    <div className="w-px h-6 bg-gradient-to-b from-amber-500/40 to-purple-500/40 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 rotate-90" />
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Quick-access tool strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { label: t('tp.tool1.label'), desc: t('tp.tool1.desc'), path: '/property-estimator', color: '#f59e0b', icon: FlaskConical },
            { label: t('tp.tool3.label'), desc: t('tp.tool3.desc'), path: '/predictor', color: '#22c55e', icon: BarChart3 },
            { label: t('tp.tool2.label'), desc: t('tp.tool2.desc'), path: '/advisor', color: '#8b5cf6', icon: Layers },
          ].map(tool => (
            <Link
              key={tool.label}
              to={tool.path}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl border glass-dark hover:scale-[1.02] transition-transform group"
              style={{ borderColor: `${tool.color}30` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border"
                style={{ background: `${tool.color}15`, borderColor: `${tool.color}30` }}>
                <tool.icon className="w-5 h-5" style={{ color: tool.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-space font-bold text-sm text-white">{tool.label}</p>
                <p className="text-slate-500 text-[10px] leading-relaxed">{tool.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: tool.color }} />
            </Link>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {active && <PhaseModal phase={active} t={t} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}