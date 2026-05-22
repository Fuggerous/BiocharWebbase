// @ts-nocheck
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, Flame, Sparkles, Wind, X, ChevronRight,
  Thermometer, Clock, Layers, Globe, ArrowRight,
} from 'lucide-react';
import { Cite } from './ScientificReferences';
import { useTranslation } from 'react-i18next';

// ── Step modal ────────────────────────────────────────────────
function StepModal({ step, onClose, t }) {
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
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="relative glass-modal rounded-3xl border max-w-lg w-full p-8 z-10 shadow-2xl"
        style={{ borderColor: `${step.color}50` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl"
          style={{ background: `linear-gradient(90deg, transparent, ${step.color}80, transparent)` }} />

        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center border"
            style={{ background: `${step.color}18`, borderColor: `${step.color}40` }}>
            <step.icon className="w-7 h-7" style={{ color: step.color }} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: step.color }}>
              {t('flow.stepBadge', { id: step.id })}
            </p>
            <h3 className="font-space font-bold text-xl text-white">{step.label}</h3>
            <p className="text-slate-400 text-sm">{step.subtitle}</p>
          </div>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-5">
          {step.detail.body}
          {step.detail.refs && <Cite ids={step.detail.refs} />}
        </p>

        <div className="grid grid-cols-3 gap-3">
          {step.detail.stats.map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center border border-white/10 bg-white/5">
              <p className="font-space font-bold text-base mb-0.5" style={{ color: s.color }}>{s.value}</p>
              <p className="text-slate-400 text-[10px] font-medium leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function BiocharFlow() {
  const { t } = useTranslation();
  const [active, setActive] = useState(null);

  const STEPS = [
    {
      id: 1, icon: Leaf, color: '#22c55e',
      bg: 'from-green-50 to-white dark:from-green-950/40 dark:to-slate-900', border: 'border-green-200 dark:border-green-800/40', glow: 'shadow-green-500/10',
      label: t('flow.step1.label'), subtitle: t('flow.step1.subtitle'),
      short: t('flow.step1.short'), shortRefs: [8],
      outputLabel: t('flow.step1.output'),
      params: [
        { icon: Layers,      label: t('flow.step1.p1'), value: '< 15%',     color: '#3b82f6' },
        { icon: Leaf,        label: t('flow.step1.p2'), value: '35–55%',    color: '#22c55e' },
        { icon: Globe,       label: t('flow.step1.p3'), value: '60 Mt/yr',  color: '#a855f7' },
      ],
      detail: {
        body: t('flow.step1.body'), refs: [8, 10],
        stats: [
          { label: t('flow.step1.c1'), value: '35–55%',   color: '#22c55e' },
          { label: t('flow.step1.c2'), value: '< 15%',    color: '#3b82f6' },
          { label: t('flow.step1.c3'), value: '60 Mt/yr', color: '#a855f7' },
        ],
      },
    },
    {
      id: 2, icon: Flame, color: '#f59e0b',
      bg: 'from-amber-50 to-white dark:from-amber-950/40 dark:to-slate-900', border: 'border-amber-200 dark:border-amber-800/40', glow: 'shadow-amber-500/10',
      label: t('flow.step2.label'), subtitle: t('flow.step2.subtitle'),
      short: t('flow.step2.short'), shortRefs: [1, 10],
      outputLabel: t('flow.step2.output'),
      params: [
        { icon: Thermometer, label: t('flow.step2.p1'), value: '300–900°C',  color: '#f59e0b' },
        { icon: Clock,       label: t('flow.step2.p2'), value: '10–300 min', color: '#ef4444' },
        { icon: Flame,       label: t('flow.step2.p3'), value: '26–35%',     color: '#22c55e' },
      ],
      detail: {
        body: t('flow.step2.body'), refs: [1, 6, 10, 12],
        stats: [
          { label: t('flow.step2.c1'), value: '300–900°C', color: '#f59e0b' },
          { label: t('flow.step2.c2'), value: '26–35%',    color: '#ef4444' },
          { label: t('flow.step2.c3'), value: '60–90%',    color: '#22c55e' },
        ],
      },
    },
    {
      id: 3, icon: Sparkles, color: '#8b5cf6',
      bg: 'from-purple-50 to-white dark:from-purple-950/40 dark:to-slate-900', border: 'border-purple-200 dark:border-purple-800/40', glow: 'shadow-purple-500/10',
      label: t('flow.step3.label'), subtitle: t('flow.step3.subtitle'),
      short: t('flow.step3.short'), shortRefs: [7, 12],
      outputLabel: t('flow.step3.output'),
      params: [
        { icon: Sparkles,    label: t('flow.step3.p1'), value: '3,157 m²/g', color: '#8b5cf6' },
        { icon: Layers,      label: t('flow.step3.p2'), value: 'KOH',         color: '#06b6d4' },
        { icon: Thermometer, label: t('flow.step3.p3'), value: '600–900°C',   color: '#f59e0b' },
      ],
      detail: {
        body: t('flow.step3.body'), refs: [7, 10, 12],
        stats: [
          { label: t('flow.step3.c1'), value: '3,157 m²/g',  color: '#8b5cf6' },
          { label: t('flow.step3.c2'), value: 'KOH',          color: '#06b6d4' },
          { label: t('flow.step3.c3'), value: '1.554 cm³/g',  color: '#f59e0b' },
        ],
      },
    },
    {
      id: 4, icon: Wind, color: '#06b6d4',
      bg: 'from-cyan-50 to-white dark:from-cyan-950/40 dark:to-slate-900', border: 'border-cyan-200 dark:border-cyan-800/40', glow: 'shadow-cyan-500/10',
      label: t('flow.step4.label'), subtitle: t('flow.step4.subtitle'),
      short: t('flow.step4.short'), shortRefs: [3, 12],
      outputLabel: null,
      params: [
        { icon: Wind,  label: t('flow.step4.p1'), value: '7.5 mmol/g',   color: '#06b6d4' },
        { icon: Globe, label: t('flow.step4.p2'), value: '2.5 t CO₂/t',  color: '#22c55e' },
        { icon: Clock, label: t('flow.step4.p3'), value: '100–1000 yr',  color: '#a855f7' },
      ],
      detail: {
        body: t('flow.step4.body'), refs: [1, 2, 3, 4, 11, 12],
        stats: [
          { label: t('flow.step4.c1'), value: '7.5 mmol/g',  color: '#06b6d4' },
          { label: t('flow.step4.c2'), value: '2.5 t CO₂/t', color: '#22c55e' },
          { label: t('flow.step4.c3'), value: '100–1000 yr', color: '#a855f7' },
        ],
      },
    },
  ];

  // Material transformation chain nodes — fully translated
  const CHAIN = [
    { dot: '🌾', label: t('flow.chain.n1'), sub: t('flow.chain.n1sub'), color: '#22c55e' },
    { dot: '🔥', label: t('flow.chain.n2'), sub: t('flow.chain.n2sub'), color: '#f59e0b' },
    { dot: '⬛', label: t('flow.chain.n3'), sub: t('flow.chain.n3sub'), color: '#94a3b8' },
    { dot: '⚗️', label: t('flow.chain.n4'), sub: t('flow.chain.n4sub'), color: '#8b5cf6' },
    { dot: '🔬', label: t('flow.chain.n5'), sub: t('flow.chain.n5sub'), color: '#8b5cf6' },
    { dot: '🌍', label: t('flow.chain.n6'), sub: t('flow.chain.n6sub'), color: '#06b6d4' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'linear-gradient(rgba(20,184,166,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.05) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-green-200/30 dark:bg-green-900/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[300px] bg-cyan-200/25 dark:bg-cyan-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-300 mb-5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-700 text-sm font-medium">{t('flow.badge')}</span>
          </div>
          <h2 className="font-space font-bold text-3xl lg:text-5xl text-foreground mb-4 leading-tight">
            {t('flow.heading.from')}{' '}
            <span className="text-gradient-green">{t('flow.heading.highlight1')}</span>
            <br />{t('flow.heading.to')}{' '}
            <span className="text-cyan-600">{t('flow.heading.highlight2')}</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed">
            {t('flow.heading.desc')}
          </p>
        </motion.div>

        {/* Flow cards */}
        <div className="flex flex-col lg:flex-row items-stretch gap-0 mb-12">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex lg:flex-row flex-col items-center flex-1 gap-0">

              <motion.button
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActive(step)}
                className={`group relative w-full flex-1 rounded-2xl border bg-gradient-to-br ${step.bg} ${step.border} p-5 text-left cursor-pointer transition-all shadow-xl ${step.glow} hover:shadow-2xl`}
              >
                {/* Top accent */}
                <div className="absolute top-0 left-4 right-4 h-px rounded-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${step.color}80, transparent)` }} />

                {/* Step badge + icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border"
                    style={{ color: step.color, borderColor: step.color + '40', background: step.color + '12' }}>
                    {t('flow.stepBadge', { id: step.id })}
                  </span>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center border"
                    style={{ background: `${step.color}15`, borderColor: `${step.color}35` }}>
                    <step.icon className="w-[18px] h-[18px]" style={{ color: step.color }} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-space font-bold text-foreground text-sm lg:text-base mb-0.5 leading-tight">
                  {step.label}
                </h3>
                <p className="text-[11px] font-semibold mb-4" style={{ color: step.color }}>
                  {step.subtitle}
                </p>

                {/* Inline parameters */}
                <div className="space-y-2 mb-4">
                  {step.params.map(p => (
                    <div key={p.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <p.icon className="w-3 h-3 flex-shrink-0" style={{ color: p.color + 'cc' }} />
                        <span className="text-[10px] text-muted-foreground font-medium">{p.label}</span>
                      </div>
                      <span className="text-[10px] font-bold" style={{ color: p.color }}>{p.value}</span>
                    </div>
                  ))}
                </div>

                {/* Short description */}
                <p className="text-muted-foreground text-[10px] leading-relaxed line-clamp-2 mb-4">
                  {step.short}
                  {step.shortRefs && <Cite ids={step.shortRefs} />}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: step.color }}>
                  {t('flow.stepExplore')}
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              {/* Connector arrow */}
              {i < STEPS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.25 }}
                  className="flex-shrink-0 flex flex-col items-center justify-center px-2 py-4 lg:py-0"
                >
                  <div className="hidden lg:flex flex-col items-center gap-1">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-center leading-tight"
                      style={{ color: STEPS[i].color + '80', maxWidth: 56 }}>
                      {step.outputLabel}
                    </p>
                    <div className="flex items-center">
                      <div className="w-5 h-px"
                        style={{ background: `linear-gradient(to right, ${STEPS[i].color}60, ${STEPS[i + 1].color}60)` }} />
                      <div className="w-0 h-0"
                        style={{ borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: `6px solid ${STEPS[i + 1].color}80` }} />
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground lg:hidden rotate-90" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Material transformation timeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-border bg-card/80 p-5"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 text-center">
            {t('flow.chain.title')}
          </p>
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            {CHAIN.map((node, i) => (
              <div key={node.label} className="flex items-center gap-2 flex-shrink-0">
                <div className="flex flex-col items-center text-center" style={{ minWidth: 72 }}>
                  <div className="text-base mb-1">{node.dot}</div>
                  <p className="text-[10px] font-bold text-foreground leading-tight">{node.label}</p>
                  <p className="text-[9px] text-muted-foreground leading-tight mt-0.5 max-w-[80px]">{node.sub}</p>
                </div>
                {i < CHAIN.length - 1 && (
                  <div className="flex items-center flex-shrink-0">
                    <div className="w-5 h-px bg-border" />
                    <div className="w-0 h-0 border-t-[3px] border-b-[3px] border-l-[5px] border-transparent border-l-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Modal */}
      <AnimatePresence>
        {active && <StepModal step={active} onClose={() => setActive(null)} t={t} />}
      </AnimatePresence>
    </section>
  );
}
