// @ts-nocheck
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Layers, BarChart3, ArrowRight, X, Zap,
  FlaskConical, Activity, ChevronRight,
  Database, Brain, Target,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ── Modal ─────────────────────────────────────────────────────
function ToolModal({ tool, onClose, t }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: 'spring', stiffness: 270, damping: 24 }}
        className="relative glass-dark rounded-3xl max-w-lg w-full p-8 z-10 shadow-2xl border overflow-hidden"
        style={{ borderColor: `${tool.color}40` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top glow bar */}
        <div className="absolute top-0 inset-x-0 h-1 rounded-t-3xl"
          style={{ background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }} />

        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0"
            style={{ background: `${tool.color}18`, borderColor: `${tool.color}40` }}>
            <tool.icon className="w-7 h-7" style={{ color: tool.color }} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: tool.color }}>
              {tool.tag}
            </p>
            <h3 className="font-space font-bold text-xl text-white leading-tight">{tool.label}</h3>
            <p className="text-slate-400 text-sm">{tool.subtitle}</p>
          </div>
        </div>

        {/* Detail text */}
        <p className="text-slate-300 text-sm leading-relaxed mb-5">{tool.detail}</p>

        {/* IO grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { title: t('tp.inputLabel'), items: tool.ins, color: tool.color },
            { title: t('tp.outputLabel'), items: tool.outs, color: '#94a3b8' },
          ].map(col => (
            <div key={col.title} className="rounded-xl p-3 border border-white/10 bg-white/5">
              <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: col.color }}>
                {col.title}
              </p>
              {col.items.map(item => (
                <p key={item} className="text-slate-300 text-xs leading-relaxed">· {item}</p>
              ))}
            </div>
          ))}
        </div>

        <Link to={tool.path} onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-space font-bold text-sm border transition-all hover:scale-[1.02]"
          style={{ background: `${tool.color}20`, borderColor: `${tool.color}50`, color: tool.color }}>
          <Zap className="w-4 h-4" /> {t('tp.launch')} — {tool.label}
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function TriplePhaseFlow() {
  const { t } = useTranslation();
  const [active, setActive] = useState(null);

  const TOOLS = [
    {
      id: 1, path: '/property-estimator',
      icon: FlaskConical, tag: 'Tool 01 · Property',
      color: '#f59e0b', ring: 'rgba(245,158,11,0.18)',
      bg: 'from-amber-950/70 via-amber-900/20 to-transparent',
      border: 'border-amber-500/25',
      label: t('tp.tool1.label'),
      subtitle: t('tp.tool1.desc'),
      detail: t('tp.step1.detail'),
      stats: [
        { val: t('tp.tool1.stat1'), label: 'Data Records', icon: Database },
        { val: t('tp.tool1.stat2'), label: 'BET R²',       icon: Brain },
        { val: t('tp.tool1.stat3'), label: 'Feedstocks',   icon: Target },
      ],
      ins:  [t('tp.tool1.in1'), t('tp.tool1.in2')],
      outs: [t('tp.tool1.out1'), t('tp.tool1.out2')],
    },
    {
      id: 2, path: '/predictor',
      icon: BarChart3, tag: 'Tool 02 · CO₂',
      color: '#22c55e', ring: 'rgba(34,197,94,0.18)',
      bg: 'from-green-950/70 via-green-900/20 to-transparent',
      border: 'border-green-500/25',
      label: t('tp.tool3.label'),
      subtitle: t('tp.tool3.desc'),
      detail: t('tp.step3.detail'),
      stats: [
        { val: t('tp.tool3.stat1'), label: 'ML Models',    icon: Brain },
        { val: t('tp.tool3.stat2'), label: 'CO₂ Accuracy', icon: Target },
        { val: t('tp.tool3.stat3'), label: 'Prediction',   icon: Database },
      ],
      ins:  [t('tp.tool3.in1'), t('tp.tool3.in2')],
      outs: [t('tp.tool3.out1'), t('tp.tool3.out2')],
    },
    {
      id: 3, path: '/advisor',
      icon: Layers, tag: 'Tool 03 · Advisor',
      color: '#8b5cf6', ring: 'rgba(139,92,246,0.18)',
      bg: 'from-purple-950/70 via-purple-900/20 to-transparent',
      border: 'border-purple-500/25',
      label: t('tp.tool2.label'),
      subtitle: t('tp.tool2.desc'),
      detail: t('tp.step2.detail'),
      stats: [
        { val: t('tp.tool2.stat1'), label: 'Method',       icon: Target },
        { val: t('tp.tool2.stat2'), label: 'Activators',   icon: Database },
        { val: t('tp.tool2.stat3'), label: 'Validation',   icon: Brain },
      ],
      ins:  [t('tp.tool2.in1'), t('tp.tool2.in2')],
      outs: [t('tp.tool2.out1'), t('tp.tool2.out2')],
    },
  ];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '56px 56px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-purple-300 text-sm font-semibold tracking-wide">{t('tp.badge')}</span>
          </div>
          <h2 className="font-space font-black text-4xl lg:text-5xl text-white mb-4 leading-tight">
            {t('tp.heading1')}<br />
            <span className="text-gradient-green">{t('tp.heading2')}</span>
          </h2>
          <p className="text-slate-400 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('tp.desc')}
          </p>
        </motion.div>

        {/* Tool cards — 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -6, scale: 1.015 }}
              className="group relative flex flex-col rounded-3xl border overflow-hidden cursor-pointer transition-all duration-300"
              style={{ borderColor: `${tool.color}30` }}
              onClick={() => setActive(tool)}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 24px 64px ${tool.ring}`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              {/* Card background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.bg}`} />
              <div className="absolute inset-0 bg-slate-900/60" />

              {/* Top accent bar */}
              <div className="absolute top-0 inset-x-0 h-0.5"
                style={{ background: `linear-gradient(90deg, transparent, ${tool.color}cc, transparent)` }} />

              <div className="relative flex flex-col h-full p-6">
                {/* Tool tag */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border"
                    style={{ color: tool.color, borderColor: tool.color + '40', background: tool.color + '10' }}>
                    {tool.tag}
                  </span>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center border"
                    style={{ background: tool.color + '12', borderColor: tool.color + '30' }}>
                    <tool.icon className="w-[18px] h-[18px]" style={{ color: tool.color }} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-space font-bold text-white text-xl leading-tight mb-1">
                  {tool.label}
                </h3>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-5" style={{ color: tool.color }}>
                  {tool.subtitle}
                </p>

                {/* Key metrics */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {tool.stats.map(s => (
                    <div key={s.label} className="rounded-xl p-2.5 text-center border border-white/8 bg-white/[0.04]">
                      <p className="font-space font-bold text-xs leading-tight mb-0.5" style={{ color: tool.color }}>
                        {s.val}
                      </p>
                      <p className="text-[9px] text-slate-500 leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p className="text-slate-400 text-xs leading-relaxed mb-5 flex-1 line-clamp-3">
                  {tool.detail}
                </p>

                {/* IO pills */}
                <div className="space-y-2.5 mb-5">
                  {[
                    { label: t('tp.inputLabel'),  items: tool.ins,  color: tool.color },
                    { label: t('tp.outputLabel'), items: tool.outs, color: '#64748b' },
                  ].map(row => (
                    <div key={row.label} className="flex items-start gap-2">
                      <span className="text-[8px] font-black uppercase tracking-widest pt-0.5 w-12 shrink-0" style={{ color: row.color }}>
                        {row.label}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {row.items.map(item => (
                          <span key={item}
                            className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md border"
                            style={row.color === tool.color
                              ? { color: tool.color, borderColor: tool.color + '40', background: tool.color + '10' }
                              : { color: '#94a3b8', borderColor: '#ffffff15', background: '#ffffff08' }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA row */}
                <div className="flex items-center justify-between pt-4 border-t border-white/8">
                  <span className="text-[10px] font-bold flex items-center gap-1 transition-all" style={{ color: tool.color }}>
                    {t('tp.explorePhase')}
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <Link
                    to={tool.path}
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all hover:scale-105"
                    style={{ color: tool.color, borderColor: tool.color + '50', background: tool.color + '12' }}
                  >
                    <Zap className="w-3 h-3" /> {t('tp.launch')}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Workflow note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mb-10"
        >
          <p className="text-slate-500 text-sm">
            <span className="inline-block w-8 h-px bg-slate-700 align-middle mr-2" />
            {t('tp.workflow')}
            <span className="inline-block w-8 h-px bg-slate-700 align-middle ml-2" />
          </p>
        </motion.div>

        {/* Quick-launch strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {TOOLS.map(tool => (
            <Link
              key={tool.id}
              to={tool.path}
              className="group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl border glass-dark hover:scale-[1.02] transition-all duration-200"
              style={{ borderColor: `${tool.color}25` }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0"
                style={{ background: `${tool.color}12`, borderColor: `${tool.color}30` }}>
                <tool.icon className="w-4.5 h-4.5 w-[18px] h-[18px]" style={{ color: tool.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-space font-bold text-sm text-white truncate">{tool.label}</p>
                <p className="text-slate-500 text-[10px] truncate">{tool.subtitle}</p>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: tool.color }} />
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {active && <ToolModal tool={active} t={t} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
