// @ts-nocheck
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Layers, BarChart3, FlaskConical, ArrowRight,
  TrendingUp, Leaf, GitCompare, Sparkles, Tag,
} from 'lucide-react';

export default function UseCaseScenarios() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const SCENARIOS = [
    {
      num:      '01',
      icon:     TrendingUp,
      emoji:    '📈',
      color:    '#8b5cf6',
      colorHex: 'purple',
      toolIcon: FlaskConical,
      tool:     t('usecase.s1.tool'),
      toolPath: '/advisor',
      q:        t('usecase.s1.q'),
      title:    t('usecase.s1.title'),
      desc:     t('usecase.s1.desc'),
      tags:     [t('usecase.s1.tag1'), t('usecase.s1.tag2')],
      prefill:  { targetCO2: 6.5, biomass: 'All', autoRun: true },
      accent:   'from-violet-500 to-purple-600',
      cardBg:   'bg-violet-50 dark:bg-violet-950/30',
      border:   'border-violet-200 dark:border-violet-500/20',
      tagStyle: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-500/25',
      btnStyle: 'from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-violet-500/25',
    },
    {
      num:      '02',
      icon:     Leaf,
      emoji:    '🌾',
      color:    '#22c55e',
      colorHex: 'green',
      toolIcon: BarChart3,
      tool:     t('usecase.s2.tool'),
      toolPath: '/predictor',
      q:        t('usecase.s2.q'),
      title:    t('usecase.s2.title'),
      desc:     t('usecase.s2.desc'),
      tags:     [t('usecase.s2.tag1'), t('usecase.s2.tag2')],
      prefill:  { biomass: 'Sugarcane bagasse', activator: 'KOH', temperature: 800, residenceTime: 60, heatingRate: 10 },
      accent:   'from-green-500 to-emerald-600',
      cardBg:   'bg-green-50 dark:bg-green-950/30',
      border:   'border-green-200 dark:border-green-500/20',
      tagStyle: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/25',
      btnStyle: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-green-500/25',
    },
    {
      num:      '03',
      icon:     GitCompare,
      emoji:    '⚗️',
      color:    '#f59e0b',
      colorHex: 'amber',
      toolIcon: Layers,
      tool:     t('usecase.s3.tool'),
      toolPath: '/database',
      q:        t('usecase.s3.q'),
      title:    t('usecase.s3.title'),
      desc:     t('usecase.s3.desc'),
      tags:     [t('usecase.s3.tag1'), t('usecase.s3.tag2')],
      prefill:  { scrollTo: 'heatmap' },
      accent:   'from-amber-400 to-orange-500',
      cardBg:   'bg-amber-50 dark:bg-amber-950/30',
      border:   'border-amber-200 dark:border-amber-500/20',
      tagStyle: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/25',
      btnStyle: 'from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-amber-500/25',
    },
  ];

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Soft decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-green-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-5">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span className="text-violet-600 dark:text-violet-300 text-sm font-semibold">{t('usecase.badge')}</span>
          </div>
          <h2 className="font-space font-black text-4xl lg:text-5xl mb-4 text-foreground">
            {t('usecase.heading')}
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
            {t('usecase.desc')}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SCENARIOS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-background"
              style={{ borderColor: s.color + '30' }}
            >
              {/* Coloured top bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${s.accent}`} />

              <div className="flex flex-col flex-1 p-6">

                {/* Number + icon row */}
                <div className="flex items-start justify-between mb-5">
                  <span className="font-space font-black text-5xl leading-none"
                    style={{ color: s.color + '22' }}>
                    {s.num}
                  </span>
                  <div className="flex items-center gap-2">
                    {/* Tool icon */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border"
                      style={{ background: s.color + '12', borderColor: s.color + '30' }}>
                      <s.toolIcon className="w-5 h-5" style={{ color: s.color }} />
                    </div>
                    {/* Scenario icon */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: s.color + '10' }}>
                      <span className="text-xl">{s.emoji}</span>
                    </div>
                  </div>
                </div>

                {/* Question */}
                <p className="text-sm text-muted-foreground italic leading-relaxed mb-3">
                  "{s.q}"
                </p>

                {/* Title */}
                <h3 className="font-space font-bold text-xl text-foreground leading-tight mb-3">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                  {s.desc}
                </p>

                {/* Pre-fill chips */}
                <div className="mb-5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2 flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" /> {t('usecase.prefilled')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.tags.map(tag => (
                      <span key={tag}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${s.tagStyle}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tool label */}
                <div className="flex items-center gap-1.5 mb-4">
                  <s.toolIcon className="w-3.5 h-3.5" style={{ color: s.color }} />
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: s.color }}>
                    {s.tool}
                  </span>
                </div>

                {/* CTA button */}
                <button
                  onClick={() => navigate(s.toolPath, { state: { prefill: s.prefill } })}
                  className={`w-full py-3 rounded-2xl bg-gradient-to-r ${s.btnStyle} text-white font-space font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]`}
                >
                  {t('usecase.cta')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
