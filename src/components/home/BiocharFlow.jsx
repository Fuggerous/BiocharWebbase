import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Flame, Sparkles, Globe, ChevronRight, X } from 'lucide-react';
import { Cite } from './ScientificReferences';
import { useTranslation } from 'react-i18next';

function StepModal({ step, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="relative glass-dark rounded-3xl border max-w-lg w-full p-8 z-10 shadow-2xl"
        style={{ borderColor: `${step.color}40` }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center border" style={{ background: `${step.color}20`, borderColor: `${step.color}40` }}>
            <step.icon className="w-7 h-7" style={{ color: step.color }} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: step.color }}>Step {step.id}</p>
            <h3 className="font-space font-bold text-xl text-white">{step.label}</h3>
            <p className="text-slate-400 text-sm">{step.subtitle}</p>
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          {step.detail.body}{step.detail.refs && <Cite ids={step.detail.refs} />}
        </p>

        <div className="grid grid-cols-3 gap-3">
          {step.detail.stats.map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center border border-white/10 bg-white/5">
              <p className="font-space font-bold text-base" style={{ color: s.color }}>{s.value}</p>
              <p className="text-slate-400 text-[10px] mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BiocharFlow() {
  const { t } = useTranslation();
  const [active, setActive] = useState(null);

  const STEPS = [
    {
      id: 1,
      icon: Leaf,
      color: '#22c55e',
      bg: 'from-green-500/20 to-green-600/5',
      border: 'border-green-500/30',
      label: t('flow.step1.label'),
      subtitle: t('flow.step1.subtitle'),
      short: t('flow.step1.short'),
      shortRefs: [8],
      detail: {
        heading: t('flow.step1.heading'),
        body: t('flow.step1.body'),
        refs: [8, 10],
        stats: [
          { label: t('flow.step1.c1'), value: '35–55%', color: '#22c55e' },
          { label: t('flow.step1.c2'), value: '< 15%', color: '#3b82f6' },
          { label: t('flow.step1.c3'), value: '60 Mt/yr', color: '#a855f7' },
        ],
      },
    },
    {
      id: 2,
      icon: Flame,
      color: '#f59e0b',
      bg: 'from-amber-500/20 to-amber-600/5',
      border: 'border-amber-500/30',
      label: t('flow.step2.label'),
      subtitle: t('flow.step2.subtitle'),
      short: t('flow.step2.short'),
      shortRefs: [1, 10],
      detail: {
        heading: t('flow.step2.heading'),
        body: t('flow.step2.body'),
        refs: [1, 6, 10, 12],
        stats: [
          { label: t('flow.step2.c1'), value: '300–900°C', color: '#f59e0b' },
          { label: t('flow.step2.c2'), value: '26–35%', color: '#ef4444' },
          { label: t('flow.step2.c3'), value: '60–90%', color: '#22c55e' },
        ],
      },
    },
    {
      id: 3,
      icon: Sparkles,
      color: '#8b5cf6',
      bg: 'from-purple-500/20 to-purple-600/5',
      border: 'border-purple-500/30',
      label: t('flow.step3.label'),
      subtitle: t('flow.step3.subtitle'),
      short: t('flow.step3.short'),
      shortRefs: [7, 12],
      detail: {
        heading: t('flow.step3.heading'),
        body: t('flow.step3.body'),
        refs: [7, 10, 12],
        stats: [
          { label: t('flow.step3.c1'), value: '3,157 m²/g', color: '#8b5cf6' },
          { label: t('flow.step3.c2'), value: 'KOH', color: '#06b6d4' },
          { label: t('flow.step3.c3'), value: '1.554 cm³/g', color: '#f59e0b' },
        ],
      },
    },
    {
      id: 4,
      icon: Globe,
      color: '#06b6d4',
      bg: 'from-cyan-500/20 to-cyan-600/5',
      border: 'border-cyan-500/30',
      label: t('flow.step4.label'),
      subtitle: t('flow.step4.subtitle'),
      short: t('flow.step4.short'),
      shortRefs: [3, 12],
      detail: {
        heading: t('flow.step4.heading'),
        body: t('flow.step4.body'),
        refs: [1, 2, 3, 4, 11, 12],
        stats: [
          { label: t('flow.step4.c1'), value: '7.5 mmol/g', color: '#06b6d4' },
          { label: t('flow.step4.c2'), value: '2.5 t CO₂/t', color: '#22c55e' },
          { label: t('flow.step4.c3'), value: '100–1000 yr', color: '#a855f7' },
        ],
      },
    },
  ];

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">{t('flow.badge')}</span>
          </div>
          <h2 className="font-space font-bold text-3xl lg:text-4xl text-white mb-3">
            {t('flow.step1.label')}<br />
            <span className="text-gradient-green">{t('flow.step2.label')}</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t('tp.desc')}
          </p>
        </motion.div>

        {/* Flow Steps */}
        <div className="flex flex-col lg:flex-row items-center gap-4">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex lg:flex-row flex-col items-center gap-4 flex-1 w-full lg:w-auto">
              <motion.button
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActive(step)}
                className={`group relative w-full lg:flex-1 rounded-2xl border p-6 text-left cursor-pointer transition-all bg-gradient-to-br ${step.bg} ${step.border} hover:shadow-xl`}
                style={{ '--glow': step.color }}
              >
                {/* Step badge */}
                <div className="absolute -top-3 left-5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                  style={{ background: `${step.color}20`, borderColor: `${step.color}50`, color: step.color }}>
                  STEP {step.id}
                </div>

                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 border"
                  style={{ background: `${step.color}15`, borderColor: `${step.color}30` }}>
                  <step.icon className="w-6 h-6" style={{ color: step.color }} />
                </div>

                <h3 className="font-space font-bold text-white text-base mb-0.5">{step.label}</h3>
                <p className="text-xs font-semibold mb-3" style={{ color: step.color }}>{step.subtitle}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{step.short}{step.shortRefs && <Cite ids={step.shortRefs} />}</p>

                <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold" style={{ color: step.color }}>
                  {t('flow.stepExplore')} <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              {/* Arrow connector */}
              {i < STEPS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 + 0.2 }}
                  className="flex-shrink-0 text-slate-600 lg:rotate-0 rotate-90"
                >
                  <ChevronRight className="w-7 h-7" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {active && <StepModal step={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}