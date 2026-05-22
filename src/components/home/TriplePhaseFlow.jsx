// @ts-nocheck
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Layers, BarChart3, ArrowRight, X, Zap,
  FlaskConical, Activity, ChevronRight,
  Database, Brain, Target, Sparkles,
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
        className="relative glass-modal rounded-3xl max-w-lg w-full p-8 z-10 shadow-2xl border overflow-hidden"
        style={{ borderColor: `${tool.color}40` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 inset-x-0 h-1 rounded-t-3xl"
          style={{ background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)` }} />
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-white" />
        </button>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0"
            style={{ background: `${tool.color}20`, borderColor: `${tool.color}40` }}>
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
        <p className="text-slate-300 text-sm leading-relaxed mb-5">{tool.detail}</p>
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
      color: '#d97706',
      gradFrom: '#f59e0b', gradTo: '#b45309',
      ring: 'rgba(245,158,11,0.35)',
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
      color: '#16a34a',
      gradFrom: '#22c55e', gradTo: '#15803d',
      ring: 'rgba(34,197,94,0.35)',
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
      color: '#7c3aed',
      gradFrom: '#8b5cf6', gradTo: '#6d28d9',
      ring: 'rgba(139,92,246,0.35)',
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
    <section className="py-24 relative overflow-hidden"
      style={{ background: 'var(--flow-section-bg)' }}>

      {/* ── Background layers ── */}
      <div className="absolute inset-0 opacity-30"
        style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.07) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 65%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-card border border-purple-200 dark:border-purple-900/50 shadow-sm shadow-purple-100 dark:shadow-purple-900/20 mb-6">
            <Activity className="w-4 h-4 text-purple-500 animate-pulse" />
            <span className="text-purple-700 text-sm font-semibold tracking-wide">{t('tp.badge')}</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <h2 className="font-space font-black text-4xl lg:text-5xl text-foreground mb-4 leading-tight">
            {t('tp.heading1')}<br />
            <span className="text-gradient-green">{t('tp.heading2')}</span>
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('tp.desc')}
          </p>
        </motion.div>

        {/* ── Tool cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 mb-10">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.13 }}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col rounded-3xl overflow-hidden cursor-pointer bg-card"
              style={{
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                border: `1.5px solid ${tool.color}20`,
              }}
              onClick={() => setActive(tool)}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 20px 60px ${tool.ring}, 0 4px 24px rgba(0,0,0,0.08)`;
                e.currentTarget.style.borderColor = `${tool.color}50`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = `${tool.color}20`;
              }}
            >
              {/* ── Colored header zone ── */}
              <div className="relative h-44 flex flex-col justify-between p-6 overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${tool.gradFrom} 0%, ${tool.gradTo} 100%)` }}>

                {/* Big watermark number */}
                <div className="absolute -right-2 -top-3 font-space font-black text-[7rem] leading-none select-none pointer-events-none"
                  style={{ color: 'rgba(255,255,255,0.12)' }}>
                  {String(tool.id).padStart(2, '0')}
                </div>

                {/* Subtle inner glow */}
                <div className="absolute inset-0 opacity-30"
                  style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.4) 0%, transparent 60%)' }} />

                {/* Tag row */}
                <div className="relative flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-[0.22em] bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full border border-white/25">
                    {tool.tag}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <tool.icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Title block */}
                <div className="relative">
                  <h3 className="font-space font-black text-white text-2xl leading-tight mb-1">
                    {tool.label}
                  </h3>
                  <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">
                    {tool.subtitle}
                  </p>
                </div>
              </div>

              {/* ── White body ── */}
              <div className="flex flex-col flex-1 p-6">

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {tool.stats.map(s => (
                    <div key={s.label} className="rounded-xl p-3 text-center border"
                      style={{ borderColor: `${tool.color}18`, background: `${tool.color}07` }}>
                      <p className="font-space font-black text-sm leading-tight mb-0.5" style={{ color: tool.color }}>
                        {s.val}
                      </p>
                      <p className="text-[8px] text-muted-foreground font-semibold uppercase tracking-wide leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-xs leading-relaxed mb-5 flex-1 line-clamp-3">
                  {tool.detail}
                </p>

                {/* IO pills */}
                <div className="space-y-2 mb-5">
                  {[
                    { label: t('tp.inputLabel'),  items: tool.ins,  isInput: true },
                    { label: t('tp.outputLabel'), items: tool.outs, isInput: false },
                  ].map(row => (
                    <div key={row.label} className="flex items-start gap-2.5">
                      <span className="text-[8px] font-black uppercase tracking-widest pt-0.5 w-12 shrink-0"
                        style={{ color: row.isInput ? tool.color : '#94a3b8' }}>
                        {row.label}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {row.items.map(item => (
                          <span key={item}
                            className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                              row.isInput
                                ? ''
                                : 'text-muted-foreground border-border bg-muted'
                            }`}
                            style={row.isInput
                              ? { color: tool.color, borderColor: tool.color + '35', background: tool.color + '0d' }
                              : {}}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA footer */}
                <div className="flex items-center justify-between pt-4"
                  style={{ borderTop: `1px solid ${tool.color}15` }}>
                  <span className="text-[10px] font-bold flex items-center gap-1 transition-all"
                    style={{ color: tool.color }}>
                    {t('tp.explorePhase')}
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <Link
                    to={tool.path}
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all hover:scale-105 text-white"
                    style={{ background: `linear-gradient(135deg, ${tool.gradFrom}, ${tool.gradTo})`, borderColor: 'transparent', boxShadow: `0 2px 12px ${tool.color}40` }}
                  >
                    <Zap className="w-3 h-3" /> {t('tp.launch')}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Step connector ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          {TOOLS.map((tool, i) => (
            <div key={tool.id} className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold"
                style={{ color: tool.color, borderColor: `${tool.color}30`, background: `${tool.color}08` }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: tool.color }} />
                {String(tool.id).padStart(2, '0')} {tool.label}
              </div>
              {i < TOOLS.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50" />
              )}
            </div>
          ))}
          <span className="text-muted-foreground text-[10px] ml-2">— {t('tp.workflow')}</span>
        </motion.div>

        {/* ── Quick-launch strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {TOOLS.map(tool => (
            <Link
              key={tool.id}
              to={tool.path}
              className="group flex items-center gap-3.5 px-5 py-4 rounded-2xl bg-card border hover:shadow-lg transition-all duration-200"
              style={{
                borderColor: `${tool.color}25`,
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 32px ${tool.ring}`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
                style={{ background: `${tool.color}12`, borderColor: `${tool.color}30` }}>
                <tool.icon className="w-[18px] h-[18px]" style={{ color: tool.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-space font-bold text-sm text-foreground truncate">{tool.label}</p>
                <p className="text-muted-foreground text-[10px] truncate">{tool.subtitle}</p>
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
