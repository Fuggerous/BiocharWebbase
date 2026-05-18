// @ts-nocheck
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf, Flame, Sparkles, Globe, X, ChevronRight,
  Thermometer, Clock, Layers, Wind, ArrowRight,
} from 'lucide-react';
import { Cite } from './ScientificReferences';
import { useTranslation } from 'react-i18next';

// ── Step modal (detail view) ──────────────────────────────────
function StepModal({ step, onClose }) {
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
        className="relative glass-dark rounded-3xl border max-w-lg w-full p-8 z-10 shadow-2xl"
        style={{ borderColor: `${step.color}50` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow accent */}
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
              Step {step.id} of 4
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

// ── Connector arrow ───────────────────────────────────────────
function FlowArrow({ label, color }) {
  return (
    <div className="flex-shrink-0 flex flex-col items-center gap-1 px-1 lg:px-0">
      <p className="text-[9px] font-bold uppercase tracking-widest hidden lg:block"
        style={{ color: color + 'aa' }}>{label}</p>
      <div className="flex items-center gap-0 lg:flex-row flex-col">
        <div className="h-px lg:h-px lg:w-8 w-px h-6 lg:w-8" style={{ background: `linear-gradient(to right, ${color}40, ${color}cc)` }} />
        <div className="hidden lg:block w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent"
          style={{ borderLeftColor: color + 'cc', borderTopWidth: 4, borderBottomWidth: 4, borderLeftWidth: 8 }} />
        <ArrowRight className="w-4 h-4 lg:hidden" style={{ color: color + 'cc' }} />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function BiocharFlow() {
  const { t } = useTranslation();
  const [active, setActive] = useState(null);

  const STEPS = [
    {
      id: 1,
      icon: Leaf,
      color: '#22c55e',
      bg: 'from-green-950/80 to-green-900/20',
      border: 'border-green-500/25',
      glow: 'shadow-green-500/10',
      label: t('flow.step1.label'),
      subtitle: t('flow.step1.subtitle'),
      short: t('flow.step1.short'),
      shortRefs: [8],
      outputLabel: 'Raw Biomass →',
      params: [
        { icon: Layers, label: 'Moisture', value: '< 15%', color: '#3b82f6' },
        { icon: Leaf,   label: 'C content', value: '35–55%', color: '#22c55e' },
        { icon: Globe,  label: 'Thailand supply', value: '60 Mt/yr', color: '#a855f7' },
      ],
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
      bg: 'from-amber-950/80 to-amber-900/20',
      border: 'border-amber-500/25',
      glow: 'shadow-amber-500/10',
      label: t('flow.step2.label'),
      subtitle: t('flow.step2.subtitle'),
      short: t('flow.step2.short'),
      shortRefs: [1, 10],
      outputLabel: 'Biochar →',
      params: [
        { icon: Thermometer, label: 'Temperature', value: '300–900°C', color: '#f59e0b' },
        { icon: Clock,       label: 'Residence time', value: '10–300 min', color: '#ef4444' },
        { icon: Flame,       label: 'Biochar yield', value: '26–35%', color: '#22c55e' },
      ],
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
      bg: 'from-purple-950/80 to-purple-900/20',
      border: 'border-purple-500/25',
      glow: 'shadow-purple-500/10',
      label: t('flow.step3.label'),
      subtitle: t('flow.step3.subtitle'),
      short: t('flow.step3.short'),
      shortRefs: [7, 12],
      outputLabel: 'Activated Biochar →',
      params: [
        { icon: Sparkles,    label: 'BET Surface Area', value: '3,157 m²/g', color: '#8b5cf6' },
        { icon: Layers,      label: 'Best Activator', value: 'KOH', color: '#06b6d4' },
        { icon: Thermometer, label: 'Act. Temp.', value: '600–900°C', color: '#f59e0b' },
      ],
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
      icon: Wind,
      color: '#06b6d4',
      bg: 'from-cyan-950/80 to-cyan-900/20',
      border: 'border-cyan-500/25',
      glow: 'shadow-cyan-500/10',
      label: t('flow.step4.label'),
      subtitle: t('flow.step4.subtitle'),
      short: t('flow.step4.short'),
      shortRefs: [3, 12],
      params: [
        { icon: Wind,    label: 'Peak CO₂ uptake', value: '7.5 mmol/g', color: '#06b6d4' },
        { icon: Globe,   label: 'Sequestration',   value: '2.5 t CO₂/t', color: '#22c55e' },
        { icon: Clock,   label: 'Carbon stability', value: '100–1000 yr', color: '#a855f7' },
      ],
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
      {/* Background grid + glows */}
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-5">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">{t('flow.badge')}</span>
          </div>
          <h2 className="font-space font-bold text-3xl lg:text-5xl text-white mb-4 leading-tight">
            From{' '}
            <span className="text-gradient-green">Agricultural Waste</span>
            <br />to <span className="text-cyan-400">Carbon Sink</span>
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
            A four-stage thermochemical conversion process transforms biomass residues into
            high-performance CO₂ adsorbents. Click any stage to explore the science.
          </p>
        </motion.div>

        {/* Flow chain */}
        <div className="flex flex-col lg:flex-row items-stretch gap-0 mb-12">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex lg:flex-row flex-col items-center flex-1 gap-0">

              {/* Card */}
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
                {/* Top accent line */}
                <div className="absolute top-0 left-4 right-4 h-px rounded-full"
                  style={{ background: `linear-gradient(90deg, transparent, ${step.color}80, transparent)` }} />

                {/* Step badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border"
                    style={{ color: step.color, borderColor: step.color + '40', background: step.color + '12' }}>
                    Step {step.id} / 4
                  </span>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center border"
                    style={{ background: `${step.color}15`, borderColor: `${step.color}35` }}>
                    <step.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" style={{ color: step.color }} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-space font-bold text-white text-sm lg:text-base mb-0.5 leading-tight">
                  {step.label}
                </h3>
                <p className="text-[11px] font-semibold mb-4" style={{ color: step.color }}>
                  {step.subtitle}
                </p>

                {/* Key parameters */}
                <div className="space-y-2 mb-4">
                  {step.params.map(p => (
                    <div key={p.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <p.icon className="w-3 h-3 flex-shrink-0" style={{ color: p.color + 'cc' }} />
                        <span className="text-[10px] text-slate-400 font-medium">{p.label}</span>
                      </div>
                      <span className="text-[10px] font-bold" style={{ color: p.color }}>{p.value}</span>
                    </div>
                  ))}
                </div>

                {/* Short description */}
                <p className="text-slate-500 text-[10px] leading-relaxed line-clamp-2 mb-4">
                  {step.short}
                  {step.shortRefs && <Cite ids={step.shortRefs} />}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-1 text-[10px] font-semibold transition-all"
                  style={{ color: step.color }}>
                  {t('flow.stepExplore')}
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.25 }}
                  className="flex-shrink-0 flex flex-col items-center justify-center px-2 py-4 lg:py-0"
                >
                  <div className="hidden lg:flex flex-col items-center gap-1">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-center leading-tight"
                      style={{ color: STEPS[i].color + '80', maxWidth: 52 }}>
                      {step.outputLabel}
                    </p>
                    <div className="flex items-center">
                      <div className="w-6 h-px" style={{ background: `linear-gradient(to right, ${STEPS[i].color}60, ${STEPS[i + 1].color}60)` }} />
                      <div className="w-0 h-0"
                        style={{
                          borderTop: '4px solid transparent',
                          borderBottom: '4px solid transparent',
                          borderLeft: `6px solid ${STEPS[i + 1].color}80`,
                        }} />
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-700 lg:hidden rotate-90" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Material transformation timeline bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/8 bg-white/[0.03] p-5"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 text-center">
            Material Transformation Chain
          </p>
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            {[
              { label: 'Biomass', sublabel: 'Rice husk · Corn straw · Sugarcane', color: '#22c55e', dot: '🌾' },
              { label: 'Pyrolysis', sublabel: '300–900°C · Limited O₂', color: '#f59e0b', dot: '🔥' },
              { label: 'Raw Biochar', sublabel: 'Porous carbon matrix', color: '#94a3b8', dot: '⬛' },
              { label: 'Activation', sublabel: 'KOH · K₂CO₃ · CO₂ gas', color: '#8b5cf6', dot: '⚗️' },
              { label: 'Activated Biochar', sublabel: 'BET up to 3,157 m²/g', color: '#8b5cf6', dot: '🔬' },
              { label: 'CO₂ Capture', sublabel: 'Up to 7.5 mmol/g · 100–1000 yr', color: '#06b6d4', dot: '🌍' },
            ].map((node, i, arr) => (
              <div key={node.label} className="flex items-center gap-2 flex-shrink-0">
                <div className="flex flex-col items-center text-center" style={{ minWidth: 72 }}>
                  <div className="text-base mb-1">{node.dot}</div>
                  <p className="text-[10px] font-bold text-white leading-tight">{node.label}</p>
                  <p className="text-[9px] text-slate-500 leading-tight mt-0.5 max-w-[80px]">{node.sublabel}</p>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex items-center gap-0 flex-shrink-0">
                    <div className="w-6 h-px bg-slate-700" />
                    <div className="w-0 h-0 border-t-[3px] border-b-[3px] border-l-[5px] border-transparent border-l-slate-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Modal */}
      <AnimatePresence>
        {active && <StepModal step={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
